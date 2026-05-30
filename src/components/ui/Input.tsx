import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex w-full rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500',
        'bg-white/5 backdrop-blur-sm border border-white/10',
        'dark:bg-white/5 dark:border-white/10 dark:text-slate-100 dark:placeholder:text-slate-500',
        'transition-colors duration-200',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-100',
        'focus-visible:outline-none focus-visible:border-cyan-400/50 focus-visible:ring-2 focus-visible:ring-cyan-400/20',
        'disabled:pointer-events-none disabled:opacity-40',
        className,
      )}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export default Input
