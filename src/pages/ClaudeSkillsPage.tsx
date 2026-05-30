import { useEffect, useRef } from 'react'
import {
  Wand2,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Star,
  BookOpen,
  Code2,
  Pencil,
  BarChart3,
  Users,
  Search,
  Brain,
  Monitor,
  FileText,
  Globe,
  Download,

} from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import { cn } from '@/utils/cn'

// ── Types ────────────────────────────────────────────────────────────────

interface SkillEntry {
  name: string
  author: string
  description: string
  icon: React.ElementType
  tags: string[]
  stars?: number
  downloads?: string
  link: string
  official?: boolean
}

// ── Official Claude Skills data ─────────────────────────────────────────

const officialSkills: SkillEntry[] = [
  {
    name: 'Code Review Assistant',
    author: 'Anthropic',
    description:
      '自动化代码审查助手，能够深度分析代码质量、检测潜在 bug、提出架构改进建议，并生成结构化的审查报告。支持多种编程语言和框架。',
    icon: Code2,
    tags: ['代码审查', '质量分析', 'Bug检测'],
    stars: 4200,
    link: 'https://docs.anthropic.com/en/docs/claude-code',
    official: true,
  },
  {
    name: 'Writing Style Editor',
    author: 'Anthropic',
    description:
      '智能文本编辑助手，可将任意文本按照指定的风格指南进行改写，支持学术论文、技术文档、营销文案等多种写作场景。',
    icon: Pencil,
    tags: ['文本编辑', '风格指南', '多场景'],
    stars: 3800,
    link: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching',
    official: true,
  },
  {
    name: 'Data Analysis Companion',
    author: 'Anthropic',
    description:
      '数据分析伴侣，能够帮助用户理解数据集结构、发现数据中的模式和异常、生成可视化建议，并输出可复现的分析脚本。',
    icon: BarChart3,
    tags: ['数据分析', '可视化', '模式发现'],
    stars: 3500,
    link: 'https://docs.anthropic.com/en/docs/welcome',
    official: true,
  },
  {
    name: 'Meeting Summarizer',
    author: 'Anthropic',
    description:
      '会议摘要生成器，自动提取会议转录文本中的关键决策、行动项和讨论要点，生成结构化的会议纪要，支持多语言。',
    icon: Users,
    tags: ['会议摘要', '转录分析', '行动项'],
    stars: 2900,
    link: 'https://docs.anthropic.com/en/docs/build-with-claude',
    official: true,
  },
  {
    name: 'Research Assistant',
    author: 'Anthropic',
    description:
      '研究辅助工具，能够帮助研究人员快速检索文献、综合多个来源的信息、提炼关键论点，并生成带引用标注的研究笔记。',
    icon: Search,
    tags: ['文献检索', '信息综合', '引用管理'],
    stars: 4100,
    link: 'https://docs.anthropic.com/en/docs/welcome',
    official: true,
  },
]

// ── Community Skills data ───────────────────────────────────────────────

const communitySkills: SkillEntry[] = [
  {
    name: 'Claude Memory',
    author: 'anthropics/claude-memory',
    description:
      '为 Claude 提供持久化记忆能力。通过文件系统存储对话上下文和用户偏好，使 Claude 在跨会话中保持一致的交互体验。支持记忆的创建、检索、更新和删除。',
    icon: Brain,
    tags: ['Memory', '持久化', '上下文', '开源'],
    stars: 2800,
    link: 'https://github.com/anthropics/claude-memory',
    official: false,
  },
  {
    name: 'Claude Computer Use',
    author: 'Anthropic 团队',
    description:
      '赋予 Claude 操控计算机桌面的能力，包括屏幕截图分析、鼠标键盘操作自动化、GUI 交互等。使 Claude 能够直接与桌面软件和网页交互。',
    icon: Monitor,
    tags: ['Computer Use', '桌面操控', '自动化', 'GUI'],
    stars: 5600,
    link: 'https://github.com/anthropics/anthropic-quickstarts',
    official: false,
  },
  {
    name: 'Claude PDF Analyzer',
    author: '社区开发者',
    description:
      '强大的 PDF 文档解析与分析工具，支持多页文档读取、表格提取、图表识别和结构化内容输出。可处理学术论文、合同、报告等各类 PDF 文档。',
    icon: FileText,
    tags: ['PDF', '文档分析', '表格提取', 'OCR'],
    stars: 1900,
    link: 'https://github.com/anthropics/anthropic-cookbook',
    official: false,
  },
  {
    name: 'Claude Website Builder',
    author: '社区开发者',
    description:
      '基于 Claude 的网站构建器，通过自然语言描述即可生成完整的响应式网站。支持 React、Tailwind CSS，可一键部署到 Vercel 或 Netlify。',
    icon: Globe,
    tags: ['网站构建', 'React', 'Tailwind', '部署'],
    stars: 3400,
    link: 'https://github.com/anthropics/anthropic-cookbook',
    official: false,
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

/** Amber gradient circle icon for skill cards */
function SkillIcon({ icon: Icon, size }: { icon: React.ElementType; size?: 'md' | 'lg' }) {
  const isLg = size === 'lg'
  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full shrink-0',
        'bg-gradient-to-br from-amber-500 to-orange-600',
        'shadow-[0_0_20px_rgba(217,119,6,0.3)]',
        isLg ? 'w-14 h-14' : 'w-11 h-11',
      )}
    >
      <Icon
        className={cn('text-white', isLg ? 'h-6 w-6' : 'h-5 w-5')}
        strokeWidth={1.8}
      />
    </div>
  )
}

