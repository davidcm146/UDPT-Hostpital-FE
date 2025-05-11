export default function LeadershipSection() {
  const leaders = [
    {
      name: "Dr. Robert Chen",
      role: "Chief Executive Officer",
      desc: "With over 25 years of healthcare leadership experience, Dr. Chen leads our hospital's strategic initiatives",
    },
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      desc: "Dr. Johnson oversees all medical operations and ensures the highest standards of patient care",
    },
    {
      name: "Michael Thompson",
      role: "Chief Technology Officer",
      desc: "Michael leads our digital transformation and hospital management system implementation",
    },
  ]

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Leadership Team</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
        Meet the dedicated professionals who guide our hospital's vision and operations
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        {leaders.map((leader, index) => (
          <div key={index}>
            <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-1">{leader.name}</h3>
            <p className="text-gray-600 mb-2">{leader.role}</p>
            <p className="text-gray-600 text-sm max-w-xs mx-auto">{leader.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
