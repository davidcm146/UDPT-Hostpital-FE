import HeroSection from "../components/home/HeroSection"
import FeaturesSection from "../components/home/FeaturesSection"
import BenefitsSection from "../components/home/BenefitsSection"
import StatsSection from "../components/home/StatsSection"
import CtaSection from "../components/home/CtaSection"
import SearchSection from "@/components/home/SearchSection"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <FeaturesSection />
      <BenefitsSection />
      <StatsSection />
      <CtaSection />
    </>
  )
}
