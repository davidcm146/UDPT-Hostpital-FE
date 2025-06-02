import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  User,
  Heart,
  AlertTriangle,
  Pill,
  Calendar,
  FileText,
  Phone,
  Mail,
  MapPin,
  Activity,
  Stethoscope,
  Plus,
  History,
} from "lucide-react"
import type { DoctorPatient } from "@/data/doctor-patients"
import { formatHeight, formatWeight, calculateBMI, getBMICategory } from "@/data/patient"
import { getMedicalRecordsByPatient, getMedicalRecordStats } from "@/data/medical-record"
import { MedicalRecordCard } from "../medical-record/MedicalRecordCard"
import { MedicalRecordDetailsDialog } from "../medical-record/MedicalRecordDetailsDialog"
import { CreateMedicalRecordDialog } from "../medical-record/CreateMedicalRecordDialog"
import { CreatePrescriptionDialog } from "../prescriptions/CreatePrescriptionDialog"
import type { MedicalRecord } from "@/types/medical-record"

interface PatientMedicalRecordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: DoctorPatient | null
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
      const records = getMedicalRecordsByPatient(patient.patientID)
      setMedicalRecords(records)
    }
  }, [patient])

  const recordStats = patient
    ? getMedicalRecordStats(patient.patientID)
    : { total: 0, active: 0, totalPrescriptions: 0, lastVisit: null }

  const bmi = patient?.weight ? calculateBMI(patient.height, patient.weight) : 0
  const bmiCategory = bmi > 0 ? getBMICategory(bmi) : "Unknown"

  const getBMIColor = (category: string) => {
    switch (category) {
      case "Underweight":
        return "bg-blue-100 text-blue-800"
      case "Normal weight":
        return "bg-green-100 text-green-800"
      case "Overweight":
        return "bg-yellow-100 text-yellow-800"
      case "Obese":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewRecordDetails = (recordID: string) => {
    const record = medicalRecords.find((r) => r.recordID === recordID)
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
              <TabsTrigger value="records" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Medical Records ({recordStats.total})
              </TabsTrigger>
            </TabsList>

            {/* Patient Overview Tab */}
            <TabsContent value="overview">
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">Name:</span>
                          <span className="ml-2">{patient?.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">Age:</span>
                          <span className="ml-2">{patient?.age} years old</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">Gender:</span>
                          <span className="ml-2">{patient?.gender}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 text-red-500 mr-2" />
                          <span className="font-medium">Blood Type:</span>
                          <span className="ml-2 font-bold text-red-600">{patient?.bloodType}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">Phone:</span>
                          <span className="ml-2">{patient?.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">Email:</span>
                          <span className="ml-2">{patient?.email}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">Address:</span>
                          <span className="ml-2">{patient?.address}</span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">MRN:</span>
                          <span className="ml-2">{patient?.medicalRecordNumber}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vital Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Vital Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Activity className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-500">Height</p>
                        <p className="text-lg font-bold">{formatHeight(patient?.height ?? 0)}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Activity className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-500">Weight</p>
                        <p className="text-lg font-bold">{patient?.weight && formatWeight(patient.weight)}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Activity className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-500">BMI</p>
                        <p className="text-lg font-bold">{bmi > 0 ? bmi : "N/A"}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Activity className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-500">BMI Category</p>
                        {bmi > 0 && <Badge className={getBMIColor(bmiCategory)}>{bmiCategory}</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Contact Person:</p>
                        <p className="text-gray-700">{patient?.emergencyContactName}</p>
                      </div>
                      <div>
                        <p className="font-medium">Phone Number:</p>
                        <p className="text-gray-700">{patient?.emergencyContactPhone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Medical History Tab */}
            <TabsContent value="medical">
              <div className="space-y-6">
                {/* Allergies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      Allergies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`p-4 rounded-lg ${
                        patient?.allergies && patient.allergies !== "No known allergies"
                          ? "bg-red-50 border border-red-200"
                          : "bg-green-50 border border-green-200"
                      }`}
                    >
                      <p
                        className={
                          patient?.allergies && patient.allergies !== "No known allergies"
                            ? "text-red-800"
                            : "text-green-800"
                        }
                      >
                        {patient?.allergies || "No known allergies"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Medications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Pill className="h-5 w-5 text-blue-500 mr-2" />
                      Current Medications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800">{patient?.currentMedications || "No current medications"}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Chronic Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Stethoscope className="h-5 w-5 text-orange-500 mr-2" />
                      Chronic Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-orange-800">{patient?.chronicConditions || "No chronic conditions"}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Past Illness */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <History className="h-5 w-5 text-purple-500 mr-2" />
                      Past Medical History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-purple-800">{patient?.pastIllness || "No significant past medical history"}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Family History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 text-gray-500 mr-2" />
                      Family Medical History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-gray-800">{patient?.familyHistory || "No significant family history"}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Lifestyle Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lifestyle Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="font-medium text-gray-500">Smoking Status:</p>
                        <p className="text-gray-700">{patient?.smokingStatus}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-500">Alcohol Consumption:</p>
                        <p className="text-gray-700">{patient?.alcoholConsumption}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-500">Occupation:</p>
                        <p className="text-gray-700">{patient?.occupation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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

                {/* Medical Records Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">{recordStats.total}</p>
                      <p className="text-sm text-gray-500">Total Records</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">{recordStats.active}</p>
                      <p className="text-sm text-gray-500">Active</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-purple-600">{recordStats.totalPrescriptions}</p>
                      <p className="text-sm text-gray-500">Prescriptions</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm font-medium text-gray-500">Last Visit</p>
                      <p className="text-sm text-gray-700">
                        {recordStats.lastVisit ? recordStats.lastVisit.toLocaleDateString() : "N/A"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {medicalRecords.length > 0 ? (
                  <div className="space-y-4">
                    {medicalRecords.map((record) => (
                      <MedicalRecordCard
                        key={record.recordID}
                        record={record}
                        onViewDetails={handleViewRecordDetails}
                        onAddPrescription={handleAddPrescriptionToRecord}
                      />
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
