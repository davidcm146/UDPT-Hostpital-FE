export interface User {
    userId: string // uuid
    name: string // varchar
    address: string // text
    email: string
    DOB: Date | string // int
    password: string
    avatar: string
    phone: string
    role: "Doctor" | "Receptionist" | "Patient" | "Admin"
    createdAt: Date | string
    updatedAt: Date | string
}