/** Tag chip styled with amber tones */
function TagChip({ label }: { label: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-jetbrains font-medium',
        'text-amber-300/80 bg-amber-400/8 border border-amber-400/15',
      )}
    >
      {label}
    </span>
  )
}

/** Horizontal scrollable skill card (used in official section) */
function HorizontalSkillCard({ skill }: { skill: SkillEntry }) {
  return (
    <div
      className={cn(
        'flex-shrink-0 w-80 sm:w-96',
        'group relative bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5',
        'transition-all duration-500 ease-out',
        'hover:scale-[1.02] hover:bg-white/[0.05] hover:border-amber-400/20',
        'hover:shadow-[0_0_30px_rgba(217,119,6,0.15),0_0_30px_rgba(251,191,36,0.08)]',
      )}
    >
      {/* Hover ambient glow overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-amber-500/[0.06] via-transparent to-orange-600/[0.06]" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top: icon + official badge */}
        <div className="flex items-start justify-between mb-3">
          <SkillIcon icon={skill.icon} />
          {skill.official && (
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-jetbrains font-medium',
                'bg-amber-400/10 border border-amber-400/20 text-amber-300',
              )}
            >
              <Sparkles className="h-3 w-3" />
              官方
            </span>
          )}
        </div>

        {/* Name + Stars */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-sora font-semibold text-white group-hover:text-amber-100 transition-colors">
            {skill.name}
          </h3>
          {skill.stars && (
            <span className="inline-flex items-center gap-1 shrink-0 text-[11px] text-amber-400/80 font-jetbrains">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {formatStars(skill.stars)}
            </span>
          )}
        </div>

        {/* Author */}
        <p className="text-[11px] text-amber-400/50 font-jetbrains mb-2 uppercase tracking-wider">
          {skill.author}
        </p>

        {/* Description */}
        <p className="text-sm text-slate-400/80 leading-relaxed line-clamp-3 mb-4 flex-1">
          {skill.description}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {skill.tags.map((tag) => (
            <TagChip key={tag} label={tag} />
          ))}
        </div>

        {/* Bottom link */}
        <div className="pt-3 border-t border-white/[0.06]">
          <a
            href={skill.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-jetbrains font-medium',
              'text-amber-400 hover:text-amber-300 transition-colors duration-200',
            )}
          >
            了解更多
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

/** Grid skill card (used in community section) */
function GridSkillCard({ skill }: { skill: SkillEntry }) {
  return (
    <div
      className={cn(
        'group relative bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6',
        'transition-all duration-500 ease-out',
        'hover:scale-[1.02] hover:bg-white/[0.05] hover:border-amber-400/20',
        'hover:shadow-[0_0_30px_rgba(217,119,6,0.15),0_0_30px_rgba(251,191,36,0.08)]',
      )}
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-amber-500/[0.06] via-transparent to-orange-600/[0.06]" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top row: icon + stars */}
        <div className="flex items-start justify-between mb-4">
          <SkillIcon icon={skill.icon} size="lg" />
          <div className="flex items-center gap-3">
            {skill.stars && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-400/80 font-jetbrains">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {formatStars(skill.stars)}
              </span>
            )}
            {skill.downloads && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-jetbrains">
                <Download className="h-3.5 w-3.5" />
                {skill.downloads}
              </span>
            )}
          </div>
        </div>

        {/* Name + GitHub icon */}
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-sora font-semibold text-white group-hover:text-amber-100 transition-colors">
            {skill.name}
          </h3>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs text-amber-400/50 font-jetbrains">{skill.author}</p>
          <a
            href={skill.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-amber-400 transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400/80 leading-relaxed mb-5 flex-1">
          {skill.description}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap mb-5">
          {skill.tags.map((tag) => (
            <TagChip key={tag} label={tag} />
          ))}
        </div>

        {/* External link */}
        <div className="pt-3 border-t border-white/[0.06]">
          <a
            href={skill.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-2 text-xs font-jetbrains font-medium',
              'text-amber-400 hover:text-amber-300 transition-colors duration-200',
            )}
          >
            访问项目
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Build-your-own Skill guide step ─────────────────────────────────────

