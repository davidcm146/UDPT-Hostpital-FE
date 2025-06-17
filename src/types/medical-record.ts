export interface MedicalRecord {
  id: string // uuid
  patientId: string // uuid
  doctorId: string // uuid
  diagnosis: string
  treatment: string
  description: string
  visitDate: Date
  createdAt: Date
  // Additional simple properties
  visitType: "Regular Checkup" | "Follow-up" | "Emergency" | "Consultation"
}

export interface CreateMedicalRecordRequest {
  patientID: string
  doctorID: string
  diagnosis: string
  treatment: string
  description: string
  visitType: MedicalRecord["visitType"]
}
