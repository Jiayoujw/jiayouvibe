import { useState, useEffect, useMemo } from 'react'
import {
  Cpu,
  Brain,
  Code2,
  Sparkles,
  DollarSign,
  Zap,
  Image,
  Trophy,
  AlertTriangle,
  Receipt,
  Search,
  Plus,
} from 'lucide-react'
import { models } from '@/data/models'
import { SITE_NAME } from '@/utils/constants'
import type { AIModel } from '@/types'
import { cn } from '@/utils/cn'
import ShareButtons from '@/components/community/ShareButtons'

// ─── Types ───────────────────────────────────────────────────────────

type DimensionKey = '推理能力' | '代码能力' | '创造力' | '性价比' | '速度' | '多模态'

interface DimensionDef {
  key: DimensionKey
  label: string
  icon: React.FC<{ className?: string }>
}

// ─── Dimension definitions ──────────────────────────────────────────

const DIMENSIONS: DimensionDef[] = [
  { key: '推理能力', label: '推理能力', icon: Brain },
  { key: '代码能力', label: '代码能力', icon: Code2 },
  { key: '创造力', label: '创造力', icon: Sparkles },
  { key: '性价比', label: '性价比', icon: DollarSign },
  { key: '速度', label: '速度', icon: Zap },
  { key: '多模态', label: '多模态', icon: Image },
]

// ─── Keyword maps for text-based scoring ────────────────────────────

const DIMENSION_KEYWORDS: Record<string, string[]> = {
  推理能力: ['推理', '逻辑', '数学', '分析', '问题解决', '深度思考', '复杂', '科学', '思维链', 'reasoning'],
  代码能力: ['编程', '代码', '编码', '开发', '算法', '程序', '软件', 'coding', 'code'],
  创造力: ['创意', '创作', '艺术', '设计', '写作', '内容创作', '生成', '风格'],
  速度: ['快速', '低延迟', '实时', '速度', '轻量', '高效', '瞬时', '极低延迟', '响应速度'],
  多模态: ['多模态', '图像', '视频', '音频', '视觉', '语音', '图片', '声音', 'multimodal'],
}

// ─── Scoring functions ──────────────────────────────────────────────

/** Score a model on the "value for money" dimension based on pricing. */
function computeValueScore(model: AIModel): number {
  const pricing = (model.pricing ?? '').toLowerCase()

  // Free / open-source models
  if (pricing.includes('免费') || pricing.includes('开源免费')) return 95
  if (pricing.includes('完全免费')) return 98

  // Extract input token price ($X.XX / 1M pattern)
  const tokenMatch = pricing.match(/输入\$?([\d,.]+)\s*\/\s*1M/)
  if (tokenMatch) {
    const price = parseFloat(tokenMatch[1].replace(/,/g, ''))
    if (price <= 0.3) return 92
    if (price <= 0.8) return 82
    if (price <= 1.5) return 72
    if (price <= 3) return 60
    if (price <= 8) return 45
    if (price <= 15) return 30
    return 18
  }

  // Per-image pricing
  if (pricing.includes('$') && pricing.includes('张')) {
    const perImgMatch = pricing.match(/\$([\d,.]+)\s*\/\s*张/)
    if (perImgMatch) {
      const price = parseFloat(perImgMatch[1].replace(/,/g, ''))
      if (price <= 0.05) return 75
      if (price <= 0.1) return 60
      return 40
    }
  }

  // Subscription models (rough heuristic)
  if (pricing.includes('$') && pricing.includes('月')) {
    const subMatch = pricing.match(/\$(\d+)\s*\/\s*月/)
    if (subMatch) {
      const price = parseInt(subMatch[1], 10)
      if (price <= 10) return 70
      if (price <= 30) return 50
      return 35
    }
  }

  // Has a dollar sign but no clear pattern
  if (pricing.includes('$')) return 40

  return 50
}

