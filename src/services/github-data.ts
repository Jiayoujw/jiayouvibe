import type { GitHubRepo } from '@/types'
import {
  GITHUB_API_URL,
  GITHUB_CACHE_TTL,
} from '@/utils/constants'

// ── Cache helpers ─────────────────────────────────────────────────

interface DataCache<T> {
  data: T
  timestamp: number
}

const CACHE_PREFIX = 'jiayouvibe_gh_data_'

function loadCache<T>(cacheKey: string): DataCache<T> | null {
  try {
    const raw = localStorage.getItem(cacheKey)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DataCache<T>
    if (parsed && typeof parsed.timestamp === 'number' && parsed.data !== undefined) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

function saveCache<T>(cacheKey: string, data: T): void {
  try {
    const cache: DataCache<T> = { data, timestamp: Date.now() }
    localStorage.setItem(cacheKey, JSON.stringify(cache))
  } catch (e) {
    console.warn('[GitHub Data] Failed to persist cache:', e)
  }
}

function isCacheFresh(cache: DataCache<unknown>): boolean {
  return Date.now() - cache.timestamp < GITHUB_CACHE_TTL
}

// ── Repo mapper ───────────────────────────────────────────────────

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

// ── Rate limit / retry with exponential backoff ───────────────────

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options)

      // 403 Rate limited — back off and retry
      if (res.status === 403) {
        const retryAfter = res.headers.get('Retry-After')
        const delay = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : Math.min(1000 * Math.pow(2, attempt), 30000) // exponential, max 30s

        console.warn(
          `[GitHub Data] Rate limited (403). Attempt ${attempt + 1}/${maxRetries + 1}. ` +
          `Retrying in ${delay}ms...`
        )

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }

        throw new Error(
          'GitHub API rate limit exceeded after multiple retries. ' +
          'No cached data available. Please wait a few minutes and try again.'
        )
      }

      // 429 Too Many Requests — same backoff strategy
      if (res.status === 429) {
        const retryAfter = res.headers.get('Retry-After')
        const delay = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : Math.min(2000 * Math.pow(2, attempt), 60000)

        console.warn(
          `[GitHub Data] Too many requests (429). Attempt ${attempt + 1}/${maxRetries + 1}. ` +
          `Retrying in ${delay}ms...`
        )

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }

        throw new Error(
          'GitHub API returned too many requests (429) after multiple retries. ' +
          'No cached data available. Please wait a minute and try again.'
        )
      }

      if (!res.ok) {
        throw new Error(
          `GitHub API responded with ${res.status} ${res.statusText} ` +
          `for ${url}. Please check the request parameters and try again.`
        )
      }

      return res
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e))

      // Only retry on network errors or rate limits (403/429 already handled above)
      if (attempt < maxRetries && isNetworkError(lastError)) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
        console.warn(
          `[GitHub Data] Network error on attempt ${attempt + 1}/${maxRetries + 1}: ` +
          `${lastError.message}. Retrying in ${delay}ms...`
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      // Don't retry non-retryable errors
      if (attempt < maxRetries && lastError.message.includes('Rate limit')) {
        continue // already handled above, but fallthrough safety
      }
      break
    }
  }

  throw lastError ?? new Error('GitHub API request failed for unknown reason')
}

function isNetworkError(error: Error): boolean {
  const msg = error.message.toLowerCase()
  return (
    msg.includes('network') ||
    msg.includes('fetch') ||
    msg.includes('timeout') ||
    msg.includes('abort') ||
    msg.includes('dns') ||
    msg.includes('connection') ||
    msg.includes('econnrefused') ||
    msg.includes('enotfound')
  )
}

// ── Core GitHub search with caching ───────────────────────────────

