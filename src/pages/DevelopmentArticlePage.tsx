import { useMemo, useEffect, type JSX } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, User, BookOpen } from 'lucide-react'
import { cn } from '@/utils/cn'
import { tutorials } from '@/data/tutorials'
import { TUTORIAL_CATEGORIES, TUTORIAL_DIFFICULTIES, SITE_NAME } from '@/utils/constants'
import { formatReadingTime } from '@/utils/formatDate'
import Breadcrumb from '@/components/ui/Breadcrumb'
import ReadingProgress from '@/components/ui/ReadingProgress'
import ShareButtons from '@/components/community/ShareButtons'
import CommentSection from '@/components/community/CommentSection'
import SubscribeCard from '@/components/community/SubscribeCard'
import AdBanner from '@/components/ads/AdBanner'

// ---- content parser -------------------------------------------------------

type ContentBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'h4'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }

function parseContent(raw: string): ContentBlock[] {
  const blocks: ContentBlock[] = []

  // Pull out fenced code blocks first
  const fenceRegex = /```(\w*)\n([\s\S]*?)```/g
  const placeholders: { placeholder: string; lang: string; code: string }[] = []
  const processed = raw.replace(fenceRegex, (_, lang, code) => {
    const placeholder = `__CODEBLOCK_${placeholders.length}__`
    placeholders.push({ placeholder, lang: lang || '', code: code.trimEnd() })
    return `\n\n${placeholder}\n\n`
  })

  // Split into top-level blocks
  const sections = processed.split(/\n\n+/).filter((s) => s.trim())

  for (const section of sections) {
    const trimmed = section.trim()
    if (!trimmed) continue

    // Check for code block placeholder
    const ph = placeholders.find((p) => trimmed === p.placeholder)
    if (ph) {
      blocks.push({ type: 'code', language: ph.lang, code: ph.code })
      continue
    }

    const lines = trimmed.split('\n')

    // Heading
    if (lines.length === 1) {
      if (trimmed.startsWith('### ')) {
        blocks.push({ type: 'h3', text: trimmed.slice(4).trim() })
        continue
      }
      if (trimmed.startsWith('## ')) {
        blocks.push({ type: 'h2', text: trimmed.slice(3).trim() })
        continue
      }
      if (trimmed.startsWith('#### ')) {
        blocks.push({ type: 'h4', text: trimmed.slice(5).trim() })
        continue
      }
    }

    // Unordered list (every line starts with "- " or "* ")
    if (lines.every((l) => /^[-*]\s/.test(l.trim()))) {
      const items = lines.map((l) => l.trim().replace(/^[-*]\s+/, ''))
      blocks.push({ type: 'ul', items })
      continue
    }

    // Ordered list (every line starts with "N. ")
    if (lines.every((l) => /^\d+\.\s/.test(l.trim()))) {
      const items = lines.map((l) => l.trim().replace(/^\d+\.\s+/, ''))
      blocks.push({ type: 'ol', items })
      continue
    }

    // Table (lines contain | as separator)
    if (lines.length >= 2 && lines.every((l) => l.includes('|'))) {
      const parseRow = (row: string) =>
        row
          .split('|')
          .map((c) => c.trim())
          .filter((c) => c && !/^-{2,}$/.test(c)) // drop separator row cells like ---
      const headers = parseRow(lines[0])
      const rows = lines.slice(1).map(parseRow).filter((r) => r.length > 0)
      if (headers.length > 0) {
        blocks.push({ type: 'table', headers, rows })
        continue
      }
    }

    // Default: paragraph
    blocks.push({ type: 'paragraph', text: trimmed.replace(/\n/g, ' ') })
  }

  return blocks
}

