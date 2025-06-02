import type { Medicine } from "@/types/medicine"

export interface Prescription {
  prescriptionID: string // uuid
  patientID: string // uuid
  doctorID: string // uuid
  status: "pending" | "active" | "completed" | "cancelled" // varchar
  totalPrice: number // decimal
  createdAt: string | Date // Datetime
}

export interface PrescriptionDetail {
  detailID: string // uuid
  prescriptionID: string // uuid
  medicineID: string // uuid - Reference to medicine
  dosage: number // int (mg)
  quantity: number // int
  note: string // text
  subTotal: number // decimal
  createdAt: string | Date // Datetime
}

export interface CreatePrescriptionRequest {
  patientID: string
  doctorID: string
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
