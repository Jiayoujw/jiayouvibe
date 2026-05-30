import { useState, useEffect } from 'react'

/**
 * A thin gradient progress bar fixed at the top of the viewport
 * that indicates how far the user has scrolled through the page
 * content (0 % at the top, 100 % at the bottom).
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const scrollable = docHeight - winHeight

      if (scrollable <= 0) {
        setProgress(0)
        return
      }

      const pct = Math.min((scrollTop / scrollable) * 100, 100)
      setProgress(Math.round(pct))
    }

    // Calculate initial value
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="阅读进度"
      className="fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none"
    >
      <div
        className="h-full transition-[width] duration-150 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #22d3ee, #a855f7)',
          boxShadow: '0 0 6px rgba(34, 211, 238, 0.35), 0 0 12px rgba(168, 85, 247, 0.2)',
        }}
      />
    </div>
  )
}
