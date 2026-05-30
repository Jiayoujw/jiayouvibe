import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  className?: string
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs py-1.5 px-3 rounded-lg gap-1.5',
  md: 'text-sm py-[6px] px-[14px] rounded-xl gap-[2.5px]',
  lg: 'text-base py-[10px] px-[18px] rounded-xl gap-[2.5px]',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-semibold font-sora tracking-wide select-none',
          'transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]',
          'disabled:pointer-events-none disabled:opacity-40',
          sizeStyles[size],

          variant === 'primary' && [
            'text-white',
            'bg-gradient-to-r from-cyan-400 to-purple-500',
          ],

          variant === 'secondary' && [
            'text-slate-200',
            'bg-white/[0.04] backdrop-blur-3xl',
            'border border-white/[0.08]',
          ],

          variant === 'ghost' && [
            'text-slate-300',
            'bg-transparent',
            'hover:bg-white/5 hover:text-white',
          ],

          className,
        )}
        style={{
          ...(variant === 'primary' ? {
            boxShadow:
              '0 0 10px rgba(6, 182, 212, 0.4),' +
              '0 0 20px rgba(168, 85, 247, 0.2),' +
              '0 0 30px rgba(6, 182, 212, 0.1)',
          } : {}),
          ...(variant === 'secondary' ? {
            backdropFilter: 'blur(64px)',
            WebkitBackdropFilter: 'blur(64px)',
          } : {}),
        }}
        onMouseEnter={(e) => {
          if (variant === 'primary') {
            const el = e.currentTarget
            el.style.boxShadow =
              '0 0 20px rgba(6, 182, 212, 0.55),' +
              '0 0 40px rgba(168, 85, 247, 0.35),' +
              '0 0 60px rgba(6, 182, 212, 0.2)'
            el.style.transform = 'scale(1.02) translateY(-1px)'
          }
          if (variant === 'secondary') {
            const el = e.currentTarget
            el.style.borderColor = 'rgba(6, 182, 212, 0.4)'
            el.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
            el.style.transform = 'translateY(-1px)'
          }
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.boxShadow = ''
          el.style.transform = ''
          el.style.borderColor = ''
          el.style.backgroundColor = ''
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.97)'
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = ''
        }}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
