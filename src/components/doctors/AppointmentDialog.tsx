"use client"

import { useState, useEffect } from "react"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Doctor } from "@/types/doctor"
import type { DoctorScheduleResponse, AvailableScheduleResponse } from "@/types/schedule"
import type { CreateAppointmentRequest } from "@/types/appointment"
import { ScheduleService } from "@/services/scheduleService"
import TimeRangePicker from "./TimerangePicker"
import { toast } from "react-toastify"
import { AppointmentService } from "@/services/appointmentService"
import { formatDate } from "@/lib/DateTimeUtils"
import { useAuth } from "@/hooks/AuthContext"

interface AppointmentDialogProps {
  selectedDoctor: Doctor | null
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
  onConfirmAppointment: () => void
}

const AppointmentDialog = ({
  selectedDoctor,
  selectedDate,
  setSelectedDate,
  onConfirmAppointment,
}: AppointmentDialogProps) => {
  const [appointmentType, setAppointmentType] = useState<CreateAppointmentRequest["type"] | "">("")
  const [reason, setReason] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [doctorSchedule, setDoctorSchedule] = useState<DoctorScheduleResponse | null>(null)
  const [availableTimeFrames, setAvailableTimeFrames] = useState<AvailableScheduleResponse | null>(null)
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false)
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false)
  const [scheduleError, setScheduleError] = useState<string | null>(null)
  const { user } = useAuth();

  // Fetch doctor schedule and available appointments when date changes
  useEffect(() => {
    const fetchScheduleData = async () => {
      if (!selectedDoctor || !selectedDate) {
        setDoctorSchedule(null)
        setAvailableTimeFrames(null)
        return
      }

      setIsLoadingSchedule(true)
      setScheduleError(null)
      setStartTime("")
      setEndTime("")

      try {
        const dateString = selectedDate.toLocaleDateString("en-CA") // Format: YYYY-MM-DD
        console.log("Fetching schedule data for:", { doctorId: selectedDoctor.id, date: dateString })

        // Fetch both doctor schedule and available timeframes in parallel
        const [workSchedules, availableData] = await Promise.all([
          ScheduleService.fetchDoctorSchedules("fde7f72c-3156-4a00-95ae-873600eb2798"),
          ScheduleService.getDoctorAvailableSchedule("fde7f72c-3156-4a00-95ae-873600eb2798", dateString),
        ])

        // Find the schedule for the selected date
        const daySchedule = workSchedules.find((schedule) => schedule.date === dateString)

        if (daySchedule) {
          setDoctorSchedule(daySchedule)
        } else {
          setDoctorSchedule({ doctorId: selectedDoctor.id, date: dateString, workShifts: [] })
        }

        setAvailableTimeFrames(availableData)

        if (!daySchedule || !daySchedule.workShifts || daySchedule.workShifts.length === 0) {
          setScheduleError("Doctor is not scheduled to work on this date.")
        } else if (!availableData.timeFrames || availableData.timeFrames.length === 0) {
          setScheduleError("No available appointment slots for this date. All slots may be booked.")
        }
      } catch (error) {
        console.error("Error fetching schedule data:", error)
        setScheduleError("Failed to load schedule information")
        setDoctorSchedule(null)
        setAvailableTimeFrames(null)
      } finally {
        setIsLoadingSchedule(false)
      }
    }

    fetchScheduleData()
  }, [selectedDoctor, selectedDate])

  // Helper function to format time for API
  const formatTimeForAPI = (date: Date, time: string): string => {
    const dateStr = date.toLocaleDateString("en-CA")
    return `${dateStr} ${time}:00` // YYYY-MM-DD HH:mm:ss
  }

  // Helper function to convert time string to minutes
  const timeToMinutes = (time: string): number => {
    if (time.includes("T")) {
      const date = new Date(time)
      return date.getHours() * 60 + date.getMinutes()
    } else {
      const [hourStr, minuteStr] = time.split(":")
      return Number.parseInt(hourStr) * 60 + Number.parseInt(minuteStr)
    }
  }

  // Validate appointment time against available timeframes
  const validateAppointmentTime = (startTime: string, endTime: string): string[] => {
    const errors: string[] = []

    if (!availableTimeFrames || !availableTimeFrames.timeFrames || availableTimeFrames.timeFrames.length === 0) {
      errors.push("No available time slots")
      return errors
    }

    const [startHours, startMinutes] = startTime.split(":").map(Number)
    const [endHours, endMinutes] = endTime.split(":").map(Number)
    const startTotalMinutes = startHours * 60 + startMinutes
    const endTotalMinutes = endHours * 60 + endMinutes

    // Check if appointment duration is valid
    const duration = endTotalMinutes - startTotalMinutes
    if (duration <= 0) {
      errors.push("End time must be after start time")
    }
    if (duration < 15) {
      errors.push("Minimum appointment duration is 15 minutes")
    }
    if (duration > 240) {
      errors.push("Maximum appointment duration is 4 hours")
    }

    // Check if the entire appointment time range is within available timeframes
    const isWithinAvailableSlot = availableTimeFrames.timeFrames.some((availableSlot) => {
      const availableStart = timeToMinutes(availableSlot.startTime)
      const availableEnd = timeToMinutes(availableSlot.endTime)
      return startTotalMinutes >= availableStart && endTotalMinutes <= availableEnd
    })

    if (!isWithinAvailableSlot) {
      errors.push("Selected time is not available or conflicts with existing appointments")
    }

    return errors
  }

  const handleConfirmAppointment = async () => {
    if (!startTime || !endTime || !selectedDoctor || !selectedDate || !appointmentType || !reason.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    // Validate appointment time
    const validationErrors = validateAppointmentTime(startTime, endTime)
    if (validationErrors.length > 0) {
      toast.error(`Validation failed: ${validationErrors.join(", ")}`)
      return
    }

    setIsCreatingAppointment(true)
    try {
      // Mock patient ID - in real app this would come from authentication
      const mockPatientID = user?.sub as string;
      const appointmentRequest: CreateAppointmentRequest = {
        patientId: mockPatientID,
        doctorName: selectedDoctor.name,
        patientName: user?.name,
        doctorId: selectedDoctor.id,
        type: appointmentType,
        reason: reason.trim(),
        startTime: formatTimeForAPI(selectedDate, startTime),
        endTime: formatTimeForAPI(selectedDate, endTime),
      }

      const createdAppointment = await AppointmentService.createAppointment(appointmentRequest)

      toast.success(
        `Appointment created successfully!\n` +
          `Status: ${createdAppointment.status}\n` +
          `Type: ${createdAppointment.type}\n` +
          `Date: ${formatDate(selectedDate)}\n` +
          `Time: ${startTime} - ${endTime}\n` +
          `Reason: ${createdAppointment.reason}`,
      )

      // Reset form
      setAppointmentType("")
      setReason("")
      setStartTime("")
      setEndTime("")
      setDoctorSchedule(null)
      setAvailableTimeFrames(null)
      onConfirmAppointment()
    } catch (error) {
      console.error("Error creating appointment:", error)

      let errorMessage = "Failed to create appointment. Please try again."
      if (error instanceof Error) {
        if (error.message.includes("not available")) {
          errorMessage = "The selected time slot is no longer available. Please choose a different time."
        } else if (error.message.includes("conflict")) {
          errorMessage = "There is a scheduling conflict. Please select a different time slot."
        } else {
          errorMessage = `Failed to create appointment: ${error.message}`
        }
      }
      toast.error(errorMessage)

      // Refresh schedule data to get latest availability
      if (selectedDoctor && selectedDate) {
        const dateString = selectedDate.toLocaleDateString("en-CA")
        try {
          const [workSchedules, availableData] = await Promise.all([
            ScheduleService.fetchDoctorSchedules("fde7f72c-3156-4a00-95ae-873600eb2798"),
            ScheduleService.getDoctorAvailableSchedule("fde7f72c-3156-4a00-95ae-873600eb2798", dateString),
          ])

          const daySchedule = workSchedules.find((schedule) => schedule.date === dateString)
          if (daySchedule) {
            setDoctorSchedule(daySchedule)
          }
          setAvailableTimeFrames(availableData)
        } catch (refreshError) {
          console.error("Error refreshing schedule:", refreshError)
        }
      }
    } finally {
      setIsCreatingAppointment(false)
    }
  }

  const isFormValid = startTime && endTime && appointmentType && reason.trim() && selectedDate && doctorSchedule

  return (
    <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl">Book Appointment with {selectedDoctor?.name}</DialogTitle>
        <p className="text-sm text-gray-600">{selectedDoctor?.specialty}</p>
      </DialogHeader>

      <div className="py-2 space-y-6">
        {/* Date Selection */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Select Date *</Label>
          <div className="flex justify-center border rounded-md py-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
              disabled={(date) => date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))}
            />
          </div>
        </div>

        {/* Time Range Selection */}
        {selectedDate && (
          <div>
            <Label className="text-sm font-medium mb-3 block">Select Time Range *</Label>
            {isLoadingSchedule && (
              <div className="flex items-center justify-center py-8 border rounded-md bg-gray-50">
                <Loader2 className="h-6 w-6 animate-spin text-teal-600 mr-2" />
                <span className="text-gray-600">Loading doctor's schedule and availability...</span>
              </div>
            )}

            {scheduleError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{scheduleError}</AlertDescription>
              </Alert>
            )}

            {!isLoadingSchedule && !scheduleError && doctorSchedule && (
              <TimeRangePicker
                selectedDoctor={selectedDoctor}
                selectedDate={selectedDate}
                startTime={startTime}
                endTime={endTime}
                onStartTimeChange={setStartTime}
                onEndTimeChange={setEndTime}
                doctorSchedule={doctorSchedule}
                availableTimeFrames={availableTimeFrames}
              />
            )}
          </div>
        )}

        {/* Appointment Type Selection */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Appointment Type *</Label>
          <Select
            value={appointmentType}
            onValueChange={(value: CreateAppointmentRequest["type"]) => setAppointmentType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select appointment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CONSULTATION">Consultation</SelectItem>
              <SelectItem value="CHECKUP">Regular Checkup</SelectItem>
              <SelectItem value="FOLLOW_UP">Follow-up Visit</SelectItem>
              <SelectItem value="EMERGENCY">Emergency Consultation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reason Input */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Reason for Visit *</Label>
          <Textarea
            placeholder="Please describe the reason for your appointment..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        {/* Confirm Button */}
        <Button
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700"
          disabled={!isFormValid || isLoadingSchedule || isCreatingAppointment}
          onClick={handleConfirmAppointment}
        >
          {isCreatingAppointment ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Creating Appointment...
            </>
          ) : isLoadingSchedule ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading...
            </>
          ) : (
            "Confirm Appointment"
          )}
        </Button>
      </div>
    </DialogContent>
  )
}

export default AppointmentDialog
