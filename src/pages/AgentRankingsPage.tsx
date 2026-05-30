import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Trophy,
  Medal,
  TrendingUp,
  Star,
  GitFork,
  Search,
  Info,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { agents } from '@/data/agents'
import { SITE_NAME } from '@/utils/constants'
import { formatStars } from '@/utils/formatDate'
import { cn } from '@/utils/cn'
import type { AIAgent } from '@/types'

// ─── Category filter types ───────────────────────────────────────────
type CategoryKey = '' | 'framework' | 'platform' | 'agent' | 'multi-agent'

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: '', label: '全部' },
  { key: 'framework', label: '开发框架' },
  { key: 'platform', label: 'Agent平台' },
  { key: 'agent', label: '独立Agent' },
  { key: 'multi-agent', label: '多Agent' },
]

// ─── Medal / rank styling ────────────────────────────────────────────
function getMedalStyle(rank: number) {
  switch (rank) {
    case 1:
      return {
        border: 'border-amber-400/50',
        shadow: 'shadow-[0_0_30px_rgba(255,215,0,0.2)]',
        bg: 'bg-amber-400/[0.04]',
        text: 'text-amber-400',
        badge: 'bg-amber-400/10 text-amber-300 border-amber-400/25',
        rankBg: 'bg-amber-400/10 text-amber-300',
      }
    case 2:
      return {
        border: 'border-slate-300/35',
        shadow: 'shadow-[0_0_24px_rgba(192,192,192,0.15)]',
        bg: 'bg-slate-300/[0.03]',
        text: 'text-[var(--color-text-primary)]',
        badge: 'bg-slate-300/8 text-[var(--color-text-primary)] border-slate-300/15',
        rankBg: 'bg-slate-300/8 text-[var(--color-text-primary)]',
      }
    case 3:
      return {
        border: 'border-orange-400/35',
        shadow: 'shadow-[0_0_24px_rgba(205,127,50,0.15)]',
        bg: 'bg-orange-400/[0.03]',
        text: 'text-orange-300',
        badge: 'bg-orange-400/8 text-orange-300 border-orange-400/20',
        rankBg: 'bg-orange-400/8 text-orange-300',
      }
    default:
      return {
        border: 'border-[var(--color-border)]/40',
        shadow: '',
        bg: 'hover:bg-slate-800/30',
        text: 'text-[var(--color-text-secondary)]',
        badge: 'bg-slate-700/30 text-[var(--color-text-secondary)] border-slate-600/30',
        rankBg: 'bg-slate-800/50 text-[var(--color-text-secondary)]',
      }
  }
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="w-5 h-5 text-amber-400" fill="currentColor" />
  if (rank === 2) return <Medal className="w-5 h-5 text-[var(--color-text-primary)]" />
  if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />
  return null
}

