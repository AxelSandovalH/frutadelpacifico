import Hero from '@/components/landing/Hero'
import WhyUs from '@/components/landing/WhyUs'
import BestSellers from '@/components/landing/BestSellers'
import PhotoBanner from '@/components/landing/PhotoBanner'
import CombosSection from '@/components/landing/CombosSection'
import Benefits from '@/components/landing/Benefits'
import RecipesPreview from '@/components/landing/RecipesPreview'

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyUs />
      <BestSellers />
      <PhotoBanner />
      <CombosSection />
      <Benefits />
      <RecipesPreview />
    </>
  )
}
