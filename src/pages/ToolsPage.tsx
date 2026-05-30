import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  ExternalLink,
  Star,
  SortAsc,
  Filter,
  MessageSquare,
  Code2,
  Image,
  Video,
  Music,
  Bot,
  Braces,
  Database,
  Send,
  Sparkles,
} from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import { cn } from '@/utils/cn'

// ── Types ────────────────────────────────────────────────────────────────

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
type SortOption = 'default' | 'name-asc' | 'name-desc' | 'stars-desc'

interface ToolEntry {
  name: string
  description: string
  category: ToolCategory
  pricing: PricingTier
  openSource: boolean
  tags: string[]
  website: string
  github?: string
  stars?: number
}

// ── Filter & Sort configs ────────────────────────────────────────────────

const CATEGORY_PILLS: { key: ToolCategory | ''; label: string }[] = [
  { key: '', label: '全部' },
  { key: 'LLM Playground', label: 'LLM Playground' },
  { key: 'Code Assistants', label: '代码助手' },
  { key: 'Image Generation', label: '图像生成' },
  { key: 'Video Generation', label: '视频生成' },
  { key: 'Audio', label: '音频工具' },
  { key: 'Agents', label: 'Agent框架' },
  { key: 'Embeddings', label: '嵌入模型' },
  { key: 'Vector DBs', label: '向量数据库' },
]

const PRICING_PILLS: { key: PricingTier | ''; label: string }[] = [
  { key: '', label: 'All' },
  { key: 'Free', label: 'Free' },
  { key: 'Freemium', label: 'Freemium' },
  { key: 'Paid', label: 'Paid' },
]

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'default', label: '默认排序' },
  { key: 'name-asc', label: '名称 A-Z' },
  { key: 'name-desc', label: '名称 Z-A' },
  { key: 'stars-desc', label: 'Stars 最多' },
]

// ── Visual configs ───────────────────────────────────────────────────────

const CATEGORY_GRADIENTS: Record<ToolCategory, string> = {
  'LLM Playground': 'from-blue-500 to-cyan-400',
  'Code Assistants': 'from-purple-500 to-pink-500',
  'Image Generation': 'from-pink-500 to-rose-400',
  'Video Generation': 'from-amber-500 to-orange-400',
  Audio: 'from-emerald-500 to-teal-400',
  Agents: 'from-indigo-500 to-blue-400',
  Embeddings: 'from-violet-500 to-purple-400',
  'Vector DBs': 'from-orange-500 to-red-400',
}

const CATEGORY_ICONS: Record<ToolCategory, React.ElementType> = {
  'LLM Playground': MessageSquare,
  'Code Assistants': Code2,
  'Image Generation': Image,
  'Video Generation': Video,
  Audio: Music,
  Agents: Bot,
  Embeddings: Braces,
  'Vector DBs': Database,
}

const PRICING_BADGE_STYLES: Record<PricingTier, { bg: string; text: string; border: string }> = {
  Free: { bg: 'bg-emerald-400/10', text: 'text-emerald-300', border: 'border-emerald-400/20' },
  Freemium: { bg: 'bg-amber-400/10', text: 'text-amber-300', border: 'border-amber-400/20' },
  Paid: { bg: 'bg-blue-400/10', text: 'text-blue-300', border: 'border-blue-400/20' },
}

// ── Tools data ───────────────────────────────────────────────────────────

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
    stars: 7000,
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
    stars: 75000,
  },
  {
    name: 'Qwen Chat',
    description: '阿里通义千问官方对话平台，全面支持多模态和长文档处理，中文能力业界领先。',
    category: 'LLM Playground',
    pricing: 'Free',
    openSource: true,
    tags: ['阿里', 'Chat', '多模态', '中文'],
    website: 'https://tongyi.aliyun.com',
    stars: 15000,
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
    stars: 15000,
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
    stars: 2000,
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
    stars: 65000,
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
    stars: 55000,
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
    stars: 68000,
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
    stars: 168000,
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
    stars: 22000,
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
    stars: 8000,
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
    stars: 34000,
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
    stars: 45000,
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
    stars: 50000,
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
    stars: 22000,
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
    stars: 9500,
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
    stars: 3500,
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
    stars: 11000,
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
    stars: 15500,
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
    stars: 20000,
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
    stars: 30000,
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
    stars: 4000,
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
    stars: 70000,
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

function CategoryGradientIcon({ category }: { category: ToolCategory }) {
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

function PricingBadge({ pricing }: { pricing: PricingTier }) {
  const s = PRICING_BADGE_STYLES[pricing]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-jetbrains font-medium tracking-wide border',
        s.bg,
        s.text,
        s.border,
      )}
    >
      {pricing === 'Free' ? 'Free' : pricing === 'Paid' ? 'Paid' : 'Freemium'}
    </span>
  )
}

