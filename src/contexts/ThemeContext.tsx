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

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  const isDark = mode === 'dark' || (mode === 'system' && getSystemDark())
  root.classList.toggle('dark', isDark)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    return (saved as ThemeMode) || 'system'
  })

  const [isDark, setIsDark] = useState(() => {
    if (mode === 'dark') return true
    if (mode === 'light') return false
    return getSystemDark()
  })

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
    applyTheme(mode)

    const dark = mode === 'dark' || (mode === 'system' && getSystemDark())
    setIsDark(dark)

    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e: MediaQueryListEvent) => {
        setIsDark(e.matches)
        document.documentElement.classList.toggle('dark', e.matches)
      }
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [mode])

  const setMode = (newMode: ThemeMode) => setModeState(newMode)

  const toggle = () => {
    setModeState((prev) => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'system'
      return 'light'
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