interface GuideStep {
  step: string
  title: string
  description: string
  icon: React.ElementType
}

const guideSteps: GuideStep[] = [
  {
    step: 'Step 1',
    title: '明确 Skill 的目标',
    description:
      '确定你想要创建的 Skill 解决什么问题、面向哪些用户。清晰的定位是成功的起点。参考 Anthropic Skill 模板定义输入输出规范。',
    icon: Search,
  },
  {
    step: 'Step 2',
    title: '编写系统提示词 (System Prompt)',
    description:
      '使用 Claude 的控制台或 API 编写详细的系统提示词，明确 Skill 的角色、能力边界、输出格式和禁忌事项。善用 few-shot 示例提升准确性。',
    icon: Pencil,
  },
  {
    step: 'Step 3',
    title: '测试与迭代优化',
    description:
      '在实际场景中反复测试 Skill 的表现，收集反馈进行迭代。关注边缘情况处理和输出一致性，必要时添加工具调用 (Tool Use) 扩展能力。',
    icon: Wand2,
  },
]

// ── Page ─────────────────────────────────────────────────────────────────

const ClaudeSkillsPage = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = `Claude Skills | ${SITE_NAME}`
  }, [])

  return (
    <div className="space-y-12 pb-16">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* Hero Banner                                                      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-2xl">
        {/* Background decorative elements */}
        <div className="pointer-events-none absolute -top-40 -right-32 w-80 h-80 rounded-full bg-amber-500/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-0 w-72 h-72 rounded-full bg-orange-600/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute top-20 left-1/3 w-48 h-48 rounded-full bg-amber-400/[0.04] blur-2xl" />

        <div
          className={cn(
            'relative z-10 bg-white/[0.02] backdrop-blur-2xl border border-white/[0.06] rounded-2xl',
            'px-6 py-12 sm:px-10 sm:py-16 md:px-14 md:py-20',
          )}
        >
          <div className="max-w-3xl">
            {/* Icon badge */}
            <div
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6',
                'bg-amber-400/10 border border-amber-400/20',
              )}
            >
              <Wand2 className="h-4 w-4 text-amber-400" strokeWidth={1.8} />
              <span className="text-xs font-jetbrains font-medium text-amber-300 tracking-wide uppercase">
                Anthropic Claude Skills
              </span>
            </div>

            {/* Title with amber gradient */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-sora font-bold tracking-tight mb-6 leading-tight">
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                Claude Skills
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
              Claude Skills 是 Anthropic 推出的可复用 AI 能力模块。通过精心设计的系统提示词和工具链，
              Claude 能够胜任从代码审查、文档写作到数据分析的各种专业任务。
              每个 Skill 都是一个独立的能力单元，可组合使用，也可自定义扩展。
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                  <Wand2 className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-lg font-sora font-bold text-white">50+</div>
                  <div className="text-[11px] text-slate-500 font-jetbrains">官方 Skills</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-lg font-sora font-bold text-white">200+</div>
                  <div className="text-[11px] text-slate-500 font-jetbrains">社区 Skills</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                  <Star className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-lg font-sora font-bold text-white">15k+</div>
                  <div className="text-[11px] text-slate-500 font-jetbrains">GitHub Stars</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 官方推荐 Skills — Horizontal Scroll                             */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section>
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-sora font-bold text-white mb-1">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                官方推荐 Skills
              </span>
            </h2>
            <p className="text-sm text-slate-500 font-jetbrains">
              由 Anthropic 官方维护和推荐的 Claude Skills，开箱即用
            </p>
          </div>
          <a
            href="https://docs.anthropic.com/en/docs/build-with-claude"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl',
              'text-sm font-jetbrains font-medium text-amber-400',
              'bg-amber-400/8 border border-amber-400/15',
              'hover:bg-amber-400/15 hover:border-amber-400/25 transition-colors duration-200',
            )}
          >
            <BookOpen className="h-4 w-4" />
            Anthropic 文档
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Horizontal scrollable container */}
        <div className="relative">
          {/* Left fade gradient */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-slate-950 to-transparent" />
          {/* Right fade gradient */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-slate-950 to-transparent" />

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2"
            style={{
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {officialSkills.map((skill) => (
              <div key={skill.name} style={{ scrollSnapAlign: 'start' }}>
                <HorizontalSkillCard skill={skill} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile doc link */}
        <div className="mt-4 sm:hidden">
          <a
            href="https://docs.anthropic.com/en/docs/build-with-claude"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-xl w-full justify-center',
              'text-sm font-jetbrains font-medium text-amber-400',
              'bg-amber-400/8 border border-amber-400/15',
            )}
          >
            <BookOpen className="h-4 w-4" />
            Anthropic 文档
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 社区热门 Skills — 3-column Grid                                 */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section>
        {/* Section header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-sora font-bold text-white mb-1">
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              社区热门 Skills
            </span>
          </h2>
          <p className="text-sm text-slate-500 font-jetbrains">
            社区开发者贡献的优质 Skills 项目，已在 GitHub 上获得广泛认可
          </p>
        </div>

        {/* 3-column grid (responsive: 1 on mobile, 2 on md, 3 on xl) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {communitySkills.map((skill) => (
            <GridSkillCard key={skill.name} skill={skill} />
          ))}
        </div>

        {/* GitHub CTA banner */}
        <div
          className={cn(
            'mt-6 p-6 rounded-2xl',
            'bg-gradient-to-r from-amber-400/[0.04] to-orange-600/[0.04]',
            'border border-amber-400/10',
            'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
              <Github className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-sora font-semibold text-white">
                探索更多社区 Skills
              </h3>
              <p className="text-xs text-slate-500 font-jetbrains">
                在 GitHub 上发现 Claude Skills 的完整生态，参与贡献或提交你的 Skill
              </p>
            </div>
          </div>
          <a
            href="https://github.com/anthropics"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl shrink-0',
              'text-sm font-jetbrains font-semibold text-white',
              'bg-gradient-to-r from-amber-500 to-orange-600',
              'hover:from-amber-400 hover:to-orange-500',
              'transition-all duration-300',
              'shadow-[0_4px_20px_rgba(217,119,6,0.25)]',
              'hover:shadow-[0_6px_30px_rgba(217,119,6,0.35)]',
            )}
          >
            浏览 GitHub
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 创建你的 Skill — Guide Card                                      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section>
        {/* Section header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-sora font-bold text-white mb-1">
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              创建你的 Skill
            </span>
          </h2>
          <p className="text-sm text-slate-500 font-jetbrains">
            按照以下步骤创建属于你自己的 Claude Skill，或查看 Anthropic 完整文档
          </p>
        </div>

        <div
          className={cn(
            'relative overflow-hidden rounded-2xl',
            'bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08]',
          )}
        >
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-20 -right-16 w-56 h-56 rounded-full bg-amber-500/[0.05] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-orange-600/[0.04] blur-3xl" />

          <div className="relative z-10 p-8 sm:p-10 md:p-12">
            {/* Steps grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {guideSteps.map((step, i) => (
                <div
                  key={step.step}
                  className={cn(
                    'relative p-6 rounded-xl',
                    'bg-white/[0.03] border border-white/[0.06]',
                    'transition-all duration-300',
                    'hover:bg-white/[0.05] hover:border-amber-400/15',
                  )}
                >
                  {/* Step number badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                        'bg-gradient-to-br from-amber-500 to-orange-600',
                        'shadow-[0_0_15px_rgba(217,119,6,0.25)]',
                      )}
                    >
                      <span className="text-xs font-jetbrains font-bold text-white">
                        {i + 1}
                      </span>
                    </div>
                    <step.icon className="h-5 w-5 text-amber-400" strokeWidth={1.8} />
                  </div>

                  <p className="text-[10px] font-jetbrains text-amber-400/60 uppercase tracking-wider mb-1">
                    {step.step}
                  </p>
                  <h3 className="text-base font-sora font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400/80 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom CTA: external link to Anthropic docs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
              <div>
                <h3 className="text-base font-sora font-semibold text-white mb-1">
                  准备开始了吗？
                </h3>
                <p className="text-sm text-slate-500 font-jetbrains">
                  查看 Anthropic 官方文档，获取完整的 Skill 开发指南和最佳实践
                </p>
              </div>
              <a
                href="https://docs.anthropic.com/en/docs/build-with-claude"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-2 px-6 py-3 rounded-xl shrink-0',
                  'text-sm font-jetbrains font-semibold text-white',
                  'bg-gradient-to-r from-amber-500 to-orange-600',
                  'hover:from-amber-400 hover:to-orange-500',
                  'transition-all duration-300',
                  'shadow-[0_4px_20px_rgba(217,119,6,0.25)]',
                  'hover:shadow-[0_6px_30px_rgba(217,119,6,0.35)]',
                )}
              >
                <BookOpen className="h-4 w-4" />
                查看完整文档
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* Bottom ambient flair                                            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
        <div className="flex items-center gap-2 text-xs text-slate-600 font-jetbrains">
          <Wand2 className="h-3.5 w-3.5 text-amber-400/40" />
          数据来源: Anthropic 官方文档 & GitHub 社区
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
      </div>
    </div>
  )
}

export default ClaudeSkillsPage
