import { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/utils/cn'

interface AnimatedCounterProps {
  target: number
  label: string
  duration?: number
  className?: string
}

export default function AnimatedCounter({
  target,
  label,
  duration = 2000,
  className,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const elementRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  const animate = useCallback(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()

    function easeOutExpo(t: number): number {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
    }

    function step(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutExpo(progress)
      const currentCount = Math.floor(easedProgress * target)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setCount(target)
      }
    }

    requestAnimationFrame(step)
  }, [target, duration])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animate()
            observer.unobserve(element)
          }
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [animate])

  const formattedCount = count.toLocaleString()

  return (
    <div
      ref={elementRef}
      className={cn('flex flex-col items-center gap-2', className)}
    >
      <span
        className={cn(
          'text-4xl sm:text-5xl md:text-6xl font-bold font-mono tabular-nums tracking-tight',
          'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent',
          'bg-[length:200%_auto] animate-gradient-flow'
        )}
      >
        {formattedCount}
        {target >= 1000 ? '+' : ''}
      </span>
      <span className="text-sm sm:text-base text-slate-400 font-medium tracking-wide">
        {label}
      </span>
    </div>
  )
}
