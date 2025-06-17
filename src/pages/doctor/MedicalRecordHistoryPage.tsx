"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Plus, FileText } from "lucide-react"
import { MedicalRecordHistoryCard } from "@/components/doctor/medical-record/MedicalRecordHistoryCard"
import {
  MedicalRecordHistoryFilters,
  type MedicalRecordFilterState,
} from "@/components/doctor/medical-record/MedicalRecordHistoryFilters"
import { PatientDetailsDialog } from "@/components/doctor/medical-record/PatientDetailsDialog"
import { CreateMedicalRecordDialog } from "@/components/doctor/medical-record/CreateMedicalRecordDialog"
import { CreatePrescriptionDialog } from "@/components/doctor/prescriptions/CreatePrescriptionDialog"
import {
  getMedicalRecordsByDoctor,
  getDoctorMedicalRecordStats,
  searchMedicalRecords,
  filterMedicalRecordsByDateRange,
  getMedicalRecordById,
} from "@/data/medical-record"
import { getPatientById } from "@/data/patient"
import type { MedicalRecord } from "@/types/medical-record"
import type { DoctorPatient } from "@/data/doctor-patients"
import { MedicalRecordDetailsDialog } from "@/components/doctor/medical-record/MedicalRecordDetailsDialog"

const MedicalRecordHistoryPage = () => {
  // For demo purposes, using a fixed doctor ID
  const currentDoctorID = "550e8400-e29b-41d4-a716-446655440001"

  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<DoctorPatient | null>(null)
  const [selectedRecordForPatient, setSelectedRecordForPatient] = useState<MedicalRecord | null>(null)
  const [recordDetailsOpen, setRecordDetailsOpen] = useState(false)
  const [patientDialogOpen, setPatientDialogOpen] = useState(false)
  const [createRecordOpen, setCreateRecordOpen] = useState(false)
  const [createPrescriptionOpen, setCreatePrescriptionOpen] = useState(false)
  const [prescriptionRecordID, setPrescriptionRecordID] = useState<string | null>(null)

  // Filter state
  const [filters, setFilters] = useState<MedicalRecordFilterState>({
    search: "",
    status: [],
    visitType: [],
    dateRange: {
      from: undefined,
      to: undefined,
    },
    patientName: "",
    diagnosis: "",
  })

  // Get all medical records for the current doctor
  const allDoctorRecords = useMemo(() => getMedicalRecordsByDoctor(currentDoctorID), [currentDoctorID])

  // Get doctor statistics
  const doctorStats = useMemo(() => getDoctorMedicalRecordStats(currentDoctorID), [currentDoctorID])

  // Apply filters to medical records
  const filteredRecords = useMemo(() => {
    let result = [...allDoctorRecords]

    // Apply search filter
    if (filters.search) {
      result = searchMedicalRecords(result, filters.search)
    }

    // Apply patient name filter
    if (filters.patientName) {
      result = result.filter((record) => {
        const patient = getPatientById(record.patientId)
        return patient?.name.toLowerCase().includes(filters.patientName.toLowerCase())
      })
    }

    // Apply diagnosis filter
    if (filters.diagnosis) {
      result = result.filter((record) => record.diagnosis.toLowerCase().includes(filters.diagnosis.toLowerCase()))
    }

    // Apply visit type filter
    if (filters.visitType.length > 0) {
      result = result.filter((record) => filters.visitType.includes(record.visitType))
    }

    // Apply date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      result = filterMedicalRecordsByDateRange(result, filters.dateRange.from, filters.dateRange.to)
    }

    // Sort by visit date (most recent first)
    return result.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
  }, [allDoctorRecords, filters])

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      status: [],
      visitType: [],
      dateRange: {
        from: undefined,
        to: undefined,
      },
      patientName: "",
      diagnosis: "",
    })
  }

  // Helper function to check if any filters are active
  const hasActiveFilters = (filters: MedicalRecordFilterState): boolean => {
    return (
      filters.search !== "" ||
      filters.patientName !== "" ||
      filters.diagnosis !== "" ||
      filters.status.length > 0 ||
      filters.visitType.length > 0 ||
      filters.dateRange.from !== undefined ||
      filters.dateRange.to !== undefined
    )
  }

  // Event handlers
  const handleViewRecordDetails = (recordID: string) => {
    const record = getMedicalRecordById(recordID)
    if (record) {
      setSelectedRecord(record)
      setRecordDetailsOpen(true)
    }
  }

  const handleViewPatient = (patientID: string, recordID?: string) => {
    const patient = getPatientById(patientID)
    const record = recordID ? getMedicalRecordById(recordID) : null

    console.log("Opening patient dialog for:", patient)
    console.log("With medical record:", record)

    if (patient) {
      setSelectedPatient(patient)
      setSelectedRecordForPatient(record ?? null)
      setPatientDialogOpen(true)
    }
  }

  const handleAddPrescription = (recordID: string) => {
    setPrescriptionRecordID(recordID)
    setCreatePrescriptionOpen(true)
  }

  const handleCreateRecord = () => {
    setCreateRecordOpen(true)
  }

  const handleExportData = () => {
    console.log("Exporting medical record data...")
    // In a real app, generate and download CSV/PDF
    alert("Medical record export feature would be implemented here")
  }

  const handleRefreshData = () => {
    console.log("Refreshing medical record data...")
    // In a real app, refresh data from API
    alert("Medical record data refreshed")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Records & Prescriptions</h1>
              <p className="text-gray-600">
                Manage medical records and prescriptions for your patients
                {filteredRecords.length > 0 && <span className="ml-2">• {filteredRecords.length} records found</span>}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleCreateRecord}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Record
              </Button>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" onClick={handleRefreshData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Records</p>
                    <p className="text-2xl font-bold text-gray-900">{doctorStats.totalRecords}</p>
                  </div>
                  <FileText className="h-8 w-8 text-teal-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900">{doctorStats.totalPatients}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">{doctorStats.thisMonthRecords}</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Emergency</p>
                    <p className="text-2xl font-bold text-gray-900">{doctorStats.emergencyRecords}</p>
                  </div>
                  <FileText className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <MedicalRecordHistoryFilters filters={filters} setFilters={setFilters} onReset={resetFilters} />
          </div>

          {/* Medical Records List */}
          <div className="space-y-4">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => {
                const patient = getPatientById(record.patientId)
                return (
                  <MedicalRecordHistoryCard
                    key={record.id}
                    record={record}
                    patient={patient}
                    onViewDetails={handleViewRecordDetails}
                    onViewPatient={(patientID) => handleViewPatient(patientID, record.id)}
                    onAddPrescription={handleAddPrescription}
                  />
                )
              })
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {hasActiveFilters(filters) ? "No matching records found" : "No medical records found"}
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {hasActiveFilters(filters)
                      ? "Try adjusting your filters to find what you're looking for."
                      : "You haven't created any medical records yet."}
                  </p>
                  {hasActiveFilters(filters) ? (
                    <Button onClick={resetFilters} variant="outline">
                      Reset Filters
                    </Button>
                  ) : (
                    <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleCreateRecord}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Record
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Dialogs */}
        <MedicalRecordDetailsDialog
          open={recordDetailsOpen}
          onOpenChange={setRecordDetailsOpen}
          record={selectedRecord}
          patient={selectedRecord ? getPatientById(selectedRecord.patientId) ?? null : null}
        />

        <PatientDetailsDialog
          open={patientDialogOpen}
          onOpenChange={setPatientDialogOpen}
          patient={selectedPatient}
          record={selectedRecordForPatient}
        />

        <CreateMedicalRecordDialog
          open={createRecordOpen}
          onOpenChange={setCreateRecordOpen}
          patient={null}
          onRecordCreated={(newRecord) => {
            console.log("New record created:", newRecord)
            // In a real app, refresh the data
          }}
        />

        <CreatePrescriptionDialog
          open={createPrescriptionOpen}
          onOpenChange={setCreatePrescriptionOpen}
          patient={null}
          medicalRecordID={prescriptionRecordID}
        />
      </div>
    </div>
  )
}

export default MedicalRecordHistoryPage
