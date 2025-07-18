"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Plus, FileText, AlertCircle } from "lucide-react"
import { MedicalRecordHistoryCard } from "@/components/doctor/medical-record/MedicalRecordHistoryCard"
import {
  MedicalRecordHistoryFilters,
  type MedicalRecordFilterState,
} from "@/components/doctor/medical-record/MedicalRecordHistoryFilters"
import { PatientDetailsDialog } from "@/components/doctor/medical-record/PatientDetailsDialog"
import { CreateMedicalRecordDialog } from "@/components/doctor/medical-record/CreateMedicalRecordDialog"
import { CreatePrescriptionDialog } from "@/components/doctor/prescriptions/CreatePrescriptionDialog"
import { MedicalRecordDetailsDialog } from "@/components/doctor/medical-record/MedicalRecordDetailsDialog"
import { MedicalRecordPagination } from "@/components/doctor/medical-record/MedicalRecordPagination"
import { Loading } from "@/components/ui/loading"
import { MedicalRecordService } from "@/services/medicalRecordService"
import { PatientService } from "@/services/patientService"
import type { MedicalRecord } from "@/types/medical-record"
import type { Patient } from "@/types/patient"
import { useAuth } from "@/hooks/AuthContext"

const MedicalRecordHistoryPage = () => {
  // For demo purposes, using a fixed doctor ID
  const { user } = useAuth();
  const currentDoctorID = user?.sub;

  // State for medical records and pagination
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize, setPageSize] = useState(4)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog states
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
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

  // Abort controller for API requests
  const abortControllerRef = useRef<AbortController | null>(null)

  // Fetch medical records from API
  const fetchMedicalRecords = useCallback(
    async (page = 0, resetData = false) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const controller = new AbortController()
      abortControllerRef.current = controller

      setIsLoading(true)
      setError(null)

      try {
        const params = {
          doctorId: "cd90c404-6e72-4d57-8d97-05add77c7be1",
          limit: pageSize,
          offset: page * pageSize,
          signal: controller.signal,
          ...(filters.search.trim() && { diagnosis: filters.search.trim() }),
          ...(filters.diagnosis.trim() && { diagnosis: filters.diagnosis.trim() }),
          ...(filters.visitType.length === 1 && { visitType: filters.visitType[0] }),
          ...(filters.dateRange.from && { from: filters.dateRange.from.toISOString().split("T")[0] }),
          ...(filters.dateRange.to && { to: filters.dateRange.to.toISOString().split("T")[0] }),
        }

        const response = await MedicalRecordService.getMedicalRecords(params)

        // Only update if this request wasn't cancelled
        if (!controller.signal.aborted) {
          if (resetData || page === 0) {
            setMedicalRecords(response.data)
          } else {
            setMedicalRecords((prev) => [...prev, ...response.data])
          }

          setCurrentPage(response.page)
          setTotalPages(response.totalPages)
          setTotalElements(response.totalElements)
          setPageSize(response.pageSize)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Failed to fetch medical records:", err)
          setError("Failed to load medical records. Please check your connection and try again.")
          setMedicalRecords([])
          setTotalElements(0)
          setTotalPages(0)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    },
    [currentDoctorID, filters, pageSize],
  )

  // Update handleViewPatient to fetch patient when needed:
  const handleViewPatient = async (patientID: string, recordID?: string) => {
    try {
      const patient = await PatientService.getPatientById(patientID)
      const record = recordID ? medicalRecords.find((r) => r.id === recordID) : null

      setSelectedPatient(patient)
      setSelectedRecordForPatient(record ?? null)
      setPatientDialogOpen(true)
    } catch (error) {
      console.error("Error fetching patient:", error)
      // Show error message to user
    }
  }

  // Initial load
  useEffect(() => {
    fetchMedicalRecords(0, true)
  }, []) // Only run once on mount

  // Handle filter changes
  useEffect(() => {
    setCurrentPage(0)
    fetchMedicalRecords(0, true)
  }, [filters])

  // Add this useEffect after the existing ones
  useEffect(() => {
    // Fetch patient data for all records, but only for new patient IDs
    medicalRecords.forEach((record) => {})
  }, [medicalRecords]) // Only depend on medicalRecords

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
      fetchMedicalRecords(page, true)
    },
    [fetchMedicalRecords],
  )

  // Filter medical records based on client-side filters (for complex filters not supported by API)
  const filteredRecords = useMemo(() => {
    return medicalRecords.filter((record) => {
      // Patient name filter (client-side)
      if (filters.patientName) {
        return true
      }

      return true
    })
  }, [medicalRecords, filters.patientName])

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
    console.log("Attempting to view record details for:", recordID)
    setSelectedRecordId(recordID)
    setRecordDetailsOpen(true)
    console.log("Dialog should open now")
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
    setCurrentPage(0)
    fetchMedicalRecords(0, true)
  }

  // Show loading component during initial load
  if (isLoading && medicalRecords.length === 0) {
    return (
      <Loading
        message="Loading Medical Records"
        subMessage="Fetching medical records and patient data..."
        variant="heartbeat"
      />
    )
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
              <Button variant="outline" onClick={handleRefreshData} disabled={isLoading} className="bg-transparent">
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <div className="mb-6">
            <MedicalRecordHistoryFilters filters={filters} setFilters={setFilters} onReset={resetFilters} />
          </div>

          {/* Medical Records List */}
          <div className="space-y-4">
            {filteredRecords.length > 0 ? (
              <>
                {filteredRecords.map((record) => (
                  <MedicalRecordHistoryCard
                    key={record.id}
                    record={record}
                    onViewDetails={handleViewRecordDetails}
                    onViewPatient={(patientID) => handleViewPatient(patientID, record.id)}
                  />
                ))}

                {/* Pagination */}
                <MedicalRecordPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalElements}
                  itemsPerPage={pageSize}
                  onPageChange={handlePageChange}
                  isLoading={isLoading}
                />
              </>
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
                    <Button onClick={resetFilters} variant="outline" className="bg-transparent">
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
          recordId={selectedRecordId}
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
          onRecordCreated={(newRecord) => {
            console.log("New record created:", newRecord)
            // Refresh the data
            handleRefreshData()
          }}
        />
      </div>
    </div>
  )
}

export default MedicalRecordHistoryPage