async function searchGitHub(
  query: string,
  sort: 'stars' | 'updated' | 'forks' = 'stars',
  order: 'desc' | 'asc' = 'desc',
  perPage = 30,
  cacheKey: string,
): Promise<GitHubRepo[]> {
  // Check cache first
  const cache = loadCache<GitHubRepo[]>(cacheKey)
  if (cache && isCacheFresh(cache)) {
    // Background refresh
    searchGitHubRaw(query, sort, order, perPage)
      .then((data) => saveCache(cacheKey, data))
      .catch(() => {})
    return cache.data
  }

  try {
    const data = await searchGitHubRaw(query, sort, order, perPage)
    saveCache(cacheKey, data)
    return data
  } catch (e) {
    console.error(`[GitHub Data] Search failed for query "${query}":`, e)

    // Fall back to stale cache
    if (cache) {
      console.warn('[GitHub Data] Returning stale cache due to fetch failure.')
      return cache.data
    }

    throw e
  }
}

async function searchGitHubRaw(
  query: string,
  sort: 'stars' | 'updated' | 'forks' = 'stars',
  order: 'desc' | 'asc' = 'desc',
  perPage = 30,
): Promise<GitHubRepo[]> {
  const params = new URLSearchParams({
    q: query,
    sort,
    order,
    per_page: String(perPage),
  })

  const url = `${GITHUB_API_URL}?${params.toString()}`

  const res = await fetchWithRetry(url, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  })

  const json = (await res.json()) as { items?: Record<string, unknown>[] }
  const items = json.items ?? []
  return items.map(mapRepo)
}

// ── Static fallback data ──────────────────────────────────────────

const FALLBACK_AI_TOOLS: GitHubRepo[] = [
  {
    id: 9001, name: 'langchain', fullName: 'langchain-ai/langchain',
    owner: 'langchain-ai', ownerAvatar: '',
    description: 'Build context-aware reasoning applications with LangChain',
    url: 'https://github.com/langchain-ai/langchain',
    stars: 102000, forks: 16500, language: 'Python',
    topics: ['llm', 'framework', 'agent', 'rag'],
    updatedAt: '2025-05-28',
  },
  {
    id: 9002, name: 'AutoGPT', fullName: 'Significant-Gravitas/AutoGPT',
    owner: 'Significant-Gravitas', ownerAvatar: '',
    description: 'Autonomous AI agent for task automation',
    url: 'https://github.com/Significant-Gravitas/AutoGPT',
    stars: 172000, forks: 45000, language: 'Python',
    topics: ['agent', 'llm', 'autonomous'],
    updatedAt: '2025-05-30',
  },
  {
    id: 9003, name: 'transformers', fullName: 'huggingface/transformers',
    owner: 'huggingface', ownerAvatar: '',
    description: 'State-of-the-art Machine Learning for PyTorch, TensorFlow, and JAX',
    url: 'https://github.com/huggingface/transformers',
    stars: 138000, forks: 27500, language: 'Python',
    topics: ['nlp', 'transformers', 'pytorch', 'llm'],
    updatedAt: '2025-05-29',
  },
  {
    id: 9004, name: 'ollama', fullName: 'ollama/ollama',
    owner: 'ollama', ownerAvatar: '',
    description: 'Get up and running with Llama 3, Mistral, Gemma, and other LLMs locally',
    url: 'https://github.com/ollama/ollama',
    stars: 105000, forks: 8300, language: 'Go',
    topics: ['llm', 'local-ai', 'inference'],
    updatedAt: '2025-05-30',
  },
  {
    id: 9005, name: 'dify', fullName: 'langgenius/dify',
    owner: 'langgenius', ownerAvatar: '',
    description: 'An open-source LLM app development platform with RAG and Agent capabilities',
    url: 'https://github.com/langgenius/dify',
    stars: 63000, forks: 9200, language: 'TypeScript',
    topics: ['llm', 'platform', 'rag', 'agent'],
    updatedAt: '2025-05-28',
  },
  {
    id: 9006, name: 'llama_index', fullName: 'run-llama/llama_index',
    owner: 'run-llama', ownerAvatar: '',
    description: 'Data framework for LLM applications — connect custom data sources to LLMs',
    url: 'https://github.com/run-llama/llama_index',
    stars: 38000, forks: 5500, language: 'Python',
    topics: ['rag', 'llm', 'vector-database', 'data'],
    updatedAt: '2025-05-27',
  },
  {
    id: 9007, name: 'chroma', fullName: 'chroma-core/chroma',
    owner: 'chroma-core', ownerAvatar: '',
    description: 'The AI-native open-source embedding database',
    url: 'https://github.com/chroma-core/chroma',
    stars: 17000, forks: 1500, language: 'Python',
    topics: ['vector-database', 'embeddings', 'rag'],
    updatedAt: '2025-05-26',
  },
  {
    id: 9008, name: 'quivr', fullName: 'QuivrHQ/quivr',
    owner: 'QuivrHQ', ownerAvatar: '',
    description: 'Open-source RAG framework — your second brain',
    url: 'https://github.com/QuivrHQ/quivr',
    stars: 37000, forks: 5800, language: 'TypeScript',
    topics: ['rag', 'llm', 'knowledge-base'],
    updatedAt: '2025-05-25',
  },
  {
    id: 9009, name: 'promptfoo', fullName: 'promptfoo/promptfoo',
    owner: 'promptfoo', ownerAvatar: '',
    description: 'Test your prompts, models, and RAGs. Evaluate and compare LLM outputs.',
    url: 'https://github.com/promptfoo/promptfoo',
    stars: 6000, forks: 400, language: 'TypeScript',
    topics: ['prompt-engineering', 'llm', 'testing'],
    updatedAt: '2025-05-29',
  },
  {
    id: 9010, name: 'axolotl', fullName: 'OpenAccess-AI-Collective/axolotl',
    owner: 'OpenAccess-AI-Collective', ownerAvatar: '',
    description: 'Go-to library for fine-tuning LLMs — supports LoRA, QLoRA, and full fine-tuning',
    url: 'https://github.com/OpenAccess-AI-Collective/axolotl',
    stars: 8500, forks: 1100, language: 'Python',
    topics: ['fine-tuning', 'llm', 'lora'],
    updatedAt: '2025-05-28',
  },
]

