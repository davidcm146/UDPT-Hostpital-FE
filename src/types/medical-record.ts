export interface MedicalRecord {
  recordID: string // uuid
  patientID: string // uuid
  doctorID: string // uuid
  diagnosis: string
  treatment: string
  description: string
  visitDate: Date
  createdAt: Date
  // Additional simple properties
  visitType: "Regular Checkup" | "Follow-up" | "Emergency" | "Consultation"
  status: "Active" | "Completed" | "Cancelled"
  prescriptions: string[] // Array of prescription IDs
}

export interface CreateMedicalRecordRequest {
  patientID: string
  doctorID: string
  diagnosis: string
  treatment: string
  description: string
  visitType: MedicalRecord["visitType"]
}
