"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle, CheckCircle, Calendar, Briefcase, X } from "lucide-react"
import type { Doctor } from "@/types/doctor"
import type { DoctorScheduleResponse, AvailableScheduleResponse, TimeFrame } from "@/types/schedule"
import { formatDuration } from "@/lib/DateTimeUtils"

interface TimeRangePickerProps {
  selectedDoctor: Doctor | null
  selectedDate: Date | undefined
  startTime: string
  endTime: string
  onStartTimeChange: (time: string) => void
  onEndTimeChange: (time: string) => void
  doctorSchedule?: DoctorScheduleResponse
  availableTimeFrames?: AvailableScheduleResponse | null
}

// Generate time options from available timeframes
const generateAvailableTimeOptions = (availableTimeFrames: TimeFrame[]) => {
  const times: { value: string; display: string; isAvailable: boolean }[] = []

  // Create a set to avoid duplicates
  const timeSet = new Set<string>()

  availableTimeFrames.forEach((timeFrame) => {
    const frameStart = new Date(timeFrame.startTime)
    const frameEnd = new Date(timeFrame.endTime)

    // Convert to minutes from start of day
    const frameStartMinutes = frameStart.getHours() * 60 + frameStart.getMinutes()
    const frameEndMinutes = frameEnd.getHours() * 60 + frameEnd.getMinutes()

    // Generate 15-minute intervals for this available timeframe
    for (let totalMinutes = frameStartMinutes; totalMinutes <= frameEndMinutes; totalMinutes += 15) {
      const hour = Math.floor(totalMinutes / 60)
      const minute = totalMinutes % 60
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

      // Add to set to avoid duplicates
      timeSet.add(timeString)
    }
  })

  // Convert set to array and sort
  Array.from(timeSet).forEach((timeString) => {
    times.push({
      value: timeString,
      display: timeString,
      isAvailable: true,
    })
  })

  return times.sort((a, b) => a.value.localeCompare(b.value))
}

const calculateDuration = (startTime: string, endTime: string): number => {
  const [startHours, startMinutes] = startTime.split(":").map(Number)
  const [endHours, endMinutes] = endTime.split(":").map(Number)
  const startTotalMinutes = startHours * 60 + startMinutes
  const endTotalMinutes = endHours * 60 + endMinutes
  return endTotalMinutes - startTotalMinutes
}

const timeToMinutes = (time: string): number => {
  if (time.includes("T")) {
    const date = new Date(time)
    return date.getHours() * 60 + date.getMinutes()
  } else {
    const [hourStr, minuteStr] = time.split(":")
    return Number.parseInt(hourStr) * 60 + Number.parseInt(minuteStr)
  }
}

const isTimeAvailable = (time: string, availableTimeFrames: TimeFrame[]): boolean => {
  const [h, m] = time.split(":").map(Number)
  const timeInMinutes = h * 60 + m

  // Check if time is within any available timeframe
  return availableTimeFrames.some((timeFrame) => {
    const startMinutes = timeToMinutes(timeFrame.startTime)
    const endMinutes = timeToMinutes(timeFrame.endTime)
    return timeInMinutes >= startMinutes && timeInMinutes < endMinutes
  })
}

// Calculate booked timeframes by comparing work shifts with available timeframes
const calculateBookedTimeFrames = (workShifts: TimeFrame[], availableTimeFrames: TimeFrame[]): TimeFrame[] => {
  const bookedSlots: TimeFrame[] = []

  workShifts.forEach((shift) => {
    const shiftStart = timeToMinutes(shift.startTime)
    const shiftEnd = timeToMinutes(shift.endTime)

    // Find gaps in available timeframes within this work shift
    let currentTime = shiftStart

    availableTimeFrames.forEach((available) => {
      const availableStart = timeToMinutes(available.startTime)
      const availableEnd = timeToMinutes(available.endTime)

      // If there's a gap before this available slot within the work shift
      if (currentTime < availableStart && availableStart <= shiftEnd) {
        const gapStartHour = Math.floor(currentTime / 60)
        const gapStartMinute = currentTime % 60
        const gapEndHour = Math.floor(availableStart / 60)
        const gapEndMinute = availableStart % 60

        bookedSlots.push({
          startTime: `${gapStartHour.toString().padStart(2, "0")}:${gapStartMinute.toString().padStart(2, "0")}`,
          endTime: `${gapEndHour.toString().padStart(2, "0")}:${gapEndMinute.toString().padStart(2, "0")}`,
        })
      }

      currentTime = Math.max(currentTime, availableEnd)
    })

    // If there's remaining time at the end of the shift
    if (currentTime < shiftEnd) {
      const remainingStartHour = Math.floor(currentTime / 60)
      const remainingStartMinute = currentTime % 60
      const shiftEndHour = Math.floor(shiftEnd / 60)
      const shiftEndMinute = shiftEnd % 60

      bookedSlots.push({
        startTime: `${remainingStartHour.toString().padStart(2, "0")}:${remainingStartMinute.toString().padStart(2, "0")}`,
        endTime: `${shiftEndHour.toString().padStart(2, "0")}:${shiftEndMinute.toString().padStart(2, "0")}`,
      })
    }
  })

  return bookedSlots
}

