"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Search, X, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface AppointmentFiltersProps {
  searchTerm: string
  selectedDate: string
  onSearchChange: (value: string) => void
  onDateChange: (value: string) => void
}

export function AppointmentFilters({
  searchTerm,
  selectedDate,
  onSearchChange,
  onDateChange,
}: AppointmentFiltersProps) {
  const handleClearFilters = () => {
    onSearchChange("")
    onDateChange("")
  }

  const selectedDateObj = selectedDate ? new Date(selectedDate) : undefined

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(format(date, "yyyy-MM-dd"))
    } else {
      onDateChange("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by name, appointment ID, phone..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="date">Appointment Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-2",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDateObj!, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={selectedDateObj} onSelect={handleDateSelect} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          className="flex items-center gap-1"
          disabled={!searchTerm && !selectedDate}
        >
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      </div>
    </div>
  )
}