const FALLBACK_REPOS_BY_TOPIC: Record<string, GitHubRepo[]> = {
  llm: FALLBACK_AI_TOOLS.filter((r) => r.topics.includes('llm')),
  rag: FALLBACK_AI_TOOLS.filter((r) => r.topics.includes('rag')),
  agent: FALLBACK_AI_TOOLS.filter((r) => r.topics.includes('agent')),
  'prompt-engineering': FALLBACK_AI_TOOLS.filter((r) => r.topics.includes('prompt-engineering')),
  'vector-database': FALLBACK_AI_TOOLS.filter((r) => r.topics.includes('vector-database')),
  'fine-tuning': FALLBACK_AI_TOOLS.filter((r) => r.topics.includes('fine-tuning')),
}

function getFallbackForTopic(topic: string): GitHubRepo[] {
  return FALLBACK_REPOS_BY_TOPIC[topic] ?? FALLBACK_AI_TOOLS.slice(0, 5)
}

const FALLBACK_REPOS_GENERAL: GitHubRepo[] = FALLBACK_AI_TOOLS.slice(0, 10)

const FALLBACK_AWESOME_LISTS: { name: string; url: string; description: string }[] = [
  {
    name: 'Awesome LLM',
    url: 'https://github.com/Hannibal046/Awesome-LLM',
    description: 'A curated list of Large Language Model papers, frameworks, tools, and resources',
  },
  {
    name: 'Awesome ChatGPT Prompts',
    url: 'https://github.com/f/awesome-chatgpt-prompts',
    description: 'A collection of prompt examples to be used with the ChatGPT model',
  },
  {
    name: 'Awesome Machine Learning',
    url: 'https://github.com/josephmisiti/awesome-machine-learning',
    description: 'A curated list of awesome Machine Learning frameworks, libraries and software',
  },
  {
    name: 'Awesome LangChain',
    url: 'https://github.com/kyrolabs/awesome-langchain',
    description: 'Awesome list of tools and projects with the LangChain framework',
  },
  {
    name: 'Awesome AI Agents',
    url: 'https://github.com/e2b-dev/awesome-ai-agents',
    description: 'A list of AI autonomous agents and agent frameworks',
  },
  {
    name: 'Awesome RAG',
    url: 'https://github.com/srbhr/awesome-rag',
    description: 'Curated list of RAG (Retrieval Augmented Generation) resources and tools',
  },
]

