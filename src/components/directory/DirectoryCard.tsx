import { Globe, ExternalLink } from 'lucide-react'
import type { DirectoryEntry } from '@/types'
import { DIRECTORY_CATEGORIES } from '@/utils/constants'
import { cn } from '@/utils/cn'

interface DirectoryCardProps {
  entry: DirectoryEntry
  featured?: boolean
}

const languageConfig: Record<string, { label: string; className: string }> = {
  zh: { label: '中文', className: 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/30' },
  en: { label: 'English', className: 'bg-blue-400/15 text-blue-300 border border-blue-400/30' },
  both: { label: '双语', className: 'bg-purple-500/15 text-purple-300 border border-purple-500/30' },
}

const DirectoryCard = ({ entry, featured = false }: DirectoryCardProps) => {
  const lang = languageConfig[entry.language] ?? languageConfig.en

  return (
    <article
      className={cn(
        'glass-card card-hover p-5 flex flex-col gap-3 relative group',
        featured && 'ring-1 ring-purple-500/30 shadow-lg shadow-purple-500/10',
      )}
    >
      {/* Top row: globe icon + language badge */}
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-500/20">
          <Globe className="w-5 h-5 text-white" />
        </div>

        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide',
            lang.className,
          )}
        >
          {lang.label}
        </span>
      </div>

      {/* Name + external link */}
      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-start gap-1 text-base font-semibold text-slate-100 hover:text-cyan-300 transition-colors leading-snug"
      >
        <span className="line-clamp-1">{entry.name}</span>
        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
      </a>

      {/* Category badge */}
      <span className="self-start inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium tracking-wide bg-white/5 text-slate-300 border border-white/10">
        {DIRECTORY_CATEGORIES[entry.category] ?? entry.category}
      </span>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
        {entry.description}
      </p>
    </article>
  )
}

export default DirectoryCard
