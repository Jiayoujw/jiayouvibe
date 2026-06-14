import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import ScrollToTop from '@/components/layout/ScrollToTop'
import { ListSkeleton } from '@/components/ui/Skeleton'
import SearchModal from '@/components/search/SearchModal'
import ShortcutHelp from '@/components/ui/ShortcutHelp'
import { SearchProvider } from '@/contexts/SearchContext'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/HomePage'))
const ModelsPage = lazy(() => import('@/pages/ModelsPage'))
const ModelDetailPage = lazy(() => import('@/pages/ModelDetailPage'))
const AgentsPage = lazy(() => import('@/pages/AgentsPage'))
const AgentDetailPage = lazy(() => import('@/pages/AgentDetailPage'))
const DevelopmentPage = lazy(() => import('@/pages/DevelopmentPage'))
const DevelopmentArticlePage = lazy(() => import('@/pages/DevelopmentArticlePage'))
const TerminologyPage = lazy(() => import('@/pages/TerminologyPage'))
const DirectoryPage = lazy(() => import('@/pages/DirectoryPage'))
const NotesPage = lazy(() => import('@/pages/NotesPage'))

const DomainsPage = lazy(() => import('@/pages/DomainsPage'))
const DomainDetailPage = lazy(() => import('@/pages/DomainDetailPage'))
const NewsPage = lazy(() => import('@/pages/NewsPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ComparisonPage = lazy(() => import('@/pages/ComparisonPage'))
const ToolsPage = lazy(() => import('@/pages/ToolsPage'))
const LearningPathPage = lazy(() => import('@/pages/LearningPathPage'))
const ClaudeSkillsPage = lazy(() => import('@/pages/ClaudeSkillsPage'))
const AgentRankingsPage = lazy(() => import('@/pages/AgentRankingsPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const SkillsPage = lazy(() => import('@/pages/SkillsPage'))
const PromptsPage = lazy(() => import('@/pages/PromptsPage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function PageFallback() {
  return (
    <div className="min-h-[60vh] pt-8 animate-scale-in">
      <ListSkeleton count={3} />
    </div>
  )
}

/** Host component that wires up keyboard shortcuts and renders overlay modals. */
function AppKeyboardHost() {
  const { showShortcutHelp, closeShortcutHelp } = useKeyboardShortcuts()

  return (
    <>
      <Layout>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/models" element={<ModelsPage />} />
            <Route path="/models/:slug" element={<ModelDetailPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/agents/:slug" element={<AgentDetailPage />} />
            <Route path="/agent-rankings" element={<AgentRankingsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/development" element={<DevelopmentPage />} />
            <Route path="/development/:slug" element={<DevelopmentArticlePage />} />
            <Route path="/terminology" element={<TerminologyPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/notes" element={<NotesPage />} />

            <Route path="/domains" element={<DomainsPage />} />
            <Route path="/domains/:slug" element={<DomainDetailPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/learn" element={<LearningPathPage />} />
            <Route path="/claude-skills" element={<ClaudeSkillsPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/prompts" element={<PromptsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>

      {/* Global overlay modals */}
      <SearchModal />
      <ShortcutHelp isOpen={showShortcutHelp} onClose={closeShortcutHelp} />
    </>
  )
}

export default function App() {
  return (
    <SearchProvider>
      <ScrollToTop />
      <AppKeyboardHost />
    </SearchProvider>
  )
}
