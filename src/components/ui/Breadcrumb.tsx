import { Fragment } from 'react'
import { cn } from '@/utils/cn'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className={cn(className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm font-jetbrains">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1

          return (
            <Fragment key={`${item.label}-${idx}`}>
              {idx > 0 && (
                <li aria-hidden="true" className="text-slate-600 select-none mx-0.5">
                  /
                </li>
              )}
              <li>
                {item.href && !isLast ? (
                  <a
                    href={item.href}
                    className={cn(
                      'text-slate-400 hover:text-cyan-300 transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:underline focus-visible:text-cyan-300',
                    )}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    className={cn(
                      isLast
                        ? 'text-slate-200 font-medium'
                        : 'text-slate-500',
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
