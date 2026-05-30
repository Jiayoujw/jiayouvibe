import { useState, useEffect } from 'react'
import { StickyNote, ArrowLeft } from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'
import { cn } from '@/utils/cn'
import { useNotes } from '@/contexts/NotesContext'
import NotesList from '@/components/notes/NotesList'
import NoteEditor from '@/components/notes/NoteEditor'
import NoteToolbar from '@/components/notes/NoteToolbar'

export default function NotesPage() {
  useEffect(() => {
    document.title = `笔记系统 | ${SITE_NAME}`
  }, [])

  const { dispatch, selectedNote } = useNotes()

  // On mobile: true = show list, false = show editor
  const [showList, setShowList] = useState(true)

  function handleNoteSelect() {
    setShowList(false)
  }

  function handleBackToList() {
    setShowList(true)
  }

  return (
    <div className="flex h-[calc(100vh-5rem)]">
      {/* Left: NotesList */}
      <div
        className={cn(
          'shrink-0',
          showList ? 'block' : 'hidden',
          'md:block',
        )}
      >
        <NotesList onNoteSelect={handleNoteSelect} />
      </div>

      {/* Right: Editor area */}
      <div
        className={cn(
          'flex flex-col flex-1 min-w-0',
          !showList ? 'flex' : 'hidden',
          'md:flex',
        )}
      >
        {selectedNote ? (
          <>
            {/* Mobile back button */}
            <div className="md:hidden flex items-center gap-2 px-4 py-2 border-b border-white/5">
              <button
                onClick={handleBackToList}
                className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                返回列表
              </button>
            </div>

            <NoteToolbar note={selectedNote} dispatch={dispatch} />
            <NoteEditor note={selectedNote} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center px-6">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/5">
                <StickyNote className="w-10 h-10 text-[var(--color-text-muted)]" />
              </div>
              <p className="text-[var(--color-text-muted)] text-sm max-w-xs">
                选择或创建一条笔记开始编辑
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
