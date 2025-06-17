"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Download, RefreshCw } from "lucide-react"
import { PatientListHeader } from "@/components/doctor/patients/PatientListHeader"
import { PatientCard } from "@/components/doctor/patients/PatientCard"
import { PatientFilters } from "@/components/doctor/patients/PatientFilters"
import { PatientStatsCards } from "@/components/doctor/patients/PatientStatsCard"
import { getPrescriptionsByPatient } from "@/data/prescription"
import { PatientMedicalRecordDialog } from "@/components/doctor/patients/PatientMedicalRecordDialog"
import { calculateAge } from "@/lib/PatientUtils"
import { Patient } from "@/types/patient"
import { mockPatients, searchPatients, getPatientStats } from "@/data/patient"

const DoctorPatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    showUrgentOnly: false,
    genderFilter: [] as string[],
    conditionFilter: [] as string[],
    ageRange: "all",
    bloodTypeFilter: [] as string[],
  })

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [medicalRecordDialogOpen, setMedicalRecordDialogOpen] = useState(false)

  // Get patient statistics
  const patientStats = useMemo(() => getPatientStats(), [])

  // Filter patients based on search query and filters
  const filteredPatients = useMemo(() => {
    let result = [...patients]

    // Apply search query
    if (searchQuery.trim()) {
      result = searchPatients(searchQuery)
    }

    // Apply gender filter
    if (filters.genderFilter.length > 0) {
      result = result.filter((patient) => filters.genderFilter.includes(patient.gender))
    }

    // Apply age range filter
    if (filters.ageRange !== "all") {
      result = result.filter((patient) => {
        const age = calculateAge(patient.DOB)
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
      })
    }

    // Apply blood type filter
    if (filters.bloodTypeFilter.length > 0) {
      result = result.filter((patient) => filters.bloodTypeFilter.includes(patient.bloodType))
    }

    return result
  }, [patients, searchQuery, filters])

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
  const handleViewRecords = (patientID: string) => {
    const patient = mockPatients.find((p) => p.userId === patientID)
    if (patient) {
      setSelectedPatient(patient)
      setMedicalRecordDialogOpen(true)
    }
  }

  const handleViewPrescriptions = (patientID: string) => {
    console.log("Viewing prescriptions for patient:", patientID)
    const prescriptions = getPrescriptionsByPatient(patientID)
    console.log("Prescriptions:", prescriptions)
    // In a real app, open prescriptions dialog or navigate to prescriptions page
    alert(`Found ${prescriptions.length} prescriptions for patient ${patientID}`)
  }

  const handleScheduleAppointment = (patientID: string) => {
    console.log("Scheduling appointment for patient:", patientID)
    // In a real app, open appointment scheduling dialog
    alert(`Scheduling appointment for patient ${patientID}`)
  }

  const handleExportData = () => {
    console.log("Exporting patient data...")
    // In a real app, generate and download CSV/PDF
    alert("Patient data export feature would be implemented here")
  }

  const handleRefreshData = () => {
    console.log("Refreshing patient data...")
    setPatients([...mockPatients])
    alert("Patient data refreshed")
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setFilters({
      showUrgentOnly: false,
      genderFilter: [],
      conditionFilter: [],
      ageRange: "all",
      bloodTypeFilter: [],
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <PatientListHeader patientCount={patients.length} />

          <PatientStatsCards stats={patientStats} />

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search patients by name, ID, phone, or condition..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <PatientFilters filters={filters} onFilterChange={handleFilterChange} />
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

          <div className="space-y-4">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.userId}
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
                  <Button variant="link" onClick={clearAllFilters} className="text-teal-600 hover:text-teal-700">
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        <PatientMedicalRecordDialog
          open={medicalRecordDialogOpen}
          onOpenChange={setMedicalRecordDialogOpen}
          patient={selectedPatient}
        />
      </div>
    </div>
  )
}

export default DoctorPatientsPage
