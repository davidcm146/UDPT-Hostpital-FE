export interface Appointment {
  appointmentID: string // uuid
  patientID: string // uuid
  doctorID: string // uuid
  status: "PENDING" | "CONFIRMED" | "CANCELLED" // varchar
  type: "EMERGENCY" | "CHECKUP" | "FOLLOW-UP"
  appointmentDate: Date | string // Date
  startTime: string // Time (stored as string like "09:00")
  endTime: string
  reason?: string
  cancelReason?: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface CreateAppointmentRequest {
  patientID: string
  doctorID: string
  appointmentDate: Date
  startTime: string
  endTime: string
}
