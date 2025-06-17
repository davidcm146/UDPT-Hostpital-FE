"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface AppointmentHeaderProps {
  pendingCount: number
  onConfirmAllPending: () => void
}

export function AppointmentHeader({ pendingCount, onConfirmAllPending }: AppointmentHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Confirm Appointments</h1>
        <p className="text-gray-600 mt-1">Review and manage appointment requests from patients</p>
      </div>
      <Button
        onClick={onConfirmAllPending}
        className="bg-teal-600 hover:bg-teal-700 text-white"
        disabled={pendingCount === 0}
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Confirm All Pending
      </Button>
    </div>
  )
}
