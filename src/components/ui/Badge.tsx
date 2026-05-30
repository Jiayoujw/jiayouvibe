import { type ReactNode } from 'react'
import { cn } from '@/utils/cn'

type BadgeVariant = 'default' | 'outline' | 'glow'
type BadgeColor = 'cyan' | 'purple' | 'pink' | 'amber' | 'green'

export interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  color?: BadgeColor
  className?: string
}

const colorMap: Record<BadgeColor, { bg: string; text: string; border: string; glow: string }> = {
  cyan: {
    bg: 'bg-cyan-400/15',
    text: 'text-cyan-300',
    border: 'border-cyan-400/30',
    glow: 'shadow-cyan-400/30',
  },
  purple: {
    bg: 'bg-purple-500/15',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/30',
  },
  pink: {
    bg: 'bg-pink-500/15',
    text: 'text-pink-300',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/30',
  },
  amber: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    glow: 'shadow-amber-500/30',
  },
  green: {
    bg: 'bg-emerald-400/15',
    text: 'text-emerald-300',
    border: 'border-emerald-400/30',
    glow: 'shadow-emerald-400/30',
  },
}

const variantMap: Record<BadgeVariant, (c: BadgeColor) => string> = {
  default: (c) => cn(colorMap[c].bg, colorMap[c].text),
  outline: (c) => cn('bg-transparent border', colorMap[c].border, colorMap[c].text),
  glow: (c) => cn(colorMap[c].bg, colorMap[c].text, 'shadow-md', colorMap[c].glow),
}

const Badge = ({ children, variant = 'default', color = 'cyan', className }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-jetbrains font-medium tracking-wide',
        variantMap[variant](color),
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge
