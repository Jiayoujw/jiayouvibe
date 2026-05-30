import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import { cn } from '@/utils/cn'
import { tutorials } from '@/data/tutorials'
import { TUTORIAL_CATEGORIES, TUTORIAL_DIFFICULTIES } from '@/utils/constants'

export default function LatestUpdates() {
  // Sort by date descending, take latest 3
  const latest = [...tutorials]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <section className="relative bg-[#0f172a] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-sora mb-3">
              最新动态
            </h2>
            <p className="text-slate-400 text-base">
              最新发布的AI开发教程与技术文章
            </p>
          </div>
          <Link
            to="/development"
            className={cn(
              'hidden sm:inline-flex items-center gap-2 text-sm font-medium text-cyan-400',
              'hover:text-cyan-300 transition-colors duration-200',
            )}
          >
            查看全部
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {latest.map((tutorial) => {
            const difficulty = TUTORIAL_DIFFICULTIES[tutorial.difficulty]
            const categoryLabel = TUTORIAL_CATEGORIES[tutorial.category] || tutorial.category

            return (
              <Link
                key={tutorial.slug}
                to={`/development/${tutorial.slug}`}
                className={cn(
                  'group relative p-6 rounded-2xl',
                  'bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]',
                  'transition-all duration-300',
                  'hover:-translate-y-1',
                  'hover:bg-white/[0.06] hover:border-white/[0.12]',
                  'hover:shadow-lg hover:shadow-purple-500/[0.06]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
                )}
              >
                {/* Top row: category + difficulty badges */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                    {categoryLabel}
                  </span>
                  <span
                    className={cn(
                      'text-xs px-2.5 py-1 rounded-full',
                      difficulty.color,
                    )}
                  >
                    {difficulty.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-white font-sora mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300">
                  {tutorial.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2 group-hover:text-slate-300 transition-colors duration-300">
                  {tutorial.description}
                </p>

                {/* Bottom meta */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{tutorial.date}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {tutorial.readingTime} 分钟
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Mobile view-all link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/development"
            className={cn(
              'inline-flex items-center gap-2 text-sm font-medium text-cyan-400',
              'hover:text-cyan-300 transition-colors duration-200',
            )}
          >
            查看全部教程
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
