import { ScheduleService } from "./scheduleService"
import { AppointmentService } from "./appointmentService"

// Service for checking time availability and conflicts
export class AvailabilityService {
  // Check if a time range is available for booking
  static async isTimeRangeAvailable(
    doctorID: string,
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    try {
      // Check if doctor is working
      const isWorking = await ScheduleService.isDoctorWorking(doctorID, date)
      if (!isWorking) return false

      // Check if time is within working hours
      const isWithinHours = await this.isWithinWorkingHours(doctorID, date, startTime, endTime)
      if (!isWithinHours) return false

      // Check for appointment conflicts
      const hasConflict = await this.hasAppointmentConflict(doctorID, date, startTime, endTime)
      if (hasConflict) return false

      return true
    } catch (error) {
      console.error("Error checking time range availability:", error)
      return false
    }
  }

  // Check if time range is within doctor's working hours
  static async isWithinWorkingHours(
    doctorID: string,
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    try {
      const workingHours = await ScheduleService.getDoctorWorkingHours(doctorID, date)
      if (!workingHours) return false

      const workStart = this.convertTimeToMinutes(workingHours.startTime)
      const workEnd = this.convertTimeToMinutes(workingHours.endTime)
      const requestStart = this.convertTimeToMinutes(startTime)
      const requestEnd = this.convertTimeToMinutes(endTime)

      return requestStart >= workStart && requestEnd <= workEnd
    } catch (error) {
      console.error("Error checking working hours:", error)
      return false
    }
  }

