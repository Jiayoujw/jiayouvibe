import { useState, useMemo, useCallback, useEffect } from 'react'
import { Search } from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import Input from '@/components/ui/Input'
import AlphabetIndex from '@/components/terminology/AlphabetIndex'
import TermItem from '@/components/terminology/TermItem'
import { terms } from '@/data/terminology'
import type { Term } from '@/types'

/** Extract the sort/group key from a term: first letter of englishName, uppercased. */
function getGroupLetter(term: Term): string {
  if (term.englishName) {
    return term.englishName.charAt(0).toUpperCase()
  }
  // Fallback — use first char of the Chinese term (unlikely path since all data has englishName)
  return term.term.charAt(0).toUpperCase()
}

/** Group an array of terms by their group letter, returning a map sorted by letter. */
function groupByLetter(list: Term[]): Record<string, Term[]> {
  const raw: Record<string, Term[]> = {}
  for (const t of list) {
    const ch = getGroupLetter(t)
    if (!raw[ch]) raw[ch] = []
    raw[ch].push(t)
  }
  // Return with keys sorted alphabetically
  const sorted: Record<string, Term[]> = {}
  Object.keys(raw)
    .sort((a, b) => a.localeCompare(b, 'en'))
    .forEach((k) => {
      sorted[k] = raw[k]
    })
  return sorted
}

export default function TerminologyPage() {
  useEffect(() => {
    document.title = `AI专业术语 | ${SITE_NAME}`
  }, [])

  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeLetter, setActiveLetter] = useState('')

  // ---- Filtered terms (memoised) ----
  const filteredTerms = useMemo<Term[]>(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return terms

    return terms.filter((t) => {
      return (
        t.term.includes(q) ||
        (t.englishName && t.englishName.toLowerCase().includes(q)) ||
        (t.abbreviation && t.abbreviation.toLowerCase().includes(q)) ||
        t.definition.includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        t.relatedTerms.some((r) => r.includes(q))
      )
    })
  }, [searchQuery])

  // ---- Grouped terms (memoised) ----
  const groupedTerms = useMemo(() => groupByLetter(filteredTerms), [filteredTerms])

  // ---- Generated letters for the A-Z index (memoised) ----
  const letters = useMemo(() => Object.keys(groupedTerms), [groupedTerms])

  // ---- Handlers ----
  const handleLetterClick = useCallback(
    (letter: string) => {
      setActiveLetter(letter)
      const target = document.getElementById(`term-group-${letter}`)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    [],
  )

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  // ---- Render ----
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* ======== Page Header ======== */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">
          AI 专业术语
          <span className="ml-3 text-sm font-jetbrains font-normal text-[var(--color-text-muted)] align-super">
            {terms.length} 条
          </span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm sm:text-base max-w-2xl leading-relaxed">
          涵盖基础概念、模型架构、训练方法、推理优化、应用场景、伦理安全与工具框架的系统化 AI 术语词典。
        </p>
      </div>

      {/* ======== Large Search ======== */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)] pointer-events-none" />
        <Input
          type="text"
          placeholder="搜索术语名称、缩写、定义或相关概念 …"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-14 text-base"
        />
      </div>

      {/* ======== Sticky A–Z Index ======== */}
      {letters.length > 0 && (
        <div
          className="sticky top-20 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3
            bg-[var(--color-bg-primary)]/85 backdrop-blur-xl border-b border-white/[0.06]"
        >
          <AlphabetIndex
            letters={letters}
            activeLetter={activeLetter}
            onLetterClick={handleLetterClick}
          />
        </div>
      )}

      {/* ======== Term Groups ======== */}
      <div className="space-y-12 mt-1">
        {Object.entries(groupedTerms).map(([letter, letterTerms]) => (
          <section key={letter} id={`term-group-${letter}`}>
            {/* Letter header with line decoration */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-2xl font-jetbrains font-bold text-cyan-400 shrink-0 select-none">
                {letter}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/30 via-cyan-400/10 to-transparent" />
              <span className="text-[11px] font-jetbrains text-[var(--color-text-muted)] shrink-0 tracking-wider">
                {letterTerms.length} 条
              </span>
            </div>

            {/* Term cards */}
            <div className="space-y-3">
              {letterTerms.map((term) => (
                <TermItem
                  key={term.id}
                  term={term}
                  isExpanded={expandedId === term.id}
                  onToggle={() => handleToggle(term.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ======== Empty State ======== */}
      {filteredTerms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-[var(--color-text-muted)]">
          <Search className="h-14 w-14 mb-5 opacity-25" />
          <p className="text-lg font-medium text-[var(--color-text-secondary)]">没有找到匹配的术语</p>
          <p className="text-sm mt-1.5 text-[var(--color-text-muted)]">尝试更换搜索关键词</p>
        </div>
      )}

      {filteredTerms.length > 0 && (
        <p className="text-center text-xs text-[var(--color-text-muted)] mt-16">
          共 {filteredTerms.length} 个术语
          {searchQuery.trim() && (
            <span> — 搜索结果</span>
          )}
        </p>
      )}
    </div>
  )
}
