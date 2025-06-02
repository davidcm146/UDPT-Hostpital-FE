"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, GraduationCap, Phone, Mail, Star } from "lucide-react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import type { Doctor } from "@/types/doctor"
import AppointmentDialog from "./AppointmentDialog"

interface DoctorCardProps {
  doctor: Doctor
  onBookAppointment: (doctor: Doctor) => void
  selectedDoctor: Doctor | null
  selectedDate: Date | undefined
  selectedTimeSlot: string | null
  setSelectedDate: (date: Date | undefined) => void
  setSelectedTimeSlot: (timeSlot: string | null) => void
  onConfirmAppointment: () => void
}

const DoctorCard = ({
  doctor,
  onBookAppointment,
  selectedDoctor,
  selectedDate,
  selectedTimeSlot,
  setSelectedDate,
  setSelectedTimeSlot,
  onConfirmAppointment,
}: DoctorCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-40 h-40 bg-gray-100 flex-shrink-0">
            <img
              src={doctor.image || "/placeholder.svg?height=160&width=160"}
              alt={doctor.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                  {doctor.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{doctor.rating}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-4 font-medium">{doctor.specialty}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <GraduationCap className="w-4 h-4 text-teal-600 mr-2" />
                    <span className="text-sm">{doctor.education}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 text-teal-600 mr-2" />
                    <span className="text-sm">{doctor.experience} experience</span>
                  </div>
                  {doctor.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 text-teal-600 mr-2" />
                      <span className="text-sm">{doctor.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 text-teal-600 mr-2" />
                    <span className="text-sm">{doctor.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 text-teal-600 mr-2" />
                    <span className="text-sm">{doctor.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col md:mt-0 md:ml-4 md:text-right">
                <div className="flex flex-col gap-y-4 h-52">
                  {doctor.availability && (
                    <div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${doctor.availability.includes("Available today")
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        {doctor.availability}
                      </span>
                    </div>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-teal-600 hover:bg-teal-700 w-full md:w-auto"
                        onClick={() => onBookAppointment(doctor)}
                      >
                        Book Appointment
                      </Button>
                    </DialogTrigger>
                    <AppointmentDialog
                      selectedDoctor={selectedDoctor}
                      selectedDate={selectedDate}
                      selectedTimeSlot={selectedTimeSlot}
                      setSelectedDate={setSelectedDate}
                      setSelectedTimeSlot={setSelectedTimeSlot}
                      onConfirmAppointment={onConfirmAppointment}
                    />
                  </Dialog>
                </div>
              </div>

            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DoctorCard
