import type { MedicalRecord } from "@/types/medical-record"

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    patientId: "550e8400-e29b-41d4-a716-446655440999",
    doctorId: "550e8400-e29b-41d4-a716-446655440001", // Dr. Sarah Johnson (Cardiology)
    diagnosis: "Hypertension",
    treatment: "Prescribed ACE inhibitors and lifestyle modifications",
    description:
      "Patient presents with elevated blood pressure readings. Recommended dietary changes and regular exercise.",
    visitDate: new Date("2025-05-20"),
    createdAt: new Date("2025-05-20"),
    visitType: "Regular Checkup",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    patientId: "550e8400-e29b-41d4-a716-446655440999",
    doctorId: "550e8400-e29b-41d4-a716-446655440005", // Dr. Michael Chen (Neurology)
    diagnosis: "Type 2 Diabetes",
    treatment: "Metformin therapy and glucose monitoring",
    description: "Follow-up visit for diabetes management. Blood glucose levels improving with current medication.",
    visitDate: new Date("2024-01-20"),
    createdAt: new Date("2024-01-20"),
    visitType: "Follow-up",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    patientId: "550e8400-e29b-41d4-a716-446655440999",
    doctorId: "550e8400-e29b-41d4-a716-446655440001", // Dr. Emily Rodriguez (Pediatrics)
    diagnosis: "Acute Bronchitis",
    treatment: "Antibiotics and bronchodilators",
    description: "Patient presented with persistent cough and chest congestion. Prescribed course of antibiotics.",
    visitDate: new Date("2024-01-25"),
    createdAt: new Date("2024-01-25"),
    visitType: "Emergency",
  },
]

export const getRecentMedicalRecords = (): MedicalRecord[] => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  return mockMedicalRecords
    .filter((record) => new Date(record.visitDate) >= thirtyDaysAgo)
    .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
}

export const getPastMedicalRecords = (): MedicalRecord[] => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  return mockMedicalRecords
    .filter((record) => new Date(record.visitDate) < thirtyDaysAgo)
    .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
}

export const getMedicalRecordById = (recordId: string): MedicalRecord | undefined => {
  return mockMedicalRecords.find((record) => record.id === recordId)
}

export const getMedicalRecordsByPatient = (patientId: string): MedicalRecord[] => {
  return mockMedicalRecords.filter((record) => record.patientId === patientId)
}

export const getMedicalRecordsByDoctor = (doctorID: string): MedicalRecord[] => {
  return mockMedicalRecords.filter((record) => record.doctorId === doctorID)
}

// Get medical record statistics for a doctor
export const getDoctorMedicalRecordStats = (doctorID: string) => {
  const doctorRecords = getMedicalRecordsByDoctor(doctorID)
  const uniquePatients = new Set(doctorRecords.map((record) => record.patientId)).size

  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisMonthRecords = doctorRecords.filter((record) => new Date(record.createdAt) >= thisMonth).length

  // Calculate average records per day (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentRecords = doctorRecords.filter((record) => new Date(record.createdAt) >= thirtyDaysAgo).length
  const averageRecordsPerDay = recentRecords / 30

  return {
    totalRecords: doctorRecords.length,
    totalPatients: uniquePatients,
    thisMonthRecords,
    emergencyRecords: doctorRecords.filter((record) => record.visitType === "Emergency").length,
    averageRecordsPerDay,
  }
}

// Get medical record statistics for a patient
// export const getMedicalRecordStats = (patientID: string) => {
//   const patientRecords = getMedicalRecordsByPatient(patientID)

//   return {
//     total: patientRecords.length,
//     totalPrescriptions: patientRecords.reduce((sum, record) => sum + (record.prescriptions?.length || 0), 0),
//     lastVisit:
//       patientRecords.length > 0
//         ? new Date(Math.max(...patientRecords.map((record) => new Date(record.visitDate).getTime())))
//         : null,
//   }
// }

// Search medical records
export const searchMedicalRecords = (records: MedicalRecord[], searchTerm: string): MedicalRecord[] => {
  if (!searchTerm.trim()) return records

  const term = searchTerm.toLowerCase()
  return records.filter(
    (record) =>
      record.diagnosis.toLowerCase().includes(term) ||
      record.treatment.toLowerCase().includes(term) ||
      record.description?.toLowerCase().includes(term) ||
      record.id.toLowerCase().includes(term),
  )
}

// Filter medical records by date range
export const filterMedicalRecordsByDateRange = (records: MedicalRecord[], from?: Date, to?: Date): MedicalRecord[] => {
  return records.filter((record) => {
    const recordDate = new Date(record.visitDate)

    if (from && recordDate < from) return false
    if (to) {
      const toDateEnd = new Date(to)
      toDateEnd.setHours(23, 59, 59, 999)
      if (recordDate > toDateEnd) return false
    }

    return true
  })
}
