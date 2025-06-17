import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Edit, X } from "lucide-react"
import type { Appointment } from "@/types/appointment"
import { getStatusBadgeColor, getStatusText } from "@/lib/AppointmentUtils"
import { getPatientById } from "@/data/patient"
import { formatDate, formatTime } from "@/lib/DateTimeUtils"

interface AppointmentCardProps {
  appointment: Appointment
  onEdit?: (appointmentID: string) => void
  onDecline?: (appointmentID: string) => void
}

export function AppointmentCard({ appointment, onEdit, onDecline }: AppointmentCardProps) {
  const patientName = getPatientById(appointment.patientID)?.name
  const appointmentDate =
    typeof appointment.appointmentDate === "string"
      ? new Date(appointment.appointmentDate)
      : appointment.appointmentDate

  const createdDate =
    typeof appointment.createdAt === "string" ? new Date(appointment.createdAt) : appointment.createdAt

  const getDoctorName = (doctorID: string) => {
    const doctorNames: Record<string, string> = {
      "550e8400-e29b-41d4-a716-446655440001": "Dr. Sarah Wilson",
      "550e8400-e29b-41d4-a716-446655440002": "Dr. Michael Chen",
      "550e8400-e29b-41d4-a716-446655440003": "Dr. Emily Davis",
    }
    return doctorNames[doctorID] || "Unknown Doctor"
  }

  // Badge màu cho type
  const getTypeBadgeColor = (type: Appointment["type"]) => {
    switch (type) {
      case "EMERGENCY":
        return "bg-red-100 text-red-800"
      case "FOLLOW-UP":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="bg-white hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">{patientName}</h3>
            <span className="text-sm text-gray-500">#{appointment.appointmentID.slice(-8)}</span>
            <Badge className={getStatusBadgeColor(appointment.status)}>{getStatusText(appointment.status)}</Badge>
            <Badge className={getTypeBadgeColor(appointment.type)}>{appointment.type}</Badge>
          </div>

          <div className="flex space-x-1">
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                onClick={() => onEdit(appointment.appointmentID)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDecline && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                onClick={() => onDecline(appointment.appointmentID)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{getDoctorName(appointment.doctorID)}</span>
          </div>
          <div>
            Date:{" "}
            {formatDate(appointmentDate)}
          </div>
          <div>
            Created:{" "}
            {formatDate(createdDate)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
