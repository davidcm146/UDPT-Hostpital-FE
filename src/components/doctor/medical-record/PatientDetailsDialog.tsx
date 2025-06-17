import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText } from "lucide-react"
import type { Patient } from "@/types/patient"
import type { MedicalRecord } from "@/types/medical-record"
import { CreatePrescriptionDialog } from "../prescriptions/CreatePrescriptionDialog"
import { PrescriptionDetailsDialog } from "../prescriptions/PrescriptionDetailsDialog"
import { getMedicalRecordsByPatient } from "@/data/medical-record"
import { getPrescriptionsByMedicalRecord, getPrescriptionsByPatient } from "@/data/prescription"
import { PatientInfo } from "./PatientInfo"
import { MedicalHistoryTab } from "./MedicalHistoryTab"

interface PatientDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
  record?: MedicalRecord | null // Optional medical record for context
}

export function PatientDetailsDialog({ open, onOpenChange, patient, record }: PatientDetailsDialogProps) {
  const [createPrescriptionOpen, setCreatePrescriptionOpen] = useState(false)
  const [prescriptionDetailsOpen, setPrescriptionDetailsOpen] = useState(false)
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null)

  if (!patient) return null

  // Get patient's medical records
  const patientMedicalRecords = getMedicalRecordsByPatient(patient.userId) || []

  // Get prescriptions - if we have a specific record, get prescriptions for that record
  // Otherwise, get all prescriptions for the patient
  const patientPrescriptions = record
    ? getPrescriptionsByMedicalRecord(record.id) || []
    : getPrescriptionsByPatient(patient.userId) || []

  console.log("Patient ID:", patient.userId)
  console.log("Medical Record:", record)
  console.log("Prescriptions:", patientPrescriptions)

  // const handleCreatePrescription = () => {
  //   setCreatePrescriptionOpen(true)
  // }

  // const handleViewPrescriptionDetails = (prescription: PrescriptionWithDetails) => {
  //   setSelectedPrescriptionId(prescription.id)
  //   setPrescriptionDetailsOpen(true)
  // }

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
              <TabsTrigger value="history">Medical History ({patientMedicalRecords.length})</TabsTrigger>
              {/* <TabsTrigger value="prescriptions">
                {record ? "Record Prescriptions" : "All Prescriptions"} ({patientPrescriptions.length})
              </TabsTrigger> */}
            </TabsList>

            {/* Patient Overview Tab */}
            <TabsContent value="overview">
              <PatientInfo patient={patient} />
            </TabsContent>

            {/* Medical History Tab */}
            <TabsContent value="history">
              <MedicalHistoryTab medicalRecords={patientMedicalRecords} record={record} />
            </TabsContent>

            {/* Prescriptions Tab */}
            {/* <TabsContent value="prescriptions">
              <PrescriptionTab prescriptions={patientPrescriptions} record={record} handleCreatePrescription={handleCreatePrescription} handleViewPrescriptionDetails={handleViewPrescriptionDetails} />   
            </TabsContent> */}
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Create Prescription Dialog */}
      <CreatePrescriptionDialog
        open={createPrescriptionOpen}
        onOpenChange={setCreatePrescriptionOpen}
        patient={patient}
        medicalRecordID={record?.id || null}
      />

      {/* Prescription Details Dialog */}
      <PrescriptionDetailsDialog
        open={prescriptionDetailsOpen}
        onOpenChange={setPrescriptionDetailsOpen}
        prescriptionId={selectedPrescriptionId}
      />
    </>
  )
}
