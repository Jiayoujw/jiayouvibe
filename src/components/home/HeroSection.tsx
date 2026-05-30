import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Rocket, Globe } from 'lucide-react'
import { cn } from '@/utils/cn'
import { SITE_NAME, SITE_DESCRIPTION } from '@/utils/constants'

const TYPING_WORDS = [
  '大语言模型',
  'AI智能体',
  '提示工程',
  '多模态AI',
  '开源模型',
  'RAG系统',
  '模型微调',
  'AI Agent',
]

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: 2 + Math.random() * 4,
  left: Math.random() * 100,
  delay: Math.random() * 12,
  duration: 8 + Math.random() * 10,
}))

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const currentWord = TYPING_WORDS[wordIndex] ?? ''

  // Typing effect
  useEffect(() => {
    const typingSpeed = isDeleting ? 40 : 80
    const pauseDuration = isDeleting && charIndex === 0 ? 600 : 0

    if (isDeleting && charIndex === 0) {
      const timeout = setTimeout(() => {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % TYPING_WORDS.length)
      }, pauseDuration)
      return () => clearTimeout(timeout)
    }

    if (!isDeleting && charIndex === currentWord.length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true)
      }, 1800)
      return () => clearTimeout(timeout)
    }

    const timeout = setTimeout(
      () => {
        setCharIndex((prev) => prev + (isDeleting ? -1 : 1))
      },
      isDeleting && charIndex === currentWord.length ? 200 : typingSpeed
    )

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, currentWord])

  // Parallax scroll effect
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const displayText = currentWord.slice(0, charIndex)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0f172a]">
      {/* Floating particles (CSS-only) */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none animate-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            bottom: '-10px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background:
              p.id % 3 === 0
                ? 'rgba(6, 182, 212, 0.6)'
                : p.id % 3 === 1
                  ? 'rgba(168, 85, 247, 0.5)'
                  : 'rgba(236, 72, 153, 0.5)',
            boxShadow:
              p.id % 3 === 0
                ? '0 0 6px rgba(6, 182, 212, 0.5)'
                : p.id % 3 === 1
                  ? '0 0 6px rgba(168, 85, 247, 0.5)'
                  : '0 0 6px rgba(236, 72, 153, 0.4)',
          } as React.CSSProperties}
        />
      ))}

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

      {/* Cyan glow blob - top left (parallax) */}
      <div
        className="absolute -top-72 -left-72 w-[600px] h-[600px] rounded-full bg-cyan-500/20 blur-[120px] pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 0.15}px) translateX(${scrollY * -0.05}px)`,
        }}
      />

      {/* Purple glow blob - bottom right (parallax) */}
      <div
        className="absolute -bottom-72 -right-72 w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none"
        style={{
          transform: `translateY(${scrollY * -0.12}px) translateX(${scrollY * 0.08}px)`,
        }}
      />

      {/* Cyan glow blob - top right (smaller, parallax) */}
      <div
        className="absolute top-1/3 -right-48 w-[400px] h-[400px] rounded-full bg-cyan-400/10 blur-[100px] pointer-events-none"
        style={{
          transform: `translateY(${scrollY * -0.18}px)`,
        }}
      />

      {/* Purple glow blob - bottom left (smaller, parallax) */}
      <div
        className="absolute bottom-1/4 -left-48 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 0.2}px)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Label badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/40 bg-cyan-400/5 mb-8 animate-slide-up">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,219,231,0.6)] animate-pulse" />
          <span className="text-xs sm:text-sm font-medium tracking-widest text-cyan-400 uppercase">
            AI KNOWLEDGE HUB
          </span>
        </div>

        {/* Main title */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-sora mb-6 leading-tight animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent">
            探索AI的无限可能
          </span>
        </h1>

        {/* Subtitle with typing effect */}
        <p
          className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          {SITE_DESCRIPTION}
        </p>

        {/* Animated typing text */}
        <div
          className="mb-10 h-10 flex items-center justify-center animate-slide-up"
          style={{ animationDelay: '300ms' }}
        >
          <span className="text-lg sm:text-xl text-cyan-300/80 font-medium">
            探索{' '}
            <span className="text-cyan-300 font-semibold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
              {displayText}
            </span>
            <span className="inline-block w-[2px] h-5 ml-0.5 bg-cyan-400 animate-pulse align-middle" />
          </span>
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up"
          style={{ animationDelay: '400ms' }}
        >
          <Link
            to="/models"
            className={cn(
              'group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-base',
              'bg-gradient-to-r from-cyan-400 to-purple-500 text-white',
              'shadow-[0_0_24px_rgba(6,182,212,0.3),_0_0_48px_rgba(139,92,246,0.2)]',
              'hover:shadow-[0_0_36px_rgba(6,182,212,0.5),_0_0_60px_rgba(139,92,246,0.35)]',
              'hover:from-cyan-300 hover:to-purple-400',
              'hover:scale-[1.04] active:scale-[0.97]',
              'transition-all duration-300',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
            )}
          >
            {/* Glow overlay on hover */}
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-white/0 to-purple-500/0 group-hover:from-cyan-400/10 group-hover:to-purple-500/10 transition-all duration-300" />
            <Rocket className="relative w-5 h-5 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300" />
            <span className="relative">开始探索</span>
          </Link>

          <Link
            to="/trending"
            className={cn(
              'group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-base',
              'bg-white/5 backdrop-blur-xl border border-white/10 text-slate-200',
              'hover:bg-white/10 hover:border-cyan-400/40',
              'hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
              'hover:scale-[1.04] active:scale-[0.97]',
              'transition-all duration-300',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
            )}
          >
            <Globe className="relative w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative">GitHub热门</span>
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
