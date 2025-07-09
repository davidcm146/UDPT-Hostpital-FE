import { User } from "./user"

export interface Doctor extends User {
  experience?: string // Experience (text)
  education?: string // Education (text)
  specialty?: string
}