/** Inline formatting: bold, italic, inline code */
function renderInline(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = []

  // Bold **text**
  let working = text
  let key = 0

  // Process inline code first
  const segments: { text: string; isCode: boolean }[] = []
  const codeSplit = working.split(/(`[^`]+`)/g)
  for (const seg of codeSplit) {
    if (seg.startsWith('`') && seg.endsWith('`')) {
      segments.push({ text: seg.slice(1, -1), isCode: true })
    } else {
      segments.push({ text: seg, isCode: false })
    }
  }

  for (const seg of segments) {
    if (seg.isCode) {
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 rounded bg-[var(--color-bg-tertiary)] text-cyan-300 text-[0.875em] font-mono">
          {seg.text}
        </code>,
      )
      continue
    }

    // Bold within non-code segments
    const boldSplit = seg.text.split(/(\*\*[^*]+\*\*)/g)
    for (const b of boldSplit) {
      if (b.startsWith('**') && b.endsWith('**')) {
        parts.push(
          <strong key={key++} className="text-[var(--color-text-primary)] font-semibold">
            {b.slice(2, -2)}
          </strong>,
        )
      } else if (b.length > 0) {
        parts.push(b)
      }
    }
  }

  return parts
}

// ---- page component -------------------------------------------------------

export default function DevelopmentArticlePage() {
  const { slug } = useParams<{ slug: string }>()

  const tutorial = useMemo(() => tutorials.find((t) => t.slug === slug), [slug])
  const parsedBlocks = useMemo(() => (tutorial ? parseContent(tutorial.content) : []), [tutorial])

  useEffect(() => {
    if (tutorial) {
      document.title = `${tutorial.title} - AI应用开发 | ${SITE_NAME}`
    } else {
      document.title = `教程未找到 | ${SITE_NAME}`
    }
  }, [tutorial])

  if (!slug || !tutorial) {
    return <Navigate to="/development" replace />
  }

  const categoryLabel = TUTORIAL_CATEGORIES[tutorial.category] ?? tutorial.category
  const diff = TUTORIAL_DIFFICULTIES[tutorial.difficulty]

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://jiayouvibe.com/#/development/${tutorial.slug}`

  return (
    <>
      <ReadingProgress />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <Link
        to="/development"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-cyan-300 transition-colors duration-200 mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        返回教程列表
      </Link>

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: '首页', href: '/' },
          { label: 'AI应用开发', href: '/development' },
          { label: tutorial.title },
        ]}
        className="mb-8"
      />

      {/* Article header */}
      <header className="mb-10 pb-8 border-b border-white/10">
        {/* Category + difficulty badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wider uppercase bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
            {categoryLabel}
          </span>
          {diff && (
            <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium', diff.color)}>
              {diff.label}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-5 leading-tight">{tutorial.title}</h1>

        {/* Description blurb */}
        <p className="text-[var(--color-text-secondary)] text-base leading-relaxed mb-6">{tutorial.description}</p>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {tutorial.author}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {tutorial.date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {formatReadingTime(tutorial.readingTime)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            {parsedBlocks.length} 个章节
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-5">
          {tutorial.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]/60 font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* Article content */}
      <div className="prose prose-invert max-w-none">
        {(() => {
          const midIndex = Math.floor(parsedBlocks.length / 2)
          const firstHalf = parsedBlocks.slice(0, midIndex)
          const secondHalf = parsedBlocks.slice(midIndex)

          const renderBlock = (block: ContentBlock, i: number) => {
            switch (block.type) {
            case 'h2':
              return (
                <h2 key={i} className="text-2xl font-bold text-[var(--color-text-primary)] mt-10 mb-4 first:mt-0">
                  {renderInline(block.text)}
                </h2>
              )
            case 'h3':
              return (
                <h3 key={i} className="text-xl font-semibold text-[var(--color-text-primary)] mt-8 mb-3">
                  {renderInline(block.text)}
                </h3>
              )
            case 'h4':
              return (
                <h4 key={i} className="text-lg font-semibold text-[var(--color-text-primary)] mt-6 mb-2">
                  {renderInline(block.text)}
                </h4>
              )
            case 'paragraph':
              return (
                <p key={i} className="text-[var(--color-text-primary)] leading-relaxed mb-4">
                  {renderInline(block.text)}
                </p>
              )
            case 'code': {
              return (
                <div key={i} className="my-6 rounded-xl border border-[var(--color-border)]/60 overflow-hidden bg-[var(--color-bg-secondary)]/80">
                  {block.language && (
                    <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-bg-tertiary)]/80 border-b border-[var(--color-border)]/40">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)]">{block.language}</span>
                    </div>
                  )}
                  <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                    <code className="text-[var(--color-text-primary)] font-mono">{block.code}</code>
                  </pre>
                </div>
              )
            }
            case 'ul':
              return (
                <ul key={i} className="list-disc list-outside space-y-1.5 mb-4 ml-6">
                  {block.items.map((item, j) => (
                    <li key={j} className="text-[var(--color-text-primary)] leading-relaxed pl-1">
                      {renderInline(item)}
                    </li>
                  ))}
                </ul>
              )
            case 'ol':
              return (
                <ol key={i} className="list-decimal list-outside space-y-1.5 mb-4 ml-6">
                  {block.items.map((item, j) => (
                    <li key={j} className="text-[var(--color-text-primary)] leading-relaxed pl-1">
                      {renderInline(item)}
                    </li>
                  ))}
                </ol>
              )
            case 'table':
              return (
                <div key={i} className="overflow-x-auto my-6 rounded-lg border border-[var(--color-border)]/60">
                  <table className="min-w-full text-sm">
                    <thead className="bg-[var(--color-bg-tertiary)]/80">
                      <tr>
                        {block.headers.map((h, j) => (
                          <th key={j} className="px-4 py-2.5 text-left text-[var(--color-text-primary)] font-semibold border-b border-[var(--color-border)]/60">
                            {renderInline(h)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, ri) => (
                        <tr key={ri} className="border-b border-[var(--color-border)] last:border-b-0">
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-4 py-2.5 text-[var(--color-text-secondary)]">
                              {renderInline(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            default:
              return null
          }
          }

          return (
            <>
              {firstHalf.map((block, i) => renderBlock(block, i))}
              {parsedBlocks.length > 2 && <AdBanner key="ad-mid" />}
              {secondHalf.map((block, i) => renderBlock(block, midIndex + i))}
            </>
          )
        })()}
      </div>

      {/* Share + Engage */}
      <div className="mt-12 pt-8 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <ShareButtons
            url={shareUrl}
            title={tutorial.title}
            description={tutorial.description}
          />
          <Link
            to="/development"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-cyan-300 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            返回教程列表
          </Link>
        </div>

        {/* Subscribe CTA */}
        <SubscribeCard
          actionUrl="https://jiayouvibe.us21.list-manage.com/subscribe/post?u=REPLACE_ME&amp;id=REPLACE_ME"
          className="mb-8"
        />
      </div>

      {/*
        Giscus comments — powered by GitHub Discussions.
        SETUP: Visit https://giscus.app → enter "Jiayoujw/jiayouvibe" →
        copy your repoId and categoryId → replace the REPLACE_ME values below.
      */}
      <CommentSection
        repo="Jiayoujw/jiayouvibe"
        repoId="R_kgDO_REPLACE_ME"
        category="General"
        categoryId="DIC_kwDO_REPLACE_ME"
      />
    </div>
    </>
  )
}
