import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ThemeMode } from '@/types'
import { THEME_STORAGE_KEY } from '@/utils/constants'

interface ThemeContextType {
  mode: ThemeMode
  isDark: boolean
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  return getSystemDark()
}

function applyTheme(mode: ThemeMode, animate = true) {
  const root = document.documentElement
  const isDark = resolveIsDark(mode)

  if (!animate) {
    root.classList.toggle('dark', isDark)
    return
  }

  // Smooth transition via a temporary attribute
  // CSS uses [data-theme-transitioning] to enable transitions
  root.setAttribute('data-theme-transitioning', 'true')
  root.classList.toggle('dark', isDark)

  // Remove transition flag after animation completes
  const onTransitionEnd = () => {
    root.removeAttribute('data-theme-transitioning')
    root.removeEventListener('transitionend', onTransitionEnd)
  }
  root.addEventListener('transitionend', onTransitionEnd, { once: true })

  // Safety fallback: remove flag after 800ms
  setTimeout(() => root.removeAttribute('data-theme-transitioning'), 800)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY)
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
    } catch { /* ignore */ }
    return 'system'
  })

  const [isDark, setIsDark] = useState(() => resolveIsDark(mode))

  // Apply theme on mount (no animation for initial load)
  useEffect(() => {
    applyTheme(mode, false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist + apply on mode change
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
    const dark = resolveIsDark(mode)
    setIsDark(dark)
    applyTheme(mode, true)
  }, [mode])

  // Listen for system preference changes when in 'system' mode
  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
      document.documentElement.classList.toggle('dark', e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  // Respect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      document.documentElement.style.setProperty('--theme-transition-duration', '0ms')
    }
  }, [])

  const setMode = (newMode: ThemeMode) => setModeState(newMode)

  const toggle = () => {
    setModeState((prev) => {
      // Simple toggle: light ↔ dark, preserve system in the cycle
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'light'
      // If system, switch to the opposite of current system preference
      return getSystemDark() ? 'light' : 'dark'
    })
  }

  return (
    <ThemeContext.Provider value={{ mode, isDark, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
