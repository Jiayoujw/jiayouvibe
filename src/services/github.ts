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

// ── Core fetch ───────────────────────────────────────────────────

async function fetchFromGitHub(
  params: URLSearchParams,
): Promise<GitHubRepo[]> {
  const url = `${GITHUB_API_URL}?${params.toString()}`

  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  })

  if (res.status === 403) {
    console.warn('[GitHub] Rate limited (403). Returning stale cache if available.')
    const cache = loadCache()
    if (cache) return cache.data
    throw new Error('GitHub rate limit exceeded and no cache available.')
  }

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as { items?: Record<string, unknown>[] }
  const items = json.items ?? []
  return items.map(mapRepo)
}

// ── Caching wrapper ──────────────────────────────────────────────

async function cachedFetch(
  params: URLSearchParams,
): Promise<GitHubRepo[]> {
  const cache = loadCache()

  // Return cached data immediately if fresh
  if (cache && isCacheFresh(cache)) {
    // Refresh in background
    fetchFromGitHub(params)
      .then((data) => saveCache(data))
      .catch(() => {})
    return cache.data
  }

  try {
    const data = await fetchFromGitHub(params)
    saveCache(data)
    return data
  } catch (e) {
    console.error('[GitHub] Fetch failed:', e)

    // Fall back to stale cache when network fails
    if (cache) {
      console.warn('[GitHub] Returning stale cache due to network error.')
      return cache.data
    }

    throw e
  }
}

// ── Public API ───────────────────────────────────────────────────

export interface FetchTrendingOptions {
  language?: string
  since?: string
  perPage?: number
}

/**
 * Static fallback repos when API is unavailable.
 */
export function getFallbackRepos(): GitHubRepo[] {
  return [
    { id: 1, name: 'langchain', fullName: 'langchain-ai/langchain', owner: 'langchain-ai', ownerAvatar: '', description: '🦜🔗 Build context-aware reasoning applications', url: 'https://github.com/langchain-ai/langchain', stars: 102000, forks: 16500, language: 'Python', topics: ['llm', 'framework', 'agent'], updatedAt: '2025-05-28' },
    { id: 2, name: 'AutoGPT', fullName: 'Significant-Gravitas/AutoGPT', owner: 'Significant-Gravitas', ownerAvatar: '', description: 'Autonomous AI agent for task automation', url: 'https://github.com/Significant-Gravitas/AutoGPT', stars: 172000, forks: 45000, language: 'Python', topics: ['agent', 'llm', 'autonomous'], updatedAt: '2025-05-30' },
    { id: 3, name: 'openai-cookbook', fullName: 'openai/openai-cookbook', owner: 'openai', ownerAvatar: '', description: 'Examples and guides for using the OpenAI API', url: 'https://github.com/openai/openai-cookbook', stars: 65000, forks: 10500, language: 'Jupyter Notebook', topics: ['openai', 'cookbook', 'tutorial'], updatedAt: '2025-05-25' },
    { id: 4, name: 'transformers', fullName: 'huggingface/transformers', owner: 'huggingface', ownerAvatar: '', description: 'State-of-the-art ML for Pytorch, TensorFlow, and JAX', url: 'https://github.com/huggingface/transformers', stars: 138000, forks: 27500, language: 'Python', topics: ['nlp', 'transformers', 'pytorch'], updatedAt: '2025-05-29' },
    { id: 5, name: 'ollama', fullName: 'ollama/ollama', owner: 'ollama', ownerAvatar: '', description: 'Get up and running with Llama 3, Mistral, Gemma, and other LLMs locally', url: 'https://github.com/ollama/ollama', stars: 105000, forks: 8300, language: 'Go', topics: ['llm', 'local-ai', 'inference'], updatedAt: '2025-05-30' },
    { id: 6, name: 'dify', fullName: 'langgenius/dify', owner: 'langgenius', ownerAvatar: '', description: 'An open-source LLM app development platform', url: 'https://github.com/langgenius/dify', stars: 63000, forks: 9200, language: 'TypeScript', topics: ['llm', 'platform', 'rag'], updatedAt: '2025-05-28' },
  ]
}

/**
 * Fetch trending AI repositories.
 */
export async function fetchTrendingRepos(
  options?: FetchTrendingOptions,
): Promise<GitHubRepo[]> {
  const { language, since, perPage = 30 } = options ?? {}
  const parts: string[] = ['ai+OR+artificial-intelligence+OR+machine-learning']

  if (language && language !== '全部') {
    parts.push(`language:${language}`)
  }

  if (since) {
    parts.push(`created:>${since}`)
  }

  const params = new URLSearchParams({
    q: parts.join(' '),
    sort: 'stars',
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
    q: 'ai tutorial machine-learning deep-learning',
    sort: 'stars',
    order: 'desc',
    per_page: '30',
  })

  return cachedFetch(params)
}
