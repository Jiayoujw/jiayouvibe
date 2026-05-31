import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, ChevronDown } from 'lucide-react'
import { NAV_ITEMS, SITE_NAME } from '@/utils/constants'
import { cn } from '@/utils/cn'
import type { NavItem } from '@/types'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const location = useLocation()

  /* Close menu on route change */
  useEffect(() => {
    onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  /* Prevent body scroll when open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index))
  }

  const renderItem = (item: NavItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedIndex === index
    const active = !hasChildren && isActive(item.path)

    if (hasChildren) {
      return (
        <div key={item.label} className="border-b border-[var(--color-border)]/50">
          <button
            onClick={() => toggleExpand(index)}
            aria-expanded={isExpanded}
            className="flex w-full items-center justify-between px-6 py-4 text-left text-[var(--color-text-primary)] transition-colors hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-inset"
          >
            <span className="text-base font-medium">{item.label}</span>
            <ChevronDown
              className={cn(
                'h-5 w-5 text-[var(--color-text-muted)] transition-transform duration-300',
                isExpanded && 'rotate-180'
              )}
            />
          </button>
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              isExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="space-y-1 bg-[var(--color-bg-secondary)]/40 px-6 pb-4 pt-1">
              {item.children!.map((child) => (
                <Link
                  key={child.label}
                  to={child.path}
                  onClick={onClose}
                  className={cn(
                    'block rounded-lg px-4 py-2.5 text-sm transition-colors',
                    isActive(child.path)
                      ? 'text-cyan-400 bg-[var(--color-bg-tertiary)]/50'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]/30'
                  )}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <Link
        key={item.label}
        to={item.path}
        onClick={onClose}
        className={cn(
          'block border-b border-[var(--color-border)]/50 px-6 py-4 text-base font-medium transition-colors',
          active
            ? 'text-cyan-400 bg-[var(--color-bg-secondary)]/30'
            : 'text-[var(--color-text-primary)] hover:text-cyan-400'
        )}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw] bg-[var(--color-bg-primary)]/95 backdrop-blur-2xl border-l border-[var(--color-border)] shadow-2xl shadow-black/50 transition-transform duration-300 ease-in-out md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-[var(--color-border)]">
          <span className="bg-gradient-to-r from-[#00dbe7] to-[#d1bcff] bg-clip-text text-transparent text-lg font-bold">
            {SITE_NAME}
          </span>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors hover:text-cyan-400 hover:bg-[var(--color-bg-tertiary)]/60"
            aria-label="关闭菜单"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 5rem)' }}>
          {NAV_ITEMS.map((item, index) => renderItem(item, index))}
        </nav>
      </div>
    </>
  )
}
