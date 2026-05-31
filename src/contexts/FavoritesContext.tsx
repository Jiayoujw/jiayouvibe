import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react'
import { FAVORITES_STORAGE_KEY } from '@/utils/constants'

export interface FavoriteItem {
  id: string
  type: 'model' | 'agent' | 'tool' | 'tutorial'
  name: string
  url: string
  addedAt: number
}

interface FavoritesState {
  favorites: FavoriteItem[]
  loaded: boolean
}

type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: FavoriteItem }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'LOAD_FAVORITES'; payload: FavoriteItem[] }

function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'LOAD_FAVORITES':
      return { ...state, favorites: action.payload, loaded: true }
    case 'ADD_FAVORITE':
      return { ...state, favorites: [action.payload, ...state.favorites] }
    case 'REMOVE_FAVORITE':
      return { ...state, favorites: state.favorites.filter((f) => f.id !== action.payload) }
    default:
      return state
  }
}

interface FavoritesContextType {
  state: FavoritesState
  dispatch: React.Dispatch<FavoritesAction>
  isFavorited: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, {
    favorites: [],
    loaded: false,
  })

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (raw) {
        const favorites = JSON.parse(raw) as FavoriteItem[]
        dispatch({ type: 'LOAD_FAVORITES', payload: favorites })
      } else {
        dispatch({ type: 'LOAD_FAVORITES', payload: [] })
      }
    } catch {
      dispatch({ type: 'LOAD_FAVORITES', payload: [] })
    }
  }, [])

  // Persist to localStorage with debounce
  useEffect(() => {
    if (!state.loaded) return
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.favorites))
      } catch {
        // Storage full or unavailable
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [state.favorites, state.loaded])

  const isFavorited = (id: string) => state.favorites.some((f) => f.id === id)

  return (
    <FavoritesContext.Provider value={{ state, dispatch, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
