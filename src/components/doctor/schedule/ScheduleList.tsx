"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, Clock, CalendarIcon, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DoctorAppointmentCard } from "./AppointmentCard"
import { AppointmentService } from "@/services/appointmentService"
import { ScheduleService } from "@/services/scheduleService"
import type { Appointment } from "@/types/appointment"
import type { DoctorScheduleResponse } from "@/types/schedule"
import { formatDate, formatTimeFromISO } from "@/lib/DateTimeUtils"

interface DoctorScheduleListProps {
  date?: Date
  isUpcoming?: boolean
  doctorID?: string
}

export function DoctorScheduleList({ date, isUpcoming = false, doctorID }: DoctorScheduleListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [schedule, setSchedule] = useState<DoctorScheduleResponse | null>(null)
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
      const dateString = date?.toISOString().split("T")[0] || ""

      if (date && !isUpcoming) {
        // Filter appointments for the selected date
        filteredAppointments = filteredAppointments.filter((appointment) => {
          const appointmentDate = appointment.startTime.split(" ")[0]
          return appointmentDate === dateString
        })

        // Fetch schedule for the selected date
        setIsLoadingSchedule(true)
        try {
          const schedules = await ScheduleService.fetchDoctorSchedules(doctorID)
          // Find schedule for the selected date
          const todaySchedule = schedules.find((s) => s.date === dateString) || null
          setSchedule(todaySchedule)
        } catch (err) {
          console.error("Error fetching schedule:", err)
          setSchedule(null)
        } finally {
          setIsLoadingSchedule(false)
        }
      } else if (isUpcoming) {
        // Filter for upcoming appointments
        const today = new Date()
        const todayString = today.toISOString().split("T")[0]

        filteredAppointments = filteredAppointments.filter((appointment) => {
          const appointmentDate = appointment.startTime.split(" ")[0]
          return appointmentDate >= todayString
        })

        // Sort upcoming appointments by date and time
        filteredAppointments.sort((a, b) => {
          const dateTimeA = new Date(a.startTime.replace(" ", "T"))
          const dateTimeB = new Date(b.startTime.replace(" ", "T"))
          return dateTimeA.getTime() - dateTimeB.getTime()
        })
      }

      // Sort appointments by time for a specific date
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
    // TODO: Implement appointment details dialog
  }

  const handleStartSession = (appointmentID: string) => {
    console.log("Start session for appointment:", appointmentID)
    // TODO: Implement start session functionality
  }

  const handleReschedule = (appointmentID: string) => {
    console.log("Reschedule appointment:", appointmentID)
    // TODO: Implement reschedule functionality
  }

  const isLoading = isLoadingAppointments || isLoadingSchedule
  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="text-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-gray-500">Loading schedule...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchData} className="bg-teal-600 hover:bg-teal-700">
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Work Schedule Display */}
          {date && !isUpcoming && schedule && schedule.workShifts?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="mr-2 h-5 w-5 text-teal-600" />
                  Work Schedule for {formatDate(date)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {schedule.workShifts.map((shift, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-sm py-1 px-3 bg-green-50 text-green-700 border-green-200"
                    >
                      {formatTimeFromISO(shift.startTime)} - {formatTimeFromISO(shift.endTime)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appointments List */}
          {appointments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <CalendarIcon className="mr-2 h-5 w-5 text-blue-600" />
                  {isUpcoming
                    ? `Upcoming Appointments (${appointments.length})`
                    : `Appointments for ${date?.toLocaleDateString()} (${appointments.length})`}
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

          {/* Empty State */}
          {appointments.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                {date && !isUpcoming && schedule && schedule?.workShifts?.length > 0 ? (
                  <>
                    <Clock className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Appointments Today</h3>
                    <p className="text-gray-500 mb-2">
                      You have no appointments scheduled for {date.toLocaleDateString()}.
                    </p>
                    <p className="text-sm text-gray-400">All work shift time slots are available for new bookings.</p>
                  </>
                ) : date && !isUpcoming && !schedule?.workShifts?.length ? (
                  <>
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Not Working Today</h3>
                    <p className="text-gray-500 mb-2">You are not scheduled to work on {date.toLocaleDateString()}.</p>
                    <p className="text-sm text-gray-400">No work shifts or appointments for this date.</p>
                  </>
                ) : isUpcoming ? (
                  <>
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Appointments</h3>
                    <p className="text-gray-500">You have no upcoming appointments scheduled.</p>
                  </>
                ) : (
                  <>
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Appointments</h3>
                    <p className="text-gray-500">No appointments found for the selected criteria.</p>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
