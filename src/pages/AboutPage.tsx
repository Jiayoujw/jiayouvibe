import { useEffect } from 'react'
import {
  Info,
  Cpu,
  BookOpen,
  Globe,
  Code2,
  Heart,
  Target,
  Mail,
  ExternalLink,
  Layers,
} from 'lucide-react'
import { SITE_NAME, SITE_DESCRIPTION } from '@/utils/constants'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const STATS = [
  { icon: Cpu, value: '18+', label: '模型收录' },
  { icon: BookOpen, value: '100+', label: '专业术语' },
  { icon: Globe, value: '50+', label: '精选网站' },
  { icon: Code2, value: '15+', label: '开发教程' },
] as const

const TECH_STACK = [
  { icon: Layers, name: 'React', color: 'text-cyan-400', ring: 'ring-cyan-500/30' },
  { icon: Code2, name: 'TypeScript', color: 'text-blue-400', ring: 'ring-blue-500/30' },
  { icon: Layers, name: 'Tailwind CSS', color: 'text-teal-400', ring: 'ring-teal-500/30' },
  { icon: Layers, name: 'Vite', color: 'text-purple-400', ring: 'ring-purple-500/30' },
] as const

const SOCIAL_LINKS = [
  { label: 'GitHub', url: 'https://github.com' },
  { label: 'Twitter / X', url: 'https://x.com' },
] as const

// ---------------------------------------------------------------------------
// Sub‑components
// ---------------------------------------------------------------------------

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Cpu
  value: string
  label: string
}) {
  return (
    <div className="glass-card flex flex-col items-center justify-center gap-3 p-6 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,219,231,0.15)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-500/20">
        <Icon size={22} className="text-cyan-400" strokeWidth={1.5} />
      </div>
      <span className="text-3xl font-extrabold text-slate-100 tracking-tight">
        {value}
      </span>
      <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
    </div>
  )
}

function TechCard({
  icon: Icon,
  name,
  color,
  ring,
}: {
  icon: typeof Layers
  name: string
  color: string
  ring: string
}) {
  return (
    <div
      className={`glass-card flex flex-col items-center justify-center gap-3 p-5 transition-all duration-300 hover:scale-105 hover:shadow-lg ${ring}`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800/60 ring-1 ring-white/10`}>
        <Icon size={20} className={color} strokeWidth={1.5} />
      </div>
      <span className="text-sm font-medium text-[var(--color-text-primary)]">{name}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AboutPage() {
  useEffect(() => {
    document.title = `关于我们 | ${SITE_NAME}`
  }, [])

  return (
    <div className="min-h-screen">
      {/* ================================================================= */}
      {/* Hero */}
      {/* ================================================================= */}
      <section className="relative py-24 px-4">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-accent-purple/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Icon badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 ring-1 ring-cyan-500/20 mb-6">
            <Info size={28} className="text-cyan-400" strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="gradient-text">关于我们</span>
          </h1>

          {/* Subtitle / site description */}
          <p className="mt-5 text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            {SITE_DESCRIPTION}
          </p>

          {/* Mission statement */}
          <div className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10">
            <Heart size={18} className="text-pink-400" strokeWidth={1.5} fill="rgba(244,114,182,0.2)" />
            <span className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
              让每个人都能轻松探索AI世界
            </span>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Stats Row */}
      {/* ================================================================= */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 我们的愿景 */}
      {/* ================================================================= */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <div className="glass-card p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
              <Target size={20} className="text-amber-400" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
              我们的愿景
            </h2>
          </div>

          <div className="space-y-4 text-sm md:text-base leading-relaxed text-[var(--color-text-secondary)]">
            <p>
              在人工智能飞速发展的时代，信息过载与知识壁垒成为了普通人接触AI的第一道门槛。
              <span className="font-semibold text-[var(--color-text-primary)]">jiayouvibe</span>
              的诞生，正是为了让AI知识不再高不可攀。
            </p>
            <p>
              我们致力于打造一个<strong className="text-[var(--color-text-primary)] font-semibold">开放、免费、持续更新</strong>的中文AI知识平台，
              从大语言模型到智能体开发，从基础概念到前沿技术，从精选工具到实战教程
              —— 无论你是AI初学者、开发者还是研究者，都能在这里找到你需要的内容。
            </p>
            <p>
              我们相信，<span className="text-[var(--color-text-primary)]">AI的未来属于每一个人</span>。
              让知识触手可及，让探索没有边界，这就是我们的使命。
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 技术栈 */}
      {/* ================================================================= */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <div className="glass-card p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
              <Layers size={20} className="text-indigo-400" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
              技术栈
            </h2>
          </div>

          <p className="text-sm text-[var(--color-text-muted)] mb-8 leading-relaxed">
            本站使用以下现代Web技术构建，追求极致的性能与开发体验。
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TECH_STACK.map((tech) => (
              <TechCard key={tech.name} {...tech} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 联系我们 */}
      {/* ================================================================= */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <div className="glass-card p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 ring-1 ring-green-500/20">
              <Mail size={20} className="text-green-400" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
              联系我们
            </h2>
          </div>

          <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
            如果你有任何问题、建议或合作意向，欢迎通过以下方式与我们取得联系。
          </p>

          {/* Email */}
          <a
            href="mailto:contact@jiayouvibe.com"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-slate-800/60 border border-[var(--color-border)]/60 text-sm font-medium text-[var(--color-text-primary)] transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-cyan-400"
          >
            <Mail size={17} strokeWidth={1.5} />
            contact@jiayouvibe.com
          </a>

          {/* Social links */}
          <div className="mt-6 flex flex-wrap gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/40 border border-[var(--color-border)]/40 text-sm text-[var(--color-text-secondary)] transition-all duration-300 hover:border-slate-600 hover:text-[var(--color-text-primary)] hover:bg-slate-800/70 group"
              >
                <span>{link.label}</span>
                <ExternalLink
                  size={14}
                  className="opacity-50 transition-all duration-200 group-hover:opacity-100 group-hover:text-cyan-400"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Footer note */}
      {/* ================================================================= */}
      <section className="max-w-3xl mx-auto px-4 pb-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Heart size={12} className="text-pink-500/60" fill="rgba(244,114,182,0.15)" />
            <span>
              {SITE_NAME} &middot; 2025年3月正式上线 &middot; 持续更新中
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
