"use client"

import { useState } from "react"
import PrescriptionCard from "./PrescriptionCard"
import { PrescriptionDetailsDialog } from "./PrescriptionDetailsDialog"
import type { Prescription } from "@/types/prescription"

interface PrescriptionCardWithDialogProps {
  prescription: Prescription
}

export function PrescriptionCardWithDialog({ prescription }: PrescriptionCardWithDialogProps) {
  const [prescriptionDetailsOpen, setPrescriptionDetailsOpen] = useState(false)
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null)

  const handleViewDetails = (prescriptionId: string) => {
    console.log("Opening prescription details for:", prescriptionId)
    setSelectedPrescriptionId(prescriptionId)
    setPrescriptionDetailsOpen(true)
  }

  return (
    <>
      <PrescriptionCard prescription={prescription} onViewDetails={handleViewDetails} />

      <PrescriptionDetailsDialog
        open={prescriptionDetailsOpen}
        onOpenChange={setPrescriptionDetailsOpen}
        prescriptionId={selectedPrescriptionId}
      />
    </>
  )
}
