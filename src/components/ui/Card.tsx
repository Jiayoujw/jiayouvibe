import { type ReactNode, type MouseEventHandler } from 'react'
import { cn } from '@/utils/cn'

export interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  featured?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}

const Card = ({ children, className, hover, featured, onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        featured ? 'glass-card-featured' : 'glass-card',
        hover && 'cursor-pointer',
        onClick && !hover && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default Card
