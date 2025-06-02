"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Calendar, X } from "lucide-react"
import type { Doctor } from "@/types/doctor"
import type { Schedule } from "@/types/schedule"
import { getScheduleByDoctorId, updateDoctorSchedule } from "@/data/doctor-schedule"

interface ScheduleTabProps {
  doctorData: Doctor
  isEditing: boolean
  onSave?: (data: Partial<Schedule>) => void
}

const ScheduleTab = ({ doctorData, isEditing, onSave }: ScheduleTabProps) => {
  const [schedule, setSchedule] = useState<Schedule | null>(null)

  useEffect(() => {
    const doctorSchedule = getScheduleByDoctorId(doctorData.id)
    setSchedule(doctorSchedule || null)
  }, [doctorData.id])

  const handleSave = () => {
    if (schedule) {
      const success = updateDoctorSchedule(doctorData.id, schedule)
      if (success) {
        onSave?.(schedule)
      }
    }
  }

  if (!schedule) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Schedule & Availability</CardTitle>
          <CardDescription>No schedule found for this doctor</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="bg-teal-600 hover:bg-teal-700">Create Schedule</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule & Availability</CardTitle>
        <CardDescription>Manage your working hours and availability</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium flex items-center">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              Regular Working Hours
            </h3>
            <div className="mt-4 border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Day
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Hours
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    {isEditing && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedule.regularHours.map((scheduleItem, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {scheduleItem.day}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {isEditing ? (
                          <Input defaultValue={scheduleItem.hours} className="w-full" />
                        ) : (
                          scheduleItem.hours
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            scheduleItem.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {scheduleItem.isAvailable ? "Available" : "Closed"}
                        </span>
                      </td>
                      {isEditing && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" className="text-teal-600 hover:text-teal-900">
                            Edit
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              Vacation & Time Off
            </h3>
            {isEditing ? (
              <div className="mt-2 space-y-2">
                {schedule.vacationDates.map((date, index) => (
                  <div key={index} className="flex items-center">
                    <Input defaultValue={date} className="flex-1" />
                    <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 text-gray-400 hover:text-gray-500">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="mt-2">
                  Add Vacation Period
                </Button>
              </div>
            ) : (
              <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
                {schedule.vacationDates.map((date, index) => (
                  <li key={index}>{date}</li>
                ))}
              </ul>
            )}
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ScheduleTab
