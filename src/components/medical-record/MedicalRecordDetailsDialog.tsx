import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClipboardList, Pill } from "lucide-react"
import type { MedicalRecord } from "@/types/medical-record"
import { MedicalRecordDetailsTab } from "./MedicalRecordDetailsTab"
import { MedicalRecordPrescriptionTab } from "./MedicalRecordPrescriptionTab"
import { formatDate } from "@/lib/DateTimeUtils"

interface MedicalRecordDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recordId: string | null
  medicalRecords: MedicalRecord[]
}

export function MedicalRecordDetailsDialog({
  open,
  onOpenChange,
  recordId,
  medicalRecords,
}: MedicalRecordDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("details")

  // Find the selected medical record
  const medicalRecord = medicalRecords.find((record) => record.id === recordId)

  if (!medicalRecord) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
              <ClipboardList className="h-4 w-4 text-teal-600" />
            </div>
            <DialogTitle className="text-xl">{medicalRecord.diagnosis}</DialogTitle>
          </div>
          <p className="text-gray-600">
            {formatDate(medicalRecord.visitDate)} • {medicalRecord.visitType}
          </p>
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="details" className="flex items-center">
              <ClipboardList className="mr-2 h-4 w-4" />
              Record Details
            </TabsTrigger>
            <TabsTrigger value="prescription" className="flex items-center">
              <Pill className="mr-2 h-4 w-4" />
              Prescriptions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <MedicalRecordDetailsTab recordId={medicalRecord.id} />
          </TabsContent>

          <TabsContent value="prescription">
            <MedicalRecordPrescriptionTab medicalRecordId={medicalRecord.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
