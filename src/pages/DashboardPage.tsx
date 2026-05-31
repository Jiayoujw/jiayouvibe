import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  Network,
  ScrollText,
  Bell,
  Settings,
  ChevronDown,
  HelpCircle,
  LogOut,
  Eye,
  Star,
  StickyNote,
  TrendingUp,
  Plus,
  Search,
  GitCompare,
  Zap,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatStars } from '@/utils/formatDate'
import { useNotes } from '@/contexts/NotesContext'

/* ── types ── */

interface TrendingRepo {
  name: string
  stars: number
  color: string
}

interface FeedItem {
  id: string
  title: string
  category: string
  time: string
  dotColor: string
}

interface TagItem {
  label: string
  size: 'sm' | 'md' | 'lg' | 'xl'
  hue: number
}

/* ── static data ── */

const TRENDING_REPOS: TrendingRepo[] = [
  { name: 'langchain', stars: 124500, color: 'from-cyan-400 to-emerald-400' },
  { name: 'autogen', stars: 89200, color: 'from-purple-400 to-pink-400' },
  { name: 'llama.cpp', stars: 76800, color: 'from-amber-400 to-orange-400' },
  { name: 'transformers', stars: 112100, color: 'from-emerald-400 to-teal-400' },
  { name: 'vllm', stars: 45300, color: 'from-blue-400 to-cyan-400' },
]

const FEED_ITEMS: FeedItem[] = [
  {
    id: '1',
    title: 'LangChain v0.3 发布：全新的多智能体编排架构',
    category: '框架发布',
    time: '2小时前',
    dotColor: 'bg-emerald-400',
  },
  {
    id: '2',
    title: 'Llama 4 开源：Meta 最新多模态大模型深度解析',
    category: '模型发布',
    time: '4小时前',
    dotColor: 'bg-cyan-400',
  },
  {
    id: '3',
    title: 'RAG 进阶：自查询检索器的实现与优化策略',
    category: '教程',
    time: '6小时前',
    dotColor: 'bg-purple-400',
  },
  {
    id: '4',
    title: 'AI 安全对齐最新研究：RLHF 的替代方案探索',
    category: '研究',
    time: '9小时前',
    dotColor: 'bg-amber-400',
  },
  {
    id: '5',
    title: 'vLLM 性能调优指南：吞吐量提升 300% 的配置技巧',
    category: '教程',
    time: '12小时前',
    dotColor: 'bg-pink-400',
  },
]

const TAGS: TagItem[] = [
  { label: 'LLM', size: 'xl', hue: 190 },
  { label: 'RAG', size: 'lg', hue: 270 },
  { label: 'Agent', size: 'lg', hue: 160 },
  { label: 'Fine-tuning', size: 'md', hue: 30 },
  { label: 'Prompt Engineering', size: 'md', hue: 200 },
  { label: 'Vector DB', size: 'md', hue: 340 },
  { label: 'Safety', size: 'sm', hue: 130 },
  { label: 'Deploy', size: 'sm', hue: 10 },
  { label: 'Open Source', size: 'sm', hue: 280 },
  { label: 'Inference', size: 'md', hue: 220 },
  { label: 'Multimodal', size: 'sm', hue: 300 },
  { label: 'Tool Use', size: 'sm', hue: 50 },
]

/* ── helpers ── */

function useAnimatedBar(targetWidth: number, delay: number) {
  const [width, setWidth] = useState(0)
  const triggered = useRef(false)

  useEffect(() => {
    if (triggered.current) return
    triggered.current = true
    const timer = setTimeout(() => {
      const anim = requestAnimationFrame(() => setWidth(targetWidth))
      return () => cancelAnimationFrame(anim)
    }, delay)
    return () => clearTimeout(timer)
  }, [targetWidth, delay])

  return width
}

