import { useEffect, useRef } from 'react'

interface CommentSectionProps {
  /** GitHub repository in "owner/name" format, e.g. "Jiayoujw/jiayouvibe" */
  repo: string
  /** Giscus repo-id (obtained from https://giscus.app) */
  repoId: string
  /** Discussion category name (recommended: "General" or "Comments") */
  category: string
  /** Giscus category-id (obtained from https://giscus.app) */
  categoryId: string
}

/**
 * Giscus comment section — GitHub Discussions-powered comments.
 *
 * Setup steps:
 * 1. Go to https://giscus.app
 * 2. Enter your repo "Jiayoujw/jiayouvibe"
 * 3. Choose "Discussion title contains page pathname" mapping
 * 4. Select the discussion category you want comments filed under
 * 5. Copy the repo-id and category-id values shown on the page
 * 6. Replace the default values below
 */
export default function CommentSection({
  repo,
  repoId,
  category,
  categoryId,
}: CommentSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Remove any previously injected giscus script to avoid duplicates
    const existing = container.querySelector('script.giscus-script')
    if (existing) {
      existing.remove()
    }
    // Also clean up the iframe if re-mounting
    const existingFrame = container.querySelector('iframe.giscus-frame')
    if (existingFrame) {
      existingFrame.remove()
    }

    const script = document.createElement('script')
    script.className = 'giscus-script'
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', repo)
    script.setAttribute('data-repo-id', repoId)
    script.setAttribute('data-category', category)
    script.setAttribute('data-category-id', categoryId)
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', 'dark_dimmed')
    script.setAttribute('data-lang', 'zh-CN')
    script.setAttribute('data-loading', 'lazy')
    script.crossOrigin = 'anonymous'
    script.async = true

    container.appendChild(script)
  }, [repo, repoId, category, categoryId])

  return (
    <section className="mt-16 pt-12 border-t border-white/10">
      <h2 className="text-xl font-sora font-bold text-slate-100 mb-8 flex items-center gap-2.5">
        <svg
          className="w-5 h-5 text-cyan-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        评论
      </h2>
      <div
        ref={containerRef}
        className="giscus rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.02]"
      />
    </section>
  )
}
