"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useEffect, useState, useCallback } from "react"

interface AppointmentFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedType: string
  onTypeChange: (value: string) => void
}

export const AppointmentFilters = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
}: AppointmentFiltersProps) => {
  const [inputValue, setInputValue] = useState(searchTerm)

  // Debounced search function
  const debouncedSearch = useCallback(
    (value: string) => {
      const timeoutId = setTimeout(() => {
        onSearchChange(value)
      }, 500) // 500ms delay

      return () => clearTimeout(timeoutId)
    },
    [onSearchChange],
  )

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
  }

  // Effect for debounced search
  useEffect(() => {
    const cleanup = debouncedSearch(inputValue)
    return cleanup
  }, [inputValue, debouncedSearch])

  // Sync with external searchTerm changes (if any)
  useEffect(() => {
    if (searchTerm !== inputValue) {
      setInputValue(searchTerm)
    }
  }, [searchTerm])

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white border rounded-xl shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search by doctor name, reason, or appointment details..."
          value={inputValue}
          onChange={handleInputChange}
          className="pl-10 h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      <div className="w-32">
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-lg">
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="EMERGENCY">Emergency</SelectItem>
            <SelectItem value="CHECKUP">Checkup</SelectItem>
            <SelectItem value="CONSULTATION">Consultation</SelectItem>
            <SelectItem value="FOLLOW-UP">Follow-up</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
