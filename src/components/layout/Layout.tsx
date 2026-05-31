import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <Header />
      <main className="min-h-screen pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
