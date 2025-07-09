import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  User,
  FileText,
  Stethoscope,
  Plus,
  Loader2,
} from "lucide-react"
import { getMedicalRecordsByPatient } from "@/data/medical-record"
import { MedicalRecordCard } from "../medical-record/MedicalRecordCard"
import { MedicalRecordDetailsDialog } from "../medical-record/MedicalRecordDetailsDialog"
import { CreateMedicalRecordDialog } from "../medical-record/CreateMedicalRecordDialog"
import { CreatePrescriptionDialog } from "../prescriptions/CreatePrescriptionDialog"
import type { MedicalRecord } from "@/types/medical-record"
import { getPrescriptionsByMedicalRecord } from "@/data/prescription"
import { PatientDetailsInfo } from "./PatientDetailsInfo"
import { Patient } from "@/types/patient"
import { MedicalHistoryTab } from "../medical-record/MedicalHistoryTab"

interface PatientMedicalRecordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
  isLoading: boolean
}

export function PatientMedicalRecordDialog({ open, onOpenChange, patient, isLoading }: PatientMedicalRecordDialogProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [recordDetailsOpen, setRecordDetailsOpen] = useState(false)
  const [createRecordOpen, setCreateRecordOpen] = useState(false)
  const [createPrescriptionOpen, setCreatePrescriptionOpen] = useState(false)
  const [prescriptionRecordID, setPrescriptionRecordID] = useState<string | null>(null)
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])

  // Load medical records for this patient
  useEffect(() => {
    if (patient) {
      const records = getMedicalRecordsByPatient(patient.id)
      setMedicalRecords(records)
    }
  }, [patient])

  const handleViewRecordDetails = (recordID: string) => {
    const record = medicalRecords.find((r) => r.id === recordID)
    if (record) {
      setSelectedRecord(record)
      setRecordDetailsOpen(true)
    }
  }

  const handleAddPrescriptionToRecord = (recordID: string) => {
    setPrescriptionRecordID(recordID)
    setCreatePrescriptionOpen(true)
  }

  const handleCreateMedicalRecord = () => {
    setCreateRecordOpen(true)
  }

  const handleRecordCreated = (newRecord: MedicalRecord) => {
    setMedicalRecords((prev) => [newRecord, ...prev])
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:min-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Medical Record - {patient?.name}</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <Loader2 className="h-6 w-6 animate-spin text-teal-600 mr-2" />
              <span>Loading info...</span>
            </div>
          ) : (
            <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Patient Overview
                </TabsTrigger>
                <TabsTrigger value="medical" className="flex items-center">
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Medical History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <PatientDetailsInfo patient={patient} />
              </TabsContent>

              <TabsContent value="medical">
                <MedicalHistoryTab medicalRecords={medicalRecords} record={null} />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Medical Record Details Dialog */}
      <MedicalRecordDetailsDialog
        open={recordDetailsOpen}
        onOpenChange={setRecordDetailsOpen}
        record={selectedRecord}
        patient={patient}
      />

      {/* Create Medical Record Dialog */}
      <CreateMedicalRecordDialog
        open={createRecordOpen}
        onOpenChange={setCreateRecordOpen}
        patient={patient}
        onRecordCreated={handleRecordCreated}
      />

      {/* Create Prescription Dialog */}
      <CreatePrescriptionDialog
        open={createPrescriptionOpen}
        onOpenChange={setCreatePrescriptionOpen}
        patient={patient}
        medicalRecordID={prescriptionRecordID}
      />
    </>
  )
}
