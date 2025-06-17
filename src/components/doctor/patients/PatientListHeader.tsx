"use client"

import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

interface PatientListHeaderProps {
  patientCount?: number
}

export function PatientListHeader({ patientCount = 0 }: PatientListHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
        <p className="text-gray-600">
          View and manage your patients' medical records
          {patientCount > 0 && (
            <span className="ml-2">
              • {patientCount} total patients
            </span>
          )}
        </p>
      </div>
      <div className="mt-4 md:mt-0">
        <Button className="bg-teal-600 hover:bg-teal-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>
    </div>
  )
}
