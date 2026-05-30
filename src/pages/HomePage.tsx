import { useEffect } from 'react'
import { SITE_NAME } from '@/utils/constants'
import HeroSection from '@/components/home/HeroSection'
import FeatureGrid from '@/components/home/FeatureGrid'
import LatestUpdates from '@/components/home/LatestUpdates'

export default function HomePage() {
  useEffect(() => {
    document.title = `${SITE_NAME} - 探索AI的无限可能`
  }, [])

  return (
    <div className="bg-[#0f172a]">
      <HeroSection />
      <FeatureGrid />
      <LatestUpdates />
    </div>
  )
}
