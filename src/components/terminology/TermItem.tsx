import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import Badge from '@/components/ui/Badge'
import { TERM_CATEGORIES } from '@/utils/constants'
import type { Term } from '@/types'

interface TermItemProps {
  term: Term
  isExpanded: boolean
  onToggle: () => void
}

const categoryColorMap: Record<string, 'cyan' | 'purple' | 'pink' | 'amber' | 'green'> = {
  foundation: 'cyan',
  model: 'purple',
  training: 'amber',
  inference: 'green',
  architecture: 'pink',
  application: 'cyan',
  ethics: 'pink',
  tool: 'green',
}

export default function TermItem({ term, isExpanded, onToggle }: TermItemProps) {
  const categoryColor = categoryColorMap[term.category] || 'cyan'

  return (
    <div
      className={cn(
        'bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden',
        'transition-all duration-300',
        isExpanded
          ? 'border-cyan-400/20 bg-white/[0.05] shadow-[0_0_20px_rgba(34,211,238,0.04)]'
          : 'hover:border-white/[0.10] hover:bg-white/[0.04]',
      )}
    >
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 text-left group"
      >
        <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {/* Chinese term name */}
          <span className="text-base font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
            {term.term}
          </span>

          {/* English name */}
          {term.englishName && (
            <span className="text-sm text-slate-500 hidden sm:inline">
              {term.englishName}
            </span>
          )}

          {/* Abbreviation badge */}
          {term.abbreviation && (
            <Badge variant="outline" color="cyan" className="shrink-0 font-bold">
              {term.abbreviation}
            </Badge>
          )}

          {/* Category badge */}
          <Badge variant="default" color={categoryColor} className="shrink-0 hidden sm:inline-flex">
            {TERM_CATEGORIES[term.category] || term.category}
          </Badge>
        </div>

        {/* Expand chevron */}
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 transition-all duration-300',
            isExpanded ? 'rotate-180 text-cyan-400' : 'text-slate-600 group-hover:text-slate-400',
          )}
        />
      </button>

      {/* Expandable content — grid animation for smooth height transition */}
      <div
        className={cn(
          'grid transition-all duration-300',
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 space-y-5 border-t border-white/[0.06] pt-5">
            {/* Definition */}
            <div>
              <h4 className="text-[11px] font-jetbrains font-semibold text-cyan-400 uppercase tracking-[0.15em] mb-2">
                定义
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {term.definition}
              </p>
            </div>

            {/* Detailed Explanation */}
            {term.detailedExplanation && (
              <div>
                <h4 className="text-[11px] font-jetbrains font-semibold text-cyan-400 uppercase tracking-[0.15em] mb-2">
                  详细解释
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {term.detailedExplanation}
                </p>
              </div>
            )}

            {/* Related Terms */}
            {term.relatedTerms.length > 0 && (
              <div>
                <h4 className="text-[11px] font-jetbrains font-semibold text-cyan-400 uppercase tracking-[0.15em] mb-2">
                  相关术语
                </h4>
                <div className="flex flex-wrap gap-2">
                  {term.relatedTerms.map((related) => (
                    <span
                      key={related}
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-md',
                        'text-xs font-medium',
                        'bg-cyan-400/5 text-cyan-300 border border-cyan-400/15',
                        'hover:bg-cyan-400/15 hover:border-cyan-400/30',
                        'cursor-pointer transition-colors duration-200',
                      )}
                    >
                      {related}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {term.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {term.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-jetbrains text-slate-500 bg-white/[0.04] rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
