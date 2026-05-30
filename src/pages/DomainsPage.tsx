import { Link } from 'react-router-dom'
import {
  Palette,
  Music,
  Video,
  Code2,
  HeartPulse,
  GraduationCap,
  Landmark,
  ShieldCheck,
  Gamepad2,
  Bot,
  Sprout,
  FlaskConical,
  ArrowRight,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react'
import { domains } from '@/data/domains'
import type { Domain } from '@/types'

// ---------------------------------------------------------------------------
// Icon lookup – resolved dynamically from each domain's `.icon` string
// ---------------------------------------------------------------------------
const iconMap: Record<string, LucideIcon> = {
  palette: Palette,
  music: Music,
  video: Video,
  'code-2': Code2,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  landmark: Landmark,
  'shield-check': ShieldCheck,
  'gamepad-2': Gamepad2,
  bot: Bot,
  sprout: Sprout,
  'flask-conical': FlaskConical,
}

// ---------------------------------------------------------------------------
// Per‑domain accent colours
// ---------------------------------------------------------------------------
type Accent = {
  from: string
  to: string
  text: string
  glow: string
  border: string
  tagBg: string
  tagText: string
  tagBorder: string
}

const accentMap: Record<string, Accent> = {
  palette: {
    from: '#a855f7',
    to: '#c084fc',
    text: 'text-purple-400',
    glow: 'rgba(168,85,247,0.40)',
    border: 'border-purple-500/50',
    tagBg: 'bg-purple-500/10',
    tagText: 'text-purple-400',
    tagBorder: 'border-purple-500/20',
  },
  music: {
    from: '#ec4899',
    to: '#f472b6',
    text: 'text-pink-400',
    glow: 'rgba(236,72,153,0.40)',
    border: 'border-pink-500/50',
    tagBg: 'bg-pink-500/10',
    tagText: 'text-pink-400',
    tagBorder: 'border-pink-500/20',
  },
  video: {
    from: '#06b6d4',
    to: '#67e8f9',
    text: 'text-cyan-400',
    glow: 'rgba(6,182,212,0.40)',
    border: 'border-cyan-500/50',
    tagBg: 'bg-cyan-500/10',
    tagText: 'text-cyan-400',
    tagBorder: 'border-cyan-500/20',
  },
  'code-2': {
    from: '#3b82f6',
    to: '#93c5fd',
    text: 'text-blue-400',
    glow: 'rgba(59,130,246,0.40)',
    border: 'border-blue-500/50',
    tagBg: 'bg-blue-500/10',
    tagText: 'text-blue-400',
    tagBorder: 'border-blue-500/20',
  },
  'heart-pulse': {
    from: '#22c55e',
    to: '#86efac',
    text: 'text-green-400',
    glow: 'rgba(34,197,94,0.40)',
    border: 'border-green-500/50',
    tagBg: 'bg-green-500/10',
    tagText: 'text-green-400',
    tagBorder: 'border-green-500/20',
  },
  'graduation-cap': {
    from: '#f59e0b',
    to: '#fcd34d',
    text: 'text-amber-400',
    glow: 'rgba(245,158,11,0.40)',
    border: 'border-amber-500/50',
    tagBg: 'bg-amber-500/10',
    tagText: 'text-amber-400',
    tagBorder: 'border-amber-500/20',
  },
  landmark: {
    from: '#eab308',
    to: '#fde047',
    text: 'text-yellow-400',
    glow: 'rgba(234,179,8,0.40)',
    border: 'border-yellow-500/50',
    tagBg: 'bg-yellow-500/10',
    tagText: 'text-yellow-400',
    tagBorder: 'border-yellow-500/20',
  },
  'shield-check': {
    from: '#ef4444',
    to: '#fca5a5',
    text: 'text-red-400',
    glow: 'rgba(239,68,68,0.40)',
    border: 'border-red-500/50',
    tagBg: 'bg-red-500/10',
    tagText: 'text-red-400',
    tagBorder: 'border-red-500/20',
  },
  'gamepad-2': {
    from: '#f97316',
    to: '#fdba74',
    text: 'text-orange-400',
    glow: 'rgba(249,115,22,0.40)',
    border: 'border-orange-500/50',
    tagBg: 'bg-orange-500/10',
    tagText: 'text-orange-400',
    tagBorder: 'border-orange-500/20',
  },
  bot: {
    from: '#14b8a6',
    to: '#5eead4',
    text: 'text-teal-400',
    glow: 'rgba(20,184,166,0.40)',
    border: 'border-teal-500/50',
    tagBg: 'bg-teal-500/10',
    tagText: 'text-teal-400',
    tagBorder: 'border-teal-500/20',
  },
  sprout: {
    from: '#84cc16',
    to: '#bef264',
    text: 'text-lime-400',
    glow: 'rgba(132,204,22,0.40)',
    border: 'border-lime-500/50',
    tagBg: 'bg-lime-500/10',
    tagText: 'text-lime-400',
    tagBorder: 'border-lime-500/20',
  },
  'flask-conical': {
    from: '#6366f1',
    to: '#a5b4fc',
    text: 'text-indigo-400',
    glow: 'rgba(99,102,241,0.40)',
    border: 'border-indigo-500/50',
    tagBg: 'bg-indigo-500/10',
    tagText: 'text-indigo-400',
    tagBorder: 'border-indigo-500/20',
  },
}

const fallbackAccent: Accent = accentMap.palette

function getAccent(icon: string): Accent {
  return accentMap[icon] ?? fallbackAccent
}

// ---------------------------------------------------------------------------
// Sub‑components
// ---------------------------------------------------------------------------
function IconCircle({ domain, accent }: { domain: Domain; accent: Accent }) {
  const IconComponent = iconMap[domain.icon]
  if (!IconComponent) return null

  return (
    <div
      className="relative w-16 h-16 rounded-full p-[2px] flex-shrink-0"
      style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}
    >
      <div className="w-full h-full rounded-full bg-slate-950 dark:bg-slate-900 flex items-center justify-center">
        <IconComponent size={28} className={accent.text} strokeWidth={1.5} />
      </div>
    </div>
  )
}

