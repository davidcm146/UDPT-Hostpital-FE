import type { Medicine } from "@/types/medicine"

export interface Prescription {
  [x: string]: any
  details: any
  id: string // uuid
  patientId: string // uuid
  doctorId: string // uuid
  medicalRecordId: string 
  status: "Taken" | "Not taken" // varchar
  totalPrice: number // decimal
  createdAt: string | Date // Datetime
}

export interface PrescriptionDetail {
  id: string // uuid
  prescriptionId: string // uuid
  medicineId: string // uuid - Reference to medicine
  dosage: number // int (mg)
  quantity: number // int
  note: string // text
  subTotal: number // decimal
  createdAt: string | Date // Datetime
}

export interface CreatePrescriptionRequest {
  patientId: string
  doctorId: string
  medicalRecordId: string
  medicines: Array<{
    medicineID: string
    dosage: number
    quantity: number
    note: string
  }>
}

// This is what the UI will receive - prescription details WITH medicine objects attached
export interface PrescriptionDetailWithMedicine extends PrescriptionDetail {
  medicine: Medicine
}

export interface PrescriptionWithDetails extends Prescription {
  details: PrescriptionDetailWithMedicine[]
}
