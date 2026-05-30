import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold gradient-text">404</h1>
        <p className="mt-4 text-xl text-[var(--color-text-muted)]">
          页面未找到
        </p>
        <Link to="/" className="btn-primary mt-8">
          <Home className="w-5 h-5" />
          返回首页
        </Link>
      </div>
    </div>
  )
}
