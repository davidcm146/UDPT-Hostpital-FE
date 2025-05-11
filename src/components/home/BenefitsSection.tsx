import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserMd, faUser, faUserTie, faShieldAlt, faChartPie, faServer } from "@fortawesome/free-solid-svg-icons"

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-20 bg-gradient-to-r px-8 from-teal-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Benefits for All Stakeholders</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our hospital management system provides unique advantages for patients, doctors, and administrators.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-6">
              <FontAwesomeIcon icon={faUser} className="h-7 w-7 text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">For Patients</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                Easy appointment scheduling and reminders
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                Access to medical records and prescription history
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                Timely notifications about prescription readiness
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                Reduced waiting times and improved service
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <FontAwesomeIcon icon={faUserMd} className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">For Doctors</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Organized schedule and appointment management
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Quick access to patient medical history
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Digital prescription creation and tracking
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                More time for patient care, less administrative work
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-6">
              <FontAwesomeIcon icon={faUserTie} className="h-7 w-7 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">For Administrators</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                Comprehensive reporting and analytics
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                Efficient resource allocation and management
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                Improved operational efficiency and cost reduction
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                Data-driven decision making capabilities
              </li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <div className="mr-4">
              <FontAwesomeIcon icon={faShieldAlt} className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-1">Enhanced Security</h4>
              <p className="text-gray-600">Authentication, authorization, and data encryption</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <div className="mr-4">
              <FontAwesomeIcon icon={faChartPie} className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-1">High Performance</h4>
              <p className="text-gray-600">Handles 100+ requests/second with low latency</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <div className="mr-4">
              <FontAwesomeIcon icon={faServer} className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-1">Scalable Architecture</h4>
              <p className="text-gray-600">Microservices design for independent scaling</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
