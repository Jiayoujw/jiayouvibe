import { Search } from 'lucide-react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { cn } from '@/utils/cn'

interface ModelFilterProps {
  providers: string[]
  categories: Record<string, string>
  searchQuery: string
  onProviderChange: (provider: string) => void
  onCategoryChange: (category: string) => void
  onSearchChange: (query: string) => void
}

const ModelFilter = ({
  providers,
  categories,
  searchQuery,
  onProviderChange,
  onCategoryChange,
  onSearchChange,
}: ModelFilterProps) => {
  return (
    <div
      className={cn(
        'bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4',
        'flex flex-col sm:flex-row gap-4',
      )}
    >
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
        <Input
          type="text"
          placeholder="搜索模型名称、描述、标签..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Provider Filter */}
      <div className="w-full sm:w-48">
        <div className="relative">
          <Select
            value=""
            onChange={(e) => onProviderChange(e.target.value)}
            className="w-full"
            aria-label="按厂商筛选"
          >
            <option value="">全部厂商</option>
            {providers.map((provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Category Filter */}
      <div className="w-full sm:w-40">
        <div className="relative">
          <Select
            value=""
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full"
            aria-label="按类别筛选"
          >
            <option value="">全部类别</option>
            {Object.entries(categories).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}

export default ModelFilter
