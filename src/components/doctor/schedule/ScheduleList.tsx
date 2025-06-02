import { DoctorAppointmentCard } from "./AppointmentCard"
import { mockDoctorAppointments } from "@/data/doctor-appointment"
import type { DoctorAppointment } from "@/data/doctor-appointment"

interface DoctorScheduleListProps {
  date?: Date
  isUpcoming?: boolean
  doctorID?: string
}

export function DoctorScheduleList({
  date,
  isUpcoming = false,
  doctorID = "550e8400-e29b-41d4-a716-446655440001",
}: DoctorScheduleListProps) {
  const getFilteredAppointments = (): DoctorAppointment[] => {
    let filteredAppointments = mockDoctorAppointments.filter((appointment) => appointment.doctorID === doctorID)

    if (date && !isUpcoming) {
      // Filter for specific date (today's appointments)
      filteredAppointments = filteredAppointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate)
        return appointmentDate.toDateString() === date.toDateString()
      })
    } else if (isUpcoming) {
      // Filter for upcoming appointments (future dates)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      filteredAppointments = filteredAppointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate)
        return appointmentDate >= today
      })

      // Sort by date and time
      filteredAppointments.sort((a, b) => {
        const dateA = new Date(a.appointmentDate)
        const dateB = new Date(b.appointmentDate)
        if (dateA.getTime() === dateB.getTime()) {
          return a.appointmentTime.localeCompare(b.appointmentTime)
        }
        return dateA.getTime() - dateB.getTime()
      })
    }

    return filteredAppointments
  }

  const appointments = getFilteredAppointments()

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

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {isUpcoming ? "No upcoming appointments scheduled." : "No appointments for this date."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
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
  )
}
