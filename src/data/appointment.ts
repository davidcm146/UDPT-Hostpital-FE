import type { Appointment, CreateAppointmentRequest } from "@/types/appointment"

// Mock appointments data
export const mockAppointments: Appointment[] = [
  {
    appointmentID: "550e8400-e29b-41d4-a716-446655440999",
    patientID: "550e8400-e29b-41d4-a716-446655440995",
    doctorID: "550e8400-e29b-41d4-a716-446655440001",
    status: "PENDING",
    type: "FOLLOW-UP",
    appointmentDate: "2025-06-16",
    startTime: "09:00",
    endTime: "09:30",
    reason: "Post-surgery follow-up appointment",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
  },
  {
    appointmentID: "550e8400-e29b-41d4-a716-446655440102",
    patientID: "550e8400-e29b-41d4-a716-446655440997",
    doctorID: "550e8400-e29b-41d4-a716-446655440002",
    status: "PENDING",
    type: "CHECKUP",
    appointmentDate: "2025-06-17",
    startTime: "10:30",
    endTime: "11:15",
    reason: "Initial consultation for chronic pain",
    createdAt: "2024-01-11",
    updatedAt: "2024-01-11",
  },
  {
    appointmentID: "550e8400-e29b-41d4-a716-446655440103",
    patientID: "550e8400-e29b-41d4-a716-446655440999",
    doctorID: "550e8400-e29b-41d4-a716-446655440003",
    status: "CONFIRMED",
    type: "CHECKUP",
    appointmentDate: "2025-06-16",
    startTime: "14:00",
    endTime: "14:30",
    reason: "Annual health check-up",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
  },
  {
    appointmentID: "apt-001",
    patientID: "550e8400-e29b-41d4-a716-446655440995", // John Doe
    doctorID: "550e8400-e29b-41d4-a716-446655440001", // Dr. Sarah Johnson
    status: "CONFIRMED",
    type: "CHECKUP",
    appointmentDate: "2025-06-17",
    startTime: "09:00",
    endTime: "10:00",
    reason: "Regular cardiac checkup",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    appointmentID: "apt-002",
    patientID: "550e8400-e29b-41d4-a716-446655440999", // Jane Smith
    doctorID: "550e8400-e29b-41d4-a716-446655440002", // Dr. Michael Chen
    status: "PENDING",
    type: "EMERGENCY",
    appointmentDate: "2024-01-21",
    startTime: "14:00",
    endTime: "15:30",
    reason: "Severe headache and dizziness",
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },
  {
    appointmentID: "apt-003",
    patientID: "550e8400-e29b-41d4-a716-446655440997", // Robert Johnson
    doctorID: "550e8400-e29b-41d4-a716-446655440003", // Dr. Emily Rodriguez
    status: "CONFIRMED",
    type: "FOLLOW-UP",
    appointmentDate: "2025-06-17",
    startTime: "10:30",
    endTime: "11:15",
    reason: "Follow-up on vaccination",
    createdAt: "2024-01-17",
    updatedAt: "2024-01-17",
  },
  {
    appointmentID: "apt-004",
    patientID: "550e8400-e29b-41d4-a716-446655440995", // John Doe
    doctorID: "550e8400-e29b-41d4-a716-446655440001", // Dr. Sarah Johnson
    status: "CANCELLED",
    type: "CHECKUP",
    appointmentDate: "2024-01-19",
    startTime: "15:00",
    endTime: "16:00",
    reason: "Annual physical examination",
    cancelReason: "Patient requested cancellation",
    createdAt: "2024-01-14",
    updatedAt: "2024-01-18",
  },
  {
    appointmentID: "apt-005",
    patientID: "550e8400-e29b-41d4-a716-446655440999", // Jane Smith
    doctorID: "550e8400-e29b-41d4-a716-446655440004", // Dr. James Wilson
    status: "CONFIRMED",
    type: "CHECKUP",
    appointmentDate: "2024-01-23",
    startTime: "11:00",
    endTime: "12:30",
    reason: "Orthopedic consultation for knee pain",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
  },
  {
    appointmentID: "apt-006",
    patientID: "550e8400-e29b-41d4-a716-446655440997", // Robert Johnson
    doctorID: "550e8400-e29b-41d4-a716-446655440005", // Dr. Lisa Thompson
    status: "PENDING",
    type: "CHECKUP",
    appointmentDate: "2024-01-24",
    startTime: "13:15",
    endTime: "14:00",
    reason: "Skin examination and mole check",
    createdAt: "2024-01-19",
    updatedAt: "2024-01-19",
  },
  {
    appointmentID: "apt-007",
    patientID: "550e8400-e29b-41d4-a716-446655440995", // John Doe
    doctorID: "550e8400-e29b-41d4-a716-446655440002", // Dr. Michael Chen
    status: "CONFIRMED",
    type: "FOLLOW-UP",
    appointmentDate: "2024-01-25",
    startTime: "08:30",
    endTime: "09:45",
    reason: "Neurological follow-up after headache treatment",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
]

// Mock function to create appointment
export const createAppointment = (request: CreateAppointmentRequest): Appointment => {
  const now = new Date().toISOString()
  const newAppointment: Appointment = {
    appointmentID: `550e8400-e29b-41d4-a716-${Date.now()}`,
    patientID: request.patientID,
    doctorID: request.doctorID,
    status: "PENDING",
    type: "CHECKUP", // default nếu chưa có param type trong request, bạn có thể thêm vào nếu muốn
    appointmentDate: request.appointmentDate,
    startTime: request.startTime,
    endTime: request.endTime,
    createdAt: now,
    updatedAt: now,
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
    appointment.updatedAt = new Date().toISOString()
    return true
  }
  return false
}
