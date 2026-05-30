import { Globe, Star, GitFork } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatStars } from '@/utils/formatDate'
import type { GitHubRepo } from '@/types'

const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Go: '#00ADD8',
  Rust: '#dea584',
}

function getRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return isoString
    const now = Date.now()
    const diff = now - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    const months = Math.floor(days / 30)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 30) return `${days}天前`
    if (months < 12) return `${months}个月前`
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return isoString
  }
}

interface RepoCardProps {
  repo: GitHubRepo
}

const RepoCard = ({ repo }: RepoCardProps) => {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'block p-5 rounded-2xl',
        'bg-white/5 backdrop-blur-xl border border-white/10',
        'transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 hover:border-white/20 hover:bg-white/[0.07]',
        'group',
      )}
    >
      {/* Top row: owner info + stats */}
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Left: owner avatar + name */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
            <Globe className="w-4 h-4 text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-sora font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
              {repo.owner}
            </p>
            <p className="text-xs text-slate-500 truncate font-jetbrains">
              {repo.name}
            </p>
          </div>
        </div>

        {/* Right: star & fork counts */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5" fill="currentColor" />
            <span className="text-xs font-jetbrains font-medium text-slate-300">
              {formatStars(repo.stars)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <GitFork className="w-3.5 h-3.5" />
            <span className="text-xs font-jetbrains font-medium text-slate-400">
              {repo.forks}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-sm text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {repo.description}
        </p>
      )}

      {/* Bottom row: language, topics, time */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Language dot + name */}
        {repo.language && (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-jetbrains">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: LANGUAGE_COLORS[repo.language] ?? '#94a3b8' }}
            />
            {repo.language}
          </span>
        )}

        {/* Topic chips */}
        {repo.topics.slice(0, 4).map((topic) => (
          <span
            key={topic}
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-full text-[11px]',
              'bg-white/5 border border-white/5 text-slate-500',
              'font-jetbrains',
            )}
          >
            {topic}
          </span>
        ))}

        {/* Spacer */}
        <span className="flex-1" />

        {/* Update time */}
        {repo.updatedAt && (
          <span className="text-[11px] text-slate-600 font-jetbrains flex-shrink-0">
            {getRelativeTime(repo.updatedAt)}更新
          </span>
        )}
      </div>
    </a>
  )
}

export default RepoCard
