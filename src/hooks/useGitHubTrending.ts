import { useState, useEffect, useCallback, useRef } from 'react'
import type { GitHubRepo } from '@/types'
import { GITHUB_CACHE_KEY, GITHUB_CACHE_TTL } from '@/utils/constants'
import { fetchTrendingRepos } from '@/services/github'

interface UseGitHubTrendingOptions {
  language?: string
  since?: string
}

interface UseGitHubTrendingReturn {
  repos: GitHubRepo[]
  loading: boolean
  error: string | null
  refetch: () => void
}

function useGitHubTrending(
  options?: UseGitHubTrendingOptions
): UseGitHubTrendingReturn {
  const [repos, setRepos] = useState<GitHubRepo[]>(() => {
    try {
      const raw = localStorage.getItem(GITHUB_CACHE_KEY)
      if (raw) {
        const cached = JSON.parse(raw)
        if (Date.now() - cached.timestamp < GITHUB_CACHE_TTL) {
          return cached.data as GitHubRepo[]
        }
      }
    } catch {
      // ignore corrupt cache
    }
    return []
  })

  const [loading, setLoading] = useState<boolean>(() => {
    // Only show loading if we have no cached data
    return repos.length === 0
  })

  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const staleRef = useRef<boolean>(false)

  const fetchData = useCallback(
    async (isStaleRefresh = false) => {
      if (!isStaleRefresh) {
        setError(null)
      }

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const result = await fetchTrendingRepos({
          language: options?.language,
          since: options?.since,
        })

        if (controller.signal.aborted) return

        setRepos(result)
        setError(null)

        // Persist to localStorage for stale-while-revalidate
        try {
          localStorage.setItem(
            GITHUB_CACHE_KEY,
            JSON.stringify({ data: result, timestamp: Date.now() })
          )
        } catch {
          // storage full
        }
      } catch (err) {
        if (controller.signal.aborted) return
        const message =
          err instanceof Error ? err.message : 'Failed to fetch trending repos'
        setError(message)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
        staleRef.current = false
      }
    },
    [options?.language, options?.since]
  )

  // Initial fetch + stale-while-revalidate
  useEffect(() => {
    staleRef.current = repos.length > 0
    fetchData(repos.length > 0)

    return () => {
      abortRef.current?.abort()
    }
    // Only re-run when language/since actually change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.language, options?.since])

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    staleRef.current = false
    fetchData(false)
  }, [fetchData])

  return { repos, loading, error, refetch }
}

export default useGitHubTrending