function DomainCard({ domain, accent }: { domain: Domain; accent: Accent }) {
  const linkContent = (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${accent.text} group-hover:gap-2 transition-all`}>
      了解更多
      {domain.isInternal ? (
        <ArrowRight size={16} />
      ) : (
        <ExternalLink size={15} />
      )}
    </span>
  )

  return (
    <div
      className="group glass-card rounded-xl p-8 transition-all duration-300 hover:scale-[1.02] flex flex-col"
      style={
        { '--card-glow': accent.glow } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 30px ${accent.glow}, 0 0 60px ${accent.glow.replace('0.40', '0.15')}`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Top: icon + heading */}
      <div className="flex items-start gap-5">
        <IconCircle domain={domain} accent={accent} />
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="text-xl font-bold text-slate-100 tracking-tight">
            {domain.name}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="mt-5 text-sm leading-relaxed text-slate-400 line-clamp-3">
        {domain.description}
      </p>

      {/* Tags */}
      <div className="mt-5 flex flex-wrap gap-2">
        {domain.tags.slice(0, 5).map((tag) => (
          <span
            key={tag}
            className={`inline-block px-2.5 py-0.5 text-xs rounded-full border ${accent.tagBg} ${accent.tagText} ${accent.tagBorder}`}
          >
            {tag}
          </span>
        ))}
        {domain.tags.length > 5 && (
          <span className="inline-block px-2.5 py-0.5 text-xs rounded-full border border-slate-700 bg-slate-800 text-slate-500">
            +{domain.tags.length - 5}
          </span>
        )}
      </div>

      {/* Link */}
      <div className="mt-6 pt-5 border-t border-white/10">
        {domain.isInternal ? (
          <Link to={domain.link} className="inline-flex">
            {linkContent}
          </Link>
        ) : (
          <a
            href={domain.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            {linkContent}
          </a>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function DomainsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-4">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-accent-purple/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="gradient-text">探索更多AI领域</span>
          </h1>
          <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            从绘画到音乐，从编程到机器人 —— 全方位追踪AI在各行各业的前沿突破与应用落地。
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domains.map((domain) => (
            <DomainCard
              key={domain.slug}
              domain={domain}
              accent={getAccent(domain.icon)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
