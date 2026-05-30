import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface PageTransitionProps {
  children: ReactNode
  delay?: number
  className?: string
}

export default function PageTransition({
  children,
  delay = 0,
  className,
}: PageTransitionProps) {
  return (
    <div
      className={cn('animate-slide-up', className)}
      style={{
        animationDelay: `${delay}ms`,
        opacity: 0,
      }}
    >
      {children}
    </div>
  )
}
