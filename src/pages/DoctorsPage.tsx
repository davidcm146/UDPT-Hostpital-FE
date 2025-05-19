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
  const [gender, setGender] = useState("all")
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

    const matchesLocation = location === "all" || doctor.location.toLowerCase().includes(location.toLowerCase())

    const matchesGender = gender === "all" || doctor.gender.toLowerCase() === gender.toLowerCase()

    const matchesDate = !availableDate || doctor.availability.includes("Available today")

    return matchesQuery && matchesSpecialty && matchesLocation && matchesGender && matchesDate
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
    if (!selectedTimeSlot) return
    alert(
      `Appointment confirmed with ${selectedDoctor?.name} on ${selectedDate?.toLocaleDateString()} at ${selectedTimeSlot}`,
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
    setGender("all")
    setAvailableDate(undefined)
    setActiveFilters([])
  }

  return (
    <div className="container mx-auto px-8 py-8">
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
        gender={gender}
        setGender={setGender}
        availableDate={availableDate}
        setAvailableDate={setAvailableDate}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        onSearch={handleSearch}
        onResetFilters={resetFilters}
      />

      {/* Doctor Listing */}
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
      {filteredDoctors.length > 0 && (
        <DoctorPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      )}
    </div>
  )
}

export default FindDoctorPage
