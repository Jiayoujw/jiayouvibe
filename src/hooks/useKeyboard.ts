import { useEffect } from 'react'

interface Shortcut {
  key: string
  ctrlKey?: boolean
  handler: () => void
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (target.isContentEditable) return true
  return false
}

function useKeyboard(shortcuts: Shortcut[]): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Respect when focus is in an editable element
      if (isEditableTarget(e.target)) return

      const key = e.key.toLowerCase()
      const ctrl = e.ctrlKey || e.metaKey

      for (const shortcut of shortcuts) {
        const shortcutKey = shortcut.key.toLowerCase()
        const expectCtrl = shortcut.ctrlKey ?? false

        if (key === shortcutKey && ctrl === expectCtrl) {
          e.preventDefault()
          shortcut.handler()
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts])
}

export default useKeyboard
