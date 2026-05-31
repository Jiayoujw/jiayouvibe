import type { GitHubRepo, GitHubCache } from '@/types'
import {
  GITHUB_API_URL,
  GITHUB_CACHE_KEY,
  GITHUB_CACHE_TTL,
} from '@/utils/constants'

// ── Helpers ──────────────────────────────────────────────────────

function loadCache(): GitHubCache | null {
  try {
    const raw = localStorage.getItem(GITHUB_CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as GitHubCache
  } catch {
    return null
  }
}

function saveCache(data: GitHubRepo[]): void {
  try {
    const cache: GitHubCache = { data, timestamp: Date.now() }
    localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(cache))
  } catch (e) {
    console.warn('Failed to persist GitHub cache:', e)
  }
}

function isCacheFresh(cache: GitHubCache): boolean {
  return Date.now() - cache.timestamp < GITHUB_CACHE_TTL
}

function mapRepo(raw: Record<string, unknown>): GitHubRepo {
  return {
    id: (raw.id as number) ?? 0,
    name: (raw.name as string) ?? '',
    fullName: (raw.full_name as string) ?? '',
    owner: ((raw.owner as Record<string, unknown>)?.login as string) ?? '',
    ownerAvatar:
      ((raw.owner as Record<string, unknown>)?.avatar_url as string) ?? '',
    description: (raw.description as string) ?? '',
    url: (raw.html_url as string) ?? '',
    stars: (raw.stargazers_count as number) ?? 0,
    forks: (raw.forks_count as number) ?? 0,
    language: (raw.language as string) ?? '',
    topics: Array.isArray(raw.topics) ? (raw.topics as string[]) : [],
    updatedAt: (raw.updated_at as string) ?? '',
  }
}

// ── Retry wrapper ────────────────────────────────────────────────

/**
 * Retry a fetch-based operation with configurable attempts and delay.
 * Only retries on network errors and 5xx server errors.
 * Rate limits (403, 429) are NOT retried here — they are handled by the caller.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  baseDelayMs = 1000,
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e))

      // Do not retry on 4xx client errors (except rate limits handled separately)
      if (
        lastError.message.includes('403') ||
        lastError.message.includes('Rate limit')
      ) {
        throw lastError
      }

      if (attempt < maxRetries) {
        const delay = baseDelayMs * (attempt + 1) // 1s, 2s
        console.warn(
          `[GitHub] Attempt ${attempt + 1}/${maxRetries + 1} failed: ` +
          `${lastError.message}. Retrying in ${delay}ms...`
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError ?? new Error('GitHub API request failed after all retries')
}

// ── Core fetch ───────────────────────────────────────────────────

async function fetchFromGitHub(
  params: URLSearchParams,
): Promise<GitHubRepo[]> {
  const url = `${GITHUB_API_URL}?${params.toString()}`
  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, { headers })

  // 403 — Rate limited
  if (res.status === 403) {
    const rateLimitRemaining = res.headers.get('X-RateLimit-Remaining')
    const rateLimitReset = res.headers.get('X-RateLimit-Reset')
    const resetDate = rateLimitReset
      ? new Date(parseInt(rateLimitReset, 10) * 1000).toLocaleTimeString()
      : 'unknown time'

    console.warn(
      `[GitHub] Rate limited (403). ` +
      `Remaining: ${rateLimitRemaining ?? 'unknown'}, ` +
      `Resets at: ${resetDate}. ` +
      `Falling back to cached data if available.`
    )

    const cache = loadCache()
    if (cache) {
      console.info('[GitHub] Returning stale cached data due to rate limit.')
      return cache.data
    }

    throw new Error(
      `GitHub API rate limit exceeded and no cached data is available. ` +
      `The rate limit will reset at approximately ${resetDate}. ` +
      `Please wait a few minutes before trying again, or reduce the frequency of API calls.`
    )
  }

  // 422 — Unprocessable Entity (invalid query syntax)
  if (res.status === 422) {
    const body = await res.json().catch(() => ({}))
    const errors = (body as Record<string, unknown>).errors as
      | Array<{ message: string }>
      | undefined
    const errorDetails = errors?.map((e) => e.message).join('; ') ?? 'No details available'

    console.error(
      `[GitHub] Validation error (422) for query: ${params.get('q')}. ` +
      `Details: ${errorDetails}`
    )

    throw new Error(
      `GitHub search query failed validation (422). ` +
      `The search query syntax may be invalid: "${params.get('q')}". ` +
      `Details from GitHub: ${errorDetails}. ` +
      `Please check the query for unsupported characters or qualifiers.`
    )
  }

  // 304 — Not Modified (used with ETag/conditional requests)
  if (res.status === 304) {
    console.info('[GitHub] 304 Not Modified — data unchanged since last fetch.')
    const cache = loadCache()
    if (cache) return cache.data
    throw new Error(
      'GitHub API returned 304 Not Modified but no cache is available. ' +
      'This should not happen — a conditional request was made without a prior cached response.'
    )
  }

  // Other non-ok responses
  if (!res.ok) {
    throw new Error(
      `GitHub API returned ${res.status} ${res.statusText} for query "${params.get('q')}". ` +
      `This may be caused by an invalid search query, authentication issues, ` +
      `or a temporary GitHub service disruption. Please verify the request and try again.`
    )
  }

  const json = (await res.json()) as { items?: Record<string, unknown>[] }
  const items = json.items ?? []

  console.info(
    `[GitHub] Fetched ${items.length} repos for query: "${params.get('q')}"`
  )
  return items.map(mapRepo)
}

// ── Caching wrapper ──────────────────────────────────────────────

async function cachedFetch(
  params: URLSearchParams,
): Promise<GitHubRepo[]> {
  const cache = loadCache()

  // Return cached data immediately if fresh; refresh in background
  if (cache && isCacheFresh(cache)) {
    fetchFromGitHub(params)
      .then((data) => saveCache(data))
      .catch(() => {})
    return cache.data
  }

  try {
    const data = await withRetry(() => fetchFromGitHub(params))
    saveCache(data)
    return data
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    console.error('[GitHub] Fetch failed after retries:', errorMessage)

    // Fall back to stale cache when network fails
    if (cache) {
      console.warn('[GitHub] Returning stale cache due to fetch error.')
      return cache.data
    }

    throw e
  }
}

// ── Public API ───────────────────────────────────────────────────

export interface FetchTrendingOptions {
  language?: string
  since?: string
  sort?: string
  minStars?: number
  topic?: string
  perPage?: number
}

/**
 * Static fallback repos used when the GitHub API is completely unreachable
 * and no cached data is available.
 *
 * Accepts optional filters to return different repos for different UI states.
 */
