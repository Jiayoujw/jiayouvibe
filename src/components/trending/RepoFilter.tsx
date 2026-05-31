import { Search } from 'lucide-react'
import { cn } from '@/utils/cn'

const TIME_OPTIONS = [
  { label: '今日', value: 'daily' },
  { label: '本周', value: 'weekly' },
  { label: '本月', value: 'monthly' },
  { label: '本年', value: 'yearly' },
] as const

const LANGUAGES = [
  { label: '全部', value: '' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'Vue', value: 'vue' },
] as const

const SORT_OPTIONS = [
  { label: '最多Stars', value: 'stars' },
  { label: '最多Forks', value: 'forks' },
  { label: '最近更新', value: 'updated' },
] as const

const MIN_STARS_OPTIONS = [
  { label: '不限', value: 0 },
  { label: '10+', value: 10 },
  { label: '100+', value: 100 },
  { label: '1,000+', value: 1000 },
] as const

interface RepoFilterProps {
  language: string
  since: string
  searchQuery: string
  sort: string
  minStars: number
  onLanguageChange: (language: string) => void
  onSinceChange: (since: string) => void
  onSearchChange: (query: string) => void
  onSortChange: (sort: string) => void
  onMinStarsChange: (minStars: number) => void
}

function PillGroup<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: readonly { label: string; value: T }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-1.5 rounded-xl bg-[var(--glass-bg)] p-1 border border-[var(--glass-border)]',
      )}
    >
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          onClick={() => onChange(opt.value)}
          className={cn(
            'relative px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
            value === opt.value
              ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-sm'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.03]',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

const RepoFilter = ({
  language,
  since,
  searchQuery,
  sort,
  minStars,
  onLanguageChange,
  onSinceChange,
  onSearchChange,
  onSortChange,
  onMinStarsChange,
}: RepoFilterProps) => {
  return (
    <div
      className={cn(
        'p-5 rounded-2xl space-y-4',
        'bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]',
      )}
    >
      {/* Row 1: Time tabs */}
      <div>
        <span className="block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2 font-jetbrains">
          时间范围
        </span>
        <PillGroup
          options={TIME_OPTIONS}
          value={since}
          onChange={onSinceChange as (value: string | number) => void}
        />
      </div>

      {/* Row 2: Language pills */}
      <div>
        <span className="block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2 font-jetbrains">
          编程语言
        </span>
        <PillGroup
          options={LANGUAGES}
          value={language}
          onChange={onLanguageChange as (value: string | number) => void}
        />
      </div>

      {/* Row 3: Sort + Stars filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <span className="block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2 font-jetbrains">
            排序方式
          </span>
          <PillGroup
            options={SORT_OPTIONS}
            value={sort}
            onChange={onSortChange as (value: string | number) => void}
          />
        </div>
        <div className="flex-1">
          <span className="block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2 font-jetbrains">
            最低Stars
          </span>
          <PillGroup
            options={MIN_STARS_OPTIONS}
            value={minStars}
            onChange={onMinStarsChange as (value: string | number) => void}
          />
        </div>
      </div>

      {/* Row 4: Search input */}
      <div>
        <span className="block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2 font-jetbrains">
          搜索项目
        </span>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
          <label htmlFor="repo-search-input" className="sr-only">搜索项目</label>
          <input
            id="repo-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="输入项目名称、描述或标签..."
            className={cn(
              'w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
              'bg-[var(--glass-bg)] backdrop-blur-sm border border-[var(--glass-border)]',
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
