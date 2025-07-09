"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import type { Doctor } from "@/types/doctor"
import { Loading } from "@/components/ui/loading"
import DoctorSearchFilters from "@/components/doctors/DoctorSearchFilter"
import DoctorCard from "@/components/doctors/DoctorCard"
import DoctorPagination from "@/components/doctors/DoctorPagination"
import NoDoctorsFound from "@/components/doctors/DoctorNotFound"
import { DoctorService } from "@/services/doctorService"

const FindDoctorPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [specialty, setSpecialty] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [availableDate, setAvailableDate] = useState<Date | undefined>(undefined)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const itemsPerPage = 4

  // Fetch doctors on component mount
  useEffect(() => {
    const controller = new AbortController()
    const fetchDoctors = async () => {
      try {
        setIsLoading(true)
        const doctorsData = await DoctorService.getAllDoctors(controller.signal)
        setDoctors(doctorsData)
        setFilteredDoctors(doctorsData) // Initialize filtered doctors
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          console.log("Fetch aborted")
        } else {
          console.error("Error fetching doctors:", error)
          toast.error("Failed to load doctors")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchDoctors()
    return () => {
      controller.abort()
    }
  }, [])

  // Filter doctors based on search criteria
  const filterDoctors = () => {
    if (!doctors.length) return

    const filtered = doctors.filter((doctor) => {
      const matchesQuery =
        searchQuery === "" ||
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSpecialty = specialty === "all" || doctor.specialty?.toLowerCase() === specialty.toLowerCase()

      // Note: availableDate filtering would require additional API call to check doctor's schedule
      // For now, we'll just filter by name and specialty
      return matchesQuery && matchesSpecialty
    })

    setFilteredDoctors(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }

  // Filter doctors when search criteria change
  useEffect(() => {
    filterDoctors()
  }, [doctors, searchQuery, specialty, availableDate])

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)
  const paginatedDoctors = filteredDoctors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setSelectedDate(new Date())
    setSelectedTimeSlot(null)
  }

  const handleConfirmAppointment = () => {
    if (!selectedTimeSlot || !selectedDoctor || !selectedDate) return
    toast.success(
      `Appointment confirmed with ${selectedDoctor.name} on ${selectedDate.toLocaleDateString("en-CA")} at ${selectedTimeSlot}`,
    )
    setSelectedDoctor(null)
    setSelectedTimeSlot(null)
  }

  const handleSearch = () => {
    console.log("Search triggered with:", { searchQuery, specialty, availableDate })
    filterDoctors()
  }

  const resetFilters = () => {
    setSearchQuery("")
    setSpecialty("all")
    setAvailableDate(undefined)
    setActiveFilters([])
    setCurrentPage(1)
    // Reset to show all doctors
    setFilteredDoctors(doctors)
  }

  if (isLoading) {
    return (
      <Loading
        message="Finding Available Doctors"
        subMessage="Searching our network of healthcare professionals..."
        variant="heartbeat"
      />
    )
  }

  return (
    <div className="min-h-screen px-8 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Doctor</h1>
          <p className="text-gray-600">
            Search for specialists and book appointments with our experienced healthcare providers
          </p>
        </div>

        {/* Search and Filters */}
        <DoctorSearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          specialty={specialty}
          setSpecialty={setSpecialty}
          availableDate={availableDate}
          setAvailableDate={setAvailableDate}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          onSearch={handleSearch}
          onResetFilters={resetFilters}
        />

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredDoctors.length === 0
              ? "No doctors found matching your criteria"
              : `Showing ${paginatedDoctors.length} of ${filteredDoctors.length} doctors`}
          </p>
        </div>

        {/* Doctor Cards */}
        <div className="space-y-6 mb-8">
          {paginatedDoctors.length > 0 ? (
            paginatedDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onBookAppointment={handleBookAppointment}
                selectedDoctor={selectedDoctor}
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedDate={setSelectedDate}
                setSelectedTimeSlot={setSelectedTimeSlot}
                onConfirmAppointment={handleConfirmAppointment}
              />
            ))
          ) : (
            <NoDoctorsFound />
          )}
        </div>

        {/* Pagination */}
        {filteredDoctors.length > itemsPerPage && (
          <DoctorPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        )}
      </div>
    </div>
  )
}

export default FindDoctorPage
