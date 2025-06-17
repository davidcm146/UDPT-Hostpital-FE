import { User } from "./user"

export interface Receptionist extends User {
  userId: string
  education: string
  experience: string
  role: "Receptionist"
  department: string
}
