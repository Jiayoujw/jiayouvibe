import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  ExternalLink,
  Star,
  Users,
  SortAsc,
  Filter,
  Sparkles,
  Code2,
  Terminal,
  Server,

  Puzzle,
  Workflow,
  Zap,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import { cn } from '@/utils/cn'

// ── Types ────────────────────────────────────────────────────────────────

type SkillCategory =
  | 'ai-coding'
  | 'mcp-tools'
  | 'browser-extensions'
  | 'automation-workflows'

type SortOption = 'default' | 'popular' | 'newest'

interface SkillTool {
  name: string
  description: string
  category: SkillCategory
  tags: string[]
  website: string
  github?: string
  stars?: number
  users?: string
  addedDate?: string
}

// ── Category Filter Config ───────────────────────────────────────────────

const CATEGORY_PILLS: { key: SkillCategory | ''; label: string; emoji: string }[] = [
  { key: '', label: '全部', emoji: '' },
  { key: 'ai-coding', label: 'AI编程助手', emoji: '💻' },
  { key: 'mcp-tools', label: 'MCP工具', emoji: '🔌' },
  { key: 'browser-extensions', label: '浏览器扩展', emoji: '🧩' },
  { key: 'automation-workflows', label: '自动化工作流', emoji: '⚡' },
]

const SORT_OPTIONS: { key: SortOption; label: string; icon: React.ElementType }[] = [
  { key: 'default', label: '默认排序', icon: SortAsc },
  { key: 'popular', label: '热门优先', icon: TrendingUp },
  { key: 'newest', label: '最新添加', icon: Clock },
]

// ── Visual Configs ───────────────────────────────────────────────────────

const CATEGORY_GRADIENTS: Record<SkillCategory, string> = {
  'ai-coding': 'from-violet-500 to-purple-500',
  'mcp-tools': 'from-emerald-500 to-teal-400',
  'browser-extensions': 'from-amber-500 to-orange-400',
  'automation-workflows': 'from-cyan-500 to-blue-500',
}

const CATEGORY_ICONS: Record<SkillCategory, React.ElementType> = {
  'ai-coding': Code2,
  'mcp-tools': Server,
  'browser-extensions': Puzzle,
  'automation-workflows': Workflow,
}

const CATEGORY_BADGE_STYLES: Record<SkillCategory, { bg: string; text: string; border: string }> = {
  'ai-coding': { bg: 'bg-violet-400/10', text: 'text-violet-300', border: 'border-violet-400/20' },
  'mcp-tools': { bg: 'bg-emerald-400/10', text: 'text-emerald-300', border: 'border-emerald-400/20' },
  'browser-extensions': { bg: 'bg-amber-400/10', text: 'text-amber-300', border: 'border-amber-400/20' },
  'automation-workflows': { bg: 'bg-cyan-400/10', text: 'text-cyan-300', border: 'border-cyan-400/20' },
}

const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  'ai-coding': 'AI编程助手',
  'mcp-tools': 'MCP工具',
  'browser-extensions': '浏览器扩展',
  'automation-workflows': '自动化工作流',
}

// ── Skills Data ──────────────────────────────────────────────────────────

