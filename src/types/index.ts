// ============ AI Models ============
export interface AIModel {
  slug: string
  name: string
  provider: string
  category: 'llm' | 'multimodal' | 'code' | 'embedding' | 'image' | 'video' | 'audio'
  description: string
  longDescription: string
  parameters?: string
  contextWindow?: string
  pricing?: string
  releaseDate?: string
  website: string
  apiAvailable: boolean
  openSource: boolean
  tags: string[]
  strengths: string[]
  weaknesses: string[]
  useCases: string[]
  logo?: string
}

// ============ AI Agents ============
export interface AIAgent {
  slug: string
  name: string
  type: 'framework' | 'platform' | 'tool' | 'agent'
  description: string
  longDescription: string
  language?: string
  githubStars?: number
  website: string
  github?: string
  openSource: boolean
  tags: string[]
  features: string[]
  useCases: string[]
  pricing?: string
  logo?: string
}

// ============ Terminology ============
export interface Term {
  id: string
  term: string
  abbreviation?: string
  englishName?: string
  category: 'foundation' | 'model' | 'training' | 'inference' | 'architecture' | 'application' | 'ethics' | 'tool'
  definition: string
  detailedExplanation?: string
  relatedTerms: string[]
  tags: string[]
}

// ============ Directory ============
export interface DirectoryEntry {
  id: string
  name: string
  url: string
  description: string
  category: 'model-platform' | 'dev-tool' | 'learning-resource' | 'community' | 'data' | 'other'
  tags: string[]
  language: 'zh' | 'en' | 'both'
  featured: boolean
  logo?: string
}

// ============ Tutorials ============
export interface Tutorial {
  slug: string
  title: string
  description: string
  content: string
  category: 'getting-started' | 'prompt-engineering' | 'rag' | 'fine-tuning' | 'deployment' | 'agents' | 'safety' | 'tools'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  author: string
  date: string
  tags: string[]
  readingTime: number // minutes
  coverImage?: string
}

// ============ Domain ============
export interface Domain {
  slug: string
  name: string
  icon: string
  description: string
  link: string
  isInternal: boolean
  tags: string[]
}

// ============ Notes ============
export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  tags: string[]
  pinned: boolean
}

// ============ GitHub Repo ============
export interface GitHubRepo {
  id: number
  name: string
  fullName: string
  owner: string
  ownerAvatar: string
  description: string
  url: string
  stars: number
  forks: number
  language: string
  topics: string[]
  updatedAt: string
}

export interface GitHubCache {
  data: GitHubRepo[]
  timestamp: number
  etag?: string
}

// ============ Search ============
export interface SearchResult {
  type: 'model' | 'agent' | 'term' | 'tutorial' | 'directory'
  title: string
  description: string
  url: string
  tags: string[]
}

// ============ Theme ============
export type ThemeMode = 'light' | 'dark' | 'system'

// ============ Navigation ============
export interface NavItem {
  label: string
  path: string
  icon?: string
  children?: NavItem[]
}
