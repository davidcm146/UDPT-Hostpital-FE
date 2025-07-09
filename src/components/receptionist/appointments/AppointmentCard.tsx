"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Edit, X } from "lucide-react"
import type { Appointment } from "@/types/appointment"
import { formatDate, formatTimeFromISO } from "@/lib/DateTimeUtils"

interface AppointmentCardProps {
  appointment: Appointment
  onEdit?: (appointmentID: string) => void
  onDecline?: (appointmentID: string) => void
}

export function AppointmentCard({ appointment, onEdit, onDecline }: AppointmentCardProps) {
  // Format date from datetime string (e.g., "2025-07-09 08:15:00")

  // Get status badge color
  const getStatusBadgeColor = (status: Appointment["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "CONFIRMED":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  // Get status text
  const getStatusText = (status: Appointment["status"]) => {
    switch (status) {
      case "PENDING":
        return "Pending"
      case "CONFIRMED":
        return "Confirmed"
      case "CANCELLED":
        return "Cancelled"
      case "COMPLETED":
        return "Completed"
      default:
        return status
    }
  }

  // Badge color for appointment type
  const getTypeBadgeColor = (type: Appointment["type"]) => {
    switch (type) {
      case "EMERGENCY":
        return "bg-red-100 text-red-800"
      case "FOLLOW-UP":
        return "bg-green-100 text-green-800"
      case "CHECKUP":
        return "bg-blue-100 text-blue-800"
      case "CONSULTATION":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="bg-white hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {appointment.doctorName}
            </h3>
            <span className="text-sm text-gray-500">#{appointment.id.slice(-8)}</span>
            <Badge className={getStatusBadgeColor(appointment.status)}>{getStatusText(appointment.status)}</Badge>
            <Badge className={getTypeBadgeColor(appointment.type)}>{appointment.type}</Badge>
          </div>
          <div className="flex space-x-1">
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                onClick={() => onEdit(appointment.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDecline && appointment.status === "PENDING" && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                onClick={() => onDecline(appointment.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>
              {formatTimeFromISO(appointment.startTime)} - {formatTimeFromISO(appointment.endTime)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{appointment.doctorName}</span>
          </div>
          <div>
            <span className="font-medium">Date:</span> {formatDate(appointment.startTime?.replace(" ", "T") || "")}
          </div>
          <div>
            <span className="font-medium">Created:</span> {formatDate(appointment.createdAt)}
          </div>
        </div>

        {/* Reason */}
        {appointment.reason && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Reason:</span>
              <span className="text-gray-600 ml-2">{appointment.reason}</span>
            </div>
          </div>
        )}

        {/* Cancel Reason */}
        {appointment.cancelReason && appointment.status === "CANCELLED" && (
          <div className="mt-2">
            <div className="text-sm">
              <span className="font-medium text-red-700">Cancel Reason:</span>
              <span className="text-red-600 ml-2">{appointment.cancelReason}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
