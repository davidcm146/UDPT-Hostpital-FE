import type { Schedule } from "@/types/schedule"
import { mockAppointments } from "./appointment"

// Doctor working schedules - their regular working hours
export const mockSchedules: Schedule[] = [
  {
    id: "sch-001",
    doctorID: "550e8400-e29b-41d4-a716-446655440001", // Dr. Sarah Johnson
    date: "2025-07-01", // Monday
    startTime: "08:00",
    endTime: "17:00",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "sch-002",
    doctorID: "550e8400-e29b-41d4-a716-446655440001", // Dr. Sarah Johnson
    date: "2025-07-01", // Tuesday
    startTime: "08:00",
    endTime: "17:00",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "sch-003",
    doctorID: "550e8400-e29b-41d4-a716-446655440001", // Dr. Sarah Johnson
    date: "2025-07-01", // Wednesday
    startTime: "08:00",
    endTime: "17:00",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "sch-004",
    doctorID: "550e8400-e29b-41d4-a716-446655440002", // Dr. Michael Chen
    date: "2025-06-17", // Tuesday
    startTime: "09:00",
    endTime: "16:00",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "sch-005",
    doctorID: "550e8400-e29b-41d4-a716-446655440002", // Dr. Michael Chen
    date: "2025-06-18", // Wednesday
    startTime: "08:00",
    endTime: "17:00",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "sch-006",
    doctorID: "550e8400-e29b-41d4-a716-446655440003", // Dr. Emily Rodriguez
    date: "2025-06-17", // Wednesday
    startTime: "08:00",
    endTime: "16:00",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "sch-007",
    doctorID: "550e8400-e29b-41d4-a716-446655440004", // Dr. James Wilson
    date: "2025-06-17", // Thursday
    startTime: "10:00",
    endTime: "18:00",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "sch-008",
    doctorID: "550e8400-e29b-41d4-a716-446655440005", // Dr. Lisa Thompson
    date: "2025-06-17", // Friday
    startTime: "08:00",
    endTime: "15:00",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

// Function to check if doctor is working on a specific date
export const isDoctorWorking = (doctorID: string, date: Date): Schedule | null => {
  const dateString = date.toISOString().split("T")[0]
  return (
    mockSchedules.find(
      (schedule) =>
        schedule.doctorID === doctorID && new Date(schedule.date).toISOString().split("T")[0] === dateString,
    ) || null
  )
}

// Function to get doctor's working hours for a specific date
export const getDoctorWorkingHours = (doctorID: string, date: Date): { startTime: string; endTime: string } | null => {
  const schedule = isDoctorWorking(doctorID, date)
  if (!schedule) return null

  return {
    startTime: schedule.startTime,
    endTime: schedule.endTime,
  }
}

// Function to check if a time range is within doctor's working hours
export const isWithinWorkingHours = (doctorID: string, date: Date, startTime: string, endTime: string): boolean => {
  const workingHours = getDoctorWorkingHours(doctorID, date)
  if (!workingHours) return false

  const workStart = convertTimeToMinutes(workingHours.startTime)
  const workEnd = convertTimeToMinutes(workingHours.endTime)
  const requestStart = convertTimeToMinutes(startTime)
  const requestEnd = convertTimeToMinutes(endTime)

  return requestStart >= workStart && requestEnd <= workEnd
}

// Function to check if a time range conflicts with existing appointments
export const hasAppointmentConflict = (doctorID: string, date: Date, startTime: string, endTime: string): boolean => {
  const dateString = date.toISOString().split("T")[0]
  const requestedStart = convertTimeToMinutes(startTime)
  const requestedEnd = convertTimeToMinutes(endTime)

  const existingAppointments = mockAppointments.filter(
    (appointment) =>
      appointment.doctorId === doctorID &&
      appointment.status !== "CANCELLED" &&
      new Date(appointment.startTime).toISOString().split("T")[0] === dateString,
  )

  for (const appointment of existingAppointments) {
    const existingStart = convertTimeToMinutes(appointment.startTime)
    const existingEnd = convertTimeToMinutes(appointment.endTime)

    // Check for any overlap between requested time range and existing appointment
    if (
      (requestedStart >= existingStart && requestedStart < existingEnd) || // Start time overlaps
      (requestedEnd > existingStart && requestedEnd <= existingEnd) || // End time overlaps
      (requestedStart <= existingStart && requestedEnd >= existingEnd) // Requested range encompasses existing
    ) {
      return true
    }
  }

  return false
}

// Main function to check if a time range is available for booking
export const isTimeRangeAvailable = (doctorID: string, date: Date, startTime: string, endTime: string): boolean => {
  // First check if doctor is working on this date
  if (!isDoctorWorking(doctorID, date)) {
    return false
  }

  // Check if requested time is within doctor's working hours
  if (!isWithinWorkingHours(doctorID, date, startTime, endTime)) {
    return false
  }

  // Check if there are any appointment conflicts
  if (hasAppointmentConflict(doctorID, date, startTime, endTime)) {
    return false
  }

  return true
}

// Function to get all conflicting information for a time range
export const getTimeRangeConflicts = (doctorID: string, date: Date, startTime: string, endTime: string): string[] => {
  const conflicts: string[] = []

  // Check if doctor is working
  if (!isDoctorWorking(doctorID, date)) {
    conflicts.push("Doctor is not working on this date")
    return conflicts
  }

  // Check working hours
  if (!isWithinWorkingHours(doctorID, date, startTime, endTime)) {
    const workingHours = getDoctorWorkingHours(doctorID, date)
    if (workingHours) {
      conflicts.push(
        `Doctor's working hours: ${formatTimeDisplay(workingHours.startTime)} - ${formatTimeDisplay(workingHours.endTime)}`,
      )
    }
  }

  // Check appointment conflicts
  if (hasAppointmentConflict(doctorID, date, startTime, endTime)) {
    const conflictingAppointments = getConflictingAppointments(doctorID, date, startTime, endTime)
    conflictingAppointments.forEach((appointment) => {
      conflicts.push(
        `Existing appointment: ${formatTimeDisplay(appointment.startTime)} - ${formatTimeDisplay(appointment.endTime)}`,
      )
    })
  }

  return conflicts
}

// Function to get conflicting appointments
export const getConflictingAppointments = (doctorID: string, date: Date, startTime: string, endTime: string) => {
  const dateString = date.toISOString().split("T")[0]
  const requestedStart = convertTimeToMinutes(startTime)
  const requestedEnd = convertTimeToMinutes(endTime)

  return mockAppointments.filter((appointment) => {
    if (appointment.doctorId !== doctorID || appointment.status === "CANCELLED") return false
    if (new Date(appointment.startTime).toISOString().split("T")[0] !== dateString) return false

    const existingStart = convertTimeToMinutes(appointment.startTime)
    const existingEnd = convertTimeToMinutes(appointment.endTime)

    return (
      (requestedStart >= existingStart && requestedStart < existingEnd) ||
      (requestedEnd > existingStart && requestedEnd <= existingEnd) ||
      (requestedStart <= existingStart && requestedEnd >= existingEnd)
    )
  })
}

// Function to get booked time ranges for timeline visualization
export const getBookedTimeRanges = (doctorID: string, date: Date): Array<{ start: number; end: number }> => {
  const dateString = date.toISOString().split("T")[0]

  const bookedAppointments = mockAppointments.filter(
    (appointment) =>
      appointment.doctorId === doctorID &&
      appointment.status !== "CANCELLED" &&
      new Date(appointment.startTime).toISOString().split("T")[0] === dateString,
  )

  return bookedAppointments.map((appointment) => ({
    start: convertTimeToMinutes(appointment.startTime),
    end: convertTimeToMinutes(appointment.endTime),
  }))
}

// Helper function to convert time string to minutes for comparison
const convertTimeToMinutes = (timeString: string): number => {
  // Handle both "9:00 AM" and "09:00" formats
  let time = timeString
  let isPM = false

  if (timeString.includes("AM") || timeString.includes("PM")) {
    isPM = timeString.includes("PM")
    time = timeString.replace(/\s?(AM|PM)/, "")
  }

  const [hours, minutes] = time.split(":").map(Number)
  let totalMinutes = hours * 60 + minutes

  // Convert PM times (except 12 PM)
  if (isPM && hours !== 12) {
    totalMinutes += 12 * 60
  }
  // Convert 12 AM to 0 hours
  if (!isPM && hours === 12) {
    totalMinutes -= 12 * 60
  }

  return totalMinutes
}

// Helper function to format time for display
const formatTimeDisplay = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`
}

// Legacy function for backward compatibility
export const isTimeSlotAvailable = (doctorID: string, date: Date, timeSlot: string): boolean => {
  // Convert single time slot to a 1-hour range for checking
  const startTime = timeSlot.replace(/\s?(AM|PM)/, "").padStart(5, "0")
  const startMinutes = convertTimeToMinutes(startTime)
  const endMinutes = startMinutes + 60 // 1 hour duration
  const endTime = `${Math.floor(endMinutes / 60)
    .toString()
    .padStart(2, "0")}:${(endMinutes % 60).toString().padStart(2, "0")}`

  return isTimeRangeAvailable(doctorID, date, startTime, endTime)
}
