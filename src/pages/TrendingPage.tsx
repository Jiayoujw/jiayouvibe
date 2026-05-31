import { useEffect } from 'react'

export default function TrendingPage() {
  useEffect(() => {
    window.location.href = 'https://gh.jiayouvibe.com'
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <p className="text-[var(--color-text-secondary)] mb-4">正在跳转到 GitHub 热门项目...</p>
      <a
        href="https://gh.jiayouvibe.com"
        className="text-cyan-400 hover:underline"
      >
        如果没有自动跳转，请点击这里
      </a>
    </div>
  )
}
