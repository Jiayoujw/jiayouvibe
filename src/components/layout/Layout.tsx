import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Sidebar from '@/components/layout/Sidebar'
import MobileTabBar from '@/components/layout/MobileTabBar'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      {/* Sidebar — desktop only, fixed left */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Header — mobile only */}
      <div className="md:hidden">
        <Header />
      </div>

      {/* Main content — offset by sidebar on desktop, space for bottom tab bar on mobile */}
      <main className="min-h-screen pt-16 md:pt-8 md:ml-[260px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 sm:pb-24">
          {children}
        </div>
      </main>

      {/* Mobile bottom tab bar — visible only on small screens */}
      <MobileTabBar />

      {/* Footer — offset by sidebar on desktop */}
      <div className="md:ml-[260px]">
        <Footer />
      </div>
    </div>
  )
}
