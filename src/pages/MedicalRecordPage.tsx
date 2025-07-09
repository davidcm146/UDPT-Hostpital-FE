"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarPlus, RefreshCw, AlertCircle } from "lucide-react"
import { MedicalRecordDetailsDialog } from "@/components/medical-record/MedicalRecordDetailsDialog"
import { MedicalRecordFilters } from "@/components/medical-record/MedicalRecordFilters"
import { MedicalRecordCard } from "@/components/medical-record/MedicalRecordCard"
import { MedicalRecordPagination } from "@/components/medical-record/MedicalRecordPagination"
import { EmptyMedicalRecord } from "@/components/medical-record/EmptyMedicalRecord"
import { Loading } from "@/components/ui/loading"
import { MedicalRecordService } from "@/services/medicalRecordService"
import type { MedicalRecord } from "@/types/medical-record"

const MedicalRecordPage = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVisitTypes, setSelectedVisitTypes] = useState<string[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state from API response
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize, setPageSize] = useState(4)

  // Track what type of loading is happening
  const [loadingType, setLoadingType] = useState<"initial" | "search" | "filter" | "page" | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Fetch medical records from API
  const fetchMedicalRecords = useCallback(
    async (page = 0, type: "initial" | "search" | "filter" | "page" = "initial") => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const controller = new AbortController()
      abortControllerRef.current = controller

      setIsLoading(true)
      setLoadingType(type)
      setError(null)

      try {
        const params = {
          limit: pageSize,
          offset: page * pageSize,
          signal: controller.signal,
          ...(searchTerm.trim() && { diagnosis: searchTerm.trim() }),
          ...(selectedVisitTypes.length === 1 && { visitType: selectedVisitTypes[0] }),
        }

        const response = await MedicalRecordService.getMedicalRecords(params)

        // Only update if this request wasn't cancelled
        if (!controller.signal.aborted) {
          setMedicalRecords(response.data)
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
          setLoadingType(null)
        }
      }
    },
    [searchTerm, selectedVisitTypes, pageSize],
  )

  // Stable callback for search changes
  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search)
    setCurrentPage(0)
  }, [])

  // Stable callback for filter changes
  const handleFilterChange = useCallback((visitTypes: string[], dateRange: string) => {
    setSelectedVisitTypes(visitTypes)
    setSelectedDateRange(dateRange)
    setCurrentPage(0)
  }, [])

  // Handle search changes
  useEffect(() => {
    fetchMedicalRecords(0, "search")
  }, [searchTerm])

  // Handle filter changes
  useEffect(() => {
    fetchMedicalRecords(0, "filter")
  }, [selectedVisitTypes])

  // Initial load
  useEffect(() => {
    fetchMedicalRecords(0, "initial")
  }, []) // Only run once on mount

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
      fetchMedicalRecords(page, "page")
    },
    [fetchMedicalRecords],
  )

  // Filter medical records based on client-side filters
  const filteredMedicalRecords = useMemo(() => {
    return medicalRecords.filter((record) => {
      // Date range filter (client-side)
      let matchesDateRange = true
      if (selectedDateRange) {
        const recordDate = new Date(record.visitDate)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24))

        switch (selectedDateRange) {
          case "7days":
            matchesDateRange = daysDiff <= 7
            break
          case "30days":
            matchesDateRange = daysDiff <= 30
            break
          case "3months":
            matchesDateRange = daysDiff <= 90
            break
          case "6months":
            matchesDateRange = daysDiff <= 180
            break
          case "1year":
            matchesDateRange = daysDiff <= 365
            break
        }
      }

      // Visit type filter (client-side for multiple selections)
      const matchesVisitType = selectedVisitTypes.length === 0 || selectedVisitTypes.includes(record.visitType)

      return matchesDateRange && matchesVisitType
    })
  }, [medicalRecords, selectedVisitTypes, selectedDateRange])

  const openRecordDetails = useCallback((id: string) => {
    setSelectedRecordId(id)
    setDialogOpen(true)
  }, [])

  const handleRefresh = useCallback(() => {
    fetchMedicalRecords(currentPage, "page")
  }, [fetchMedicalRecords, currentPage])

  // Show loading component during initial load only
  if (loadingType === "initial" && medicalRecords.length === 0) {
    return (
      <Loading
        message="Loading Medical Records"
        subMessage="Fetching your medical history from the system..."
        variant="heartbeat"
      />
    )
  }

  return (
    <div className="min-h-screen px-8 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
            <p className="text-gray-600">View and manage your medical record history</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Schedule New Visit
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <div className="mb-6">
          <MedicalRecordFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            isLoading={loadingType === "filter"}
          />
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredMedicalRecords.length} of {totalElements} medical records
            {currentPage > 0 && ` (Page ${currentPage + 1} of ${totalPages})`}
            {loadingType === "search" && (
              <span className="ml-2 text-teal-600">
                <span className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-teal-600 mr-1"></span>
                Searching...
              </span>
            )}
          </p>
        </div>

        {/* Medical Records List */}
        {filteredMedicalRecords.length > 0 ? (
          <div className="space-y-4">
            {filteredMedicalRecords.map((record) => (
              <MedicalRecordCard
                key={record.id}
                medicalRecord={record}
                onViewDetails={() => openRecordDetails(record.id)}
              />
            ))}

            {/* Pagination */}
            <MedicalRecordPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalElements}
              itemsPerPage={pageSize}
              onPageChange={handlePageChange}
              isLoading={loadingType === "page"}
            />
          </div>
        ) : (
          <EmptyMedicalRecord />
        )}

        <MedicalRecordDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          recordId={selectedRecordId}
          medicalRecords={filteredMedicalRecords}
        />
      </div>
    </div>
  )
}

export default MedicalRecordPage
