"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import type { Patient } from "@/types/patient"
import { Loading } from "@/components/ui/loading"
import { PatientListHeader } from "@/components/doctor/patients/PatientListHeader"
import { PatientCard } from "@/components/doctor/patients/PatientCard"
import { PatientFilters } from "@/components/doctor/patients/PatientFilters"
import { PatientPagination } from "@/components/doctor/patients/PatientPagination"
import { PatientService } from "@/services/patientService"
import { Card, CardContent } from "@/components/ui/card"
import { PatientMedicalRecordDialog } from "@/components/doctor/patients/PatientMedicalRecordDialog"
import { Input } from "@/components/ui/input"
import { calculateAge } from "@/lib/PatientUtils"

const DoctorPatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [isFetchingPatient, setIsFetchingPatient] = useState(false)
  const [filters, setFilters] = useState({
    showUrgentOnly: false,
    genderFilter: [] as string[],
    conditionFilter: [] as string[],
    ageRange: "all",
    bloodTypeFilter: [] as string[],
  })
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [medicalRecordDialogOpen, setMedicalRecordDialogOpen] = useState(false)

  const itemsPerPage = 4
  const offset = 0
  const limit = 8

  // Fetch patients on component mount
  useEffect(() => {
    const controller = new AbortController()
    let isMounted = true

    const fetchPatients = async () => {
      try {
        setIsLoading(true)

        // Pass offset and limit as parameters
        const data = await PatientService.getAllPatients(controller.signal, offset, limit)
        console.log("Fetched patients data:", data)

        if (isMounted) {
          setPatients(data)
          setFilteredPatients(data)
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          console.log("Fetch aborted")
        } else {
          console.error("Error fetching patients:", error)
          if (isMounted) {
            toast.error("Failed to load patients")
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchPatients()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [offset, limit])

  // Filter patients based on search criteria
  const filterPatients = () => {
    if (!patients.length) return

    const filtered = patients.filter((patient) => {
      // Search query filter
      const matchesQuery =
        searchQuery === "" ||
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.occupation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.allergies.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.pastIllness.toLowerCase().includes(searchQuery.toLowerCase())

      // Gender filter
      const matchesGender = filters.genderFilter.length === 0 || filters.genderFilter.includes(patient.gender)

      // Age range filter
      const age = calculateAge(patient.dob)
      const matchesAge = (() => {
        if (age) {
          switch (filters.ageRange) {
            case "0-18":
              return age >= 0 && age <= 18
            case "19-35":
              return age >= 19 && age <= 35
            case "36-55":
              return age >= 36 && age <= 55
            case "56+":
              return age >= 56
            default:
              return true
          }
        }
      })()

      // Blood type filter
      const matchesBloodType =
        filters.bloodTypeFilter.length === 0 || filters.bloodTypeFilter.includes(patient.bloodType)

      // Condition filter
      const matchesCondition =
        filters.conditionFilter.length === 0 ||
        filters.conditionFilter.some(
          (condition) =>
            patient.allergies.toLowerCase().includes(condition.toLowerCase()) ||
            patient.pastIllness.toLowerCase().includes(condition.toLowerCase()),
        )

      // Urgent filter
      const matchesUrgent =
        !filters.showUrgentOnly ||
        (() => {
          const hasUrgentCondition =
            patient.allergies.toLowerCase().includes("severe") ||
            patient.allergies.toLowerCase().includes("critical") ||
            patient.pastIllness.toLowerCase().includes("emergency") ||
            patient.pastIllness.toLowerCase().includes("urgent") ||
            patient.pastIllness.toLowerCase().includes("critical")
          return hasUrgentCondition
        })()

      return matchesQuery && matchesGender && matchesAge && matchesBloodType && matchesCondition && matchesUrgent
    })

    setFilteredPatients(filtered)
    setCurrentPage(0) // Reset to first page when filtering
  }

  // Filter patients when search criteria change
  useEffect(() => {
    filterPatients()
  }, [patients, searchQuery, filters])

  // Pagination - Fixed to work with 0-based indexing
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex)

  // Handle filter changes
  const handleFilterChange = (
    filterType: "showUrgentOnly" | "genderFilter" | "conditionFilter" | "ageRange" | "bloodTypeFilter",
    value: boolean | string[] | string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  // Patient action handlers
  const handleViewRecords = async (patientID: string) => {
    try {
      setIsFetchingPatient(true)
      const patient = await PatientService.getPatientById(patientID)
      setSelectedPatient(patient)
      setMedicalRecordDialogOpen(true)
    } catch (error) {
      console.error("Failed to fetch patient info:", error)
      toast.error("Unable to load patient details")
    } finally {
      setIsFetchingPatient(false)
    }
  }


  const handleViewPrescriptions = (patientID: string) => {
    console.log("Viewing prescriptions for patient:", patientID)
    toast.info(`Opening prescriptions for patient ${patientID}`)
  }

  const handleScheduleAppointment = (patientID: string) => {
    console.log("Scheduling appointment for patient:", patientID)
    toast.info(`Opening appointment scheduler for patient ${patientID}`)
  }

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      filters.showUrgentOnly ||
      filters.genderFilter.length > 0 ||
      filters.conditionFilter.length > 0 ||
      filters.ageRange !== "all" ||
      filters.bloodTypeFilter.length > 0 ||
      searchQuery !== ""
    )
  }

  const resetFilters = () => {
    setSearchQuery("")
    setFilters({
      showUrgentOnly: false,
      genderFilter: [],
      conditionFilter: [],
      ageRange: "all",
      bloodTypeFilter: [],
    })
    setCurrentPage(0)
    // Reset to show all patients
    setFilteredPatients(patients)
  }

  if (isLoading) {
    return (
      <Loading message="Loading Patients" subMessage="Retrieving your patient information..." variant="heartbeat" />
    )
  }

  return (
    <div className="min-h-screen px-8 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PatientListHeader patientCount={filteredPatients.length} />

        {/* Search and Filters */}
        <div className="mb-6 space-y-4 mt-3">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search patients by name, ID, phone, email, occupation, allergies, or medical history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <PatientFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters() && (
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {searchQuery && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      Search: "{searchQuery}"
                    </span>
                  )}
                  {filters.showUrgentOnly && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                      Urgent Only
                    </span>
                  )}
                  {filters.genderFilter.map((gender) => (
                    <span
                      key={gender}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700"
                    >
                      {gender}
                    </span>
                  ))}
                  {filters.ageRange !== "all" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      Age: {filters.ageRange}
                    </span>
                  )}
                  {filters.bloodTypeFilter.map((bloodType) => (
                    <span
                      key={bloodType}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700"
                    >
                      {bloodType}
                    </span>
                  ))}
                  {filters.conditionFilter.map((condition) => (
                    <span
                      key={condition}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-700"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
                <button onClick={resetFilters} className="text-sm text-red-600 hover:text-red-800 underline">
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredPatients.length === 0
              ? "No patients found matching your criteria"
              : `Showing ${paginatedPatients.length} of ${filteredPatients.length} patients`}
          </p>
        </div>

        {/* Patient Cards */}
        <div className="space-y-6 mb-8">
          {paginatedPatients.length > 0 ? (
            paginatedPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onViewRecords={handleViewRecords}
                onViewPrescriptions={handleViewPrescriptions}
                onScheduleAppointment={handleScheduleAppointment}
              />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 mb-2">No patients found matching your search criteria.</p>
                <button onClick={resetFilters} className="text-teal-600 hover:text-teal-700 underline">
                  Clear all filters
                </button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <PatientPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalPatients={filteredPatients.length}
            patientsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
        <PatientMedicalRecordDialog
          open={medicalRecordDialogOpen}
          onOpenChange={setMedicalRecordDialogOpen}
          patient={selectedPatient}
          isLoading={isFetchingPatient}
        />
      </div>
    </div>
  )
}

export default DoctorPatientsPage
