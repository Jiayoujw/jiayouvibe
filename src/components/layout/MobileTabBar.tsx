import { useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Cpu, Search, Menu } from 'lucide-react'
import { cn } from '@/utils/cn'
import SearchModal from '@/components/search/SearchModal'
import MobileMenu from '@/components/layout/MobileMenu'

interface Tab {
  label: string
  path?: string
  icon: React.ComponentType<{ className?: string }>
  isAction?: boolean
  action?: 'search' | 'menu'
}

const TABS: Tab[] = [
  { label: '首页', path: '/', icon: Home },
  { label: '模型', path: '/models', icon: Cpu },
  { label: '搜索', icon: Search, isAction: true, action: 'search' },
  { label: '更多', icon: Menu, isAction: true, action: 'menu' },
]

export default function MobileTabBar() {
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = useCallback(
    (path: string) => {
      if (path === '/') return location.pathname === '/'
      return location.pathname.startsWith(path)
    },
    [location.pathname],
  )

  const handleAction = (tab: Tab) => {
    if (tab.action === 'search') {
      setSearchOpen(true)
    } else if (tab.action === 'menu') {
      setMenuOpen(true)
    }
  }

  return (
    <>
      {/* ── Bottom tab bar ── */}
      <nav
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40 md:hidden',
          'glass-panel border-t border-[var(--glass-border)]',
          'pb-[env(safe-area-inset-bottom,0px)]',
        )}
      >
        <div className="flex items-center justify-around h-16">
          {TABS.map((tab) => {
            const active = tab.path ? isActive(tab.path) : false
            const Icon = tab.icon

            if (tab.isAction) {
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => handleAction(tab)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-full',
                    'text-[var(--color-text-muted)] transition-colors duration-200 active:scale-95',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-inset',
                  )}
                  aria-label={tab.label}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] leading-none font-medium">
                    {tab.label}
                  </span>
                </button>
              )
            }

            return (
              <Link
                key={tab.label}
                to={tab.path!}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-full relative',
                  'transition-colors duration-200 active:scale-95',
                  active
                    ? 'text-cyan-400'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] leading-none font-medium">
                  {tab.label}
                </span>
                {/* Active cyan dot indicator */}
                {active && (
                  <span className="absolute top-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,219,231,0.8)]" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ── Search Modal (controlled by tab bar) ── */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />

      {/* ── Mobile Menu Drawer (controlled by tab bar) ── */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
