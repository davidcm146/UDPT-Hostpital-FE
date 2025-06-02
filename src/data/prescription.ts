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
    prescriptionID: "rx-001",
    patientID: "550e8400-e29b-41d4-a716-446655440999",
    doctorID: "550e8400-e29b-41d4-a716-446655440001",
    status: "active",
    totalPrice: 129.0,
    createdAt: "2024-01-15",
  },
  {
    prescriptionID: "rx-002",
    patientID: "550e8400-e29b-41d4-a716-446655440999",
    doctorID: "550e8400-e29b-41d4-a716-446655440002",
    status: "completed",
    totalPrice: 82.5,
    createdAt: "2024-01-20",
  },
  {
    prescriptionID: "rx-003",
    patientID: "550e8400-e29b-41d4-a716-446655440999",
    doctorID: "550e8400-e29b-41d4-a716-446655440001",
    status: "pending",
    totalPrice: 216.0,
    createdAt: "2024-01-25",
  },
]

// Mock prescription details with medicineID references
export const mockPrescriptionDetails: PrescriptionDetail[] = [
  // Prescription rx-001 details (3 medicines)
  {
    detailID: "detail-001",
    prescriptionID: "rx-001",
    medicineID: "med-001", // Atorvastatin
    dosage: 20,
    quantity: 30,
    note: "Take one tablet daily at bedtime with or without food. Monitor for muscle pain.",
    subTotal: 75.0,
    createdAt: "2024-01-15",
  },
  {
    detailID: "detail-002",
    prescriptionID: "rx-001",
    medicineID: "med-002", // Vitamin D3
    dosage: 2000,
    quantity: 60,
    note: "Take one capsule daily with food to improve absorption.",
    subTotal: 9.0,
    createdAt: "2024-01-15",
  },
  {
    detailID: "detail-003",
    prescriptionID: "rx-001",
    medicineID: "med-005", // Albuterol Inhaler
    dosage: 90,
    quantity: 1,
    note: "Use 2 puffs every 4-6 hours as needed for shortness of breath. Rinse mouth after use.",
    subTotal: 45.0,
    createdAt: "2024-01-15",
  },

  // Prescription rx-002 details (3 medicines)
  {
    detailID: "detail-004",
    prescriptionID: "rx-002",
    medicineID: "med-003", // Lisinopril
    dosage: 10,
    quantity: 30,
    note: "Take one tablet daily in the morning. Monitor blood pressure regularly.",
    subTotal: 36.0,
    createdAt: "2024-01-20",
  },
  {
    detailID: "detail-005",
    prescriptionID: "rx-002",
    medicineID: "med-006", // Omeprazole
    dosage: 20,
    quantity: 30,
    note: "Take one capsule daily before breakfast. Complete the full course.",
    subTotal: 45.0,
    createdAt: "2024-01-20",
  },
  {
    detailID: "detail-006",
    prescriptionID: "rx-002",
    medicineID: "med-009", // Aspirin
    dosage: 81,
    quantity: 30,
    note: "Take one tablet daily with food for cardiovascular protection.",
    subTotal: 1.5,
    createdAt: "2024-01-20",
  },

  // Prescription rx-003 details (4 medicines)
  {
    detailID: "detail-007",
    prescriptionID: "rx-003",
    medicineID: "med-004", // Metformin
    dosage: 500,
    quantity: 60,
    note: "Take one tablet twice daily with meals. Monitor blood glucose levels.",
    subTotal: 48.0,
    createdAt: "2024-01-25",
  },
  {
    detailID: "detail-008",
    prescriptionID: "rx-003",
    medicineID: "med-008", // Amoxicillin
    dosage: 500,
    quantity: 21,
    note: "Take one capsule three times daily for 7 days. Complete the full course even if feeling better.",
    subTotal: 42.0,
    createdAt: "2024-01-25",
  },
  {
    detailID: "detail-009",
    prescriptionID: "rx-003",
    medicineID: "med-007", // Ibuprofen
    dosage: 200,
    quantity: 60,
    note: "Take 1-2 tablets every 6-8 hours as needed for pain. Do not exceed 6 tablets in 24 hours.",
    subTotal: 6.0,
    createdAt: "2024-01-25",
  },
  {
    detailID: "detail-010",
    prescriptionID: "rx-003",
    medicineID: "med-010", // Insulin Glargine
    dosage: 100,
    quantity: 1,
    note: "Inject 20 units subcutaneously once daily at bedtime. Rotate injection sites.",
    subTotal: 120.0,
    createdAt: "2024-01-25",
  },
]

