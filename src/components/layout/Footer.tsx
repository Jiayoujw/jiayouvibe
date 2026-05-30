import { Link } from 'react-router-dom'
import { Globe, ExternalLink } from 'lucide-react'
import { SITE_NAME, SITE_DESCRIPTION, NAV_ITEMS } from '@/utils/constants'
import type { NavItem } from '@/types'

const RESOURCE_LINKS = [
  { label: 'OpenAI', url: 'https://openai.com' },
  { label: 'Anthropic', url: 'https://anthropic.com' },
  { label: 'Google DeepMind', url: 'https://deepmind.google' },
  { label: 'Hugging Face', url: 'https://huggingface.co' },
  { label: 'Papers With Code', url: 'https://paperswithcode.com' },
  { label: 'arXiv AI', url: 'https://arxiv.org/list/cs.AI/recent' },
]

/* flatten nav items and skip "更多" parent; include its children */
function flattenNavLinks(items: NavItem[]): NavItem[] {
  const flat: NavItem[] = []
  for (const item of items) {
    if (item.children) {
      flat.push(...item.children)
    } else if (item.path !== '#') {
      flat.push(item)
    }
  }
  return flat
}

const quickLinks = flattenNavLinks(NAV_ITEMS)

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/60 bg-slate-950 pb-24 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
          {/* About */}
          <div>
            <Link
              to="/"
              className="inline-block text-xl font-bold bg-gradient-to-r from-[#00dbe7] to-[#d1bcff] bg-clip-text text-transparent"
            >
              {SITE_NAME}
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-xs">
              {SITE_DESCRIPTION}
            </p>
            <div className="mt-5 flex items-center gap-1.5 text-xs text-slate-500">
              <Globe className="h-3.5 w-3.5" />
              <span>中文 AI 知识导航</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              快速链接
            </h3>
            <ul className="mt-5 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 transition-colors hover:text-cyan-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              AI 资源
            </h3>
            <ul className="mt-5 space-y-2.5">
              {RESOURCE_LINKS.map((res) => (
                <li key={res.label}>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-cyan-400 group"
                  >
                    {res.label}
                    <ExternalLink className="h-3 w-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-slate-800/40 py-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-slate-500">
            &copy; 2026 {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            探索AI的无限可能 &middot; 汇聚全球AI知识
          </p>
        </div>
      </div>
    </footer>
  )
}
