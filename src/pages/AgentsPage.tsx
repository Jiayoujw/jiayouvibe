import { useState, useMemo, useEffect } from 'react'
import { Bot } from 'lucide-react'
import { agents } from '@/data/agents'
import { SITE_NAME } from '@/utils/constants'
import Breadcrumb from '@/components/ui/Breadcrumb'
import AgentCard from '@/components/agents/AgentCard'
import AgentFilter from '@/components/agents/AgentFilter'

export default function AgentsPage() {
  useEffect(() => {
    document.title = `AI智能体 | ${SITE_NAME}`
  }, [])

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      // Type filter
      if (typeFilter && agent.type !== typeFilter) return false

      // Search filter (name, description, tags)
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        const matchName = agent.name.toLowerCase().includes(q)
        const matchDesc = agent.description.toLowerCase().includes(q)
        const matchTags = agent.tags.some((t) => t.toLowerCase().includes(q))
        if (!matchName && !matchDesc && !matchTags) return false
      }

      return true
    })
  }, [search, typeFilter])

  return (
    <div className="py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        className="mb-6"
        items={[
          { label: '首页', href: '/#/' },
          { label: 'AI智能体' },
        ]}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20">
            <Bot className="w-5 h-5 text-cyan-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-sora font-bold text-slate-100">
            AI智能体
          </h1>
        </div>
        <p className="text-[var(--color-text-secondary)] text-sm sm:text-base max-w-2xl">
          探索最前沿的AI Agent框架、平台、工具和独立智能体，了解它们的特性、应用场景和开发资源
        </p>
      </div>

      {/* Filter */}
      <AgentFilter
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
      />

      {/* Results count */}
      <p className="text-sm text-[var(--color-text-muted)] mb-6 font-jetbrains">
        共 {filteredAgents.length} 个智能体
      </p>

      {/* Grid */}
      {filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.slug} agent={agent} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bot className="w-12 h-12 text-[var(--color-text-muted)] mb-4" />
          <p className="text-[var(--color-text-muted)] text-lg font-medium mb-1">没有找到匹配的智能体</p>
          <p className="text-[var(--color-text-muted)] text-sm">尝试调整筛选条件或搜索关键词</p>
        </div>
      )}
    </div>
  )
}
