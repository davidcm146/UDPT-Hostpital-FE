"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, Clock, CalendarIcon, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DoctorAppointmentCard } from "./AppointmentCard"
import { AppointmentService } from "@/services/appointmentService"
import { ScheduleService } from "@/services/scheduleService"
import type { Appointment } from "@/types/appointment"
import type { ScheduleResponse, TimeFrame } from "@/types/schedule"

interface DoctorScheduleListProps {
  date?: Date
  isUpcoming?: boolean
  doctorID?: string
}

export function DoctorScheduleList({
  date,
  isUpcoming = false,
  doctorID,
}: DoctorScheduleListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null)
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true)
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!doctorID) return

    setError(null)
    setIsLoadingAppointments(true)

    try {
      const response = await AppointmentService.getAppointments({
        doctorId: doctorID,
        page: 0,
        size: 4,
      })

      let filteredAppointments = response.data

      if (date && !isUpcoming) {
        const dateString = date.toLocaleDateString("en-CA")
        filteredAppointments = filteredAppointments.filter((appointment) => {
          const appointmentDate = appointment.startTime.split(" ")[0]
          return appointmentDate === dateString
        })

        setIsLoadingSchedule(true)
        try {
          const scheduleData = await ScheduleService.getDoctorSchedule(doctorID, dateString)
          setSchedule(scheduleData)
        } catch (err) {
          console.error("Error fetching schedule:", err)
          setSchedule(null)
        } finally {
          setIsLoadingSchedule(false)
        }
      } else if (isUpcoming) {
        const today = new Date()
        const todayString = today.toISOString().split("T")[0]

        filteredAppointments = filteredAppointments.filter((appointment) => {
          const appointmentDate = appointment.startTime.split(" ")[0]
          return appointmentDate >= todayString
        })

        filteredAppointments.sort((a, b) => {
          const dateTimeA = new Date(a.startTime.replace(" ", "T"))
          const dateTimeB = new Date(b.startTime.replace(" ", "T"))
          return dateTimeA.getTime() - dateTimeB.getTime()
        })
      }

      if (date && !isUpcoming) {
        filteredAppointments.sort((a, b) => {
          const timeA = a.startTime.split(" ")[1]
          const timeB = b.startTime.split(" ")[1]
          return timeA.localeCompare(timeB)
        })
      }

      setAppointments(filteredAppointments)
    } catch (err) {
      console.error("Error fetching appointments:", err)
      setError("Failed to load appointments")
      setAppointments([])
    } finally {
      setIsLoadingAppointments(false)
    }
  }, [date, isUpcoming, doctorID])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleViewDetails = (appointmentID: string) => {
    console.log("View details for appointment:", appointmentID)
  }

  const handleStartSession = (appointmentID: string) => {
    console.log("Start session for appointment:", appointmentID)
  }

  const handleReschedule = (appointmentID: string) => {
    console.log("Reschedule appointment:", appointmentID)
  }

  const formatTimeFrame = (timeFrame: TimeFrame) => {
    const start = new Date(timeFrame.startTime)
    const end = new Date(timeFrame.endTime)
    const startTime = `${start.getHours().toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")}`
    const endTime = `${end.getHours().toString().padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}`
    return `${startTime} - ${endTime}`
  }

  const isLoading = isLoadingAppointments || isLoadingSchedule

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        <p className="text-gray-500">Loading schedule...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {date && !isUpcoming && schedule && schedule.timeFrames.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Clock className="mr-2 h-5 w-5 text-teal-600" />
              Available Time Slots Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {schedule.timeFrames.map((timeFrame, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-sm py-1 px-3 bg-green-50 text-green-700 border-green-200"
                >
                  {formatTimeFrame(timeFrame)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {appointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CalendarIcon className="mr-2 h-5 w-5 text-blue-600" />
              {isUpcoming
                ? `Upcoming Appointments (${appointments.length})`
                : `Today's Appointments (${appointments.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.map((appointment) => (
              <DoctorAppointmentCard
                key={appointment.id}
                appointment={appointment}
                onViewDetails={handleViewDetails}
                onStartSession={handleStartSession}
                onReschedule={handleReschedule}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {appointments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            {date && !isUpcoming && schedule && schedule.timeFrames.length > 0 ? (
              <>
                <Clock className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No appointments scheduled for today.</p>
                <p className="text-sm text-gray-400">All available time slots are free for booking.</p>
              </>
            ) : (
              <>
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">
                  {isUpcoming ? "No upcoming appointments scheduled." : "No appointments for today."}
                </p>
                {date && !isUpcoming && !schedule?.timeFrames.length && (
                  <p className="text-sm text-gray-400">You may not be available today.</p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
