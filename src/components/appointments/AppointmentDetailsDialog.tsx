import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, User, Stethoscope, FileText, Phone, Mail } from "lucide-react"
import type { Appointment } from "@/types/appointment"
import { getDoctorById } from "@/data/doctors"
import { formatDate } from "@/lib/DateTimeUtils"

interface AppointmentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointmentId: string | null
  appointments: Appointment[]
}

export const AppointmentDetailsDialog = ({
  open,
  onOpenChange,
  appointmentId,
  appointments,
}: AppointmentDetailsDialogProps) => {
  const appointment = appointments.find((apt) => apt.appointmentID === appointmentId)
  const doctor = appointment ? getDoctorById(appointment.doctorID) : null

  if (!appointment || !doctor) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
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
      case "FOLLOW-UP":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-4xl max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Appointment Details</DialogTitle>
          <DialogDescription>Complete information about this appointment</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Type */}
          <div className="flex gap-3">
            <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
            <Badge variant="outline" className={getTypeColor(appointment.type)}>
              {appointment.type}
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
                  <p className="font-medium">{formatDate(appointment.appointmentDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">
                    {appointment.startTime} - {appointment.endTime}
                  </p>
                </div>
              </div>
            </div>

            {appointment.reason && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-teal-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Reason</p>
                  <p className="font-medium">{appointment.reason}</p>
                </div>
              </div>
            )}

            {appointment.cancelReason && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Cancellation Reason</p>
                  <p className="font-medium text-red-600">{appointment.cancelReason}</p>
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
                src={doctor.avatar || "/placeholder.svg"}
                alt={doctor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-lg">{doctor.name}</h4>
                <p className="text-teal-600 font-medium">{doctor.specialty}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">{doctor.experience}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-500">Education</p>
                  <p className="font-medium">{doctor.education}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{doctor.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{doctor.email}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Timeline</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Created:</strong> {new Date(appointment.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Last Updated:</strong> {new Date(appointment.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