const FALLBACK_README = `# Project

*No README available offline.* The README content could not be fetched from GitHub at this time.

## Description

This is a fallback README shown when the GitHub API is unavailable or rate-limited. Please try again later.`

// ── Public API ────────────────────────────────────────────────────

/**
 * Fetch repositories matching a specific GitHub topic tag.
 * Uses the `topic:<name>` qualifier which is the correct GitHub search syntax.
 *
 * @param topic - The GitHub topic to search for (e.g., "llm", "rag", "agent")
 * @returns Promise resolving to an array of GitHubRepo objects
 */
export async function fetchReposByTopic(topic: string): Promise<GitHubRepo[]> {
  const sanitizedTopic = topic.trim().toLowerCase().replace(/\s+/g, '-')
  if (!sanitizedTopic) {
    console.warn('[GitHub Data] fetchReposByTopic called with empty topic')
    return FALLBACK_REPOS_GENERAL
  }

  const cacheKey = `${CACHE_PREFIX}topic_${sanitizedTopic}`
  // Valid GitHub syntax: "topic:llm" — no spaces, no special chars
  const query = `topic:${sanitizedTopic}`

  try {
    return await searchGitHub(query, 'stars', 'desc', 30, cacheKey)
  } catch (e) {
    console.warn(
      `[GitHub Data] fetchReposByTopic("${topic}") failed, using fallback:`,
      (e as Error).message,
    )
    return getFallbackForTopic(sanitizedTopic)
  }
}

/**
 * Fetch all repositories belonging to a GitHub organization.
 * Uses the `org:<name>` qualifier.
 *
 * @param org - The GitHub organization name (e.g., "langchain-ai", "microsoft")
 * @returns Promise resolving to an array of GitHubRepo objects
 */
export async function fetchReposByOrg(org: string): Promise<GitHubRepo[]> {
  const sanitizedOrg = org.trim()
  if (!sanitizedOrg) {
    console.warn('[GitHub Data] fetchReposByOrg called with empty org')
    return FALLBACK_REPOS_GENERAL
  }

  const cacheKey = `${CACHE_PREFIX}org_${sanitizedOrg.toLowerCase()}`
  // Valid GitHub syntax: "org:langchain-ai"
  const query = `org:${sanitizedOrg}`

  try {
    return await searchGitHub(query, 'stars', 'desc', 50, cacheKey)
  } catch (e) {
    console.warn(
      `[GitHub Data] fetchReposByOrg("${org}") failed, using fallback:`,
      (e as Error).message,
    )
    return FALLBACK_REPOS_GENERAL
  }
}

/**
 * Fetch repositories trending this week.
 * Searches for repos with stars > 100 created in the last 7 days.
 *
 * @returns Promise resolving to an array of trending GitHubRepo objects
 */
export async function fetchTrendingWeekly(): Promise<GitHubRepo[]> {
  const cacheKey = `${CACHE_PREFIX}trending_weekly`
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const dateStr = sevenDaysAgo.toISOString().split('T')[0] // YYYY-MM-DD

  // Valid GitHub syntax: stars:>100 created:>2025-05-23 ai OR llm OR agent
  const query = `stars:>100 created:>${dateStr} ai OR llm OR agent OR rag`

  try {
    return await searchGitHub(query, 'stars', 'desc', 30, cacheKey)
  } catch (e) {
    console.warn(
      '[GitHub Data] fetchTrendingWeekly failed, using fallback:',
      (e as Error).message,
    )
    return FALLBACK_REPOS_GENERAL
  }
}

/**
 * Fetch repositories trending today (last 24 hours).
 * Searches for repos with stars > 50 created in the last day.
 *
 * @returns Promise resolving to an array of trending GitHubRepo objects
 */
