import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Clock, CalendarIcon } from "lucide-react"
import { DoctorAppointmentCard } from "./AppointmentCard"
import { AppointmentService } from "@/services/appointmentService"
import { ScheduleService } from "@/services/scheduleService"
import type { Appointment } from "@/types/appointment"
import type { ScheduleResponse, TimeFrame } from "@/types/schedule"

interface DoctorScheduleCalendarProps {
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
  doctorID?: string
}

export function DoctorScheduleCalendar({
  selectedDate,
  setSelectedDate,
  doctorID,
}: DoctorScheduleCalendarProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null)
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false)
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch both appointments and schedule for the selected date
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDate || !doctorID) return

      setError(null)
      const dateString = selectedDate.toLocaleDateString("en-CA");

      // Fetch appointments
      setIsLoadingAppointments(true)
      try {
        const response = await AppointmentService.getAppointments({
          doctorId: doctorID,
          page: 0,
          size: 4,
        })

        // Filter appointments for the selected date
        const filteredAppointments = response.data.filter((appointment) => {
          const appointmentDate = appointment.startTime.split(" ")[0]
          return appointmentDate === dateString
        })

        setAppointments(filteredAppointments)
      } catch (err) {
        console.error("Error fetching appointments:", err)
        setError("Failed to load appointments")
        setAppointments([])
      } finally {
        setIsLoadingAppointments(false)
      }

      // Fetch doctor schedule (available time slots)
      setIsLoadingSchedule(true)
      try {
        const scheduleData = await ScheduleService.getDoctorSchedule(doctorID, dateString)
        setSchedule(scheduleData)
      } catch (err) {
        console.error("Error fetching schedule:", err)
        // Don't set error for schedule as it's optional
        setSchedule(null)
      } finally {
        setIsLoadingSchedule(false)
      }
    }

    fetchData()
  }, [selectedDate, doctorID])

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
          />
        </CardContent>
      </Card>

      <div className="md:col-span-2 space-y-4">
        <h3 className="text-xl font-semibold">
          {selectedDate
            ? selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })
            : "Select a date"}
        </h3>

        {isLoading && (
          <Card>
            <CardContent className="p-6 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-gray-500">Loading schedule...</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && selectedDate && (
          <>
            {/* Available Time Slots */}
            {schedule && schedule.timeFrames.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Clock className="mr-2 h-5 w-5 text-teal-600" />
                    Available Time Slots
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

            {/* Booked Appointments */}
            {appointments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <CalendarIcon className="mr-2 h-5 w-5 text-blue-600" />
                    Scheduled Appointments ({appointments.length})
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

            {schedule && schedule.timeFrames.length === 0 && appointments.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No schedule or appointments for this date.</p>
                  <p className="text-sm text-gray-400">The doctor may not be available on this day.</p>
                </CardContent>
              </Card>
            )}

            {schedule && schedule.timeFrames.length > 0 && appointments.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No appointments scheduled.</p>
                  <p className="text-sm text-gray-400">All time slots are available for booking.</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
