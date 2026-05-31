import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ArrowUp, ArrowDown, CornerDownLeft } from 'lucide-react'
import { search, buildSearchIndex } from '@/services/searchIndex'
import type { SearchResult } from '@/types'
import SearchResults from '@/components/search/SearchResults'
import { useSearchContext } from '@/contexts/SearchContext'

const CATEGORY_ORDER = ['model', 'agent', 'term', 'tutorial', 'directory'] as const

interface SearchModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function SearchModal({ open, onOpenChange }: SearchModalProps = {}) {
  const searchCtx = useSearchContext()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Use context in controlled mode when no explicit props given
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : searchCtx.isOpen

  // Pre-build the Fuse index on first mount so the first keystroke is instant
  useEffect(() => {
    buildSearchIndex()
  }, [])

  // Auto-focus the search input when the modal appears
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Full close: dismiss modal and reset all state
  const closeModal = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(false)
    } else {
      searchCtx.closeSearch()
    }
    setQuery('')
    setResults([])
    setActiveIndex(0)
  }, [isControlled, onOpenChange, searchCtx])

  // Debounced search — fires 150 ms after the user stops typing
  useEffect(() => {
    if (!isOpen) return
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setActiveIndex(0)
      return
    }
    const timer = setTimeout(() => {
      const found = search(trimmed)
      setResults(found)
      setActiveIndex(0)
    }, 150)
    return () => clearTimeout(timer)
  }, [query, isOpen])

  // Group results by type, preserving category order
  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>()
    for (const r of results) {
      const list = map.get(r.type)
      if (list) {
        list.push(r)
      } else {
        map.set(r.type, [r])
      }
    }
    return map
  }, [results])

  // Flat list for keyboard navigation (one-dimensional index across all categories)
  const flatResults = useMemo(() => {
    const flat: { result: SearchResult; globalIndex: number }[] = []
    let idx = 0
    for (const cat of CATEGORY_ORDER) {
      const list = grouped.get(cat)
      if (list) {
        for (const r of list) {
          flat.push({ result: r, globalIndex: idx })
          idx++
        }
      }
    }
    return flat
  }, [grouped])

  // Navigate on selection
  const handleSelect = useCallback(
    (url: string) => {
      navigate(url)
      closeModal()
    },
    [navigate, closeModal],
  )

  // Keyboard navigation within the modal
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeModal()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((prev) => Math.min(prev + 1, flatResults.length - 1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((prev) => Math.max(prev - 1, 0))
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        if (flatResults.length > 0 && activeIndex >= 0 && activeIndex < flatResults.length) {
          handleSelect(flatResults[activeIndex].result.url)
        }
      }
    },
    [flatResults, activeIndex, handleSelect, closeModal],
  )

  // Lock body scroll while the overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const hasQuery = query.trim().length > 0
  const hasResults = results.length > 0

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="搜索">
      {/* Dark glass backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Centered glass panel */}
      <div className="relative z-10 max-w-2xl mx-auto mt-32 px-4">
        <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden">
          {/* ── Search input ── */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            <Search className="w-5 h-5 text-slate-400 shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="搜索模型、智能体、术语、教程..."
              className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-base"
              autoComplete="off"
              spellCheck={false}
              aria-label="搜索关键词"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="清除搜索"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ── Results list ── */}
          <div className="max-h-[60vh] overflow-y-auto px-2 py-3">
            {hasQuery && !hasResults ? (
              <div className="text-center py-12 text-slate-400 text-sm">未找到相关结果</div>
            ) : (
              CATEGORY_ORDER.map((cat) => {
                const list = grouped.get(cat)
                if (!list || list.length === 0) return null
                // Compute the local active index within this group
                const groupStartIndex = flatResults.findIndex((f) => f.result.type === cat)
                const localActive =
                  groupStartIndex === -1 ? -1 : activeIndex - groupStartIndex
                const isInGroup = localActive >= 0 && localActive < list.length
                return (
                  <SearchResults
                    key={cat}
                    results={list}
                    activeIndex={isInGroup ? localActive : -1}
                    onSelect={handleSelect}
                    category={cat}
                  />
                )
              })
            )}
          </div>

          {/* ── Keyboard shortcuts footer ── */}
          <div className="flex items-center gap-5 px-4 py-2.5 border-t border-white/5 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              <ArrowDown className="w-3 h-3" />
              <span>导航</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" />
              <span>选择</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center h-4 px-1 rounded bg-white/10 text-[10px] text-slate-400">
                Esc
              </kbd>
              <span>关闭</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
