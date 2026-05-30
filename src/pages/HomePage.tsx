import { useEffect } from 'react'
import { SITE_NAME } from '@/utils/constants'
import HeroSection from '@/components/home/HeroSection'
import FeatureGrid from '@/components/home/FeatureGrid'
import StatsBar from '@/components/home/StatsBar'
import LatestUpdates from '@/components/home/LatestUpdates'

export default function HomePage() {
  useEffect(() => {
    document.title = `AI知识导航 | ${SITE_NAME}`
  }, [])

  return (
    <div className="bg-[#0f172a]">
      <HeroSection />
      <StatsBar />
      <FeatureGrid />
      <LatestUpdates />
    </div>
  )
}
