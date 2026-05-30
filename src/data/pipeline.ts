/**
 * GitHub Data Pipeline
 *
 * Orchestrates fetching, caching, and serving GitHub trending data.
 * Designed to be called from UI components that need fresh data with
 * graceful fallback to cached or static content.
 *
 * Architecture:
 *   refreshTrendingData() → fetches from APIs → saves to localStorage
 *   getCachedTrendingData() → reads from localStorage → falls back to static
 *   getLastUpdated*() → reads timestamp for UI display
 *
 * Cache structure (stored under localStorage key jiayouvibe_pipeline):
 *   {
 *     data: GitHubRepo[]       — deduplicated trending repos
 *     timestamp: number        — Unix ms when cache was written
 *     sources: string[]        — which data sources contributed
 *   }
 */

import type { GitHubRepo } from '@/types'
import type { GitHubCache } from '@/types'
import {
  fetchTrendingRepos,
  getFallbackRepos,
} from '@/services/github'
import {
  fetchTrendingWeekly,
  fetchTrendingDaily,
  fetchAITools,
} from '@/services/github-data'

// ── Constants ────────────────────────────────────────────────────

const PIPELINE_CACHE_KEY = 'jiayouvibe_pipeline'
const MAX_REPOS = 50 // Maximum repos to store in the combined cache

// ── Pipeline cache types ─────────────────────────────────────────

interface PipelineCacheEntry {
  data: GitHubRepo[]
  timestamp: number
  sources: string[]
}

// ── Cache read/write ─────────────────────────────────────────────

