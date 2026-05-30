import { type ReactNode } from 'react'
import {
  CheckCircle,
  X,
  Database,
  Cpu,
  DollarSign,
  Cloud,
  Building2,
  TrendingUp,
  TrendingDown,
  Target,
  Code2,
} from 'lucide-react'
import type { AIModel } from '@/types'
import { cn } from '@/utils/cn'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ComparisonTableProps {
  selectedModels: AIModel[]
}

// ---------------------------------------------------------------------------
// Parsing helpers for "best value" detection
// ---------------------------------------------------------------------------

/**
 * Parse a context-window string into a numeric token count.
 * Examples:
 *   "200万 tokens"      -> 2_000_000
 *   "10M tokens（Scout）/ 1M tokens（Maverick）" -> 10_000_000  (takes max)
 *   "128K tokens"       -> 128_000
 *   "200K tokens"       -> 200_000
 *   "不适用"            -> 0
 */
function parseContextTokens(raw: string | undefined): number {
  if (!raw) return 0
  let best = 0
  // Remove parenthetical annotations but keep numbers
  const cleaned = raw.replace(/[（(][^)）]*[)）]/g, ' ')
  // Match patterns like "200万", "10M", "128K", "200", etc.
  const re = /([\d,.]+)\s*(万|[KkMmBb])?/g
  let match: RegExpExecArray | null
  while ((match = re.exec(cleaned)) !== null) {
    let num = parseFloat(match[1].replace(/,/g, ''))
    const unit = match[2]
    if (!unit) continue // skip bare numbers in context strings
    if (unit === '万') num *= 10_000
    else if (unit === 'K' || unit === 'k') num *= 1_000
    else if (unit === 'M' || unit === 'm') num *= 1_000_000
    else if (unit === 'B' || unit === 'b') num *= 1_000_000_000
    if (num > best) best = num
  }
  return best
}

/**
 * Parse a parameter string into a single numeric value (in billions for comparison).
 * Examples:
 *   "671B（MoE，激活37B）"                      -> 671
 *   "Scout 109B(激活17B) / Maverick 402B(激活17B)" -> 402
 *   "39M-1.55B（多个版本：...）"                 -> 1.55
 *   "未公开（预计数万亿参数，MoE架构）"           -> 0  (undisclosed)
 *   "未公开"                                     -> 0
 */
function parseParamNumber(raw: string | undefined): number {
  if (!raw) return 0
  // If starts with "未公开" and contains no concrete numbers, return 0
  if (raw.startsWith('未公开')) {
    // Check if there are concrete numbers after "未公开"
    const afterUndisclosed = raw.replace(/^未公开/, '').trim()
    if (!afterUndisclosed || !/\d/.test(afterUndisclosed)) return 0
  }
  let best = 0
  // Remove parenthetical annotations
  const cleaned = raw.replace(/[（(][^)）]*[)）]/g, ' ')
  // Match number + optional unit (B/billion, M/million, K/thousand, 万)
  const re = /([\d,.]+)\s*([BbMmKk]|万)?/g
  let match: RegExpExecArray | null
  while ((match = re.exec(cleaned)) !== null) {
    let num = parseFloat(match[1].replace(/,/g, ''))
    const unit = match[2]
    if (!unit) continue // bare numbers aren't parameter counts
    if (unit === 'B' || unit === 'b') num = num // already in billions
    else if (unit === 'M' || unit === 'm') num /= 1_000
    else if (unit === 'K' || unit === 'k') num /= 1_000_000
    else if (unit === '万') num = (num * 10_000) / 1_000_000_000 // convert 万 to billions
    if (num > best) best = num
  }
  return best
}

/**
 * Parse pricing string to extract the input cost per 1M tokens.
 * Returns:
 *   - a positive number for token-priced models
 *   - 0 for free/open-source models
 *   - Infinity if pricing cannot be meaningfully compared (subscription, per-image, etc.)
 */
function parseInputPrice(raw: string | undefined): number {
  if (!raw) return Infinity
  const lower = raw.toLowerCase()
  // Free / open-source
  if (lower.includes('免费') || lower.includes('free')) return 0
  if (lower.includes('开源免费')) return 0
  // Look for $X.XX/1M pattern in token-priced models
  const tokenPriceMatch = raw.match(/输入\$?([\d,.]+)\s*\/\s*1M/)
  if (tokenPriceMatch) {
    return parseFloat(tokenPriceMatch[1].replace(/,/g, ''))
  }
  // If it's a subscription or per-image pricing, return Infinity (not comparable)
  return Infinity
}