export async function fetchTrendingDaily(): Promise<GitHubRepo[]> {
  const cacheKey = `${CACHE_PREFIX}trending_daily`
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const dateStr = yesterday.toISOString().split('T')[0]

  // Valid GitHub syntax with lower star threshold for daily trends
  const query = `stars:>50 created:>${dateStr} ai OR llm OR agent OR rag`

  try {
    return await searchGitHub(query, 'stars', 'desc', 15, cacheKey)
  } catch (e) {
    console.warn(
      '[GitHub Data] fetchTrendingDaily failed, using fallback:',
      (e as Error).message,
    )
    return FALLBACK_REPOS_GENERAL.slice(0, 5)
  }
}

/**
 * Fetch AI tools by searching across 6 specific AI-related topics.
 * Makes parallel requests for each topic, then deduplicates by repo ID.
 * Topics: llm, rag, agent, prompt-engineering, vector-database, fine-tuning
 *
 * @returns Promise resolving to a deduplicated array of AI tool GitHubRepo objects
 */
export async function fetchAITools(): Promise<GitHubRepo[]> {
  const cacheKey = `${CACHE_PREFIX}ai_tools`
  const aiTopics = [
    'llm',
    'rag',
    'agent',
    'prompt-engineering',
    'vector-database',
    'fine-tuning',
  ]

  // Check cache first
  const cache = loadCache<GitHubRepo[]>(cacheKey)
  if (cache && isCacheFresh(cache)) {
    // Background refresh
    fetchAIToolsRaw(aiTopics)
      .then((data) => saveCache(cacheKey, data))
      .catch(() => {})
    return cache.data
  }

  try {
    const data = await fetchAIToolsRaw(aiTopics)
    saveCache(cacheKey, data)
    return data
  } catch (e) {
    console.warn(
      '[GitHub Data] fetchAITools failed, using fallback:',
      (e as Error).message,
    )
    if (cache) return cache.data
    return FALLBACK_AI_TOOLS
  }
}

async function fetchAIToolsRaw(topics: string[]): Promise<GitHubRepo[]> {
  // Search each topic in parallel, with per-topic fallback on individual failure
  const resultsPerTopic = await Promise.all(
    topics.map(async (topic) => {
      try {
        // Valid GitHub syntax: "topic:llm stars:>50"
        const query = `topic:${topic} stars:>50`
        const params = new URLSearchParams({
          q: query,
          sort: 'stars',
          order: 'desc',
          per_page: '15',
        })
        const url = `${GITHUB_API_URL}?${params.toString()}`
        const res = await fetchWithRetry(url, {
          headers: { Accept: 'application/vnd.github.v3+json' },
        })
        const json = (await res.json()) as { items?: Record<string, unknown>[] }
        return (json.items ?? []).map(mapRepo)
      } catch (e) {
        console.warn(
          `[GitHub Data] Topic search for "${topic}" failed, using topic fallback:`,
          (e as Error).message,
        )
        return getFallbackForTopic(topic)
      }
    }),
  )

  // Deduplicate by repo id, preserving the highest-starred entry
  const seen = new Map<number, GitHubRepo>()
  for (const repos of resultsPerTopic) {
    for (const repo of repos) {
      const existing = seen.get(repo.id)
      if (!existing || repo.stars > existing.stars) {
        seen.set(repo.id, repo)
      }
    }
  }

  // Sort by stars descending and limit to top 50
  return Array.from(seen.values())
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 50)
}

/**
 * Fetch and parse awesome-list repositories.
 * Searches for repos with "awesome" in their name or description.
 *
 * @returns Promise resolving to an array of {name, url, description} objects
 */
export async function fetchAwesomeLists(): Promise<
  { name: string; url: string; description: string }[]
