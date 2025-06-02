"use client"

import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"

interface AppointmentConfirmationFiltersProps {
  onFilterChange: (showUrgentOnly: boolean, appointmentTypes: string[]) => void
}

export function AppointmentConfirmationFilters({ onFilterChange }: AppointmentConfirmationFiltersProps) {
  const [showUrgentOnly, setShowUrgentOnly] = useState(false)
  const [appointmentTypes, setAppointmentTypes] = useState<string[]>([])

  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange(showUrgentOnly, appointmentTypes)
  }, [showUrgentOnly, appointmentTypes, onFilterChange])

  // Calculate number of active filters
  const activeFilterCount = (showUrgentOnly ? 1 : 0) + appointmentTypes.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto relative">
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
        <DropdownMenuCheckboxItem checked={showUrgentOnly} onCheckedChange={setShowUrgentOnly}>
          Urgent Requests Only
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Appointment Type</DropdownMenuLabel>
        {["Follow-up", "Consultation", "Check-up", "Emergency"].map((type) => (
          <DropdownMenuCheckboxItem
            key={type}
            checked={appointmentTypes.includes(type)}
            onCheckedChange={(checked) => {
              setAppointmentTypes((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)))
            }}
          >
            {type}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
