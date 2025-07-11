import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, User, MapPin, ClipboardList, AlertCircle } from "lucide-react"
import type { Appointment } from "@/types/appointment"
import { formatDate, formatTimeFromISO } from "@/lib/DateTimeUtils"
import { calculateDuration } from "@/lib/AppointmentUtils"

interface DoctorAppointmentCardProps {
  appointment: Appointment
  onViewDetails?: (appointmentID: string) => void
  onStartSession?: (appointmentID: string) => void
  onReschedule?: (appointmentID: string) => void
}

export function DoctorAppointmentCard({
  appointment,
  onViewDetails,
  onStartSession,
  onReschedule,
}: DoctorAppointmentCardProps) {
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case "EMERGENCY":
        return "bg-red-100 text-red-800 border-red-200"
      case "CONSULTATION":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "CHECKUP":
        return "bg-green-100 text-green-800 border-green-200"
      case "FOLLOW-UP":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const isUrgent = appointment.type === "EMERGENCY"

  return (
    <Card className={isUrgent ? "border-red-300 bg-red-50" : ""}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isUrgent ? "bg-red-100" : "bg-blue-100"
              }`}
            >
              {isUrgent ? <AlertCircle className="h-5 w-5 text-red-600" /> : <User className="h-5 w-5 text-blue-600" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900">
                  {appointment.patientName || `Patient ${appointment.patientId}`}
                </h4>
                <Badge variant="outline" className={getTypeColor(appointment.type)}>
                  {appointment.type}
                </Badge>
                {isUrgent && (
                  <Badge variant="outline" className="border-red-500 text-red-600">
                    Urgent
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">Patient ID: {appointment.patientId}</p>
              <p className="text-sm text-gray-500">
                {formatDate(appointment.startTime)} at {formatTimeFromISO(appointment.startTime)}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(appointment.status)}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).toLowerCase()}
          </Badge>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 text-gray-400 mr-2" />
            <span>
              {formatTimeFromISO(appointment.startTime)} • {calculateDuration(appointment.startTime, appointment.endTime)}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
            <span>Main Hospital</span>
          </div>
        </div>

        {appointment.reason && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
            <ClipboardList className="h-4 w-4 text-gray-400 mr-2 inline-block" />
            <span>{appointment.reason}</span>
          </div>
        )}

        {appointment.description && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
            <ClipboardList className="h-4 w-4 text-gray-400 mr-2 inline-block" />
            <span>{appointment.description}</span>
          </div>
        )}

        <div className="mt-4 flex space-x-2">
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => onViewDetails?.(appointment.id)}>
            View Details
          </Button>
          <Button variant="outline" onClick={() => onStartSession?.(appointment.id)}>
            Start Session
          </Button>
          {appointment.status === "PENDING" && (
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
              onClick={() => onReschedule?.(appointment.id)}
            >
              Reschedule
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
