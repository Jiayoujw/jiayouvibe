import { useState, useMemo, useEffect, useCallback } from 'react'
import { Copy, Check, Code2, ExternalLink, Search, Filter, X } from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import { prompts } from '@/data/prompts'
import { cn } from '@/utils/cn'
import type { PromptTemplate, PromptCategory, PromptDifficulty } from '@/types'

/* ── Constants ── */

const CATEGORIES: (PromptCategory | '全部')[] = [
  '全部',
  '编程开发',
  '内容创作',
  '数据分析',
  '翻译润色',
  '角色扮演',
  '教育学习',
  '商业办公',
]

const DIFFICULTY_CONFIG: Record<PromptDifficulty, { label: string; className: string }> = {
  '入门': { label: '入门', className: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/25' },
  '进阶': { label: '进阶', className: 'bg-amber-400/15 text-amber-300 border-amber-400/25' },
  '高级': { label: '高级', className: 'bg-rose-400/15 text-rose-300 border-rose-400/25' },
}

const CATEGORY_CONFIG: Record<PromptCategory, { color: string; icon: string }> = {
  '编程开发': { color: 'bg-cyan-400/15 text-cyan-300 border-cyan-400/25', icon: '💻' },
  '内容创作': { color: 'bg-purple-400/15 text-purple-300 border-purple-400/25', icon: '✍️' },
  '数据分析': { color: 'bg-blue-400/15 text-blue-300 border-blue-400/25', icon: '📊' },
  '翻译润色': { color: 'bg-teal-400/15 text-teal-300 border-teal-400/25', icon: '🌐' },
  '角色扮演': { color: 'bg-pink-400/15 text-pink-300 border-pink-400/25', icon: '🎭' },
  '教育学习': { color: 'bg-green-400/15 text-green-300 border-green-400/25', icon: '📚' },
  '商业办公': { color: 'bg-amber-400/15 text-amber-300 border-amber-400/25', icon: '💼' },
}

/* ── Toast ── */

interface ToastItem {
  id: number
  message: string
}
let toastId = 0

/* ── Component ── */

export default function PromptsPage() {
  useEffect(() => {
    document.title = `提示词模板库 | ${SITE_NAME}`
  }, [])

  const [activeCategory, setActiveCategory] = useState<PromptCategory | '全部'>('全部')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2500)
  }, [])

  const filteredPrompts = useMemo(() => {
    let result = prompts

    if (activeCategory !== '全部') {
      result = result.filter((p) => p.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }

    return result
  }, [activeCategory, searchQuery])

  const copyPrompt = useCallback(
    async (prompt: PromptTemplate) => {
      try {
        await navigator.clipboard.writeText(prompt.prompt)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setCopiedId(prompt.id)
        showToast('已复制到剪贴板')
        setTimeout(() => setCopiedId(null), 2000)
      } catch {
        showToast('复制失败，请手动复制')
      }
    },
    [showToast],
  )

  const openInChat = useCallback((prompt: PromptTemplate, platform: 'chatgpt' | 'claude') => {
    const text = encodeURIComponent(prompt.prompt)
    if (platform === 'chatgpt') {
      window.open(`https://chat.openai.com/?prompt=${text}`, '_blank', 'noopener,noreferrer')
    } else {
      window.open('https://claude.ai', '_blank', 'noopener,noreferrer')
    }
  }, [])

  const getPreviewLines = (text: string, count = 3): string => {
    return text.split('\n').slice(0, count).join('\n') + (text.split('\n').length > count ? '\n...' : '')
  }

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-3xl font-sora font-bold mb-2">
          <span className="bg-gradient-to-r from-[#00dbe7] via-[#a78bfa] to-[#f472b6] bg-clip-text text-transparent">
            提示词模板库
          </span>
        </h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl">
          收录{ prompts.length }+个精心设计的实用提示词模板，覆盖编程开发、内容创作、数据分析、翻译润色、角色扮演等场景。点击复制即可使用，也可展开查看完整Prompt。
        </p>
      </div>

      {/* ── Search + Filter Bar ── */}
      <div className="flex flex-col gap-4">
        {/* Search input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索提示词模板..."
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm',
              'bg-slate-800/60 border border-[var(--color-border)]/60',
              'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
              'focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20',
              'transition-colors duration-200',
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat
            const config = cat !== '全部' ? CATEGORY_CONFIG[cat as PromptCategory] : null
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium',
                  'border transition-all duration-200',
                  isActive
                    ? cn(
                        'border-cyan-400/40 bg-cyan-400/15 text-cyan-300 shadow-sm shadow-cyan-400/10',
                      )
                    : cn(
                        config?.color,
                        'border-[var(--color-border)]/60 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-slate-600',
                      ),
                )}
              >
                {config && <span className="text-xs">{config.icon}</span>}
                {cat}
              </button>
            )
          })}
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] font-jetbrains">
          <Filter className="h-3.5 w-3.5 text-cyan-400" />
          <span>
            共 {filteredPrompts.length} 个模板
            {(activeCategory !== '全部' || searchQuery) && '（已筛选）'}
          </span>
        </div>
      </div>

      {/* ── Empty State ── */}
      {filteredPrompts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Code2 className="h-12 w-12 text-[var(--color-text-muted)] mb-4" />
          <h3 className="text-lg font-medium text-[var(--color-text-secondary)] mb-1">未找到匹配的模板</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">尝试调整筛选条件或搜索关键词</p>
          <button
            onClick={() => {
              setActiveCategory('全部')
              setSearchQuery('')
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-slate-700 transition-colors"
          >
            清除所有筛选
          </button>
        </div>
      )}

      {/* ── Prompts Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredPrompts.map((prompt) => {
          const isExpanded = expandedId === prompt.id
          const isCopied = copiedId === prompt.id
          const catConfig = CATEGORY_CONFIG[prompt.category]
          const diffConfig = DIFFICULTY_CONFIG[prompt.difficulty]

          return (
            <div
              key={prompt.id}
              className={cn(
                'group rounded-2xl border transition-all duration-300',
                'bg-slate-900/60 hover:bg-slate-900/80',
                isExpanded
                  ? 'border-cyan-400/30 shadow-lg shadow-cyan-400/5'
                  : 'border-[var(--color-border)]/80 hover:border-[var(--color-border)]/80',
              )}
            >
              {/* ── Card Header ── */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : prompt.id)}
                className="w-full text-left p-5 pb-0"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Category badge */}
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-jetbrains font-medium border',
                        catConfig.color,
                      )}
                    >
                      <span>{catConfig.icon}</span>
                      {prompt.category}
                    </span>
                    {/* Difficulty badge */}
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-jetbrains font-medium border',
                        diffConfig.className,
                      )}
                    >
                      {prompt.difficulty}
                    </span>
                  </div>
                  {/* Copy button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      copyPrompt(prompt)
                    }}
                    className={cn(
                      'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                      isCopied
                        ? 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/25'
                        : 'bg-slate-800/60 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-slate-700/60 border border-[var(--color-border)]/40',
                    )}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3 w-3" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        复制
                      </>
                    )}
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-slate-100 mb-2 leading-snug">
                  {prompt.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[var(--color-text-secondary)] mb-3 leading-relaxed">
                  {prompt.description}
                </p>
              </button>

              {/* ── Prompt Preview (code block) ── */}
              <div className="px-5 pb-4">
                <div
                  className={cn(
                    'rounded-xl overflow-hidden transition-all duration-300',
                    'bg-[var(--color-bg-primary)]/80 border border-[var(--color-border)]/80',
                  )}
                >
                  {/* Code header bar */}
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--color-border)]/80">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    <span className="ml-2 text-[10px] font-jetbrains text-[var(--color-text-muted)]">prompt</span>
                  </div>
                  {/* Code content */}
                  <pre
                    className={cn(
                      'px-3 py-3 text-xs font-jetbrains text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap',
                      'max-h-[90px] overflow-hidden',
                      isExpanded && 'max-h-none',
                    )}
                  >
                    {isExpanded ? prompt.prompt : getPreviewLines(prompt.prompt)}
                  </pre>
                  {!isExpanded && (
                    <div className="px-3 pb-2">
                      <span className="text-[10px] font-jetbrains text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] cursor-pointer transition-colors">
                        点击展开完整提示词...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Tags ── */}
              <div className="px-5 pb-4 flex flex-wrap gap-1.5">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-[11px] font-jetbrains text-[var(--color-text-muted)] bg-slate-800/50 border border-[var(--color-border)]/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* ── Expanded Section ── */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-[var(--color-border)]/80 pt-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  {/* Model info */}
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="font-jetbrains">推荐模型：</span>
                    <span className="text-[var(--color-text-primary)]">{prompt.model}</span>
                  </div>

                  {/* External links */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[var(--color-text-secondary)]">在AI平台中试用：</span>
                    <button
                      type="button"
                      onClick={() => openInChat(prompt, 'chatgpt')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 hover:bg-emerald-400/20 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      ChatGPT
                    </button>
                    <button
                      type="button"
                      onClick={() => openInChat(prompt, 'claude')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-400/10 text-purple-300 border border-purple-400/20 hover:bg-purple-400/20 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Claude
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Toast Container ── */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          aria-label="通知"
          className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              role="alert"
              className={cn(
                'pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg',
                'animate-in slide-in-from-right fade-in duration-300',
                'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
              )}
            >
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">{t.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
