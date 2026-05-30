import type { NavItem } from '@/types'

export const SITE_NAME = 'jiayouvibe'
export const SITE_DESCRIPTION = '探索AI的无限可能 - 汇聚大模型、智能体、开发教程、专业术语与开源项目的一站式AI知识平台'
export const GITHUB_CACHE_KEY = 'jiayouvibe_github_cache'
export const NOTES_STORAGE_KEY = 'jiayouvibe_notes'
export const THEME_STORAGE_KEY = 'jiayouvibe_theme'
export const GITHUB_CACHE_TTL = 3600000 // 1 hour
export const GITHUB_API_URL = 'https://api.github.com/search/repositories'

export const NAV_ITEMS: NavItem[] = [
  { label: '首页', path: '/' },
  { label: 'AI大模型', path: '/models' },
  { label: 'AI智能体', path: '/agents' },
  { label: 'AI应用开发', path: '/development' },
  { label: 'AI专业术语', path: '/terminology' },
  { label: '网站收录', path: '/directory' },
  {
    label: '更多',
    path: '#',
    children: [
      { label: '笔记系统', path: '/notes' },
      { label: 'GitHub热门', path: '/trending' },
      { label: '其他AI领域', path: '/domains' },
    ],
  },
]

export const MODEL_CATEGORIES: Record<string, string> = {
  llm: '大语言模型',
  multimodal: '多模态模型',
  code: '代码模型',
  embedding: '嵌入模型',
  image: '图像生成',
  video: '视频生成',
  audio: '音频模型',
}

export const AGENT_TYPES: Record<string, string> = {
  framework: '开发框架',
  platform: 'Agent平台',
  tool: '工具',
  agent: '独立Agent',
}

export const TUTORIAL_CATEGORIES: Record<string, string> = {
  'getting-started': '入门指南',
  'prompt-engineering': '提示工程',
  rag: 'RAG',
  'fine-tuning': '微调',
  deployment: '部署',
  agents: '智能体开发',
  safety: '安全对齐',
  tools: '工具使用',
}

export const TUTORIAL_DIFFICULTIES: Record<string, { label: string; color: string }> = {
  beginner: { label: '入门', color: 'bg-green-500/20 text-green-400' },
  intermediate: { label: '进阶', color: 'bg-yellow-500/20 text-yellow-400' },
  advanced: { label: '高级', color: 'bg-red-500/20 text-red-400' },
}

export const TERM_CATEGORIES: Record<string, string> = {
  foundation: '基础概念',
  model: '模型相关',
  training: '训练方法',
  inference: '推理优化',
  architecture: '架构',
  application: '应用场景',
  ethics: '伦理安全',
  tool: '工具框架',
}

export const DIRECTORY_CATEGORIES: Record<string, string> = {
  'model-platform': '模型平台',
  'dev-tool': '开发工具',
  'learning-resource': '学习资源',
  community: '社区论坛',
  data: '数据集',
  other: '其他',
}
