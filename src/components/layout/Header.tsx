import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Search, Menu, Globe } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { NAV_ITEMS, SITE_NAME } from '@/utils/constants'
import { cn } from '@/utils/cn'
import { getLang, setLang } from '@/i18n'
import type { Lang } from '@/i18n'
import MobileMenu from '@/components/layout/MobileMenu'
import type { NavItem } from '@/types'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [lang, setLangState] = useState<Lang>(getLang)
  const location = useLocation()
  const { isDark, toggle } = useTheme()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setDropdownOpen(true)
  }

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false)
    }, 150)
  }

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current)
      }
    }
  }, [])

  /* split nav items: non-dropdown links vs the "更多" dropdown */
  const mainItems = NAV_ITEMS.filter((item) => !item.children)
  const moreItem = NAV_ITEMS.find((item) => item.label === '更多')

  const renderNavLink = (item: NavItem) => {
    const active = isActive(item.path)
    return (
      <Link
        key={item.label}
        to={item.path}
        className={cn(
          'relative px-3 py-2 text-sm font-medium transition-colors duration-200',
          'hover:text-cyan-400',
          active
            ? 'text-cyan-400'
            : 'text-[var(--color-text-secondary)]'
        )}
      >
        {item.label}
        {active && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,219,231,0.6)]" />
        )}
      </Link>
    )
  }

  return (
    <>
      <header className="glass-panel fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* --- Logo --- */}
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight"
            >
              <span className="bg-gradient-to-r from-[#00dbe7] to-[#d1bcff] bg-clip-text text-transparent">
                {SITE_NAME}
              </span>
            </Link>

            {/* --- Desktop nav --- */}
            <nav className="hidden md:flex items-center gap-1">
              {mainItems.map(renderNavLink)}

              {/* "更多" dropdown */}
              {moreItem && moreItem.children && (
                <div
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                      dropdownOpen
                        ? 'text-cyan-400 bg-[var(--color-bg-tertiary)]/60'
                        : 'text-[var(--color-text-secondary)] hover:text-cyan-400'
                    )}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    {moreItem.label}
                    <svg
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-200',
                        dropdownOpen && 'rotate-180'
                      )}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-40 rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-bg-secondary)]/95 backdrop-blur-xl py-1.5 shadow-xl shadow-black/40">
                      {moreItem.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.path}
                          className={cn(
                            'block px-4 py-2.5 text-sm transition-colors duration-150',
                            isActive(child.path)
                              ? 'text-cyan-400 bg-[var(--color-bg-tertiary)]/50'
                              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]/40'
                          )}
                          onClick={() => setDropdownOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* --- Right actions --- */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              {/* Search */}
              <button
                className="flex h-9 w-9 sm:h-9 sm:w-9 min-w-[44px] min-h-[44px] items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-all active:scale-95 hover:text-cyan-400 hover:bg-[var(--color-bg-tertiary)]/60"
                aria-label="搜索"
              >
                <Search className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </button>

              {/* Language toggle */}
              <button
                onClick={() => {
                  const next: Lang = lang === 'zh' ? 'en' : 'zh'
                  setLang(next)
                  setLangState(next)
                }}
                className="flex h-9 w-9 sm:h-9 sm:w-9 min-w-[44px] min-h-[44px] items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-all active:scale-95 hover:text-cyan-400 hover:bg-[var(--color-bg-tertiary)]/60"
                aria-label="切换语言"
                title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
              >
                <Globe className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                <span className="ml-1 text-[10px] font-medium uppercase leading-none">
                  {lang === 'zh' ? 'EN' : '中'}
                </span>
              </button>

              {/* Premium theme toggle */}
              <div className="relative group flex items-center justify-center">
                <button
                  onClick={toggle}
                  className="relative w-9 h-9 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center border border-white/[0.08] dark:border-white/10 backdrop-blur-3xl bg-white/[0.04] dark:bg-white/[0.04] transition-all duration-300 active:scale-95 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] dark:hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] hover:border-amber-400/40"
                  aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
                >
                  <span className="transition-transform duration-500 ease-out hover:rotate-180">
                    {isDark ? (
                      <Sun className="h-4 w-4 text-amber-400" />
                    ) : (
                      <Moon className="h-4 w-4 text-indigo-500" />
                    )}
                  </span>
                </button>
                {/* Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap px-2 py-1 text-[11px] rounded bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-mono pointer-events-none z-50">
                  {isDark ? '切换到亮色模式' : '切换到暗色模式'}
                </div>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex md:hidden h-10 w-10 min-w-[44px] min-h-[44px] items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-all active:scale-95 hover:text-cyan-400 hover:bg-[var(--color-bg-tertiary)]/60 active:bg-[var(--color-border)]/60 active:text-cyan-300"
                aria-label="打开菜单"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile slide-in drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  )
}
