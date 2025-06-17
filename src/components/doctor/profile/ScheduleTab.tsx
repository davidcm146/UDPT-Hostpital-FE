"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock } from "lucide-react"
import { mockSchedules } from "@/data/schedule"
import type { Schedule } from "@/types/schedule"
import type { Doctor } from "@/types/doctor"
import { formatDate } from "@/lib/DateTimeUtils"
import ScheduleItem from "./ScheduleItem"

interface ScheduleTabProps {
  doctorData: Doctor
  // isEditing: boolean
  currentDate?: Date
  onSave?: (schedules: Schedule[]) => void
}

const ScheduleTab = ({ doctorData, currentDate = new Date(), onSave }: ScheduleTabProps) => {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

  // Memoize the next 7 days to prevent infinite re-renders
  const next7Days = useMemo(() => {
    const getDatePlusDays = (date: Date, days: number): Date => {
      const result = new Date(date)
      result.setDate(result.getDate() + days)
      return result
    }

    return Array.from({ length: 7 }, (_, i) => getDatePlusDays(currentDate, i))
  }, [currentDate])

  // Memoize the current date string to prevent unnecessary re-renders
  const currentDateString = useMemo(() => {
    return currentDate.toISOString().split("T")[0]
  }, [currentDate])

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true)
      try {
        // Filter schedules for this doctor and next 7 days
        const doctorSchedules = mockSchedules.filter((schedule) => {
          const scheduleDate = new Date(schedule.date)
          const isInNext7Days = next7Days.some(
            (day) => day.toISOString().split("T")[0] === scheduleDate.toISOString().split("T")[0],
          )
          return schedule.doctorID === doctorData.userId && isInNext7Days
        })

        setSchedules(doctorSchedules)
      } catch (error) {
        console.error("Error fetching schedules:", error)
        setSchedules([])
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()
  }, [doctorData.userId, currentDateString]) // Use memoized values

  const getScheduleForDate = (date: Date): Schedule | null => {
    const dateString = date.toISOString().split("T")[0]
    return (
      schedules.find((schedule) => {
        const scheduleDate = new Date(schedule.date).toISOString().split("T")[0]
        return scheduleDate === dateString
      }) || null
    )
  }

  const handleScheduleChange = (date: Date, field: "startTime" | "endTime", value: string) => {
    const dateString = date.toISOString().split("T")[0]
    const existingSchedule = getScheduleForDate(date)

    if (existingSchedule) {
      // Update existing schedule
      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === existingSchedule.id
            ? { ...schedule, [field]: value, updatedAt: new Date().toISOString() }
            : schedule,
        ),
      )
    } else {
      // This shouldn't happen if we use handleAddHours properly
      console.warn("Trying to change schedule that doesn't exist")
    }
  }

  const handleAddHours = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    const existingSchedule = getScheduleForDate(date)

    if (!existingSchedule) {
      const newSchedule: Schedule = {
        id: `temp-${Date.now()}`,
        doctorID: doctorData.userId,
        date: dateString,
        startTime: "09:00",
        endTime: "17:00",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setSchedules((prev) => [...prev, newSchedule])
    }
  }

  const handleRemoveSchedule = (date: Date) => {
    const schedule = getScheduleForDate(date)
    if (schedule) {
      setSchedules((prev) => prev.filter((s) => s.id !== schedule.id))
    }
  }

  const handleSave = async () => {
    try {
      // TODO: Save via API
      console.log("Saving schedules:", schedules)
      onSave?.(schedules)
    } catch (error) {
      console.error("Error saving schedules:", error)
    }
  }

  const handleClearAll = () => {
    setSchedules([])
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Schedule & Availability</CardTitle>
          <CardDescription>Loading schedule...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule & Availability</CardTitle>
        <CardDescription>
          Manage working hours for the next 7 days starting from {formatDate(currentDate)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium flex items-center mb-4">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              Weekly Schedule
            </h3>

            <div className="space-y-3">
              {next7Days.map((date) => {
                const schedule = getScheduleForDate(date)
                return (
                  <ScheduleItem
                    key={date.toISOString()}
                    date={date}
                    schedule={schedule}
                    // isEditing={isEditing}
                    // onChange={handleScheduleChange}
                    // onRemove={handleRemoveSchedule}
                    // onAddHours={handleAddHours}
                  />
                )
              })}
            </div>
          </div>

          {/* <div className="flex items-center justify-between">

            {isEditing && (
              <div className="flex space-x-2 w-full justify-end">
                <Button variant="outline" onClick={handleClearAll}>
                  Clear All
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            )}
          </div> */}

          {schedules.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedule Set</h3>
              <p className="text-gray-600">No working hours have been configured for the next 7 days.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ScheduleTab