const skills: SkillTool[] = [
  // ═══ AI编程助手 ═══
  {
    name: 'Cursor',
    description:
      '基于 VS Code 深度重构的 AI-first 代码编辑器，支持 Composer 全文件编辑、Tab 智能补全、多模型切换和自然语言编程，是当前最受欢迎的 AI IDE。',
    category: 'ai-coding',
    tags: ['IDE', 'VS Code', 'Composer', '多模型'],
    website: 'https://cursor.com',
    stars: 25000,
    addedDate: '2024-01-15',
  },
  {
    name: 'GitHub Copilot',
    description:
      'GitHub 与 OpenAI 联合打造的 AI 编程助手，深度集成 VS Code、JetBrains、Neovim 等主流 IDE，提供行内补全、Chat、代码审查和 Copilot Workspace 等功能。',
    category: 'ai-coding',
    tags: ['GitHub', 'OpenAI', '代码补全', 'Chat'],
    website: 'https://github.com/features/copilot',
    stars: 15000,
    addedDate: '2022-06-21',
  },
  {
    name: 'Claude Code',
    description:
      'Anthropic 官方命令行 AI 编程助手（CLI Agent），深度集成终端和代码库，支持探索性编程、自动化重构、测试生成和复杂的多步骤智能体任务。',
    category: 'ai-coding',
    tags: ['Anthropic', 'CLI', '终端', 'Agent'],
    website: 'https://docs.anthropic.com/en/docs/claude-code',
    stars: 60000,
    addedDate: '2025-02-24',
  },
  {
    name: 'Windsurf',
    description:
      'Codeium 推出的 AI IDE，以 Cascade 流式多文件编辑和开放模型选择为核心竞争力，支持实时协作和深度代码库理解。',
    category: 'ai-coding',
    tags: ['IDE', 'Cascade', '多文件', '多模型'],
    website: 'https://codeium.com/windsurf',
    stars: 15000,
    addedDate: '2024-05-10',
  },
  {
    name: 'Continue',
    description:
      '开源 AI 代码助手，支持 VS Code 和 JetBrains，可接入任何 LLM（包括本地模型如 Ollama/Llama），高度可定制，注重开发者隐私和数据控制。',
    category: 'ai-coding',
    tags: ['开源', 'VS Code', 'JetBrains', '本地模型'],
    website: 'https://continue.dev',
    github: 'https://github.com/continuedev/continue',
    stars: 22000,
    addedDate: '2023-06-15',
  },
  {
    name: 'Cline',
    description:
      'VS Code 中的自主 AI 编码 Agent，能够编辑文件、运行终端命令、使用浏览器，通过 MCP 协议扩展能力，是 VS Code 上最强大的 AI Agent 插件。',
    category: 'ai-coding',
    tags: ['VS Code', 'Agent', 'MCP', '终端'],
    website: 'https://github.com/cline/cline',
    github: 'https://github.com/cline/cline',
    stars: 20000,
    addedDate: '2024-07-20',
  },
  {
    name: 'Aider',
    description:
      '终端中的 AI 结对编程工具，支持多文件编辑、Git 自动提交、地图文件（repo map）和数百种 LLM 模型，是命令行开发者的效率利器。',
    category: 'ai-coding',
    tags: ['终端', 'Git', '结对编程', '多模型'],
    website: 'https://github.com/paul-gauthier/aider',
    github: 'https://github.com/paul-gauthier/aider',
    stars: 28000,
    addedDate: '2023-04-10',
  },
  {
    name: 'Cody',
    description:
      'Sourcegraph 推出的 AI 编码助手，以全代码库上下文理解和跨文件编辑见长，深度整合 Sourcegraph 代码搜索，支持 VS Code、JetBrains 等 IDE。',
    category: 'ai-coding',
    tags: ['Sourcegraph', '代码搜索', '全代码库', 'VS Code'],
    website: 'https://sourcegraph.com/cody',
    github: 'https://github.com/sourcegraph/cody',
    stars: 3000,
    addedDate: '2023-09-01',
  },
  {
    name: 'Amazon Q Developer',
    description:
      'AWS 推出的 AI 编程助手（原 CodeWhisperer），深度整合 AWS 生态，支持代码补全、安全扫描、架构建议和自然语言到代码转换，对 AWS 用户免费开放。',
    category: 'ai-coding',
    tags: ['AWS', '代码补全', '安全扫描', '云生态'],
    website: 'https://aws.amazon.com/q/developer/',
    users: '数百万 AWS 开发者',
    addedDate: '2023-04-13',
  },
  {
    name: 'Tabnine',
    description:
      '老牌 AI 代码补全工具，支持企业私有化部署、多种 IDE 和多种编程语言，注重代码隐私和合规，提供本地化部署方案满足企业安全需求。',
    category: 'ai-coding',
    tags: ['代码补全', '私有部署', '企业', '合规'],
    website: 'https://www.tabnine.com',
    users: '100万+ 开发者',
    addedDate: '2019-06-01',
  },

  // ═══ MCP工具 ═══
  {
    name: 'Filesystem MCP Server',
    description:
      'MCP 官方文件系统服务器，让 AI 助手安全地读取、写入、搜索和管理本地文件系统，支持路径限制和权限控制，是构建本地 AI 工具链的基础。',
    category: 'mcp-tools',
    tags: ['文件操作', '本地', '安全', '官方'],
    website: 'https://github.com/modelcontextprotocol/servers',
    github: 'https://github.com/modelcontextprotocol/servers',
    stars: 20000,
    addedDate: '2024-11-25',
  },
  {
    name: 'GitHub MCP Server',
    description:
      'MCP 官方 GitHub 集成服务器，让 AI 助手直接管理仓库、PR、Issue、分支和 Actions，实现代码审查、自动合并等高级自动化流程。',
    category: 'mcp-tools',
    tags: ['GitHub', '仓库管理', 'PR', 'Issue'],
    website: 'https://github.com/modelcontextprotocol/servers',
    github: 'https://github.com/modelcontextprotocol/servers',
    stars: 20000,
    addedDate: '2024-11-25',
  },
  {
    name: 'PostgreSQL MCP Server',
    description:
      'MCP 官方 PostgreSQL 数据库服务器，让 AI 助手发现 Schema、执行查询和洞察数据，支持读写控制和安全审计，面向数据分析和后端开发场景。',
    category: 'mcp-tools',
    tags: ['PostgreSQL', '数据库', 'Schema', '查询'],
    website: 'https://github.com/modelcontextprotocol/servers',
    github: 'https://github.com/modelcontextprotocol/servers',
    stars: 20000,
    addedDate: '2024-11-25',
  },
  {
    name: 'Puppeteer MCP Server',
    description:
      'MCP 官方浏览器自动化服务器，让 AI 助手控制无头 Chrome 进行网页截图、PDF 生成、表单填写和端到端测试，是 Web 自动化场景的核心工具。',
    category: 'mcp-tools',
    tags: ['Puppeteer', '浏览器', '截图', '自动化'],
    website: 'https://github.com/modelcontextprotocol/servers',
    github: 'https://github.com/modelcontextprotocol/servers',
    stars: 20000,
    addedDate: '2024-12-10',
  },
  {
    name: 'Brave Search MCP Server',
    description:
      'MCP 官方 Web 搜索服务器，集成 Brave Search API 让 AI 助手实时检索互联网信息，支持网页、新闻和图片搜索，为 AI 提供实时知识补充。',
    category: 'mcp-tools',
    tags: ['搜索', 'Web', 'Brave', '实时'],
    website: 'https://github.com/modelcontextprotocol/servers',
    github: 'https://github.com/modelcontextprotocol/servers',
    stars: 20000,
    addedDate: '2024-12-10',
  },

  // ═══ 浏览器扩展 ═══
  {
    name: 'Monica',
    description:
      '全能 AI 浏览器扩展，集成 ChatGPT、Claude、Gemini 等顶级模型，支持网页摘要、写作辅助、聊天和多种生产力工具，提升网页浏览效率。',
    category: 'browser-extensions',
    tags: ['多模型', '网页摘要', '写作', 'ChatGPT'],
    website: 'https://monica.im',
    users: '300万+ 用户',
    addedDate: '2023-03-15',
  },
  {
    name: 'Sider AI',
    description:
      '智能 AI 侧边栏浏览器扩展，集成 ChatGPT、Claude、Gemini 等模型，支持网页问答、文档分析、写作和代码解释，一键对比多个 AI 回复。',
    category: 'browser-extensions',
    tags: ['侧边栏', '多模型对比', '文档分析', '写作'],
    website: 'https://sider.ai',
    users: '500万+ 用户',
    addedDate: '2023-02-20',
  },
  {
    name: 'Merlin AI',
    description:
      '轻量级 AI 浏览器扩展，快捷键唤出 AI 助手，支持网页总结、YouTube 摘要、社交媒体回复和 Google 搜索增强，响应速度快。',
    category: 'browser-extensions',
    tags: ['快捷键', 'YouTube', '搜索增强', '轻量'],
    website: 'https://www.getmerlin.in',
    users: '200万+ 用户',
    addedDate: '2023-01-10',
  },
  {
    name: 'MaxAI.me',
    description:
      'All-in-one AI 浏览器扩展，支持 15+ 顶级 AI 模型，原生集成网页摘要、Prompt 模板库和侧边栏聊天，一劳永逸的 AI 扩展解决方案。',
    category: 'browser-extensions',
    tags: ['All-in-one', '多模型', '模板库', '侧边栏'],
    website: 'https://www.maxai.me',
    users: '150万+ 用户',
    addedDate: '2023-07-05',
  },
  {
    name: 'Perplexity',
    description:
      'AI 搜索引擎 Perplexity 的浏览器扩展，在任何网页上直接提问并获取带引用的 AI 答案，支持网页上下文理解，是研究和调研的得力助手。',
    category: 'browser-extensions',
    tags: ['搜索', '引用', '研究', '上下文'],
    website: 'https://www.perplexity.ai',
    users: '1500万+ 月活用户',
    addedDate: '2023-08-15',
  },

  // ═══ 自动化工作流 ═══
  {
    name: 'n8n',
    description:
      '开源 AI 工作流自动化平台，提供可视化拖拽编排界面，原生集成 LangChain AI 节点，支持自托管和云服务，500+ 应用连接器，面向深度技术用户。',
    category: 'automation-workflows',
    tags: ['开源', 'AI节点', '可视化', '自托管'],
    website: 'https://n8n.io',
    github: 'https://github.com/n8n-io/n8n',
    stars: 55000,
    addedDate: '2019-12-10',
  },
  {
    name: 'Zapier AI',
    description:
      '全球最大的自动化平台，6000+ 应用集成，Zapier Central 支持自然语言创建自动化流程，AI 自动提取数据、分类和生成回复，零代码上手。',
    category: 'automation-workflows',
    tags: ['6000+应用', '自然语言', '零代码', 'Central'],
    website: 'https://zapier.com/ai',
    users: '300万+ 企业用户',
    addedDate: '2023-05-01',
  },
  {
    name: 'Make (Integromat)',
    description:
      '强大的可视化 AI 工作流自动化平台，比 Zapier 更灵活的图形化路由和错误处理，支持 2000+ 应用，AI 模块覆盖文本分析、图像识别等场景。',
    category: 'automation-workflows',
    tags: ['可视化', '图形路由', '2000+应用', 'AI模块'],
    website: 'https://www.make.com',
    users: '100万+ 用户',
    addedDate: '2023-06-01',
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────

function formatStars(n: number): string {
  if (n >= 1000) {
    return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k'
  }
  return n.toString()
}

// ── Sub-components ───────────────────────────────────────────────────────

function CategoryGradientIcon({ category }: { category: SkillCategory }) {
  const Icon = CATEGORY_ICONS[category]
  return (
    <div
      className={cn(
        'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0',
        CATEGORY_GRADIENTS[category],
        'shadow-lg',
      )}
    >
      <Icon className="h-5 w-5 text-white" strokeWidth={1.8} />
    </div>
  )
}

function CategoryBadge({ category }: { category: SkillCategory }) {
  const s = CATEGORY_BADGE_STYLES[category]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-jetbrains font-medium tracking-wide border',
        s.bg,
        s.text,
        s.border,
      )}
    >
      {SKILL_CATEGORY_LABELS[category]}
    </span>
  )
}

