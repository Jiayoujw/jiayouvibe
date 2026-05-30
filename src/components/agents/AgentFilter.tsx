import { Search } from 'lucide-react'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { AGENT_TYPES } from '@/utils/constants'

interface AgentFilterProps {
  search: string
  onSearchChange: (value: string) => void
  typeFilter: string
  onTypeChange: (value: string) => void
}

export default function AgentFilter({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
}: AgentFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {/* Type dropdown */}
      <Select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value)}
        className="sm:w-48"
      >
        <option value="">全部类型</option>
        {Object.entries(AGENT_TYPES).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </Select>

      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <Input
          type="text"
          placeholder="搜索智能体名称、描述、标签..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  )
}
