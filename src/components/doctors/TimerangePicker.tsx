"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle, CheckCircle, Calendar } from "lucide-react"
import { getTimeRangeConflicts, getBookedTimeRanges, getDoctorWorkingHours, isDoctorWorking } from "@/data/schedule"
import type { Doctor } from "@/types/doctor"

interface TimeRangePickerProps {
    selectedDoctor: Doctor | null
    selectedDate: Date | undefined
    startTime: string
    endTime: string
    onStartTimeChange: (time: string) => void
    onEndTimeChange: (time: string) => void
}

// Generate time options in 15-minute intervals
const generateTimeOptions = (workingStart?: string, workingEnd?: string) => {
    const times = []
    const startHour = workingStart ? Number.parseInt(workingStart.split(":")[0]) : 8
    const endHour = workingEnd ? Number.parseInt(workingEnd.split(":")[0]) : 17

    for (let hour = startHour; hour <= endHour; hour++) {
        const maxMinute = hour === endHour ? 0 : 60
        for (let minute = 0; minute < maxMinute; minute += 15) {
            const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
            const displayTime = formatTimeDisplay(timeString)
            times.push({ value: timeString, display: displayTime })
        }
    }
    return times
}

const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
    return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`
}

const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHours, startMinutes] = startTime.split(":").map(Number)
    const [endHours, endMinutes] = endTime.split(":").map(Number)

    const startTotalMinutes = startHours * 60 + startMinutes
    const endTotalMinutes = endHours * 60 + endMinutes

    return endTotalMinutes - startTotalMinutes
}

const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) return `${mins} minutes`
    if (mins === 0) return `${hours} hour${hours > 1 ? "s" : ""}`
    return `${hours} hour${hours > 1 ? "s" : ""} ${mins} minutes`
}

const TimeRangePicker = ({
    selectedDoctor,
    selectedDate,
    startTime,
    endTime,
    onStartTimeChange,
    onEndTimeChange,
}: TimeRangePickerProps) => {
    const [timeOptions, setTimeOptions] = useState(generateTimeOptions())
    const [conflicts, setConflicts] = useState<string[]>([])
    const [isValidRange, setIsValidRange] = useState(false)
    const [bookedRanges, setBookedRanges] = useState<Array<{ start: number; end: number }>>([])
    const [workingHours, setWorkingHours] = useState<{ startTime: string; endTime: string } | null>(null)
    const [isDoctorAvailable, setIsDoctorAvailable] = useState(false)

    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            // Check if doctor is working on selected date
            const isWorking = isDoctorWorking(selectedDoctor.userId, selectedDate)
            setIsDoctorAvailable(!!isWorking)

            if (isWorking) {
                // Get doctor's working hours
                const hours = getDoctorWorkingHours(selectedDoctor.userId, selectedDate)
                setWorkingHours(hours)

                // Generate time options based on working hours
                if (hours) {
                    setTimeOptions(generateTimeOptions(hours.startTime, hours.endTime))
                }

                // Get booked time ranges for timeline visualization
                const booked = getBookedTimeRanges(selectedDoctor.userId, selectedDate)
                setBookedRanges(booked)
            } else {
                setWorkingHours(null)
                setBookedRanges([])
                setTimeOptions([])
            }
        }

        if (startTime && endTime && selectedDoctor && selectedDate) {
            checkTimeRangeAvailability()
        }
    }, [startTime, endTime, selectedDoctor, selectedDate])

    const checkTimeRangeAvailability = () => {
        if (!selectedDoctor || !selectedDate || !startTime || !endTime) return

        const duration = calculateDuration(startTime, endTime)

        // Check if end time is after start time
        if (duration <= 0) {
            setIsValidRange(false)
            setConflicts(["End time must be after start time"])
            return
        }

        // Check minimum duration (15 minutes)
        if (duration < 15) {
            setIsValidRange(false)
            setConflicts(["Minimum appointment duration is 15 minutes"])
            return
        }

        // Check maximum duration (4 hours)
        if (duration > 240) {
            setIsValidRange(false)
            setConflicts(["Maximum appointment duration is 4 hours"])
            return
        }

        // Check for conflicts (working hours + existing appointments)
        const timeConflicts = getTimeRangeConflicts(selectedDoctor.userId, selectedDate, startTime, endTime)

        if (timeConflicts.length > 0) {
            setConflicts(timeConflicts)
            setIsValidRange(false)
        } else {
            setConflicts([])
            setIsValidRange(true)
        }
    }

    const getEndTimeOptions = () => {
        if (!startTime) return timeOptions

        const startIndex = timeOptions.findIndex((option) => option.value === startTime)
        if (startIndex === -1) return timeOptions

        // Return options that are after the start time
        return timeOptions.slice(startIndex + 1)
    }

    const getStatusIcon = () => {
        if (!selectedDoctor || !selectedDate) return <Clock className="w-4 h-4 text-gray-400" />
        if (!isDoctorAvailable) return <Calendar className="w-4 h-4 text-gray-400" />
        if (!startTime || !endTime) return <Clock className="w-4 h-4 text-gray-400" />
        if (!isValidRange) return <AlertTriangle className="w-4 h-4 text-red-500" />
        return <CheckCircle className="w-4 h-4 text-green-500" />
    }

    const getStatusColor = () => {
        if (!isDoctorAvailable) return "bg-gray-100 text-gray-600"
        if (!startTime || !endTime) return "bg-gray-100 text-gray-600"
        if (!isValidRange) return "bg-red-100 text-red-700"
        return "bg-green-100 text-green-700"
    }

    const duration = startTime && endTime ? calculateDuration(startTime, endTime) : 0

    // Convert time to minutes for timeline calculation
    const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number)
        return hours * 60 + minutes
    }

    // Show doctor not available message
    if (selectedDoctor && selectedDate && !isDoctorAvailable) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Doctor Not Available</h3>
                    <p className="text-gray-600">
                        {selectedDoctor.name} is not working on {selectedDate.toLocaleDateString()}. Please select a different date.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {/* Doctor Working Hours Info */}
            {workingHours && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-teal-600" />
                            <span className="font-medium">Working Hours:</span>
                            <span>
                                {formatTimeDisplay(workingHours.startTime)} - {formatTimeDisplay(workingHours.endTime)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Time */}
                <div>
                    <Label className="text-sm font-medium mb-2 block">Start Time *</Label>
                    <Select value={startTime} onValueChange={onStartTimeChange} disabled={!isDoctorAvailable}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select start time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                            {timeOptions.map((option) => (
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
                    <Select value={endTime} onValueChange={onEndTimeChange} disabled={!startTime || !isDoctorAvailable}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select end time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                            {getEndTimeOptions().map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.display}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>


            {/* Duration and Status Display */}
            {startTime && endTime && isDoctorAvailable && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {getStatusIcon()}
                                <span className="font-medium">
                                    {formatTimeDisplay(startTime)} - {formatTimeDisplay(endTime)}
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
                                    <span>Time slot is available</span>
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
            {startTime && isDoctorAvailable && workingHours && (
                <div>
                    <Label className="text-sm font-medium mb-2 block">Quick Duration</Label>
                    <div className="flex flex-wrap gap-2">
                        {[15, 30, 45, 60, 90, 120].map((minutes) => {
                            const startMinutes = timeToMinutes(startTime)
                            const newEndMinutes = startMinutes + minutes
                            const workingEndMinutes = timeToMinutes(workingHours.endTime)

                            // Check if the new end time is within working hours
                            if (newEndMinutes > workingEndMinutes) return null

                            const newEndHour = Math.floor(newEndMinutes / 60)
                            const newEndMinute = newEndMinutes % 60
                            const newEndTime = `${newEndHour.toString().padStart(2, "0")}:${newEndMinute.toString().padStart(2, "0")}`

                            return (
                                <Button
                                    key={minutes}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEndTimeChange(newEndTime)}
                                    className="text-xs"
                                >
                                    +{formatDuration(minutes)}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Enhanced Time Availability Timeline */}
            {selectedDate && selectedDoctor && isDoctorAvailable && workingHours && (
                <Card>
                    <CardContent className="p-4">
                        <Label className="text-sm font-medium mb-3 block">Daily Schedule Overview</Label>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{formatTimeDisplay(workingHours.startTime)}</span>
                                <span>12:00 PM</span>
                                <span>{formatTimeDisplay(workingHours.endTime)}</span>
                            </div>
                            <div className="relative h-8 bg-gray-200 rounded">
                                {/* Working hours background */}
                                <div
                                    className="absolute h-full bg-blue-100 rounded"
                                    style={{
                                        left: `${((timeToMinutes(workingHours.startTime) - timeToMinutes(workingHours.startTime)) / (timeToMinutes(workingHours.endTime) - timeToMinutes(workingHours.startTime))) * 100}%`,
                                        width: `${((timeToMinutes(workingHours.endTime) - timeToMinutes(workingHours.startTime)) / (timeToMinutes(workingHours.endTime) - timeToMinutes(workingHours.startTime))) * 100}%`,
                                    }}
                                ></div>

                                {/* Booked time ranges from existing appointments */}
                                {bookedRanges.map((range, index) => (
                                    <div
                                        key={index}
                                        className="absolute h-full bg-gray-400 opacity-80"
                                        style={{
                                            left: `${((range.start - timeToMinutes(workingHours.startTime)) / (timeToMinutes(workingHours.endTime) - timeToMinutes(workingHours.startTime))) * 100}%`,
                                            width: `${((range.end - range.start) / (timeToMinutes(workingHours.endTime) - timeToMinutes(workingHours.startTime))) * 100}%`,
                                        }}
                                    ></div>
                                ))}

                                {/* Selected time range */}
                                {startTime && endTime && duration > 0 && (
                                    <div
                                        className={`absolute h-full rounded ${isValidRange ? "bg-teal-500" : "bg-red-500"}`}
                                        style={{
                                            left: `${((timeToMinutes(startTime) - timeToMinutes(workingHours.startTime)) / (timeToMinutes(workingHours.endTime) - timeToMinutes(workingHours.startTime))) * 100}%`,
                                            width: `${(duration / (timeToMinutes(workingHours.endTime) - timeToMinutes(workingHours.startTime))) * 100}%`,
                                        }}
                                    ></div>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                                    <span>Not working</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-blue-100 rounded"></div>
                                    <span>Available</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-gray-400 rounded"></div>
                                    <span>Booked</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-teal-500 rounded"></div>
                                    <span>Your selection (Available)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                                    <span>Your selection (Conflict)</span>
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
