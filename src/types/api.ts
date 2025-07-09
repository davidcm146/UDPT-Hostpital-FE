// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// API Error types
export interface ApiError {
  message: string
  code: string
  details?: any
}

export interface UpdateAppointmentRequest {
  type?: "EMERGENCY" | "CHECKUP" | "FOLLOW-UP"
  appointmentDate?: Date | string
  startTime?: string
  endTime?: string
  reason?: string
  status?: "PENDING" | "CONFIRMED" | "CANCELLED"
}

export interface CreateScheduleRequest {
  doctorID: string
  date: Date | string
  startTime: string
  endTime: string
}

// Query parameters
export interface AppointmentQueryParams {
  doctorID?: string
  patientID?: string
  date?: string
  startDate?: string
  endDate?: string
  status?: "PENDING" | "CONFIRMED" | "CANCELLED"
  type?: "EMERGENCY" | "CHECKUP" | "FOLLOW-UP"
  page?: number
  limit?: number
}

export interface ScheduleQueryParams {
  doctorID?: string
  date?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface Response<T> {
  data?: T[] | T
  message: string
  code: number
}

export interface AppointmentRequest {
  patientId?: string
  doctorId?: string
  type?: string
  status?: string
  reason?: string
  appointmentId?: string
  size?: number
  page?: number
  signal?: AbortSignal
}

export interface AppointmentResponse<T> {
  data: T[]
  page: number
  pageSize: number
  totalPages: number
  totalElements: number
}