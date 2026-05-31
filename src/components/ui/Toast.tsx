import { useState, useCallback, useEffect, createContext, useContext, type ReactNode } from 'react'
import { Check, X, Info } from 'lucide-react'
import { cn } from '@/utils/cn'

/* ── Types ── */

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

/* ── Context ── */

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 0

/* ── Provider ── */

interface ToastProviderProps {
  children: ReactNode
}

const typeStyles: Record<ToastType, string> = {
  success: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  error: 'border-red-400/30 bg-red-400/10 text-red-300',
  info: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
}

const typeIcons: Record<ToastType, React.ElementType> = {
  success: Check,
  error: X,
  info: Info,
}

function ToastContainer({ items }: { items: ToastItem[] }) {
  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
    >
      {items.map((item) => (
        <div
          key={item.id}
          role="alert"
          className={cn(
            'pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg',
            'animate-in slide-in-from-right fade-in duration-300',
            typeStyles[item.type],
          )}
        >
          <span className="font-jetbrains text-sm font-bold leading-none">
            {(() => {
              const Icon = typeIcons[item.type]
              return <Icon className="h-4 w-4" />
            })()}
          </span>
          <span className="text-sm font-medium">{item.message}</span>
        </div>
      ))}
    </div>
  )
}

const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextId++
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  useEffect(() => {
    if (toasts.length === 0) return

    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 4000)

    return () => clearTimeout(timer)
  }, [toasts])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer items={toasts} />
    </ToastContext.Provider>
  )
}

/* ── Hook ── */

function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>')
  }
  return ctx
}

export { ToastProvider, useToast }
export default ToastProvider
