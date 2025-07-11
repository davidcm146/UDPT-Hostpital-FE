"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Stethoscope, Loader2, AlertCircle, User, Phone } from "lucide-react"
import type { MedicalRecord } from "@/types/medical-record"
import type { Prescription } from "@/types/prescription"
import { CreatePrescriptionDialog } from "../prescriptions/CreatePrescriptionDialog"
import { PrescriptionDetailsDialog } from "../prescriptions/PrescriptionDetailsDialog"
import { getVisitTypeColor } from "@/lib/MedicalRecordUtils"
import { formatDate } from "@/lib/DateTimeUtils"
import { MedicalRecordService } from "@/services/medicalRecordService"
import { PrescriptionService } from "@/services/prescriptionService"
import { PatientInfo } from "./PatientInfo"
import { PrescriptionTab } from "./PrescriptionTab"

interface MedicalRecordDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recordId: string | null
}

export function MedicalRecordDetailsDialog({ open, onOpenChange, recordId }: MedicalRecordDetailsDialogProps) {
  const [createPrescriptionOpen, setCreatePrescriptionOpen] = useState(false)
  const [prescriptionDetailsOpen, setPrescriptionDetailsOpen] = useState(false)
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null)
  const [record, setRecord] = useState<MedicalRecord | null>(null)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrescriptions, setIsLoadingPrescriptions] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch medical record when dialog opens and recordId is provided
  useEffect(() => {
    const fetchMedicalRecord = async () => {
      if (!open || !recordId) {
        setRecord(null)
        setPrescriptions([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const fetchedRecord = await MedicalRecordService.getMedicalRecordById(recordId)
        setRecord(fetchedRecord)

        // Fetch prescriptions for this medical record
        setIsLoadingPrescriptions(true)
        try {
          const fetchedPrescriptions = await PrescriptionService.fetchPrescriptionsByMedicalRecord(recordId)
          setPrescriptions(fetchedPrescriptions)
        } catch (prescriptionError) {
          console.error("Error fetching prescriptions:", prescriptionError)
          setPrescriptions([])
        } finally {
          setIsLoadingPrescriptions(false)
        }
      } catch (err) {
        console.error("Error fetching medical record:", err)
        setError("Failed to load medical record details")
        setRecord(null)
        setPrescriptions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchMedicalRecord()
  }, [open, recordId])

  // Refresh prescriptions when a new prescription is created
  const refreshPrescriptions = async () => {
    if (!recordId) return

    setIsLoadingPrescriptions(true)
    try {
      const fetchedPrescriptions = await PrescriptionService.fetchPrescriptionsByMedicalRecord("6f26eb2d-788b-4265-910a-4227c3b6f693")
      setPrescriptions(fetchedPrescriptions)
    } catch (error) {
      console.error("Error refreshing prescriptions:", error)
    } finally {
      setIsLoadingPrescriptions(false)
    }
  }

  if (!recordId) return null

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:min-w-5xl max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Loading Medical Record...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error || !record) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:min-w-5xl max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Error Loading Medical Record</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error || "Medical record not found"}</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const handleAddPrescription = () => {
    setCreatePrescriptionOpen(true)
  }

  const handleViewPrescriptionDetails = (prescriptionID: string) => {
    setSelectedPrescriptionId(prescriptionID)
    setPrescriptionDetailsOpen(true)
  }

  const handlePrescriptionCreated = () => {
    // Refresh prescriptions when a new one is created
    refreshPrescriptions()
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
              <TabsTrigger value="prescriptions">Prescriptions ({prescriptions.length})</TabsTrigger>
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

                {/* Patient Summary from Record */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Patient Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Patient Name:</p>
                        <p className="text-gray-700">{record.patientName}</p>
                      </div>
                      <div>
                        <p className="font-medium">Patient ID:</p>
                        <p className="text-gray-700">{record.patientId}</p>
                      </div>
                      <div>
                        <p className="font-medium">Phone Number:</p>
                        <p className="text-gray-700 flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {record.patientPhoneNumber}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Doctor:</p>
                        <p className="text-gray-700">Dr. {record.doctorName}</p>
                      </div>
                    </div>
                  </CardContent>
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
                        <p className="text-gray-700">{formatDate(record.visitDate)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Visit Type:</p>
                        <p className="text-gray-700">{record.visitType}</p>
                      </div>
                      <div>
                        <p className="font-medium">Created At:</p>
                        <p className="text-gray-700">{formatDate(record.createdAt?.toString() || "")}</p>
                      </div>
                      <div>
                        <p className="font-medium">Last Updated:</p>
                        <p className="text-gray-700">
                          {formatDate(record.updatedAt?.toString() || record.createdAt?.toString() || "")}
                        </p>
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
              <PatientInfo patientId={record.patientId} />
            </TabsContent>

            {/* Prescriptions Tab */}
            <TabsContent value="prescriptions">
              <PrescriptionTab
                prescriptions={prescriptions}
                record={record}
                isLoading={isLoadingPrescriptions}
                onCreatePrescription={handleAddPrescription}
                onViewPrescriptionDetails={handleViewPrescriptionDetails}
                onRefreshPrescriptions={refreshPrescriptions}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Create Prescription Dialog */}
      <CreatePrescriptionDialog
        open={createPrescriptionOpen}
        onOpenChange={setCreatePrescriptionOpen}
        medicalRecordId={record?.id}
        patientId={record.patientId}
        onPrescriptionCreated={handlePrescriptionCreated}
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
