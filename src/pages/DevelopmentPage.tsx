import { useState, useMemo, useEffect } from 'react'
import { Code2 } from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import { cn } from '@/utils/cn'
import { tutorials } from '@/data/tutorials'
import { TUTORIAL_CATEGORIES, TUTORIAL_DIFFICULTIES } from '@/utils/constants'
import TutorialGrid from '@/components/development/TutorialGrid'
import AdBanner from '@/components/ads/AdBanner'
import type { Tutorial } from '@/types'

type CategoryFilter = 'all' | Tutorial['category']
type DifficultyFilter = 'all' | Tutorial['difficulty']

const DIFFICULTY_FILTERS: { key: DifficultyFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'beginner', label: '入门' },
  { key: 'intermediate', label: '进阶' },
  { key: 'advanced', label: '高级' },
]

export default function DevelopmentPage() {
  useEffect(() => {
    document.title = `AI应用开发 | ${SITE_NAME}`
  }, [])

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyFilter>('all')

  const filteredTutorials = useMemo(() => {
    return tutorials.filter((t) => {
      if (activeCategory !== 'all' && t.category !== activeCategory) return false
      if (activeDifficulty !== 'all' && t.difficulty !== activeDifficulty) return false
      return true
    })
  }, [activeCategory, activeDifficulty])

  const categoryEntries = Object.entries(TUTORIAL_CATEGORIES) as [Tutorial['category'], string][]

  // Count tutorials per category for badge
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tutorials.length }
    for (const t of tutorials) {
      counts[t.category] = (counts[t.category] ?? 0) + 1
    }
    return counts
  }, [])

  return (
    <div className="py-10">
      {/* Page header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20">
            <Code2 className="w-5 h-5 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">AI应用开发</h1>
        </div>
        <p className="text-[var(--color-text-secondary)] text-base max-w-2xl">
          从零开始学习AI应用开发，涵盖提示工程、RAG、微调、Agent开发和生产部署的完整教程体系。
        </p>
      </div>

      {/* Category pills */}
      <div className="mb-6">
        <p className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider mb-3">分类筛选</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            aria-pressed={activeCategory === 'all'}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
              activeCategory === 'all'
                ? 'bg-cyan-400/15 text-cyan-300 border-cyan-400/40 shadow-sm shadow-cyan-400/10'
                : 'bg-[var(--color-bg-tertiary)]/60 text-[var(--color-text-secondary)] border-[var(--color-border)]/50 hover:border-[var(--color-border)] hover:text-[var(--color-text-primary)]',
            )}
          >
            全部
            <span className="ml-1.5 text-[11px] opacity-60 font-mono">{categoryCounts.all}</span>
          </button>

          {categoryEntries.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              aria-pressed={activeCategory === key}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
                activeCategory === key
                  ? 'bg-cyan-400/15 text-cyan-300 border-cyan-400/40 shadow-sm shadow-cyan-400/10'
                  : 'bg-[var(--color-bg-tertiary)]/60 text-[var(--color-text-secondary)] border-[var(--color-border)]/50 hover:border-[var(--color-border)] hover:text-[var(--color-text-primary)]',
              )}
            >
              {label}
              {(categoryCounts[key] ?? 0) > 0 && (
                <span className="ml-1.5 text-[11px] opacity-60 font-mono">{categoryCounts[key]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty filter chips */}
      <div className="mb-8">
        <p className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider mb-3">难度</p>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTY_FILTERS.map(({ key, label }) => {
            const diffStyle = key !== 'all' ? TUTORIAL_DIFFICULTIES[key] : null

            return (
              <button
                key={key}
                onClick={() => setActiveDifficulty(key)}
                aria-pressed={activeDifficulty === key}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border',
                  activeDifficulty === key
                    ? diffStyle
                      ? cn(diffStyle.color, 'border-current/30')
                      : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] border-[var(--color-border)]'
                    : 'bg-transparent text-[var(--color-text-muted)] border-[var(--color-border)]/60 hover:border-[var(--color-border)] hover:text-[var(--color-text-secondary)]',
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-[var(--color-text-muted)] font-mono">
          共 <span className="text-[var(--color-text-primary)]">{filteredTutorials.length}</span> 篇教程
        </p>
      </div>

      {/* Ad Banner */}
      <div className="my-8 flex justify-center">
        <AdBanner />
      </div>

      {/* Tutorial grid */}
      <TutorialGrid tutorials={filteredTutorials} />
    </div>
  )
}
