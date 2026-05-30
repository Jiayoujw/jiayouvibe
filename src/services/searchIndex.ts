import Fuse from 'fuse.js'
import type {
  SearchResult,
  AIModel,
  AIAgent,
  Term,
  Tutorial,
  DirectoryEntry,
} from '@/types'

// Data imports — adjust paths as needed once data files are created
// Each data module should export a const array (e.g. `export const models: AIModel[]`)
import { models } from '@/data/models'
import { agents } from '@/data/agents'
import { terms as terminology } from '@/data/terminology'
import { tutorials } from '@/data/tutorials'
import { directoryEntries as directory } from '@/data/directory'

// ── Internal document shape for the Fuse index ──────────────────

export interface SearchDocument {
  type: 'model' | 'agent' | 'term' | 'tutorial' | 'directory'
  title: string
  description: string
  url: string
  tags: string[]
}

// ── Builder ──────────────────────────────────────────────────────

let index: Fuse<SearchDocument> | null = null

function resolveUrl(type: SearchDocument['type'], slugOrId: string): string {
  const prefix: Record<SearchDocument['type'], string> = {
    model: '/models/',
    agent: '/agents/',
    term: '/terminology/',
    tutorial: '/tutorials/',
    directory: '/directory/',
  }
  return `${prefix[type]}${slugOrId}`
}

export function buildSearchIndex(): Fuse<SearchDocument> {
  if (index) return index

  const documents: SearchDocument[] = []

  // Models
  for (const m of models as AIModel[]) {
    documents.push({
      type: 'model',
      title: m.name,
      description: m.description,
      url: resolveUrl('model', m.slug),
      tags: m.tags,
    })
  }

  // Agents
  for (const a of agents as AIAgent[]) {
    documents.push({
      type: 'agent',
      title: a.name,
      description: a.description,
      url: resolveUrl('agent', a.slug),
      tags: a.tags,
    })
  }

  // Terminology
  for (const t of terminology as Term[]) {
    documents.push({
      type: 'term',
      title: t.term,
      description: t.definition,
      url: resolveUrl('term', t.id),
      tags: t.tags,
    })
  }

  // Tutorials
  for (const t of tutorials as Tutorial[]) {
    documents.push({
      type: 'tutorial',
      title: t.title,
      description: t.description,
      url: resolveUrl('tutorial', t.slug),
      tags: t.tags,
    })
  }

  // Directory
  for (const d of directory as DirectoryEntry[]) {
    documents.push({
      type: 'directory',
      title: d.name,
      description: d.description,
      url: resolveUrl('directory', d.id),
      tags: d.tags,
    })
  }

  index = new Fuse(documents, {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'description', weight: 0.3 },
      { name: 'tags', weight: 0.2 },
    ],
    threshold: 0.4,
    distance: 100,
    ignoreLocation: true,
    includeScore: true,
    shouldSort: true,
    minMatchCharLength: 1,
    isCaseSensitive: false,
  })

  return index
}

// ── Search ───────────────────────────────────────────────────────

const MAX_PER_CATEGORY = 5

export function search(query: string): SearchResult[] {
  const fuse = buildSearchIndex()
  const results = fuse.search(query)

  // Group by type and keep top N per category
  const grouped = new Map<SearchDocument['type'], SearchResult[]>()
  const order: SearchDocument['type'][] = []

  for (const { item } of results) {
    let bucket = grouped.get(item.type)
    if (!bucket) {
      bucket = []
      grouped.set(item.type, bucket)
      order.push(item.type)
    }
    if (bucket.length < MAX_PER_CATEGORY) {
      bucket.push({
        type: item.type,
        title: item.title,
        description: item.description,
        url: item.url,
        tags: item.tags,
      })
    }
  }

  // Flatten groups while preserving the order they were first encountered
  const output: SearchResult[] = []
  for (const type of order) {
    output.push(...(grouped.get(type)!))
  }

  return output
}
