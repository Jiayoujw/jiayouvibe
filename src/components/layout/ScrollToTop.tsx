import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronUp } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const { pathname } = useLocation()

  // Auto scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  // Show/hide floating button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="回到顶部"
      className={cn(
        'fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-xl',
        'border border-slate-700/50 bg-slate-900/70 backdrop-blur-lg',
        'text-slate-400 shadow-lg shadow-black/20',
        'transition-all duration-300 ease-in-out',
        'hover:text-cyan-400 hover:border-cyan-500/40 hover:shadow-[0_0_16px_rgba(0,219,231,0.25)]',
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-4 opacity-0 pointer-events-none'
      )}
      tabIndex={visible ? 0 : -1}
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  )
}
