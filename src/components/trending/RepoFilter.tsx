import { Search } from 'lucide-react'
import { cn } from '@/utils/cn'

const LANGUAGES = [
  { label: '全部', value: '' },
  { label: 'Python', value: 'python' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
] as const

const TIME_OPTIONS = [
  { label: '今日', value: 'daily' },
  { label: '本周', value: 'weekly' },
  { label: '本月', value: 'monthly' },
] as const

interface RepoFilterProps {
  language: string
  since: string
  searchQuery: string
  onLanguageChange: (language: string) => void
  onSinceChange: (since: string) => void
  onSearchChange: (query: string) => void
}

const RepoFilter = ({
  language,
  since,
  searchQuery,
  onLanguageChange,
  onSinceChange,
  onSearchChange,
}: RepoFilterProps) => {
  return (
    <div
      className={cn(
        'p-4 rounded-2xl',
        'bg-white/5 backdrop-blur-xl border border-white/10',
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Time tabs */}
        <div
          role="tablist"
          className={cn(
            'flex gap-1 rounded-xl bg-white/5 p-1 border border-white/5',
            'flex-shrink-0',
          )}
        >
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              role="tab"
              aria-selected={since === opt.value}
              onClick={() => onSinceChange(opt.value)}
              className={cn(
                'relative px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
                since === opt.value
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Language dropdown */}
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className={cn(
            'flex-shrink-0 rounded-xl px-4 py-2 text-xs text-slate-100',
            'bg-white/5 backdrop-blur-sm border border-white/10',
            'appearance-none cursor-pointer',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:border-cyan-400/50 focus-visible:ring-2 focus-visible:ring-cyan-400/20',
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.25rem 1.25rem',
            paddingRight: '2.5rem',
          }}
        >
          {LANGUAGES.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-800 text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Search input */}
        <div className="relative flex-1 w-full sm:w-auto min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <label htmlFor="repo-search-input" className="sr-only">搜索项目</label>
          <input
            id="repo-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索项目..."
            className={cn(
              'w-full rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500',
              'bg-white/5 backdrop-blur-sm border border-white/10',
              'transition-colors duration-200',
              'focus-visible:outline-none focus-visible:border-cyan-400/50 focus-visible:ring-2 focus-visible:ring-cyan-400/20',
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default RepoFilter
