import { useState, useMemo, useEffect } from 'react'
import { Cpu } from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import { models } from '@/data/models'
import { MODEL_CATEGORIES } from '@/utils/constants'
import ModelFilter from '@/components/models/ModelFilter'
import ModelGrid from '@/components/models/ModelGrid'
import EmptyState from '@/components/ui/EmptyState'
import AdBanner from '@/components/ads/AdBanner'

const ModelsPage = () => {
  useEffect(() => {
    document.title = `AI大模型 | ${SITE_NAME}`
  }, [])

  const [searchQuery, setSearchQuery] = useState('')
  const [providerFilter, setProviderFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Derive unique providers from data
  const providers = useMemo(() => {
    const set = new Set(models.map((m) => m.provider))
    return Array.from(set).sort()
  }, [])

  // Filter models
  const filteredModels = useMemo(() => {
    let result = models

    // Search filter (name, description, tags)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }

    // Provider filter
    if (providerFilter) {
      result = result.filter((m) => m.provider === providerFilter)
    }

    // Category filter
    if (categoryFilter) {
      result = result.filter((m) => m.category === categoryFilter)
    }

    return result
  }, [searchQuery, providerFilter, categoryFilter])

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-sora font-bold text-white mb-2">AI大模型</h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl">
          收录全球主流AI大模型，涵盖大语言模型、多模态、图像生成、视频生成、音频处理等类别，帮助你全面了解AI模型生态。
        </p>
      </div>

      {/* Filter Bar */}
      <ModelFilter
        providers={providers}
        categories={MODEL_CATEGORIES}
        searchQuery={searchQuery}
        onProviderChange={setProviderFilter}
        onCategoryChange={setCategoryFilter}
        onSearchChange={setSearchQuery}
      />

      {/* Results count */}
      <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] font-jetbrains">
        <Cpu className="h-4 w-4 text-cyan-400" />
        <span>
          共 {filteredModels.length} 个模型
          {(providerFilter || categoryFilter || searchQuery) && '（已筛选）'}
        </span>
      </div>

      {/* Model Grid or Empty */}
      {filteredModels.length > 0 ? (
        <>
          <ModelGrid models={filteredModels} />
          <AdBanner />
        </>
      ) : (
        <EmptyState
          icon={<Cpu className="h-6 w-6 text-[var(--color-text-secondary)]" />}
          title="未找到匹配的模型"
          description="尝试调整筛选条件或搜索关键词"
          action={{
            label: '清除所有筛选',
            onClick: () => {
              setSearchQuery('')
              setProviderFilter('')
              setCategoryFilter('')
            },
          }}
        />
      )}
    </div>
  )
}

export default ModelsPage
