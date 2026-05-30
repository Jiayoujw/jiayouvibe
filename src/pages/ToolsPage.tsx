import { useState, useMemo, useEffect } from 'react'
import { Search, ExternalLink, Sparkles, SlidersHorizontal, GitFork, Globe } from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import { cn } from '@/utils/cn'
import Input from '@/components/ui/Input'
import EmptyState from '@/components/ui/EmptyState'

// ── Types ──────────────────────────────────────────────────────────

type ToolCategory =
  | 'LLM Playground'
  | 'Code Assistants'
  | 'Image Generation'
  | 'Video Generation'
  | 'Audio'
  | 'Agents'
  | 'Embeddings'
  | 'Vector DBs'

type PricingTier = 'Free' | 'Paid' | 'Freemium'

interface ToolEntry {
  name: string
  description: string
  category: ToolCategory
  pricing: PricingTier
  openSource: boolean
  tags: string[]
  website: string
  github?: string
}

// ── Category config ────────────────────────────────────────────────

const CATEGORY_COLORS: Record<ToolCategory, { bg: string; text: string; border: string }> = {
  'LLM Playground': {
    bg: 'bg-cyan-400/15',
    text: 'text-cyan-300',
    border: 'border-cyan-400/30',
  },
  'Code Assistants': {
    bg: 'bg-purple-500/15',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
  },
  'Image Generation': {
    bg: 'bg-pink-500/15',
    text: 'text-pink-300',
    border: 'border-pink-500/30',
  },
  'Video Generation': {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
  },
  Audio: {
    bg: 'bg-emerald-400/15',
    text: 'text-emerald-300',
    border: 'border-emerald-400/30',
  },
  Agents: {
    bg: 'bg-blue-400/15',
    text: 'text-blue-300',
    border: 'border-blue-400/30',
  },
  Embeddings: {
    bg: 'bg-indigo-400/15',
    text: 'text-indigo-300',
    border: 'border-indigo-400/30',
  },
  'Vector DBs': {
    bg: 'bg-orange-400/15',
    text: 'text-orange-300',
    border: 'border-orange-400/30',
  },
}

const PRICING_COLORS: Record<PricingTier, { bg: string; text: string }> = {
  Free: { bg: 'bg-emerald-400/10', text: 'text-emerald-300' },
  Paid: { bg: 'bg-amber-500/10', text: 'text-amber-300' },
  Freemium: { bg: 'bg-blue-400/10', text: 'text-blue-300' },
}

const CATEGORIES: ToolCategory[] = [
  'LLM Playground',
  'Code Assistants',
  'Image Generation',
  'Video Generation',
  'Audio',
  'Agents',
  'Embeddings',
  'Vector DBs',
]

const PRICING_OPTIONS: PricingTier[] = ['Free', 'Paid', 'Freemium']

// ── Tools data ─────────────────────────────────────────────────────

