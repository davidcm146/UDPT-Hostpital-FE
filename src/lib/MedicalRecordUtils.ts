import { CalendarDays, ClipboardList, Stethoscope, User } from "lucide-react"

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const getVisitTypeIcon = (visitType: string) => {
    switch (visitType?.toLowerCase()) {
      case "emergency":
        return ClipboardList
      case "follow-up":
        return CalendarDays
      case "consultation":
        return User
      case "regular checkup":
        return Stethoscope
      default:
        return Stethoscope
    }
  }

export const getVisitTypeColor = (visitType: string) => {
  switch (visitType.toLowerCase()) {
    case "emergency":
      return "bg-red-100 text-red-800"
    case "follow-up":
      return "bg-blue-100 text-blue-800"
    case "consultation":
      return "bg-purple-100 text-purple-800"
    case "regular checkup":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
