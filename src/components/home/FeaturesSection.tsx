import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faShieldAlt,
  faChartLine,
  faUserMd,
  faCloudUploadAlt,
  faLaptopMedical,
} from "@fortawesome/free-solid-svg-icons"

const marketingFeatures = [
  {
    icon: faShieldAlt,
    title: "Secure & Compliant",
    description:
      "Enterprise-grade security with HIPAA compliance, data encryption, and role-based access control to protect sensitive information.",
  },
  {
    icon: faChartLine,
    title: "Operational Excellence",
    description:
      "Streamline workflows and optimize resource allocation with intelligent analytics and reporting capabilities.",
  },
  {
    icon: faUserMd,
    title: "Enhanced Patient Care",
    description:
      "Improve patient experiences with faster service, reduced wait times, and better communication throughout the care journey.",
  },
  {
    icon: faCloudUploadAlt,
    title: "Cloud-Based Solution",
    description:
      "Access your hospital system from anywhere with our secure cloud infrastructure, ensuring reliability and scalability.",
  },
  {
    icon: faLaptopMedical,
    title: "Intuitive Interface",
    description:
      "User-friendly design that requires minimal training, allowing your staff to focus on what matters most - patient care.",
  },
]

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-white px-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Hospital Management System?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform delivers the tools healthcare institutions need to thrive in today's digital environment
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {marketingFeatures.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={feature.icon} className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
