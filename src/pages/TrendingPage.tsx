import { useState, useMemo, useCallback, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { cn } from '@/utils/cn'
import { SITE_NAME } from '@/utils/constants'
import useGitHubTrending from '@/hooks/useGitHubTrending'
import { getFallbackRepos } from '@/services/github'
import RepoCard from '@/components/trending/RepoCard'
import RepoFilter from '@/components/trending/RepoFilter'
import Spinner from '@/components/ui/Spinner'
import { ListSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import AdBanner from '@/components/ads/AdBanner'
import type { GitHubRepo } from '@/types'

const PAGE_SIZE = 10

const TOPIC_TABS = [
  { label: '全部', value: '' },
  { label: 'LLM', value: 'llm' },
  { label: 'Agent', value: 'agent' },
  { label: 'RAG', value: 'rag' },
  { label: '推理', value: 'inference OR reasoning' },
  { label: '多模态', value: 'multimodal OR vision' },
  { label: '框架', value: 'framework' },
  { label: '开源1000+', value: 'stars:>1000' },
] as const

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
  const [sort, setSort] = useState('stars')
  const [minStars, setMinStars] = useState(0)
  const [topic, setTopic] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const { repos, loading, error } = useGitHubTrending({
    language,
    since,
    sort,
    minStars,
    topic,
  })

  const filteredRepos = useMemo(
    () => filterRepos(repos, searchQuery),
    [repos, searchQuery],
  )

  const displayedRepos = useMemo(
    () => filteredRepos.slice(0, visibleCount),
    [filteredRepos, visibleCount],
  )

  const hasMore = visibleCount < filteredRepos.length

  const resetAndSet = useCallback(<T,>(setter: (val: T) => void, val: T) => {
    setter(val)
    setVisibleCount(PAGE_SIZE)
  }, [])

  const handleLanguageChange = useCallback(
    (lang: string) => resetAndSet(setLanguage, lang),
    [resetAndSet],
  )
  const handleSinceChange = useCallback(
    (s: string) => resetAndSet(setSince, s),
    [resetAndSet],
  )
  const handleSearchChange = useCallback(
    (q: string) => resetAndSet(setSearchQuery, q),
    [resetAndSet],
  )
  const handleSortChange = useCallback(
    (s: string) => resetAndSet(setSort, s),
    [resetAndSet],
  )
  const handleMinStarsChange = useCallback(
    (ms: number) => resetAndSet(setMinStars, ms),
    [resetAndSet],
  )
  const handleTopicChange = useCallback(
    (t: string) => resetAndSet(setTopic, t),
    [resetAndSet],
  )

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE)
  }, [])

  // Loading (initial, no cached data)
  if (loading && repos.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <ListSkeleton count={4} />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-sora font-bold text-[var(--color-text-primary)] mb-2">
          GitHub热门项目
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm font-jetbrains">
          发现 GitHub 上最受关注的优质开源项目
        </p>
      </div>

      {/* Category topic tabs */}
      <div className="mb-6">
        <span className="block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2.5 font-jetbrains">
          热门分类
        </span>
        <div
          className={cn(
            'flex flex-wrap gap-1.5 rounded-xl bg-[var(--glass-bg)] p-1.5 border border-[var(--glass-border)]',
          )}
        >
          {TOPIC_TABS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleTopicChange(opt.value)}
              className={cn(
                'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
                topic === opt.value
                  ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.03]',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-6">
        <RepoFilter
          language={language}
          since={since}
          searchQuery={searchQuery}
          sort={sort}
          minStars={minStars}
          onLanguageChange={handleLanguageChange}
          onSinceChange={handleSinceChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onMinStarsChange={handleMinStarsChange}
        />
      </div>

      {/* Ad Banner */}
      <div className="my-8 flex justify-center">
        <AdBanner />
      </div>

      {/* Fallback data when API fails and no cache — respects current filters */}
      {error && repos.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getFallbackRepos(language, since).map((repo) => (
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