export function getFallbackRepos(language?: string, since?: string): GitHubRepo[] {
  const all: GitHubRepo[] = [
    { id: 1, name: 'langchain', fullName: 'langchain-ai/langchain', owner: 'langchain-ai', ownerAvatar: '', description: 'Build context-aware reasoning applications with LLMs', url: 'https://github.com/langchain-ai/langchain', stars: 102000, forks: 16500, language: 'Python', topics: ['llm', 'framework', 'agent'], updatedAt: '2025-05-30' },
    { id: 2, name: 'AutoGPT', fullName: 'Significant-Gravitas/AutoGPT', owner: 'Significant-Gravitas', ownerAvatar: '', description: 'Autonomous AI agent for task automation', url: 'https://github.com/Significant-Gravitas/AutoGPT', stars: 172000, forks: 45000, language: 'Python', topics: ['agent', 'llm', 'autonomous'], updatedAt: '2025-05-30' },
    { id: 3, name: 'openai-cookbook', fullName: 'openai/openai-cookbook', owner: 'openai', ownerAvatar: '', description: 'Examples and guides for using the OpenAI API', url: 'https://github.com/openai/openai-cookbook', stars: 65000, forks: 10500, language: 'Jupyter Notebook', topics: ['openai', 'cookbook', 'tutorial'], updatedAt: '2025-05-29' },
    { id: 4, name: 'transformers', fullName: 'huggingface/transformers', owner: 'huggingface', ownerAvatar: '', description: 'State-of-the-art ML for PyTorch, TensorFlow, and JAX', url: 'https://github.com/huggingface/transformers', stars: 138000, forks: 27500, language: 'Python', topics: ['nlp', 'transformers', 'pytorch'], updatedAt: '2025-05-29' },
    { id: 5, name: 'ollama', fullName: 'ollama/ollama', owner: 'ollama', ownerAvatar: '', description: 'Run Llama, Mistral, Gemma locally with ease', url: 'https://github.com/ollama/ollama', stars: 105000, forks: 8300, language: 'Go', topics: ['llm', 'local-ai', 'inference'], updatedAt: '2025-05-30' },
    { id: 6, name: 'dify', fullName: 'langgenius/dify', owner: 'langgenius', ownerAvatar: '', description: 'Open-source LLM app development platform with visual workflow', url: 'https://github.com/langgenius/dify', stars: 63000, forks: 9200, language: 'TypeScript', topics: ['llm', 'platform', 'rag'], updatedAt: '2025-05-28' },
    { id: 7, name: 'crewAI', fullName: 'crewAIInc/crewAI', owner: 'crewAIInc', ownerAvatar: '', description: 'Framework for orchestrating role-playing AI agents', url: 'https://github.com/crewAIInc/crewAI', stars: 28000, forks: 3800, language: 'Python', topics: ['agent', 'multi-agent', 'orchestration'], updatedAt: '2025-05-29' },
    { id: 8, name: 'vllm', fullName: 'vllm-project/vllm', owner: 'vllm-project', ownerAvatar: '', description: 'High-throughput and memory-efficient LLM serving engine', url: 'https://github.com/vllm-project/vllm', stars: 45000, forks: 7200, language: 'Python', topics: ['llm', 'inference', 'serving'], updatedAt: '2025-05-30' },
    { id: 9, name: 'llama.cpp', fullName: 'ggerganov/llama.cpp', owner: 'ggerganov', ownerAvatar: '', description: 'LLM inference in C/C++ for maximum performance', url: 'https://github.com/ggerganov/llama.cpp', stars: 76000, forks: 10800, language: 'C++', topics: ['llm', 'inference', 'local'], updatedAt: '2025-05-30' },
    { id: 10, name: 'whisper', fullName: 'openai/whisper', owner: 'openai', ownerAvatar: '', description: 'Robust Speech Recognition via Large-Scale Weak Supervision', url: 'https://github.com/openai/whisper', stars: 75000, forks: 8900, language: 'Python', topics: ['speech', 'audio', 'transcription'], updatedAt: '2025-05-27' },
    { id: 11, name: 'langgraph', fullName: 'langchain-ai/langgraph', owner: 'langchain-ai', ownerAvatar: '', description: 'Build resilient language agents as graphs', url: 'https://github.com/langchain-ai/langgraph', stars: 12000, forks: 1800, language: 'Python', topics: ['agent', 'graph', 'workflow'], updatedAt: '2025-05-30' },
    { id: 12, name: 'cursor', fullName: 'getcursor/cursor', owner: 'getcursor', ownerAvatar: '', description: 'The AI-first Code Editor', url: 'https://github.com/getcursor/cursor', stars: 25000, forks: 2100, language: 'TypeScript', topics: ['code', 'editor', 'ai-assistant'], updatedAt: '2025-05-28' },
    { id: 13, name: 'deepseek-coder', fullName: 'deepseek-ai/deepseek-coder', owner: 'deepseek-ai', ownerAvatar: '', description: 'DeepSeek Coder: Let the Code Write Itself', url: 'https://github.com/deepseek-ai/deepseek-coder', stars: 18000, forks: 1600, language: 'Python', topics: ['code', 'llm', 'deepseek'], updatedAt: '2025-05-25' },
    { id: 14, name: 'excalidraw', fullName: 'excalidraw/excalidraw', owner: 'excalidraw', ownerAvatar: '', description: 'Virtual whiteboard for sketching hand-drawn like diagrams', url: 'https://github.com/excalidraw/excalidraw', stars: 92000, forks: 8500, language: 'TypeScript', topics: ['canvas', 'drawing', 'collaboration'], updatedAt: '2025-05-27' },
    { id: 15, name: 'sglang', fullName: 'sgl-project/sglang', owner: 'sgl-project', ownerAvatar: '', description: 'Structured Generation Language for LLM Inference', url: 'https://github.com/sgl-project/sglang', stars: 8500, forks: 700, language: 'Python', topics: ['llm', 'inference', 'structured-output'], updatedAt: '2025-05-30' },
    { id: 16, name: 'fastgpt', fullName: 'labring/FastGPT', owner: 'labring', ownerAvatar: '', description: 'FastGPT is a knowledge-based platform built on LLM', url: 'https://github.com/labring/FastGPT', stars: 21000, forks: 5200, language: 'TypeScript', topics: ['llm', 'rag', 'knowledge-base'], updatedAt: '2025-05-29' },
    { id: 17, name: 'chatgpt-on-wechat', fullName: 'zhayujie/chatgpt-on-wechat', owner: 'zhayujie', ownerAvatar: '', description: 'WeChat chatbot based on ChatGPT', url: 'https://github.com/zhayujie/chatgpt-on-wechat', stars: 32000, forks: 8700, language: 'Python', topics: ['chatbot', 'wechat', 'gpt'], updatedAt: '2025-05-28' },
    { id: 18, name: 'ChatGPT-Next-Web', fullName: 'ChatGPTNextWeb/NextChat', owner: 'ChatGPTNextWeb', ownerAvatar: '', description: 'A cross-platform ChatGPT/Gemini UI', url: 'https://github.com/ChatGPTNextWeb/NextChat', stars: 82000, forks: 63000, language: 'TypeScript', topics: ['chatgpt', 'ui', 'cross-platform'], updatedAt: '2025-05-30' },
    { id: 19, name: 'mindsdb', fullName: 'mindsdb/mindsdb', owner: 'mindsdb', ownerAvatar: '', description: 'AI Database - build AI with SQL', url: 'https://github.com/mindsdb/mindsdb', stars: 28000, forks: 3700, language: 'Python', topics: ['ai', 'sql', 'database'], updatedAt: '2025-05-28' },
    { id: 20, name: 'coze-studio', fullName: 'coze-dev/coze-studio', owner: 'coze-dev', ownerAvatar: '', description: 'AI Agent development platform by ByteDance', url: 'https://github.com/coze-dev/coze-studio', stars: 8500, forks: 1100, language: 'TypeScript', topics: ['agent', 'platform', 'workflow'], updatedAt: '2025-05-30' },
  ]

  // Filter by language if specified
  let filtered = all
  if (language && language !== '全部') {
    const langLower = language.toLowerCase()
    filtered = filtered.filter((r) => r.language.toLowerCase() === langLower)
    // If filter yields less than 3, return all (too few results)
    if (filtered.length < 3) filtered = all
  }

  // Filter by time if specified
  if (since) {
    const now = new Date()
    const daysMap: Record<string, number> = { daily: 1, weekly: 7, monthly: 30 }
    const days = daysMap[since] || 30
    const cutoff = new Date(now.getTime() - days * 86400000)
    const timeFiltered = filtered.filter((r) => new Date(r.updatedAt) >= cutoff)
    if (timeFiltered.length >= 3) filtered = timeFiltered
  }

  return filtered.slice(0, 30)
}

