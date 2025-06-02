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

interface PatientFiltersProps {
  filters: {
    showUrgentOnly: boolean
    genderFilter: string[]
    conditionFilter: string[]
    ageRange: string
    bloodTypeFilter: string[]
  }
  onFilterChange: (
    filterType: "showUrgentOnly" | "genderFilter" | "conditionFilter" | "ageRange" | "bloodTypeFilter",
    value: boolean | string[] | string,
  ) => void
}

export function PatientFilters({ filters, onFilterChange }: PatientFiltersProps) {
  const toggleGenderFilter = (gender: string) => {
    if (filters.genderFilter.includes(gender)) {
      onFilterChange(
        "genderFilter",
        filters.genderFilter.filter((g) => g !== gender),
      )
    } else {
      onFilterChange("genderFilter", [...filters.genderFilter, gender])
    }
  }

  const toggleConditionFilter = (condition: string) => {
    if (filters.conditionFilter.includes(condition)) {
      onFilterChange(
        "conditionFilter",
        filters.conditionFilter.filter((c) => c !== condition),
      )
    } else {
      onFilterChange("conditionFilter", [...filters.conditionFilter, condition])
    }
  }

  const toggleBloodTypeFilter = (bloodType: string) => {
    if (filters.bloodTypeFilter.includes(bloodType)) {
      onFilterChange(
        "bloodTypeFilter",
        filters.bloodTypeFilter.filter((bt) => bt !== bloodType),
      )
    } else {
      onFilterChange("bloodTypeFilter", [...filters.bloodTypeFilter, bloodType])
    }
  }

  // Count active filters to show in the button
  const activeFilterCount =
    (filters.showUrgentOnly ? 1 : 0) +
    filters.genderFilter.length +
    filters.conditionFilter.length +
    (filters.ageRange !== "all" ? 1 : 0) +
    filters.bloodTypeFilter.length

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
        <DropdownMenuCheckboxItem
          checked={filters.showUrgentOnly}
          onCheckedChange={(checked) => onFilterChange("showUrgentOnly", checked)}
        >
          Urgent Cases Only
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />

        <DropdownMenuLabel>Gender</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={filters.genderFilter.includes("Male")}
          onCheckedChange={() => toggleGenderFilter("Male")}
        >
          Male
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.genderFilter.includes("Female")}
          onCheckedChange={() => toggleGenderFilter("Female")}
        >
          Female
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Age Range</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={filters.ageRange === "0-18"}
          onCheckedChange={() => onFilterChange("ageRange", filters.ageRange === "0-18" ? "all" : "0-18")}
        >
          0-18 years
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.ageRange === "19-35"}
          onCheckedChange={() => onFilterChange("ageRange", filters.ageRange === "19-35" ? "all" : "19-35")}
        >
          19-35 years
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.ageRange === "36-55"}
          onCheckedChange={() => onFilterChange("ageRange", filters.ageRange === "36-55" ? "all" : "36-55")}
        >
          36-55 years
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.ageRange === "56+"}
          onCheckedChange={() => onFilterChange("ageRange", filters.ageRange === "56+" ? "all" : "56+")}
        >
          56+ years
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Blood Type</DropdownMenuLabel>
        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bloodType) => (
          <DropdownMenuCheckboxItem
            key={bloodType}
            checked={filters.bloodTypeFilter.includes(bloodType)}
            onCheckedChange={() => toggleBloodTypeFilter(bloodType)}
          >
            {bloodType}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Medical Conditions</DropdownMenuLabel>
        {["Hypertension", "Diabetes", "Asthma", "Arthritis", "Migraine", "COPD", "Heart Disease"].map((condition) => (
          <DropdownMenuCheckboxItem
            key={condition}
            checked={filters.conditionFilter.includes(condition)}
            onCheckedChange={() => toggleConditionFilter(condition)}
          >
            {condition}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