// FIXED: This function now properly fetches medicine data and attaches it to prescription details
export const getPrescriptionWithDetails = (prescriptionID: string): PrescriptionWithDetails | null => {
  const prescription = mockPrescriptions.find((p) => p.prescriptionID === prescriptionID)
  if (!prescription) return null

  // Get prescription details for this prescription
  const prescriptionDetails = mockPrescriptionDetails.filter((d) => d.prescriptionID === prescriptionID)

  // Attach medicine data to each detail
  const detailsWithMedicine: PrescriptionDetailWithMedicine[] = prescriptionDetails.map((detail) => {
    const medicine = getMedicineById(detail.medicineID)

    if (!medicine) {
      console.error(`Medicine not found for ID: ${detail.medicineID}`)
      // Return a placeholder medicine to prevent UI crashes
      return {
        ...detail,
        medicine: {
          medicineID: detail.medicineID,
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
  const patientPrescriptions = mockPrescriptions.filter((p) => p.patientID === patientID)

  return patientPrescriptions
    .map((prescription) => getPrescriptionWithDetails(prescription.prescriptionID))
    .filter((prescription): prescription is PrescriptionWithDetails => prescription !== null)
}

export const getPrescriptionsByDoctor = (doctorID: string): PrescriptionWithDetails[] => {
  const doctorPrescriptions = mockPrescriptions.filter((p) => p.doctorID === doctorID)

  return doctorPrescriptions
    .map((prescription) => getPrescriptionWithDetails(prescription.prescriptionID))
    .filter((prescription): prescription is PrescriptionWithDetails => prescription !== null)
}

export const createPrescription = (request: CreatePrescriptionRequest): Prescription => {
  const prescriptionID = `rx-${Date.now()}`

  // Calculate total price from medicine details
  let totalPrice = 0
  const details: PrescriptionDetail[] = request.medicines.map((med, index) => {
    const medicine = getMedicineById(med.medicineID)
    if (!medicine) {
      throw new Error(`Medicine not found: ${med.medicineID}`)
    }

    const subTotal = medicine.price * med.quantity
    totalPrice += subTotal

    return {
      detailID: `detail-${Date.now()}-${index}`,
      prescriptionID,
      medicineID: med.medicineID,
      dosage: med.dosage,
      quantity: med.quantity,
      note: med.note,
      subTotal,
      createdAt: new Date().toISOString(),
    }
  })

  const newPrescription: Prescription = {
    prescriptionID,
    patientID: request.patientID,
    doctorID: request.doctorID,
    status: "pending",
    totalPrice,
    createdAt: new Date().toISOString(),
  }

  //Add to mock data
  mockPrescriptions.push(newPrescription)
  mockPrescriptionDetails.push(...details)

  return newPrescription
}

export const updatePrescriptionStatus = (prescriptionID: string, status: Prescription["status"]): boolean => {
  const prescription = mockPrescriptions.find((p) => p.prescriptionID === prescriptionID)
  if (prescription) {
    prescription.status = status
    return true
  }
  return false
}

// Helper function to get all prescription details with medicine data
export const getAllPrescriptionDetailsWithMedicine = (): PrescriptionDetailWithMedicine[] => {
  return mockPrescriptionDetails.map((detail) => {
    const medicine = getMedicineById(detail.medicineID)
    return {
      ...detail,
      medicine: medicine!,
    }
  })
}
