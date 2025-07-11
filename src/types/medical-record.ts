export interface MedicalRecord {
  id: string // uuid
  patientId: string // uuid
  doctorId: string // uuid
  doctorName: string
  patientName: string
  patientPhoneNumber: string
  diagnosis: string
  treatment: string
  description: string
  visitDate: Date | string
  createdAt?: Date | string
  updatedAt?: Date | string
  visitType: "CHECKUP" | "FOLLOW_UP" | "EMERGENCY" | "CONSULTATION"
}

export interface MedicalRecordsParams {
  doctorId?: string
  patientId?: string
  doctorName?: string
  visitType?: string
  from?: string
  to?: string
  diagnosis?: string
  limit?: number
  offset?: number
  signal?: AbortSignal
}

export interface CreateMedicalRecordRequest {
  patientId: string
  doctorId: string
  visitType: "CHECKUP" | "FOLLOW_UP" | "EMERGENCY" | "CONSULTATION"
  diagnosis: string
  treatment: string
  description: string
  visitDate: string // ISO format (yyyy-mm-dd)
}