function readPipelineCache(): PipelineCacheEntry | null {
  try {
    const raw = localStorage.getItem(PIPELINE_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PipelineCacheEntry
    if (
      parsed &&
      Array.isArray(parsed.data) &&
      typeof parsed.timestamp === 'number'
    ) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

function writePipelineCache(entry: PipelineCacheEntry): void {
  try {
    localStorage.setItem(PIPELINE_CACHE_KEY, JSON.stringify(entry))
  } catch (e) {
    console.warn('[Pipeline] Failed to persist pipeline cache:', e)
  }
}

// ── Deduplication ────────────────────────────────────────────────

function deduplicateRepos(repos: GitHubRepo[]): GitHubRepo[] {
  const seen = new Map<number, GitHubRepo>()
  for (const repo of repos) {
    const existing = seen.get(repo.id)
    if (!existing || repo.stars > existing.stars) {
      seen.set(repo.id, repo)
    }
  }
  return Array.from(seen.values())
    .sort((a, b) => b.stars - a.stars)
    .slice(0, MAX_REPOS)
}

// ── Public API ───────────────────────────────────────────────────

/**
 * Get the Unix-millisecond timestamp of the last successful pipeline refresh.
 * Returns null if no pipeline data has ever been cached.
 */
export function getLastUpdatedTimestamp(): number | null {
  const cache = readPipelineCache()
  return cache?.timestamp ?? null
}

/**
 * Get a human-readable "last updated" string for display in the UI.
 *
 * Formats:
 *   - "刚刚更新"      — within the last minute
 *   - "X 分钟前"      — 1-59 minutes ago
 *   - "X 小时前"      — 1-23 hours ago
 *   - "X 天前"        — 1-30 days ago
 *   - Date string      — older than 30 days
 *   - "尚未更新"       — no cached data at all
 */
export function getLastUpdatedDisplay(): string {
  const ts = getLastUpdatedTimestamp()
  if (ts === null) return '尚未更新'

  const now = Date.now()
  const diffMs = now - ts
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return '刚刚更新'
  if (diffMin < 60) return `${diffMin} 分钟前`
  if (diffHour < 24) return `${diffHour} 小时前`
  if (diffDay < 30) return `${diffDay} 天前`

  // Older than 30 days — show the full date
  const date = new Date(ts)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

/**
 * Check whether the pipeline cache is considered fresh.
 * Returns true if a cache entry exists and is less than 1 hour old.
 */
export function isPipelineDataFresh(): boolean {
  const cache = readPipelineCache()
  if (!cache) return false
  const oneHourMs = 3600000
  return Date.now() - cache.timestamp < oneHourMs
}

/**
 * Return the source tags from the most recent pipeline refresh.
 * Useful for displaying which APIs contributed to the current data set.
 */
export function getLatestSources(): string[] {
  const cache = readPipelineCache()
  return cache?.sources ?? []
}

/**
 * Refresh trending data by fetching from multiple GitHub API sources
 * in parallel, deduplicating, and persisting the combined result.
 *
 * This is the primary entry point for background data refresh.
 * Call it:
 *   - On app mount (if cache is stale or empty)
 *   - On a user-triggered "Refresh" button
 *   - On a periodic interval (e.g., every 30 minutes)
 *
 * The function is resilient: individual source failures do not
 * block the pipeline — partial results from successful sources
 * are still saved.
 *
 * @returns Promise that resolves when the refresh is complete.
 */
export async function refreshTrendingData(): Promise<void> {
  const sources: string[] = []
  const allRepos: GitHubRepo[] = []

  // ── Fetch trending repos (general AI) ──
  try {
    const trending = await fetchTrendingRepos({
      perPage: 30,
      since: undefined,
    })
    if (trending.length > 0) {
      allRepos.push(...trending)
      sources.push('trending')
      console.info(`[Pipeline] Fetched ${trending.length} trending repos.`)
    }
  } catch (e) {
    console.warn(
      '[Pipeline] fetchTrendingRepos failed (non-blocking):',
      (e as Error).message,
    )
  }

  // ── Fetch trending weekly ──
  try {
    const weekly = await fetchTrendingWeekly()
    if (weekly.length > 0) {
      allRepos.push(...weekly)
      sources.push('trending-weekly')
      console.info(`[Pipeline] Fetched ${weekly.length} weekly trending repos.`)
    }
  } catch (e) {
    console.warn(
      '[Pipeline] fetchTrendingWeekly failed (non-blocking):',
      (e as Error).message,
    )
  }

  // ── Fetch trending daily ──
  try {
    const daily = await fetchTrendingDaily()
    if (daily.length > 0) {
      allRepos.push(...daily)
      sources.push('trending-daily')
      console.info(`[Pipeline] Fetched ${daily.length} daily trending repos.`)
    }
  } catch (e) {
    console.warn(
      '[Pipeline] fetchTrendingDaily failed (non-blocking):',
      (e as Error).message,
    )
  }

  // ── Fetch AI tools ──
  try {
    const aiTools = await fetchAITools()
    if (aiTools.length > 0) {
      allRepos.push(...aiTools)
      sources.push('ai-tools')
      console.info(`[Pipeline] Fetched ${aiTools.length} AI tool repos.`)
    }
  } catch (e) {
    console.warn(
      '[Pipeline] fetchAITools failed (non-blocking):',
      (e as Error).message,
    )
  }

  // ── Deduplicate and persist ──
  const unique = deduplicateRepos(allRepos)

  if (unique.length > 0 || sources.length > 0) {
    writePipelineCache({
      data: unique,
      timestamp: Date.now(),
      sources,
    })
    console.info(
      `[Pipeline] Refreshed pipeline cache: ${unique.length} unique repos ` +
      `from sources: [${sources.join(', ')}]`
    )
  } else {
    console.warn(
      '[Pipeline] All data sources failed. Pipeline cache was NOT updated. ' +
      'Stale cache (if any) remains available via getCachedTrendingData().'
    )
  }
}

/**
 * Get the cached trending data.
 *
 * Priority:
 *   1. Pipeline cache (deduplicated combined result from refreshTrendingData)
 *   2. Legacy GitHub cache (backward-compatible fallback from github.ts)
 *   3. Static fallback repos (hardcoded data shipped with the app)
 *
 * Always returns a non-empty array of GitHubRepo objects.
 * This function is synchronous — it only reads from localStorage.
 *
 * @returns An array of GitHubRepo objects (never empty).
 */
export function getCachedTrendingData(): GitHubRepo[] {
  // 1. Pipeline cache (preferred)
  const pipeline = readPipelineCache()
  if (pipeline && pipeline.data.length > 0) {
    return pipeline.data
  }

  // 2. Legacy cache (backward-compatible)
  try {
    const raw = localStorage.getItem('jiayouvibe_github_cache')
    if (raw) {
      const legacy = JSON.parse(raw) as GitHubCache
      if (legacy && Array.isArray(legacy.data) && legacy.data.length > 0) {
        console.info(
          '[Pipeline] Using legacy GitHub cache as fallback ' +
          `(${legacy.data.length} repos).`
        )
        return legacy.data
      }
    }
  } catch {
    // Silently fall through to static fallback
  }

  // 3. Static fallback (last resort)
  console.warn(
    '[Pipeline] No cached data available. Using static fallback repos.'
  )
  return getFallbackRepos()
}

/**
 * Convenience wrapper: async fetch with automatic caching.
 *
 * Similar to refreshTrendingData() but returns the fetched data directly
 * instead of void, and uses the same multi-source strategy.
 *
 * Use this when you need the data immediately after a refresh
 * (e.g., pulling to refresh in a UI).
 *
 * @returns Promise resolving to the freshly-fetched and deduplicated repos.
 */
export async function fetchAndCacheTrendingData(): Promise<GitHubRepo[]> {
  await refreshTrendingData()
  return getCachedTrendingData()
}

/**
 * Clear the pipeline cache, forcing the next refreshTrendingData()
 * call to fetch fresh data from all sources.
 */
export function clearPipelineCache(): void {
  try {
    localStorage.removeItem(PIPELINE_CACHE_KEY)
    console.info('[Pipeline] Pipeline cache cleared.')
  } catch (e) {
    console.warn('[Pipeline] Failed to clear pipeline cache:', e)
  }
}
