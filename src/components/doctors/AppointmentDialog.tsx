"use client"

import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import type { Doctor } from "@/types/doctor"
import type { CreateAppointmentRequest } from "@/types/appointment"
import { createAppointment } from "@/data/appointment"

// Time slots - morning and afternoon sessions
export const timeSlots = {
  morning: ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"],
  afternoon: ["1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"],
}

interface AppointmentDialogProps {
  selectedDoctor: Doctor | null
  selectedDate: Date | undefined
  selectedTimeSlot: string | null
  setSelectedDate: (date: Date | undefined) => void
  setSelectedTimeSlot: (timeSlot: string | null) => void
  onConfirmAppointment: () => void
}

const AppointmentDialog = ({
  selectedDoctor,
  selectedDate,
  selectedTimeSlot,
  setSelectedDate,
  setSelectedTimeSlot,
  onConfirmAppointment,
}: AppointmentDialogProps) => {
  const handleConfirmAppointment = () => {
    if (!selectedTimeSlot || !selectedDoctor || !selectedDate) return

    // Mock patient ID - in real app this would come from authentication
    const mockPatientID = "550e8400-e29b-41d4-a716-446655440999"

    const appointmentRequest: CreateAppointmentRequest = {
      patientID: mockPatientID,
      doctorID: selectedDoctor.id,
      appointmentDate: selectedDate,
      appointmentTime: selectedTimeSlot.replace(/\s(AM|PM)/, "").padStart(5, "0"), // Convert "9:00 AM" to "09:00"
    }

    try {
      const newAppointment = createAppointment(appointmentRequest)
      alert(
        `Appointment created successfully!\nAppointment ID: ${newAppointment.appointmentID}\nStatus: ${newAppointment.status}\nDate: ${selectedDate.toLocaleDateString()}\nTime: ${selectedTimeSlot}`,
      )
      onConfirmAppointment()
    } catch (error) {
      alert("Failed to create appointment. Please try again.")
    }
  }

  return (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Book Appointment with {selectedDoctor?.name}</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Select Date</h4>
          <div className="flex justify-center border rounded-md py-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date) => date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))}
            />
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Morning</h4>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.morning.map((time) => (
              <Button
                key={time}
                variant={selectedTimeSlot === time ? "default" : "outline"}
                className={selectedTimeSlot === time ? "bg-teal-600" : ""}
                onClick={() => setSelectedTimeSlot(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Afternoon</h4>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.afternoon.map((time) => (
              <Button
                key={time}
                variant={selectedTimeSlot === time ? "default" : "outline"}
                className={selectedTimeSlot === time ? "bg-teal-600" : ""}
                onClick={() => setSelectedTimeSlot(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>

        <Button
          className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
          disabled={!selectedTimeSlot}
          onClick={handleConfirmAppointment}
        >
          Confirm Appointment
        </Button>
      </div>
    </DialogContent>
  )
}

export default AppointmentDialog
