import { useEffect, useRef, useState, useCallback } from 'react'
import { Cpu, Bot, BookOpen, Code2, Star } from 'lucide-react'
import { cn } from '@/utils/cn'

// ── Types ──────────────────────────────────────────────────────────

interface StatItem {
  label: string
  value: number
  suffix: string
  icon: React.ComponentType<{ className?: string }>
  gradientFrom: string
  gradientTo: string
}

// ── Stats data ─────────────────────────────────────────────────────

const stats: StatItem[] = [
  {
    label: 'AI 模型',
    value: 18,
    suffix: '',
    icon: Cpu,
    gradientFrom: 'from-cyan-400',
    gradientTo: 'to-cyan-300',
  },
  {
    label: 'AI 智能体',
    value: 18,
    suffix: '',
    icon: Bot,
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-400',
  },
  {
    label: '专业术语',
    value: 100,
    suffix: '+',
    icon: BookOpen,
    gradientFrom: 'from-emerald-400',
    gradientTo: 'to-cyan-400',
  },
  {
    label: '开发教程',
    value: 11,
    suffix: '',
    icon: Code2,
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-cyan-400',
  },
  {
    label: 'GitHub Stars',
    value: 999,
    suffix: '+',
    icon: Star,
    gradientFrom: 'from-amber-400',
    gradientTo: 'to-pink-400',
  },
]

// ── Animated Counter Hook ──────────────────────────────────────────

function useAnimatedCounter(
  target: number,
  isActive: boolean,
  duration: number = 2000,
): number {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isActive) {
      setCount(0)
      return
    }

    let startTime: number | null = null
    let rafId: number

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp
      const elapsed = timestamp - startTime

      // easeOutCubic
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * target)

      setCount(current)

      if (progress < 1) {
        rafId = requestAnimationFrame(animate)
      }
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [target, isActive, duration])

  return count
}

// ── Single Stat Counter ────────────────────────────────────────────

function StatCounter({
  item,
  isActive,
  index,
}: {
  item: StatItem
  isActive: boolean
  index: number
}) {
  const count = useAnimatedCounter(item.value, isActive)
  const Icon = item.icon

  return (
    <div
      className={cn(
        'flex flex-col items-center text-center transition-all duration-700 ease-out',
        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Icon */}
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center mb-3',
          'bg-gradient-to-br',
          item.gradientFrom,
          item.gradientTo,
          'shadow-lg',
        )}
        style={{
          boxShadow: isActive
            ? `0 0 24px -6px var(--tw-shadow-color)`
            : undefined,
        }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>

      {/* Number */}
      <p className="text-3xl sm:text-4xl font-sora font-bold text-white tabular-nums tracking-tight">
        {count}
        <span className={cn(
          'text-xl sm:text-2xl',
          `bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo} bg-clip-text text-transparent`,
        )}>
          {item.suffix}
        </span>
      </p>

      {/* Label */}
      <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-jetbrains tracking-wide">
        {item.label}
      </p>
    </div>
  )
}

// ── Component ──────────────────────────────────────────────────────

export default function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && !hasTriggered) {
        setIsVisible(true)
        setHasTriggered(true)
      }
    },
    [hasTriggered],
  )

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
      rootMargin: '50px',
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [handleIntersection])

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative bg-[#0f172a] py-16 sm:py-20',
      )}
    >
      {/* Subtle top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.03] blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/[0.03] blur-[80px]" />
      </div>

      {/* Glass panel */}
      <div
        className={cn(
          'relative max-w-5xl mx-4 sm:mx-auto px-6 sm:px-10 py-10 sm:py-12',
          'rounded-2xl',
          'bg-white/[0.02] backdrop-blur-xl border',
          'transition-all duration-700',
          isVisible
            ? 'border-white/[0.10] shadow-xl shadow-cyan-400/[0.04]'
            : 'border-white/[0.04] shadow-none',
        )}
      >
        {/* Panel inner glow */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-1000 pointer-events-none',
            'bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-purple-500/[0.03]',
            isVisible && 'opacity-100',
          )}
        />

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {stats.map((stat, idx) => (
            <StatCounter
              key={stat.label}
              item={stat}
              isActive={isVisible}
              index={idx}
            />
          ))}
        </div>

        {/* Subtitle */}
        <p
          className={cn(
            'relative z-10 text-center mt-8 text-xs text-slate-600 tracking-wide font-jetbrains',
            'transition-all duration-700 delay-500',
            isVisible ? 'opacity-100' : 'opacity-0',
          )}
        >
          jiayouvibe · 持续更新 · 汇聚 AI 前沿知识与开源力量
        </p>
      </div>
    </section>
  )
}
