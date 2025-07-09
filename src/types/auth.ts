import { Role } from "./user"

export interface SignupPayload {
  name: string
  email: string
  password: string
}

export interface SignUpResponse {
  success: boolean
  email?: string
  password?: string
  name?: string
  message: string
}

export interface LoginPayRequest {
  email: string
  password: string
}

export type DecodedToken = {
  email: string
  name: string
  role: Role
  sub: string // user id
  exp: number
  iat: number
}