function ToolCard({ tool }: { tool: ToolEntry }) {
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
        {/* Top row: gradient icon + pricing badge */}
        <div className="flex items-start justify-between mb-3">
          <CategoryGradientIcon category={tool.category} />
          <PricingBadge pricing={tool.pricing} />
        </div>

        {/* Name + Stars */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-sora font-semibold text-white group-hover:text-cyan-100 transition-colors truncate">
            {tool.name}
          </h3>
          {tool.stars && (
            <span className="inline-flex items-center gap-1 shrink-0 text-[11px] text-[var(--color-text-secondary)] font-jetbrains">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {formatStars(tool.stars)}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--color-text-secondary)]/80 leading-relaxed line-clamp-2 mb-4 flex-1">
          {tool.description}
        </p>

        {/* Tag chips */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-jetbrains text-[var(--color-text-secondary)] bg-white/[0.04] border border-white/[0.06]"
            >
              {tag}
            </span>
          ))}
          {tool.tags.length > 3 && (
            <span className="text-[10px] text-[var(--color-text-muted)] font-jetbrains">
              +{tool.tags.length - 3}
            </span>
          )}
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            {tool.github && (
              <a
                href={tool.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[var(--color-text-secondary)] hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200"
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
            href={tool.website}
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

const ToolsPage = () => {
  useEffect(() => {
    document.title = `AI 工具箱 | ${SITE_NAME}`
  }, [])

  // ── Filter & Sort state ──
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ToolCategory | ''>('')
  const [pricingFilter, setPricingFilter] = useState<PricingTier | ''>('')
  const [sortOption, setSortOption] = useState<SortOption>('default')

  // ── Suggest form state ──
  const [suggestName, setSuggestName] = useState('')
  const [suggestUrl, setSuggestUrl] = useState('')
  const [suggestDescription, setSuggestDescription] = useState('')
  const [suggestSubmitted, setSuggestSubmitted] = useState(false)

  // ── Filtered & sorted tools ──
  const filteredTools = useMemo(() => {
    let result = [...tools]

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

    // Sort
    switch (sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'stars-desc':
        result.sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0))
        break
      default:
        break
    }

    return result
  }, [searchQuery, categoryFilter, pricingFilter, sortOption])

  const hasActiveFilters = searchQuery || categoryFilter || pricingFilter

  // ── Suggest form handler ──
  const handleSuggest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!suggestName.trim() || !suggestUrl.trim()) return
    // In a real app this would POST to an API
    setSuggestSubmitted(true)
    setTimeout(() => {
      setSuggestSubmitted(false)
      setSuggestName('')
      setSuggestUrl('')
      setSuggestDescription('')
    }, 3000)
  }

  return (
    <div className="space-y-8 pb-12">
      {/* ═══ Page Header ═══ */}
      <div>
        <h1 className="text-3xl font-sora font-bold text-white mb-2">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI 工具箱
          </span>
        </h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
          精心筛选的 AI 工具目录，覆盖 LLM 对话、代码助手、图像/视频/音频生成、智能体、嵌入模型和向量数据库，助你快速找到最适合的 AI 工具。
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
          <Search className="h-4.5 w-4.5 text-[var(--color-text-muted)] shrink-0" strokeWidth={1.8} />
          <input
            type="text"
            placeholder="搜索工具名称、描述、标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] py-2.5 font-jetbrains"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors shrink-0"
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
        <Filter className="h-4 w-4 text-[var(--color-text-muted)] shrink-0 mr-1" strokeWidth={1.8} />
        {CATEGORY_PILLS.map((pill) => {
          const isActive = categoryFilter === pill.key
          return (
            <button
              key={pill.key}
              onClick={() => setCategoryFilter(pill.key)}
              className={cn(
                'inline-flex items-center px-4 py-2 rounded-xl text-xs font-jetbrains font-medium tracking-wide transition-all duration-300',
                'border backdrop-blur-sm',
                isActive
                  ? 'bg-cyan-400/15 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'bg-white/[0.03] border-white/[0.06] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-white/[0.15] hover:bg-white/[0.05]',
              )}
            >
              {pill.label}
            </button>
          )
        })}
      </div>

      {/* ═══ Secondary Filter Bar: Pricing + Sort ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Pricing pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-jetbrains text-[var(--color-text-muted)] uppercase tracking-wider mr-1">
            Pricing
          </span>
          {PRICING_PILLS.map((pill) => {
            const isActive = pricingFilter === pill.key
            return (
              <button
                key={pill.key}
                onClick={() => setPricingFilter(pill.key)}
                className={cn(
                  'inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-jetbrains font-medium tracking-wide transition-all duration-200',
                  'border',
                  isActive
                    ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300'
                    : 'bg-white/[0.02] border-white/[0.05] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-white/[0.1]',
                )}
              >
                {pill.label}
              </button>
            )
          })}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <SortAsc className="h-3.5 w-3.5 text-[var(--color-text-muted)]" strokeWidth={1.8} />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-[10px] font-jetbrains font-medium text-[var(--color-text-primary)]',
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
              <option key={opt.key} value={opt.key} className="bg-slate-900 text-[var(--color-text-primary)]">
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
              setPricingFilter('')
              setSortOption('default')
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-jetbrains text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.04] transition-colors border border-white/[0.05]"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            清除筛选
          </button>
        )}
      </div>

      {/* ═══ Results count ═══ */}
      <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] font-jetbrains">
        <Sparkles className="h-4 w-4 text-cyan-400" />
        <span>
          共 {filteredTools.length} 个工具
          {hasActiveFilters && '（已筛选）'}
        </span>
      </div>

      {/* ═══ Tool Cards Grid ═══ */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTools.map((tool, i) => (
            <ToolCard key={`${tool.name}-${i}`} tool={tool} />
          ))}
        </div>
      ) : (
        <div
          className={cn(
            'flex flex-col items-center justify-center py-20 px-6',
            'bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl',
          )}
        >
          <Search className="h-8 w-8 text-[var(--color-text-muted)] mb-4" />
          <h3 className="text-lg font-sora font-semibold text-[var(--color-text-primary)] mb-1">
            未找到匹配的工具
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            尝试调整搜索词或筛选条件
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setCategoryFilter('')
              setPricingFilter('')
              setSortOption('default')
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-jetbrains font-medium text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 hover:bg-cyan-400/20 transition-colors"
          >
            <Filter className="h-4 w-4" />
            清除所有筛选
          </button>
        </div>
      )}

      {/* ═══ Suggest a Tool CTA ═══ */}
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
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Suggest a Tool
              </span>
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm">
              发现了好用的 AI 工具没在列表中？提交你的推荐，通过审核后将收录到工具箱，帮助更多开发者。
            </p>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            {suggestSubmitted ? (
              <div className="flex items-center gap-3 py-6 px-5 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-sora font-semibold text-emerald-300">提交成功！</p>
                  <p className="text-xs text-emerald-400/70">感谢你的推荐，我们会尽快审核收录。</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSuggest} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-jetbrains text-[var(--color-text-muted)] mb-1.5 ml-1 uppercase tracking-wider">
                      Tool Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="例如: Midjourney"
                      value={suggestName}
                      onChange={(e) => setSuggestName(e.target.value)}
                      className={cn(
                        'w-full rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
                        'bg-white/[0.04] backdrop-blur-sm border border-white/[0.08]',
                        'outline-none transition-all duration-200',
                        'focus:border-cyan-400/40 focus:bg-white/[0.06]',
                        'font-jetbrains',
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-jetbrains text-[var(--color-text-muted)] mb-1.5 ml-1 uppercase tracking-wider">
                      URL
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={suggestUrl}
                      onChange={(e) => setSuggestUrl(e.target.value)}
                      className={cn(
                        'w-full rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
                        'bg-white/[0.04] backdrop-blur-sm border border-white/[0.08]',
                        'outline-none transition-all duration-200',
                        'focus:border-cyan-400/40 focus:bg-white/[0.06]',
                        'font-jetbrains',
                      )}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-jetbrains text-[var(--color-text-muted)] mb-1.5 ml-1 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    placeholder="简单描述一下这个工具..."
                    rows={3}
                    value={suggestDescription}
                    onChange={(e) => setSuggestDescription(e.target.value)}
                    className={cn(
                      'w-full rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
                      'bg-white/[0.04] backdrop-blur-sm border border-white/[0.08]',
                      'outline-none transition-all duration-200 resize-none',
                      'focus:border-cyan-400/40 focus:bg-white/[0.06]',
                      'font-jetbrains',
                    )}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className={cn(
                      'relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl',
                      'text-sm font-jetbrains font-semibold text-white',
                      'bg-gradient-to-r from-cyan-500 to-blue-500',
                      'hover:from-cyan-400 hover:to-blue-400',
                      'transition-all duration-300',
                      'shadow-[0_4px_20px_rgba(6,182,212,0.25)]',
                      'hover:shadow-[0_6px_30px_rgba(6,182,212,0.35)]',
                      'animate-[pulse-glow_2s_ease-in-out_infinite]',
                    )}
                  >
                    <Send className="h-4 w-4" />
                    提交推荐
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Inject keyframes for pulse-glow */}
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

export default ToolsPage
