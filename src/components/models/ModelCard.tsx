import { Link } from 'react-router-dom'
import { Database, Cpu, DollarSign, Cloud, Tag } from 'lucide-react'
import type { AIModel } from '@/types'
import { cn } from '@/utils/cn'
import FavoriteButton from '@/components/ui/FavoriteButton'

interface ModelCardProps {
  model: AIModel
}

const providerStyles: Record<string, { bg: string; text: string; border: string }> = {
  'OpenAI': {
    bg: 'bg-emerald-400/15',
    text: 'text-emerald-300',
    border: 'border-emerald-400/30',
  },
  'Anthropic': {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
  },
  'Google DeepMind': {
    bg: 'bg-blue-400/15',
    text: 'text-blue-300',
    border: 'border-blue-400/30',
  },
  'DeepSeek（深度求索）': {
    bg: 'bg-indigo-400/15',
    text: 'text-indigo-300',
    border: 'border-indigo-400/30',
  },
  'Meta': {
    bg: 'bg-blue-400/15',
    text: 'text-blue-300',
    border: 'border-blue-400/30',
  },
  'Mistral AI': {
    bg: 'bg-teal-400/15',
    text: 'text-teal-300',
    border: 'border-teal-400/30',
  },
  'xAI (Elon Musk)': {
    bg: 'bg-slate-400/15',
    text: 'text-slate-300',
    border: 'border-slate-400/30',
  },
  'Alibaba Cloud（阿里云）': {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
  },
  'Stability AI': {
    bg: 'bg-purple-500/15',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
  },
  'Midjourney Inc.': {
    bg: 'bg-pink-500/15',
    text: 'text-pink-300',
    border: 'border-pink-500/30',
  },
}

const defaultProviderStyle = {
  bg: 'bg-cyan-400/15',
  text: 'text-cyan-300',
  border: 'border-cyan-400/30',
}

function ProviderBadge({ provider }: { provider: string }) {
  const style = providerStyles[provider] ?? defaultProviderStyle
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-jetbrains font-medium tracking-wide border',
        style.bg,
        style.text,
        style.border,
      )}
    >
      {provider}
    </span>
  )
}

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.FC<{ className?: string }>
  label: string
  value?: string
}) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.03]">
      <Icon className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-jetbrains mb-0.5">
          {label}
        </p>
        <p className="text-xs text-slate-300 leading-relaxed break-words">{value}</p>
      </div>
    </div>
  )
}

const ModelCard = ({ model }: ModelCardProps) => {
  return (
    <Link to={`/models/${model.slug}`} className="block group relative">
      {/* Favorite button */}
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton
          id={model.slug}
          type="model"
          name={model.name}
          url={`/models/${model.slug}`}
        />
      </div>
      <div
        className={cn(
          'h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5',
          'transition-all duration-300',
          'hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-400/10 hover:border-cyan-400/40 hover:bg-white/[0.07]',
        )}
      >
        {/* Header: Name + Provider Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-sora font-semibold text-white truncate group-hover:text-cyan-200 transition-colors">
            {model.name}
          </h3>
          <ProviderBadge provider={model.provider} />
        </div>

        {/* Description (2 lines) */}
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4">
          {model.description}
        </p>

        {/* Stats: 2x2 grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <StatItem icon={Database} label="参数规模" value={model.parameters} />
          <StatItem icon={Cpu} label="上下文窗口" value={model.contextWindow} />
          <StatItem icon={DollarSign} label="定价" value={model.pricing} />
          <StatItem
            icon={Cloud}
            label="API状态"
            value={model.apiAvailable ? 'API 可用' : '无公开 API'}
          />
        </div>

        {/* Tags */}
        {model.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {model.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-jetbrains text-slate-400 bg-white/[0.04] border border-white/[0.06]"
              >
                <Tag className="h-2.5 w-2.5 text-cyan-500/60" />
                {tag}
              </span>
            ))}
            {model.tags.length > 4 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-jetbrains text-slate-500 bg-white/[0.02]">
                +{model.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export default ModelCard
