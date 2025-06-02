export interface Doctor {
  id: string // DoctorID (uuid)
  name: string // Name (varchar)
  specialty: string // Specialty (text)
  phone: string // Phone (varchar)
  email: string // Email (varchar)
  experience: string // Experience (text)
  education: string // Education (text)

  // Additional fields for UI functionality
  image?: string
  availability?: string
  rating?: number
  location?: string

  // Profile-specific fields
  firstName: string
  lastName: string
  licenseNumber: string
  npiNumber: string
  address: string
  certifications: string[]
  languages: string[]
  specializations: string[]
  staffId: string
  joinDate: string
  nextAppointment?: string
}
