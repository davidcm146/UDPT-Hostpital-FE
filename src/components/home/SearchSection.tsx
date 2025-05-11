"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faStar, faStarHalfAlt, faMapMarkerAlt, faCalendarAlt } from "@fortawesome/free-solid-svg-icons"

// Mock data for doctors
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    rating: 4.9,
    reviews: 124,
    location: "Main Hospital, Floor 3",
    image: "/placeholder.svg?height=80&width=80",
    availability: "Available today",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    rating: 4.7,
    reviews: 98,
    location: "West Wing, Floor 2",
    image: "/placeholder.svg?height=80&width=80",
    availability: "Next available: Tomorrow",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    rating: 4.8,
    reviews: 156,
    location: "Children's Center, Floor 1",
    image: "/placeholder.svg?height=80&width=80",
    availability: "Available today",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    rating: 4.6,
    reviews: 87,
    location: "East Wing, Floor 4",
    image: "/placeholder.svg?height=80&width=80",
    availability: "Next available: Friday",
  },
]

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [searchResults, setSearchResults] = useState<typeof mockDoctors>([])

  const handleSearch = () => {
    const results = mockDoctors.filter((doctor) => {
      const query = searchQuery.toLowerCase()
      return (
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query)
      )
    })

    setSearchResults(results)
    setSearchPerformed(true)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} className="text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="text-yellow-400" />)
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="text-gray-300" />)
    }

    return stars
  }

  return (
    <section className="py-12 bg-white mt-14">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Find a Doctor</h2>
          <p className="text-lg text-gray-600">Search for specialists and book appointments online</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search by doctor name or specialty"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full border-2 border-teal-500 focus:ring-2 focus:ring-teal-500 rounded-full pl-12"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-3 text-teal-500 text-lg" />
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700 rounded-full px-6" onClick={handleSearch}>
                Search
              </Button>
            </div>
          </div>

          {searchPerformed && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {searchResults.length > 0
                  ? `Found ${searchResults.length} doctor${searchResults.length === 1 ? "" : "s"}`
                  : "No doctors found matching your search"}
              </h3>

              {searchResults.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-24 h-24 bg-gray-100 flex-shrink-0">
                        <img
                          src={doctor.image || "/placeholder.svg"}
                          alt={doctor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{doctor.name}</h4>
                            <p className="text-gray-600">{doctor.specialty}</p>
                          </div>
                          <div className="mt-2 md:mt-0 flex items-center">
                            <div className="flex mr-2">{renderStars(doctor.rating)}</div>
                            <span className="text-sm text-gray-600">({doctor.reviews} reviews)</span>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between">
                          <div className="flex items-center text-gray-600">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-teal-600" />
                            <span>{doctor.location}</span>
                          </div>
                          <div className="mt-2 md:mt-0 flex items-center">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-teal-600" />
                            <span className="text-gray-600">{doctor.availability}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button className="bg-teal-600 hover:bg-teal-700">Book Appointment</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default SearchSection
