import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { Calendar, Clock, FileText } from "lucide-react"
import type { Appointment } from "@/types/appointment"
import { AppointmentService } from "@/services/appointmentService"
import { formatDate, formatTimeFromISO } from "@/lib/DateTimeUtils"

interface AppointmentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointmentId: string | null
}

export const AppointmentDetailsDialog = ({
  open,
  onOpenChange,
  appointmentId,
}: AppointmentDetailsDialogProps) => {
  const [appointmentDetails, setAppointmentDetails] = useState<Appointment | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!appointmentId || !open) {
        setAppointmentDetails(null)
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const appointment = await AppointmentService.getAppointmentById(appointmentId)
        setAppointmentDetails(appointment)
      } catch (err: any) {
        console.error("Error fetching appointment details:", err)
        setError(err.message || "Failed to load appointment details")
        setAppointmentDetails(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointmentDetails()
  }, [appointmentId, open])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "EMERGENCY":
        return "bg-red-100 text-red-800"
      case "CHECKUP":
        return "bg-blue-100 text-blue-800"
      case "CONSULTATION":
        return "bg-green-100 text-green-800"
      case "FOLLOW-UP":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-4xl max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Appointment Details</DialogTitle>
          <DialogDescription>Complete information about this appointment</DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600 mr-2" />
            <span className="text-gray-600">Loading appointment details...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {appointmentDetails && !isLoading && !error && (
          <div className="space-y-6">
            {/* Status and Type */}
            <div className="flex gap-3">
              <Badge className={getStatusColor(appointmentDetails.status)}>{appointmentDetails.status}</Badge>
              <Badge variant="outline" className={getTypeColor(appointmentDetails.type)}>
                {appointmentDetails.type}
              </Badge>
            </div>

            <Separator />

            {/* Appointment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Appointment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(appointmentDetails.startTime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">
                      {formatTimeFromISO(appointmentDetails.startTime)} - {formatTimeFromISO(appointmentDetails.endTime)}
                    </p>
                  </div>
                </div>
              </div>
              {appointmentDetails.reason && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="font-medium">{appointmentDetails.reason}</p>
                  </div>
                </div>
              )}
              {appointmentDetails.description && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium">{appointmentDetails.description}</p>
                  </div>
                </div>
              )}
              {appointmentDetails.cancelReason && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Cancellation Reason</p>
                    <p className="font-medium text-red-600">{appointmentDetails.cancelReason}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Doctor Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Doctor Information</h3>
              <div className="flex items-center gap-4">
                <img
                  src="/placeholder.svg?height=64&width=64"
                  alt={appointmentDetails.doctorName || "Doctor"}
                  className="w-16 h-16 rounded-full object-cover bg-gray-100"
                />
                <div>
                  <h4 className="font-semibold text-lg">{appointmentDetails.doctorName || "Unknown Doctor"}</h4>
                  {/* <p className="text-teal-600 font-medium">Doctor ID: {appointmentDetails.doctorId}</p> */}
                </div>
              </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Timeline</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Created:</strong> {formatDate(appointmentDetails.createdAt)}
                </p>
                <p>
                  <strong>Last Updated:</strong> {formatDate(appointmentDetails.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
