import { Link } from 'react-router-dom'
import { Cpu, Bot, Code2, BookOpen, Globe, StickyNote } from 'lucide-react'
import { cn } from '@/utils/cn'

interface FeatureItem {
  title: string
  description: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  gradientFrom: string
  gradientTo: string
}

const features: FeatureItem[] = [
  {
    title: 'AI大模型',
    description: '探索主流大语言模型，对比性能、价格与应用场景',
    path: '/models',
    icon: Cpu,
    gradientFrom: 'from-cyan-400',
    gradientTo: 'to-cyan-300',
  },
  {
    title: 'AI智能体',
    description: '了解AI Agent平台、框架与工具，构建自主智能系统',
    path: '/agents',
    icon: Bot,
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-400',
  },
  {
    title: 'AI应用开发',
    description: '丰富的开发教程，从入门到部署的全链路学习路径',
    path: '/development',
    icon: Code2,
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-cyan-400',
  },
  {
    title: 'AI专业术语',
    description: '系统化的AI术语词典，覆盖基础概念到前沿技术',
    path: '/terminology',
    icon: BookOpen,
    gradientFrom: 'from-emerald-400',
    gradientTo: 'to-cyan-400',
  },
  {
    title: '网站收录',
    description: '精选AI相关网站与资源，一站导航AI工具生态',
    path: '/directory',
    icon: Globe,
    gradientFrom: 'from-orange-400',
    gradientTo: 'to-pink-400',
  },
  {
    title: '笔记系统',
    description: '内置云端笔记，随时记录AI学习心得与灵感',
    path: '/notes',
    icon: StickyNote,
    gradientFrom: 'from-violet-400',
    gradientTo: 'to-purple-400',
  },
]

export default function FeatureGrid() {
  return (
    <section className="relative bg-[#0f172a] py-24 sm:py-32">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-sora mb-4">
            AI知识体系
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            六大核心板块，构建完整的AI学习与实践路径
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.path}
                to={feature.path}
                className={cn(
                  'group relative p-6 rounded-2xl',
                  'bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]',
                  'transition-all duration-300',
                  'hover:-translate-y-1.5',
                  'hover:bg-white/[0.06] hover:border-white/[0.12]',
                  'hover:shadow-xl hover:shadow-purple-500/[0.08]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]',
                )}
              >
                {/* Hover glow effect */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none',
                    'bg-gradient-to-br from-cyan-500/[0.04] to-purple-500/[0.04]',
                  )}
                />

                <div className="relative z-10">
                  {/* Icon in gradient circle */}
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                      'bg-gradient-to-br',
                      feature.gradientFrom,
                      feature.gradientTo,
                      'shadow-lg group-hover:shadow-xl transition-shadow duration-300',
                    )}
                    style={{
                      boxShadow: `0 0 20px -4px var(--tw-shadow-color)`,
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white font-sora mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
