import { cn } from '@/utils/cn'

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

export default Skeleton
