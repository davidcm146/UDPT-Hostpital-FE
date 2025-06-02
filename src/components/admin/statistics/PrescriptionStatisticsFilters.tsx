"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { getMedicineCategories } from "@/data/medicine"

interface PrescriptionStatisticsFiltersProps {
  onFilterChange: (filters: {
    category: string
    doctorId: string
    dateFrom: Date | undefined
    dateTo: Date | undefined
  }) => void
}

export function PrescriptionStatisticsFilters({ onFilterChange }: PrescriptionStatisticsFiltersProps) {
  const [category, setCategory] = useState<string>("all")
  const [doctorId, setDoctorId] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  const medicineCategories = getMedicineCategories()

  // Helper function to apply current filters
  const applyFilters = (newCategory?: string, newDoctorId?: string, newDateFrom?: Date, newDateTo?: Date) => {
    onFilterChange({
      category: newCategory ?? category,
      doctorId: newDoctorId ?? doctorId,
      dateFrom: newDateFrom ?? dateFrom,
      dateTo: newDateTo ?? dateTo,
    })
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    applyFilters(value)
  }

  const handleDoctorChange = (value: string) => {
    setDoctorId(value)
    applyFilters(undefined, value)
  }

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date)
    applyFilters(undefined, undefined, date)
  }

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date)
    applyFilters(undefined, undefined, undefined, date)
  }

  const clearFilters = () => {
    setCategory("all")
    setDoctorId("all")
    setDateFrom(undefined)
    setDateTo(undefined)
    onFilterChange({
      category: "all",
      doctorId: "all",
      dateFrom: undefined,
      dateTo: undefined,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="medicine-category">Medicine Category</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger id="medicine-category" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {medicineCategories.map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor">Doctor</Label>
            <Select value={doctorId} onValueChange={handleDoctorChange}>
              <SelectTrigger id="doctor" className="w-full">
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                <SelectItem value="550e8400-e29b-41d4-a716-446655440001">Dr. Sarah Johnson</SelectItem>
                <SelectItem value="550e8400-e29b-41d4-a716-446655440002">Dr. Michael Chen</SelectItem>
                <SelectItem value="550e8400-e29b-41d4-a716-446655440003">Dr. Emily Rodriguez</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateFrom} onSelect={handleDateFromChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Date To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateTo} onSelect={handleDateToChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
