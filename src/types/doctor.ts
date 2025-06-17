import { User } from "./user"

export interface Doctor extends User {
  userId: string // DoctorID (uuid)
  experience: string // Experience (text)
  education: string // Education (text)
  role: "Doctor"
  specialty: string
}