const tools: ToolEntry[] = [
  // ── LLM Playground ──
  {
    name: 'ChatGPT',
    description: 'OpenAI 旗舰对话平台，支持多模态交互、插件系统、代码解释器和自定义 GPTs，全球用户最多的 AI 助手。',
    category: 'LLM Playground',
    pricing: 'Freemium',
    openSource: false,
    tags: ['OpenAI', 'Chat', '多模态', 'GPTs'],
    website: 'https://chat.openai.com',
  },
  {
    name: 'Claude.ai',
    description: 'Anthropic 推出的对话式 AI 助手，以安全性、深度推理和超长上下文著称，适合分析和创作类任务。',
    category: 'LLM Playground',
    pricing: 'Freemium',
    openSource: false,
    tags: ['Anthropic', 'Chat', '安全', '长上下文'],
    website: 'https://claude.ai',
  },
  {
    name: 'Gemini',
    description: 'Google DeepMind 打造的多模态 AI 平台，深度整合 Google 搜索和生态，支持文本、图像、视频、代码。',
    category: 'LLM Playground',
    pricing: 'Freemium',
    openSource: false,
    tags: ['Google', '多模态', '搜索', 'Chat'],
    website: 'https://gemini.google.com',
  },
  {
    name: 'Grok',
    description: 'xAI 开发的 AI 助手，深度整合 X 平台实时信息流，以幽默直率的交互风格著称。',
    category: 'LLM Playground',
    pricing: 'Freemium',
    openSource: false,
    tags: ['xAI', 'Chat', '实时', 'X平台'],
    website: 'https://x.ai',
  },
  {
    name: 'Poe',
    description: 'Quora 旗下多模型聚合平台，在一个界面中访问 GPT、Claude、Gemini 等多种模型，支持自定义 Bot。',
    category: 'LLM Playground',
    pricing: 'Freemium',
    openSource: false,
    tags: ['Quora', '聚合', '多模型', 'Bot'],
    website: 'https://poe.com',
  },
  {
    name: 'HuggingChat',
    description: 'HuggingFace 开源的 ChatGPT 替代，默认使用开源模型（LLaMA、Mistral 等），支持模型切换。',
    category: 'LLM Playground',
    pricing: 'Free',
    openSource: true,
    tags: ['HuggingFace', '开源', 'Chat', '多模型'],
    website: 'https://huggingface.co/chat',
    github: 'https://github.com/huggingface/chat-ui',
  },
  {
    name: 'Perplexity AI',
    description: 'AI 驱动的新一代搜索引擎，实时检索互联网并用 LLM 生成带引用的答案，学术和调研利器。',
    category: 'LLM Playground',
    pricing: 'Freemium',
    openSource: false,
    tags: ['搜索', '引用', '研究', '实时'],
    website: 'https://www.perplexity.ai',
  },
  {
    name: 'DeepSeek Chat',
    description: '深度求索推出的对话平台，以高性价比和深度推理能力著称，支持联网搜索和文件上传。',
    category: 'LLM Playground',
    pricing: 'Free',
    openSource: true,
    tags: ['DeepSeek', 'Chat', '推理', '中文'],
    website: 'https://chat.deepseek.com',
  },
  {
    name: 'Qwen Chat',
    description: '阿里通义千问官方对话平台，全面支持多模态和长文档处理，中文能力业界领先。',
    category: 'LLM Playground',
    pricing: 'Free',
    openSource: true,
    tags: ['阿里', 'Chat', '多模态', '中文'],
    website: 'https://tongyi.aliyun.com',
  },
  {
    name: 'Kimi Chat',
    description: '月之暗面推出的 AI 助手，以 200 万字超长上下文和多格式文件解析能力差异化竞争。',
    category: 'LLM Playground',
    pricing: 'Free',
    openSource: false,
    tags: ['Moonshot', '长上下文', '文件分析', '中文'],
    website: 'https://kimi.moonshot.cn',
  },

  // ── Code Assistants ──
  {
    name: 'Cursor',
    description: '革命性 AI IDE，基于 VS Code 深度重构，支持 Composer 全文件编辑、自然语言编程和多模型切换。',
    category: 'Code Assistants',
    pricing: 'Freemium',
    openSource: false,
    tags: ['IDE', 'VS Code', 'Composer', '多文件编辑'],
    website: 'https://cursor.com',
  },
  {
    name: 'GitHub Copilot',
    description: 'GitHub 与 OpenAI 联合打造，全球使用最广的 AI 编程助手，深度集成 VS Code、JetBrains 等 IDE。',
    category: 'Code Assistants',
    pricing: 'Paid',
    openSource: false,
    tags: ['GitHub', 'OpenAI', '代码补全', 'Chat'],
    website: 'https://github.com/features/copilot',
  },
  {
    name: 'Windsurf',
    description: 'Codeium 推出的 AI IDE，Cascade 流式多文件编辑和开放模型选择是其核心竞争力。',
    category: 'Code Assistants',
    pricing: 'Freemium',
    openSource: false,
    tags: ['IDE', 'Cascade', '多文件', '多模型'],
    website: 'https://codeium.com/windsurf',
    github: 'https://github.com/Exafunction/codeium',
  },
  {
    name: 'Cody',
    description: 'Sourcegraph 推出的 AI 编码助手，以全代码库上下文理解和跨文件编辑见长，深度整合 Sourcegraph。',
    category: 'Code Assistants',
    pricing: 'Freemium',
    openSource: true,
    tags: ['Sourcegraph', '上下文', '全代码库', 'VS Code'],
    website: 'https://sourcegraph.com/cody',
    github: 'https://github.com/sourcegraph/cody',
  },
  {
    name: 'Tabnine',
    description: '老牌 AI 代码补全工具，支持企业私有化部署和多种 IDE，注重代码隐私和合规。',
    category: 'Code Assistants',
    pricing: 'Freemium',
    openSource: false,
    tags: ['代码补全', '私有部署', '企业', '合规'],
    website: 'https://www.tabnine.com',
  },
  {
    name: 'Claude Code',
    description: 'Anthropic 官方推出的命令行 AI 编程助手，深度集成终端和代码库，支持探索性编程和智能体任务。',
    category: 'Code Assistants',
    pricing: 'Paid',
    openSource: false,
    tags: ['Anthropic', 'CLI', '终端', 'Agent'],
    website: 'https://docs.anthropic.com/en/docs/claude-code',
  },
  {
    name: 'v0 by Vercel',
    description: 'Vercel 推出的 AI 前端代码生成工具，自然语言描述 UI 需求即可生成 React/Tailwind 组件代码。',
    category: 'Code Assistants',
    pricing: 'Freemium',
    openSource: false,
    tags: ['Vercel', 'React', 'Tailwind', 'UI生成'],
    website: 'https://v0.dev',
  },
  {
    name: 'Bolt.new',
    description: 'StackBlitz 推出的全栈 AI 应用生成器，浏览器中即时搭建、编辑和部署全栈 Web 应用。',
    category: 'Code Assistants',
    pricing: 'Freemium',
    openSource: false,
    tags: ['StackBlitz', '全栈', '即时部署', 'WebAssembly'],
    website: 'https://bolt.new',
  },

  // ── Image Generation ──
  {
    name: 'Midjourney',
    description: '全球最受欢迎的 AI 图像生成平台，以极致的艺术品质和独特美学风格著称，V7 版本增加角色一致性。',
    category: 'Image Generation',
    pricing: 'Paid',
    openSource: false,
    tags: ['扩散模型', '艺术', '设计', 'Discord'],
    website: 'https://www.midjourney.com',
  },
  {
    name: 'DALL-E 3',
    description: 'OpenAI 旗舰文生图模型，文本遵循度业界领先，深度集成 ChatGPT，支持多分辨率和图像迭代。',
    category: 'Image Generation',
    pricing: 'Paid',
    openSource: false,
    tags: ['OpenAI', '扩散模型', 'ChatGPT', '创意'],
    website: 'https://openai.com/dall-e-3',
  },
  {
    name: 'Stable Diffusion',
    description: '最流行的开源文生图生态，支持本地部署、LoRA 微调和 ControlNet 控制，社区资源极其丰富。',
    category: 'Image Generation',
    pricing: 'Free',
    openSource: true,
    tags: ['Stability AI', '开源', 'LoRA', '本地部署'],
    website: 'https://stability.ai',
    github: 'https://github.com/Stability-AI/stablediffusion',
  },
  {
    name: 'Leonardo AI',
    description: '面向游戏和创意设计的 AI 图像平台，提供角色一致性、模型训练和实时画布等专业功能。',
    category: 'Image Generation',
    pricing: 'Freemium',
    openSource: false,
    tags: ['游戏', '角色一致性', '模型训练', '画布'],
    website: 'https://leonardo.ai',
  },
  {
    name: 'Adobe Firefly',
    description: 'Adobe 推出的商用级 AI 图像工具，深度整合 Photoshop、Illustrator 等创意套件，安全合规。',
    category: 'Image Generation',
    pricing: 'Freemium',
    openSource: false,
    tags: ['Adobe', '商用', 'PS整合', '合规'],
    website: 'https://www.adobe.com/products/firefly.html',
  },
  {
    name: 'ComfyUI',
    description: '节点式 AI 图像生成工作流编辑器，可视化编排 Stable Diffusion 管线，自定义能力极强。',
    category: 'Image Generation',
    pricing: 'Free',
    openSource: true,
    tags: ['工作流', '节点编辑', 'Stable Diffusion', '开源'],
    website: 'https://www.comfy.org',
    github: 'https://github.com/comfyanonymous/ComfyUI',
  },

  // ── Video Generation ──
  {
    name: 'Sora',
    description: 'OpenAI 旗舰级文生视频模型，生成高质量视频并展现对物理世界的惊人理解，AI 视频的里程碑。',
    category: 'Video Generation',
    pricing: 'Paid',
    openSource: false,
    tags: ['OpenAI', '物理模拟', '文生视频', 'DiT'],
    website: 'https://sora.com',
  },
  {
    name: 'Runway',
    description: '专业 AI 视频创作平台，提供 Gen-3 Alpha 模型、视频编辑、绿幕和运动笔刷等全套工具链。',
    category: 'Video Generation',
    pricing: 'Freemium',
    openSource: false,
    tags: ['Gen-3', '视频编辑', '绿幕', '运动笔刷'],
    website: 'https://runwayml.com',
  },
  {
    name: 'Pika',
    description: '轻量级 AI 视频生成平台，以简洁易用的交互和快速生成著称，支持 Lip Sync 等功能。',
    category: 'Video Generation',
    pricing: 'Freemium',
    openSource: false,
    tags: ['视频生成', 'Lip Sync', '简洁', '创意'],
    website: 'https://pika.art',
  },
  {
    name: 'KLING (可灵)',
    description: '快手推出的 AI 视频生成模型，在物理世界模拟和人像视频生成上表现突出，支持高分辨率。',
    category: 'Video Generation',
    pricing: 'Freemium',
    openSource: false,
    tags: ['快手', '物理模拟', '人像', '1080p'],
    website: 'https://kling.kuaishou.com',
  },
  {
    name: 'Luma Dream Machine',
    description: 'Luma AI 推出的 AI 3D 和视频生成平台，首创高质量文生 3D 模型和交互式视频生成体验。',
    category: 'Video Generation',
    pricing: 'Freemium',
    openSource: false,
    tags: ['Luma AI', '3D生成', '视频生成', '交互式'],
    website: 'https://lumalabs.ai/dream-machine',
  },
  {
    name: 'Hailuo AI',
    description: 'MiniMax 推出的 AI 视频生成工具，支持文生视频、图生视频，在人物表情和动作上表现自然。',
    category: 'Video Generation',
    pricing: 'Freemium',
    openSource: false,
    tags: ['MiniMax', '文生视频', '表情自然', '中文'],
    website: 'https://hailuoai.video',
  },

  // ── Audio ──
  {
    name: 'ElevenLabs',
    description: '行业领先的 AI 语音合成平台，支持声音克隆、多语言 TTS 和情感语音，音质自然逼真。',
    category: 'Audio',
    pricing: 'Freemium',
    openSource: false,
    tags: ['TTS', '声音克隆', '多语言', '情感'],
    website: 'https://elevenlabs.io',
  },
  {
    name: 'Suno',
    description: 'AI 音乐生成领域的领头羊，输入歌词或 Prompt 即可创作完整歌曲，V4 版本大幅提升音乐品质。',
    category: 'Audio',
    pricing: 'Freemium',
    openSource: false,
    tags: ['音乐生成', 'AI作曲', '歌词', 'V4'],
    website: 'https://suno.com',
  },
  {
    name: 'Udio',
    description: '由前 Google DeepMind 研究员创建的 AI 音乐平台，在音质和风格控制上有独特优势。',
    category: 'Audio',
    pricing: 'Freemium',
    openSource: false,
    tags: ['音乐生成', '风格控制', '高音质', 'DeepMind'],
    website: 'https://www.udio.com',
  },
  {
    name: 'Murf',
    description: '专业 AI 语音生成和编辑平台，面向视频创作者和企业培训，提供大量自然发音人。',
    category: 'Audio',
    pricing: 'Paid',
    openSource: false,
    tags: ['TTS', 'AI配音', '视频', '企业'],
    website: 'https://murf.ai',
  },
  {
    name: 'Descript',
    description: 'AI 驱动的全功能音视频编辑平台，文本编辑即可修改音视频，支持 AI 录音和 Studio Sound。',
    category: 'Audio',
    pricing: 'Freemium',
    openSource: false,
    tags: ['音频编辑', '视频编辑', 'AI录音', '播客'],
    website: 'https://www.descript.com',
  },
  {
    name: 'OpenAI Whisper',
    description: 'OpenAI 开源最强通用语音识别模型，支持近百种语言高精度转写和翻译，已嵌入无数产品。',
    category: 'Audio',
    pricing: 'Free',
    openSource: true,
    tags: ['OpenAI', 'ASR', '开源', '多语言'],
    website: 'https://openai.com/research/whisper',
    github: 'https://github.com/openai/whisper',
  },

  // ── Agents ──
  {
    name: 'AutoGPT',
    description: '开创性自主 AI 智能体，能分解目标、自主规划和执行多步骤任务，奠定了 AI Agent 范式。',
    category: 'Agents',
    pricing: 'Free',
    openSource: true,
    tags: ['自主Agent', '自动化', 'GPT', '里程碑'],
    website: 'https://agpt.co',
    github: 'https://github.com/Significant-Gravitas/AutoGPT',
  },
  {
    name: 'CrewAI',
    description: '当前最热门的 AI 多智能体协作框架，将 AI Agent 组织为团队协同完成复杂业务任务。',
    category: 'Agents',
    pricing: 'Free',
    openSource: true,
    tags: ['多Agent', '协作', 'Python', '企业'],
    website: 'https://www.crewai.com',
    github: 'https://github.com/crewAIInc/crewAI',
  },
  {
    name: 'LangGraph',
    description: 'LangChain 团队推出的有状态多步 Agent 编排框架，以图结构精确控制 Agent 执行流。',
    category: 'Agents',
    pricing: 'Freemium',
    openSource: true,
    tags: ['LangChain', '状态图', '编排', '多步'],
    website: 'https://www.langchain.com/langgraph',
    github: 'https://github.com/langchain-ai/langgraph',
  },
  {
    name: 'AutoGen',
    description: '微软推出的多 Agent 对话编程框架，支持 Agent 间的结构化对话模式和 Human-in-the-Loop。',
    category: 'Agents',
    pricing: 'Free',
    openSource: true,
    tags: ['微软', '多Agent', '对话', '.NET'],
    website: 'https://microsoft.github.io/autogen',
    github: 'https://github.com/microsoft/autogen',
  },
  {
    name: 'Devin',
    description: '全球首个 AI 软件工程师产品，能自主理解需求、编写代码、调试和部署，定价 $500/月。',
    category: 'Agents',
    pricing: 'Paid',
    openSource: false,
    tags: ['Cognition AI', 'AI工程师', 'SWE-bench', '自动化'],
    website: 'https://www.cognition.ai',
  },
  {
    name: 'MetaGPT',
    description: '模拟软件公司组织架构的多 Agent 框架，一行需求自动生成 PRD、架构设计等全套工程文档。',
    category: 'Agents',
    pricing: 'Free',
    openSource: true,
    tags: ['多Agent', 'SOP', '软件开发', '文档生成'],
    website: 'https://www.deepwisdom.ai',
    github: 'https://github.com/geekan/MetaGPT',
  },
  {
    name: 'Coze (扣子)',
    description: '字节跳动零代码 AI Bot 开发平台，拖拽式工作流、插件市场和知识库，一键发布多渠道。',
    category: 'Agents',
    pricing: 'Freemium',
    openSource: false,
    tags: ['字节跳动', '零代码', 'Bot', '工作流'],
    website: 'https://www.coze.com',
  },
  {
    name: 'Dify',
    description: '开源 LLMOps 平台，可视化编排 Prompt、RAG 和 Agent，提供自托管和云服务，LangChain 的可视化替代。',
    category: 'Agents',
    pricing: 'Freemium',
    openSource: true,
    tags: ['LLMOps', '可视化', 'RAG', '自托管'],
    website: 'https://dify.ai',
    github: 'https://github.com/langgenius/dify',
  },

  // ── Embeddings ──
  {
    name: 'OpenAI Embeddings',
    description: 'OpenAI 提供的商用嵌入模型，text-embedding-3 系列支持维度缩减，性价比和通用性都很出色。',
    category: 'Embeddings',
    pricing: 'Paid',
    openSource: false,
    tags: ['OpenAI', 'text-embedding-3', '维度缩减', 'API'],
    website: 'https://platform.openai.com/docs/guides/embeddings',
  },
  {
    name: 'Cohere Embed',
    description: 'Cohere 推出的专注嵌入模型，embed-v3 系列在语义搜索和分类任务上表现优异，支持多语言。',
    category: 'Embeddings',
    pricing: 'Freemium',
    openSource: false,
    tags: ['Cohere', 'embed-v3', '多语言', '搜索'],
    website: 'https://cohere.com/embed',
  },
  {
    name: 'Voyage AI',
    description: '由斯坦福 NLP 专家创立的嵌入模型公司，voyage-3 系列在 MTEB 基准上领先，尤其擅长代码和检索。',
    category: 'Embeddings',
    pricing: 'Paid',
    openSource: false,
    tags: ['斯坦福', 'MTEB', '代码嵌入', '检索'],
    website: 'https://www.voyageai.com',
  },
  {
    name: 'Jina AI',
    description: '专注搜索和 NLP 的 AI 公司，提供 jina-embeddings-v3 和 Reader API，多语言和多模态嵌入。',
    category: 'Embeddings',
    pricing: 'Freemium',
    openSource: true,
    tags: ['多语言', '多模态', '搜索', 'Reader API'],
    website: 'https://jina.ai',
    github: 'https://github.com/jina-ai/jina',
  },
  {
    name: 'BGE (BAAI)',
    description: '智源研究院推出的开源嵌入模型 BGE-M3，支持多语言、多功能和多种检索方式，MTEB 表现顶级。',
    category: 'Embeddings',
    pricing: 'Free',
    openSource: true,
    tags: ['智源', '开源', 'BGE-M3', '多语言'],
    website: 'https://huggingface.co/BAAI',
    github: 'https://github.com/FlagOpen/FlagEmbedding',
  },
  {
    name: 'Nomic Embed',
    description: 'Nomic AI 推出的开源嵌入模型，支持文本和视觉，可完全本地运行，注重透明度和可解释性。',
    category: 'Embeddings',
    pricing: 'Free',
    openSource: true,
    tags: ['Nomic AI', '开源', '多模态', '本地部署'],
    website: 'https://atlas.nomic.ai',
    github: 'https://github.com/nomic-ai/nomic',
  },

  // ── Vector DBs ──
  {
    name: 'Pinecone',
    description: '全托管 Serverless 向量数据库，业界最成熟，支持毫秒级混合检索和命名空间隔离，企业首选。',
    category: 'Vector DBs',
    pricing: 'Freemium',
    openSource: false,
    tags: ['Serverless', '全托管', '混合检索', '企业'],
    website: 'https://www.pinecone.io',
  },
  {
    name: 'Weaviate',
    description: '开源向量数据库，原生支持混合搜索（向量 + 关键词）、GraphQL 接口和多模态数据。',
    category: 'Vector DBs',
    pricing: 'Freemium',
    openSource: true,
    tags: ['开源', 'GraphQL', '混合搜索', '多模态'],
    website: 'https://weaviate.io',
    github: 'https://github.com/weaviate/weaviate',
  },
  {
    name: 'Chroma',
    description: '轻量级开源向量数据库，专为开发者体验设计，pip install 即可使用，适合原型和中小规模应用。',
    category: 'Vector DBs',
    pricing: 'Free',
    openSource: true,
    tags: ['开源', '轻量', 'Pythonic', '嵌入'],
    website: 'https://www.trychroma.com',
    github: 'https://github.com/chroma-core/chroma',
  },
  {
    name: 'Qdrant',
    description: '高性能开源向量数据库，Rust 编写，支持量化索引和丰富过滤，单机百万级 QPS。',
    category: 'Vector DBs',
    pricing: 'Freemium',
    openSource: true,
    tags: ['Rust', '高性能', '量化', '过滤'],
    website: 'https://qdrant.tech',
    github: 'https://github.com/qdrant/qdrant',
  },
  {
    name: 'Milvus',
    description: '云原生开源向量数据库，支持万亿级向量索引，GPU 加速，适合大规模生产和分布式部署。',
    category: 'Vector DBs',
    pricing: 'Free',
    openSource: true,
    tags: ['云原生', '分布式', 'GPU加速', '大规模'],
    website: 'https://milvus.io',
    github: 'https://github.com/milvus-io/milvus',
  },
  {
    name: 'LanceDB',
    description: '新一代开源向量数据库，基于 Lance 列式格式，无需服务器、零配置，github 级轻量。',
    category: 'Vector DBs',
    pricing: 'Free',
    openSource: true,
    tags: ['无服务器', '列式存储', '零配置', '轻量'],
    website: 'https://lancedb.com',
    github: 'https://github.com/lancedb/lancedb',
  },
  {
    name: 'Elasticsearch',
    description: '老牌搜索引擎的向量功能，8.0 版本后原生支持向量检索和混合搜索，适合已使用 ES 的团队。',
    category: 'Vector DBs',
    pricing: 'Freemium',
    openSource: true,
    tags: ['搜索', '混合检索', '生态', '企业'],
    website: 'https://www.elastic.co',
    github: 'https://github.com/elastic/elasticsearch',
  },
]

