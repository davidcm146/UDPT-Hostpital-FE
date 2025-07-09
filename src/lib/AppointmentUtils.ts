import { Appointment } from "@/types/appointment"

export const getPatientInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export const getStatusBadgeColor = (status: Appointment["status"]): string => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800"
    case "CONFIRMED":
      return "bg-green-100 text-green-800"
    case "CANCELLED":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getStatusText = (status: Appointment["status"]): string => {
  switch (status) {
    case "PENDING":
      return "Pending"
    case "CONFIRMED":
      return "Confirmed"
    case "CANCELLED":
      return "Cancelled"
    default:
      return status
  }
}

export const formatAppointmentTime = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`
}

export const calculateDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime.replace(" ", "T"))
  const end = new Date(endTime.replace(" ", "T"))
  const diffMs = end.getTime() - start.getTime()
  const diffMins = Math.round(diffMs / (1000 * 60))
  return `${diffMins} min`
}