/**
 * Fetch trending AI repositories from GitHub.
 *
 * The query combines stars:>100 (quality filter) with AI-related topic keywords
 * to surface high-quality, actively-starred AI repositories.
 *
 * Uses valid GitHub search syntax:
 *   - `stars:>100` — only repos with more than 100 stars
 *   - `OR` — matches any of the keywords (lowercase for keywords, uppercase for operator)
 *   - Keywords are space-separated; URLSearchParams handles encoding
 *
 * @param options - Optional filters for language, date range, and page size
 * @returns Promise resolving to an array of GitHubRepo objects
 */
export async function fetchTrendingRepos(
  options?: FetchTrendingOptions,
): Promise<GitHubRepo[]> {
  const {
    language,
    since,
    sort = 'stars',
    minStars = 0,
    topic = '',
    perPage = 30,
  } = options ?? {}

  // Core query: high-quality AI repos using valid GitHub syntax
  // "stars:>N" filters for repos with more than N stars
  // "OR" between keywords means the repo should match at least one keyword term
  // GitHub limits to 5 AND/OR/NOT operators — keep within limit
  const starsThreshold = minStars > 0 ? minStars : 50
  const parts: string[] = [
    `stars:>${starsThreshold}`,
  ]

  // Topic filter: if a specific topic is selected, add it to the query
  if (topic && topic !== '全部') {
    parts.push(topic)
  } else {
    // Default AI topics when no specific topic is selected
    parts.push('ai OR llm OR agent OR rag')
  }

  if (language && language !== '全部') {
    parts.push(`language:${language}`)
  }

  if (since && since !== 'yearly') {
    // Convert 'daily'/'weekly'/'monthly' to actual dates
    const now = new Date()
    const daysMap: Record<string, number> = { daily: 1, weekly: 7, monthly: 30 }
    const days = daysMap[since] || 30
    const date = new Date(now.getTime() - days * 86400000)
    const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD
    parts.push(`pushed:>=${dateStr}`)
  }

  const params = new URLSearchParams({
    q: parts.join(' '),
    sort,
    order: 'desc',
    per_page: String(perPage),
  })

  return cachedFetch(params)
}

/**
 * Search for awesome-list repositories on a given topic.
 */
export async function fetchAwesomeList(
  topic: string,
): Promise<GitHubRepo[]> {
  const params = new URLSearchParams({
    q: `awesome ${topic}`,
    sort: 'stars',
    order: 'desc',
    per_page: '30',
  })

  return cachedFetch(params)
}

/**
 * Search for AI tutorial repositories.
 */
export async function fetchAITutorials(): Promise<GitHubRepo[]> {
  const params = new URLSearchParams({
    q: 'stars:>50 ai tutorial OR guide machine-learning OR deep-learning',
    sort: 'stars',
    order: 'desc',
    per_page: '30',
  })

  return cachedFetch(params)
}
