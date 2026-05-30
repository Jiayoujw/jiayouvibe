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
 * Fetch trending AI repositories.
 */
export async function fetchTrendingRepos(
  options?: FetchTrendingOptions,
): Promise<GitHubRepo[]> {
  const { language, since, perPage = 30 } = options ?? {}
  const parts: string[] = ['topic:artificial-intelligence']

  if (language) {
    parts.push(`language:${language}`)
  }

  if (since) {
    parts.push(`pushed:>${since}`)
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
    q: 'ai+tutorial in:name,description',
    sort: 'stars',
    order: 'desc',
    per_page: '30',
  })

  return cachedFetch(params)
}
