import { type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import Button from '@/components/ui/Button'

interface EmptyStateAction {
  label: string
  onClick: () => void
}

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: EmptyStateAction
  className?: string
}

const EmptyState = ({ icon, title, description, action, className }: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className,
      )}
    >
      {icon && (
        <div className="mb-5 text-slate-500">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/5">
            {icon}
          </div>
        </div>
      )}

      <h3 className="text-lg font-sora font-semibold text-slate-200 mb-1.5">{title}</h3>

      {description && (
        <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      )}

      {action && (
        <Button variant="primary" size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
