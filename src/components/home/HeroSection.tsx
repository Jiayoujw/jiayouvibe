import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import HeroCanvas from './HeroCanvas'

const TYPING_PHRASES = ['大型语言模型', '自主智能体', 'RAG 架构', '开源AI趋势', '知识图谱应用']
const PARTICLE_COLORS = ['#22d3ee', '#c084fc', '#f472b6', '#818cf8', '#a78bfa']

export default function HeroSection() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useRef(false)

  const currentPhrase = TYPING_PHRASES[phraseIndex]

  // ── Typewriter ──
  useEffect(() => {
    const speed = isDeleting ? 40 : 80
    const pauseEnd = !isDeleting && charIndex === currentPhrase.length ? 2500 : 0
    const pauseStart = isDeleting && charIndex === 0 ? 400 : 0
    if (pauseEnd) { const t = setTimeout(() => setIsDeleting(true), pauseEnd); return () => clearTimeout(t) }
    if (pauseStart) {
      const t = setTimeout(() => { setIsDeleting(false); setPhraseIndex((p) => (p + 1) % TYPING_PHRASES.length) }, pauseStart)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setCharIndex((c) => c + (isDeleting ? -1 : 1)), speed)
    return () => clearTimeout(t)
  }, [charIndex, isDeleting, currentPhrase])

  // ── Mouse parallax ──
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (prefersReducedMotion.current || !sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left - rect.width / 2, y: e.clientY - rect.top - rect.height / 2 })
  }, [])

  // ── Dynamic particle system ──
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion.current || !particlesRef.current) return

    const container = particlesRef.current
    const count = 40
    const fragments: HTMLSpanElement[] = []

    for (let i = 0; i < count; i++) {
      const span = document.createElement('span')
      const size = Math.random() * 4 + 1
      span.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;width:${size}px;height:${size}px;left:${Math.random()*100}%;bottom:-10px;background:${PARTICLE_COLORS[Math.floor(Math.random()*PARTICLE_COLORS.length)]};box-shadow:0 0 ${size*3}px currentColor;animation:particle-drift ${6+Math.random()*10}s ease-in-out ${Math.random()*8}s infinite;opacity:0;`
      container.appendChild(span)
      fragments.push(span)
    }
    return () => fragments.forEach((s) => s.remove())
  }, [])

  const displayText = currentPhrase.slice(0, charIndex)

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[92vh] flex items-center justify-center bg-[var(--color-bg-primary)] overflow-hidden"
    >
      {/* 3D particle galaxy canvas */}
      <HeroCanvas />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-grid-pattern" />

      {/* Ambient orbs with mouse parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/15 blur-[120px] animate-pulse-slow"
          style={{ transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)` }}
        />
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-purple-500/15 blur-[150px] animate-pulse-slow"
          style={{ animationDelay: '2s', transform: `translate(${mousePos.x * -0.015}px, ${mousePos.y * -0.015}px)` }}
        />
        <div
          className="absolute top-[10%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-cyan-400/10 blur-[100px] animate-pulse-slow"
          style={{ animationDelay: '1s', transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * 0.01}px)` }}
        />
        <div
          className="absolute bottom-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-purple-400/8 blur-[120px] animate-pulse-slow"
          style={{ animationDelay: '3s', transform: `translate(${mousePos.x * -0.025}px, ${mousePos.y * -0.025}px)` }}
        />
      </div>

      {/* Dynamic JS particle container */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl mx-auto gap-6 sm:gap-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-dot-pulse" />
          <span className="text-xs sm:text-sm font-medium tracking-[0.12em] text-cyan-300/90 uppercase font-mono">
            AI KNOWLEDGE HUB
          </span>
          <span className="text-[10px] text-slate-600 tracking-[0.1em] hidden sm:inline">//</span>
          <span className="text-[10px] text-[var(--color-text-muted)] tracking-[0.1em] hidden sm:inline">
            POWERED BY GITHUB OPEN DATA
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-sora leading-tight">
          <span
            className="inline-block text-transparent bg-clip-text animate-shine"
            style={{
              backgroundImage: 'linear-gradient(90deg, #22d3ee 0%, #c084fc 40%, #f472b6 60%, #c084fc 80%, #22d3ee 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            探索AI的无限可能
          </span>
        </h1>

        {/* Typewriter */}
        <div className="text-base sm:text-lg text-[var(--color-text-primary)] min-h-[32px] flex items-center gap-1.5">
          <span className="text-[var(--color-text-secondary)]">聚焦</span>
          <span className="text-cyan-300 font-medium min-w-[10ch]">{displayText}</span>
          <span className="inline-block w-[2px] h-5 bg-cyan-400 animate-pulse align-middle" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <Link
            to="/models"
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-base text-white overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #7c3aed 100%)', boxShadow: '0 0 30px rgba(6,182,212,0.35), 0 0 60px rgba(124,58,237,0.2)' }}
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Sparkles className="relative w-5 h-5" />
            <span className="relative">开始探索</span>
            <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <a
            href="https://gh.jiayouvibe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-base text-[var(--color-text-primary)] bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300"
          >
            <svg className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
            <span>GitHub热门</span>
          </a>
        </div>

        {/* Bottom hint */}
        <p className="mt-8 text-xs text-slate-600 tracking-widest animate-pulse select-none">
          {SITE_NAME} · 汇聚AI前沿知识与开源力量
        </p>
      </div>

      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[var(--color-bg-primary)] to-transparent pointer-events-none" />
    </section>
  )
}
