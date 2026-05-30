import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'
import { SITE_NAME, SITE_DESCRIPTION } from '@/utils/constants'

// ── Typewriter phrases ───────────────────────────────────────────────

const TYPING_PHRASES = [
  '大语言模型前沿技术',
  'AI智能体自主协作',
  '提示工程最佳实践',
  '开源AI生态探索',
]

// ── Particles config (50 dots) ───────────────────────────────────────

const PARTICLES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  size: 2 + Math.random() * 3.5,
  left: Math.random() * 100,
  delay: Math.random() * 15,
  duration: 8 + Math.random() * 14,
  drift: (Math.random() - 0.5) * 60,
}))

// ── Component ────────────────────────────────────────────────────────

export default function HeroSection() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  const currentPhrase = TYPING_PHRASES[phraseIndex] ?? ''

  // ── Typewriter effect ──────────────────────────────────────────────

  useEffect(() => {
    const typingSpeed = isDeleting ? 35 : 70
    const pauseAtEnd = !isDeleting && charIndex === currentPhrase.length ? 2000 : 0
    const pauseAtStart = isDeleting && charIndex === 0 ? 500 : 0

    if (pauseAtEnd) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseAtEnd)
      return () => clearTimeout(timeout)
    }

    if (pauseAtStart) {
      const timeout = setTimeout(() => {
        setIsDeleting(false)
        setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length)
      }, pauseAtStart)
      return () => clearTimeout(timeout)
    }

    const timeout = setTimeout(() => {
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1))
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, currentPhrase])

  // ── Parallax scroll handler ────────────────────────────────────────

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Derived values ─────────────────────────────────────────────────

  const displayText = currentPhrase.slice(0, charIndex)
  const parallaxY = (offset: number) => scrollY * offset

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0f172a]"
    >
      {/* ── 50 CSS floating particles ────────────────────────────────── */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            bottom: '-10px',
            animationName: 'particle-rise',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
            background:
              p.id % 3 === 0
                ? 'rgba(6, 182, 212, 0.7)'
                : p.id % 3 === 1
                  ? 'rgba(168, 85, 247, 0.55)'
                  : 'rgba(236, 72, 153, 0.45)',
            boxShadow:
              p.id % 3 === 0
                ? '0 0 6px rgba(6, 182, 212, 0.5)'
                : p.id % 3 === 1
                  ? '0 0 6px rgba(168, 85, 247, 0.5)'
                  : '0 0 6px rgba(236, 72, 153, 0.35)',
            '--drift': `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* ── Grid pattern overlay with subtle drift ──────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 219, 231, 0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 219, 231, 0.35) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          animation: 'grid-drift 20s linear infinite',
        }}
      />

      {/* ── Cyan ambient orb — top left ──────────────────────────────── */}
      <div
        className="absolute -top-80 -left-80 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.22) 0%, rgba(6,182,212,0.06) 40%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'blob-float-cyan 10s ease-in-out infinite',
          transform: `translateY(${parallaxY(0.15)}px) translateX(${parallaxY(-0.05)}px)`,
        }}
      />

      {/* ── Purple ambient orb — bottom right ────────────────────────── */}
      <div
        className="absolute -bottom-80 -right-80 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.22) 0%, rgba(168,85,247,0.06) 40%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'blob-float-purple 11s ease-in-out infinite',
          transform: `translateY(${parallaxY(-0.12)}px) translateX(${parallaxY(0.08)}px)`,
        }}
      />

      {/* ── Secondary cyan orb — top right ───────────────────────────── */}
      <div
        className="absolute top-1/4 -right-56 w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'blob-float-cyan 14s ease-in-out infinite 3s',
          transform: `translateY(${parallaxY(-0.18)}px)`,
        }}
      />

      {/* ── Secondary purple orb — bottom left ───────────────────────── */}
      <div
        className="absolute bottom-1/4 -left-56 w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'blob-float-purple 13s ease-in-out infinite 5s',
          transform: `translateY(${parallaxY(0.2)}px)`,
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* ── Badge ──────────────────────────────────────────────────── */}
        <div
          className={cn(
            'inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8',
            'border border-cyan-400/30 bg-cyan-400/[0.06] backdrop-blur-md',
            'animate-pulse-glow',
          )}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-40" />
          </div>
          <span className="text-xs sm:text-sm font-medium tracking-[0.15em] text-cyan-300/90 uppercase">
            AI KNOWLEDGE HUB
          </span>
          <span className="text-[10px] text-slate-600 tracking-[0.12em] hidden sm:inline">
            //
          </span>
          <span className="text-[10px] text-slate-500 tracking-[0.12em] hidden sm:inline">
            POWERED BY GITHUB OPEN DATA
          </span>
        </div>

        {/* ── Main Title with shine animation ────────────────────────── */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-sora mb-6 leading-tight animate-slide-up select-none"
          style={{ animationDelay: '100ms' }}
        >
          <span
            className="inline-block text-transparent bg-clip-text"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #06b6d4 0%, #a855f7 30%, #ec4899 50%, #a855f7 70%, #06b6d4 100%)',
              backgroundSize: '200% auto',
              animation: 'shine 4s linear infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            探索AI的无限可能
          </span>
        </h1>

        {/* ── Description ────────────────────────────────────────────── */}
        <p
          className="text-sm sm:text-base md:text-lg text-slate-500 max-w-xl mb-6 leading-relaxed animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          {SITE_DESCRIPTION}
        </p>

        {/* ── Typewriter subtitle ────────────────────────────────────── */}
        <div
          className="mb-10 h-10 flex items-center justify-center animate-slide-up"
          style={{ animationDelay: '300ms' }}
        >
          <span className="text-lg sm:text-xl text-cyan-200/70 font-medium tracking-wide">
            {displayText}
            <span className="inline-block w-[2px] h-5 ml-0.5 bg-cyan-400 align-middle animate-pulse" />
          </span>
        </div>

        {/* ── CTA Buttons ────────────────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up"
          style={{ animationDelay: '400ms' }}
        >
          {/* Primary: 开始探索 */}
          <Link
            to="/models"
            className={cn(
              'group relative inline-flex items-center gap-2.5 px-9 py-4 rounded-xl font-semibold text-base',
              'bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-500 text-white',
              'shadow-[0_0_30px_rgba(6,182,212,0.35),_0_0_60px_rgba(139,92,246,0.2),_0_0_90px_rgba(6,182,212,0.1)]',
              'hover:shadow-[0_0_40px_rgba(6,182,212,0.55),_0_0_80px_rgba(139,92,246,0.35),_0_0_110px_rgba(6,182,212,0.2)]',
              'hover:scale-[1.05] active:scale-[0.97]',
              'transition-all duration-300',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
            )}
          >
            {/* Hover shimmer overlay */}
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 group-hover:via-white/15 transition-all duration-500" />
            <Sparkles className="relative w-5 h-5 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300" />
            <span className="relative">开始探索</span>
          </Link>

          {/* Secondary: GitHub热门 */}
          <Link
            to="/trending"
            className={cn(
              'group relative inline-flex items-center gap-2.5 px-9 py-4 rounded-xl font-semibold text-base',
              'bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] text-slate-200',
              'hover:bg-white/[0.08] hover:border-cyan-400/40',
              'hover:shadow-[0_0_30px_rgba(6,182,212,0.2),_0_0_50px_rgba(6,182,212,0.08)]',
              'hover:scale-[1.04] active:scale-[0.97]',
              'transition-all duration-300',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
            )}
          >
            {/* Hover inner glow */}
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-purple-400/0 to-cyan-400/0 group-hover:from-cyan-400/5 group-hover:via-purple-400/5 group-hover:to-cyan-400/5 transition-all duration-500" />
            <svg className="relative w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
            <span className="relative">GitHub热门</span>
          </Link>
        </div>

        {/* ── Bottom hint ────────────────────────────────────────────── */}
        <p className="mt-16 text-xs text-slate-600 tracking-widest animate-pulse select-none">
          {SITE_NAME} · 汇聚AI前沿知识与开源力量
        </p>
      </div>

      {/* ── Top fade overlay ─────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0f172a] to-transparent pointer-events-none" />
    </section>
  )
}
