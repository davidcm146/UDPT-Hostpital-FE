import type { Doctor } from "@/types/doctor"

export const mockDoctors: Doctor[] = [
  {
    userId: "550e8400-e29b-41d4-a716-446655440001",
    name: "Sarah Johnson",
    address: "123 Medical Center Drive, Suite 200, Los Angeles, CA 90210",
    email: "sarah.johnson@hospital.com",
    DOB: "1980-05-20",
    password: "hashedpassword1",
    avatar: "/placeholder.svg?height=160&width=160",
    experience: "15 years",
    education: "MD from Harvard Medical School",
    role: "Doctor",
    phone: "(555) 123-4567",
    specialty: "Cardiology",
    createdAt: "",
    updatedAt: ""
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440002",
    name: "Michael Chen",
    address: "456 Neurology Center, Floor 3, Los Angeles, CA 90211",
    email: "michael.chen@hospital.com",
    DOB: "1982-08-15",
    password: "hashedpassword2",
    avatar: "/placeholder.svg?height=160&width=160",
    experience: "12 years",
    education: "MD from Johns Hopkins University",
    phone: "(555) 123-4567",
    role: "Doctor",
    specialty: "Neurology",
    createdAt: "",
    updatedAt: ""
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440003",
    name: "Emily Rodriguez",
    address: "789 Children's Hospital, Pediatric Wing, Los Angeles, CA 90212",
    email: "emily.rodriguez@hospital.com",
    DOB: "1987-02-10",
    password: "hashedpassword3",
    avatar: "/placeholder.svg?height=160&width=160",
    experience: "8 years",
    phone: "(555) 123-4567",
    education: "MD from Stanford University",
    role: "Doctor",
    specialty: "Pediatrics",
    createdAt: "",
    updatedAt: ""
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440004",
    name: "James Wilson",
    address: "321 Orthopedic Center, Sports Medicine Wing, Los Angeles, CA 90213",
    email: "james.wilson@hospital.com",
    DOB: "1975-11-02",
    password: "hashedpassword4",
    avatar: "/placeholder.svg?height=160&width=160",
    experience: "20 years",
    phone: "(555) 123-4567",
    education: "MD from Mayo Clinic",
    role: "Doctor",
    specialty: "Orthopedics",
    createdAt: "",
    updatedAt: ""
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440005",
    name: "Lisa Thompson",
    address: "654 Dermatology Clinic, Medical Arts Building, Los Angeles, CA 90214",
    email: "lisa.thompson@hospital.com",
    DOB: "1985-07-30",
    phone: "(555) 123-4567",
    password: "hashedpassword5",
    avatar: "/placeholder.svg?height=160&width=160",
    experience: "10 years",
    education: "MD from UCLA",
    role: "Doctor",
    specialty: "Dermatology",
    createdAt: "",
    updatedAt: ""
  }
]

export const getDoctorById = (id: string): Doctor | undefined => {
  return mockDoctors.find((doctor) => doctor.userId === id)
}
