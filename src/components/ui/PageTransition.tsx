import { type ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  /** Stagger delay in milliseconds. Defaults to 0 (no delay). */
  delay?: number
}

/**
 * Wraps children with a fade+slide-up entrance animation.
 * Uses pure CSS animations — no JS library required.
 *
 * @example
 * // Instant entrance
 * <PageTransition><Card /></PageTransition>
 *
 * @example
 * // Staggered entrance in a list
 * {items.map((item, i) => (
 *   <PageTransition key={item.id} delay={i * 80}>
 *     <Card {...item} />
 *   </PageTransition>
 * ))}
 */
export default function PageTransition({ children, delay = 0 }: PageTransitionProps) {
  return (
    <div
      className="animate-slide-up"
      style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
