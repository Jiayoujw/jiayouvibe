import { useState, useEffect, useCallback, useRef } from 'react'
import { X, Plus } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useNotes } from '@/contexts/NotesContext'
import useDebounce from '@/hooks/useDebounce'
import type { Note } from '@/types'

interface NoteEditorProps {
  note: Note
}

export default function NoteEditor({ note }: NoteEditorProps) {
  const { dispatch } = useNotes()

  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [tags, setTags] = useState<string[]>(note.tags)

  const debouncedTitle = useDebounce(title, 600)
  const debouncedContent = useDebounce(content, 600)

  // Track whether this is the initial mount to avoid unnecessary dispatches
  const noteIdRef = useRef(note.id)

  // Sync local state when a different note is selected
  useEffect(() => {
    if (note.id !== noteIdRef.current) {
      noteIdRef.current = note.id
      setTitle(note.title)
      setContent(note.content)
      setTags(note.tags)
    }
  }, [note.id, note.title, note.content, note.tags])

  // Debounced save for title
  useEffect(() => {
    if (debouncedTitle !== note.title) {
      dispatch({
        type: 'UPDATE_NOTE',
        payload: { id: note.id, updates: { title: debouncedTitle } },
      })
    }
  }, [debouncedTitle])

  // Debounced save for content
  useEffect(() => {
    if (debouncedContent !== note.content) {
      dispatch({
        type: 'UPDATE_NOTE',
        payload: { id: note.id, updates: { content: debouncedContent } },
      })
    }
  }, [debouncedContent])

  const handleTagsChange = useCallback(
    (newTags: string[]) => {
      setTags(newTags)
      dispatch({
        type: 'UPDATE_NOTE',
        payload: { id: note.id, updates: { tags: newTags } },
      })
    },
    [note.id, dispatch],
  )

  function handleAddTag() {
    const name = window.prompt('输入标签名称')
    if (name && name.trim()) {
      const trimmed = name.trim()
      if (!tags.includes(trimmed)) {
        handleTagsChange([...tags, trimmed])
      }
    }
  }

  function handleRemoveTag(tag: string) {
    handleTagsChange(tags.filter((t) => t !== tag))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <div className="px-6 pt-6 pb-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="无标题笔记"
          className={cn(
            'w-full text-2xl font-sora font-semibold bg-transparent',
            'text-slate-100 placeholder:text-slate-600',
            'border-none outline-none',
            'pb-2',
          )}
        />
      </div>

      {/* Tags row */}
      <div className="px-6 pb-3 flex items-center gap-2 flex-wrap">
        {tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs',
              'bg-cyan-400/10 text-cyan-300 border border-cyan-400/20',
              'font-medium',
            )}
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-white transition-colors"
              aria-label={`删除标签 ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <button
          onClick={handleAddTag}
          className={cn(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs',
            'bg-white/5 text-slate-400 border border-white/5',
            'hover:bg-white/10 hover:text-slate-300 hover:border-white/10',
            'transition-all duration-200',
          )}
        >
          <Plus className="w-3 h-3" />
          添加标签
        </button>
      </div>

      {/* Content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="在此输入笔记内容..."
        className={cn(
          'flex-1 w-full px-6 py-3 resize-none',
          'bg-transparent border-none outline-none',
          'text-sm text-slate-200 placeholder:text-slate-600',
          'font-mono leading-relaxed',
        )}
      />
    </div>
  )
}
