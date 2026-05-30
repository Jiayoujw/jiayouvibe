import { Cpu, Bot, BookOpen, FileText, Globe } from 'lucide-react'
import type { SearchResult } from '@/types'
import { cn } from '@/utils/cn'

const iconMap = {
  model: Cpu,
  agent: Bot,
  term: BookOpen,
  tutorial: FileText,
  directory: Globe,
} as const

const categoryLabels: Record<string, string> = {
  model: '模型',
  agent: '智能体',
  term: '术语',
  tutorial: '教程',
  directory: '导航',
}

interface SearchResultsProps {
  results: SearchResult[]
  activeIndex: number
  onSelect: (url: string) => void
  category: string
}

export default function SearchResults({
  results,
  activeIndex,
  onSelect,
  category,
}: SearchResultsProps) {
  if (results.length === 0) return null

  const Icon = iconMap[category as keyof typeof iconMap] ?? Globe

  return (
    <div className="mb-4">
      <h3 className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400/80">
        {categoryLabels[category] ?? category}
      </h3>
      <ul className="space-y-0.5" role="listbox" aria-label={categoryLabels[category] ?? category}>
        {results.map((result, index) => (
          <li key={`${category}-${index}`} role="option" aria-selected={index === activeIndex}>
            <button
              type="button"
              onClick={() => onSelect(result.url)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition-colors',
                index === activeIndex
                  ? 'bg-cyan-500/20 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon
                className="w-4 h-4 mt-0.5 shrink-0 text-slate-400"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{result.title}</div>
                <div className="text-xs text-slate-400 truncate mt-0.5">
                  {result.description}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
