export interface Appointment {
  appointmentID: string // uuid
  patientID: string // uuid
  doctorID: string // uuid
  status: "pending" | "confirmed" | "cancelled" | "completed" // varchar
  appointmentDate: Date // Date
  appointmentTime: string // Time (stored as string like "09:00")
  createdAt: Date // Datetime
}

export interface CreateAppointmentRequest {
  patientID: string
  doctorID: string
  appointmentDate: Date
  appointmentTime: string
}

