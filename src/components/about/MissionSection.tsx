export default function MissionSection() {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center mb-20 px-8">
      <div className="px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
        <p className="text-lg text-gray-600 mb-6">
          At ABC Hospital, our mission is to provide exceptional healthcare services with compassion and innovation.
          We are committed to improving the health and well-being of our community through advanced medical
          technology, skilled healthcare professionals, and a patient-centered approach.
        </p>
        <p className="text-lg text-gray-600">
          Our state-of-the-art Hospital Management System is designed to enhance the quality of care we provide by
          streamlining operations, improving communication, and ensuring that our patients receive timely and
          effective treatment.
        </p>
      </div>
      <div className="relative">
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-teal-200 rounded-full opacity-50"></div>
        <img
          src="/placeholder.svg?height=400&width=600"
          alt="Hospital Building"
          className="rounded-xl shadow-2xl relative z-10 w-full"
        />
      </div>
    </div>
  )
}
