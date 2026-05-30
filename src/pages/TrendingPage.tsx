import { useState, useMemo, useCallback, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import useGitHubTrending from '@/hooks/useGitHubTrending'
import { getFallbackRepos } from '@/services/github'
import RepoCard from '@/components/trending/RepoCard'
import RepoFilter from '@/components/trending/RepoFilter'
import Spinner from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import type { GitHubRepo } from '@/types'

const PAGE_SIZE = 10

function filterRepos(repos: GitHubRepo[], query: string): GitHubRepo[] {
  if (!query.trim()) return repos
  const q = query.toLowerCase()
  return repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(q) ||
      repo.owner.toLowerCase().includes(q) ||
      repo.fullName.toLowerCase().includes(q) ||
      repo.description?.toLowerCase().includes(q) ||
      repo.language?.toLowerCase().includes(q) ||
      repo.topics.some((t) => t.toLowerCase().includes(q)),
  )
}

const TrendingPage = () => {
  useEffect(() => {
    document.title = `GitHub热门项目 | ${SITE_NAME}`
  }, [])

  const [language, setLanguage] = useState('')
  const [since, setSince] = useState('daily')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const { repos, loading, error } = useGitHubTrending({ language, since })

  const filteredRepos = useMemo(
    () => filterRepos(repos, searchQuery),
    [repos, searchQuery],
  )

  const displayedRepos = useMemo(
    () => filteredRepos.slice(0, visibleCount),
    [filteredRepos, visibleCount],
  )

  const hasMore = visibleCount < filteredRepos.length

  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang)
    setVisibleCount(PAGE_SIZE)
  }, [])

  const handleSinceChange = useCallback((s: string) => {
    setSince(s)
    setVisibleCount(PAGE_SIZE)
  }, [])

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q)
    setVisibleCount(PAGE_SIZE)
  }, [])

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE)
  }, [])

  // Loading (initial, no cached data)
  if (loading && repos.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Spinner size="lg" label="加载热门项目中..." />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-sora font-bold text-white mb-2">
          GitHub热门项目
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm font-jetbrains">
          发现 GitHub 上最受关注的优质开源项目
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-6">
        <RepoFilter
          language={language}
          since={since}
          searchQuery={searchQuery}
          onLanguageChange={handleLanguageChange}
          onSinceChange={handleSinceChange}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* Fallback data when API fails and no cache */}
      {error && repos.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getFallbackRepos().map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}

      {/* Empty state (loaded, but no results matching filter) */}
      {!loading && filteredRepos.length === 0 && repos.length > 0 && (
        <EmptyState
          icon={<Globe className="w-8 h-8" />}
          title={searchQuery ? '未找到匹配项目' : '暂无热门项目'}
          description={
            searchQuery
              ? '尝试使用不同的关键词或筛选条件'
              : '当前筛选条件下没有找到项目，请尝试切换语言或时间范围'
          }
        />
      )}

      {/* Repo grid */}
      {!error && displayedRepos.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {displayedRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center mb-8">
              <Button variant="secondary" size="md" onClick={handleLoadMore}>
                加载更多
              </Button>
            </div>
          )}

          {/* Stale refresh indicator */}
          {loading && repos.length > 0 && (
            <div className="flex justify-center mb-8">
              <Spinner size="sm" label="更新中..." />
            </div>
          )}

          {/* Footer note */}
          <p className="text-center text-xs text-[var(--color-text-muted)] font-jetbrains">
            数据每1小时自动更新
          </p>
        </>
      )}
    </div>
  )
}

export default TrendingPage
