"use client"

import type React from "react"

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
import { Search, CalendarIcon, Stethoscope } from "lucide-react"
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
  { value: "general practice", label: "General Practice" },
  { value: "internal medicine", label: "Internal Medicine" },
  { value: "surgery", label: "Surgery" },
]

interface DoctorSearchFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  specialty: string
  setSpecialty: (specialty: string) => void
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
  availableDate,
  setAvailableDate,
  activeFilters,
  setActiveFilters,
  onSearch,
  onResetFilters,
}: DoctorSearchFiltersProps) => {
  // Update active filters when specialty or date changes
  useEffect(() => {
    const filters = []
    if (specialty !== "all") {
      const specialtyLabel = specialties.find((s) => s.value === specialty)?.label
      if (specialtyLabel) {
        filters.push(`Specialty: ${specialtyLabel}`)
      }
    }
    if (availableDate) {
      filters.push(`Available: ${format(availableDate, "PPP")}`)
    }
    setActiveFilters(filters)
  }, [specialty, availableDate, setActiveFilters])

  // Handle search input with Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  // Handle specialty selection
  const handleSpecialtySelect = (value: string) => {
    setSpecialty(value)
    // Auto-trigger search when specialty changes
    setTimeout(() => onSearch(), 0)
  }

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setAvailableDate(date)
    // Auto-trigger search when date changes
    setTimeout(() => onSearch(), 0)
  }

  // Clear individual filter
  const clearSpecialtyFilter = () => {
    setSpecialty("all")
    setTimeout(() => onSearch(), 0)
  }

  const clearDateFilter = () => {
    setAvailableDate(undefined)
    setTimeout(() => onSearch(), 0)
  }

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
            onKeyPress={handleKeyPress}
            className="w-full pl-10 h-11"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Specialty Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto h-11 bg-transparent">
              <Stethoscope className="mr-2 h-4 w-4 text-gray-500" />
              {specialty === "all" ? "Specialty" : specialties.find((s) => s.value === specialty)?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Specialty</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {specialties.map((item) => (
              <DropdownMenuItem
                key={item.value}
                className={specialty === item.value ? "bg-muted" : ""}
                onClick={() => handleSpecialtySelect(item.value)}
              >
                {item.label}
                {specialty === item.value && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Filter Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto h-11 bg-transparent">
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
              {availableDate ? format(availableDate, "PP") : "Available Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={availableDate}
              onSelect={handleDateSelect}
              initialFocus
              disabled={(date) => date < new Date()}
            />
            <div className="p-3 border-t border-border">
              <Button variant="outline" className="w-full bg-transparent" onClick={clearDateFilter}>
                Clear Date
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <Button className="bg-teal-600 hover:bg-teal-700 w-full md:w-auto h-11" onClick={onSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {activeFilters.map((filter, index) => {
            const isSpecialtyFilter = filter.startsWith("Specialty:")
            const isDateFilter = filter.startsWith("Available:")

            return (
              <div
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 gap-1"
              >
                <span>{filter}</span>
                <button
                  onClick={() => {
                    if (isSpecialtyFilter) clearSpecialtyFilter()
                    if (isDateFilter) clearDateFilter()
                  }}
                  className="ml-1 hover:bg-teal-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </div>
            )
          })}
          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50"
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
