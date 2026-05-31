import { cn } from '@/utils/cn'

/* -------------------------------------------------------------------------- */
/*  Base Skeleton                                                             */
/* -------------------------------------------------------------------------- */

type SkeletonVariant = 'text' | 'circular' | 'rectangular'

interface SkeletonProps {
  className?: string
  variant?: SkeletonVariant
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded-md',
  circular: 'rounded-full',
  rectangular: 'rounded-xl',
}

const Skeleton = ({ className, variant = 'rectangular' }: SkeletonProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-white/10',
        variantStyles[variant],
        className,
      )}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  CardSkeleton — mimics a glass-card with shimmer                           */
/* -------------------------------------------------------------------------- */

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative w-full h-48 rounded-xl overflow-hidden',
        'border border-[var(--glass-border)]',
        'bg-[var(--glass-bg)]',
        className,
      )}
    >
      {/* Shimmer stripe */}
      <div className="absolute inset-0 animate-shimmer bg-[length:200%_100%] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.04)_30%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.04)_70%,transparent_100%)]" />

      {/* Top highlight line (mimics glass-card::before) */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Fake content structure */}
      <div className="relative z-10 p-5 flex flex-col h-full">
        {/* Title bar */}
        <div className="h-5 w-3/4 rounded-md bg-white/10 animate-pulse" />
        {/* Subtitle */}
        <div className="mt-3 h-3 w-1/2 rounded-md bg-white/5 animate-pulse" />
        {/* Spacer */}
        <div className="flex-1" />
        {/* Bottom row */}
        <div className="flex items-center gap-3">
          <div className="h-3 w-16 rounded-md bg-white/10 animate-pulse" />
          <div className="h-3 w-12 rounded-md bg-white/5 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  ListSkeleton — responsive grid of CardSkeletons                           */
/* -------------------------------------------------------------------------- */

function ListSkeleton({
  count = 3,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
        className,
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  ArticleSkeleton — article page skeleton (title bar + content lines)       */
/* -------------------------------------------------------------------------- */

function ArticleSkeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('space-y-6', className)}>
      {/* Title */}
      <div className="space-y-3">
        <div className="h-8 w-3/4 rounded-lg animate-pulse bg-white/10" />
        <div className="h-4 w-1/2 rounded-md animate-pulse bg-white/5" />
      </div>

      {/* Metadata row */}
      <div className="flex items-center gap-4">
        <div className="h-4 w-20 rounded-md animate-pulse bg-white/10" />
        <div className="h-4 w-24 rounded-md animate-pulse bg-white/5" />
        <div className="h-4 w-16 rounded-md animate-pulse bg-white/5" />
      </div>

      {/* Divider */}
      <div className="h-px bg-[var(--glass-border)]" />

      {/* Content lines */}
      <div className="space-y-3">
        <div className="h-4 w-full rounded-md animate-pulse bg-white/5" />
        <div className="h-4 w-full rounded-md animate-pulse bg-white/5" />
        <div className="h-4 w-11/12 rounded-md animate-pulse bg-white/5" />
        <div className="h-4 w-full rounded-md animate-pulse bg-white/5" />
        <div className="h-4 w-3/4 rounded-md animate-pulse bg-white/5" />
        <div className="h-4 w-full rounded-md animate-pulse bg-white/5" />
        <div className="h-4 w-5/6 rounded-md animate-pulse bg-white/5" />
        <div className="h-4 w-2/3 rounded-md animate-pulse bg-white/5" />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  TextSkeleton — single line shimmer                                        */
/* -------------------------------------------------------------------------- */

function TextSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('h-4 w-full rounded-md overflow-hidden relative', className)}
    >
      {/* Shimmer animate */}
      <div className="absolute inset-0 animate-shimmer bg-[length:200%_100%] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.04)_30%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.04)_70%,transparent_100%)]" />
      {/* Base fill */}
      <div className="absolute inset-0 bg-white/5" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Exports                                                                   */
/* -------------------------------------------------------------------------- */

export default Skeleton
export { CardSkeleton, ListSkeleton, ArticleSkeleton, TextSkeleton }