/** Score a model on a text-based dimension by keyword presence. */
function computeTextDimensionScore(model: AIModel, dimension: string): number {
  const keywords = DIMENSION_KEYWORDS[dimension] ?? []
  let score = 18 // base score

  // ── Strengths (most weight) ──
  const strengthsText = model.strengths.join(' ').toLowerCase()
  for (const kw of keywords) {
    if (strengthsText.includes(kw.toLowerCase())) score += 13
  }

  // ── Tags (medium weight) ──
  const tagsText = model.tags.join(' ').toLowerCase()
  for (const kw of keywords) {
    if (tagsText.includes(kw.toLowerCase())) score += 8
  }

  // ── Category bonuses ──
  if (dimension === '多模态') {
    if (model.category === 'multimodal') score += 22
    else if (model.category === 'image' || model.category === 'video' || model.category === 'audio') score += 30
  }
  if (dimension === '创造力') {
    if (model.category === 'image' || model.category === 'video') score += 20
  }
  if (dimension === '代码能力') {
    if (model.category === 'code') score += 20
  }
  if (dimension === '推理能力') {
    if (model.category === 'llm' || model.category === 'multimodal') score += 10
  }

  // ── Description (light weight) ──
  const desc = ((model.description ?? '') + ' ' + (model.longDescription ?? '')).toLowerCase()
  for (const kw of keywords) {
    if (desc.includes(kw.toLowerCase())) score += 4
  }

  return Math.min(score, 100)
}

/** Get all 6 radar scores for a model. */
function getRadarScores(model: AIModel): Record<string, number> {
  const scores: Record<string, number> = {}
  for (const dim of DIMENSIONS) {
    if (dim.key === '性价比') {
      scores[dim.key] = computeValueScore(model)
    } else {
      scores[dim.key] = computeTextDimensionScore(model, dim.key)
    }
  }
  return scores
}

// ─── SVG helpers ────────────────────────────────────────────────────

/** Return the 6 points of a hexagon at a given radius as a "x,y x,y …" string. */
function hexagonPoints(cx: number, cy: number, r: number): string {
  const N = 6
  return Array.from({ length: N }, (_, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / N
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    return `${x},${y}`
  }).join(' ')
}

/** Return polygon path string for a set of dimension scores (0-100 each). */
function dataPolygonPoints(
  cx: number,
  cy: number,
  maxR: number,
  scores: Record<string, number>,
  dims: DimensionDef[],
): string {
  return dims
    .map((dim, i) => {
      const score = scores[dim.key] ?? 0
      const r = (score / 100) * maxR
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / dims.length
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)
      return `${x},${y}`
    })
    .join(' ')
}

/** Get a single point for an axis label position (just past maxR). */
function labelPoint(cx: number, cy: number, r: number, index: number, total: number) {
  const angle = -Math.PI / 2 + (2 * Math.PI * index) / total
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
    angle,
  }
}

// ─── Radar Chart ────────────────────────────────────────────────────

