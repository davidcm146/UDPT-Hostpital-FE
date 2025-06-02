import { Button } from "@/components/ui/button"
import { CalendarPlus, Download } from "lucide-react"

export function ScheduleHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
        <p className="text-gray-600">Manage your appointments and schedule</p>
      </div>
      <div className="mt-4 md:mt-0 flex space-x-2">
        <Button className="bg-teal-600 hover:bg-teal-700">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Set Availability
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Schedule
        </Button>
      </div>
    </div>
  )
}
