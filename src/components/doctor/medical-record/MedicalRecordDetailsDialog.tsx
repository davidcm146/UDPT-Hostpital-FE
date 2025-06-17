import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Stethoscope, Pill, Plus } from "lucide-react"
import type { MedicalRecord } from "@/types/medical-record"
import type { Patient } from "@/types/patient"
import { CreatePrescriptionDialog } from "../prescriptions/CreatePrescriptionDialog"
import { PrescriptionDetailsDialog } from "../prescriptions/PrescriptionDetailsDialog"
import { getPrescriptionsByMedicalRecord } from "@/data/prescription"
import { getVisitTypeColor } from "@/lib/MedicalRecordUtils"
import { PatientInfo } from "./PatientInfo"

interface MedicalRecordDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: MedicalRecord | null
  patient: Patient | null
}

export function MedicalRecordDetailsDialog({ open, onOpenChange, record, patient }: MedicalRecordDetailsDialogProps) {
  const [createPrescriptionOpen, setCreatePrescriptionOpen] = useState(false)
  const [prescriptionDetailsOpen, setPrescriptionDetailsOpen] = useState(false)
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null)

  if (!record || !patient) return null

  // Get prescriptions for this record
  const recordPrescriptions = getPrescriptionsByMedicalRecord(record.id) || []

  const handleAddPrescription = () => {
    setCreatePrescriptionOpen(true)
  }

  const handleViewPrescriptionDetails = (prescriptionID: string) => {
    setSelectedPrescriptionId(prescriptionID)
    setPrescriptionDetailsOpen(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:min-w-5xl max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Medical Record Details</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Record Details</TabsTrigger>
              <TabsTrigger value="patient">Patient Information</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions ({recordPrescriptions.length || 0})</TabsTrigger>
            </TabsList>

            {/* Record Details Tab */}
            <TabsContent value="details">
              <div className="space-y-6">
                {/* Header Information */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{record.diagnosis}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getVisitTypeColor(record.visitType)}>{record.visitType}</Badge>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>Record ID: {record.id}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Visit Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Visit Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Visit Date:</p>
                        <p className="text-gray-700">{record.visitDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-medium">Visit Type:</p>
                        <p className="text-gray-700">{record.visitType}</p>
                      </div>
                      <div>
                        <p className="font-medium">Created At:</p>
                        <p className="text-gray-700">{record.createdAt.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-medium">Doctor ID:</p>
                        <p className="text-gray-700">{record.doctorId}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Stethoscope className="h-5 w-5 mr-2" />
                      Medical Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium text-gray-700 mb-2">Diagnosis:</p>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800">{record.diagnosis}</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-2">Treatment:</p>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800">{record.treatment}</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-gray-700 mb-2">Description:</p>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-gray-800">{record.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Patient Information Tab */}
            <TabsContent value="patient">
              <PatientInfo patient={patient} />
            </TabsContent>

            {/* Prescriptions Tab */}
            <TabsContent value="prescriptions">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Prescriptions for this Visit</h3>
                  <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleAddPrescription}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Prescription
                  </Button>
                </div>

                {recordPrescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {recordPrescriptions.map((prescription, index) => (
                      <Card key={prescription.id}>
                        <CardContent className="p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h2 className="text-lg font-semibold text-teal-700">Prescription #{index + 1}</h2>
                              <p className="text-sm text-gray-600 mt-1">
                                Status: {prescription.status} • Total:{" "}
                                <span className="font-medium text-black">${prescription.totalPrice.toFixed(2)}</span>
                              </p>
                              <p className="text-xs text-gray-400">ID: {prescription.id}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewPrescriptionDetails(prescription.id)}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions</h3>
                      <p className="text-gray-500 mb-4">No prescriptions have been added to this medical record.</p>
                      <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleAddPrescription}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Prescription
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Create Prescription Dialog */}
      <CreatePrescriptionDialog
        open={createPrescriptionOpen}
        onOpenChange={setCreatePrescriptionOpen}
        patient={patient}
        medicalRecordID={record?.id}
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
