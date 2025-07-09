"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, X } from "lucide-react"
import { AppointmentService } from "@/services/appointmentService"
import type { Appointment } from "@/types/appointment"
import { formatDate, formatTimeFromISO } from "@/lib/DateTimeUtils"

interface CancelAppointmentDialogProps {
  appointment: Appointment
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (updatedAppointment: Appointment) => void
}

export const CancelAppointmentDialog = ({
  appointment,
  open,
  onOpenChange,
  onSuccess,
}: CancelAppointmentDialogProps) => {
  const [cancelReason, setCancelReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      setError("Please provide a reason for cancellation")
      return
    }

    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    try {
      const updatedAppointment = await AppointmentService.updateAppointmentStatus(
        appointment.id,
        {
          action: "CANCELLED",
          cancelReason: cancelReason.trim(),
        },
        controller.signal
      )

      onSuccess(updatedAppointment)
      onOpenChange(false)
      setCancelReason("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel appointment")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false)
      setCancelReason("")
      setError(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <X className="h-5 w-5 text-red-600" />
            Cancel Appointment
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for cancelling this appointment with{" "}
            <span className="font-medium">{appointment.doctorName}</span> on{" "}
            <span className="font-medium">
              {formatDate(appointment.startTime.replace(" ", "T"))} {formatTimeFromISO(appointment.startTime)} - {formatTimeFromISO(appointment.endTime)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cancelReason">Cancellation Reason *</Label>
            <Textarea
              id="cancelReason"
              placeholder="Please explain why you need to cancel this appointment..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              disabled={isLoading}
              className="min-h-[100px]"
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Keep Appointment
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isLoading || !cancelReason.trim()}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Cancel Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
