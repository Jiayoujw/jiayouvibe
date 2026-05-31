import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Cpu,
  Bot,
  Code2,
  BookOpen,
  Globe,
  Newspaper,
  Wrench,
  Trophy,
  GitCompare,
  StickyNote,
  Flame,
  Layers,
  Zap,
  FileText,
  GraduationCap,
  BarChart3,
  Wand2,
  Info,
  Bookmark,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { SITE_NAME } from '@/utils/constants'
import { cn } from '@/utils/cn'

/* -------------------------------------------------------------------------- */
/*  Nav groups                                                                */
/* -------------------------------------------------------------------------- */

interface NavEntry {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  external?: boolean
}

interface NavGroup {
  title: string
  items: NavEntry[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: '主导航',
    items: [
      { label: '首页', path: '/', icon: Home },
      { label: 'AI大模型', path: '/models', icon: Cpu },
      { label: 'AI智能体', path: '/agents', icon: Bot },
      { label: 'AI应用开发', path: '/development', icon: Code2 },
      { label: 'AI专业术语', path: '/terminology', icon: BookOpen },
      { label: '网站收录', path: '/directory', icon: Globe },
    ],
  },
  {
    title: '工具与数据',
    items: [
      { label: 'AI资讯', path: '/news', icon: Newspaper },
      { label: 'AI工具箱', path: '/tools', icon: Wrench },
      { label: 'Agent排行榜', path: '/agent-rankings', icon: Trophy },
      { label: '模型对比', path: '/compare', icon: GitCompare },
    ],
  },
  {
    title: '个人与更多',
    items: [
      { label: '笔记系统', path: '/notes', icon: StickyNote },
      { label: '我的收藏', path: '/favorites', icon: Bookmark },
      { label: 'GitHub热门', path: 'https://gh.jiayouvibe.com', icon: Flame, external: true },
      { label: '其他AI领域', path: '/domains', icon: Layers },
      { label: 'AI技能工具', path: '/skills', icon: Zap },
      { label: '提示词模板', path: '/prompts', icon: FileText },
      { label: '学习路径', path: '/learn', icon: GraduationCap },
      { label: '面板总览', path: '/dashboard', icon: BarChart3 },
      { label: 'Claude Skills', path: '/claude-skills', icon: Wand2 },
      { label: '关于我们', path: '/about', icon: Info },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const EXPANDED_WIDTH = 260
const COLLAPSED_WIDTH = 80
const SIDEBAR_WIDTH_VAR = '--sidebar-width'

/* -------------------------------------------------------------------------- */
/*  Component                                                                */
/* -------------------------------------------------------------------------- */

export default function Sidebar() {
  const location = useLocation()
  const { isDark, toggle: toggleTheme } = useTheme()
  const { lang, toggle: toggleLang } = useLanguage()
  const [collapsed, setCollapsed] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  // ---- Set CSS variable so main content can read sidebar width ----
  useEffect(() => {
    document.documentElement.style.setProperty(
      SIDEBAR_WIDTH_VAR,
      `${collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH}px`,
    )
  }, [collapsed])

  // ---- Active detection ----
  const isActive = useCallback(
    (path: string) => {
      if (path === '/') return location.pathname === '/'
      return location.pathname.startsWith(path)
    },
    [location.pathname],
  )

  // ---- Toggle group collapse ----
  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(title)) {
        next.delete(title)
      } else {
        next.add(title)
      }
      return next
    })
  }

  /* ---------------------------------------------------------------------- */
  /*  Render                                                                */
  /* ---------------------------------------------------------------------- */

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40 flex flex-col',
        'glass-panel',
        'border-r border-[var(--glass-border)]',
        'transition-all duration-300 ease-in-out',
      )}
      style={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
    >
      {/* ---- Logo ---- */}
      <Link
        to="/"
        className={cn(
          'flex items-center h-16 shrink-0',
          collapsed ? 'justify-center px-2' : 'px-5',
        )}
      >
        <span
          className={cn(
            'font-bold tracking-tight bg-gradient-to-r from-[#00dbe7] to-[#d1bcff] bg-clip-text text-transparent transition-all duration-300',
            collapsed ? 'text-base' : 'text-xl',
          )}
        >
          {collapsed ? 'JV' : SITE_NAME}
        </span>
      </Link>

      {/* ---- Divider ---- */}
      <div className="mx-4 h-px shrink-0 bg-gradient-to-r from-transparent via-[var(--glass-border)] to-transparent" />

      {/* ---- Scrollable nav area ---- */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-4 scrollbar-thin">
        {NAV_GROUPS.map((group) => {
          const isGroupCollapsed = collapsedGroups.has(group.title)

          return (
            <div key={group.title}>
              {/* Group header */}
              {!collapsed && (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.title)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider',
                    'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors duration-200',
                  )}
                >
                  <span className="flex-1 text-left">{group.title}</span>
                  <ChevronLeft
                    className={cn(
                      'h-3 w-3 shrink-0 transition-transform duration-200',
                      isGroupCollapsed && '-rotate-90',
                    )}
                  />
                </button>
              )}

              {/* Group items (always visible when sidebar is collapsed — icons only) */}
              {(!isGroupCollapsed || collapsed) && (
                <div className={cn('space-y-0.5', !collapsed && 'mt-0.5')}>
                  {group.items.map((item) => {
                    const active = isActive(item.path)
                    const Icon = item.icon

                    return item.external ? (
                      <a
                        key={item.path}
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          'flex items-center h-10 gap-3 rounded-lg transition-all duration-200 group',
                          collapsed ? 'justify-center px-2' : 'px-3',
                          'text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-white',
                          collapsed && 'border-l-[3px] border-transparent',
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-[18px] w-[18px] shrink-0 transition-colors duration-200',
                            'text-[var(--color-text-muted)] group-hover:text-white',
                          )}
                        />
                        {!collapsed && (
                          <span className="text-sm font-medium truncate">
                            {item.label}
                          </span>
                        )}
                        {!collapsed && (
                          <ExternalLink className="h-3 w-3 ml-auto text-[var(--color-text-muted)]" />
                        )}
                      </a>
                    ) : (
                      <Link
                        key={item.path}
                        to={item.path}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          'flex items-center h-10 gap-3 rounded-lg transition-all duration-200 group',
                          collapsed ? 'justify-center px-2' : 'px-3',
                          active
                            ? 'bg-cyan-400/10 text-cyan-400 border-l-[3px] border-cyan-400'
                            : 'text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-white',
                          !active && collapsed && 'border-l-[3px] border-transparent',
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-[18px] w-[18px] shrink-0 transition-colors duration-200',
                            !active && 'text-[var(--color-text-muted)] group-hover:text-white',
                          )}
                        />
                        {!collapsed && (
                          <span className="text-sm font-medium truncate">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* ---- Bottom toolbar ---- */}
      <div
        className={cn(
          'shrink-0 border-t border-[var(--glass-border)]',
          collapsed ? 'px-2 py-3 flex flex-col items-center gap-3' : 'px-4 py-3 flex items-center justify-between',
        )}
      >
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
          className={cn(
            'flex items-center justify-center rounded-lg transition-all duration-200 active:scale-95',
            'text-[var(--color-text-secondary)] hover:text-cyan-400 hover:bg-[var(--color-bg-tertiary)]/60',
            collapsed ? 'h-8 w-8' : 'h-8 w-8',
          )}
        >
          {isDark ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </button>

        {/* Language toggle */}
        <button
          type="button"
          onClick={toggleLang}
          title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
          className={cn(
            'flex items-center justify-center rounded-lg transition-all duration-200 active:scale-95',
            'text-[var(--color-text-secondary)] hover:text-cyan-400 hover:bg-[var(--color-bg-tertiary)]/60',
            collapsed ? 'h-8 w-8' : 'h-8 w-8',
          )}
        >
          <Globe className="h-[18px] w-[18px]" />
          {!collapsed && (
            <span className="ml-1.5 text-[10px] font-medium uppercase leading-none">
              {lang === 'zh' ? 'EN' : '中'}
            </span>
          )}
        </button>

        {/* Collapse / Expand */}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          title={collapsed ? '展开侧边栏' : '收起侧边栏'}
          className={cn(
            'flex items-center justify-center rounded-lg transition-all duration-200 active:scale-95',
            'text-[var(--color-text-muted)] hover:text-cyan-400 hover:bg-[var(--color-bg-tertiary)]/60',
            collapsed ? 'h-8 w-8' : 'h-8 w-8',
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-[18px] w-[18px]" />
          ) : (
            <ChevronLeft className="h-[18px] w-[18px]" />
          )}
        </button>
      </div>
    </aside>
  )
}
