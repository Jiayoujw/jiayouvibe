import { Link } from 'react-router-dom'
import { Clock, Calendar, User } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatReadingTime } from '@/utils/formatDate'
import { TUTORIAL_CATEGORIES, TUTORIAL_DIFFICULTIES } from '@/utils/constants'
import type { Tutorial } from '@/types'
import FavoriteButton from '@/components/ui/FavoriteButton'

interface TutorialCardProps {
  tutorial: Tutorial
}

export default function TutorialCard({ tutorial }: TutorialCardProps) {
  const categoryLabel = TUTORIAL_CATEGORIES[tutorial.category] ?? tutorial.category
  const diff = TUTORIAL_DIFFICULTIES[tutorial.difficulty]

  return (
    <Link
      to={`/development/${tutorial.slug}`}
      className="group block h-full relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 rounded-2xl"
    >
      {/* Favorite button */}
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton
          id={tutorial.slug}
          type="tutorial"
          name={tutorial.title}
          url={`/development/${tutorial.slug}`}
        />
      </div>
      <article
        className={cn(
          'glass-card p-6 h-full',
          'transition-all duration-300',
          'hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-400/20',
          'group-hover:bg-white/[0.07]',
        )}
      >
        {/* Category label */}
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wider uppercase bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
            {categoryLabel}
          </span>
        </div>

        {/* Title */}
        <h3
          className={cn(
            'text-lg font-semibold text-slate-100 mb-2 leading-snug',
            'group-hover:text-cyan-300 transition-colors duration-200',
            'line-clamp-2',
          )}
        >
          {tutorial.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 line-clamp-2 mb-5 leading-relaxed">
          {tutorial.description}
        </p>

        {/* Metadata row: difficulty + reading time + date */}
        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-slate-500">
          {diff && (
            <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium', diff.color)}>
              {diff.label}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            {formatReadingTime(tutorial.readingTime)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            {tutorial.date}
          </span>
        </div>

        {/* Author + tag chips */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 mr-1">
            <User className="w-3 h-3" />
            {tutorial.author}
          </span>
          {tutorial.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-mono"
            >
              {tag}
            </span>
          ))}
          {tutorial.tags.length > 3 && (
            <span className="text-[10px] text-slate-600 font-mono">+{tutorial.tags.length - 3}</span>
          )}
        </div>
      </article>
    </Link>
  )
}
