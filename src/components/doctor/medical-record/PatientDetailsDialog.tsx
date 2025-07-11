import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText } from "lucide-react"
import type { Patient } from "@/types/patient"
import type { MedicalRecord } from "@/types/medical-record"
import { CreatePrescriptionDialog } from "../prescriptions/CreatePrescriptionDialog"
import { PrescriptionDetailsDialog } from "../prescriptions/PrescriptionDetailsDialog"
import { PatientInfo } from "./PatientInfo"
import { MedicalHistoryTab } from "./MedicalHistoryTab"
import { MedicalRecordService } from "@/services/medicalRecordService"

interface PatientDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
  record?: MedicalRecord | null
}

export function PatientDetailsDialog({ open, onOpenChange, patient, record }: PatientDetailsDialogProps) {
  const [createPrescriptionOpen, setCreatePrescriptionOpen] = useState(false)
  const [prescriptionDetailsOpen, setPrescriptionDetailsOpen] = useState(false)
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null)
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      if (!patient) return
      try {
        const res = await MedicalRecordService.getMedicalRecords({ patientId: patient.id })
        setMedicalRecords(res.data)
      } catch (error) {
        console.error("Failed to load medical records:", error)
      }
    }

    fetchMedicalRecords()
  }, [patient])

  if (!patient) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:min-w-5xl max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              Patient Details
              {record && (
                <Badge variant="outline" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  From: {record.diagnosis}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Patient Overview</TabsTrigger>
              <TabsTrigger value="history">Medical History ({medicalRecords.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <PatientInfo patientId={patient.id} />
            </TabsContent>

            <TabsContent value="history">
              <MedicalHistoryTab medicalRecords={medicalRecords} record={record} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <CreatePrescriptionDialog
        open={createPrescriptionOpen}
        patientId={patient.id}
        onOpenChange={setCreatePrescriptionOpen}
        medicalRecordId={record?.id || null}
      />

      <PrescriptionDetailsDialog
        open={prescriptionDetailsOpen}
        onOpenChange={setPrescriptionDetailsOpen}
        prescriptionId={selectedPrescriptionId}
      />
    </>
  )
}
