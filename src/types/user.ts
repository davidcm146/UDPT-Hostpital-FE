export interface User {
    id: string // uuid
    name: string // varchar
    address: string // text
    email: string
    dob: Date | string // int
    password: string
    avatar?: string
    phoneNumber?: string
    role: Role
    createdAt: Date | string
    updatedAt: Date | string
}

export type Role = "ADMIN" | "DOCTOR" | "PATIENT" | "RECEPTIONIST"
