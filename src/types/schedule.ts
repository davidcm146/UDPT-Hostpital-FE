export interface Schedule {
  doctorID: string // Reference to doctor
  regularHours: Array<{
    day: string
    hours: string
    isAvailable: boolean
  }>
  vacationDates: string[]
  timeSlots: Array<{
    startTime: string
    endTime: string
    duration: number // in minutes
  }>
  breakTimes: Array<{
    startTime: string
    endTime: string
    description: string
  }>
  specialAvailability?: Array<{
    date: string
    hours: string
    note?: string
  }>
  lastUpdated: Date
}
