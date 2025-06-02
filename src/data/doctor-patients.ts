import type { Patient } from "@/types/patient"
import type { PrescriptionWithDetails } from "@/types/prescription"
import { getPrescriptionsByPatient } from "@/data/prescription"

// Extended patient interface for doctor view
export interface DoctorPatient extends Patient {
  isUrgent?: boolean
  lastVisit?: string
  upcomingAppointment?: string
  recentPrescriptions?: number
  totalAppointments?: number
  notes?: string
}

// Mock patients data for doctor view
export const mockDoctorPatients: DoctorPatient[] = [
  {
    patientID: "550e8400-e29b-41d4-a716-446655440999",
    name: "John Smith",
    address: "123 Main Street, Los Angeles, CA 90210",
    age: 45,
    height: 175, // cm
    bloodType: "O+",
    gender: "Male",
    phone: "(555) 123-4567",
    allergies: "Penicillin, Shellfish",
    pastIllness: "Appendicitis (2015)",

    // Additional fields
    email: "john.smith@email.com",
    dateOfBirth: "1978-03-15",
    weight: 80, // kg
    emergencyContactName: "Jane Smith",
    emergencyContactPhone: "(555) 987-6543",
    insuranceProvider: "Blue Cross Blue Shield",
    insurancePolicyNumber: "BCBS-123456789",
    primaryPhysician: "Dr. Sarah Johnson",
    medicalRecordNumber: "MRN-789456123",
    registrationDate: "2023-01-15",
    lastVisitDate: "2025-05-15",
    currentMedications: "Lisinopril 10mg daily, Atorvastatin 20mg daily",
    chronicConditions: "Hypertension, Type 2 Diabetes",
    familyHistory: "Father: Diabetes, Heart disease; Mother: Hypertension",
    preferredLanguage: "English",
    maritalStatus: "Married",
    occupation: "Engineer",
    smokingStatus: "Never",
    alcoholConsumption: "Occasional",

    // Doctor view specific fields
    lastVisit: "May 15, 2025",
    upcomingAppointment: "May 25, 2025",
    recentPrescriptions: 2,
    totalAppointments: 15,
    isUrgent: false,
  },
  {
    patientID: "550e8400-e29b-41d4-a716-446655440998",
    name: "Emily Johnson",
    address: "456 Oak Avenue, Los Angeles, CA 90211",
    age: 32,
    height: 165, // cm
    bloodType: "A+",
    gender: "Female",
    phone: "(555) 234-5678",
    allergies: "Peanuts, Latex",
    pastIllness: "Pneumonia (2020)",

    email: "emily.johnson@email.com",
    dateOfBirth: "1991-07-22",
    weight: 60, // kg
    emergencyContactName: "Michael Johnson",
    emergencyContactPhone: "(555) 876-5432",
    insuranceProvider: "Aetna",
    insurancePolicyNumber: "AETNA-987654321",
    primaryPhysician: "Dr. Sarah Johnson",
    medicalRecordNumber: "MRN-456789123",
    registrationDate: "2023-03-20",
    lastVisitDate: "2025-04-28",
    currentMedications: "Albuterol inhaler as needed",
    chronicConditions: "Asthma",
    familyHistory: "Mother: Asthma; Father: Allergies",
    preferredLanguage: "English",
    maritalStatus: "Single",
    occupation: "Teacher",
    smokingStatus: "Never",
    alcoholConsumption: "None",

    lastVisit: "April 28, 2025",
    upcomingAppointment: "May 25, 2025",
    recentPrescriptions: 1,
    totalAppointments: 8,
    isUrgent: true,
    notes: "Patient experiencing increased asthma symptoms, needs immediate follow-up",
  },
  {
    patientID: "550e8400-e29b-41d4-a716-446655440997",
    name: "Michael Brown",
    address: "789 Pine Street, Los Angeles, CA 90212",
    age: 58,
    height: 180, // cm
    bloodType: "B+",
    gender: "Male",
    phone: "(555) 345-6789",
    allergies: "Aspirin, Codeine",
    pastIllness: "Heart attack (2018), Bypass surgery (2019)",

    email: "michael.brown@email.com",
    dateOfBirth: "1965-11-08",
    weight: 85, // kg
    emergencyContactName: "Lisa Brown",
    emergencyContactPhone: "(555) 765-4321",
    insuranceProvider: "Medicare",
    insurancePolicyNumber: "MEDICARE-456123789",
    primaryPhysician: "Dr. Sarah Johnson",
    medicalRecordNumber: "MRN-321654987",
    registrationDate: "2022-08-10",
    lastVisitDate: "2025-05-10",
    currentMedications: "Metoprolol 50mg twice daily, Clopidogrel 75mg daily, Atorvastatin 40mg daily",
    chronicConditions: "Coronary Artery Disease, Hyperlipidemia, Hypertension",
    familyHistory: "Father: Heart disease; Mother: Stroke",
    preferredLanguage: "English",
    maritalStatus: "Married",
    occupation: "Retired",
    smokingStatus: "Former",
    alcoholConsumption: "None",

    lastVisit: "May 10, 2025",
    upcomingAppointment: "May 26, 2025",
    recentPrescriptions: 3,
    totalAppointments: 22,
    isUrgent: false,
  },
  {
    patientID: "550e8400-e29b-41d4-a716-446655440996",
    name: "Sarah Williams",
    address: "321 Elm Drive, Los Angeles, CA 90213",
    age: 29,
    height: 170, // cm
    bloodType: "AB-",
    gender: "Female",
    phone: "(555) 456-7890",
    allergies: "No known allergies",
    pastIllness: "Migraines since teenage years",

    email: "sarah.williams@email.com",
    dateOfBirth: "1994-12-03",
    weight: 65, // kg
    emergencyContactName: "David Williams",
    emergencyContactPhone: "(555) 654-3210",
    insuranceProvider: "Kaiser Permanente",
    insurancePolicyNumber: "KAISER-789123456",
    primaryPhysician: "Dr. Sarah Johnson",
    medicalRecordNumber: "MRN-147258369",
    registrationDate: "2023-06-15",
    lastVisitDate: "2025-05-05",
    currentMedications: "Sumatriptan 50mg as needed for migraines",
    chronicConditions: "Migraine",
    familyHistory: "Mother: Migraines; Father: No significant history",
    preferredLanguage: "English",
    maritalStatus: "Single",
    occupation: "Graphic Designer",
    smokingStatus: "Never",
    alcoholConsumption: "Occasional",

    lastVisit: "May 5, 2025",
    upcomingAppointment: "May 24, 2025",
    recentPrescriptions: 1,
    totalAppointments: 6,
    isUrgent: false,
  },
  {
    patientID: "550e8400-e29b-41d4-a716-446655440995",
    name: "Robert Davis",
    address: "654 Maple Lane, Los Angeles, CA 90214",
    age: 67,
    height: 172, // cm
    bloodType: "O-",
    gender: "Male",
    phone: "(555) 567-8901",
    allergies: "Sulfa drugs, Iodine",
    pastIllness: "Knee replacement (2020), Cataract surgery (2021)",

    email: "robert.davis@email.com",
    dateOfBirth: "1956-09-14",
    weight: 78, // kg
    emergencyContactName: "Margaret Davis",
    emergencyContactPhone: "(555) 543-2109",
    insuranceProvider: "Medicare + Supplemental",
    insurancePolicyNumber: "MEDICARE-963852741",
    primaryPhysician: "Dr. Sarah Johnson",
    medicalRecordNumber: "MRN-852963741",
    registrationDate: "2022-01-05",
    lastVisitDate: "2025-05-12",
    currentMedications: "Metformin 500mg twice daily, Ibuprofen 400mg as needed, Prednisolone eye drops",
    chronicConditions: "Arthritis, Hypertension, COPD, Type 2 Diabetes",
    familyHistory: "Father: Diabetes; Mother: Arthritis",
    preferredLanguage: "English",
    maritalStatus: "Married",
    occupation: "Retired",
    smokingStatus: "Former",
    alcoholConsumption: "None",

    lastVisit: "May 12, 2025",
    upcomingAppointment: "May 24, 2025",
    recentPrescriptions: 4,
    totalAppointments: 28,
    isUrgent: false,
  },
]

