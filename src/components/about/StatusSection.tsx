import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHospital, faUserMd, faAward, faClock } from "@fortawesome/free-solid-svg-icons"

export default function StatusSection() {
  const stats = [
    { icon: faHospital, title: "Established", value: "1985", desc: "Serving our community with excellence for over 35 years" },
    { icon: faUserMd, title: "Medical Staff", value: "200+", desc: "Highly qualified doctors and specialists across all departments" },
    { icon: faAward, title: "Accreditations", value: "15+", desc: "Recognized for excellence in healthcare and patient safety" },
    { icon: faClock, title: "24/7 Service", value: "365 Days", desc: "Round-the-clock emergency care and patient support" },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 px-14">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={stat.icon} className="h-6 w-6 text-teal-600" />
            </div>
            <CardTitle>{stat.title}</CardTitle>
            <CardDescription className="text-2xl font-bold">{stat.value}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{stat.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
