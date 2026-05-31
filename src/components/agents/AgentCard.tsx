import { Link } from 'react-router-dom'
import { Star, Check, Globe } from 'lucide-react'
import type { AIAgent } from '@/types'
import { formatStars } from '@/utils/formatDate'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { cn } from '@/utils/cn'
import FavoriteButton from '@/components/ui/FavoriteButton'

interface AgentCardProps {
  agent: AIAgent
}

const typeColorMap: Record<string, 'purple' | 'cyan' | 'pink' | 'amber'> = {
  framework: 'purple',
  platform: 'cyan',
  tool: 'pink',
  agent: 'amber',
}

const typeLabelMap: Record<string, string> = {
  framework: '开发框架',
  platform: 'Agent平台',
  tool: '工具',
  agent: '独立Agent',
}

export default function AgentCard({ agent }: AgentCardProps) {
  const badgeColor = typeColorMap[agent.type] || 'cyan'
  const displayFeatures = agent.features.slice(0, 3)

  return (
    <Card
      hover
      className="group flex flex-col h-full p-6 relative overflow-hidden"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(6, 182, 212, 0.07), transparent 40%)`,
        }}
      />

      {/* Favorite button */}
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton
          id={agent.slug}
          type="agent"
          name={agent.name}
          url={`/agents/${agent.slug}`}
        />
      </div>

      {/* Header: Name + Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-sora font-semibold text-slate-100 group-hover:text-white transition-colors line-clamp-1">
          {agent.name}
        </h3>
        <Badge color={badgeColor} className="shrink-0">
          {typeLabelMap[agent.type] || agent.type}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4 flex-1">
        {agent.description}
      </p>

      {/* Features */}
      <div className="mb-4 space-y-1.5">
        {displayFeatures.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
            <span className="text-xs text-slate-500 line-clamp-1">{feature}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
        {agent.githubStars !== undefined && (
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 font-medium">{formatStars(agent.githubStars)}</span>
          </span>
        )}
        {agent.language && (
          <span className="flex items-center gap-1.5">
            <span
              className={cn(
                'inline-block w-2 h-2 rounded-full',
                agent.language.includes('Python') && 'bg-blue-400',
                agent.language.includes('TypeScript') && 'bg-sky-400',
                agent.language.includes('C#') && 'bg-purple-400',
                agent.language.includes('Java') && 'bg-orange-400',
                agent.language.includes('可视化') && 'bg-emerald-400',
                agent.language.includes('多语言') && 'bg-gradient-to-r from-cyan-400 to-pink-400',
              )}
            />
            <span className="text-slate-400">{agent.language}</span>
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-3 border-t border-white/5">
        {agent.website && (
          <a
            href={agent.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl
              border border-cyan-400/30 text-cyan-300
              hover:bg-cyan-400/10 hover:border-cyan-400/50
              active:scale-[0.97] transition-all duration-200"
          >
            <Globe className="w-3.5 h-3.5" />
            官网
          </a>
        )}
        {agent.github ? (
          <a
            href={agent.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl
              text-slate-400 hover:text-slate-200 hover:bg-white/5
              active:scale-[0.97] transition-all duration-200"
          >
            <Globe className="w-3.5 h-3.5" />
            GitHub
          </a>
        ) : (
          <Link
            to={`/agents/${agent.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl
              text-purple-400 hover:text-purple-300 hover:bg-purple-400/5
              active:scale-[0.97] transition-all duration-200 ml-auto"
          >
            详情
          </Link>
        )}
      </div>
    </Card>
  )
}