// ─── Sub-component: single ranking row ───────────────────────────────
function RankingRow({
  agent,
  rank,
  isTop3,
}: {
  agent: AIAgent
  rank: number
  isTop3: boolean
}) {
  const m = getMedalStyle(rank)

  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 sm:gap-5 rounded-2xl border p-4 sm:p-5 transition-all duration-300',
        'backdrop-blur-sm bg-slate-900/60',
        m.border,
        m.shadow,
        m.bg,
        !isTop3 && 'hover:border-slate-600/50 hover:bg-slate-800/40',
      )}
    >
      {/* Rank number / icon */}
      <div className="shrink-0 flex flex-col items-center justify-center w-12 sm:w-14">
        {isTop3 ? (
          <>
            <RankIcon rank={rank} />
            <span className={cn('text-lg sm:text-xl font-bold font-jetbrains mt-0.5', m.text)}>
              {rank}
            </span>
          </>
        ) : (
          <span
            className={cn(
              'flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-lg font-bold font-jetbrains',
              m.rankBg,
            )}
          >
            {rank}
          </span>
        )}
      </div>

      {/* Agent info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base sm:text-lg font-bold text-slate-100 truncate">
            {agent.name}
          </h3>
          {isTop3 && (
            <span
              className={cn(
                'shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border',
                m.badge,
              )}
            >
              {rank === 1 ? 'TOP 1' : rank === 2 ? 'TOP 2' : 'TOP 3'}
            </span>
          )}
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-1 leading-relaxed">
          {agent.description}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {agent.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 text-[11px] rounded-md bg-slate-800/60 text-[var(--color-text-muted)] border border-[var(--color-border)]/40"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Stats column */}
      <div className="shrink-0 flex flex-col items-end gap-1.5">
        {/* Stars */}
        <div className="flex items-center gap-1.5 text-sm">
          <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
          <span className="font-jetbrains font-semibold text-[var(--color-text-primary)] tabular-nums">
            {agent.githubStars ? formatStars(agent.githubStars) : '--'}
          </span>
        </div>

        {/* Forks — placeholder since AIAgent type has no forks field */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
          <GitFork className="w-3.5 h-3.5" />
          <span className="font-jetbrains tabular-nums">--</span>
        </div>

        {/* Language */}
        {agent.language && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] max-w-[120px]">
            <span className="w-2 h-2 rounded-full bg-cyan-400/60 shrink-0" />
            <span className="truncate">{agent.language.split(',')[0]}</span>
          </div>
        )}
      </div>

      {/* Detail button */}
      <Link
        to={`/agents/${agent.slug}`}
        className={cn(
          'shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
          isTop3
            ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/25 hover:bg-cyan-400/20 hover:border-cyan-400/40'
            : 'bg-slate-800/60 text-[var(--color-text-secondary)] border border-[var(--color-border)]/40 hover:bg-slate-700/60 hover:text-[var(--color-text-primary)] hover:border-slate-600/40',
        )}
      >
        详情
        <ArrowUp className="w-3 h-3 rotate-45" />
      </Link>
    </div>
  )
}

// ─── Sub-component: rising agent card ────────────────────────────────
function RisingAgentItem({
  agent,
  rank,
  stars,
}: {
  agent: AIAgent
  rank: number
  stars: number
}) {
  return (
    <Link
      to={`/agents/${agent.slug}`}
      className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-slate-800/40 group"
    >
      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800/70 text-xs font-bold font-jetbrains text-[var(--color-text-secondary)] group-hover:text-cyan-400 transition-colors">
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate group-hover:text-cyan-400 transition-colors">
          {agent.name}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-1">
          {agent.type === 'framework'
            ? '开发框架'
            : agent.type === 'platform'
              ? 'Agent平台'
              : agent.type === 'agent'
                ? '独立Agent'
                : '工具'}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-xs font-jetbrains font-semibold text-emerald-400">
          {formatStars(stars)}
        </span>
      </div>
    </Link>
  )
}

