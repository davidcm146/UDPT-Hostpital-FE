import { User } from "./user"

export interface Patient extends User {
  height: number // int (in cm)
  weight: number
  occupation?: string
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "Unknown" // Type
  gender: "Male" | "Female" | "Other" | "Prefer not to say" // varchar
  allergies: string // varchar
  pastIllness: string // varchar (renamed from PastIllness to follow camelCase)
  smokingStatus?: string,
  alcoholConsumption?: string
}
