import { Cpu, Bot, BookOpen, Code2, Star } from 'lucide-react'
import { cn } from '@/utils/cn'
import AnimatedCounter from '@/components/ui/AnimatedCounter'

// ── Types ────────────────────────────────────────────────────────────

interface StatItem {
  target: number
  label: string
  icon: React.ComponentType<{ className?: string }>
  gradientFrom: string
  gradientTo: string
}

// ── Stats data ───────────────────────────────────────────────────────

const stats: StatItem[] = [
  {
    target: 18,
    label: 'Models',
    icon: Cpu,
    gradientFrom: 'from-cyan-400',
    gradientTo: 'to-cyan-300',
  },
  {
    target: 18,
    label: 'Agents',
    icon: Bot,
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-400',
  },
  {
    target: 100,
    label: 'Terms',
    icon: BookOpen,
    gradientFrom: 'from-emerald-400',
    gradientTo: 'to-cyan-400',
  },
  {
    target: 20,
    label: 'Tutorials',
    icon: Code2,
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-cyan-400',
  },
  {
    target: 50000,
    label: 'GitHub Stars',
    icon: Star,
    gradientFrom: 'from-amber-400',
    gradientTo: 'to-pink-400',
  },
]

// ── Component ────────────────────────────────────────────────────────

export default function StatsBar() {
  return (
    <section className="relative bg-[var(--color-bg-primary)] py-16 sm:py-20">
      {/* Subtle top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/[0.03] blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-purple-500/[0.03] blur-[100px]" />
      </div>

      {/* Glass panel container */}
      <div
        className={cn(
          'relative max-w-5xl mx-4 sm:mx-auto px-6 sm:px-10 py-10 sm:py-12',
          'rounded-2xl',
          'bg-white/[0.02] backdrop-blur-xl border border-white/[0.08]',
          'shadow-[0_0_60px_rgba(6,182,212,0.03),inset_0_1px_0_rgba(255,255,255,0.03)]',
        )}
      >
        {/* Inner ambient glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-purple-500/[0.03] pointer-events-none" />

        {/* Stats grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex flex-col items-center gap-3">
                {/* Gradient icon circle */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    'bg-gradient-to-br',
                    stat.gradientFrom,
                    stat.gradientTo,
                    'shadow-lg',
                  )}
                  style={{
                    boxShadow: `0 0 20px -4px var(--tw-shadow-color)`,
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Animated counter */}
                <AnimatedCounter
                  target={stat.target}
                  label={stat.label}
                  duration={2200}
                  className="gap-1"
                />
              </div>
            )
          })}
        </div>

        {/* Subtitle */}
        <p className="relative z-10 text-center mt-8 text-xs text-slate-600 tracking-wide font-jetbrains">
          jiayouvibe · 持续更新 · 汇聚 AI 前沿知识与开源力量
        </p>
      </div>
    </section>
  )
}
