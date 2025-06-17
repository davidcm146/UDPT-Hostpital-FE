"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Stethoscope, Eye, Edit, X } from "lucide-react"
import type { Appointment } from "@/types/appointment"
import { getDoctorById } from "@/data/doctors"

interface AppointmentCardProps {
  appointment: Appointment
  onViewDetails: () => void
  onEdit: () => void
  onDecline: () => void
}

export const AppointmentCard = ({ appointment, onViewDetails, onEdit, onDecline }: AppointmentCardProps) => {
  const doctor = getDoctorById(appointment.doctorID)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "EMERGENCY":
        return "bg-red-100 text-red-800"
      case "CHECKUP":
        return "bg-blue-100 text-blue-800"
      case "FOLLOW-UP":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
              <Badge variant="outline" className={getTypeColor(appointment.type)}>
                {appointment.type}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4" />
                <span className="font-medium">{doctor?.name || "Unknown Doctor"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Stethoscope className="h-4 w-4" />
                <span>{doctor?.specialty || "General"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(appointment.appointmentDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  {appointment.startTime} - {appointment.endTime}
                </span>
              </div>
            </div>

            {appointment.reason && (
              <div className="text-sm text-gray-600">
                <strong>Reason:</strong> {appointment.reason}
              </div>
            )}

            {appointment.cancelReason && (
              <div className="text-sm text-red-600">
                <strong>Cancel Reason:</strong> {appointment.cancelReason}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={onViewDetails} className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Details
            </Button>

            {appointment.status !== "CANCELLED" && (
              <>
                <Button variant="outline" size="sm" onClick={onEdit} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>

                {appointment.status === "PENDING" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDecline}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                    Decline
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
