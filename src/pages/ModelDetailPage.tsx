import { useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Database,
  Cpu,
  DollarSign,
  Cloud,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Globe,
  Tag,
  Bot,
  ArrowRight,
  Calendar,
  Layers,
} from 'lucide-react'
import { models } from '@/data/models'
import { MODEL_CATEGORIES, SITE_NAME } from '@/utils/constants'
import { cn } from '@/utils/cn'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import ReadingProgress from '@/components/ui/ReadingProgress'
import ShareButtons from '@/components/community/ShareButtons'
import CommentSection from '@/components/community/CommentSection'

/** Provider badge colors matching ModelCard */
const providerStyles: Record<string, { bg: string; text: string; border: string }> = {
  'OpenAI': { bg: 'bg-emerald-400/15', text: 'text-emerald-300', border: 'border-emerald-400/30' },
  'Anthropic': { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  'Google DeepMind': { bg: 'bg-blue-400/15', text: 'text-blue-300', border: 'border-blue-400/30' },
  'DeepSeek（深度求索）': { bg: 'bg-indigo-400/15', text: 'text-indigo-300', border: 'border-indigo-400/30' },
  'Meta': { bg: 'bg-blue-400/15', text: 'text-blue-300', border: 'border-blue-400/30' },
  'Mistral AI': { bg: 'bg-teal-400/15', text: 'text-teal-300', border: 'border-teal-400/30' },
  'xAI (Elon Musk)': { bg: 'bg-slate-400/15', text: 'text-[var(--color-text-primary)]', border: 'border-slate-400/30' },
  'Alibaba Cloud（阿里云）': { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  'Stability AI': { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
  'Midjourney Inc.': { bg: 'bg-pink-500/15', text: 'text-pink-300', border: 'border-pink-500/30' },
}
const defaultProviderStyle = { bg: 'bg-cyan-400/15', text: 'text-cyan-300', border: 'border-cyan-400/30' }

function StatCard({
  icon: Icon,
  label,
  value,
  accent = 'cyan',
}: {
  icon: React.FC<{ className?: string }>
  label: string
  value: string
  accent?: 'cyan' | 'purple' | 'amber' | 'emerald'
}) {
  const accentMap = {
    cyan: 'text-cyan-400 shadow-cyan-400/20',
    purple: 'text-purple-400 shadow-purple-400/20',
    amber: 'text-amber-400 shadow-amber-400/20',
    emerald: 'text-emerald-400 shadow-emerald-400/20',
  }
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
      <div
        className={cn(
          'flex items-center justify-center h-10 w-10 rounded-lg bg-white/[0.06] shadow-sm shrink-0',
          accentMap[accent],
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-jetbrains mb-0.5">
          {label}
        </p>
        <p className="text-sm text-[var(--color-text-primary)] font-medium leading-snug">{value}</p>
      </div>
    </div>
  )
}

const ModelDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()

  const model = useMemo(() => models.find((m) => m.slug === slug), [slug])

  useEffect(() => {
    if (model) {
      document.title = `${model.name} - AI大模型 | ${SITE_NAME}`
    } else {
      document.title = `模型未找到 | ${SITE_NAME}`
    }
  }, [model])

  // 3 related models: same category, different slug
  const relatedModels = useMemo(() => {
    if (!model) return []
    return models.filter((m) => m.category === model.category && m.slug !== model.slug).slice(0, 3)
  }, [model])

  // Not found
  if (!model) {
    return (
      <EmptyState
        icon={<Bot className="h-6 w-6 text-[var(--color-text-secondary)]" />}
        title="模型未找到"
        description="没有找到对应的AI模型信息，请检查链接是否正确。"
        action={{ label: '返回模型列表', onClick: () => window.history.back() }}
      />
    )
  }

  const providerStyle = providerStyles[model.provider] ?? defaultProviderStyle
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://jiayouvibe.com/#/models/${model.slug}`

  return (
    <>
      <ReadingProgress />
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: '首页', href: '/' },
          { label: 'AI大模型', href: '/models' },
          { label: model.name },
        ]}
        className="mb-2"
      />

      {/* ======== Hero Section ======== */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1">
            {/* Name + Provider Badge */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-2xl md:text-3xl font-sora font-bold text-[var(--color-text-primary)]">
                {model.name}
              </h1>
              <span
                className={cn(
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-jetbrains font-medium tracking-wide border',
                  providerStyle.bg,
                  providerStyle.text,
                  providerStyle.border,
                )}
              >
                {model.provider}
              </span>
            </div>

            {/* Description */}
            <p className="text-[var(--color-text-primary)] leading-relaxed max-w-3xl">
              {model.longDescription}
            </p>
          </div>
        </div>

        {/* Stat Cards (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Database}
            label="参数规模"
            value={model.parameters ?? '未公开'}
            accent="cyan"
          />
          <StatCard
            icon={Cpu}
            label="上下文窗口"
            value={model.contextWindow ?? '不适用'}
            accent="purple"
          />
          <StatCard
            icon={DollarSign}
            label="定价"
            value={model.pricing ?? '暂无定价信息'}
            accent="amber"
          />
          <StatCard
            icon={Cloud}
            label="API状态"
            value={model.apiAvailable ? 'API 可用' : '无公开 API'}
            accent="emerald"
          />
        </div>

        {/* Meta line: release date, open source, category */}
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-5 border-t border-white/[0.06]">
          {model.releaseDate && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-jetbrains">
              <Calendar className="h-3.5 w-3.5" />
              {model.releaseDate}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-jetbrains">
            <Layers className="h-3.5 w-3.5" />
            {MODEL_CATEGORIES[model.category] ?? model.category}
          </span>
          <Badge
            color={model.openSource ? 'green' : 'purple'}
            variant="outline"
          >
            {model.openSource ? '开源' : '闭源'}
          </Badge>
          <Link
            to={model.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-jetbrains"
          >
            <Globe className="h-3.5 w-3.5" />
            官方网站
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* ======== Two-Column Content ======== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 8 cols */}
        <div className="lg:col-span-8 space-y-8">
          {/* Strengths */}
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-sora font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              优势特点
            </h2>
            <ul className="space-y-3">
              {model.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-[var(--color-text-primary)] text-sm leading-relaxed">
                  <CheckCircle className="h-4 w-4 text-emerald-400/70 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </section>

          {/* Use Cases */}
          <section>
            <h2 className="text-lg font-sora font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Bot className="h-5 w-5 text-cyan-400" />
              应用场景
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {model.useCases.map((uc, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-cyan-400/30 hover:bg-white/[0.07] transition-colors"
                >
                  <p className="text-sm text-[var(--color-text-primary)] font-medium">{uc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Limitations */}
          {model.weaknesses.length > 0 && (
            <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-sora font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                局限性
              </h2>
              <ul className="space-y-3">
                {model.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-[var(--color-text-primary)] text-sm leading-relaxed">
                    <AlertTriangle className="h-4 w-4 text-amber-400/70 mt-0.5 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column: 4 cols */}
        <div className="lg:col-span-4 space-y-6">
          {/* Share */}
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-sora font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              分享
            </h3>
            <ShareButtons
              url={shareUrl}
              title={`${model.name} - AI大模型 | jiayouvibe`}
              description={model.description}
            />
          </section>

          {/* Quick Links */}
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-sora font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-cyan-400" />
              快速链接
            </h3>
            <div className="space-y-2">
              <Link
                to={model.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-[var(--color-text-primary)] hover:text-cyan-300 hover:border-cyan-400/30 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  官方网站
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
              </Link>
              <Link
                to="/models"
                className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-[var(--color-text-primary)] hover:text-cyan-300 hover:border-cyan-400/30 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  浏览所有模型
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
              </Link>
            </div>
          </section>

          {/* Tags Cloud */}
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-sora font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Tag className="h-4 w-4 text-purple-400" />
              标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {model.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-jetbrains text-[var(--color-text-secondary)] bg-white/[0.05] border border-white/[0.08] hover:border-cyan-400/30 hover:text-cyan-300 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Related Models */}
          {relatedModels.length > 0 && (
            <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-sora font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <Bot className="h-4 w-4 text-amber-400" />
                相关模型
              </h3>
              <div className="space-y-3">
                {relatedModels.map((rm) => (
                  <Link
                    key={rm.slug}
                    to={`/models/${rm.slug}`}
                    className="block p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-cyan-400/30 hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">{rm.name}</span>
                      <ArrowRight className="h-3 w-3 text-[var(--color-text-muted)]" />
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] line-clamp-1">{rm.provider}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/*
        Giscus comments — powered by GitHub Discussions.
        SETUP: Visit https://giscus.app → enter "Jiayoujw/jiayouvibe" →
        copy your repoId and categoryId → replace the REPLACE_ME values below.
      */}
      <CommentSection
        repo="Jiayoujw/jiayouvibe"
        repoId="R_kgDO_REPLACE_ME"
        category="General"
        categoryId="DIC_kwDO_REPLACE_ME"
      />
    </div>
    </>
  )
}

export default ModelDetailPage
