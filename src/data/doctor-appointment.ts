import type { Appointment } from "@/types/appointment"

// Extended appointment interface for doctor view
export interface DoctorAppointment extends Appointment {
  patientName: string
  reason: string
  isUrgent: boolean
  duration: string
  type: string
  confirmedDate?: string
  confirmedTime?: string
  declineReason?: string
}

// Mock appointments data for doctor view
export const mockDoctorAppointments: DoctorAppointment[] = [
  {
    appointmentID: "apt-001",
    patientID: "550e8400-e29b-41d4-a716-446655440999",
    doctorID: "550e8400-e29b-41d4-a716-446655440001",
    status: "pending",
    appointmentDate: new Date("2025-05-25"),
    appointmentTime: "09:00",
    createdAt: new Date("2025-05-20T10:30:00"),
    patientName: "John Smith",
    reason: "Post-surgery follow-up appointment",
    isUrgent: false,
    duration: "30 min",
    type: "Follow-up",
  },
  {
    appointmentID: "apt-002",
    patientID: "550e8400-e29b-41d4-a716-446655440998",
    doctorID: "550e8400-e29b-41d4-a716-446655440001",
    status: "pending",
    appointmentDate: new Date("2025-05-25"),
    appointmentTime: "10:30",
    createdAt: new Date("2025-05-20T14:20:00"),
    patientName: "Emily Johnson",
    reason: "Chest pain and shortness of breath",
    isUrgent: true,
    duration: "45 min",
    type: "Consultation",
  },
  {
    appointmentID: "apt-003",
    patientID: "550e8400-e29b-41d4-a716-446655440997",
    doctorID: "550e8400-e29b-41d4-a716-446655440001",
    status: "pending",
    appointmentDate: new Date("2025-05-26"),
    appointmentTime: "13:15",
    createdAt: new Date("2025-05-21T09:15:00"),
    patientName: "Michael Brown",
    reason: "Annual check-up",
    isUrgent: false,
    duration: "30 min",
    type: "Check-up",
  },
  {
    appointmentID: "apt-004",
    patientID: "550e8400-e29b-41d4-a716-446655440996",
    doctorID: "550e8400-e29b-41d4-a716-446655440001",
    status: "confirmed",
    appointmentDate: new Date("2025-05-24"),
    appointmentTime: "11:00",
    createdAt: new Date("2025-05-19T16:45:00"),
    patientName: "Sarah Williams",
    reason: "New patient consultation",
    isUrgent: false,
    duration: "30 min",
    type: "Consultation",
    confirmedDate: "May 24, 2025",
    confirmedTime: "11:00 AM",
  },
  {
    appointmentID: "apt-005",
    patientID: "550e8400-e29b-41d4-a716-446655440995",
    doctorID: "550e8400-e29b-41d4-a716-446655440001",
    status: "confirmed",
    appointmentDate: new Date("2025-05-24"),
    appointmentTime: "14:30",
    createdAt: new Date("2025-05-18T11:20:00"),
    patientName: "Robert Davis",
    reason: "Medication review",
    isUrgent: false,
    duration: "45 min",
    type: "Follow-up",
    confirmedDate: "May 24, 2025",
    confirmedTime: "2:30 PM",
  },
  {
    appointmentID: "apt-006",
    patientID: "550e8400-e29b-41d4-a716-446655440994",
    doctorID: "550e8400-e29b-41d4-a716-446655440001",
    status: "cancelled",
    appointmentDate: new Date("2025-05-23"),
    appointmentTime: "09:15",
    createdAt: new Date("2025-05-17T13:30:00"),
    patientName: "Jennifer Miller",
    reason: "Regular check-up",
    isUrgent: false,
    duration: "30 min",
    type: "Check-up",
    declineReason: "Doctor unavailable on requested date",
  },
  {
    appointmentID: "apt-007",
    patientID: "550e8400-e29b-41d4-a716-446655440993",
    doctorID: "550e8400-e29b-41d4-a716-446655440001",
    status: "pending",
    appointmentDate: new Date("2025-05-27"),
    appointmentTime: "15:00",
    createdAt: new Date("2025-05-22T08:45:00"),
    patientName: "David Wilson",
    reason: "Chronic pain management",
    isUrgent: true,
    duration: "60 min",
    type: "Consultation",
  },
  {
    appointmentID: "apt-008",
    patientID: "550e8400-e29b-41d4-a716-446655440992",
    doctorID: "550e8400-e29b-41d4-a716-446655440001",
    status: "confirmed",
    appointmentDate: new Date("2025-06-13"),
    appointmentTime: "10:00",
    createdAt: new Date("2025-05-21T15:20:00"),
    patientName: "Lisa Anderson",
    reason: "Blood test results review",
    isUrgent: false,
    duration: "30 min",
    type: "Follow-up",
    confirmedDate: "May 28, 2025",
    confirmedTime: "10:00 AM",
  },
  {
    appointmentID: "apt-009",
    patientID: "550e8400-e29b-41d4-a716-446655440991",
    doctorID: "550e8400-e29b-41d4-a716-446655440001",
    status: "pending",
    appointmentDate: new Date("2025-05-29"),
    appointmentTime: "14:15",
    createdAt: new Date("2025-05-23T12:10:00"),
    patientName: "Mark Thompson",
    reason: "Routine physical examination",
    isUrgent: false,
    duration: "45 min",
    type: "Check-up",
  },
  {
    appointmentID: "apt-010",
    patientID: "550e8400-e29b-41d4-a716-446655440990",
    doctorID: "550e8400-e29b-41d4-a716-446655440001",
    status: "cancelled",
    appointmentDate: new Date("2025-05-30"),
    appointmentTime: "11:30",
    createdAt: new Date("2025-05-24T09:30:00"),
    patientName: "Amanda Garcia",
    reason: "Skin condition evaluation",
    isUrgent: false,
    duration: "30 min",
    type: "Consultation",
    declineReason: "Specialist referral required",
  },
]

// Helper functions
export const getAppointmentsByDoctor = (doctorID: string): DoctorAppointment[] => {
  return mockDoctorAppointments.filter((apt) => apt.doctorID === doctorID)
}

export const getAppointmentsByStatus = (status: string): DoctorAppointment[] => {
  return mockDoctorAppointments.filter((apt) => apt.status === status)
}

export const confirmAppointment = (appointmentID: string): boolean => {
  const appointment = mockDoctorAppointments.find((apt) => apt.appointmentID === appointmentID)
  if (appointment) {
    appointment.status = "confirmed"
    appointment.confirmedDate = appointment.appointmentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const [hours, minutes] = appointment.appointmentTime.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    appointment.confirmedTime = `${displayHour}:${minutes} ${ampm}`
    return true
  }
  return false
}

export const declineAppointment = (appointmentID: string, reason: string): boolean => {
  const appointment = mockDoctorAppointments.find((apt) => apt.appointmentID === appointmentID)
  if (appointment) {
    appointment.status = "cancelled"
    appointment.declineReason = reason
    return true
  }
  return false
}

export const confirmAllPendingAppointments = (doctorID: string): number => {
  const pendingAppointments = mockDoctorAppointments.filter(
    (apt) => apt.doctorID === doctorID && apt.status === "pending",
  )

  pendingAppointments.forEach((apt) => {
    confirmAppointment(apt.appointmentID)
  })

  return pendingAppointments.length
}
