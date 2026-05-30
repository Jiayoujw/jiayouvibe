import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        'flex w-full rounded-xl px-4 py-2.5 text-sm text-slate-100',
        'bg-white/5 backdrop-blur-sm border border-white/10',
        'dark:bg-white/5 dark:border-white/10 dark:text-slate-100',
        'appearance-none cursor-pointer',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:border-cyan-400/50 focus-visible:ring-2 focus-visible:ring-cyan-400/20',
        'disabled:pointer-events-none disabled:opacity-40',
        className,
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 0.75rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.25rem 1.25rem',
        paddingRight: '2.5rem',
      }}
      {...props}
    >
      {children}
    </select>
  )
})

Select.displayName = 'Select'

export default Select
