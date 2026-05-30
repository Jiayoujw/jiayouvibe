import { cn } from '@/utils/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

const buttonBase =
  'inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-jetbrains font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50'

const Pagination = ({ currentPage, totalPages, onPageChange, className }: PaginationProps) => {
  if (totalPages <= 1) return null

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }

    pages.push(1)

    if (currentPage > 3) {
      pages.push('ellipsis')
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis')
    }

    pages.push(totalPages)
    return pages
  }

  const pages = getPageNumbers()

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center gap-1', className)}
    >
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(buttonBase, 'text-slate-400 hover:text-white hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30')}
        aria-label="Previous page"
      >
        ‹
      </button>

      {pages.map((page, idx) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-9 h-9 flex items-center justify-center text-slate-500 text-sm select-none"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Page ${page}`}
            className={cn(
              buttonBase,
              page === currentPage
                ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-sm shadow-purple-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/10',
            )}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(buttonBase, 'text-slate-400 hover:text-white hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30')}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  )
}

export default Pagination