// ---------------------------------------------------------------------------
// Row definitions
// ---------------------------------------------------------------------------

type RenderFn = (model: AIModel, isBest: boolean) => ReactNode

interface ComparisonRow {
  key: string
  label: string
  icon: React.FC<{ className?: string }>
  render: RenderFn
  /** Whether this row participates in "best value" highlighting */
  comparable: boolean
  /** Whether higher numeric value is better (false = lower is better) */
  higherIsBetter: boolean
  /** Extract a numeric or boolean value for comparison */
  extractForCompare?: (model: AIModel) => number | boolean
}

const ROWS: ComparisonRow[] = [
  {
    key: 'provider',
    label: '提供商',
    icon: Building2,
    comparable: false,
    higherIsBetter: true,
    render: (model) => (
      <span className="text-sm font-medium text-slate-200">{model.provider}</span>
    ),
  },
  {
    key: 'parameters',
    label: '参数量',
    icon: Database,
    comparable: true,
    higherIsBetter: true,
    extractForCompare: (model) => parseParamNumber(model.parameters),
    render: (model, isBest) => (
      <span className={cn('text-sm font-jetbrains', isBest ? 'text-cyan-300' : 'text-slate-300')}>
        {model.parameters || '未公开'}
      </span>
    ),
  },
  {
    key: 'contextWindow',
    label: '上下文窗口',
    icon: Cpu,
    comparable: true,
    higherIsBetter: true,
    extractForCompare: (model) => parseContextTokens(model.contextWindow),
    render: (model, isBest) => (
      <span className={cn('text-sm font-jetbrains', isBest ? 'text-cyan-300' : 'text-slate-300')}>
        {model.contextWindow || '不适用'}
      </span>
    ),
  },
  {
    key: 'pricing',
    label: '价格',
    icon: DollarSign,
    comparable: true,
    higherIsBetter: false, // cheaper is better
    extractForCompare: (model) => parseInputPrice(model.pricing),
    render: (model, isBest) => {
      const price = model.pricing || '未公开'
      return (
        <span className={cn('text-sm font-jetbrains leading-relaxed', isBest ? 'text-cyan-300' : 'text-slate-300')}>
          {price}
        </span>
      )
    },
  },
  {
    key: 'apiAvailable',
    label: 'API可用性',
    icon: Cloud,
    comparable: true,
    higherIsBetter: true,
    extractForCompare: (model) => model.apiAvailable,
    render: (model, isBest) => (
      <div className="flex items-center gap-2">
        {model.apiAvailable ? (
          <>
            <CheckCircle
              className={cn('h-4 w-4 shrink-0', isBest ? 'text-cyan-400' : 'text-emerald-400')}
            />
            <span className={cn('text-sm', isBest ? 'text-cyan-300' : 'text-slate-300')}>
              API 可用
            </span>
          </>
        ) : (
          <>
            <X className="h-4 w-4 shrink-0 text-slate-500" />
            <span className="text-sm text-slate-500">无公开 API</span>
          </>
        )}
      </div>
    ),
  },
  {
    key: 'openSource',
    label: '开源',
    icon: Code2,
    comparable: true,
    higherIsBetter: true,
    extractForCompare: (model) => model.openSource,
    render: (model, isBest) => (
      <div className="flex items-center gap-2">
        {model.openSource ? (
          <>
            <CheckCircle
              className={cn('h-4 w-4 shrink-0', isBest ? 'text-cyan-400' : 'text-emerald-400')}
            />
            <span className={cn('text-sm', isBest ? 'text-cyan-300' : 'text-slate-300')}>
              开源
            </span>
          </>
        ) : (
          <>
            <X className="h-4 w-4 shrink-0 text-slate-500" />
            <span className="text-sm text-slate-500">闭源</span>
          </>
        )}
      </div>
    ),
  },
  {
    key: 'strengths',
    label: '优势',
    icon: TrendingUp,
    comparable: false,
    higherIsBetter: true,
    render: (model) => (
      <ul className="space-y-1">
        {model.strengths.map((s, i) => (
          <li key={i} className="flex items-start gap-1.5 text-sm text-slate-300">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400/70" />
            <span className="leading-relaxed">{s}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    key: 'weaknesses',
    label: '劣势',
    icon: TrendingDown,
    comparable: false,
    higherIsBetter: true,
    render: (model) => (
      <ul className="space-y-1">
        {model.weaknesses.map((w, i) => (
          <li key={i} className="flex items-start gap-1.5 text-sm text-slate-300">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400/70" />
            <span className="leading-relaxed">{w}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    key: 'useCases',
    label: '适用场景',
    icon: Target,
    comparable: false,
    higherIsBetter: true,
    render: (model) => (
      <ul className="space-y-1">
        {model.useCases.map((uc, i) => (
          <li key={i} className="flex items-start gap-1.5 text-sm text-slate-300">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-400/70" />
            <span className="leading-relaxed">{uc}</span>
          </li>
        ))}
      </ul>
    ),
  },
]

// ---------------------------------------------------------------------------
// Best-value helpers
// ---------------------------------------------------------------------------

function getBestIndices(models: AIModel[], row: ComparisonRow): Set<number> {
  if (!row.comparable || !row.extractForCompare || models.length < 2) {
    return new Set()
  }
  const values = models.map((m) => row.extractForCompare!(m))

  // For booleans: all `true` values are "best"
  if (typeof values[0] === 'boolean') {
    const hasTrue = values.some((v) => v === true)
    const hasFalse = values.some((v) => v === false)
    if (hasTrue && hasFalse) {
      const indices = new Set<number>()
      values.forEach((v, i) => {
        if (v === true) indices.add(i)
      })
      return indices
    }
    return new Set() // all same, no highlight
  }

  // For numbers: find the best (max or min) and collect all indices that match
  const numericValues = values as number[]
  const finiteValues = numericValues.filter((v) => Number.isFinite(v) && v > 0)
  if (finiteValues.length < 2) return new Set() // not enough comparable data

  const best = row.higherIsBetter ? Math.max(...finiteValues) : Math.min(...finiteValues)
  const indices = new Set<number>()
  numericValues.forEach((v, i) => {
    if (v === best && Number.isFinite(v) && v > 0) indices.add(i)
  })
  // If all models share the best value, no highlighting needed
  if (indices.size === models.length) return new Set()
  return indices
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ComparisonTable({ selectedModels }: ComparisonTableProps) {
  if (selectedModels.length === 0) return null

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <table className="w-full min-w-[640px] border-collapse">
        {/* ---- Header ---- */}
        <thead>
          <tr>
            {/* Empty top-left corner */}
            <th className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-md border-b border-white/10 px-4 py-4 w-36 sm:w-44" />

            {selectedModels.map((model) => (
              <th
                key={model.slug}
                className={cn(
                  'sticky top-0 z-20 bg-slate-950/95 backdrop-blur-md border-b border-white/10 px-4 py-4',
                  'text-center min-w-[180px]',
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-base font-sora font-semibold text-white">
                    {model.name}
                  </span>
                  <span className="text-xs font-jetbrains text-slate-500">{model.provider}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* ---- Body ---- */}
        <tbody>
          {ROWS.map((row, rowIdx) => {
            const bestIndices = getBestIndices(selectedModels, row)

            return (
              <tr
                key={row.key}
                className={cn(rowIdx % 2 === 0 && 'bg-white/[0.015]')}
              >
                {/* Feature label cell */}
                <td className="px-4 py-3 border-b border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <row.icon className="h-4 w-4 text-slate-500 shrink-0" />
                    <span className="text-sm font-medium text-slate-400 font-sora whitespace-nowrap">
                      {row.label}
                    </span>
                  </div>
                </td>

                {/* Model value cells */}
                {selectedModels.map((model, modelIdx) => {
                  const isBest = bestIndices.has(modelIdx)

                  return (
                    <td
                      key={model.slug}
                      className={cn(
                        'px-4 py-3 border-b border-white/[0.04]',
                        'align-top',
                      )}
                    >
                      <div
                        className={cn(
                          'rounded-xl p-3 h-full',
                          'bg-white/[0.03] backdrop-blur-sm border',
                          isBest
                            ? 'border-cyan-400/30 bg-cyan-400/[0.06] shadow-[0_0_12px_rgba(6,182,212,0.08)]'
                            : 'border-white/[0.05]',
                        )}
                      >
                        {row.render(model, isBest)}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
