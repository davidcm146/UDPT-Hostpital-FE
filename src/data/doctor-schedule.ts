import type { Schedule } from "@/types/schedule"

export const mockDoctorSchedules: Schedule[] = [
  {
    doctorID: "550e8400-e29b-41d4-a716-446655440001",
    regularHours: [
      { day: "Monday", hours: "8:00 AM - 5:00 PM", isAvailable: true },
      { day: "Tuesday", hours: "8:00 AM - 5:00 PM", isAvailable: true },
      { day: "Wednesday", hours: "8:00 AM - 5:00 PM", isAvailable: true },
      { day: "Thursday", hours: "8:00 AM - 5:00 PM", isAvailable: true },
      { day: "Friday", hours: "8:00 AM - 3:00 PM", isAvailable: true },
      { day: "Saturday", hours: "Closed", isAvailable: false },
      { day: "Sunday", hours: "Closed", isAvailable: false },
    ],
    vacationDates: [
      "December 23-31, 2024 (Holiday Break)",
      "July 15-22, 2025 (Summer Vacation)",
      "March 10-12, 2025 (Medical Conference)",
    ],
    timeSlots: [
      { startTime: "08:00", endTime: "08:30", duration: 30 },
      { startTime: "08:30", endTime: "09:00", duration: 30 },
      { startTime: "09:00", endTime: "09:30", duration: 30 },
      { startTime: "09:30", endTime: "10:00", duration: 30 },
    ],
    breakTimes: [
      { startTime: "12:00", endTime: "13:00", description: "Lunch Break" },
      { startTime: "15:00", endTime: "15:15", description: "Afternoon Break" },
    ],
    specialAvailability: [{ date: "2025-06-01", hours: "6:00 AM - 8:00 AM", note: "Emergency coverage" }],
    lastUpdated: new Date("2024-01-15T10:30:00"),
  },
  {
    doctorID: "550e8400-e29b-41d4-a716-446655440002",
    regularHours: [
      { day: "Monday", hours: "9:00 AM - 6:00 PM", isAvailable: true },
      { day: "Tuesday", hours: "9:00 AM - 6:00 PM", isAvailable: true },
      { day: "Wednesday", hours: "9:00 AM - 6:00 PM", isAvailable: true },
      { day: "Thursday", hours: "9:00 AM - 6:00 PM", isAvailable: true },
      { day: "Friday", hours: "9:00 AM - 4:00 PM", isAvailable: true },
      { day: "Saturday", hours: "9:00 AM - 1:00 PM", isAvailable: true },
      { day: "Sunday", hours: "Closed", isAvailable: false },
    ],
    vacationDates: ["August 5-12, 2025 (Family Vacation)", "December 25-26, 2024 (Christmas Holiday)"],
    timeSlots: [
      { startTime: "09:00", endTime: "09:45", duration: 45 },
      { startTime: "09:45", endTime: "10:30", duration: 45 },
      { startTime: "10:30", endTime: "11:15", duration: 45 },
    ],
    breakTimes: [{ startTime: "12:30", endTime: "13:30", description: "Lunch Break" }],
    lastUpdated: new Date("2024-01-10T14:20:00"),
  },
]

// Helper functions
export const getScheduleByDoctorId = (doctorID: string): Schedule | undefined => {
  return mockDoctorSchedules.find((schedule) => schedule.doctorID === doctorID)
}

export const updateDoctorSchedule = (doctorID: string, updatedSchedule: Partial<Schedule>): boolean => {
  const scheduleIndex = mockDoctorSchedules.findIndex((schedule) => schedule.doctorID === doctorID)
  if (scheduleIndex !== -1) {
    mockDoctorSchedules[scheduleIndex] = {
      ...mockDoctorSchedules[scheduleIndex],
      ...updatedSchedule,
      lastUpdated: new Date(),
    }
    return true
  }
  return false
}

export const createDoctorSchedule = (schedule: Schedule): boolean => {
  const existingSchedule = getScheduleByDoctorId(schedule.doctorID)
  if (!existingSchedule) {
    mockDoctorSchedules.push(schedule)
    return true
  }
  return false
}