// ─── Page ────────────────────────────────────────────────────────────
export default function AgentRankingsPage() {
  useEffect(() => {
    document.title = `AI Agent排行榜 | ${SITE_NAME}`
  }, [])

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CategoryKey>('')

  // Filter & sort
  const filteredAgents = useMemo(() => {
    let list = [...agents]

    // Category filter
    if (category) {
      if (category === 'multi-agent') {
        list = list.filter((a) =>
          a.tags.some((t) => t.includes('多智能体') || t.includes('多Agent')),
        )
      } else {
        list = list.filter((a) => a.type === category)
      }
    }

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((a) => {
        const matchName = a.name.toLowerCase().includes(q)
        const matchDesc = a.description.toLowerCase().includes(q)
        const matchTags = a.tags.some((t) => t.toLowerCase().includes(q))
        return matchName || matchDesc || matchTags
      })
    }

    // Sort: by githubStars descending (undefined → end)
    list.sort((a, b) => {
      const sa = a.githubStars ?? -1
      const sb = b.githubStars ?? -1
      return sb - sa
    })

    return list
  }, [search, category])

  // Rising agents: top 3 by stars (with stars defined)
  const risingAgents = useMemo(() => {
    return agents
      .filter((a) => a.githubStars != null && a.githubStars > 0)
      .sort((a, b) => (b.githubStars ?? 0) - (a.githubStars ?? 0))
      .slice(0, 3)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Breadcrumb ─────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-[var(--color-text-muted)] mb-6 font-jetbrains">
        <Link to="/" className="hover:text-cyan-400 transition-colors">
          首页
        </Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">AI Agent排行榜</span>
      </nav>

      {/* ── Title ──────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/10 to-orange-400/10 border border-amber-400/20">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sora font-bold">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
              AI Agent排行榜
            </span>
          </h1>
        </div>
        <p className="text-[var(--color-text-secondary)] text-sm sm:text-base max-w-2xl ml-[52px]">
          基于GitHub开源影响力、社区活跃度和技术生态的综合排名，帮你发现最值得关注的AI Agent项目
        </p>
      </div>

      {/* ── Filter bar ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {/* Category tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/50 border border-[var(--color-border)]/40 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={cn(
                'shrink-0 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                category === cat.key
                  ? 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/25 shadow-[0_0_10px_rgba(0,219,231,0.15)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-slate-700/40 border border-transparent',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索Agent名称或关键词..."
            className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl bg-slate-800/50 border border-[var(--color-border)]/40 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-colors"
          />
        </div>
      </div>

      {/* ── Main content + sidebar ─────────────────── */}
      <div className="lg:flex lg:gap-8">
        {/* ── Leaderboard ───────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Count */}
          <p className="text-xs text-[var(--color-text-muted)] mb-4 font-jetbrains">
            共 {filteredAgents.length} 个Agent
            {category && ` · ${CATEGORIES.find((c) => c.key === category)?.label}`}
          </p>

          {filteredAgents.length > 0 ? (
            <div className="space-y-3">
              {filteredAgents.map((agent, idx) => (
                <RankingRow
                  key={agent.slug}
                  agent={agent}
                  rank={idx + 1}
                  isTop3={idx < 3}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-12 h-12 text-[var(--color-text-muted)] mb-4" />
              <p className="text-[var(--color-text-secondary)] text-lg font-medium mb-1">没有找到匹配的Agent</p>
              <p className="text-[var(--color-text-muted)] text-sm">尝试调整筛选条件或搜索关键词</p>
            </div>
          )}
        </div>

        {/* ── Sidebar ────────────────────────────── */}
        <div className="mt-8 lg:mt-0 lg:w-80 xl:w-88 shrink-0 space-y-5">
          {/* Criteria card */}
          <div className="rounded-2xl border border-[var(--color-border)]/40 bg-slate-900/50 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
                <Info className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">收录标准</h3>
            </div>
            <ul className="space-y-2.5">
              {[
                { label: 'GitHub Stars', desc: '开源项目需在GitHub有显著影响力' },
                { label: '社区活跃度', desc: '持续的更新、Issue响应和PR合并' },
                { label: '技术生态', desc: '完善的文档、插件系统和集成能力' },
                { label: '创新性', desc: '在AI Agent领域有独特的技术贡献' },
                { label: '实用性', desc: '有明确的应用场景和生产环境案例' },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 mt-2 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-[var(--color-text-primary)]">{item.label}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Rising fastest card */}
          <div className="rounded-2xl border border-[var(--color-border)]/40 bg-slate-900/50 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">本月上升最快</h3>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mb-3 leading-relaxed">
              基于GitHub Stars总量的热门Agent项目
            </p>
            <div className="space-y-0.5">
              {risingAgents.map((agent, idx) => (
                <RisingAgentItem
                  key={agent.slug}
                  agent={agent}
                  rank={idx + 1}
                  stars={agent.githubStars!}
                />
              ))}
            </div>
          </div>

          {/* Quick link to agents page */}
          <Link
            to="/agents"
            className="flex items-center justify-between p-4 rounded-2xl border border-[var(--color-border)]/40 bg-slate-900/50 backdrop-blur-sm hover:border-cyan-400/30 hover:bg-slate-800/40 transition-all duration-200 group"
          >
            <span className="text-sm text-[var(--color-text-primary)] group-hover:text-cyan-400 transition-colors">
              浏览全部AI Agent →
            </span>
            <ArrowDown className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-cyan-400 transition-colors -rotate-90" />
          </Link>
        </div>
      </div>
    </div>
  )
}
