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
import { MedicalRecordDetailsDialog } from "@/components/medical-record/MedicalRecordDetailsDialog"
import { PatientMedicalRecordDialog } from "@/components/doctor/patients/PatientMedicalRecordDialog"
import { CreateMedicalRecordDialog } from "@/components/doctor/medical-record/CreateMedicalRecordDialog"
import { CreatePrescriptionDialog } from "@/components/doctor/prescriptions/CreatePrescriptionDialog"
import {
  getMedicalRecordsByDoctor,
  getDoctorMedicalRecordStats,
  searchMedicalRecords,
  filterMedicalRecordsByDateRange,
} from "@/data/medical-record"
import { getPatientById } from "@/data/doctor-patients"
import type { MedicalRecord } from "@/types/medical-record"
import type { DoctorPatient } from "@/data/doctor-patients"

const DoctorMedicalRecordHistoryPage = () => {
  // For demo purposes, using a fixed doctor ID
  const currentDoctorID = "550e8400-e29b-41d4-a716-446655440001"

  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<DoctorPatient | null>(null)
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
        const patient = getPatientById(record.patientID)
        return patient?.name.toLowerCase().includes(filters.patientName.toLowerCase())
      })
    }

    // Apply diagnosis filter
    if (filters.diagnosis) {
      result = result.filter((record) => record.diagnosis.toLowerCase().includes(filters.diagnosis.toLowerCase()))
    }

    // Apply status filter
    if (filters.status.length > 0) {
      result = result.filter((record) => filters.status.includes(record.status))
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
    const record = allDoctorRecords.find((r) => r.recordID === recordID)
    if (record) {
      setSelectedRecord(record)
      setRecordDetailsOpen(true)
    }
  }

  const handleViewPatient = (patientID: string) => {
    const patient = getPatientById(patientID)
    if (patient) {
      setSelectedPatient(patient)
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
              <h1 className="text-3xl font-bold text-gray-900">Medical Record History</h1>
              <p className="text-gray-600">
                View and manage all medical records you've created
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

          {/* Filters */}
          <div className="mb-6">
            <MedicalRecordHistoryFilters filters={filters} setFilters={setFilters} onReset={resetFilters} />
          </div>

          {/* Medical Records List */}
          <div className="space-y-4">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => {
                const patient = getPatientById(record.patientID)
                return (
                  <MedicalRecordHistoryCard
                    key={record.recordID}
                    record={record}
                    patient={patient}
                    onViewDetails={handleViewRecordDetails}
                    onViewPatient={handleViewPatient}
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
          recordId={selectedRecord?.recordID || null}
          medicalRecords={allDoctorRecords}
        />

        <PatientMedicalRecordDialog
          open={patientDialogOpen}
          onOpenChange={setPatientDialogOpen}
          patient={selectedPatient}
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

export default DoctorMedicalRecordHistoryPage