  // Check if time range conflicts with existing appointments
  static async hasAppointmentConflict(
    doctorID: string,
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    try {
      const appointments = await AppointmentService.getDoctorAppointments(doctorID, date)
      const activeAppointments = appointments.filter((apt) => apt.status !== "CANCELLED")

      const requestStart = this.convertTimeToMinutes(startTime)
      const requestEnd = this.convertTimeToMinutes(endTime)

      for (const appointment of activeAppointments) {
        const existingStart = this.convertTimeToMinutes(appointment.startTime)
        const existingEnd = this.convertTimeToMinutes(appointment.endTime)

        // Check for overlap
        if (
          (requestStart >= existingStart && requestStart < existingEnd) ||
          (requestEnd > existingStart && requestEnd <= existingEnd) ||
          (requestStart <= existingStart && requestEnd >= existingEnd)
        ) {
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error checking appointment conflicts:", error)
      return true // Return true to be safe
    }
  }

  // Get all conflicts for a time range (detailed information)
  static async getTimeRangeConflicts(
    doctorID: string,
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<string[]> {
    try {
      const conflicts: string[] = []

      // Check if doctor is working
      const isWorking = await ScheduleService.isDoctorWorking(doctorID, date)
      if (!isWorking) {
        conflicts.push("Doctor is not working on this date")
        return conflicts
      }

      // Check working hours
      const isWithinHours = await this.isWithinWorkingHours(doctorID, date, startTime, endTime)
      if (!isWithinHours) {
        const workingHours = await ScheduleService.getDoctorWorkingHours(doctorID, date)
        if (workingHours) {
          conflicts.push(
            `Doctor's working hours: ${this.formatTimeDisplay(workingHours.startTime)} - ${this.formatTimeDisplay(workingHours.endTime)}`,
          )
        }
      }

      // Check appointment conflicts
      const hasConflict = await this.hasAppointmentConflict(doctorID, date, startTime, endTime)
      if (hasConflict) {
        const conflictingAppointments = await this.getConflictingAppointments(doctorID, date, startTime, endTime)
        conflictingAppointments.forEach((appointment) => {
          conflicts.push(
            `Existing appointment: ${this.formatTimeDisplay(appointment.startTime)} - ${this.formatTimeDisplay(appointment.endTime)}`,
          )
        })
      }

      return conflicts
    } catch (error) {
      console.error("Error getting time range conflicts:", error)
      return ["Error checking availability"]
    }
  }

  // Get conflicting appointments
  static async getConflictingAppointments(doctorID: string, date: string, startTime: string, endTime: string) {
    try {
      const appointments = await AppointmentService.getDoctorAppointments(doctorID, date)
      const activeAppointments = appointments.filter((apt) => apt.status !== "CANCELLED")

      const requestStart = this.convertTimeToMinutes(startTime)
      const requestEnd = this.convertTimeToMinutes(endTime)

      return activeAppointments.filter((appointment) => {
        const existingStart = this.convertTimeToMinutes(appointment.startTime)
        const existingEnd = this.convertTimeToMinutes(appointment.endTime)

        return (
          (requestStart >= existingStart && requestStart < existingEnd) ||
          (requestEnd > existingStart && requestEnd <= existingEnd) ||
          (requestStart <= existingStart && requestEnd >= existingEnd)
        )
      })
    } catch (error) {
      console.error("Error getting conflicting appointments:", error)
      return []
    }
  }

  // Get booked time ranges for timeline visualization
  static async getBookedTimeRanges(doctorID: string, date: string): Promise<Array<{ start: number; end: number }>> {
    try {
      const appointments = await AppointmentService.getDoctorAppointments(doctorID, date)
      const activeAppointments = appointments.filter((apt) => apt.status !== "CANCELLED")

      return activeAppointments.map((appointment) => ({
        start: this.convertTimeToMinutes(appointment.startTime),
        end: this.convertTimeToMinutes(appointment.endTime),
      }))
    } catch (error) {
      console.error("Error getting booked time ranges:", error)
      return []
    }
  }

  // Get available time slots for a doctor on a specific date
  static async getAvailableTimeSlots(
    doctorID: string,
    date: string,
    duration = 60,
  ): Promise<Array<{ startTime: string; endTime: string }>> {
    try {
      const workingHours = await ScheduleService.getDoctorWorkingHours(doctorID, date)
      if (!workingHours) return []

      const bookedRanges = await this.getBookedTimeRanges(doctorID, date)
      const availableSlots: Array<{ startTime: string; endTime: string }> = []

      const workStart = this.convertTimeToMinutes(workingHours.startTime)
      const workEnd = this.convertTimeToMinutes(workingHours.endTime)

      // Sort booked ranges by start time
      bookedRanges.sort((a, b) => a.start - b.start)

      let currentTime = workStart

      for (const bookedRange of bookedRanges) {
        // Check if there's a gap before this booked range
        if (currentTime + duration <= bookedRange.start) {
          // Add available slots in this gap
          while (currentTime + duration <= bookedRange.start) {
            availableSlots.push({
              startTime: this.formatTimeFromMinutes(currentTime),
              endTime: this.formatTimeFromMinutes(currentTime + duration),
            })
            currentTime += 15 // 15-minute intervals
          }
        }
        currentTime = Math.max(currentTime, bookedRange.end)
      }

      // Check for available slots after the last booked appointment
      while (currentTime + duration <= workEnd) {
        availableSlots.push({
          startTime: this.formatTimeFromMinutes(currentTime),
          endTime: this.formatTimeFromMinutes(currentTime + duration),
        })
        currentTime += 15
      }

      return availableSlots
    } catch (error) {
      console.error("Error getting available time slots:", error)
      return []
    }
  }

  // Helper function to convert time string to minutes
  private static convertTimeToMinutes(timeString: string): number {
    let time = timeString
    let isPM = false

    if (timeString.includes("AM") || timeString.includes("PM")) {
      isPM = timeString.includes("PM")
      time = timeString.replace(/\s?(AM|PM)/, "")
    }

    const [hours, minutes] = time.split(":").map(Number)
    let totalMinutes = hours * 60 + minutes

    if (isPM && hours !== 12) {
      totalMinutes += 12 * 60
    }
    if (!isPM && hours === 12) {
      totalMinutes -= 12 * 60
    }

    return totalMinutes
  }

  // Helper function to convert minutes back to time string
  private static formatTimeFromMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
  }

  // Helper function to format time for display
  private static formatTimeDisplay(time: string): string {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
    return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`
  }
}