// ── Components ─────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: ToolCategory }) {
  const c = CATEGORY_COLORS[category]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-jetbrains font-medium tracking-wide border',
        c.bg,
        c.text,
        c.border,
      )}
    >
      {category}
    </span>
  )
}

function PricingBadge({ pricing }: { pricing: PricingTier }) {
  const c = PRICING_COLORS[pricing]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-jetbrains font-medium tracking-wide',
        c.bg,
        c.text,
      )}
    >
      {pricing}
    </span>
  )
}

function ToolCard({ tool }: { tool: ToolEntry }) {
  return (
    <div
      className={cn(
        'group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5',
        'transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-xl hover:border-cyan-400/30 hover:bg-white/[0.07]',
      )}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-cyan-500/[0.04] to-purple-500/[0.04]" />

      <div className="relative z-10">
        {/* Header: Name + Badges */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <h3 className="text-base font-sora font-semibold text-white group-hover:text-cyan-200 transition-colors truncate">
            {tool.name}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <CategoryBadge category={tool.category} />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-3.5">
          {tool.description}
        </p>

        {/* Bottom row: badges + actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <PricingBadge pricing={tool.pricing} />
            {tool.openSource && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-jetbrains text-emerald-300 bg-emerald-400/10 border border-emerald-400/20">
                <GitFork className="h-2.5 w-2.5" />
                开源
              </span>
            )}
            {tool.pricing === 'Free' && !tool.openSource && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-jetbrains text-slate-400 bg-white/[0.03] border border-white/[0.06]">
                闭源
              </span>
            )}
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-jetbrains text-slate-500 bg-white/[0.02]">
              {tool.tags[0]}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {tool.github && (
              <a
                href={tool.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-colors"
                onClick={(e) => e.stopPropagation()}
                title="GitHub"
              >
                <GitFork className="h-3.5 w-3.5" />
              </a>
            )}
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-jetbrains font-medium',
                'bg-cyan-400/10 border border-cyan-400/20 text-cyan-300',
                'hover:bg-cyan-400/20 hover:border-cyan-400/40 hover:text-cyan-200',
                'transition-colors',
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3" />
              访问
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────

const ToolsPage = () => {
  useEffect(() => {
    document.title = `AI 工具箱 | ${SITE_NAME}`
  }, [])

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ToolCategory | ''>('')
  const [pricingFilter, setPricingFilter] = useState<PricingTier | ''>('')
  const [openSourceOnly, setOpenSourceOnly] = useState(false)

  const filteredTools = useMemo(() => {
    let result = tools

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q),
      )
    }

    if (categoryFilter) {
      result = result.filter((t) => t.category === categoryFilter)
    }

    if (pricingFilter) {
      result = result.filter((t) => t.pricing === pricingFilter)
    }

    if (openSourceOnly) {
      result = result.filter((t) => t.openSource)
    }

    return result
  }, [searchQuery, categoryFilter, pricingFilter, openSourceOnly])

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-sora font-bold text-white mb-2">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            AI 工具箱
          </span>
        </h1>
        <p className="text-slate-400 max-w-2xl">
          精心筛选的 AI 工具目录，覆盖 LLM 对话、代码助手、图像/视频/音频生成、智能体、嵌入模型和向量数据库，助你快速找到最适合的 AI 工具。
        </p>
      </div>

      {/* Filter Bar */}
      <div
        className={cn(
          'bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4',
          'flex flex-col sm:flex-row flex-wrap gap-3',
        )}
      >
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
          <Input
            type="text"
            placeholder="搜索工具名称、描述、标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ToolCategory | '')}
          className={cn(
            'flex rounded-xl px-4 py-2.5 text-sm text-slate-100',
            'bg-white/5 backdrop-blur-sm border border-white/10',
            'appearance-none cursor-pointer',
            'focus-visible:outline-none focus-visible:border-cyan-400/50 focus-visible:ring-2 focus-visible:ring-cyan-400/20',
            'min-w-[160px]',
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.25rem 1.25rem',
            paddingRight: '2.5rem',
          }}
          aria-label="按分类筛选"
        >
          <option value="">全部类别</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Pricing Filter */}
        <select
          value={pricingFilter}
          onChange={(e) => setPricingFilter(e.target.value as PricingTier | '')}
          className={cn(
            'flex rounded-xl px-4 py-2.5 text-sm text-slate-100',
            'bg-white/5 backdrop-blur-sm border border-white/10',
            'appearance-none cursor-pointer',
            'focus-visible:outline-none focus-visible:border-cyan-400/50 focus-visible:ring-2 focus-visible:ring-cyan-400/20',
            'min-w-[140px]',
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.25rem 1.25rem',
            paddingRight: '2.5rem',
          }}
          aria-label="按价格筛选"
        >
          <option value="">全部价格</option>
          {PRICING_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p === 'Free' ? '免费' : p === 'Paid' ? '付费' : 'Freemium'}
            </option>
          ))}
        </select>

        {/* Open Source Toggle */}
        <label
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer select-none min-w-[120px]',
            'bg-white/5 backdrop-blur-sm border transition-colors duration-200',
            openSourceOnly ? 'border-cyan-400/50 bg-cyan-400/10' : 'border-white/10 hover:border-white/20',
          )}
        >
          <div
            className={cn(
              'w-4 h-4 rounded border flex items-center justify-center transition-colors',
              openSourceOnly
                ? 'bg-cyan-400 border-cyan-400'
                : 'border-slate-500 bg-transparent',
            )}
          >
            {openSourceOnly && (
              <svg className="w-3 h-3 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-xs font-jetbrains text-slate-300">开源</span>
        </label>

        {/* Clear filters */}
        {(searchQuery || categoryFilter || pricingFilter || openSourceOnly) && (
          <button
            onClick={() => {
              setSearchQuery('')
              setCategoryFilter('')
              setPricingFilter('')
              setOpenSourceOnly(false)
            }}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-jetbrains text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors"
          >
            <SlidersHorizontal className="h-3 w-3" />
            清除
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 text-sm text-slate-500 font-jetbrains">
        <Sparkles className="h-4 w-4 text-cyan-400" />
        <span>
          共 {filteredTools.length} 个工具
          {(searchQuery || categoryFilter || pricingFilter || openSourceOnly) && '（已筛选）'}
        </span>
      </div>

      {/* Tool Grid or Empty */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTools.map((tool, i) => (
            <ToolCard key={`${tool.name}-${i}`} tool={tool} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Search className="h-6 w-6 text-slate-400" />}
          title="未找到匹配的工具"
          description="尝试调整搜索词或筛选条件"
          action={{
            label: '清除所有筛选',
            onClick: () => {
              setSearchQuery('')
              setCategoryFilter('')
              setPricingFilter('')
              setOpenSourceOnly(false)
            },
          }}
        />
      )}
    </div>
  )
}

export default ToolsPage
