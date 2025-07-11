import type { Medicine } from "@/types/medicine"

export interface Prescription {
  id: string // uuid
  patientId: string // uuid
  doctorId: string // uuid
  medicalRecordId: string 
  note: string
  status: "TAKEN" | "NOT_TAKEN" // varchar
  totalPrice: number // decimal
  createdAt: string | Date // Datetime
  updatedAt: string | Date
}

export interface PrescriptionDetail {
  id: string // uuid
  medicationId: string // uuid - Reference to medicine
  dosage: number // int (mg)
  quantity: number // int
  note: string // text
  subTotal: number // decimal
  price: number
  description: string
  createdAt?: string | Date // Datetime
}

export interface CreatePrescriptionRequest {
  patientId: string
  doctorId: string
  medicalRecordId: string
  note: string
  prescriptionDetails: Array<{
    medicationId: string
    dosage: number
    quantity: number
    note: string
  }>
}

export interface PrescriptionsParams {
  patientId?: string
  doctorId?: string
  limit?: number
  offset?: number
  signal?: AbortSignal
}

// This is what the UI will receive - prescription details WITH medicine objects attached
export interface PrescriptionDetailWithMedicine extends PrescriptionDetail {
  medicine: Medicine
}

export interface PrescriptionWithDetails extends Prescription {
  details: PrescriptionDetailWithMedicine[]
}
