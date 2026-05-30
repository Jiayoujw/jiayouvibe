import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react'
import type { Note } from '@/types'
import { NOTES_STORAGE_KEY } from '@/utils/constants'

interface NotesState {
  notes: Note[]
  selectedId: string | null
  loaded: boolean
}

export type NotesAction =
  | { type: 'LOAD_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SELECT_NOTE'; payload: string | null }
  | { type: 'TOGGLE_PIN'; payload: string }

function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case 'LOAD_NOTES':
      return { ...state, notes: action.payload, loaded: true }
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes], selectedId: action.payload.id }
    case 'UPDATE_NOTE': {
      const { id, updates } = action.payload
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
        ),
      }
    }
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.payload),
        selectedId: state.selectedId === action.payload ? null : state.selectedId,
      }
    case 'SELECT_NOTE':
      return { ...state, selectedId: action.payload }
    case 'TOGGLE_PIN': {
      const id = action.payload
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n
        ),
      }
    }
    default:
      return state
  }
}

interface NotesContextType {
  state: NotesState
  dispatch: React.Dispatch<NotesAction>
  selectedNote: Note | null
}

const NotesContext = createContext<NotesContextType | null>(null)

export function NotesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notesReducer, {
    notes: [],
    selectedId: null,
    loaded: false,
  })

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTES_STORAGE_KEY)
      if (raw) {
        const notes = JSON.parse(raw) as Note[]
        dispatch({ type: 'LOAD_NOTES', payload: notes })
      } else {
        dispatch({ type: 'LOAD_NOTES', payload: [] })
      }
    } catch {
      dispatch({ type: 'LOAD_NOTES', payload: [] })
    }
  }, [])

  // Persist to localStorage with debounce
  useEffect(() => {
    if (!state.loaded) return
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(state.notes))
      } catch {
        // Storage full or unavailable
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [state.notes, state.loaded])

  const selectedNote = state.notes.find((n) => n.id === state.selectedId) || null

  return (
    <NotesContext.Provider value={{ state, dispatch, selectedNote }}>
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const ctx = useContext(NotesContext)
  if (!ctx) throw new Error('useNotes must be used within NotesProvider')
  return ctx
}
