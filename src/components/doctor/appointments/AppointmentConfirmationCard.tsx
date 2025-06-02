"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ClipboardList, AlertTriangle, CalendarCheck, CalendarX } from "lucide-react"
import type { Appointment } from "@/types/appointment"
import { mockDoctors } from "@/data/doctors"

interface AppointmentConfirmationCardProps {
  appointment: Appointment & {
    patientName?: string
    reason?: string
    isUrgent?: boolean
    confirmedDate?: string
    confirmedTime?: string
    declineReason?: string
    duration?: string
    type?: string
  }
  onConfirm?: (appointmentID: string) => void
  onDecline?: (appointmentID: string, reason: string) => void
  onCancel?: (appointmentID: string) => void
}

export function AppointmentConfirmationCard({
  appointment,
  onConfirm,
  onDecline,
  onCancel,
}: AppointmentConfirmationCardProps) {
  const doctor = mockDoctors.find((d) => d.id === appointment.doctorID)

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <Card className={appointment.isUrgent ? "border-red-300 bg-red-50" : ""}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                appointment.isUrgent ? "bg-red-100" : "bg-blue-100"
              }`}
            >
              {appointment.isUrgent ? (
                <AlertTriangle className={`h-5 w-5 text-red-600`} />
              ) : (
                <User className={`h-5 w-5 text-blue-600`} />
              )}
            </div>
            <div>
              <div className="flex items-center">
                <h4 className="font-medium text-gray-900">
                  {appointment.patientName || `Patient ${appointment.patientID}`}
                </h4>
                <Badge
                  variant={appointment.isUrgent ? "outline" : "secondary"}
                  className={`ml-2 ${appointment.isUrgent ? "border-red-500 text-red-600" : ""}`}
                >
                  {appointment.isUrgent ? "Urgent" : appointment.type || "Appointment"}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">Patient ID: {appointment.patientID}</p>
              {doctor && <p className="text-sm text-gray-500">Doctor: {doctor.name}</p>}
            </div>
          </div>
          <Badge variant="outline" className={`${getStatusColor(appointment.status)}`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Badge>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <span>
              Requested: {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentTime)}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 text-gray-400 mr-2" />
            <span>Duration: {appointment.duration || "30 min"}</span>
          </div>
        </div>

        {appointment.reason && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
            <ClipboardList className="h-4 w-4 text-gray-400 mr-2 inline" />
            <span>Reason: {appointment.reason}</span>
          </div>
        )}

        {appointment.status === "confirmed" && appointment.confirmedDate && appointment.confirmedTime && (
          <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-800">
            <CalendarCheck className="h-4 w-4 text-green-600 mr-2 inline" />
            <span>
              Confirmed for {appointment.confirmedDate} at {appointment.confirmedTime}
            </span>
          </div>
        )}

        {appointment.status === "cancelled" && appointment.declineReason && (
          <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-800">
            <CalendarX className="h-4 w-4 text-red-600 mr-2 inline" />
            <span>Reason for cancellation: {appointment.declineReason}</span>
          </div>
        )}

        {appointment.status === "pending" && (
          <div className="mt-4 flex space-x-2">
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => onConfirm?.(appointment.appointmentID)}>
              <CalendarCheck className="mr-2 h-4 w-4" />
              Confirm
            </Button>
            <Button variant="outline">Suggest Alternative</Button>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDecline?.(appointment.appointmentID, "Doctor unavailable")}
            >
              <CalendarX className="mr-2 h-4 w-4" />
              Decline
            </Button>
          </div>
        )}

        {appointment.status !== "pending" && (
          <div className="mt-4 flex space-x-2">
            <Button className="bg-teal-600 hover:bg-teal-700">View Patient Record</Button>
            {appointment.status === "confirmed" && (
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onCancel?.(appointment.appointmentID)}
              >
                Cancel Appointment
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
