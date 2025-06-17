"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, CalendarPlus, User, Stethoscope, ClipboardList, FileText } from "lucide-react"
import { MedicalRecordDetailsDialog } from "@/components/medical-record/MedicalRecordDetailsDialog"
import { MedicalRecordFilters } from "@/components/medical-record/MedicalRecordFilters"
import { mockMedicalRecords } from "@/data/medical-record"
import { getDoctorById } from "@/data/doctors"
import { MedicalRecordCard } from "@/components/medical-record/MedicalRecordCard"
import { EmptyMedicalRecord } from "@/components/medical-record/EmptyMedicalRecord"


const MedicalRecordPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVisitTypes, setSelectedVisitTypes] = useState<string[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState("")

  // Handle filter changes
  const handleFilterChange = (visitTypes: string[], dateRange: string) => {
    setSelectedVisitTypes(visitTypes)
    setSelectedDateRange(dateRange)
  }

  // Filter medical records based on search and filters
  const filteredMedicalRecords = useMemo(() => {
    return mockMedicalRecords.filter((record) => {
      const doctor = getDoctorById(record.doctorId)
      const doctorName = doctor?.name || ""

      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase())

      // Visit type filter
      const matchesVisitType = selectedVisitTypes.length === 0 || selectedVisitTypes.includes(record.visitType)

      return matchesSearch && matchesVisitType
    })
  }, [mockMedicalRecords, searchTerm, selectedVisitTypes, selectedDateRange])

  const openRecordDetails = (id: string) => {
    setSelectedRecordId(id)
    setDialogOpen(true)
  }

  return (
    <div className="min-h-screen px-8 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
            <p className="text-gray-600">View and manage your medical record history</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Schedule New Visit
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <MedicalRecordFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredMedicalRecords.length} of {mockMedicalRecords.length} medical records
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
          </div>
        ) : (
          <EmptyMedicalRecord />
        )}

        <MedicalRecordDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          recordId={selectedRecordId}
          medicalRecords={mockMedicalRecords}
        />
      </div>
    </div>
  )
}

export default MedicalRecordPage
