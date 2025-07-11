"use client"

import { useState } from "react"
import PrescriptionCard from "./PrescriptionCard"
import { PrescriptionDetailsDialog } from "./PrescriptionDetailsDialog"
import type { Prescription } from "@/types/prescription"
import { Loader2 } from "lucide-react"

interface PrescriptionListProps {
  prescriptions: Prescription[]
  isLoading?: boolean
}

export function PrescriptionList({ prescriptions, isLoading = false }: PrescriptionListProps) {
  const [prescriptionDetailsOpen, setPrescriptionDetailsOpen] = useState(false)
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null)

  const handleViewDetails = (prescriptionId: string) => {
    console.log("Opening prescription details for:", prescriptionId)
    setSelectedPrescriptionId(prescriptionId)
    setPrescriptionDetailsOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600 mr-2" />
        <span className="text-gray-500">Loading prescriptions...</span>
      </div>
    )
  }

  if (prescriptions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No prescriptions found.</div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {prescriptions.map((prescription) => (
          <PrescriptionCard key={prescription.id} prescription={prescription} onViewDetails={handleViewDetails} />
        ))}
      </div>

      <PrescriptionDetailsDialog
        open={prescriptionDetailsOpen}
        onOpenChange={setPrescriptionDetailsOpen}
        prescriptionId={selectedPrescriptionId}
      />
    </>
  )
}
