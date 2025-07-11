import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Eye, Edit, X } from "lucide-react"
import type { Appointment } from "@/types/appointment"
import { formatDate, formatTimeFromISO } from "@/lib/DateTimeUtils"
import { CancelAppointmentDialog } from "./CancelDialog"

interface AppointmentCardProps {
  appointment: Appointment
  onViewDetails: () => void
  onEdit: () => void
  onAppointmentUpdate?: (updatedAppointment: Appointment) => void
}

export const AppointmentCard = ({ appointment, onViewDetails, onEdit, onAppointmentUpdate }: AppointmentCardProps) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
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
      case "CONSULTATION":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCancelSuccess = (updatedAppointment: Appointment) => {
    onAppointmentUpdate?.(updatedAppointment)
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
            {/* Left Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                <Badge variant="outline" className={getTypeColor(appointment.type)}>
                  {appointment.type}
                </Badge>
              </div>

              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-teal-600" />
                  <span className="font-medium">{appointment?.doctorName || "Unknown Doctor"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-teal-600" />
                  <span>
                    {formatDate(appointment?.startTime?.replace(" ", "T") || "")} {formatTimeFromISO(appointment.startTime)} - {formatTimeFromISO(appointment.endTime)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal-600" />
                  <span>
                    <span className="font-medium">Booked on:</span> {formatDate(appointment.createdAt)}
                  </span>
                </div>

                {appointment.reason && (
                  <div>
                    <span className="font-medium">Reason:</span> {appointment.reason}
                  </div>
                )}

                {appointment.cancelReason && (
                  <div className="text-red-600">
                    <span className="font-semibold">Cancel Reason:</span> {appointment.cancelReason}
                  </div>
                )}
              </div>
            </div>

            {/* Right Section: Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 md:ml-4">
              <Button variant="outline" size="sm" onClick={onViewDetails}>
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>

              {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" && (
                <>
                  <Button variant="outline" size="sm" onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>

                  {appointment.status === "PENDING" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCancelDialog(true)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <CancelAppointmentDialog
        appointment={appointment}
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onSuccess={handleCancelSuccess}
      />
    </>
  )
}
