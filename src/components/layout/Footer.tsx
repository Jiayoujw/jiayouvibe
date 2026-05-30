import { Link } from 'react-router-dom'
import { SITE_NAME } from '@/utils/constants'

const FOOTER_LINKS = [
  { label: '开发者指南', href: '#' },
  { label: 'API 参考', href: '#' },
  { label: '服务条款', href: '#' },
  { label: '隐私政策', href: '#' },
  { label: '联系我们', href: '#' },
]

export default function Footer() {
  return (
    <footer className="w-full py-12 mt-auto border-t border-[var(--color-border)] bg-[var(--color-bg-primary)]">
      <div className="flex flex-col lg:flex-row justify-between items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto gap-8 lg:gap-4">
        {/* Brand */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="font-sora text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
          >
            {SITE_NAME}
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center lg:flex-1 px-4">
          <span className="font-mono text-xs text-[var(--color-text-muted)] opacity-80">
            &copy; 2026 {SITE_NAME} AI platform. Built for the future of knowledge.
          </span>
        </div>

        {/* Links */}
        <nav className="flex-shrink-0">
          <ul className="flex flex-wrap justify-center lg:justify-end gap-x-8 gap-y-4">
            {FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="font-mono text-xs text-[var(--color-text-secondary)] hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
