import { useState, useMemo, useEffect } from 'react'
import { Send, Sparkles, Globe } from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import { directoryEntries } from '@/data/directory'
import { DIRECTORY_CATEGORIES } from '@/utils/constants'
import { cn } from '@/utils/cn'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import DirectoryCard from '@/components/directory/DirectoryCard'

const categoryKeys = Object.keys(DIRECTORY_CATEGORIES) as Array<keyof typeof DIRECTORY_CATEGORIES>

const DirectoryPage = () => {
  useEffect(() => {
    document.title = `AI网站导航 | ${SITE_NAME}`
  }, [])

  const [activeCategory, setActiveCategory] = useState('all')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  const filteredEntries = useMemo(() => {
    return directoryEntries.filter((entry) => {
      if (activeCategory !== 'all' && entry.category !== activeCategory) return false
      if (showFeaturedOnly && !entry.featured) return false
      return true
    })
  }, [activeCategory, showFeaturedOnly])

  return (
    <div className="min-h-screen">
      {/* ========== Hero / Header ========== */}
      <section className="relative pt-12 pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-4">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-300 tracking-wide">AI 网站收录</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="gradient-text">AI 网站导航</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto text-sm leading-relaxed">
            精选 AI 模型平台、开发工具、学习资源和社区论坛，一站式发现优质 AI 网站。
          </p>
        </div>
      </section>

      {/* ========== Filters: Category Tabs + Featured Toggle ========== */}
      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Category tab bar */}
            <div
              role="tablist"
              className="flex gap-1 rounded-xl bg-white/5 p-1 border border-white/5 flex-wrap"
            >
              <button
                role="tab"
                aria-selected={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
                  activeCategory === 'all'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.03]',
                )}
              >
                全部
              </button>
              {categoryKeys.map((key) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={activeCategory === key}
                  onClick={() => setActiveCategory(key)}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
                    activeCategory === key
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.03]',
                  )}
                >
                  {DIRECTORY_CATEGORIES[key]}
                </button>
              ))}
            </div>

            {/* Featured toggle */}
            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none flex-shrink-0">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-[var(--color-text-secondary)]">仅显示精选</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                />
                <div className="w-9 h-5 rounded-full bg-white/10 peer-checked:bg-purple-500/40 transition-colors duration-200" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* ========== Card Grid ========== */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {filteredEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEntries.map((entry) => (
                <DirectoryCard key={entry.id} entry={entry} featured={entry.featured} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Globe className="w-12 h-12 text-[var(--color-text-muted)] mb-4" />
              <p className="text-[var(--color-text-muted)] text-sm">暂无符合条件的网站</p>
              <p className="text-[var(--color-text-muted)] text-xs mt-1">尝试切换分类或关闭精选筛选</p>
            </div>
          )}

          {/* Count */}
          <p className="text-center text-xs text-[var(--color-text-muted)] mt-8">
            共 {filteredEntries.length} 个网站
            {showFeaturedOnly && ' · 仅精选'}
            {activeCategory !== 'all' && ` · ${DIRECTORY_CATEGORIES[activeCategory as keyof typeof DIRECTORY_CATEGORIES]}`}
          </p>
        </div>
      </section>

      {/* ========== Recommendation Form ========== */}
      <section className="px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-3">
                <Send className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-medium text-purple-300 tracking-wide">推荐网站</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 mb-1">发现了好网站？</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                填写下方表单推荐给我们，审核通过后将收录到导航中。
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert('感谢推荐！我们将在审核后收录该网站。')
              }}
              aria-describedby="rec-form-hint"
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rec-site-name" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">网站名称</label>
                  <Input id="rec-site-name" placeholder="例如：OpenAI Platform" required />
                </div>
                <div>
                  <label htmlFor="rec-site-url" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">网站地址</label>
                  <Input id="rec-site-url" type="url" placeholder="https://" required />
                </div>
              </div>

              <div>
                <label htmlFor="rec-site-category" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">所属分类</label>
                <Select id="rec-site-category" required defaultValue="">
                  <option value="" disabled>请选择分类</option>
                  {categoryKeys.map((key) => (
                    <option key={key} value={key}>
                      {DIRECTORY_CATEGORIES[key]}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label htmlFor="rec-site-desc" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">网站简介</label>
                <Textarea id="rec-site-desc" placeholder="简单介绍一下这个网站（200字以内）" rows={3} maxLength={200} />
              </div>

              <button
                type="submit"
                className="btn-primary w-full justify-center"
              >
                <Send className="w-4 h-4" />
                提交推荐
              </button>

              <p id="rec-form-hint" className="text-center text-[11px] text-[var(--color-text-muted)] mt-2">
                提交后经审核收录
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DirectoryPage
