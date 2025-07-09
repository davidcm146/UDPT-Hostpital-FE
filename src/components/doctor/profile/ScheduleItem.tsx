import type { DoctorScheduleResponse } from "@/types/schedule"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatTimeFromISO } from "@/lib/DateTimeUtils"

interface ScheduleItemProps {
  schedule: DoctorScheduleResponse
  date?: string // Optional date prop since ScheduleResponse doesn't include date
}

const ScheduleItem = ({ schedule, date }: ScheduleItemProps) => {
  const isToday = (dateString?: string): boolean => {
    if (!dateString) return false
    const dateObj = new Date(dateString)
    const today = new Date()
    return dateObj.toDateString() === today.toDateString()
  }

  const hasAvailability = schedule.workShifts && schedule.workShifts.length > 0

  return (
    <div
      className={`border rounded-lg p-6 ${isToday(date) ? "border-teal-200 bg-teal-50" : "border-gray-200 bg-white"}`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold ${isToday(date) ? "text-teal-900" : "text-gray-900"}`}>
              {formatDate(date || "")}
              {isToday(date) && <span className="ml-2 text-sm font-medium text-teal-600">(Today)</span>}
            </h3>
          </div>
          <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
            {schedule.workShifts?.length || 0} slot{schedule.workShifts?.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-teal-600" />
          <h4 className="text-base font-medium text-gray-900">Available Time Slots</h4>
        </div>

        {hasAvailability ? (
          <div className="flex flex-wrap gap-2">
            {schedule.workShifts.map((workShift, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-3 py-2 text-sm font-medium bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100"
              >
                {formatTimeFromISO(workShift.startTime)} - {formatTimeFromISO(workShift.endTime)}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">No time slots available</div>
        )}
      </div>
    </div>
  )
}

export default ScheduleItem
