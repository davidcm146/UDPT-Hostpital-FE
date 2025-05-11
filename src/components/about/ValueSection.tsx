export default function ValuesSection() {
  const values = [
    { number: "1", title: "Excellence", desc: "We strive for excellence in all aspects of patient care and hospital operations" },
    { number: "2", title: "Compassion", desc: "We treat every patient with dignity, respect, and genuine care" },
    { number: "3", title: "Innovation", desc: "We embrace new technologies and approaches to improve healthcare delivery" },
  ]

  return (
    <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl py-8 md:p-12 mb-20">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Values</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {values.map((val, index) => (
          <div key={index} className="text-center">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-teal-600">{val.number}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{val.title}</h3>
            <p className="text-gray-600">{val.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