function SkillCard({ skill }: { skill: SkillTool }) {
  return (
    <div
      className={cn(
        'group relative bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5',
        'transition-all duration-500 ease-out',
        'hover:scale-[1.02] hover:bg-white/[0.05] hover:border-white/[0.15]',
        'hover:shadow-[0_0_30px_rgba(6,182,212,0.12),0_0_30px_rgba(168,85,247,0.12)]',
      )}
    >
      {/* Hover ambient glow overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-purple-500/[0.06]" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top row: gradient icon + category badge */}
        <div className="flex items-start justify-between mb-3">
          <CategoryGradientIcon category={skill.category} />
          <CategoryBadge category={skill.category} />
        </div>

        {/* Name + Stats */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-sora font-semibold text-white group-hover:text-cyan-100 transition-colors truncate">
            {skill.name}
          </h3>
          {skill.stars && (
            <span className="inline-flex items-center gap-1 shrink-0 text-[11px] text-slate-400 font-jetbrains">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {formatStars(skill.stars)}
            </span>
          )}
          {skill.users && !skill.stars && (
            <span className="inline-flex items-center gap-1 shrink-0 text-[11px] text-slate-400 font-jetbrains">
              <Users className="h-3 w-3 text-cyan-400" />
              {skill.users}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400/80 leading-relaxed line-clamp-2 mb-4 flex-1">
          {skill.description}
        </p>

        {/* Tag chips */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {skill.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-jetbrains text-slate-400 bg-white/[0.04] border border-white/[0.06]"
            >
              {tag}
            </span>
          ))}
          {skill.tags.length > 3 && (
            <span className="text-[10px] text-slate-600 font-jetbrains">
              +{skill.tags.length - 3}
            </span>
          )}
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            {skill.github && (
              <a
                href={skill.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200"
                onClick={(e) => e.stopPropagation()}
                title="GitHub"
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
            )}
          </div>
          <a
            href={skill.website}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-jetbrains font-medium',
              'bg-cyan-400/10 border border-cyan-400/20 text-cyan-300',
              'hover:bg-cyan-400/20 hover:border-cyan-400/40 hover:text-cyan-200',
              'transition-all duration-200',
            )}
            onClick={(e) => e.stopPropagation()}
          >
            Visit
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────

const SkillsPage = () => {
  useEffect(() => {
    document.title = `AI 技能工具 | ${SITE_NAME}`
  }, [])

  // ── Filter & Sort state ──
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | ''>('')
  const [sortOption, setSortOption] = useState<SortOption>('default')

  // ── Filtered & sorted skills ──
  const filteredSkills = useMemo(() => {
    let result = [...skills]

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          SKILL_CATEGORY_LABELS[s.category].toLowerCase().includes(q),
      )
    }

    if (categoryFilter) {
      result = result.filter((s) => s.category === categoryFilter)
    }

    switch (sortOption) {
      case 'popular':
        result.sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0))
        break
      case 'newest':
        result.sort((a, b) => (b.addedDate ?? '').localeCompare(a.addedDate ?? ''))
        break
      default:
        break
    }

    return result
  }, [searchQuery, categoryFilter, sortOption])

  const hasActiveFilters = searchQuery || categoryFilter

  return (
    <div className="space-y-8 pb-12">
      {/* ═══ Page Header ═══ */}
      <div>
        <h1 className="text-3xl font-sora font-bold text-white mb-2">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI 技能工具
          </span>
        </h1>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          精选 AI 编程助手、MCP 协议工具、浏览器扩展和自动化工作流平台，覆盖从代码编写到工作流自动化的全场景 AI 技能生态，助你高效利用 AI 提升开发效率。
        </p>
      </div>

      {/* ═══ Search Bar ═══ */}
      <div
        className={cn(
          'relative bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-1',
          'focus-within:border-cyan-400/30 focus-within:shadow-[0_0_30px_rgba(6,182,212,0.08)]',
          'transition-all duration-500',
        )}
      >
        <div className="flex items-center gap-3 px-4 py-1">
          <Search className="h-4.5 w-4.5 text-slate-500 shrink-0" strokeWidth={1.8} />
          <input
            type="text"
            placeholder="搜索技能工具名称、描述、标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-500 py-2.5 font-jetbrains"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ═══ Category Filter Pills ═══ */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-slate-500 shrink-0 mr-1" strokeWidth={1.8} />
        {CATEGORY_PILLS.map((pill) => {
          const isActive = categoryFilter === pill.key
          return (
            <button
              key={pill.key}
              onClick={() => setCategoryFilter(pill.key)}
              className={cn(
                'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-jetbrains font-medium tracking-wide transition-all duration-300',
                'border backdrop-blur-sm',
                isActive
                  ? 'bg-cyan-400/15 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/[0.15] hover:bg-white/[0.05]',
              )}
            >
              {pill.emoji && <span className="text-sm leading-none">{pill.emoji}</span>}
              {pill.label}
            </button>
          )
        })}
      </div>

      {/* ═══ Sort + Clear ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <SortAsc className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.8} />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-[10px] font-jetbrains font-medium text-slate-300',
              'bg-white/[0.04] backdrop-blur-sm border border-white/[0.08]',
              'appearance-none cursor-pointer outline-none',
              'focus-visible:border-cyan-400/40',
              'pr-8',
            )}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1rem 1rem',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key} className="bg-slate-900 text-slate-200">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearchQuery('')
              setCategoryFilter('')
              setSortOption('default')
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-jetbrains text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors border border-white/[0.05]"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            清除筛选
          </button>
        )}
      </div>

      {/* ═══ Results count ═══ */}
      <div className="flex items-center gap-2 text-sm text-slate-500 font-jetbrains">
        <Sparkles className="h-4 w-4 text-cyan-400" />
        <span>
          共 {filteredSkills.length} 个技能工具
          {hasActiveFilters && '（已筛选）'}
        </span>
      </div>

      {/* ═══ Skills Card Grid ═══ */}
      {filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredSkills.map((skill, i) => (
            <SkillCard key={`${skill.name}-${i}`} skill={skill} />
          ))}
        </div>
      ) : (
        <div
          className={cn(
            'flex flex-col items-center justify-center py-20 px-6',
            'bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl',
          )}
        >
          <Search className="h-8 w-8 text-slate-600 mb-4" />
          <h3 className="text-lg font-sora font-semibold text-slate-300 mb-1">
            未找到匹配的技能工具
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            尝试调整搜索词或筛选条件
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setCategoryFilter('')
              setSortOption('default')
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-jetbrains font-medium text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 hover:bg-cyan-400/20 transition-colors"
          >
            <Filter className="h-4 w-4" />
            清除所有筛选
          </button>
        </div>
      )}

      {/* ═══ Bottom Info CTA ═══ */}
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl',
          'bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08]',
          'p-8 md:p-10',
        )}
      >
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -top-32 -right-20 w-64 h-64 rounded-full bg-cyan-500/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 w-56 h-56 rounded-full bg-purple-500/[0.06] blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left: heading */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-sora font-bold text-white mb-3">
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">
                发现更多 AI 技能
              </span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              AI 技能生态正在飞速发展。MCP（Model Context Protocol）是连接 AI 与外部工具的新标准，浏览器扩展让 AI 无处不在，自动化工作流则让 AI 融入业务。
            </p>
          </div>

          {/* Right: quick link cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://github.com/modelcontextprotocol/servers"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl',
                'bg-white/[0.04] border border-white/[0.06]',
                'hover:bg-white/[0.06] hover:border-emerald-400/20',
                'transition-all duration-300 group',
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shrink-0 shadow-lg">
                <Server className="h-5 w-5 text-white" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-sora font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                  MCP 官方服务器仓库
                </p>
                <p className="text-[11px] text-slate-500 font-jetbrains">
                  modelcontextprotocol/servers
                </p>
              </div>
            </a>
            <a
              href="https://github.com/topics/mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl',
                'bg-white/[0.04] border border-white/[0.06]',
                'hover:bg-white/[0.06] hover:border-cyan-400/20',
                'transition-all duration-300 group',
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center shrink-0 shadow-lg">
                <Terminal className="h-5 w-5 text-white" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-sora font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  社区 MCP 服务器
                </p>
                <p className="text-[11px] text-slate-500 font-jetbrains">
                  GitHub Topics: mcp-server
                </p>
              </div>
            </a>
            <a
              href="https://cursor.com"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl',
                'bg-white/[0.04] border border-white/[0.06]',
                'hover:bg-white/[0.06] hover:border-violet-400/20',
                'transition-all duration-300 group',
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg">
                <Code2 className="h-5 w-5 text-white" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-sora font-semibold text-slate-200 group-hover:text-violet-300 transition-colors">
                  Cursor AI IDE
                </p>
                <p className="text-[11px] text-slate-500 font-jetbrains">
                  cursor.com
                </p>
              </div>
            </a>
            <a
              href="https://zapier.com/ai"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl',
                'bg-white/[0.04] border border-white/[0.06]',
                'hover:bg-white/[0.06] hover:border-amber-400/20',
                'transition-all duration-300 group',
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shrink-0 shadow-lg">
                <Zap className="h-5 w-5 text-white" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-sora font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                  Zapier AI 自动化
                </p>
                <p className="text-[11px] text-slate-500 font-jetbrains">
                  zapier.com/ai
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Inject keyframes */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(6, 182, 212, 0.25);
          }
          50% {
            box-shadow: 0 4px 35px rgba(6, 182, 212, 0.45), 0 0 60px rgba(6, 182, 212, 0.1);
          }
        }
      `}</style>
    </div>
  )
}

export default SkillsPage
