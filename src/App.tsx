import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Spinner from '@/components/ui/Spinner'
import ScrollToTop from '@/components/layout/ScrollToTop'

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
const TrendingPage = lazy(() => import('@/pages/TrendingPage'))
const DomainsPage = lazy(() => import('@/pages/DomainsPage'))
const DomainDetailPage = lazy(() => import('@/pages/DomainDetailPage'))
const NewsPage = lazy(() => import('@/pages/NewsPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ComparisonPage = lazy(() => import('@/pages/ComparisonPage'))
const ToolsPage = lazy(() => import('@/pages/ToolsPage'))
const LearningPathPage = lazy(() => import('@/pages/LearningPathPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/models" element={<ModelsPage />} />
            <Route path="/models/:slug" element={<ModelDetailPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/agents/:slug" element={<AgentDetailPage />} />
            <Route path="/development" element={<DevelopmentPage />} />
            <Route path="/development/:slug" element={<DevelopmentArticlePage />} />
            <Route path="/terminology" element={<TerminologyPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/domains" element={<DomainsPage />} />
            <Route path="/domains/:slug" element={<DomainDetailPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/learn" element={<LearningPathPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  )
}
