"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Phone, Mail } from "lucide-react"
import type { Appointment } from "@/types/appointment"
import type { Doctor } from "@/types/doctor"
import { mockAppointments, updateAppointmentStatus } from "@/data/appointment"
import { mockDoctors } from "@/data/doctors"

interface AppointmentListProps {
  patientID?: string
  doctorID?: string
}

const AppointmentList = ({ patientID, doctorID }: AppointmentListProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors)

  useEffect(() => {
    let filteredAppointments = mockAppointments

    if (patientID) {
      filteredAppointments = filteredAppointments.filter((apt) => apt.patientID === patientID)
    }

    if (doctorID) {
      filteredAppointments = filteredAppointments.filter((apt) => apt.doctorID === doctorID)
    }

    setAppointments(filteredAppointments)
  }, [patientID, doctorID])

  const getDoctorInfo = (doctorID: string): Doctor | undefined => {
    return doctors.find((doctor) => doctor.id === doctorID)
  }

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusUpdate = (appointmentID: string, newStatus: Appointment["status"]) => {
    if (updateAppointmentStatus(appointmentID, newStatus)) {
      setAppointments((prev) =>
        prev.map((apt) => (apt.appointmentID === appointmentID ? { ...apt, status: newStatus } : apt)),
      )
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{patientID ? "My Appointments" : "Doctor Appointments"}</h2>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 text-center">
              {patientID ? "You don't have any appointments scheduled." : "No appointments scheduled for this doctor."}
            </p>
          </CardContent>
        </Card>
      ) : (
        appointments.map((appointment) => {
          const doctor = getDoctorInfo(appointment.doctorID)

          return (
            <Card key={appointment.appointmentID} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{doctor?.name || "Unknown Doctor"}</CardTitle>
                    <p className="text-gray-600">{doctor?.specialty}</p>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-teal-600" />
                      <span>{appointment.appointmentDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-teal-600" />
                      <span>{formatTime(appointment.appointmentTime)}</span>
                    </div>
                  </div>

                  {doctor && (
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-teal-600" />
                        <span>{doctor.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-teal-600" />
                        <span>{doctor.email}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Appointment ID: {appointment.appointmentID}
                  <br />
                  Created: {appointment.createdAt.toLocaleDateString()} at {appointment.createdAt.toLocaleTimeString()}
                </div>

                {appointment.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusUpdate(appointment.appointmentID, "confirmed")}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleStatusUpdate(appointment.appointmentID, "cancelled")}
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {appointment.status === "confirmed" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleStatusUpdate(appointment.appointmentID, "completed")}
                    >
                      Mark Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleStatusUpdate(appointment.appointmentID, "cancelled")}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}

export default AppointmentList
