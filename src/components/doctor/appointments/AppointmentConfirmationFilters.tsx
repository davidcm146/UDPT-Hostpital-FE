"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Filter, AlertTriangle } from "lucide-react"

interface AppointmentConfirmationFiltersProps {
  onFilterChange: (urgentOnly: boolean, types: string[]) => void
}

const appointmentTypes = [
  { value: "EMERGENCY", label: "Emergency", color: "text-red-600" },
  { value: "CONSULTATION", label: "Consultation", color: "text-blue-600" },
  { value: "CHECKUP", label: "Checkup", color: "text-green-600" },
  { value: "FOLLOW-UP", label: "Follow-up", color: "text-purple-600" },
]

export function AppointmentConfirmationFilters({ onFilterChange }: AppointmentConfirmationFiltersProps) {
  const [showUrgentOnly, setShowUrgentOnly] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const handleUrgentToggle = (checked: boolean) => {
    setShowUrgentOnly(checked)
    onFilterChange(checked, selectedTypes)
  }

  const handleTypeToggle = (type: string, checked: boolean) => {
    const newTypes = checked ? [...selectedTypes, type] : selectedTypes.filter((t) => t !== type)

    setSelectedTypes(newTypes)
    onFilterChange(showUrgentOnly, newTypes)
  }

  const clearFilters = () => {
    setShowUrgentOnly(false)
    setSelectedTypes([])
    onFilterChange(false, [])
  }

  const hasActiveFilters = showUrgentOnly || selectedTypes.length > 0
  const activeFilterCount = (showUrgentOnly ? 1 : 0) + selectedTypes.length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full md:w-auto relative ${hasActiveFilters ? "border-teal-500 bg-teal-50" : ""}`}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filter Appointments</h4>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>

          {/* Urgent Filter */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="urgent" checked={showUrgentOnly} onCheckedChange={handleUrgentToggle} />
              <label htmlFor="urgent" className="text-sm font-medium flex items-center cursor-pointer">
                <AlertTriangle className="mr-1 h-4 w-4 text-red-500" />
                Show urgent only (Emergency)
              </label>
            </div>
            <p className="text-xs text-gray-500 ml-6">
              Only show emergency appointments that require immediate attention
            </p>
          </div>

          {/* Type Filters */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-700">Appointment Types</h5>
            <div className="space-y-2">
              {appointmentTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.value}
                    checked={selectedTypes.includes(type.value)}
                    onCheckedChange={(checked) => handleTypeToggle(type.value, checked as boolean)}
                  />
                  <label htmlFor={type.value} className={`text-sm cursor-pointer ${type.color}`}>
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">Select specific appointment types to filter by</p>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-gray-200">
              <h6 className="text-xs font-medium text-gray-600 mb-2">Active Filters:</h6>
              <div className="flex flex-wrap gap-1">
                {showUrgentOnly && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Urgent Only
                  </span>
                )}
                {selectedTypes.map((type) => {
                  const typeInfo = appointmentTypes.find((t) => t.value === type)
                  return (
                    <span
                      key={type}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
                    >
                      {typeInfo?.label}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
