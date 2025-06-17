"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Schedule } from "@/types/schedule"
import { formatDate } from "@/lib/DateTimeUtils"

interface ScheduleItemProps {
  date: Date
  schedule: Schedule | null
//   onAddHours: (date: Date) => void
}

const ScheduleItem = ({ date, schedule }: ScheduleItemProps) => {
  const isToday = date.toDateString() === new Date().toDateString()

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
    return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  return (
    <div className={`border rounded-lg p-4 ${isToday ? "border-teal-200 bg-teal-50" : "border-gray-200"}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="min-w-0 flex-1">
              <h4 className={`text-sm font-medium ${isToday ? "text-teal-900" : "text-gray-900"}`}>
                {formatDate(date)}
                {isToday && <span className="ml-2 text-xs text-teal-600">(Today)</span>}
              </h4>
            </div>

            {schedule ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 mr-8">
                  {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                </span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-2 bg-green-100 text-green-800">
                  Available
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  Not Available
                </span>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScheduleItem
