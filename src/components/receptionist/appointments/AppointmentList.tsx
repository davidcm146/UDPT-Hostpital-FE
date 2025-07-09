import { Card, CardContent } from "@/components/ui/card"
import { AppointmentCard } from "./AppointmentCard"
import type { Appointment } from "@/types/appointment"

interface AppointmentListProps {
  appointments: Appointment[]
  emptyMessage: string
  onEdit?: (appointmentID: string) => void
  onDecline?: (appointmentID: string) => void
}

export function AppointmentList({ appointments, emptyMessage, onEdit, onDecline }: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">{emptyMessage}</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onEdit={onEdit}
          onDecline={onDecline}
        />
      ))}
    </div>
  )
}
