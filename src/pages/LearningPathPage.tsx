import { useState, useEffect, useRef } from 'react'
import { BookOpen, CheckCircle2, Circle, ExternalLink, ArrowRight, Clock, Target, GraduationCap, Sprout, Zap, Rocket } from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import { cn } from '@/utils/cn'
import Card from '@/components/ui/Card'

// ── Types ──────────────────────────────────────────────────────────

type TrackId = 'beginner' | 'intermediate' | 'advanced'

interface LearningStep {
  id: string
  title: string
  description: string
  duration: string
  resources?: { label: string; url: string }[]
  completed?: boolean
}

interface Track {
  id: TrackId
  title: string
  subtitle: string
  icon: React.ElementType
  description: string
  gradient: string
  glowColor: string
  steps: LearningStep[]
}

// ── Learning path data ─────────────────────────────────────────────

const tracks: Track[] = [
  {
    id: 'beginner',
    title: 'AI 基础入门',
    subtitle: '适合零基础学习者',
    icon: Sprout,
    description: '从零开始系统学习 AI 基础概念、核心技术和主流工具，建立完整的 AI 知识图谱。',
    gradient: 'from-emerald-400 to-cyan-400',
    glowColor: 'shadow-emerald-400/20',
    steps: [
      {
        id: 'b1',
        title: 'AI 概念与历史',
        description: '了解人工智能的定义、发展历程（从图灵测试到 GPT）、主要分支（ML/DL/NLP/CV）和基本术语。',
        duration: '2-3小时',
        resources: [
          { label: '吴恩达《人工智能入门》课程', url: 'https://www.coursera.org/learn/ai-for-everyone' },
          { label: '图解 AI 发展简史（知乎）', url: 'https://www.zhihu.com/column/aibook' },
        ],
        completed: true,
      },
      {
        id: 'b2',
        title: '机器学习基础',
        description: '学习监督学习、无监督学习和强化学习的核心概念，理解训练集/验证集/测试集、损失函数和过拟合。',
        duration: '4-5小时',
        resources: [
          { label: '吴恩达《机器学习》课程（Coursera）', url: 'https://www.coursera.org/specializations/machine-learning-introduction' },
          { label: '《动手学深度学习》在线书', url: 'https://zh.d2l.ai' },
        ],
        completed: true,
      },
      {
        id: 'b3',
        title: '深度学习初探',
        description: '理解神经网络的基本原理、反向传播算法、激活函数和常见架构（CNN/RNN/Transformer）。',
        duration: '5-6小时',
        resources: [
          { label: '3Blue1Brown 神经网络可视化', url: 'https://www.3blue1brown.com/topics/neural-networks' },
          { label: 'fast.ai 深度学习实战课程', url: 'https://course.fast.ai' },
        ],
        completed: true,
      },
      {
        id: 'b4',
        title: '大语言模型 (LLM) 入门',
        description: '了解 GPT 系列演进、Transformer 架构精髓、预训练与微调范式，认识主流 LLM 的能力与局限。',
        duration: '3-4小时',
        resources: [
          { label: 'Andrej Karpathy《Intro to LLMs》视频', url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g' },
          { label: '《Attention Is All You Need》论文解读', url: 'https://arxiv.org/abs/1706.03762' },
        ],
        completed: true,
      },
      {
        id: 'b5',
        title: 'Prompt Engineering 基础',
        description: '掌握提示词设计原则：角色设定、上下文注入、链式推理 (CoT)、少样本学习、格式化输出。',
        duration: '3-4小时',
        resources: [
          { label: 'OpenAI Prompt Engineering Guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
          { label: 'Anthropic Prompt Library', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering' },
        ],
        completed: false,
      },
      {
        id: 'b6',
        title: 'AI 工具实践',
        description: '熟练使用 ChatGPT、Claude、Gemini 等 AI 对话工具，掌握文件分析、联网搜索、图像生成等进阶用法。',
        duration: '4-5小时',
        resources: [
          { label: 'ChatGPT 官方使用指南', url: 'https://help.openai.com' },
          { label: 'jiayouvibe AI 大模型页面', url: '#/models' },
        ],
        completed: false,
      },
      {
        id: 'b7',
        title: 'AI 项目实战：个人知识助手',
        description: '综合运用所学，基于 RAG 技术构建一个本地化的个人知识问答助手，完成从概念到部署的完整流程。',
        duration: '6-8小时',
        resources: [
          { label: 'LangChain RAG 教程', url: 'https://python.langchain.com/docs/tutorials/rag/' },
          { label: 'Dify 快速搭建 RAG 应用', url: 'https://dify.ai' },
        ],
        completed: false,
      },
    ],
  },
  {
    id: 'intermediate',
    title: 'AI 应用开发',
    subtitle: '适合有编程基础的开发者',
    icon: Zap,
    description: '掌握 AI 应用开发的完整技术栈，包括 API 调用、RAG 构建、Agent 开发和模型微调，成为 AI 应用工程师。',
    gradient: 'from-cyan-400 to-blue-500',
    glowColor: 'shadow-cyan-400/20',
    steps: [
      {
        id: 'i1',
        title: 'LLM API 调用与集成',
        description: '掌握 OpenAI Compatible API 调用，处理流式输出、Tool Calling、JSON Mode、多轮对话和错误重试。',
        duration: '3-4小时',
        resources: [
          { label: 'OpenAI API 文档', url: 'https://platform.openai.com/docs/api-reference' },
          { label: 'Anthropic API 文档', url: 'https://docs.anthropic.com/en/api' },
        ],
        completed: true,
      },
      {
        id: 'i2',
        title: 'RAG 检索增强生成',
        description: '深入理解 RAG 架构：文档加载→文本切分→向量嵌入→相似检索→上下文增强→LLM 生成。掌握 Chunking 策略和检索优化。',
        duration: '5-6小时',
        resources: [
          { label: 'LangChain RAG 教程', url: 'https://python.langchain.com/docs/tutorials/rag/' },
          { label: 'LlamaIndex 文档', url: 'https://docs.llamaindex.ai' },
        ],
        completed: true,
      },
      {
        id: 'i3',
        title: '向量数据库实战',
        description: '对比和使用主流向量数据库（Chroma/Pinecone/Qdrant/Milvus），理解索引算法、混合检索和性能优化。',
        duration: '4-5小时',
        resources: [
          { label: 'Chroma 入门指南', url: 'https://docs.trychroma.com' },
          { label: 'Pinecone 官方文档', url: 'https://docs.pinecone.io' },
        ],
        completed: false,
      },
      {
        id: 'i4',
        title: 'AI Agent 开发',
        description: '掌握 Agent 核心架构（感知-规划-行动）、工具定义与调用、多 Agent 协作模式，使用 LangGraph/CrewAI 构建智能体。',
        duration: '6-8小时',
        resources: [
          { label: 'LangGraph 官方教程', url: 'https://langchain-ai.github.io/langgraph/tutorials/' },
          { label: 'CrewAI 文档', url: 'https://docs.crewai.com' },
          { label: 'jiayouvibe AI 智能体页面', url: '#/agents' },
        ],
        completed: false,
      },
      {
        id: 'i5',
        title: '模型微调与部署',
        description: '学习 LoRA/QLoRA 高效微调方法，使用 HuggingFace Transformers 进行模型训练、量化和本地部署。',
        duration: '8-10小时',
        resources: [
          { label: 'HuggingFace PEFT 文档', url: 'https://huggingface.co/docs/peft' },
          { label: 'Unsloth 微调教程', url: 'https://docs.unsloth.ai' },
          { label: 'Ollama 本地部署指南', url: 'https://ollama.ai' },
        ],
        completed: false,
      },
      {
        id: 'i6',
        title: 'AI UI/UX 设计模式',
        description: '学习 AI 产品的交互设计原则：流式 UI、可解释性展示、错误恢复、人机协作界面设计和反馈循环。',
        duration: '3-4小时',
        resources: [
          { label: 'v0 by Vercel', url: 'https://v0.dev' },
          { label: 'Cursor AI IDE', url: 'https://cursor.com' },
        ],
        completed: false,
      },
      {
        id: 'i7',
        title: '全栈 AI 应用项目',
        description: '从零构建一个全栈 AI 应用（如 AI 客服系统/智能文档分析/代码审查助手），包含前端、后端、数据库和部署。',
        duration: '12-16小时',
        resources: [
          { label: 'Vercel AI SDK', url: 'https://sdk.vercel.ai' },
          { label: 'Dify 开源平台', url: 'https://github.com/langgenius/dify' },
        ],
        completed: false,
      },
    ],
  },
  {
    id: 'advanced',
    title: 'AI 研究前沿',
    subtitle: '适合希望深入研究的开发者',
    icon: Rocket,
    description: '深入 AI 研究前沿，包括模型架构创新、RLHF 对齐、多模态融合、AI 安全和开源 LLM 生态等高级主题。',
    gradient: 'from-purple-500 to-pink-500',
    glowColor: 'shadow-purple-500/20',
    steps: [
      {
        id: 'a1',
        title: 'Transformer 架构深入',
        description: '深入理解 Attention 机制变体（MHA/MQA/GQA/MLA）、位置编码演进（绝对→相对→RoPE→ALiBi）、归一化位置和 MoE 路由算法。',
        duration: '6-8小时',
        resources: [
          { label: '《Attention Is All You Need》论文', url: 'https://arxiv.org/abs/1706.03762' },
          { label: 'The Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/' },
          { label: 'DeepSeek V3 技术报告', url: 'https://arxiv.org/abs/2412.19437' },
        ],
        completed: false,
      },
      {
        id: 'a2',
        title: 'RLHF 与对齐技术',
        description: '学习人类反馈强化学习 (RLHF)、DPO/ORPO 等技术，理解 Constitutional AI、Red-Teaming 和 Safety Evaluation。',
        duration: '6-8小时',
        resources: [
          { label: 'Anthropic Constitutional AI 论文', url: 'https://arxiv.org/abs/2212.08073' },
          { label: 'OpenAI InstructGPT 论文', url: 'https://arxiv.org/abs/2203.02155' },
          { label: 'HuggingFace TRL 库', url: 'https://huggingface.co/docs/trl' },
        ],
        completed: false,
      },
      {
        id: 'a3',
        title: '多模态 AI 架构',
        description: '理解视觉-语言模型（CLIP/BLIP/GPT-4V）、文生图/视频扩散模型、DiT 架构和多模态统一表征学习。',
        duration: '8-10小时',
        resources: [
          { label: 'CLIP 论文', url: 'https://arxiv.org/abs/2103.00020' },
          { label: 'Stable Diffusion 技术文档', url: 'https://huggingface.co/docs/diffusers' },
          { label: 'Sora 技术报告', url: 'https://openai.com/research/video-generation-models-as-world-simulators' },
        ],
        completed: false,
      },
      {
        id: 'a4',
        title: '推理优化与推理时计算',
        description: '掌握推理优化技术：量化(GPTQ/AWQ)、KV Cache、Speculative Decoding 和推理时拓展（CoT/ToT/o1 范式）。',
        duration: '6-8小时',
        resources: [
          { label: 'vLLM 项目', url: 'https://github.com/vllm-project/vllm' },
          { label: 'DeepSeek R1 技术报告', url: 'https://arxiv.org/abs/2501.12948' },
          { label: 'OpenAI o1 系统卡', url: 'https://openai.com/index/learning-to-reason-with-llms/' },
        ],
        completed: false,
      },
      {
        id: 'a5',
        title: 'AI 安全与治理',
        description: '了解对抗攻击/防御、越狱与防护、幻觉缓解、红队测试方法、AI 治理和全球监管框架（EU AI Act 等）。',
        duration: '4-5小时',
        resources: [
          { label: 'Anthropic Safety Research', url: 'https://www.anthropic.com/research' },
          { label: 'OWASP Top 10 for LLM', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/' },
          { label: 'EU AI Act 解读', url: 'https://artificialintelligenceact.eu' },
        ],
        completed: false,
      },
      {
        id: 'a6',
        title: '开源 LLM 生态与训练',
        description: '深入了解 LLaMA/Qwen/DeepSeek 等开源模型家族，掌握分布式训练技术、数据管道设计和评估基准。',
        duration: '8-10小时',
        resources: [
          { label: 'LLaMA 4 技术报告', url: 'https://ai.meta.com/blog/llama-4/' },
          { label: 'DeepSeek V3 技术报告', url: 'https://arxiv.org/abs/2412.19437' },
          { label: 'HuggingFace Alignment Handbook', url: 'https://github.com/huggingface/alignment-handbook' },
        ],
        completed: false,
      },
      {
        id: 'a7',
        title: 'AI 研究项目',
        description: '独立完成一个 AI 研究方向的深入探索（如训练小型语言模型/实现论文方法/构建评估基准），产出研究报告或开源贡献。',
        duration: '20-30小时',
        resources: [
          { label: 'Papers With Code', url: 'https://paperswithcode.com' },
          { label: 'arXiv AI 板块', url: 'https://arxiv.org/list/cs.AI/recent' },
          { label: 'jiayouvibe GitHub Trending', url: '#/trending' },
        ],
        completed: false,
      },
    ],
  },
]

// ── Track Tab Component ────────────────────────────────────────────

function TrackTabs({
  tracks,
  activeId,
  onSelect,
}: {
  tracks: Track[]
  activeId: TrackId
  onSelect: (id: TrackId) => void
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {tracks.map((track) => {
        const isActive = track.id === activeId
        const completedCount = track.steps.filter((s) => s.completed).length
        const totalCount = track.steps.length
        const progressPct = Math.round((completedCount / totalCount) * 100)

        return (
          <button
            key={track.id}
            onClick={() => onSelect(track.id)}
            role="tab"
            aria-selected={isActive}
            className={cn(
              'group relative flex-1 p-4 rounded-2xl text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
              'bg-white/[0.03] backdrop-blur-sm border',
              isActive
                ? 'border-cyan-400/40 bg-white/[0.06] shadow-lg shadow-cyan-400/10'
                : 'border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12]',
            )}
          >
            {/* Active glow */}
            {isActive && (
              <div
                className={cn(
                  'absolute inset-0 rounded-2xl opacity-100 pointer-events-none',
                  'bg-gradient-to-br from-cyan-500/[0.05] to-purple-500/[0.05]',
                )}
              />
            )}

            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-2">
                <track.icon className="h-5 w-5" />
                <h3
                  className={cn(
                    'text-sm font-sora font-semibold truncate',
                    isActive ? 'text-cyan-200' : 'text-[var(--color-text-primary)] group-hover:text-cyan-300',
                  )}
                >
                  {track.title}
                </h3>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">{track.subtitle}</p>

              {/* Mini progress bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-700 ease-out',
                      isActive
                        ? `bg-gradient-to-r ${track.gradient}`
                        : 'bg-white/[0.15]',
                    )}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-jetbrains text-[var(--color-text-muted)] tabular-nums">
                  {completedCount}/{totalCount}
                </span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ── Timeline Step Component ────────────────────────────────────────

function TimelineStep({
  step,
  index,
  trackGradient,
}: {
  step: LearningStep
  index: number
  trackGradient: string
}) {
  const stepRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = stepRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={stepRef}
      className={cn(
        'relative pl-12 pb-10 last:pb-0',
        'opacity-0 translate-y-6 transition-all duration-700 ease-out',
        isVisible && 'opacity-100 translate-y-0',
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Vertical timeline line */}
      <div className="absolute left-[14px] top-2 bottom-0 w-px bg-gradient-to-b from-cyan-400/30 via-white/[0.06] to-transparent" />

      {/* Step node (circle) */}
      <div className="absolute left-0 top-0">
        {step.completed ? (
          <div
            className={cn(
              'w-[30px] h-[30px] rounded-full flex items-center justify-center',
              'bg-gradient-to-br from-emerald-400 to-cyan-400',
              'shadow-lg shadow-emerald-400/30',
            )}
          >
            <CheckCircle2 className="h-4 w-4 text-slate-950" />
          </div>
        ) : (
          <div
            className={cn(
              'w-[30px] h-[30px] rounded-full flex items-center justify-center',
              'bg-white/[0.06] border border-white/[0.12]',
              'transition-all duration-300 group-hover:border-cyan-400/40',
            )}
          >
            <div
              className={cn(
                'w-2.5 h-2.5 rounded-full',
                `bg-gradient-to-br ${trackGradient}`,
              )}
            />
          </div>
        )}
      </div>

      {/* Content card */}
      <div
        className={cn(
          'bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-4 sm:p-5',
          'transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.12]',
          'hover:shadow-lg hover:shadow-cyan-400/[0.06]',
          step.completed && 'border-emerald-400/[0.12]',
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2.5">
          <h4
            className={cn(
              'text-base font-sora font-semibold',
              step.completed ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-primary)]',
            )}
          >
            {step.title}
          </h4>
          <div className="flex items-center gap-3">
            {/* Duration */}
            <span className="inline-flex items-center gap-1 text-[11px] font-jetbrains text-[var(--color-text-muted)]">
              <Clock className="h-3 w-3" />
              {step.duration}
            </span>
            {/* Status */}
            {step.completed ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-jetbrains text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                已完成
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-jetbrains text-cyan-400/60">
                <Circle className="h-3 w-3" />
                待学习
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
          {step.description}
        </p>

        {/* Resources */}
        {step.resources && step.resources.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-jetbrains">
              推荐资源
            </p>
            <div className="flex flex-wrap gap-1.5">
              {step.resources.map((res, ri) => (
                <a
                  key={ri}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-jetbrains',
                    'bg-cyan-400/[0.06] border border-cyan-400/[0.12] text-cyan-300',
                    'hover:bg-cyan-400/[0.12] hover:border-cyan-400/30 hover:text-cyan-200',
                    'transition-colors',
                  )}
                >
                  <ExternalLink className="h-2.5 w-2.5" />
                  {res.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────

const LearningPathPage = () => {
  useEffect(() => {
    document.title = `学习路径 | ${SITE_NAME}`
  }, [])

  const [activeTrackId, setActiveTrackId] = useState<TrackId>('beginner')
  const activeTrack = tracks.find((t) => t.id === activeTrackId)!

  const completedCount = activeTrack.steps.filter((s) => s.completed).length
  const totalCount = activeTrack.steps.length
  const progressPct = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-sora font-bold text-[var(--color-text-primary)] mb-2">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI 学习路径
          </span>
        </h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl">
          从入门到精通的结构化 AI 学习路线图，每个阶段都包含关键知识点、实践项目和精选资源，帮助你系统地建立 AI 技术能力。
        </p>
      </div>

      {/* Track Tabs */}
      <TrackTabs tracks={tracks} activeId={activeTrackId} onSelect={setActiveTrackId} />

      {/* Active Track Overview */}
      <Card className="p-6 relative overflow-hidden">
        <div
          className={cn(
            'absolute inset-0 opacity-[0.06] pointer-events-none',
            `bg-gradient-to-br ${activeTrack.gradient}`,
          )}
        />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl',
                  `bg-gradient-to-br ${activeTrack.gradient}`,
                  activeTrack.glowColor,
                )}
              >
                <activeTrack.icon className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl font-sora font-bold text-[var(--color-text-primary)]">{activeTrack.title}</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1 max-w-lg">{activeTrack.description}</p>
              </div>
            </div>

            {/* Progress circle */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="27"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-white/[0.06]"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="27"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(progressPct / 100) * 170} 170`}
                    className={cn(
                      'text-cyan-400 transition-all duration-1000 ease-out',
                    )}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base font-sora font-bold text-[var(--color-text-primary)] leading-none">
                    {progressPct}%
                  </span>
                  <span className="text-[9px] text-[var(--color-text-muted)] font-jetbrains leading-tight mt-0.5">
                    完成
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-sora font-bold text-[var(--color-text-primary)] tabular-nums">
                  {completedCount}<span className="text-[var(--color-text-muted)] text-base">/{totalCount}</span>
                </p>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-jetbrains">steps completed</p>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <Target className="h-4 w-4 text-cyan-400" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-jetbrains">总步骤</p>
                <p className="text-sm font-sora font-semibold text-[var(--color-text-primary)]">{totalCount} 步</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <Clock className="h-4 w-4 text-amber-400" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-jetbrains">预计总时长</p>
                <p className="text-sm font-sora font-semibold text-[var(--color-text-primary)]">
                  ~{activeTrack.steps.reduce(
                    (acc, s) => {
                      const match = s.duration.match(/\d+/)
                      if (!match) return acc
                      const nums = s.duration.split('-').map(Number)
                      return acc + (nums.length === 2 ? (nums[0] + nums[1]) / 2 : nums[0])
                    }, 0
                  ).toFixed(0)} 小时
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <GraduationCap className="h-4 w-4 text-purple-400" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-jetbrains">难度等级</p>
                <p className="text-sm font-sora font-semibold text-[var(--color-text-primary)]">
                  {activeTrack.id === 'beginner' ? '入门' : activeTrack.id === 'intermediate' ? '进阶' : '高级'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-4 w-4 text-cyan-400" />
          <h3 className="text-lg font-sora font-semibold text-[var(--color-text-primary)]">学习步骤</h3>
        </div>

        <div className="relative">
          {activeTrack.steps.map((step, idx) => (
            <TimelineStep
              key={step.id}
              step={step}
              index={idx}
              trackGradient={activeTrack.gradient}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className={cn(
          'rounded-2xl p-6 border text-center',
          'bg-white/[0.02] backdrop-blur-sm border-white/[0.08]',
        )}
      >
        <p className="text-[var(--color-text-primary)] mb-3">
          准备好了吗？选择一条路径开始你的 AI 学习之旅。
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => setActiveTrackId(track.id)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                track.id === activeTrackId
                  ? `bg-gradient-to-r ${track.gradient} text-white shadow-lg`
                  : 'bg-white/[0.04] border border-white/[0.08] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-white/20',
              )}
            >
              <track.icon className="h-4 w-4" />
              {track.title}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LearningPathPage
