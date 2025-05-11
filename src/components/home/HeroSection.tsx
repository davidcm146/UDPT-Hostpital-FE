import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"

const HeroSection = () => {
  return (
    <section className="relative py-20 overflow-hidden px-8">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-blue-50 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Modern Hospital Management System
            </h1>
            <p className="text-xl text-gray-600 max-w-lg">
              Streamline your hospital operations with our comprehensive microservices-based management system designed
              for efficiency and scalability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg">
                Get Started
                <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-6 text-lg">
                Book Appointment
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-teal-200 rounded-full opacity-50"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200 rounded-full opacity-50"></div>
            <img
              src="/placeholder.svg?height=500&width=600"
              alt="Hospital Management Dashboard"
              className="rounded-xl shadow-2xl relative z-10 w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
