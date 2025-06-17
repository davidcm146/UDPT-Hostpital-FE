import { calculateAge } from "@/lib/PatientUtils"
import type { Patient } from "@/types/patient"

export const mockPatientData: Patient = {
  userId: "550e8400-e29b-41d4-a716-446655440999",
  name: "John Doe",
  address: "123 Main Street, Anytown, ST 12345",
  DOB: "1985-06-15",
  height: 178, // cm
  bloodType: "O+",
  gender: "Male",
  phone: "(555) 123-4567",
  allergies: "Penicillin, Peanuts, Shellfish",
  pastIllness: "Appendicitis (2015), Broken arm (2018)",

  // Additional fields
  email: "john.doe@example.com",
  weight: 75, // kg
  occupation: "Software Engineer",
  smokingStatus: "None",
  alcoholConsumption: "None",
  password: "1234567",
  avatar: "image.jpg",
  createdAt: "2024-06-22",
  updatedAt: "2024-07-22",
  role: "Patient"
}

export const mockPatients: Patient[] = [
    {
      userId: "550e8400-e29b-41d4-a716-446655440995",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      role: "Patient",
      address: "123 Main St, Ho Chi Minh City",
      DOB: "1985-06-15",
      password: "",
      avatar: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      height: 175,
      weight: 70,
      occupation: "Engineer",
      bloodType: "A+",
      gender: "Male",
      allergies: "Pollen",
      pastIllness: "Chickenpox",
      smokingStatus: "Non-smoker",
      alcoholConsumption: "Occasional"
    },
    {
      userId: "550e8400-e29b-41d4-a716-446655440999",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(555) 987-6543",
      role: "Patient",
      address: "456 Le Lai, HCMC",
      DOB: "1990-08-12",
      password: "",
      avatar: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      height: 165,
      weight: 62,
      occupation: "Teacher",
      bloodType: "B-",
      gender: "Female",
      allergies: "Sulfa drugs",
      pastIllness: "Tonsillectomy",
      smokingStatus: "Former smoker",
      alcoholConsumption: "Regular"
    },
    {
      userId: "550e8400-e29b-41d4-a716-446655440997",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "(555) 456-7890",
      role: "Patient",
      address: "789 Dien Bien Phu, HCMC",
      DOB: "1975-03-22",
      password: "",
      avatar: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      height: 182,
      weight: 88,
      occupation: "Lawyer",
      bloodType: "O+",
      gender: "Male",
      allergies: "None",
      pastIllness: "Appendectomy",
      smokingStatus: "Current smoker",
      alcoholConsumption: "Heavy"
    }
  ]

// Helper functions
export const calculateBMI = (height: number, weight: number): number => {
  const heightInMeters = height / 100
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
}

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal weight"
  if (bmi < 30) return "Overweight"
  return "Obese"
}

export const getPatientById = (patientID: string): Patient | undefined => {
  return mockPatients.find((patient) => patient.userId === patientID)
}

export const searchPatients = (query: string): Patient[] => {
  const searchTerm = query.toLowerCase()
  return mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm) ||
      patient.userId.toLowerCase().includes(searchTerm) ||
      patient.phone.includes(searchTerm),
  )
}

export const getPatientStats = () => {
  return {
    total: mockPatients.length,
    male: mockPatients.filter((p) => p.gender === "Male").length,
    female: mockPatients.filter((p) => p.gender === "Female").length,
    averageAge: Math.round(mockPatients.reduce((sum, p) => sum + calculateAge(p.DOB), 0) / mockPatients.length),
  }
}
