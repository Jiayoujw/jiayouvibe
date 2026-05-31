import { useEffect, useRef, useCallback } from 'react'

/* ────────── Types ────────── */

interface GalaxyParticle {
  angle: number          // current orbit angle (radians)
  radius: number         // distance from galaxy center
  speed: number          // radians per frame (~0.0002 – 0.0014)
  size: number           // core radius in CSS px
  color: string          // hex: '#06b6d4' | '#a855f7' | '#ec4899'
  opacity: number        // 0-1 base opacity
  initialAngle: number   // seed angle (unused after init, kept for potential reset)
}

interface Star {
  x: number; y: number
  size: number
  opacity: number
}

/* ────────── Constants ────────── */

const COLORS: readonly string[] = ['#06b6d4', '#a855f7', '#ec4899']
const PARTICLE_COUNT = 240
const ARM_COUNT = 4
const STAR_COUNT = 80

/* ────────── Helpers ────────── */

/** Return a hex colour with appended alpha channel (00-ff).  e.g. (#06b6d4, 0.25) → #06b6d440 */
function hexWithAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
  return hex + a.toString(16).padStart(2, '0')
}

/* ────────── Component ────────── */

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mutable state so the rAF closure always sees the latest values without re-binding
  const particlesRef = useRef<GalaxyParticle[]>([])
  const starsRef = useRef<Star[]>([])
  const animFrameRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)
  const timeRef = useRef(0)
  const prefersReducedMotion = useRef(false)
  const dimsRef = useRef({ width: 0, height: 0 })

  /* ── Initialise particle & star arrays ── */
  const initScene = useCallback((width: number, height: number) => {
    const maxRadius = Math.min(width, height) * 0.6
    const particles: GalaxyParticle[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const arm = i % ARM_COUNT
      const baseAngle = (arm / ARM_COUNT) * Math.PI * 2

      // t: 0=center, 1=edge — bias toward centre with pow 1.6
      const t = 0.03 + Math.random() * 0.97
      const radius = maxRadius * Math.pow(t, 1.6)

      // Spiral: angle increases with radius so arms curve
      const spiralAngle = (radius / maxRadius) * Math.PI * 5
      const angle = baseAngle + spiralAngle + (Math.random() - 0.5) * 0.4

      const size = 0.6 + Math.random() * 2.6 * (1 - t * 0.45)
      const opacity = 0.25 + Math.random() * 0.7
      const speed = 0.00025 + 0.001 / (1 + t * 3)

      particles.push({
        angle,
        radius,
        speed,
        size,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity,
        initialAngle: angle,
      })
    }

    particlesRef.current = particles

    // Static background stars
    const stars: Star[] = []
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.2 + Math.random() * 0.7,
        opacity: 0.12 + Math.random() * 0.35,
      })
    }
    starsRef.current = stars
    dimsRef.current = { width, height }
  }, [])

  /* ── Animation loop ── */
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = dimsRef.current
    const particles = particlesRef.current
    const stars = starsRef.current

    if (particles.length === 0 || width === 0) {
      animFrameRef.current = requestAnimationFrame(animate)
      return
    }

    /* ── Derived state ── */
    const mouseX = mouseRef.current.x
    const mouseY = mouseRef.current.y
    const scrollY = scrollRef.current
    const elapsed = timeRef.current

    // Parallax: galaxy centre drifts upward as user scrolls down
    const parallaxY = scrollY * 0.12

    // Mouse influence: attenuate when cursor is far outside the canvas
    const dist = Math.sqrt(mouseX * mouseX + mouseY * mouseY)
    const diagonal = Math.sqrt(width * width + height * height)
    const mouseInfluence = Math.max(0, 1 - dist / diagonal)
    const effectiveMouseX = mouseX * mouseInfluence * 0.025
    const effectiveMouseY = mouseY * mouseInfluence * 0.025

    const centerX = width / 2 + effectiveMouseX
    const centerY = height / 2 - parallaxY + effectiveMouseY

    /* ── Clear ── */
    ctx.clearRect(0, 0, width, height)

    /* ── Central core glow (subtle pulse) ── */
    const corePulse = 1 + Math.sin(elapsed * 0.0005) * 0.12
    const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 0.28 * corePulse)
    coreGrad.addColorStop(0, 'rgba(6, 182, 212, 0.05)')
    coreGrad.addColorStop(0.3, 'rgba(168, 85, 247, 0.025)')
    coreGrad.addColorStop(0.6, 'rgba(236, 72, 153, 0.01)')
    coreGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = coreGrad
    ctx.fillRect(0, 0, width, height)

    /* ── Background stars ── */
    ctx.globalCompositeOperation = 'lighter'
    for (const star of stars) {
      ctx.beginPath()
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fill()
    }

    /* ── Orbit update ── */
    if (!prefersReducedMotion.current) {
      for (let i = 0; i < particles.length; i++) {
        particles[i].angle += particles[i].speed
      }
    }

    /* ── Draw galaxy particles ── */
    for (const p of particles) {
      // Elliptical flattening (y * 0.55) gives a 3D perspective disc
      const x = centerX + Math.cos(p.angle) * p.radius
      const y = centerY + Math.sin(p.angle) * p.radius * 0.55

      // Outer glow halo
      const haloRadius = p.size * 5
      const halo = ctx.createRadialGradient(x, y, 0, x, y, haloRadius)
      halo.addColorStop(0, hexWithAlpha(p.color, 0.22))
      halo.addColorStop(0.5, hexWithAlpha(p.color, 0.05))
      halo.addColorStop(1, 'transparent')

      ctx.beginPath()
      ctx.fillStyle = halo
      ctx.arc(x, y, haloRadius, 0, Math.PI * 2)
      ctx.fill()

      // Bright inner core
      const core = ctx.createRadialGradient(x, y, 0, x, y, p.size)
      core.addColorStop(0, 'rgba(255, 255, 255, 0.85)')
      core.addColorStop(0.25, p.color)
      core.addColorStop(0.6, hexWithAlpha(p.color, 0.35))
      core.addColorStop(1, 'transparent')

      ctx.beginPath()
      ctx.fillStyle = core
      ctx.arc(x, y, p.size, 0, Math.PI * 2)
      ctx.fill()
    }

    /* ── Restore blend mode ── */
    ctx.globalCompositeOperation = 'source-over'

    timeRef.current += 16.67 // approximate 60 fps dt
    animFrameRef.current = requestAnimationFrame(animate)
  }, [])

  /* ── Resize handler ── */
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return

    const rect = parent.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    initScene(rect.width, rect.height)
  }, [initScene])

  /* ── Global event handlers (via refs to avoid re-binding) ── */
  const onMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    }
  }, [])

  const onScroll = useCallback(() => {
    scrollRef.current = window.scrollY
  }, [])

  /* ── Mount / unmount ── */
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // Initial size
    handleResize()

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('scroll', onScroll, { passive: true })

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [animate, handleResize, onMouseMove, onScroll])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
