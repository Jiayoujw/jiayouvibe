import { useState, useEffect, useMemo, useRef } from 'react'
import { Cpu, Plus, Search } from 'lucide-react'
import { models } from '@/data/models'
import { SITE_NAME } from '@/utils/constants'
import type { AIModel } from '@/types'
import { cn } from '@/utils/cn'
import ComparisonTable from '@/components/models/ComparisonTable'

export default function ComparisonPage() {
  useEffect(() => {
    document.title = `AI模型对比 | ${SITE_NAME}`
  }, [])

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([])
  const [addPanelOpen, setAddPanelOpen] = useState(false)
  const [addSearch, setAddSearch] = useState('')
  const addPanelRef = useRef<HTMLDivElement>(null)

  // Look up selected AIModel objects
  const selectedModels: AIModel[] = useMemo(() => {
    return selectedSlugs
      .map((slug) => models.find((m) => m.slug === slug)!)
      .filter(Boolean)
  }, [selectedSlugs])

  // Models not yet selected
  const availableModels = useMemo(() => {
    return models.filter((m) => !selectedSlugs.includes(m.slug))
  }, [selectedSlugs])

  // Filter available models by search in the add panel
  const filteredAvailable = useMemo(() => {
    if (!addSearch.trim()) return availableModels
    const q = addSearch.toLowerCase()
    return availableModels.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [availableModels, addSearch])

  // Toggle a model's selection (max 4)
  const toggleModel = (slug: string) => {
    setSelectedSlugs((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug)
      }
      if (prev.length >= 4) return prev
      return [...prev, slug]
    })
  }

  // Close add panel on outside click
  useEffect(() => {
    if (!addPanelOpen) return
    const handleClick = (e: MouseEvent) => {
      if (addPanelRef.current && !addPanelRef.current.contains(e.target as Node)) {
        setAddPanelOpen(false)
        setAddSearch('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [addPanelOpen])

  const atMaxSelections = selectedSlugs.length >= 4

  return (
    <div className="space-y-8">
      {/* ===== Page Title ===== */}
      <div>
        <h1 className="text-3xl font-sora font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
          AI模型对比
        </h1>
        <p className="text-slate-400 max-w-2xl">
          选择最多4个AI模型，横向对比提供商、参数规模、上下文窗口、价格、API可用性、开源情况、优劣势和适用场景。
        </p>
      </div>

      {/* ===== Model Selector Chips ===== */}
      <div
        className={cn(
          'bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4',
        )}
      >
        <p className="text-xs text-slate-500 font-jetbrains mb-3 uppercase tracking-wider">
          选择模型 <span className="text-cyan-400">{selectedSlugs.length}</span>/4
        </p>
        <div className="flex flex-wrap gap-2">
          {models.map((model) => {
            const isSelected = selectedSlugs.includes(model.slug)
            const disabled = !isSelected && atMaxSelections

            return (
              <button
                key={model.slug}
                onClick={() => toggleModel(model.slug)}
                disabled={disabled}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-jetbrains font-medium tracking-wide transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
                  isSelected
                    ? 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : disabled
                      ? 'bg-white/[0.02] text-slate-600 border border-white/[0.04] cursor-not-allowed'
                      : 'bg-white/[0.04] text-slate-400 border border-white/[0.08] hover:bg-white/[0.08] hover:text-slate-200 hover:border-white/20',
                )}
              >
                {model.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* ===== Comparison Table or Empty State ===== */}
      {selectedModels.length > 0 ? (
        <ComparisonTable selectedModels={selectedModels} />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="mb-5">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
              <Cpu className="h-8 w-8 text-slate-500" />
            </div>
          </div>
          <h3 className="text-xl font-sora font-semibold text-slate-300 mb-2">
            请选择要对比的AI模型
          </h3>
          <p className="text-sm text-slate-500 max-w-md">
            在上方点击模型标签，选择最多4个AI模型，即可开始横向对比
          </p>
        </div>
      )}

      {/* ===== Add Model Button / Panel at Bottom ===== */}
      <div className="flex justify-center">
        {!atMaxSelections ? (
          <div ref={addPanelRef} className="relative">
            {/* Toggle button */}
            <button
              onClick={() => {
                setAddPanelOpen((prev) => !prev)
                setAddSearch('')
              }}
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-sora font-medium',
                'bg-white/[0.04] border border-dashed border-white/15',
                'text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] hover:border-cyan-400/40',
                'transition-all duration-200',
              )}
            >
              <Plus className="h-4 w-4" />
              添加模型对比
            </button>

            {/* Dropdown panel */}
            {addPanelOpen && (
              <div
                className={cn(
                  'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80',
                  'bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-xl',
                  'shadow-xl shadow-black/40 z-30',
                )}
              >
                {/* Search input */}
                <div className="relative m-2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="搜索模型名称、厂商..."
                    value={addSearch}
                    onChange={(e) => setAddSearch(e.target.value)}
                    autoFocus
                    className={cn(
                      'w-full pl-8 pr-3 py-2 text-sm',
                      'bg-white/[0.05] border border-white/10 rounded-lg',
                      'text-slate-200 placeholder:text-slate-500',
                      'focus:outline-none focus:border-cyan-400/40',
                      'font-jetbrains',
                    )}
                  />
                </div>

                {/* Model list */}
                <div className="max-h-56 overflow-y-auto px-1 pb-1">
                  {filteredAvailable.length > 0 ? (
                    filteredAvailable.map((m) => (
                      <button
                        key={m.slug}
                        onClick={() => {
                          toggleModel(m.slug)
                          setAddPanelOpen(false)
                          setAddSearch('')
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150',
                          'text-slate-300 hover:bg-white/[0.08] hover:text-white',
                        )}
                      >
                        <span className="font-medium">{m.name}</span>
                        <span className="text-slate-500 ml-1.5 text-xs font-jetbrains">
                          {m.provider}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-6 font-jetbrains">
                      {addSearch.trim() ? '无匹配模型' : '所有模型已添加'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            disabled
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-sora font-medium',
              'bg-white/[0.02] border border-white/[0.04] text-slate-600 cursor-not-allowed',
            )}
          >
            <Plus className="h-4 w-4" />
            已选满4个模型
          </button>
        )}
      </div>
    </div>
  )
}