// Helper functions for doctor patient management
export const getPatientsByDoctor = (doctorID: string): DoctorPatient[] => {
  return mockDoctorPatients.filter((patient) => patient.primaryPhysician?.includes(doctorID) || true)
}

export const getPatientById = (patientID: string): DoctorPatient | undefined => {
  return mockDoctorPatients.find((patient) => patient.patientID === patientID)
}

export const getUrgentPatients = (): DoctorPatient[] => {
  return mockDoctorPatients.filter((patient) => patient.isUrgent)
}

export const searchPatients = (query: string): DoctorPatient[] => {
  const searchTerm = query.toLowerCase()
  return mockDoctorPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm) ||
      patient.patientID.toLowerCase().includes(searchTerm) ||
      patient.chronicConditions?.toLowerCase().includes(searchTerm) ||
      patient.phone.includes(searchTerm),
  )
}

export const getPatientPrescriptions = (patientID: string): PrescriptionWithDetails[] => {
  return getPrescriptionsByPatient(patientID)
}

export const getPatientMedicalHistory = (patientID: string) => {
  const patient = getPatientById(patientID)
  if (!patient) return null

  return {
    allergies: patient.allergies,
    chronicConditions: patient.chronicConditions,
    currentMedications: patient.currentMedications,
    pastIllness: patient.pastIllness,
    familyHistory: patient.familyHistory,
    bloodType: patient.bloodType,
    lastVisit: patient.lastVisitDate,
  }
}

export const updatePatientNotes = (patientID: string, notes: string): boolean => {
  const patient = mockDoctorPatients.find((p) => p.patientID === patientID)
  if (patient) {
    patient.notes = notes
    return true
  }
  return false
}

export const markPatientAsUrgent = (patientID: string, isUrgent: boolean): boolean => {
  const patient = mockDoctorPatients.find((p) => p.patientID === patientID)
  if (patient) {
    patient.isUrgent = isUrgent
    return true
  }
  return false
}

// Get patient statistics
export const getPatientStats = () => {
  return {
    total: mockDoctorPatients.length,
    urgent: mockDoctorPatients.filter((p) => p.isUrgent).length,
    male: mockDoctorPatients.filter((p) => p.gender === "Male").length,
    female: mockDoctorPatients.filter((p) => p.gender === "Female").length,
    averageAge: Math.round(mockDoctorPatients.reduce((sum, p) => sum + p.age, 0) / mockDoctorPatients.length),
  }
}
