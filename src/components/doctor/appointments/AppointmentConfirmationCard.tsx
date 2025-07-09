import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AppointmentService } from "@/services/appointmentService"
import { toast } from "react-toastify"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Calendar,
  Clock,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle,
  X,
  CalendarCheck,
  CalendarX,
  ClipboardList,
} from "lucide-react"
import type { Appointment } from "@/types/appointment"

interface AppointmentConfirmationCardProps {
  appointment: Appointment
  onConfirm?: (appointmentID: string) => void
  onDecline?: (appointmentID: string, reason: string) => void
  onCancel?: (appointmentID: string) => void
}

export function AppointmentConfirmationCard({
  appointment,
  onConfirm,
  onDecline,
}: AppointmentConfirmationCardProps) {
  const [declineReason, setDeclineReason] = useState("")
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false)

  const handleConfirm = async () => {
    try {
      await AppointmentService.updateAppointmentStatus(appointment.id, { action: "CONFIRMED" })
      onConfirm?.(appointment.id)
    } catch (error) {
      console.error(error)
      toast.error("Failed to confirm appointment.")
    }
  }


  const handleDecline = async () => {
    if (!declineReason.trim()) return

    try {
      await AppointmentService.updateAppointmentStatus(appointment.id, {
        action: "CANCELLED",
        cancelReason: declineReason.trim(),
      })
      toast.success("Appointment declined successfully!")
      onDecline?.(appointment.id, declineReason.trim())
      setDeclineReason("")
      setIsDeclineDialogOpen(false)
    } catch (error) {
      console.error(error)
      toast.error("Failed to decline appointment.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200"
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

  const formatTime = (timeString: string) => {
    // timeString format: "YYYY-MM-DD HH:mm:ss"
    const time = timeString.split(" ")[1]
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (timeString: string) => {
    // timeString format: "YYYY-MM-DD HH:mm:ss"
    const date = new Date(timeString.replace(" ", "T"))
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime.replace(" ", "T"))
    const end = new Date(endTime.replace(" ", "T"))
    const diffMs = end.getTime() - start.getTime()
    const diffMins = Math.round(diffMs / (1000 * 60))
    return `${diffMins} min`
  }

  const isUrgent = appointment.type === "EMERGENCY"
  const isPending = appointment.status === "PENDING"
  const isConfirmed = appointment.status === "CONFIRMED"
  const isCancelled = appointment.status === "CANCELLED"

  return (
    <Card className={`${isUrgent ? "border-red-300 bg-red-50" : ""} hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start space-x-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${isUrgent ? "bg-red-100" : "bg-blue-100"
                }`}
            >
              {isUrgent ? (
                <AlertTriangle className="h-6 w-6 text-red-600" />
              ) : (
                <User className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-lg text-gray-900">
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
              <p className="text-sm text-gray-600 mb-1">Patient ID: {appointment.patientId}</p>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(appointment.startTime)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                  <span className="ml-2 text-gray-500">
                    ({calculateDuration(appointment.startTime, appointment.endTime)})
                  </span>
                </span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(appointment.status)}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).toLowerCase()}
          </Badge>
        </div>

        {/* Appointment Details */}
        {appointment.reason && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              <ClipboardList className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Reason for Visit:</p>
                <p className="text-sm text-gray-600">{appointment.reason}</p>
              </div>
            </div>
          </div>
        )}

        {appointment.description && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              <ClipboardList className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Additional Notes:</p>
                <p className="text-sm text-gray-600">{appointment.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Status-specific information */}
        {isConfirmed && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start">
              <CalendarCheck className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Appointment Confirmed</p>
                <p className="text-sm text-green-600">
                  Scheduled for {formatDate(appointment.startTime)} at {formatTime(appointment.startTime)}
                </p>
              </div>
            </div>
          </div>
        )}

        {isCancelled && appointment.cancelReason && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start">
              <CalendarX className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">Appointment Cancelled</p>
                <p className="text-sm text-red-600">Reason: {appointment.cancelReason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="h-4 w-4 mr-2" />
          <span>Main Hospital - Room TBD</span>
        </div>

        {/* Action buttons based on status */}
        {isPending && onConfirm && onDecline && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700 flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Appointment
            </Button>

            <Button variant="outline" className="flex-1 bg-transparent">
              <Calendar className="h-4 w-4 mr-2" />
              Suggest Alternative
            </Button>

            <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 bg-transparent"
                >
                  <X className="h-4 w-4 mr-2" />
                  Decline
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Decline Appointment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Please provide a reason for declining this appointment with{" "}
                    {appointment.patientName || `Patient ${appointment.patientId}`}.
                  </p>
                  <Textarea
                    placeholder="Enter reason for declining..."
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleDecline}
                      disabled={!declineReason.trim()}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Decline Appointment
                    </Button>
                    <Button variant="outline" onClick={() => setIsDeclineDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Actions for confirmed/completed appointments */}
        {!isPending && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="bg-teal-600 hover:bg-teal-700 flex-1">
              <User className="h-4 w-4 mr-2" />
              View Patient Record
            </Button>

            {isConfirmed && (
              <Button variant="outline" className="flex-1 bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                Reschedule
              </Button>
            )}
          </div>
        )}

        {/* Appointment metadata */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>
              Requested on:{" "}
              {new Date(appointment.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {appointment.updatedAt !== appointment.createdAt && (
              <span>
                Last updated:{" "}
                {new Date(appointment.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
