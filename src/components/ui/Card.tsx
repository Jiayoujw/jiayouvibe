import { type ReactNode, type MouseEventHandler } from 'react'
import { cn } from '@/utils/cn'

export interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}

const Card = ({ children, className, hover, onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl',
        'dark:bg-white/5 dark:border-white/10',
        hover &&
          'cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 hover:border-white/20 hover:bg-white/[0.07]',
        onClick && !hover && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default Card
