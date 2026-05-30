import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
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
  Wrench,
  BookOpen,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import { domains } from '@/data/domains'
import { terms } from '@/data/terminology'
import type { Term } from '@/types'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'

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
// Hardcoded core tools per domain slug
// ---------------------------------------------------------------------------
interface ToolEntry {
  name: string
  description: string
}

const coreToolsMap: Record<string, ToolEntry[]> = {
  'ai-painting': [
    { name: 'Midjourney', description: '最受欢迎的AI图像生成平台，以卓越的艺术风格和高质量输出著称。' },
    { name: 'Stable Diffusion', description: '开源图像生成模型，支持本地部署和高度自定义，拥有庞大的社区生态。' },
    { name: 'DALL-E 3', description: 'OpenAI推出的文本到图像生成模型，与ChatGPT深度集成，自然语言理解能力出众。' },
  ],
  'ai-coding': [
    { name: 'GitHub Copilot', description: 'GitHub与OpenAI合作推出的AI编程助手，深度集成主流IDE，大幅提升编码效率。' },
    { name: 'Cursor', description: '基于VS Code的AI原生代码编辑器，提供上下文感知的代码补全和智能对话编程体验。' },
    { name: 'Windsurf', description: 'Codeium推出的AI驱动的IDE，支持多文件编辑和级联式AI交互，提升复杂任务处理能力。' },
  ],
  'ai-video': [
    { name: 'Sora', description: 'OpenAI推出的突破性文生视频模型，能够生成长达一分钟的高质量视频内容。' },
    { name: 'Runway', description: '专业的AI视频编辑与生成平台，提供从视频生成到后期处理的全套AI工具。' },
    { name: 'Kling（可灵）', description: '快手推出的AI视频生成模型，在中文场景和短视频创作中表现突出。' },
  ],
  'ai-music': [
    { name: 'Suno', description: '领先的AI音乐生成平台，支持通过文本描述直接生成包含人声和伴奏的完整歌曲。' },
    { name: 'Udio', description: '高质量的AI音乐生成工具，以出色的声音质感和音乐性受到音乐创作者青睐。' },
  ],
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getRelevantTerms(domainTags: string[]): Term[] {
  return terms.filter((term) =>
    domainTags.some((dt) =>
      term.tags.some((tt) => tt.toLowerCase() === dt.toLowerCase()),
    ),
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function DomainDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const domain = domains.find((d) => d.slug === slug)

  useEffect(() => {
    if (domain) {
      document.title = `${domain.name} - AI领域 | ${SITE_NAME}`
    } else {
      document.title = `领域未找到 | ${SITE_NAME}`
    }
  }, [domain])

  // ── Not found ───────────────────────────────────────────────────────────
  if (!domain) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          className="mb-8"
          items={[
            { label: '首页', href: '/#/' },
            { label: '更多AI领域', href: '/#/domains' },
            { label: '未找到' },
          ]}
        />
        <EmptyState
          icon={<Wrench className="w-8 h-8 text-slate-400" />}
          title="该领域页面建设中"
          description={slug ? `slug: ${slug}` : '未指定领域'}
        />
      </div>
    )
  }

  const accent = getAccent(domain.icon)
  const IconComponent = iconMap[domain.icon]
  const relevantTerms = getRelevantTerms(domain.tags).slice(0, 8)
  const coreTools: ToolEntry[] = coreToolsMap[domain.slug] ?? []
  const showTagAsTools = coreTools.length === 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        className="mb-8"
        items={[
          { label: '首页', href: '/#/' },
          { label: '更多AI领域', href: '/#/domains' },
          { label: domain.name },
        ]}
      />

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* ================================================================= */}
        {/* Main Content */}
        {/* ================================================================= */}
        <div className="lg:col-span-2">
          {/* ── Hero ─────────────────────────────────────────────────── */}
          <Card className="p-8 sm:p-10 mb-6 relative overflow-hidden">
            {/* Radial glow behind the icon */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: `radial-gradient(600px circle at 25% 30%, ${accent.glow}, transparent 50%)`,
              }}
            />

            <div className="relative flex flex-col sm:flex-row items-start gap-6">
              {/* Large gradient icon circle */}
              {IconComponent && (
                <div
                  className="relative w-24 h-24 rounded-full p-[3px] flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                  }}
                >
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                    <IconComponent size={42} className={accent.text} strokeWidth={1.5} />
                  </div>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-sora font-bold text-slate-100 mb-3">
                  {domain.name}
                </h1>
                <p className="text-slate-400 leading-relaxed text-base">
                  {domain.description}
                </p>

                {/* Tags */}
                {domain.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {domain.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${accent.tagBg} ${accent.tagText} ${accent.tagBorder} font-jetbrains`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* ── 核心工具 ─────────────────────────────────────────────── */}
          <Card className="p-6 sm:p-8 mb-6">
            <h2 className="flex items-center gap-2.5 text-lg font-sora font-semibold text-slate-100 mb-5">
              <Wrench className="w-5 h-5 text-cyan-400" />
              核心工具
            </h2>

            {showTagAsTools ? (
              /* Fallback: show domain tags as tool entries */
              <div className="flex flex-wrap gap-2">
                {domain.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                      bg-cyan-400/5 border border-cyan-400/20 text-cyan-300 text-sm
                      hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {coreTools.map((tool, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 px-5 py-4 rounded-xl bg-white/[0.03] border border-white/5
                      hover:bg-white/[0.06] hover:border-white/10 transition-colors duration-200"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-400/10 text-cyan-400 text-sm font-bold shrink-0 mt-0.5 font-jetbrains">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-slate-200">{tool.name}</h3>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{tool.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* ── 相关术语 ─────────────────────────────────────────────── */}
          {relevantTerms.length > 0 && (
            <Card className="p-6 sm:p-8 mb-6">
              <h2 className="flex items-center gap-2.5 text-lg font-sora font-semibold text-slate-100 mb-5">
                <BookOpen className="w-5 h-5 text-purple-400" />
                相关术语
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {relevantTerms.map((term) => (
                  <div
                    key={term.id}
                    className="flex flex-col gap-1.5 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/5
                      hover:bg-white/[0.06] hover:border-white/10 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-200 truncate">
                        {term.term}
                      </span>
                      {term.abbreviation && (
                        <span className="text-xs font-jetbrains text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded shrink-0">
                          {term.abbreviation}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {term.definition}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* ================================================================= */}
        {/* Sidebar */}
        {/* ================================================================= */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Quick info card */}
            <Card className="p-5">
              <h3 className="text-sm font-sora font-semibold text-slate-400 uppercase tracking-wider mb-4">
                领域信息
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">标签数量</span>
                  <span className="text-slate-300 font-jetbrains">{domain.tags.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">相关术语</span>
                  <span className="text-slate-300 font-jetbrains">{relevantTerms.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">核心工具</span>
                  <span className="text-slate-300 font-jetbrains">
                    {showTagAsTools ? domain.tags.length : coreTools.length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Back link */}
            <Link
              to="/domains"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                bg-white/5 border border-white/10 text-slate-400 text-sm
                hover:bg-white/10 hover:text-slate-200 hover:border-white/20
                transition-all duration-200"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              返回领域列表
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