function RadarChart({ model1, model2 }: { model1: AIModel; model2: AIModel }) {
  const cx = 200
  const cy = 210
  const maxR = 148
  const labelR = maxR + 32

  const scores1 = useMemo(() => getRadarScores(model1), [model1])
  const scores2 = useMemo(() => getRadarScores(model2), [model2])

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0]
  const poly1Points = dataPolygonPoints(cx, cy, maxR, scores1, DIMENSIONS)
  const poly2Points = dataPolygonPoints(cx, cy, maxR, scores2, DIMENSIONS)

  return (
    <div className="relative w-full max-w-[460px] mx-auto">
      <svg viewBox="0 0 400 440" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        {/* ── Definitions ── */}
        <defs>
          <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="area-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="area-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        <style>
          {`
            @keyframes drawPoly {
              to { stroke-dashoffset: 0; }
            }
            @keyframes fadeIn {
              to { opacity: 1; }
            }
            .poly-cyan {
              stroke-dasharray: 2000;
              stroke-dashoffset: 2000;
              animation: drawPoly 1.2s ease-out 0.1s forwards;
            }
            .poly-purple {
              stroke-dasharray: 2000;
              stroke-dashoffset: 2000;
              animation: drawPoly 1.2s ease-out 0.45s forwards;
            }
            .dot-fade {
              opacity: 0;
              animation: fadeIn 0.4s ease-out 1.2s forwards;
            }
          `}
        </style>

        {/* ── Hexagon grid ── */}
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={hexagonPoints(cx, cy, maxR * level)}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        {/* ── Axis lines ── */}
        {DIMENSIONS.map((_, i) => {
          const pt = labelPoint(cx, cy, maxR, i, 6)
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + maxR * Math.cos(pt.angle)}
              y2={cy + maxR * Math.sin(pt.angle)}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
          )
        })}

        {/* ── Data areas (filled polygons) ── */}
        <polygon points={poly2Points} fill="url(#area-purple)" stroke="none" />
        <polygon points={poly1Points} fill="url(#area-cyan)" stroke="none" />

        {/* ── Data strokes (animated) ── */}
        <polygon
          points={poly1Points}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2"
          strokeLinejoin="round"
          filter="url(#glow-cyan)"
          className="poly-cyan"
        />
        <polygon
          points={poly2Points}
          fill="none"
          stroke="#a855f7"
          strokeWidth="2"
          strokeLinejoin="round"
          filter="url(#glow-purple)"
          className="poly-purple"
        />

        {/* ── Vertex dots ── */}
        {DIMENSIONS.map((dim, i) => {
          const score1 = scores1[dim.key] ?? 0
          const score2 = scores2[dim.key] ?? 0
          const angle1 = -Math.PI / 2 + (2 * Math.PI * i) / 6
          const r1 = (score1 / 100) * maxR
          const x1 = cx + r1 * Math.cos(angle1)
          const y1 = cy + r1 * Math.sin(angle1)
          const r2 = (score2 / 100) * maxR
          const x2 = cx + r2 * Math.cos(angle1)
          const y2 = cy + r2 * Math.sin(angle1)
          return (
            <g key={dim.key}>
              <circle cx={x1} cy={y1} r="4" fill="#22d3ee" filter="url(#glow-cyan)" className="dot-fade" />
              <circle cx={x2} cy={y2} r="4" fill="#a855f7" filter="url(#glow-purple)" className="dot-fade" />
            </g>
          )
        })}

        {/* ── Axis labels ── */}
        {DIMENSIONS.map((dim, i) => {
          const pt = labelPoint(cx, cy, labelR, i, 6)
          // Adjust text-anchor based on horizontal position
          let anchor = 'middle'
          if (pt.x < cx - 30) anchor = 'end'
          else if (pt.x > cx + 30) anchor = 'start'
          const dy = pt.y < cy - 20 ? '-0.3em' : pt.y > cy + 20 ? '1.2em' : '0.35em'
          return (
            <text
              key={dim.key}
              x={pt.x}
              y={pt.y}
              dy={dy}
              textAnchor={anchor as 'start' | 'middle' | 'end'}
              className="fill-slate-400 text-[11px] font-jetbrains"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {dim.label}
            </text>
          )
        })}

        {/* ── Center dot ── */}
        <circle cx={cx} cy={cy} r="3" fill="rgba(255,255,255,0.15)" />
      </svg>
    </div>
  )
}

// ─── Stat Cards (right panel) ───────────────────────────────────────