> {
  const cacheKey = `${CACHE_PREFIX}awesome_lists`

  // Check cache first
  const cache = loadCache<{ name: string; url: string; description: string }[]>(cacheKey)
  if (cache && isCacheFresh(cache)) {
    // Background refresh
    fetchAwesomeListsRaw()
      .then((data) => saveCache(cacheKey, data))
      .catch(() => {})
    return cache.data
  }

  try {
    const data = await fetchAwesomeListsRaw()
    saveCache(cacheKey, data)
    return data
  } catch (e) {
    console.warn(
      '[GitHub Data] fetchAwesomeLists failed, using fallback:',
      (e as Error).message,
    )
    if (cache) return cache.data
    return FALLBACK_AWESOME_LISTS
  }
}

async function fetchAwesomeListsRaw(): Promise<
  { name: string; url: string; description: string }[]
> {
  // Valid GitHub syntax: search for "awesome" in repo name with ai/ml topics
  const query = 'awesome ai OR llm OR machine-learning OR rag OR agent in:name'
  const params = new URLSearchParams({
    q: query,
    sort: 'stars',
    order: 'desc',
    per_page: '30',
  })

  const url = `${GITHUB_API_URL}?${params.toString()}`
  const res = await fetchWithRetry(url, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  })

  const json = (await res.json()) as { items?: Record<string, unknown>[] }
  const items = json.items ?? []

  return items.map((raw) => ({
    name: (raw.name as string) ?? '',
    url: (raw.html_url as string) ?? '',
    description: (raw.description as string) ?? '',
  }))
}

/**
 * Fetch the README content for a specific GitHub repository.
 * Uses the GitHub Contents API to retrieve the README file.
 *
 * @param owner - Repository owner (user or organization)
 * @param repo - Repository name
 * @returns Promise resolving to the README content as a string
 */
export async function fetchRepoReadme(
  owner: string,
  repo: string,
): Promise<string> {
  const sanitizedOwner = owner.trim()
  const sanitizedRepo = repo.trim()

  if (!sanitizedOwner || !sanitizedRepo) {
    console.warn('[GitHub Data] fetchRepoReadme called with empty owner or repo')
    return FALLBACK_README
  }

  const cacheKey = `${CACHE_PREFIX}readme_${sanitizedOwner}_${sanitizedRepo}`

  // Check cache first
  const cache = loadCache<string>(cacheKey)
  if (cache && isCacheFresh(cache)) {
    // Background refresh
    fetchReadmeRaw(sanitizedOwner, sanitizedRepo)
      .then((data) => saveCache(cacheKey, data))
      .catch(() => {})
    return cache.data
  }

  try {
    const data = await fetchReadmeRaw(sanitizedOwner, sanitizedRepo)
    saveCache(cacheKey, data)
    return data
  } catch (e) {
    console.warn(
      `[GitHub Data] fetchRepoReadme("${owner}/${repo}") failed, using fallback:`,
      (e as Error).message,
    )
    if (cache) return cache.data
    return FALLBACK_README
  }
}

async function fetchReadmeRaw(owner: string, repo: string): Promise<string> {
  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`

  const res = await fetchWithRetry(url, {
    headers: {
      Accept: 'application/vnd.github.v3.raw', // Return raw markdown, not base64 JSON
    },
  })

  return await res.text()
}

/**
 * Get the timestamp of the last successful data refresh for a given cache key.
 * Returns null if no cache entry exists.
 */
export function getLastRefreshTimestamp(cacheKeySuffix: string): number | null {
  const cache = loadCache<unknown>(`${CACHE_PREFIX}${cacheKeySuffix}`)
  return cache?.timestamp ?? null
}

/**
 * Invalidate a specific cache entry, forcing the next call to fetch fresh data.
 */
export function invalidateCache(cacheKeySuffix: string): void {
  try {
    localStorage.removeItem(`${CACHE_PREFIX}${cacheKeySuffix}`)
  } catch (e) {
    console.warn('[GitHub Data] Failed to invalidate cache:', e)
  }
}

/**
 * Invalidate all GitHub data caches, forcing fresh fetches on next call.
 */
export function invalidateAllCaches(): void {
  try {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))
    console.log(`[GitHub Data] Invalidated ${keysToRemove.length} cache entries.`)
  } catch (e) {
    console.warn('[GitHub Data] Failed to invalidate all caches:', e)
  }
}
