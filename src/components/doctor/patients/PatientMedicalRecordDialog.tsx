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
}

export function PatientMedicalRecordDialog({ open, onOpenChange, patient }: PatientMedicalRecordDialogProps) {
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
      const records = getMedicalRecordsByPatient(patient.userId)
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
              {/* <TabsTrigger value="records" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Medical Records ({recordStats.total})
              </TabsTrigger> */}
            </TabsList>

            {/* Patient Overview Tab */}
            <TabsContent value="overview">
              <PatientDetailsInfo patient={patient}/>
            </TabsContent>

            {/* Medical History Tab */}
            <TabsContent value="medical">
              <MedicalHistoryTab medicalRecords={medicalRecords} record={null} />
            </TabsContent>

            {/* Medical Records Tab */}
            <TabsContent value="records">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Medical Records</h3>
                  <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleCreateMedicalRecord}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Record
                  </Button>
                </div>

                {medicalRecords.length > 0 ? (
                  <div className="space-y-4">
                    {medicalRecords.map((record) => (
                      <MedicalRecordCard
                        key={record.id}
                        record={record}
                        onViewDetails={handleViewRecordDetails}
                        onAddPrescription={handleAddPrescriptionToRecord} prescriptionCount={getPrescriptionsByMedicalRecord(record.id).length} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical Records</h3>
                      <p className="text-gray-500 mb-4">This patient has no medical records on file.</p>
                      <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleCreateMedicalRecord}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Record
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
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
