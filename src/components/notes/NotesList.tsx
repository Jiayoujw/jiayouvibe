import { useState, useMemo } from 'react'
import { Search, Pin, Plus } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/formatDate'
import { useNotes } from '@/contexts/NotesContext'
import type { Note } from '@/types'

function createNewNote(): Note {
  return {
    id: globalThis.crypto.randomUUID(),
    title: '',
    content: '',
    createdAt: performance.now(),
    updatedAt: performance.now(),
    tags: [],
    pinned: false,
  }
}

interface NotesListProps {
  onNoteSelect?: () => void
}

export default function NotesList({ onNoteSelect }: NotesListProps) {
  const { state, dispatch, selectedNote } = useNotes()
  const [search, setSearch] = useState('')

  const sortedNotes = useMemo(() => {
    const filtered = search.trim()
      ? state.notes.filter(
          (n) =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.content.toLowerCase().includes(search.toLowerCase()) ||
            n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
        )
      : [...state.notes]

    const pinned = filtered.filter((n) => n.pinned)
    const unpinned = filtered.filter((n) => !n.pinned)

    pinned.sort((a, b) => b.updatedAt - a.updatedAt)
    unpinned.sort((a, b) => b.updatedAt - a.updatedAt)

    return [...pinned, ...unpinned]
  }, [state.notes, search])

  function handleAddNote() {
    const note = createNewNote()
    dispatch({ type: 'ADD_NOTE', payload: note })
    onNoteSelect?.()
  }

  function handleSelectNote(id: string) {
    dispatch({ type: 'SELECT_NOTE', payload: id })
    onNoteSelect?.()
  }

  function getPreview(content: string): string {
    const firstLine = content.split('\n')[0] || ''
    return firstLine.length > 60 ? firstLine.slice(0, 60) + '...' : firstLine
  }

  return (
    <div className="flex flex-col h-full w-72 bg-white/[0.03] backdrop-blur-xl border-r border-white/5 shrink-0">
      {/* Header */}
      <div className="p-4 space-y-3">
        <button
          onClick={handleAddNote}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl',
            'bg-gradient-to-r from-cyan-400 to-purple-500 text-white',
            'shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40',
            'hover:from-cyan-300 hover:to-purple-400',
            'active:scale-[0.97] transition-all duration-200',
            'font-sora font-medium text-sm tracking-wide',
          )}
        >
          <Plus className="w-4 h-4" />
          新建笔记
        </button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <label htmlFor="notes-search-input" className="sr-only">搜索笔记</label>
          <input
            id="notes-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索笔记..."
            className={cn(
              'w-full pl-9 pr-3 py-2 rounded-lg text-sm',
              'bg-white/5 border border-white/5',
              'text-slate-200 placeholder:text-slate-500',
              'focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20',
              'transition-colors duration-200',
            )}
          />
        </div>
      </div>

      {/* Note list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {sortedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <p className="text-sm text-slate-500">
              {search.trim() ? '没有找到匹配的笔记' : '还没有笔记'}
            </p>
            {!search.trim() && (
              <p className="text-xs text-slate-600 mt-1">点击上方按钮创建第一条笔记</p>
            )}
          </div>
        ) : (
          <div className="space-y-0.5">
            {sortedNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => handleSelectNote(note.id)}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-lg',
                  'transition-all duration-150',
                  'hover:bg-white/5',
                  'border-l-2',
                  selectedNote?.id === note.id
                    ? 'border-l-cyan-400 bg-white/[0.06]'
                    : 'border-l-transparent',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      {note.pinned && (
                        <Pin className="w-3 h-3 text-cyan-400 shrink-0" />
                      )}
                      <span
                        className={cn(
                          'text-sm font-medium truncate',
                          note.title ? 'text-slate-200' : 'text-slate-500 italic',
                        )}
                      >
                        {note.title || '无标题'}
                      </span>
                    </div>
                    {note.content && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {getPreview(note.content)}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-600 mt-1">
                      {formatDate(note.updatedAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