function StatCards({ models }: { models: AIModel[] }) {
  if (models.length < 2) return null

  // Compute scores for each model
  const modelScores = useMemo(
    () => models.map((m) => ({ model: m, scores: getRadarScores(m) })),
    [models],
  )

  // For each dimension, rank the models
  const rankings = useMemo(() => {
    return DIMENSIONS.map((dim) => {
      const ranked = modelScores
        .map((ms) => ({ model: ms.model, score: ms.scores[dim.key] }))
        .sort((a, b) => b.score - a.score)
      return { dim, ranked }
    })
  }, [modelScores])

  return (
    <div className="grid grid-cols-2 gap-3 content-start">
      {rankings.map(({ dim, ranked }) => {
        const Icon = dim.icon
        const top2 = ranked.slice(0, 2)

        return (
          <div
            key={dim.key}
            className={cn(
              'rounded-xl p-3',
              'bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]',
              'transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05]',
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <Icon className="h-3.5 w-3.5 text-[var(--color-text-secondary)] shrink-0" />
              <span className="text-xs font-sora font-medium text-[var(--color-text-primary)]">{dim.label}</span>
            </div>

            {/* Rankings */}
            <div className="space-y-1.5">
              {top2.map((entry, idx) => {
                const isFirst = idx === 0
                const barColor = isFirst ? 'bg-cyan-400/70' : 'bg-purple-400/50'
                const textColor = isFirst ? 'text-cyan-300' : 'text-purple-300'
                const rankBadge = isFirst
                  ? 'bg-cyan-400/20 text-cyan-400'
                  : 'bg-purple-400/15 text-purple-400'

                return (
                  <div key={entry.model.slug} className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 min-w-0">
                        <span
                          className={cn(
                            'shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold font-jetbrains',
                            rankBadge,
                          )}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-[11px] text-[var(--color-text-secondary)] truncate font-jetbrains">
                          {entry.model.name}
                        </span>
                      </div>
                      <span className={cn('text-[11px] font-bold font-jetbrains ml-1', textColor)}>
                        {entry.score}
                      </span>
                    </div>
                    {/* Mini progress bar */}
                    <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-700', barColor)}
                        style={{ width: `${entry.score}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Accordion Sections ─────────────────────────────────────────────

function AccordionSections({ models }: { models: AIModel[] }) {
  if (models.length === 0) return null

  return (
    <div className="space-y-3">
      {/* ── 核心优势 ── */}
      <details
        className={cn(
          'group rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm',
          'transition-all duration-300 open:border-cyan-400/20 open:bg-white/[0.04]',
        )}
      >
        <summary
          className={cn(
            'flex items-center gap-3 px-5 py-4 cursor-pointer select-none',
            'list-none [&::-webkit-details-marker]:hidden',
            'hover:bg-white/[0.03] transition-colors rounded-xl',
          )}
        >
          <Trophy className="h-5 w-5 text-amber-400 shrink-0" />
          <span className="text-base font-sora font-semibold text-[var(--color-text-primary)] flex-1">核心优势</span>
          <svg
            className="h-4 w-4 text-[var(--color-text-muted)] shrink-0 transition-transform duration-300 group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>

        <div className="px-5 pb-5 pt-1 space-y-5">
          {models.map((model) => (
            <div key={model.slug}>
              <h4 className="text-sm font-sora font-semibold text-cyan-300 mb-2.5">{model.name}</h4>
              <ul className="space-y-1.5">
                {model.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-primary)]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/70" />
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>

      {/* ── 局限性 ── */}
      <details
        className={cn(
          'group rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm',
          'transition-all duration-300 open:border-amber-400/20 open:bg-white/[0.04]',
        )}
      >
        <summary
          className={cn(
            'flex items-center gap-3 px-5 py-4 cursor-pointer select-none',
            'list-none [&::-webkit-details-marker]:hidden',
            'hover:bg-white/[0.03] transition-colors rounded-xl',
          )}
        >
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
          <span className="text-base font-sora font-semibold text-[var(--color-text-primary)] flex-1">局限性</span>
          <svg
            className="h-4 w-4 text-[var(--color-text-muted)] shrink-0 transition-transform duration-300 group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>

        <div className="px-5 pb-5 pt-1 space-y-5">
          {models.map((model) => (
            <div key={model.slug}>
              <h4 className="text-sm font-sora font-semibold text-amber-300 mb-2.5">{model.name}</h4>
              <ul className="space-y-1.5">
                {model.weaknesses.map((w, i) => (
                  <li
                    key={i}
                    className={cn(
                      'flex items-start gap-2 text-sm',
                      'px-3 py-1.5 rounded-lg',
                      'bg-amber-400/[0.05] border border-amber-400/10',
                      'text-amber-100/80',
                    )}
                  >
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400/60" />
                    <span className="leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>

      {/* ── 定价 ── */}
      <details
        className={cn(
          'group rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm',
          'transition-all duration-300 open:border-purple-400/20 open:bg-white/[0.04]',
        )}
      >
        <summary
          className={cn(
            'flex items-center gap-3 px-5 py-4 cursor-pointer select-none',
            'list-none [&::-webkit-details-marker]:hidden',
            'hover:bg-white/[0.03] transition-colors rounded-xl',
          )}
        >
          <Receipt className="h-5 w-5 text-purple-400 shrink-0" />
          <span className="text-base font-sora font-semibold text-[var(--color-text-primary)] flex-1">定价</span>
          <svg
            className="h-4 w-4 text-[var(--color-text-muted)] shrink-0 transition-transform duration-300 group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>

        <div className="px-5 pb-5 pt-1 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-2.5 pr-3 text-xs font-sora font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  模型
                </th>
                <th className="text-left py-2.5 pr-3 text-xs font-sora font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  提供商
                </th>
                <th className="text-left py-2.5 pr-3 text-xs font-sora font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  定价
                </th>
                <th className="text-center py-2.5 pr-3 text-xs font-sora font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  API
                </th>
                <th className="text-center py-2.5 text-xs font-sora font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  开源
                </th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr
                  key={model.slug}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 pr-3">
                    <span className="font-sora font-semibold text-[var(--color-text-primary)] text-sm">{model.name}</span>
                  </td>
                  <td className="py-3 pr-3">
                    <span className="text-[var(--color-text-secondary)] font-jetbrains text-xs">{model.provider}</span>
                  </td>
                  <td className="py-3 pr-3">
                    <span className="text-[var(--color-text-primary)] font-jetbrains text-xs leading-relaxed">
                      {model.pricing || '未公开'}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-center">
                    {model.apiAvailable ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-jetbrains">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        可用
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--color-text-muted)] font-jetbrains">不可用</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {model.openSource ? (
                      <span className="inline-flex items-center gap-1 text-xs text-purple-400 font-jetbrains">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                        开源
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--color-text-muted)] font-jetbrains">闭源</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

// ─── Main Page Component ────────────────────────────────────────────

export default function ComparisonPage() {
  useEffect(() => {
    document.title = `模型对比 | ${SITE_NAME}`
  }, [])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://jiayouvibe.com/#/compare'

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([])
  const [chipSearch, setChipSearch] = useState('')

  // Look up selected AIModel objects
  const selectedModels: AIModel[] = useMemo(() => {
    return selectedSlugs.map((slug) => models.find((m) => m.slug === slug)!).filter(Boolean)
  }, [selectedSlugs])

  // Filter chips by search
  const filteredModels = useMemo(() => {
    if (!chipSearch.trim()) return models
    const q = chipSearch.toLowerCase()
    return models.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [chipSearch])

  const atMaxSelections = selectedSlugs.length >= 4

  // Toggle a model's selection (max 4)
  const toggleModel = (slug: string) => {
    setSelectedSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug)
      if (prev.length >= 4) return prev
      return [...prev, slug]
    })
  }

  // Models to show in the radar chart (first 2 selected)
  const radarModels = useMemo(() => selectedModels.slice(0, 2), [selectedModels])

  return (
    <div className="space-y-8">
      {/* ═══════════════════════════════════════════════════════════
          Page Header
          ═══════════════════════════════════════════════════════════ */}
      <div>
        <h1 className="text-4xl font-sora font-bold bg-gradient-to-r from-cyan-300 via-purple-400 to-cyan-200 bg-clip-text text-transparent mb-2">
          AI模型对比
        </h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl text-sm leading-relaxed">
          选择最多4个AI模型，通过雷达图、排行榜和详细对比，全面评估推理、代码、创造力、性价比、速度和多模态能力。
        </p>

        <div className="mt-5 pt-5 border-t border-white/10">
          <ShareButtons
            url={shareUrl}
            title="AI模型对比"
            description="选择最多4个AI模型，通过雷达图、排行榜和详细对比，全面评估推理、代码、创造力、性价比、速度和多模态能力。"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          Model Selector Chips
          ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl p-5 space-y-4">
        {/* Header row with search */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-[var(--color-text-muted)] font-jetbrains uppercase tracking-wider">
            选择模型{' '}
            <span className="text-cyan-400 font-bold">{selectedSlugs.length}</span>
            <span className="text-[var(--color-text-muted)]">/4</span>
          </p>
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              type="text"
              placeholder="搜索模型..."
              value={chipSearch}
              onChange={(e) => setChipSearch(e.target.value)}
              className={cn(
                'w-full pl-8 pr-3 py-1.5 text-xs rounded-lg',
                'bg-white/[0.04] border border-white/[0.08]',
                'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
                'focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20',
                'font-jetbrains transition-colors',
              )}
            />
          </div>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-2">
          {filteredModels.map((model) => {
            const isSelected = selectedSlugs.includes(model.slug)
            const disabled = !isSelected && atMaxSelections

            return (
              <button
                key={model.slug}
                onClick={() => toggleModel(model.slug)}
                disabled={disabled}
                aria-pressed={isSelected}
                className={cn(
                  'inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-jetbrains font-medium tracking-wide transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
                  isSelected
                    ? 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/50 shadow-[0_0_14px_rgba(6,182,212,0.25)]'
                    : disabled
                      ? 'bg-white/[0.02] text-[var(--color-text-muted)] border border-white/[0.04] cursor-not-allowed'
                      : 'bg-white/[0.04] text-[var(--color-text-secondary)] border border-white/[0.08] hover:bg-white/[0.08] hover:text-[var(--color-text-primary)] hover:border-white/20',
                )}
              >
                {/* Colored dot */}
                <span
                  className={cn(
                    'h-2 w-2 rounded-full shrink-0 transition-colors duration-200',
                    isSelected
                      ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]'
                      : 'bg-purple-400/70',
                  )}
                />
                {model.name}
              </button>
            )
          })}
          {filteredModels.length === 0 && (
            <p className="text-xs text-[var(--color-text-muted)] py-2 font-jetbrains">无匹配模型</p>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          Main Content: Radar + Stats / Empty State
          ═══════════════════════════════════════════════════════════ */}
      {selectedModels.length >= 2 ? (
        <>
          {/* Split layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Radar Chart */}
            <div className="lg:col-span-3">
              <div className="rounded-xl border border-white/[0.08] bg-[var(--color-bg-primary)]/50 backdrop-blur-xl p-4 sm:p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    <span className="text-xs font-jetbrains text-cyan-300">{radarModels[0].name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    <span className="text-xs font-jetbrains text-purple-300">{radarModels[1].name}</span>
                  </div>
                  {selectedModels.length > 2 && (
                    <span className="text-[10px] text-[var(--color-text-muted)] font-jetbrains ml-auto">
                      雷达图仅展示前2个模型
                    </span>
                  )}
                </div>
                <RadarChart model1={radarModels[0]} model2={radarModels[1]} />
              </div>
            </div>

            {/* Right: Stat Cards */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-white/[0.08] bg-[var(--color-bg-primary)]/50 backdrop-blur-xl p-4 sm:p-5 h-full">
                <p className="text-xs text-[var(--color-text-muted)] font-jetbrains uppercase tracking-wider mb-4">
                  各维度排行榜
                </p>
                <StatCards models={selectedModels} />
              </div>
            </div>
          </div>

          {/* Accordion Sections */}
          <AccordionSections models={selectedModels} />
        </>
      ) : selectedModels.length === 1 ? (
        /* One model selected prompt */
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="mb-5">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
              <Plus className="h-8 w-8 text-cyan-400/60" />
            </div>
          </div>
          <h3 className="text-xl font-sora font-semibold text-[var(--color-text-primary)] mb-2">
            再选一个模型开始对比
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] max-w-md">
            你已选择了 <span className="text-cyan-400 font-jetbrains">{selectedModels[0].name}</span>
            ，请再选择至少一个模型以查看雷达图和详细对比
          </p>
        </div>
      ) : (
        /* Zero models selected */
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="mb-5">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
              <Cpu className="h-8 w-8 text-[var(--color-text-muted)]" />
            </div>
          </div>
          <h3 className="text-xl font-sora font-semibold text-[var(--color-text-primary)] mb-2">
            请选择要对比的AI模型
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] max-w-md">
            在上方点击模型标签，选择最多4个AI模型，即可查看雷达图、排行榜和深度对比
          </p>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          Max selection indicator
          ═══════════════════════════════════════════════════════════ */}
      {atMaxSelections && (
        <div className="flex justify-center">
          <p
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-sora font-medium',
              'bg-white/[0.02] border border-white/[0.04] text-[var(--color-text-muted)]',
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/50" />
            已选满4个模型，取消选择后可更换
          </p>
        </div>
      )}
    </div>
  )
}
