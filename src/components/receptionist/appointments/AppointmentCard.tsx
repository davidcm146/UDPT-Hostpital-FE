"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Edit, X, Trash2 } from "lucide-react"
import type { Appointment } from "@/types/appointment"

interface AppointmentCardProps {
  appointment: Appointment
  patientName?: string
  doctorName?: string
  onEdit: (appointment: Appointment) => void
  onCancel: (appointmentID: string) => void
  onDelete: (appointmentID: string) => void
}

export function AppointmentCard({
  appointment,
  patientName = "Unknown Patient",
  doctorName = "Unknown Doctor",
  onEdit,
  onCancel,
  onDelete,
}: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      case "pending":
        return "Pending"
      default:
        return status
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h4 className="font-medium">{patientName}</h4>
              <Badge variant="secondary">#{appointment.appointmentID.slice(-8)}</Badge>
              <Badge className={getStatusColor(appointment.status)}>{getStatusText(appointment.status)}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {appointment.appointmentTime}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {doctorName}
              </div>
              <div>Date: {appointment.appointmentDate.toLocaleDateString()}</div>
              <div>Created: {appointment.createdAt.toLocaleDateString()}</div>
            </div>
          </div>

          <div className="flex space-x-2 ml-4">
            <Button size="sm" variant="outline" onClick={() => onEdit(appointment)}>
              <Edit className="h-4 w-4" />
            </Button>
            {(appointment.status === "confirmed" || appointment.status === "pending") && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => onCancel(appointment.appointmentID)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={() => onDelete(appointment.appointmentID)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
