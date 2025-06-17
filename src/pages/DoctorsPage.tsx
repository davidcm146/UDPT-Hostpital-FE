"use client"

import { useState } from "react"
import { mockDoctors } from "@/data/doctors"
import type { Doctor } from "@/types/doctor"
import DoctorSearchFilters from "@/components/doctors/DoctorSearchFilter"
import DoctorCard from "@/components/doctors/DoctorCard"
import DoctorPagination from "@/components/doctors/DoctorPagination"
import NoDoctorsFound from "@/components/doctors/DoctorNotFound"

const FindDoctorPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [specialty, setSpecialty] = useState("all")
  const [location, setLocation] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [availableDate, setAvailableDate] = useState<Date | undefined>(undefined)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const itemsPerPage = 4

  // Filter doctors based on search criteria
  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesQuery =
      searchQuery === "" ||
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSpecialty = specialty === "all" || doctor.specialty.toLowerCase() === specialty.toLowerCase()

    const matchesLocation =
      location === "all" || (doctor.address && doctor.address.toLowerCase().includes(location.toLowerCase()))

    return matchesQuery && matchesSpecialty && matchesLocation
  })

  // Paginate doctors
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)
  const paginatedDoctors = filteredDoctors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setSelectedDate(new Date())
    setSelectedTimeSlot(null)
  }

  const handleConfirmAppointment = () => {
    if (!selectedTimeSlot || !selectedDoctor || !selectedDate) return

    alert(
      `Appointment confirmed with ${selectedDoctor.name} on ${selectedDate.toLocaleDateString()} at ${selectedTimeSlot}`,
    )

    // Reset selection
    setSelectedDoctor(null)
    setSelectedTimeSlot(null)
  }

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSpecialty("all")
    setLocation("all")
    setAvailableDate(undefined)
    setActiveFilters([])
    setCurrentPage(1)
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
          location={location}
          setLocation={setLocation}
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
              ? "No doctors found"
              : `Showing ${paginatedDoctors.length} of ${filteredDoctors.length} doctors`}
          </p>
        </div>

        {/* Doctor Listing */}
        <div className="space-y-6 mb-8">
          {paginatedDoctors.length > 0 ? (
            paginatedDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.userId}
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
