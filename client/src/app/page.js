import HeroSection from '@/components/home/HeroSection'
import StatsBar from '@/components/home/StatsBar'
import FeaturedJobs from '@/components/home/FeaturedJobs'
import JobCategories from '@/components/home/JobCategories'
import CallToAction from '@/components/home/CallToAction'

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <FeaturedJobs />
      <JobCategories />
      <CallToAction />
    </>
  )
}
