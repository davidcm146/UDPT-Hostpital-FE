import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"

interface PatientStatisticsFiltersProps {
  onFilterChange: (filters: {
    ageGroup: string
    gender: string
    dateFrom: Date | undefined
    dateTo: Date | undefined
  }) => void
}

export function PatientStatisticsFilters({ onFilterChange }: PatientStatisticsFiltersProps) {
  const [ageGroup, setAgeGroup] = useState<string>("all")
  const [gender, setGender] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  // Helper function to apply filters
  const applyFilters = (newAgeGroup?: string, newGender?: string, newDateFrom?: Date, newDateTo?: Date) => {
    onFilterChange({
      ageGroup: newAgeGroup ?? ageGroup,
      gender: newGender ?? gender,
      dateFrom: newDateFrom ?? dateFrom,
      dateTo: newDateTo ?? dateTo,
    })
  }

  const handleAgeGroupChange = (value: string) => {
    setAgeGroup(value)
    applyFilters(value)
  }

  const handleGenderChange = (value: string) => {
    setGender(value)
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
    setAgeGroup("all")
    setGender("all")
    setDateFrom(undefined)
    setDateTo(undefined)
    onFilterChange({
      ageGroup: "all",
      gender: "all",
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
            <Label htmlFor="age-group">Age Group</Label>
            <Select value={ageGroup} onValueChange={handleAgeGroupChange}>
              <SelectTrigger id="age-group" className="w-full">
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="0-17">0-17 years</SelectItem>
                <SelectItem value="18-34">18-34 years</SelectItem>
                <SelectItem value="35-49">35-49 years</SelectItem>
                <SelectItem value="50-64">50-64 years</SelectItem>
                <SelectItem value="65+">65+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={handleGenderChange}>
              <SelectTrigger id="gender" className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
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
