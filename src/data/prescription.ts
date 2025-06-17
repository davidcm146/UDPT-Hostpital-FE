import type {
  Prescription,
  PrescriptionDetail,
  PrescriptionWithDetails,
  PrescriptionDetailWithMedicine,
  CreatePrescriptionRequest,
} from "@/types/prescription"
import { getMedicineById } from "./medicine"

// Mock prescriptions
export const mockPrescriptions: Prescription[] = [
  {
    id: "rx-001",
    patientId: "550e8400-e29b-41d4-a716-446655440999",
    doctorId: "550e8400-e29b-41d4-a716-446655440001",
    status: "Not taken",
    totalPrice: 129.0,
    createdAt: "2024-01-15",
    medicalRecordId: "550e8400-e29b-41d4-a716-446655440001",
    details: undefined
  },
  {
    id: "rx-002",
    patientId: "550e8400-e29b-41d4-a716-446655440999",
    doctorId: "550e8400-e29b-41d4-a716-446655440002",
    status: "Taken",
    totalPrice: 82.5,
    createdAt: "2024-01-20",
    medicalRecordId: "550e8400-e29b-41d4-a716-446655440001",
    details: undefined
  },
  {
    id: "rx-003",
    patientId: "550e8400-e29b-41d4-a716-446655440999",
    doctorId: "550e8400-e29b-41d4-a716-446655440001",
    status: "Not taken",
    totalPrice: 216.0,
    createdAt: "2024-01-25",
    medicalRecordId: "",
    details: undefined
  },
]

// Mock prescription details with medicineID references
export const mockPrescriptionDetails: PrescriptionDetail[] = [
  // Prescription rx-001 details (3 medicines)
  {
    id: "detail-001",
    prescriptionId: "rx-001",
    medicineId: "med-001", // Atorvastatin
    dosage: 20,
    quantity: 30,
    note: "Take one tablet daily at bedtime with or without food. Monitor for muscle pain.",
    subTotal: 75.0,
    createdAt: "2024-01-15",
  },
  {
    id: "detail-002",
    prescriptionId: "rx-001",
    medicineId: "med-002", // Vitamin D3
    dosage: 2000,
    quantity: 60,
    note: "Take one capsule daily with food to improve absorption.",
    subTotal: 9.0,
    createdAt: "2024-01-15",
  },
  {
    id: "detail-003",
    prescriptionId: "rx-001",
    medicineId: "med-005", // Albuterol Inhaler
    dosage: 90,
    quantity: 1,
    note: "Use 2 puffs every 4-6 hours as needed for shortness of breath. Rinse mouth after use.",
    subTotal: 45.0,
    createdAt: "2024-01-15",
  },

  // Prescription rx-002 details (3 medicines)
  {
    id: "detail-004",
    prescriptionId: "rx-002",
    medicineId: "med-003", // Lisinopril
    dosage: 10,
    quantity: 30,
    note: "Take one tablet daily in the morning. Monitor blood pressure regularly.",
    subTotal: 36.0,
    createdAt: "2024-01-20",
  },
  {
    id: "detail-005",
    prescriptionId: "rx-002",
    medicineId: "med-006", // Omeprazole
    dosage: 20,
    quantity: 30,
    note: "Take one capsule daily before breakfast. Complete the full course.",
    subTotal: 45.0,
    createdAt: "2024-01-20",
  },
  {
    id: "detail-006",
    prescriptionId: "rx-002",
    medicineId: "med-009", // Aspirin
    dosage: 81,
    quantity: 30,
    note: "Take one tablet daily with food for cardiovascular protection.",
    subTotal: 1.5,
    createdAt: "2024-01-20",
  },

  // Prescription rx-003 details (4 medicines)
  {
    id: "detail-007",
    prescriptionId: "rx-003",
    medicineId: "med-004", // Metformin
    dosage: 500,
    quantity: 60,
    note: "Take one tablet twice daily with meals. Monitor blood glucose levels.",
    subTotal: 48.0,
    createdAt: "2024-01-25",
  },
  {
    id: "detail-008",
    prescriptionId: "rx-003",
    medicineId: "med-008", // Amoxicillin
    dosage: 500,
    quantity: 21,
    note: "Take one capsule three times daily for 7 days. Complete the full course even if feeling better.",
    subTotal: 42.0,
    createdAt: "2024-01-25",
  },
  {
    id: "detail-009",
    prescriptionId: "rx-003",
    medicineId: "med-007", // Ibuprofen
    dosage: 200,
    quantity: 60,
    note: "Take 1-2 tablets every 6-8 hours as needed for pain. Do not exceed 6 tablets in 24 hours.",
    subTotal: 6.0,
    createdAt: "2024-01-25",
  },
  {
    id: "detail-010",
    prescriptionId: "rx-003",
    medicineId: "med-010", // Insulin Glargine
    dosage: 100,
    quantity: 1,
    note: "Inject 20 units subcutaneously once daily at bedtime. Rotate injection sites.",
    subTotal: 120.0,
    createdAt: "2024-01-25",
  },
]

