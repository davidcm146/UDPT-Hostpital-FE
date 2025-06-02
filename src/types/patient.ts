export interface Patient {
  patientID: string // uuid
  name: string // varchar
  address: string // text
  age: number // int
  height: number // int (in cm)
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "Unknown" // Type
  gender: "Male" | "Female" | "Other" | "Prefer not to say" // varchar
  phone: string // varchar
  allergies: string // varchar
  pastIllness: string // varchar (renamed from PastIllness to follow camelCase)

  // Additional hospital-related fields
  email?: string
  dateOfBirth?: string | Date
  weight?: number // in kg
  emergencyContactName?: string
  emergencyContactPhone?: string
  insuranceProvider?: string
  insurancePolicyNumber?: string
  primaryPhysician?: string
  medicalRecordNumber?: string
  registrationDate?: string
  lastVisitDate?: string
  currentMedications?: string
  chronicConditions?: string
  familyHistory?: string
  preferredLanguage?: string
  maritalStatus?: string
  occupation?: string
  smokingStatus?: "Never" | "Former" | "Current"
  alcoholConsumption?: "None" | "Occasional" | "Moderate" | "Heavy"
}
