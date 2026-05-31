import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchContext } from '@/contexts/SearchContext'

interface UseKeyboardShortcutsReturn {
  showShortcutHelp: boolean
  closeShortcutHelp: () => void
}

/**
 * Global keyboard shortcuts hook.
 *
 * Shortcuts (disabled when focus is inside input/textarea/select/contentEditable):
 *   /   → open global search
 *   Escape → close search / any modal
 *   n   → navigate to /notes
 *   h   → navigate to /
 *   d   → navigate to /dashboard
 *   ?   → show shortcut help modal
 */
export function useKeyboardShortcuts(): UseKeyboardShortcutsReturn {
  const navigate = useNavigate()
  const { openSearch, closeSearch, isOpen: isSearchOpen } = useSearchContext()
  const [showShortcutHelp, setShowShortcutHelp] = useState(false)

  const closeShortcutHelp = useCallback(() => setShowShortcutHelp(false), [])

  useEffect(() => {
    const isEditable = (el: EventTarget | null): boolean => {
      if (!el) return false
      const tag = (el as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
      if ((el as HTMLElement).isContentEditable) return true
      return false
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null

      // "/" opens search — skip editable fields
      if (e.key === '/') {
        if (isEditable(target)) return
        e.preventDefault()
        openSearch()
        return
      }

      // "Escape" closes search / modals
      if (e.key === 'Escape') {
        // Let the search modal's own Escape handler fire first
        // (it has its own onKeyDown on the input), but also close
        // from a global level.
        if (isSearchOpen) {
          // Modal handles its own close via onKeyDown;
          // we request close as well to catch clicks on backdrop etc.
          closeSearch()
        }
        // Also close the shortcut help modal
        setShowShortcutHelp(false)
        return
      }

      // Remaining shortcuts are disabled when focus is in an editable field
      if (isEditable(target)) return

      // "?" toggles shortcut help
      if (e.key === '?') {
        e.preventDefault()
        setShowShortcutHelp((prev) => !prev)
        return
      }

      // "n" — navigate to notes (create new note)
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        navigate('/notes')
        return
      }

      // "h" — navigate home
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault()
        navigate('/')
        return
      }

      // "d" — navigate to dashboard
      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        navigate('/dashboard')
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openSearch, closeSearch, isSearchOpen, navigate])

  return { showShortcutHelp, closeShortcutHelp }
}
