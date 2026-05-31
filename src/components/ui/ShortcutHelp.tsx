import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ShortcutHelpProps {
  isOpen: boolean
  onClose: () => void
}

const SHORTCUTS: { key: string; action: string }[] = [
  { key: '/', action: '全局搜索' },
  { key: 'Esc', action: '关闭弹窗' },
  { key: 'n', action: '新建笔记' },
  { key: 'h', action: '回到首页' },
  { key: 'd', action: '仪表盘' },
  { key: '?', action: '显示快捷键' },
]

export default function ShortcutHelp({ isOpen, onClose }: ShortcutHelpProps) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="键盘快捷键">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative z-10 flex items-center justify-center min-h-full p-4">
        <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-cyan-500/10 w-full max-w-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h2 className="text-base font-semibold text-white">键盘快捷键</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Shortcuts table */}
          <div className="px-5 py-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    按键
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {SHORTCUTS.map((s) => (
                  <tr key={s.key} className="border-b border-white/5 last:border-b-0">
                    <td className="py-2.5 pr-4">
                      <kbd className="inline-flex items-center justify-center min-w-[2rem] h-6 px-1.5 rounded-md bg-white/10 text-xs font-mono text-cyan-300 border border-white/10">
                        {s.key}
                      </kbd>
                    </td>
                    <td className="py-2.5 text-[var(--color-text-secondary)]">{s.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer tip */}
          <div className="px-5 py-3 border-t border-white/5 text-[11px] text-slate-500">
            在输入框中时，快捷键不会触发
          </div>
        </div>
      </div>
    </div>
  )
}
