import HeroSection from "../components/home/HeroSection"
import FeaturesSection from "../components/home/FeaturesSection"
import BenefitsSection from "../components/home/BenefitsSection"
import StatsSection from "../components/home/StatsSection"
import DoctorsSection from "@/components/home/DoctorsSection"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DoctorsSection />
      <FeaturesSection />
      <BenefitsSection />
      <StatsSection />
    </>
  )
}
