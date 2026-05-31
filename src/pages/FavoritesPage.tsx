import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, ExternalLink, Star, Trash2, Cpu, Bot, Code2, Wrench } from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import { useFavorites, type FavoriteItem } from '@/contexts/FavoritesContext'
import { cn } from '@/utils/cn'

const TYPE_CONFIG: Record<string, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  model: { label: 'AI大模型', Icon: Cpu },
  agent: { label: 'AI智能体', Icon: Bot },
  tool: { label: 'AI工具', Icon: Wrench },
  tutorial: { label: '开发教程', Icon: Code2 },
}

function FavoriteRow({ item }: { item: FavoriteItem }) {
  const { dispatch } = useFavorites()
  const config = TYPE_CONFIG[item.type]
  const TypeIcon = config?.Icon ?? Star
  const isExternal = item.url.startsWith('http')

  return (
    <div
      className={cn(
        'glass-card p-4 flex items-center gap-4',
        'hover:bg-white/[0.06] transition-colors duration-200',
      )}
    >
      {/* Type badge */}
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium shrink-0',
          'bg-cyan-400/10 text-cyan-300 border border-cyan-400/20',
        )}
      >
        <TypeIcon className="w-3 h-3" />
        {config?.label ?? item.type}
      </span>

      {/* Item link */}
      <div className="flex-1 min-w-0">
        {isExternal ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-200 font-medium hover:text-cyan-300 transition-colors"
          >
            <span className="truncate">{item.name}</span>
            <ExternalLink className="w-3 h-3 shrink-0 text-slate-500" />
          </a>
        ) : (
          <Link
            to={item.url}
            className="text-slate-200 font-medium hover:text-cyan-300 transition-colors truncate block"
          >
            {item.name}
          </Link>
        )}
        <p className="text-xs text-slate-500 truncate mt-0.5">{item.url}</p>
      </div>

      {/* Added date */}
      <span className="text-xs text-slate-600 shrink-0 hidden sm:block">
        {new Date(item.addedAt).toLocaleDateString('zh-CN')}
      </span>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => dispatch({ type: 'REMOVE_FAVORITE', payload: item.id })}
        className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 shrink-0"
        title="取消收藏"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function FavoritesPage() {
  useEffect(() => {
    document.title = `我的收藏 | ${SITE_NAME}`
  }, [])

  const {
    state: { favorites },
  } = useFavorites()

  const grouped = favorites.reduce(
    (acc, item) => {
      if (!acc[item.type]) acc[item.type] = []
      acc[item.type].push(item)
      return acc
    },
    {} as Record<string, FavoriteItem[]>,
  )

  const typeOrder: Array<keyof typeof TYPE_CONFIG> = ['model', 'agent', 'tutorial', 'tool']

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">我的收藏</h1>
        <p className="text-slate-400 text-sm">
          共收藏了{' '}
          <span className="text-amber-400 font-semibold">{favorites.length}</span>{' '}
          个内容
        </p>
      </div>

      {/* Empty state */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-5">
            <Bookmark className="w-10 h-10 text-slate-600" />
          </div>
          <p className="text-slate-400 text-lg font-medium mb-1">还没有收藏任何内容</p>
          <p className="text-slate-600 text-sm">
            浏览 AI 大模型、智能体、开发教程等页面时，点击卡片右上角的星标即可收藏
          </p>
          <Link
            to="/models"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-cyan-400/10 text-cyan-300 border border-cyan-400/20
              hover:bg-cyan-400/20 hover:border-cyan-400/40
              transition-all duration-200 text-sm font-medium"
          >
            <Cpu className="w-4 h-4" />
            去发现内容
          </Link>
        </div>
      ) : (
        /* Grouped list */
        <div className="space-y-8">
          {typeOrder.map((type) => {
            const items = grouped[type]
            if (!items || items.length === 0) return null
            const config = TYPE_CONFIG[type]
            const GroupIcon = config?.Icon ?? Star

            return (
              <section key={type}>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-200 mb-3">
                  <GroupIcon className="w-5 h-5 text-cyan-400" />
                  {config?.label ?? type}
                  <span className="text-sm text-slate-500 font-normal">
                    ({items.length})
                  </span>
                </h2>
                <div className="space-y-2">
                  {items.map((item) => (
                    <FavoriteRow key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
