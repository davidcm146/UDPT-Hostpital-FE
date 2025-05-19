"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMapMarkerAlt, faCalendarAlt, faGraduationCap, faLanguage } from "@fortawesome/free-solid-svg-icons"
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
            <img src={doctor.image || "/placeholder.svg"} alt={doctor.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-gray-600 mb-2">{doctor.specialty}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 text-teal-600 mr-2" />
                    <span>{doctor.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faGraduationCap} className="w-5 text-teal-600 mr-2" />
                    <span>
                      {doctor.education} • {doctor.experience} experience
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faLanguage} className="w-5 text-teal-600 mr-2" />
                    <span>{doctor.languages.join(", ")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 md:ml-4 md:text-right">
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      doctor.availability.includes("Available today")
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                    {doctor.availability}
                  </span>
                </div>
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

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-600 text-sm line-clamp-2">{doctor.about}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DoctorCard
