"use client"

import { useState } from "react"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Doctor } from "@/types/doctor"
import type { Appointment } from "@/types/appointment"
import TimeRangePicker from "./TimerangePicker"

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
  const [appointmentType, setAppointmentType] = useState<Appointment["type"] | "">("")
  const [reason, setReason] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const handleConfirmAppointment = () => {
    if (!startTime || !endTime || !selectedDoctor || !selectedDate || !appointmentType || !reason.trim()) {
      alert("Please fill in all required fields")
      return
    }

    // Mock patient ID - in real app this would come from authentication
    const mockPatientID = "550e8400-e29b-41d4-a716-446655440999"

    const appointmentRequest = {
      patientID: mockPatientID,
      doctorID: selectedDoctor.userId,
      type: appointmentType,
      appointmentDate: selectedDate,
      startTime: startTime,
      endTime: endTime,
      reason: reason.trim(),
    }

    try {
      // Mock appointment creation
      const newAppointment = {
        appointmentID: `apt-${Date.now()}`,
        ...appointmentRequest,
        status: "PENDING" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      alert(
        `Appointment created successfully!\nAppointment ID: ${newAppointment.appointmentID}\nStatus: ${newAppointment.status}\nType: ${appointmentType}\nDate: ${selectedDate.toLocaleDateString()}\nTime: ${startTime} - ${endTime}\nReason: ${reason}`,
      )

      // Reset form
      setAppointmentType("")
      setReason("")
      setStartTime("")
      setEndTime("")

      onConfirmAppointment()
    } catch (error) {
      alert("Failed to create appointment. Please try again.")
    }
  }

  const isFormValid = startTime && endTime && appointmentType && reason.trim() && selectedDate

  return (
    <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl">Book Appointment with {selectedDoctor?.name}</DialogTitle>
        <p className="text-sm text-gray-600">{selectedDoctor?.specialty}</p>
      </DialogHeader>

      <div className="py-4 space-y-6">
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
            <TimeRangePicker
              selectedDoctor={selectedDoctor}
              selectedDate={selectedDate}
              startTime={startTime}
              endTime={endTime}
              onStartTimeChange={setStartTime}
              onEndTimeChange={setEndTime}
            />
          </div>
        )}

        {/* Appointment Type Selection */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Appointment Type *</Label>
          <Select value={appointmentType} onValueChange={(value: Appointment["type"]) => setAppointmentType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select appointment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CHECKUP">Regular Checkup</SelectItem>
              <SelectItem value="FOLLOW-UP">Follow-up Visit</SelectItem>
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
          disabled={!isFormValid}
          onClick={handleConfirmAppointment}
        >
          Confirm Appointment
        </Button>
      </div>
    </DialogContent>
  )
}

export default AppointmentDialog
