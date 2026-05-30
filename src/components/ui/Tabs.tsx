import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { cn } from '@/utils/cn'

interface TabsContextValue {
  activeTab: string
  setActiveTab: Dispatch<SetStateAction<string>>
  registerTab: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) {
    throw new Error('Tabs compound components must be used inside <Tabs>')
  }
  return ctx
}

/* ── <Tabs> ── */

interface TabsProps {
  children: ReactNode
  defaultTab?: string
  className?: string
  onChange?: (tab: string) => void
}

const Tabs = ({ children, defaultTab, className }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab ?? '')

  const registerTab = useCallback((_value: string) => {
    // Registration is handled by Tab components reading the context.
    // setActiveTab is kept because switching is the core behavior.
  }, [])

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, registerTab }}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  )
}

/* ── <TabList> ── */

interface TabListProps {
  children: ReactNode
  className?: string
}

const TabList = ({ children, className }: TabListProps) => {
  return (
    <div
      role="tablist"
      className={cn(
        'flex gap-1 rounded-xl bg-white/5 p-1 border border-white/5',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ── <Tab> ── */

interface TabProps {
  children: ReactNode
  value: string
  className?: string
  disabled?: boolean
}

const Tab = ({ children, value, className, disabled = false }: TabProps) => {
  const { activeTab, setActiveTab } = useTabsContext()
  const isActive = activeTab === value

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={cn(
        'relative flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50',
        'disabled:pointer-events-none disabled:opacity-30',
        isActive
          ? 'bg-white/10 text-white shadow-sm'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]',
        className,
      )}
    >
      {children}
    </button>
  )
}

/* ── <TabPanel> ── */

interface TabPanelProps {
  children: ReactNode
  value: string
  className?: string
}

const TabPanel = ({ children, value, className }: TabPanelProps) => {
  const { activeTab } = useTabsContext()
  if (activeTab !== value) return null

  return (
    <div role="tabpanel" className={cn('pt-4', className)}>
      {children}
    </div>
  )
}

export { Tabs, TabList, Tab, TabPanel }
export default Tabs
