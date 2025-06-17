"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, GraduationCap, Briefcase } from "lucide-react"
import { mockDoctors } from "@/data/doctors"

const DoctorsSection = () => {
  return (
    <section className="py-12 bg-white mt-14">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Doctors</h2>
          <p className="text-lg text-gray-600">Meet our experienced medical professionals</p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDoctors.slice(0, 3).map((doctor) => (
              <Card key={doctor.userId} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="text-center flex-1 flex flex-col">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full overflow-hidden">
                      <img
                        src={doctor.avatar || "/placeholder.svg"}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{doctor.name}</h4>
                    <p className="text-teal-600 font-medium mb-3">{doctor.specialty}</p>

                    <div className="space-y-2 mb-4 text-gray-600 text-sm flex-1">
                      <div className="flex items-center justify-center">
                        <GraduationCap className="mr-2 text-teal-600 w-4 h-4" />
                        <span>{doctor.education}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <Briefcase className="mr-2 text-teal-600 w-4 h-4" />
                        <span>{doctor.experience}</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700 mt-auto">Book Appointment</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DoctorsSection
