import { useState, useMemo, useEffect } from 'react'
import { ExternalLink, Clock, Tag, Search, Filter, TrendingUp, Newspaper } from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import { newsItems } from '@/data/news'
import type { NewsItem } from '@/types'
import AdBanner from '@/components/ads/AdBanner'

const CATEGORY_TABS: { key: string; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'model', label: '大模型' },
  { key: 'opensource', label: '开源' },
  { key: 'business', label: '商业' },
  { key: 'research', label: '研究' },
  { key: 'policy', label: '政策' },
]

const CATEGORY_MAP: Record<string, string> = {
  model: '大模型',
  opensource: '开源',
  business: '商业',
  research: '研究',
  policy: '政策',
}

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days} 天前`
  if (days < 30) return `${Math.floor(days / 7)} 周前`
  return `${Math.floor(days / 30)} 月前`
}

const NewsPage = () => {
  useEffect(() => {
    document.title = `AI资讯 | ${SITE_NAME}`
  }, [])

  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter news
  const filteredNews = useMemo(() => {
    let result = newsItems

    if (activeCategory !== 'all') {
      result = result.filter((item) => item.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }

    return result
  }, [activeCategory, searchQuery])

  // Tag cloud: aggregate all tags with counts
  const tagCloud = useMemo(() => {
    const counts: Record<string, number> = {}
    newsItems.forEach((item) => {
      item.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1
      })
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 18)
  }, [])

  // Top 5 by recency
  const top5 = useMemo(() => {
    return [...newsItems]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  }, [])

  return (
    <div className="py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-sora font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          AI资讯动态
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm font-jetbrains max-w-2xl">
          追踪全球AI前沿资讯，涵盖大模型发布、开源动态、商业变革、学术研究与政策法规
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Timeline */}
        <div className="flex-1 min-w-0">
          {/* Filter Bar */}
          <div className="mb-6 space-y-3">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategory(tab.key)}
                  aria-pressed={activeCategory === tab.key}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                    activeCategory === tab.key
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'border-[var(--color-border)]/60 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border)] hover:bg-[var(--color-bg-tertiary)]/40'
                  }`}
                >
                  {activeCategory === tab.key && (
                    <Filter className="inline h-3 w-3 mr-1.5 -mt-0.5" />
                  )}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <label htmlFor="news-search-input" className="sr-only">搜索新闻</label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
              <input
                id="news-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索新闻标题、摘要、标签..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-bg-secondary)]/60 text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
              />
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-jetbrains mb-6">
            <Newspaper className="h-3.5 w-3.5 text-cyan-400" />
            <span>
              共 {filteredNews.length} 条资讯
              {(activeCategory !== 'all' || searchQuery) && '（已筛选）'}
            </span>
          </div>

          <div className="my-8 flex justify-center"><AdBanner /></div>

          {/* News Timeline */}
          {filteredNews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)]">
              <Newspaper className="h-10 w-10 mb-3 text-[var(--color-text-muted)]" />
              <p className="text-sm">未找到匹配的资讯</p>
              <button
                onClick={() => {
                  setActiveCategory('all')
                  setSearchQuery('')
                }}
                className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                清除筛选条件
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/40 via-[var(--color-border)] to-transparent" />

              <div className="space-y-5">
                {filteredNews.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-72 shrink-0 space-y-6">
          {/* Hot Tags Cloud */}
          <div className="rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-bg-secondary)]/60 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-sora font-semibold text-[var(--color-text-primary)]">
                热门标签
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {tagCloud.map(([tag, count]) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-[var(--color-border)]/50 bg-[var(--color-bg-tertiary)]/40 text-[var(--color-text-secondary)] hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all duration-200"
                >
                  {tag}
                  <span className="ml-1 text-[var(--color-text-muted)]">({count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Hot (Top 5) */}
          <div className="rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-bg-secondary)]/60 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-sora font-semibold text-[var(--color-text-primary)]">
                本周热议
              </h3>
            </div>
            <ol className="space-y-3">
              {top5.map((item, idx) => (
                <li key={item.id} className="flex gap-3">
                  <span
                    className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold font-jetbrains ${
                      idx === 0
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : idx === 1
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-[var(--color-bg-tertiary)]/60 text-[var(--color-text-muted)]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--color-text-primary)] hover:text-cyan-400 transition-colors line-clamp-2 leading-snug"
                    >
                      {item.title}
                    </a>
                    <p className="text-[10px] text-[var(--color-text-muted)] font-jetbrains mt-0.5">
                      {getRelativeDate(item.date)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───── News Card ───── */
function NewsCard({ item }: { item: NewsItem }) {
  return (
    <div className="relative pl-8 group">
      {/* Timeline Dot */}
      <div className="absolute left-[5px] top-6 w-3.5 h-3.5 rounded-full bg-[var(--color-bg-primary)] border-2 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_16px_rgba(6,182,212,0.7)] transition-shadow duration-300 z-10" />

      {/* Date Label */}
      <div className="mb-2 text-xs font-jetbrains text-[var(--color-text-muted)]">
        {formatDisplayDate(item.date)}
      </div>

      {/* Card */}
      <div
        className="rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-bg-secondary)]/60 backdrop-blur-sm p-5
                    transition-all duration-300
                    hover:border-cyan-500/30 hover:bg-[var(--color-bg-secondary)]/80
                    hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]"
      >
        <div className="flex flex-col gap-3">
          {/* Header row: title + external link */}
          <div className="flex items-start justify-between gap-3">
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base sm:text-lg font-sora font-semibold text-[var(--color-text-primary)] hover:text-cyan-400 transition-colors leading-snug group/link"
            >
              {item.title}
              <ExternalLink className="inline h-3.5 w-3.5 ml-1.5 -mt-0.5 text-[var(--color-text-muted)] group-hover/link:text-cyan-400 transition-colors" />
            </a>
          </div>

          {/* Summary */}
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">
            {item.summary}
          </p>

          {/* Footer: source badge, tags, reading time */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Source Badge */}
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]/50">
              {item.source}
            </span>

            {/* Category Badge */}
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {CATEGORY_MAP[item.category] || item.category}
            </span>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {item.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] rounded-md bg-[var(--color-bg-tertiary)]/60 text-[var(--color-text-muted)] border border-[var(--color-border)]/40"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Reading Time */}
            <div className="ml-auto flex items-center gap-1 text-[11px] text-[var(--color-text-muted)] font-jetbrains">
              <Clock className="h-3 w-3" />
              <span>{item.readingTime} 分钟阅读</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsPage
