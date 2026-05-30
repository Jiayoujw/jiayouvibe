import { cn } from '@/utils/cn'

type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: SpinnerSize
  label?: string
  className?: string
}

const sizeMap: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
}

const Spinner = ({ size = 'md', label, className }: SpinnerProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)} role="status">
      <div
        className={cn(
          'animate-spin rounded-full border-transparent',
          'border-t-cyan-400 border-r-purple-500',
          sizeMap[size],
        )}
        style={{
          borderTopColor: '#00dbe7',
          borderRightColor: '#7000ff',
        }}
        aria-hidden="true"
      />
      {label && (
        <span className="text-sm text-slate-400 font-jetbrains tracking-wide">{label}</span>
      )}
      <span className="sr-only">Loading{label ? `: ${label}` : '...'}</span>
    </div>
  )
}

export default Spinner
