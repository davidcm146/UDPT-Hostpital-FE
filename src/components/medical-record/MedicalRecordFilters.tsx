"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import type { MedicalRecord } from "@/types/medical-record"

interface MedicalRecordFiltersProps {
  searchTerm: string
  onSearchChange: (search: string) => void
  onFilterChange: (visitTypes: string[], dateRange: string) => void
}

export function MedicalRecordFilters({ searchTerm, onSearchChange, onFilterChange }: MedicalRecordFiltersProps) {
  const [selectedVisitTypes, setSelectedVisitTypes] = useState<string[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState("")

  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange(selectedVisitTypes, selectedDateRange)
  }, [selectedVisitTypes, selectedDateRange, onFilterChange])

  // Calculate number of active filters
  const activeFilterCount = selectedVisitTypes.length + (selectedDateRange ? 1 : 0)

  const visitTypes: MedicalRecord["visitType"][] = ["Regular Checkup", "Follow-up", "Emergency", "Consultation"]

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      {/* Search Input */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by doctor name, diagnosis, or treatment..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      {/* Advanced Filters Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto relative bg-white">
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Visit Type</DropdownMenuLabel>
          {visitTypes.map((type) => (
            <DropdownMenuCheckboxItem
              key={type}
              checked={selectedVisitTypes.includes(type)}
              onCheckedChange={(checked) => {
                setSelectedVisitTypes((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)))
              }}
            >
              {type}
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator />
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                setSelectedVisitTypes([])
                setSelectedDateRange("")
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