function useCountUp(target: number, duration: number) {
  const [val, setVal] = useState(0)
  const triggered = useRef(false)

  useEffect(() => {
    if (triggered.current) return
    triggered.current = true
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(2, -10 * progress) // easeOutExpo
      setVal(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
      else setVal(target)
    }

    const raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return val
}

/* ── sub-components ── */

function SideNavBar() {
  const navLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Network, label: 'Neural Net' },
    { icon: ScrollText, label: 'Logs' },
  ]

  return (
    <aside className="hidden md:flex md:flex-col fixed left-0 top-0 bottom-0 w-64 bg-[var(--color-bg-secondary)]/90 backdrop-blur-xl border-r border-white/[0.06] z-40">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/[0.05]">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg shadow-purple-500/30">
          <Sparkles className="h-5 w-5 text-white" />
          <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
          </span>
        </div>
        <div>
          <div className="text-sm font-semibold tracking-wide text-white leading-tight">
            System Core
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
            jiayouvibe v2.0
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5" role="navigation" aria-label="主导航">
        <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
          Main Menu
        </p>
        {navLinks.map(({ icon: Icon, label, active }) => (
          <Link
            key={label}
            to={label === 'Dashboard' ? '/dashboard' : '#'}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
              active
                ? 'bg-gradient-to-r from-cyan-500/15 to-purple-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.08)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.04]',
            )}
          >
            <Icon
              className={cn(
                'h-4.5 w-4.5 transition-colors',
                active ? 'text-cyan-400' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]',
              )}
            />
            {label}
            {active && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
            )}
          </Link>
        ))}

        {/* Deploy Agent CTA */}
        <div className="px-3 pt-5 pb-2">
          <button className="relative w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:from-cyan-400 hover:to-purple-500 active:scale-[0.98] transition-all duration-200 overflow-hidden group">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_70%)]" />
            <Zap className="h-4 w-4 relative z-10" />
            <span className="relative z-10">Deploy Agent</span>
          </button>
        </div>
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-white/[0.05] space-y-1">
        <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.04] transition-colors">
          <HelpCircle className="h-4 w-4 text-[var(--color-text-muted)]" />
          Help
        </button>
        <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-red-500/5 transition-colors">
          <LogOut className="h-4 w-4 text-[var(--color-text-muted)]" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

function TopNavBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between md:justify-end h-16 px-4 md:pl-72 md:pr-6 bg-[var(--color-bg-primary)]/80 backdrop-blur-xl border-b border-white/[0.05]">
      {/* Mobile: show compact brand */}
      <div className="flex md:hidden items-center gap-2">
        <Sparkles className="h-5 w-5 text-cyan-400" />
        <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          System Core
        </span>
      </div>

      <div className="flex items-center gap-1">
        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[var(--color-text-secondary)] hover:text-cyan-400 hover:bg-white/[0.05] transition-colors"
          aria-label="通知"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-400" />
          </span>
        </button>

        {/* Settings */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--color-text-secondary)] hover:text-cyan-400 hover:bg-white/[0.05] transition-colors"
          aria-label="设置"
        >
          <Settings className="h-[18px] w-[18px]" />
        </button>

        {/* Divider */}
        <div className="mx-2 h-6 w-px bg-white/[0.06]" />

        {/* User avatar */}
        <button className="flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-white/[0.04] transition-colors" aria-label="用户菜单" aria-expanded={false}>
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/20">
            J
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-bg-primary)] bg-emerald-400" />
          </div>
          <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-[var(--color-text-muted)]" />
        </button>
      </div>
    </header>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
  suffix,
}: {
  icon: typeof Eye
  label: string
  value: number
  gradient: string
  suffix?: string
}) {
  const count = useCountUp(value, 1600)
  const formatted = useMemo(() => {
    if (value >= 10000) {
      return count.toLocaleString()
    }
    return count.toLocaleString()
  }, [count, value])

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--color-bg-secondary)]/60 backdrop-blur-xl p-5 transition-all duration-300 hover:border-cyan-500/30 hover:bg-[var(--color-bg-secondary)]/80 hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]">
      {/* hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.06),transparent_70%)]" />

      <div className="relative flex items-start justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          {label}
        </span>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br', gradient, 'shadow-lg')}>
          <Icon className="h-4.5 w-4.5 text-white" />
        </div>
      </div>

      <div className="relative">
        <span className={cn('text-3xl font-bold font-mono tracking-tight bg-gradient-to-r bg-clip-text text-transparent', gradient)}>
          {formatted}
          {suffix ?? ''}
        </span>
      </div>
    </div>
  )
}

function TrendingBars() {
  const maxStars = Math.max(...TRENDING_REPOS.map((r) => r.stars))

  return (
    <div className="space-y-3">
      {TRENDING_REPOS.map((repo, i) => {
        const targetPct = Math.round((repo.stars / maxStars) * 100)
        const width = useAnimatedBar(targetPct, i * 120)

        return (
          <div key={repo.name} className="group">
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="font-mono text-[var(--color-text-primary)] font-medium tracking-wide">
                {repo.name}
              </span>
              <span className="font-mono tabular-nums text-[var(--color-text-muted)]">
                <Star className="h-3 w-3 inline fill-amber-400 text-amber-400" /> {formatStars(repo.stars)}
              </span>
            </div>
            <div className="relative h-3 w-full rounded-full bg-white/[0.03] overflow-hidden">
              <div
                className={cn(
                  'absolute left-0 top-0 h-full rounded-full bg-gradient-to-r transition-[width] duration-[800ms] ease-out',
                  repo.color,
                )}
                style={{ width: `${width}%` }}
              >
                {/* Shine overlay */}
                <div className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,transparent_30%,rgba(255,255,255,0.15)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FeedList() {
  return (
    <div className="space-y-0.5">
      {FEED_ITEMS.map((item) => (
        <Link
          key={item.id}
          to="#"
          className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
        >
          {/* Dot indicator */}
          <span className="relative mt-1.5 flex h-2 w-2 shrink-0">
            <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', item.dotColor)} />
            <span className={cn('relative inline-flex h-2 w-2 rounded-full', item.dotColor)} />
          </span>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-[var(--color-text-primary)] group-hover:text-white transition-colors leading-snug line-clamp-2">
              {item.title}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] font-medium text-[var(--color-text-muted)] bg-white/[0.03] px-2 py-0.5 rounded-md">
                {item.category}
              </span>
            </div>
          </div>

          <span className="shrink-0 text-[11px] text-[var(--color-text-muted)] font-mono mt-0.5">
            {item.time}
          </span>
        </Link>
      ))}
    </div>
  )
}

function QuickActions() {
  const actions = [
    { icon: Plus, label: '新建笔记', to: '/notes', gradient: 'from-cyan-500 to-blue-500' },
    { icon: Search, label: '全局搜索', to: '#', gradient: 'from-purple-500 to-pink-500' },
    { icon: GitCompare, label: '模型对比', to: '/compare', gradient: 'from-emerald-500 to-teal-500' },
  ]

  return (
    <div className="grid grid-cols-1 gap-2">
      {actions.map(({ icon: Icon, label, to, gradient }) => (
        <Link
          key={label}
          to={to}
          className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:border-white/[0.1] hover:bg-white/[0.04] hover:text-white transition-all duration-200 group"
        >
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br shadow-md', gradient)}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          {label}
        </Link>
      ))}
    </div>
  )
}

function TagCloud() {
  const sizeClasses: Record<TagItem['size'], string> = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-sm font-medium px-3.5 py-1.5',
    xl: 'text-base font-semibold px-4 py-2',
  }

  return (
    <div className="flex flex-wrap gap-2">
      {TAGS.map((tag) => (
        <Link
          key={tag.label}
          to="#"
          className={cn(
            sizeClasses[tag.size],
            'rounded-full border border-white/[0.06] bg-white/[0.02] text-[var(--color-text-primary)]',
            'hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:text-cyan-300',
            'transition-all duration-300 hover:-translate-y-0.5',
            'opacity-0 animate-[slide-up_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]',
          )}
          style={{ animationDelay: `${Math.random() * 400}ms` }}
        >
          {tag.label}
        </Link>
      ))}
    </div>
  )
}

