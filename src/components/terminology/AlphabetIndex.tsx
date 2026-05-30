import { useRef, useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface AlphabetIndexProps {
  letters: string[]
  activeLetter: string
  onLetterClick: (letter: string) => void
}

export default function AlphabetIndex({ letters, activeLetter, onLetterClick }: AlphabetIndexProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setShowLeftArrow(scrollLeft > 2)
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 4)
  }, [])

  useEffect(() => {
    checkScroll()
  }, [letters, checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({
      left: direction === 'left' ? -240 : 240,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative flex items-center">
      {/* Left fade + arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 flex h-10 w-10 items-center justify-center
            bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"
          aria-label="向左滚动"
        >
          <ChevronLeft className="h-4 w-4 text-cyan-400" />
        </button>
      )}

      {/* Scrollable letter strip */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex items-center gap-1.5 overflow-x-auto scrollbar-none px-1"
      >
        {letters.map((letter) => {
          const isActive = activeLetter === letter
          return (
            <button
              key={letter}
              onClick={() => onLetterClick(letter)}
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                'text-sm font-jetbrains font-semibold',
                'transition-all duration-200',
                isActive
                  ? 'bg-cyan-400/15 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/30 scale-110'
                  : 'text-slate-400 bg-white/[0.04] hover:bg-cyan-400/10 hover:text-cyan-300 hover:scale-105',
              )}
            >
              {letter}
            </button>
          )
        })}
      </div>

      {/* Right fade + arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 z-10 flex h-10 w-10 items-center justify-center
            bg-gradient-to-l from-slate-950 via-slate-950/90 to-transparent"
          aria-label="向右滚动"
        >
          <ChevronRight className="h-4 w-4 text-cyan-400" />
        </button>
      )}
    </div>
  )
}
