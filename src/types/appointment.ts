
export interface Appointment {
  id: string
  patientId: string
  patientName: string | null
  doctorId: string
  doctorName: string | null
  description: string | null
  status: AppointmentStatus
  type: "CONSULTATION" | "CHECKUP" | "FOLLOW-UP" | "EMERGENCY"
  reason: string
  cancelReason: string | null
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
}

type AppointmentAction = "CONFIRMED" | "CANCELLED"
type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"

export interface UpdateAppointmentPayload {
  action: AppointmentAction
  cancelReason?: string // optional if action is CONFIRMED
}

export interface CreateAppointmentRequest {
  patientId: string
  doctorId: string
  doctorName?: string
  patientName?: string
  type: AppointmentStatus
  reason: string
  startTime: string 
  endTime: string 
}
