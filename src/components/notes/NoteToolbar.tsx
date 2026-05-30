import { Cloud, Pin, PinOff, Download, Trash2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { Note } from '@/types'
import type { NotesAction } from '@/contexts/NotesContext'

interface NoteToolbarProps {
  note: Note
  dispatch: React.Dispatch<NotesAction>
}

export default function NoteToolbar({ note, dispatch }: NoteToolbarProps) {
  function handleTogglePin() {
    dispatch({ type: 'TOGGLE_PIN', payload: note.id })
  }

  function handleExport() {
    const lines: string[] = []

    if (note.title) {
      lines.push(`# ${note.title}`)
      lines.push('')
    }

    if (note.tags.length > 0) {
      lines.push(`标签: ${note.tags.join(', ')}`)
      lines.push('')
    }

    if (note.content) {
      lines.push(note.content)
    }

    const markdown = lines.join('\n')
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const filename = note.title
      ? `${note.title.replace(/[\\/:*?"<>|]/g, '-')}.md`
      : `无标题笔记.md`

    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  function handleDelete() {
    if (window.confirm('确定要删除这条笔记吗？此操作无法撤销。')) {
      dispatch({ type: 'DELETE_NOTE', payload: note.id })
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-6 py-2 shrink-0',
        'border-b border-white/5',
        'bg-white/[0.02]',
      )}
    >
      {/* Save status */}
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
        <Cloud className="w-3.5 h-3.5" />
        已保存
      </span>

      <div className="flex-1" />

      {/* Pin toggle */}
      <button
        onClick={handleTogglePin}
        title={note.pinned ? '取消置顶' : '置顶'}
        className={cn(
          'p-1.5 rounded-lg transition-all duration-200',
          note.pinned
            ? 'text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20'
            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5',
        )}
      >
        {note.pinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
      </button>

      {/* Export */}
      <button
        onClick={handleExport}
        title="导出为 Markdown"
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200"
      >
        <Download className="w-4 h-4" />
      </button>

      {/* Delete */}
      <button
        onClick={handleDelete}
        title="删除笔记"
        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
