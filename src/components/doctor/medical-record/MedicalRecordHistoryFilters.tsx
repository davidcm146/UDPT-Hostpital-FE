"use client"

import type React from "react"

import { useState } from "react"
import { Check, ChevronDown, Filter, X, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export type MedicalRecordFilterState = {
  search: string
  status: string[]
  visitType: string[]
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  patientName: string
  diagnosis: string
}

interface MedicalRecordHistoryFiltersProps {
  filters: MedicalRecordFilterState
  setFilters: (filters: MedicalRecordFilterState) => void
  onReset: () => void
}

export function MedicalRecordHistoryFilters({ filters, setFilters, onReset }: MedicalRecordHistoryFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search)
  const [patientNameValue, setPatientNameValue] = useState(filters.patientName)
  const [diagnosisValue, setDiagnosisValue] = useState(filters.diagnosis)
  const [dateOpen, setDateOpen] = useState(false)

  const visitTypeOptions = [
    { value: "Regular Checkup", label: "Regular Checkup" },
    { value: "Follow-up", label: "Follow-up" },
    { value: "Emergency", label: "Emergency" },
    { value: "Consultation", label: "Consultation" },
  ]

  // Count active filters
  const activeFilterCount =
    (filters.visitType.length > 0 ? 1 : 0) +
    (filters.dateRange.from || filters.dateRange.to ? 1 : 0) +
    (filters.search ? 1 : 0) +
    (filters.patientName ? 1 : 0) +
    (filters.diagnosis ? 1 : 0)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ ...filters, search: searchValue })
  }

  const handlePatientNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ ...filters, patientName: patientNameValue })
  }

  const handleDiagnosisSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ ...filters, diagnosis: diagnosisValue })
  }

  const toggleStatus = (value: string) => {
    setFilters({
      ...filters,
      status: filters.status.includes(value) ? filters.status.filter((s) => s !== value) : [...filters.status, value],
    })
  }

  const toggleVisitType = (value: string) => {
    setFilters({
      ...filters,
      visitType: filters.visitType.includes(value)
        ? filters.visitType.filter((t) => t !== value)
        : [...filters.visitType, value],
    })
  }

  const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    setFilters({
      ...filters,
      dateRange: {
        from: range?.from,
        to: range?.to,
      },
    })
  }

  const clearDateRange = () => {
    setFilters({
      ...filters,
      dateRange: { from: undefined, to: undefined },
    })
    setDateOpen(false)
  }

  const clearFilter = (type: keyof MedicalRecordFilterState) => {
    if (type === "dateRange") {
      setFilters({
        ...filters,
        dateRange: { from: undefined, to: undefined },
      })
    } else if (type === "search") {
      setSearchValue("")
      setFilters({
        ...filters,
        search: "",
      })
    } else if (type === "patientName") {
      setPatientNameValue("")
      setFilters({
        ...filters,
        patientName: "",
      })
    } else if (type === "diagnosis") {
      setDiagnosisValue("")
      setFilters({
        ...filters,
        diagnosis: "",
      })
    } else {
      setFilters({
        ...filters,
        [type]: [],
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* General Search */}
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Input
              placeholder="Search records..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-3 pr-10"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => clearFilter("search")}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Button type="submit" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Patient Name Search */}
        <form onSubmit={handlePatientNameSubmit}>
          <div className="relative">
            <Input
              placeholder="Search by patient name..."
              value={patientNameValue}
              onChange={(e) => setPatientNameValue(e.target.value)}
              className="pl-3 pr-10"
            />
            {patientNameValue && (
              <button
                type="button"
                onClick={() => clearFilter("patientName")}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Button type="submit" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Diagnosis Search */}
        <form onSubmit={handleDiagnosisSubmit}>
          <div className="relative">
            <Input
              placeholder="Search by diagnosis..."
              value={diagnosisValue}
              onChange={(e) => setDiagnosisValue(e.target.value)}
              className="pl-3 pr-10"
            />
            {diagnosisValue && (
              <button
                type="button"
                onClick={() => clearFilter("diagnosis")}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Button type="submit" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Visit Type Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-dashed">
              Visit Type
              {filters.visitType.length > 0 && (
                <Badge variant="secondary" className="ml-2 rounded-sm px-1">
                  {filters.visitType.length}
                </Badge>
              )}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-0" align="start">
            <Command>
              <CommandInput placeholder="Filter visit types..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {visitTypeOptions.map((option) => {
                    const isSelected = filters.visitType.includes(option.value)
                    return (
                      <CommandItem key={option.value} onSelect={() => toggleVisitType(option.value)}>
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                          )}
                        >
                          <Check className="h-3 w-3" />
                        </div>
                        <span>{option.label}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                {filters.visitType.length > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem onSelect={() => clearFilter("visitType")} className="justify-center text-center">
                        Clear filters
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Date Range Filter */}
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-dashed">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Date Range
              {(filters.dateRange.from || filters.dateRange.to) && (
                <Badge variant="secondary" className="ml-2 rounded-sm px-1">
                  1
                </Badge>
              )}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.dateRange.from}
              selected={{
                from: filters.dateRange.from,
                to: filters.dateRange.to,
              }}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
            <div className="flex items-center justify-between p-3 border-t">
              <div className="text-sm text-muted-foreground">
                {filters.dateRange.from && filters.dateRange.to ? (
                  <>
                    {filters.dateRange.from.toLocaleDateString()} - {filters.dateRange.to.toLocaleDateString()}
                  </>
                ) : filters.dateRange.from ? (
                  <>From {filters.dateRange.from.toLocaleDateString()}</>
                ) : filters.dateRange.to ? (
                  <>Until {filters.dateRange.to.toLocaleDateString()}</>
                ) : (
                  "Select a date range"
                )}
              </div>
              {(filters.dateRange.from || filters.dateRange.to) && (
                <Button variant="ghost" size="sm" onClick={clearDateRange}>
                  Clear
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">Active filters:</div>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{filters.search}"
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("search")} />
              </Badge>
            )}
            {filters.patientName && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Patient: "{filters.patientName}"
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("patientName")} />
              </Badge>
            )}
            {filters.diagnosis && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Diagnosis: "{filters.diagnosis}"
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("diagnosis")} />
              </Badge>
            )}
            {filters.visitType.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Visit Type: {filters.visitType.length}
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("visitType")} />
              </Badge>
            )}
            {(filters.dateRange.from || filters.dateRange.to) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Date Range
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("dateRange")} />
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={onReset} className="h-7 px-2 text-xs">
              Reset all
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
