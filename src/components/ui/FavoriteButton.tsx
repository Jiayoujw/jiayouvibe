import { Star } from 'lucide-react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { cn } from '@/utils/cn'

interface FavoriteButtonProps {
  id: string
  type: 'model' | 'agent' | 'tool' | 'tutorial'
  name: string
  url: string
}

export default function FavoriteButton({ id, type, name, url }: FavoriteButtonProps) {
  const { isFavorited, dispatch } = useFavorites()
  const favorited = isFavorited(id)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (favorited) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: id })
    } else {
      dispatch({
        type: 'ADD_FAVORITE',
        payload: { id, type, name, url, addedAt: Date.now() },
      })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={favorited ? '取消收藏' : '收藏'}
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center',
        'backdrop-blur-md bg-white/10 border border-white/10',
        'transition-all duration-200 hover:scale-110 active:scale-95',
        'hover:bg-white/20 hover:border-amber-400/30',
      )}
    >
      <Star
        className={cn(
          'w-4 h-4 transition-colors duration-200',
          favorited ? 'fill-amber-400 text-amber-400' : 'text-slate-400 hover:text-amber-300',
        )}
      />
    </button>
  )
}
