"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Search, CalendarIcon, Building, Stethoscope } from "lucide-react"
import { format } from "date-fns"

// Specialty options
export const specialties = [
  { value: "all", label: "All Specialties" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "dermatology", label: "Dermatology" },
  { value: "gastroenterology", label: "Gastroenterology" },
]

// Location options
export const locations = [
  { value: "all", label: "All Locations" },
  { value: "main", label: "Main Hospital" },
  { value: "west", label: "West Wing" },
  { value: "east", label: "East Wing" },
  { value: "children", label: "Children's Center" },
  { value: "medical-arts", label: "Medical Arts Building" },
]

interface DoctorSearchFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  specialty: string
  setSpecialty: (specialty: string) => void
  location: string
  setLocation: (location: string) => void
  availableDate: Date | undefined
  setAvailableDate: (date: Date | undefined) => void
  activeFilters: string[]
  setActiveFilters: (filters: string[]) => void
  onSearch: () => void
  onResetFilters: () => void
}

const DoctorSearchFilters = ({
  searchQuery,
  setSearchQuery,
  specialty,
  setSpecialty,
  location,
  setLocation,
  availableDate,
  setAvailableDate,
  activeFilters,
  setActiveFilters,
  onSearch,
  onResetFilters,
}: DoctorSearchFiltersProps) => {
  useEffect(() => {
    const filters = []

    if (specialty !== "all") {
      filters.push(`Specialty: ${specialties.find((s) => s.value === specialty)?.label}`)
    }

    if (location !== "all") {
      filters.push(`Location: ${locations.find((l) => l.value === location)?.label}`)
    }

    if (availableDate) {
      filters.push(`Available: ${format(availableDate, "PPP")}`)
    }

    setActiveFilters(filters)
  }, [specialty, location, availableDate, setActiveFilters])

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search bar */}
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search by doctor name or specialty"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Specialty Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Stethoscope className="mr-2 h-4 w-4 text-gray-500" />
              Specialty
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Specialty</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {specialties.map((item) => (
              <DropdownMenuItem
                key={item.value}
                className={specialty === item.value ? "bg-muted" : ""}
                onClick={() => setSpecialty(item.value)}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Location Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Building className="mr-2 h-4 w-4 text-gray-500" />
              Location
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Location</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {locations.map((item) => (
              <DropdownMenuItem
                key={item.value}
                className={location === item.value ? "bg-muted" : ""}
                onClick={() => setLocation(item.value)}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Filter Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
              {availableDate ? format(availableDate, "PP") : "Available Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={availableDate} onSelect={setAvailableDate} initialFocus />
            <div className="p-3 border-t border-border">
              <Button variant="outline" className="w-full" onClick={() => setAvailableDate(undefined)}>
                Clear Date
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <Button className="bg-teal-600 hover:bg-teal-700 w-full md:w-auto" onClick={onSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
            >
              {filter}
            </span>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-red-600 hover:text-red-800"
            onClick={onResetFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}

export default DoctorSearchFilters
