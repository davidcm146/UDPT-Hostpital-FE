import type { Appointment } from "@/types/appointment"

// Define the CreateAppointmentRequest type
export interface CreateAppointmentRequest {
  patientID: string
  doctorID: string
  appointmentDate: Date
  appointmentTime: string
}

// Mock appointments data
export const mockAppointments: Appointment[] = [
  {
    appointmentID: "550e8400-e29b-41d4-a716-446655440101",
    patientID: "550e8400-e29b-41d4-a716-446655440201",
    doctorID: "550e8400-e29b-41d4-a716-446655440001",
    status: "confirmed",
    appointmentDate: new Date("2024-01-15"),
    appointmentTime: "09:00",
    createdAt: new Date("2024-01-10T10:30:00"),
  },
  {
    appointmentID: "550e8400-e29b-41d4-a716-446655440102",
    patientID: "550e8400-e29b-41d4-a716-446655440202",
    doctorID: "550e8400-e29b-41d4-a716-446655440002",
    status: "pending",
    appointmentDate: new Date("2024-01-16"),
    appointmentTime: "14:00",
    createdAt: new Date("2024-01-11T14:20:00"),
  },
]

// Mock function to create appointment
export const createAppointment = (request: CreateAppointmentRequest): Appointment => {
  const newAppointment: Appointment = {
    appointmentID: `550e8400-e29b-41d4-a716-${Date.now()}`,
    patientID: request.patientID,
    doctorID: request.doctorID,
    status: "pending",
    appointmentDate: request.appointmentDate,
    appointmentTime: request.appointmentTime,
    createdAt: new Date(),
  }

  mockAppointments.push(newAppointment)
  return newAppointment
}

// Mock function to get appointments by doctor
export const getAppointmentsByDoctor = (doctorID: string): Appointment[] => {
  return mockAppointments.filter((apt) => apt.doctorID === doctorID)
}

// Mock function to get appointments by patient
export const getAppointmentsByPatient = (patientID: string): Appointment[] => {
  return mockAppointments.filter((apt) => apt.patientID === patientID)
}

// Mock function to update appointment status
export const updateAppointmentStatus = (appointmentID: string, status: Appointment["status"]): boolean => {
  const appointment = mockAppointments.find((apt) => apt.appointmentID === appointmentID)
  if (appointment) {
    appointment.status = status
    return true
  }
  return false
}
