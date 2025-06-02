"use client"

import { Button } from "@/components/ui/button"
import { CalendarCheck } from "lucide-react"

interface AppointmentConfirmationHeaderProps {
  onConfirmAll?: () => void
}

export function AppointmentConfirmationHeader({ onConfirmAll }: AppointmentConfirmationHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Confirm Appointments</h1>
        <p className="text-gray-600">Review and manage appointment requests from patients</p>
      </div>
      <div className="mt-4 md:mt-0">
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={onConfirmAll}>
          <CalendarCheck className="mr-2 h-4 w-4" />
          Confirm All Pending
        </Button>
      </div>
    </div>
  )
}
