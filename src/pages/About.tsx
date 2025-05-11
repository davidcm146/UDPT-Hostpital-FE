
import StatusSection from "@/components/about/StatusSection"
import ValuesSection from "@/components/about/ValueSection"
import LeadershipSection from "@/components/about/LeadershipSection"
import MissionSection from "@/components/about/MissionSection"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About ABC Hospital</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Leading the way in healthcare innovation and patient-centered care
        </p>
      </div>

      <MissionSection />
      <StatusSection />
      <ValuesSection />
      <LeadershipSection />
    </div>
  )
}
