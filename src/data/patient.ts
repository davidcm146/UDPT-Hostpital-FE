import type { Patient } from "@/types/patient"

export const mockPatientData: Patient = {
  patientID: "550e8400-e29b-41d4-a716-446655440999",
  name: "John Doe",
  address: "123 Main Street, Anytown, ST 12345",
  age: 38,
  height: 178, // cm
  bloodType: "O+",
  gender: "Male",
  phone: "(555) 123-4567",
  allergies: "Penicillin, Peanuts, Shellfish",
  pastIllness: "Appendicitis (2015), Broken arm (2018)",

  // Additional fields
  email: "john.doe@example.com",
  dateOfBirth: "1985-06-15",
  weight: 75, // kg
  emergencyContactName: "Jane Doe",
  emergencyContactPhone: "(555) 987-6543",
  insuranceProvider: "Blue Cross Blue Shield",
  insurancePolicyNumber: "BCBS-123456789",
  primaryPhysician: "Dr. Sarah Johnson",
  medicalRecordNumber: "MRN-789456123",
  registrationDate: "2023-01-15",
  lastVisitDate: "2024-03-20",
  currentMedications: "Lisinopril 10mg daily, Atorvastatin 20mg daily, Albuterol inhaler as needed",
  chronicConditions: "Hypertension, Asthma",
  familyHistory: "Father: Hypertension, Diabetes; Mother: Breast cancer; Paternal grandfather: Heart disease",
  preferredLanguage: "English",
  maritalStatus: "Married",
  occupation: "Software Engineer",
  smokingStatus: "Never",
  alcoholConsumption: "Occasional",
}

// Helper functions
export const calculateBMI = (height: number, weight: number): number => {
  // height in cm, weight in kg
  const heightInMeters = height / 100
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
}

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal weight"
  if (bmi < 30) return "Overweight"
  return "Obese"
}

export const formatHeight = (heightCm: number): string => {
  const feet = Math.floor(heightCm / 30.48)
  const inches = Math.round((heightCm / 30.48 - feet) * 12)
  return `${feet}'${inches}" (${heightCm} cm)`
}

export const formatWeight = (weightKg: number): string => {
  const pounds = Math.round(weightKg * 2.20462)
  return `${pounds} lbs (${weightKg} kg)`
}
