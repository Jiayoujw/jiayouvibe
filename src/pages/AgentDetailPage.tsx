import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Globe, Check, Lightbulb, Layers } from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import { agents } from '@/data/agents'
import { formatStars } from '@/utils/formatDate'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

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

export default function AgentDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const agent = agents.find((a) => a.slug === slug)

  useEffect(() => {
    if (agent) {
      document.title = `${agent.name} - AI智能体 | ${SITE_NAME}`
    } else {
      document.title = `智能体未找到 | ${SITE_NAME}`
    }
  }, [agent])

  if (!agent) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          className="mb-8"
          items={[
            { label: '首页', href: '/#/' },
            { label: 'AI智能体', href: '/#/agents' },
            { label: '未找到' },
          ]}
        />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-400/10 border border-red-400/20 mb-6">
            <Layers className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-sora font-semibold text-slate-200 mb-2">未找到该智能体</h2>
          <p className="text-slate-500 mb-8">slug: {slug}</p>
          <Link to="/agents">
            <Button variant="secondary">返回智能体列表</Button>
          </Link>
        </div>
      </div>
    )
  }

  const badgeColor = typeColorMap[agent.type] || 'cyan'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        className="mb-8"
        items={[
          { label: '首页', href: '/#/' },
          { label: 'AI智能体', href: '/#/agents' },
          { label: agent.name },
        ]}
      />

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Hero */}
          <Card className="p-6 sm:p-8 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: `radial-gradient(600px circle at 20% 30%, rgba(6, 182, 212, 0.06), transparent 50%)`,
              }}
            />

            <div className="relative">
              {/* Title row */}
              <div className="flex flex-wrap items-start gap-4 justify-between mb-4">
                <h1 className="text-2xl sm:text-3xl font-sora font-bold text-slate-100">
                  {agent.name}
                </h1>
                <div className="flex items-center gap-3">
                  <Badge color={badgeColor} variant="glow">
                    {typeLabelMap[agent.type] || agent.type}
                  </Badge>
                  {agent.openSource && (
                    <Badge color="green" variant="outline">开源</Badge>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 font-jetbrains mb-6">
                {agent.githubStars !== undefined && (
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300 font-semibold">{formatStars(agent.githubStars)}</span>
                    <span className="text-slate-500">Stars</span>
                  </span>
                )}
                {agent.language && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span className="text-slate-300">{agent.language}</span>
                  </span>
                )}
              </div>

              {/* Tags */}
              {agent.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {agent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs
                        bg-white/5 border border-white/10 text-slate-400 font-jetbrains"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="text-slate-300 leading-relaxed text-base">
                {agent.longDescription}
              </p>
            </div>
          </Card>

          {/* Features */}
          <Card className="p-6 sm:p-8 mb-6">
            <h2 className="flex items-center gap-2.5 text-lg font-sora font-semibold text-slate-100 mb-5">
              <Layers className="w-5 h-5 text-purple-400" />
              核心功能
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {agent.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5
                    hover:bg-white/[0.06] hover:border-white/10 transition-colors duration-200"
                >
                  <Check className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Use Cases */}
          <Card className="p-6 sm:p-8 mb-6">
            <h2 className="flex items-center gap-2.5 text-lg font-sora font-semibold text-slate-100 mb-5">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              应用场景
            </h2>
            <div className="space-y-3">
              {agent.useCases.map((uc, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-400/10 text-amber-400 text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-slate-300">{uc}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Pricing */}
            {agent.pricing && (
              <Card className="p-5">
                <h3 className="text-sm font-sora font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  定价信息
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">{agent.pricing}</p>
              </Card>
            )}

            {/* Links */}
            <Card className="p-5">
              <h3 className="text-sm font-sora font-semibold text-slate-400 uppercase tracking-wider mb-4">
                相关链接
              </h3>
              <div className="space-y-3">
                {agent.website && (
                  <a
                    href={agent.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl
                      bg-cyan-400/5 border border-cyan-400/20
                      hover:bg-cyan-400/10 hover:border-cyan-400/40
                      transition-colors duration-200 group"
                  >
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-cyan-300 group-hover:text-cyan-200">官方网站</span>
                  </a>
                )}
                {agent.github && (
                  <a
                    href={agent.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl
                      bg-white/[0.03] border border-white/10
                      hover:bg-white/[0.08] hover:border-white/20
                      transition-colors duration-200 group"
                  >
                    <Globe className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
                    <span className="text-sm text-slate-400 group-hover:text-slate-200">GitHub</span>
                    {agent.githubStars !== undefined && (
                      <span className="ml-auto text-xs text-slate-500 flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400" />
                        {formatStars(agent.githubStars)}
                      </span>
                    )}
                  </a>
                )}
              </div>
            </Card>

            {/* Back link */}
            <Link
              to="/agents"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                bg-white/5 border border-white/10 text-slate-400 text-sm
                hover:bg-white/10 hover:text-slate-200 hover:border-white/20
                transition-all duration-200"
            >
              返回智能体列表
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
