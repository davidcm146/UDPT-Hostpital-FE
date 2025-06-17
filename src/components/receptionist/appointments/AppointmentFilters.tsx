"use client"

import { Button } from "@/components/ui/button"
import { Filter, CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { AppointmentSearch } from "./AppointmentSearch"
import { formatDate } from "@/lib/DateTimeUtils"

interface AppointmentFiltersProps {
  searchTerm: string
  selectedDate: Date | string | undefined
  onSearchChange: (search: string) => void
  onDateChange: (date: Date | undefined) => void
  onFilterChange: (showUrgentOnly: boolean, appointmentStatuses: string[], appointmentTypes: string[]) => void
}

export function AppointmentFilters({
  searchTerm,
  selectedDate,
  onSearchChange,
  onDateChange,
  onFilterChange,
}: AppointmentFiltersProps) {
  const [showUrgentOnly, setShowUrgentOnly] = useState(false)
  const [appointmentStatuses, setAppointmentStatuses] = useState<string[]>([])
  const [appointmentTypes, setAppointmentTypes] = useState<string[]>([])

  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange(showUrgentOnly, appointmentStatuses, appointmentTypes)
  }, [showUrgentOnly, appointmentStatuses, appointmentTypes, onFilterChange])

  // Active filters count
  const activeFilterCount =
    (showUrgentOnly ? 1 : 0) + appointmentStatuses.length + appointmentTypes.length + (selectedDate ? 1 : 0)

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      {/* Search Input */}
      <AppointmentSearch searchTerm={searchTerm} onSearchChange={onSearchChange} />

      {/* Date Filter with Calendar */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full md:w-[240px] justify-start text-left font-normal bg-white",
              !selectedDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? formatDate(selectedDate) : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate ? (typeof selectedDate === "string" ? new Date(selectedDate) : selectedDate) : undefined}
            onSelect={(date) => onDateChange(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

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
          <DropdownMenuCheckboxItem checked={showUrgentOnly} onCheckedChange={setShowUrgentOnly}>
            Urgent Appointments Only
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {["PENDING", "CONFIRMED", "CANCELLED"].map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={appointmentStatuses.includes(status)}
              onCheckedChange={(checked) =>
                setAppointmentStatuses((prev) => (checked ? [...prev, status] : prev.filter((s) => s !== status)))
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Appointment Type</DropdownMenuLabel>
          {["EMERGENCY", "CHECKUP", "FOLLOW-UP"].map((type) => (
            <DropdownMenuCheckboxItem
              key={type}
              checked={appointmentTypes.includes(type)}
              onCheckedChange={(checked) =>
                setAppointmentTypes((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)))
              }
            >
              {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator />
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                setShowUrgentOnly(false)
                setAppointmentStatuses([])
                setAppointmentTypes([])
                onDateChange(undefined)
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
