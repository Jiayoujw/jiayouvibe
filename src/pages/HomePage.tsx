import { useEffect } from 'react'
import { SITE_NAME } from '@/utils/constants'
import HeroSection from '@/components/home/HeroSection'
import FeatureGrid from '@/components/home/FeatureGrid'
import StatsBar from '@/components/home/StatsBar'
import LatestUpdates from '@/components/home/LatestUpdates'
import SubscribeCard from '@/components/community/SubscribeCard'
import AdBanner from '@/components/ads/AdBanner'

export default function HomePage() {
  useEffect(() => {
    document.title = `AI知识导航 | ${SITE_NAME}`
  }, [])

  return (
    <div className="bg-[var(--color-bg-primary)]">
      <HeroSection />
      <StatsBar />
      <div className="my-8 flex justify-center"><AdBanner /></div>
      <FeatureGrid />
      <LatestUpdates />

      {/* Newsletter CTA */}
      <section className="pb-24 sm:pb-32">
        <div>
          <SubscribeCard
            actionUrl="https://jiayouvibe.us21.list-manage.com/subscribe/post?u=REPLACE_ME&amp;id=REPLACE_ME"
          />
        </div>
      </section>
    </div>
  )
}
