import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { DoctorAppointmentCard } from "./AppointmentCard"
import { mockDoctorAppointments } from "@/data/doctor-appointment"
import type { DoctorAppointment } from "@/data/doctor-appointment"

interface DoctorScheduleCalendarProps {
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
  doctorID?: string
}

export function DoctorScheduleCalendar({
  selectedDate,
  setSelectedDate,
  doctorID = "550e8400-e29b-41d4-a716-446655440001",
}: DoctorScheduleCalendarProps) {
  const getAppointmentsForDate = (date: Date | undefined): DoctorAppointment[] => {
    if (!date) return []

    // Filter appointments for the selected date and doctor
    return mockDoctorAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate)
      return appointment.doctorID === doctorID && appointmentDate.toDateString() === date.toDateString()
    })
  }

  const appointmentsForSelectedDate = getAppointmentsForDate(selectedDate)

  const handleViewDetails = (appointmentID: string) => {
    console.log("View details for appointment:", appointmentID)
    // In a real app, navigate to appointment details
  }

  const handleStartSession = (appointmentID: string) => {
    console.log("Start session for appointment:", appointmentID)
    // In a real app, start the appointment session
  }

  const handleReschedule = (appointmentID: string) => {
    console.log("Reschedule appointment:", appointmentID)
    // In a real app, open reschedule dialog
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardContent className="p-4">
          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
        </CardContent>
      </Card>

      <div className="md:col-span-2 space-y-4">
        <h3 className="text-xl font-semibold">
          {selectedDate
            ? selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "Select a date"}
        </h3>

        {appointmentsForSelectedDate.length > 0 ? (
          <div className="space-y-4">
            {appointmentsForSelectedDate.map((appointment) => (
              <DoctorAppointmentCard
                key={appointment.appointmentID}
                appointment={{
                  ...appointment,
                  patientName: appointment.patientName,
                  duration: appointment.duration,
                  type: appointment.type,
                  location: "Room 203", // You can add this to your appointment type
                  isUrgent: appointment.isUrgent,
                  notes: appointment.reason,
                }}
                onViewDetails={handleViewDetails}
                onStartSession={handleStartSession}
                onReschedule={handleReschedule}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No appointments scheduled for this date.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