// FIXED: This function now properly fetches medicine data and attaches it to prescription details
export const getPrescriptionWithDetails = (prescriptionID: string): PrescriptionWithDetails | null => {
  const prescription = mockPrescriptions.find((p) => p.id === prescriptionID)
  if (!prescription) return null

  // Get prescription details for this prescription
  const prescriptionDetails = mockPrescriptionDetails.filter((d) => d.prescriptionId === prescriptionID)

  // Attach medicine data to each detail
  const detailsWithMedicine: PrescriptionDetailWithMedicine[] = prescriptionDetails.map((detail) => {
    const medicine = getMedicineById(detail.medicineId)

    if (!medicine) {
      console.error(`Medicine not found for ID: ${detail.medicineId}`)
      // Return a placeholder medicine to prevent UI crashes
      return {
        ...detail,
        medicine: {
          medicineID: detail.medicineId,
          name: "Unknown Medicine",
          unit: 1,
          description: "Medicine information not available",
          price: 0,
          category: "Unknown",
          dosageForm: "unknown",
          strength: "unknown",
          prescriptionRequired: true,
          createdAt: new Date(),
        },
      }
    }

    return {
      ...detail,
      medicine,
    }
  })

  return {
    ...prescription,
    details: detailsWithMedicine,
  }
}

export const getPrescriptionsByPatient = (patientID: string): PrescriptionWithDetails[] => {
  const patientPrescriptions = mockPrescriptions.filter((p) => p.patientId === patientID)

  return patientPrescriptions
    .map((prescription) => getPrescriptionWithDetails(prescription.id))
    .filter((prescription): prescription is PrescriptionWithDetails => prescription !== null)
}

export const getPrescriptionsByDoctor = (doctorID: string): PrescriptionWithDetails[] => {
  const doctorPrescriptions = mockPrescriptions.filter((p) => p.doctorId === doctorID)

  return doctorPrescriptions
    .map((prescription) => getPrescriptionWithDetails(prescription.id))
    .filter((prescription): prescription is PrescriptionWithDetails => prescription !== null)
}

export const createPrescription = (request: CreatePrescriptionRequest): Prescription => {
  const prescriptionId = `rx-${Date.now()}`

  // Tạo danh sách prescription details và tính tổng giá tiền
  const details: PrescriptionDetail[] = request.medicines.map((med, index) => {
    const medicine = getMedicineById(med.medicineID)
    if (!medicine) {
      throw new Error(`Medicine not found: ${med.medicineID}`)
    }

    const subTotal = medicine.price * med.quantity

    return {
      id: `detail-${Date.now()}-${index}`,
      prescriptionId,
      medicineId: med.medicineID,
      dosage: med.dosage,
      quantity: med.quantity,
      note: med.note,
      subTotal,
      createdAt: new Date(),
    }
  })

  // Tính tổng giá tiền
  const totalPrice = details.reduce((sum, detail) => sum + detail.subTotal, 0)

  // Tạo prescription mới
  const newPrescription: Prescription = {
    id: prescriptionId,
    patientId: request.patientId,
    doctorId: request.doctorId,
    medicalRecordId: request.medicalRecordId,
    status: "Not taken", // default chưa lấy thuốc
    totalPrice,
    createdAt: new Date(),
    details: undefined
  }

  // Thêm vào mock data
  mockPrescriptions.push(newPrescription)
  mockPrescriptionDetails.push(...details)

  return newPrescription
}


export const updatePrescriptionStatus = (prescriptionID: string, status: Prescription["status"]): boolean => {
  const prescription = mockPrescriptions.find((p) => p.id === prescriptionID)
  if (prescription) {
    prescription.status = status
    return true
  }
  return false
}

// Helper function to get all prescription details with medicine data
export const getAllPrescriptionDetailsWithMedicine = (): PrescriptionDetailWithMedicine[] => {
  return mockPrescriptionDetails.map((detail) => {
    const medicine = getMedicineById(detail.medicineId)
    return {
      ...detail,
      medicine: medicine!,
    }
  })
}

export function getPrescriptionsByMedicalRecord(medicalRecordId: string): Prescription[] {
  return mockPrescriptions.filter(
    (prescription) => prescription.medicalRecordId === medicalRecordId
  )
}