const TimeRangePicker = ({
  selectedDoctor,
  selectedDate,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  doctorSchedule,
  availableTimeFrames,
}: TimeRangePickerProps) => {
  const [timeOptions, setTimeOptions] = useState<{ value: string; display: string; isAvailable: boolean }[]>([])
  const [conflicts, setConflicts] = useState<string[]>([])
  const [isValidRange, setIsValidRange] = useState(false)
  const [bookedTimeFrames, setBookedTimeFrames] = useState<TimeFrame[]>([])

  useEffect(() => {
    if (availableTimeFrames?.timeFrames && availableTimeFrames.timeFrames.length > 0) {
      const options = generateAvailableTimeOptions(availableTimeFrames.timeFrames)
      setTimeOptions(options)

      // Calculate booked timeframes
      if (doctorSchedule?.workShifts) {
        const booked = calculateBookedTimeFrames(doctorSchedule.workShifts, availableTimeFrames.timeFrames)
        setBookedTimeFrames(booked)
      }
    } else {
      setTimeOptions([])
      setBookedTimeFrames([])
    }
  }, [doctorSchedule, availableTimeFrames])

  useEffect(() => {
    if (startTime && endTime && doctorSchedule && availableTimeFrames) {
      checkTimeRangeAvailability()
    } else {
      setConflicts([])
      setIsValidRange(false)
    }
  }, [startTime, endTime, doctorSchedule, availableTimeFrames])

  const checkTimeRangeAvailability = () => {
    if (!startTime || !endTime || !doctorSchedule || !availableTimeFrames) return

    const newConflicts: string[] = []
    const duration = calculateDuration(startTime, endTime)

    // Check if end time is after start time
    if (duration <= 0) {
      newConflicts.push("End time must be after start time")
    }

    // Check minimum duration (15 minutes)
    if (duration > 0 && duration < 15) {
      newConflicts.push("Minimum appointment duration is 15 minutes")
    }

    // Check maximum duration (4 hours)
    if (duration > 240) {
      newConflicts.push("Maximum appointment duration is 4 hours")
    }

    // Check if both start and end times are available
    const availableTimeFramesArray = availableTimeFrames?.timeFrames || []
    if (!isTimeAvailable(startTime, availableTimeFramesArray)) {
      newConflicts.push("Start time is not available (already booked or outside work hours)")
    }

    if (!isTimeAvailable(endTime, availableTimeFramesArray)) {
      newConflicts.push("End time is not available (already booked or outside work hours)")
    }

    // Check if the entire appointment duration is within available timeframes
    if (duration > 0 && availableTimeFrames?.timeFrames) {
      const [startHours, startMinutes] = startTime.split(":").map(Number)
      const [endHours, endMinutes] = endTime.split(":").map(Number)
      const startTotalMinutes = startHours * 60 + startMinutes
      const endTotalMinutes = endHours * 60 + endMinutes

      const isEntireRangeAvailable = availableTimeFrames.timeFrames.some((timeFrame) => {
        const frameStart = timeToMinutes(timeFrame.startTime)
        const frameEnd = timeToMinutes(timeFrame.endTime)
        return startTotalMinutes >= frameStart && endTotalMinutes <= frameEnd
      })

      if (!isEntireRangeAvailable) {
        newConflicts.push("Selected time range spans across unavailable periods")
      }
    }

    setConflicts(newConflicts)
    setIsValidRange(newConflicts.length === 0 && duration > 0)
  }

  useEffect(() => {
    if (startTime) {
      const endOptions = timeOptions.filter((option) => {
        if (!option.isAvailable) return false

        const endMinutes = timeToMinutes(option.value)

        // End time must be after start time (at least 15 minutes later)
        if (endMinutes <= timeToMinutes(startTime)) return false

        // Check if there's a continuous available timeframe from start to end
        if (!availableTimeFrames?.timeFrames) return false

        // Find if there's an available timeframe that contains both start and end times
        return availableTimeFrames.timeFrames.some((timeFrame) => {
          const frameStartMinutes = timeToMinutes(timeFrame.startTime)
          const frameEndMinutes = timeToMinutes(timeFrame.endTime)
          return timeToMinutes(startTime) >= frameStartMinutes && endMinutes <= frameEndMinutes
        })
      })
      console.log("Start time:", startTime)
      console.log("Available end time options:", endOptions.length)
      console.log(
        "End options:",
        endOptions.map((opt) => opt.value),
      )
      console.log("Available timeframes:", availableTimeFrames?.timeFrames)
    }
  }, [startTime, timeOptions, availableTimeFrames])

  // Additional debug effect
  useEffect(() => {
    console.log("=== DEBUG INFO ===")
    console.log("timeOptions:", timeOptions)
    console.log("availableTimeFrames:", availableTimeFrames)
    console.log("startTime:", startTime)
    if (startTime) {
      const endOptions = timeOptions.filter((option) => {
        if (!option.isAvailable) return false

        const endMinutes = timeToMinutes(option.value)

        // End time must be after start time (at least 15 minutes later)
        if (endMinutes <= timeToMinutes(startTime)) return false

        // Check if there's a continuous available timeframe from start to end
        if (!availableTimeFrames?.timeFrames) return false

        // Find if there's an available timeframe that contains both start and end times
        return availableTimeFrames.timeFrames.some((timeFrame) => {
          const frameStartMinutes = timeToMinutes(timeFrame.startTime)
          const frameEndMinutes = timeToMinutes(timeFrame.endTime)
          return timeToMinutes(startTime) >= frameStartMinutes && endMinutes <= frameEndMinutes
        })
      })
      console.log("getEndTimeOptions result:", endOptions)
    }
    console.log("==================")
  }, [startTime, timeOptions, availableTimeFrames])

  const getStatusIcon = () => {
    if (!selectedDoctor || !selectedDate) return <Clock className="w-4 h-4 text-gray-400" />
    if (!doctorSchedule?.workShifts?.length) return <Calendar className="w-4 h-4 text-gray-400" />
    if (!startTime || !endTime) return <Clock className="w-4 h-4 text-gray-400" />
    if (!isValidRange) return <AlertTriangle className="w-4 h-4 text-red-500" />
    return <CheckCircle className="w-4 h-4 text-green-500" />
  }

  const getStatusColor = () => {
    if (!doctorSchedule?.workShifts?.length) return "bg-gray-100 text-gray-600"
    if (!startTime || !endTime) return "bg-gray-100 text-gray-600"
    if (!isValidRange) return "bg-red-100 text-red-700"
    return "bg-green-100 text-green-700"
  }

  const duration = startTime && endTime ? calculateDuration(startTime, endTime) : 0

  // Show no availability message
  if (selectedDoctor && selectedDate && !doctorSchedule?.workShifts?.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Doctor Not Working</h3>
          <p className="text-gray-600">
            {selectedDoctor.name} is not scheduled to work on {selectedDate.toLocaleDateString()}. Please select a
            different date.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Show no available slots message
  if (
    selectedDoctor &&
    selectedDate &&
    doctorSchedule?.workShifts?.length &&
    (!availableTimeFrames?.timeFrames || availableTimeFrames.timeFrames.length === 0)
  ) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Slots</h3>
          <p className="text-gray-600">
            All appointment slots are booked for {selectedDate.toLocaleDateString()}. Please select a different date.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Schedule Overview */}
      {doctorSchedule && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Work Shifts */}
              {doctorSchedule.workShifts && doctorSchedule.workShifts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-700">Working Hours:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {doctorSchedule.workShifts.map((shift, index) => {
                      const startDate = new Date(shift.startTime)
                      const endDate = new Date(shift.endTime)
                      const startTimeStr = `${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")}`
                      const endTimeStr = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`

                      return (
                        <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                          {startTimeStr} - {endTimeStr}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Booked Slots */}
              {bookedTimeFrames && bookedTimeFrames.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <X className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-700">Already Booked:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bookedTimeFrames.map((slot, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-red-200 text-red-700 bg-red-50">
                        {slot.startTime} - {slot.endTime}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Time Slots */}
              {availableTimeFrames?.timeFrames && availableTimeFrames.timeFrames.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-700">Available Time Slots:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableTimeFrames.timeFrames.map((slot, index) => {
                      const startDate = new Date(slot.startTime)
                      const endDate = new Date(slot.endTime)
                      const startTimeStr = `${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")}`
                      const endTimeStr = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`

                      return (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs border-green-200 text-green-700 bg-green-50"
                        >
                          {startTimeStr} - {endTimeStr}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}        
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Time */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Start Time *</Label>
          <Select
            value={startTime}
            onValueChange={onStartTimeChange}
            disabled={!doctorSchedule?.workShifts?.length || timeOptions.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {timeOptions
                .filter((option) => {
                  if (!option.isAvailable) return false

                  const optionMinutes = timeToMinutes(option.value)

                  // Don't suggest times that are exactly at the end of booked timeframes
                  const isEndOfBookedSlot = bookedTimeFrames.some((bookedSlot) => {
                    const bookedEndMinutes = timeToMinutes(bookedSlot.endTime)
                    return optionMinutes === bookedEndMinutes
                  })

                  if (isEndOfBookedSlot) return false

                  // Don't suggest times that fall within booked timeframes
                  const isWithinBookedSlot = bookedTimeFrames.some((bookedSlot) => {
                    const bookedStartMinutes = timeToMinutes(bookedSlot.startTime)
                    const bookedEndMinutes = timeToMinutes(bookedSlot.endTime)
                    return optionMinutes > bookedStartMinutes && optionMinutes < bookedEndMinutes
                  })

                  return !isWithinBookedSlot
                })
                .map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.display}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* End Time */}
        <div>
          <Label className="text-sm font-medium mb-2 block">End Time *</Label>
          <Select
            value={endTime}
            onValueChange={onEndTimeChange}
            disabled={!startTime || !doctorSchedule?.workShifts?.length}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select end time" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {(() => {
                if (!startTime) return []

                const startMinutes = timeToMinutes(startTime)

                // Check if start time is within any booked timeframe
                const isStartTimeInBookedSlot = bookedTimeFrames.some((bookedSlot) => {
                  const bookedStartMinutes = timeToMinutes(bookedSlot.startTime)
                  const bookedEndMinutes = timeToMinutes(bookedSlot.endTime)
                  return startMinutes >= bookedStartMinutes && startMinutes < bookedEndMinutes
                })

                // If start time is in a booked slot, don't show any end time options
                if (isStartTimeInBookedSlot) {
                  return []
                }

                return timeOptions.filter((option) => {
                  if (!option.isAvailable) return false

                  const endMinutes = timeToMinutes(option.value)

                  // End time must be after start time (at least 15 minutes later)
                  if (endMinutes <= startMinutes) return false

                  // Check if there's a continuous available timeframe from start to end
                  if (!availableTimeFrames?.timeFrames) return false

                  // Find if there's an available timeframe that contains both start and end times
                  return availableTimeFrames.timeFrames.some((timeFrame) => {
                    const frameStartMinutes = timeToMinutes(timeFrame.startTime)
                    const frameEndMinutes = timeToMinutes(timeFrame.endTime)
                    return startMinutes >= frameStartMinutes && endMinutes <= frameEndMinutes
                  })
                })
              })().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.display}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {startTime &&
        (() => {
          const startMinutes = timeToMinutes(startTime)
          const isStartTimeInBookedSlot = bookedTimeFrames.some((bookedSlot) => {
            const bookedStartMinutes = timeToMinutes(bookedSlot.startTime)
            const bookedEndMinutes = timeToMinutes(bookedSlot.endTime)
            return startMinutes >= bookedStartMinutes && startMinutes < bookedEndMinutes
          })

          if (isStartTimeInBookedSlot) {
            return (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Selected start time falls within a booked slot. Please choose a different start time.</span>
                </div>
              </div>
            )
          }
          return null
        })()}

      {/* Duration and Status Display */}
      {startTime && endTime && doctorSchedule?.workShifts?.length && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="font-medium">
                  {startTime} - {endTime}
                </span>
              </div>
              <Badge variant="outline" className={getStatusColor()}>
                {duration > 0 ? formatDuration(duration) : "Invalid range"}
              </Badge>
            </div>

            {/* Status Messages */}
            <div className="mt-3 space-y-2">
              {isValidRange && conflicts.length === 0 && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Time slot is available for booking</span>
                </div>
              )}

              {conflicts.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Scheduling conflicts:</span>
                  </div>
                  <ul className="text-xs text-red-600 ml-6 space-y-1">
                    {conflicts.map((conflict, index) => (
                      <li key={index}>• {conflict}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Duration Buttons */}
      {startTime && doctorSchedule?.workShifts?.length && (
        <div>
          <Label className="text-sm font-medium mb-2 block">Quick Duration</Label>
          <div className="flex flex-wrap gap-2">
            {[15, 30, 45, 60, 90, 120].map((minutes) => {
              const startMinutes = timeToMinutes(startTime)
              const newEndMinutes = startMinutes + minutes
              const newEndHour = Math.floor(newEndMinutes / 60)
              const newEndMinute = newEndMinutes % 60
              const newEndTime = `${newEndHour.toString().padStart(2, "0")}:${newEndMinute.toString().padStart(2, "0")}`

              // Check if the new end time is available
              const isValidEndTime = isTimeAvailable(newEndTime, availableTimeFrames?.timeFrames || [])

              if (!isValidEndTime) return null

              return (
                <Button
                  key={minutes}
                  variant="outline"
                  size="sm"
                  onClick={() => onEndTimeChange(newEndTime)}
                  className="text-xs bg-transparent"
                >
                  +{formatDuration(minutes)}
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Time Availability Timeline */}
      {selectedDate && selectedDoctor && doctorSchedule && (
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-medium mb-3 block">Daily Schedule Overview</Label>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>8:00 AM</span>
                <span>12:00 PM</span>
                <span>6:00 PM</span>
              </div>
              <div className="relative h-8 bg-gray-200 rounded">
                {/* Work shifts background */}
                {doctorSchedule.workShifts?.map((shift, index) => {
                  const startMinutes = timeToMinutes(shift.startTime)
                  const endMinutes = timeToMinutes(shift.endTime)
                  const dayStartMinutes = 8 * 60 // 8:00 AM
                  const dayEndMinutes = 18 * 60 // 6:00 PM
                  const dayDuration = dayEndMinutes - dayStartMinutes

                  // Ensure the shift times are within the display range
                  const clampedStartMinutes = Math.max(startMinutes, dayStartMinutes)
                  const clampedEndMinutes = Math.min(endMinutes, dayEndMinutes)

                  const leftPercentage = ((clampedStartMinutes - dayStartMinutes) / dayDuration) * 100
                  const widthPercentage = ((clampedEndMinutes - clampedStartMinutes) / dayDuration) * 100

                  return (
                    <div
                      key={`work-${index}`}
                      className="absolute h-full bg-blue-100 rounded"
                      style={{
                        left: `${Math.max(0, leftPercentage)}%`,
                        width: `${Math.max(0, widthPercentage)}%`,
                      }}
                    />
                  )
                })}

                {/* Booked time slots */}
                {bookedTimeFrames?.map((slot, index) => {
                  const startMinutes = timeToMinutes(slot.startTime)
                  const endMinutes = timeToMinutes(slot.endTime)
                  const dayStartMinutes = 8 * 60 // 8:00 AM
                  const dayEndMinutes = 18 * 60 // 6:00 PM
                  const dayDuration = dayEndMinutes - dayStartMinutes

                  // Ensure the slot times are within the display range
                  const clampedStartMinutes = Math.max(startMinutes, dayStartMinutes)
                  const clampedEndMinutes = Math.min(endMinutes, dayEndMinutes)

                  const leftPercentage = ((clampedStartMinutes - dayStartMinutes) / dayDuration) * 100
                  const widthPercentage = ((clampedEndMinutes - clampedStartMinutes) / dayDuration) * 100

                  return (
                    <div
                      key={`booked-${index}`}
                      className="absolute h-full bg-red-400 rounded"
                      style={{
                        left: `${Math.max(0, leftPercentage)}%`,
                        width: `${Math.max(0, widthPercentage)}%`,
                      }}
                    />
                  )
                })}

                {/* Selected time range */}
                {startTime && endTime && duration > 0 && (
                  <div
                    className={`absolute h-full rounded ${isValidRange ? "bg-teal-500" : "bg-red-500"}`}
                    style={{
                      left: `${Math.max(0, ((timeToMinutes(startTime) - 8 * 60) / (10 * 60)) * 100)}%`,
                      width: `${Math.min(100, Math.max(0, (duration / (10 * 60)) * 100))}%`,
                    }}
                  />
                )}
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-200 rounded" />
                  <span>Not working</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-100 rounded" />
                  <span>Work shift</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-400 rounded" />
                  <span>Booked</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-teal-500 rounded" />
                  <span>Your selection</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default TimeRangePicker