function ProgressRing({ percent = 75 }: { percent?: number }) {
  const [offset, setOffset] = useState(0)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference - (percent / 100) * circumference
  const triggered = useRef(false)

  useEffect(() => {
    if (triggered.current) return
    triggered.current = true
    const timer = setTimeout(() => {
      setOffset(targetOffset)
    }, 300)
    return () => clearTimeout(timer)
  }, [targetOffset])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative inline-flex items-center justify-center">
        <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
          {/* Background track */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-white/[0.04]"
          />
          {/* Progress arc */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-[1400ms] ease-out"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-mono bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            75%
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--color-text-muted)] mt-0.5">
            Complete
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── main page ── */

export default function DashboardPage() {
  const { state } = useNotes()
  const noteCount = state.notes.length

  const stats = [
    { icon: Eye, label: '今日访问', value: 12847, gradient: 'from-cyan-400 to-blue-500', suffix: '' },
    { icon: Star, label: '收藏模型', value: 1234, gradient: 'from-amber-400 to-orange-500', suffix: '' },
    { icon: StickyNote, label: '笔记数量', value: noteCount, gradient: 'from-purple-400 to-pink-500', suffix: '' },
    { icon: TrendingUp, label: '学习进度', value: 68, gradient: 'from-emerald-400 to-teal-500', suffix: '%' },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <SideNavBar />
      <TopNavBar />

      {/* Main content area — offset by sidebar width on desktop */}
      <main className="md:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1400px]">
          {/* Page header */}
          <div className="flex items-center gap-2 mb-6">
            <Terminal className="h-5 w-5 text-cyan-400" />
            <h1 className="text-base font-semibold tracking-wide text-white">
              仪表盘
              <span className="ml-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)] bg-white/[0.03] px-2 py-0.5 rounded-md">
                Overview
              </span>
            </h1>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* 70/30 split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            {/* Left 70% */}
            <div className="lg:col-span-8 space-y-5">
              {/* GitHub 趋势 */}
              <section className="rounded-2xl border border-white/[0.06] bg-[var(--color-bg-secondary)]/60 backdrop-blur-xl p-5 sm:p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-800">
                    <BarChart3 className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">GitHub 趋势</h2>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-mono">Top AI repositories</p>
                  </div>
                </div>
                <TrendingBars />
              </section>

              {/* 最近更新 */}
              <section className="rounded-2xl border border-white/[0.06] bg-[var(--color-bg-secondary)]/60 backdrop-blur-xl p-5 sm:p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-800">
                    <ScrollText className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">最近更新</h2>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-mono">Latest AI news & tutorials</p>
                  </div>
                </div>
                <FeedList />
              </section>
            </div>

            {/* Right 30% */}
            <div className="lg:col-span-4 space-y-5">
              {/* 快速操作 */}
              <section className="rounded-2xl border border-white/[0.06] bg-[var(--color-bg-secondary)]/60 backdrop-blur-xl p-5 sm:p-6">
                <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  快速操作
                </h2>
                <QuickActions />
              </section>

              {/* 热门标签 */}
              <section className="rounded-2xl border border-white/[0.06] bg-[var(--color-bg-secondary)]/60 backdrop-blur-xl p-5 sm:p-6">
                <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  热门标签
                </h2>
                <TagCloud />
              </section>

              {/* 学习进度 */}
              <section className="rounded-2xl border border-white/[0.06] bg-[var(--color-bg-secondary)]/60 backdrop-blur-xl p-5 sm:p-6">
                <h2 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  学习进度
                </h2>
                <ProgressRing percent={75} />
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="md:pl-0 border-t border-white/[0.04] mt-10">
          <div className="px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1400px] mx-auto">
            <p className="text-xs text-[var(--color-text-muted)]">
              &copy; {new Date().getFullYear()} jiayouvibe — System Core Dashboard. All rights reserved.
            </p>
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
              Powered by AI &middot; v2.0.0
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
