import { Link } from 'react-router-dom'
import { Rocket, Globe } from 'lucide-react'
import { cn } from '@/utils/cn'
import { SITE_NAME, SITE_DESCRIPTION } from '@/utils/constants'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0f172a]">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 219, 231, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 219, 231, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Cyan glow blob - top left */}
      <div className="absolute -top-72 -left-72 w-[600px] h-[600px] rounded-full bg-cyan-500/20 blur-[120px] pointer-events-none" />

      {/* Purple glow blob - bottom right */}
      <div className="absolute -bottom-72 -right-72 w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      {/* Cyan glow blob - top right (smaller) */}
      <div className="absolute top-1/3 -right-48 w-[400px] h-[400px] rounded-full bg-cyan-400/10 blur-[100px] pointer-events-none" />

      {/* Purple glow blob - bottom left (smaller) */}
      <div className="absolute bottom-1/4 -left-48 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Label badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/40 bg-cyan-400/5 mb-8 animate-in fade-in duration-500">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,219,231,0.6)]" />
          <span className="text-xs sm:text-sm font-medium tracking-widest text-cyan-400 uppercase">
            AI KNOWLEDGE HUB
          </span>
        </div>

        {/* Main title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-sora mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent">
            探索AI的无限可能
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          {SITE_DESCRIPTION}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Link
            to="/models"
            className={cn(
              'inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-medium text-base',
              'bg-gradient-to-r from-cyan-400 to-purple-500 text-white',
              'shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40',
              'hover:from-cyan-300 hover:to-purple-400',
              'active:scale-[0.97] transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
            )}
          >
            <Rocket className="w-5 h-5" />
            开始探索
          </Link>

          <Link
            to="/trending"
            className={cn(
              'inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-medium text-base',
              'bg-white/5 backdrop-blur-xl border border-white/10 text-slate-200',
              'hover:bg-white/10 hover:border-white/20',
              'active:scale-[0.97] transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
            )}
          >
            <Globe className="w-5 h-5" />
            GitHub热门
          </Link>
        </div>

        {/* Bottom hint */}
        <p className="mt-16 text-xs text-slate-600 tracking-wide animate-pulse">
          {SITE_NAME} · 汇聚AI前沿知识与开源力量
        </p>
      </div>

      {/* Top fade overlay */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0f172a] to-transparent pointer-events-none" />
    </section>
  )
}
