import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, Search, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect, useCallback, useRef } from "react"
import type { MedicalRecord } from "@/types/medical-record"

interface MedicalRecordFiltersProps {
  searchTerm: string
  onSearchChange: (search: string) => void
  onFilterChange: (visitTypes: string[], dateRange: string) => void
  isLoading?: boolean
}

export function MedicalRecordFilters({
  searchTerm,
  onSearchChange,
  onFilterChange,
  isLoading = false,
}: MedicalRecordFiltersProps) {
  const [selectedVisitTypes, setSelectedVisitTypes] = useState<string[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState("")
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const [isSearching, setIsSearching] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced search with better loading state management
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Only show searching state if there's actual content being searched
    if (localSearchTerm.trim() !== searchTerm.trim()) {
      setIsSearching(true)

      debounceTimerRef.current = setTimeout(() => {
        onSearchChange(localSearchTerm.trim())
        setIsSearching(false)
      }, 300)
    } else {
      setIsSearching(false)
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [localSearchTerm, onSearchChange, searchTerm])

  // Sync local search with prop when it changes externally (but don't trigger searching state)
  useEffect(() => {
    if (searchTerm !== localSearchTerm) {
      setLocalSearchTerm(searchTerm)
      setIsSearching(false)
    }
  }, [searchTerm])

  // Stable filter change handler
  const handleFilterChange = useCallback(() => {
    onFilterChange(selectedVisitTypes, selectedDateRange)
  }, [selectedVisitTypes, selectedDateRange, onFilterChange])

  // Notify parent component when filters change
  useEffect(() => {
    handleFilterChange()
  }, [selectedVisitTypes, selectedDateRange, handleFilterChange])

  // Calculate number of active filters
  const activeFilterCount = selectedVisitTypes.length + (selectedDateRange ? 1 : 0)

  const visitTypes: MedicalRecord["visitType"][] = ["CHECKUP", "FOLLOW_UP", "EMERGENCY", "CONSULTATION"]

  const handleVisitTypeChange = (type: string, checked: boolean) => {
    setSelectedVisitTypes((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)))
  }

  const clearAllFilters = () => {
    setSelectedVisitTypes([])
    setSelectedDateRange("")
    setLocalSearchTerm("")
    setIsSearching(false)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    onSearchChange("")
  }

  const clearSearch = () => {
    setLocalSearchTerm("")
    setIsSearching(false)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    onSearchChange("")
  }

  // Don't disable input during general loading, only during filter operations
  const shouldDisableFilters = isLoading && (selectedVisitTypes.length > 0 || selectedDateRange !== "")

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      {/* Search Input */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by doctor name, diagnosis, or treatment..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="pl-10 pr-10 bg-white"
          // Don't disable search input during loading
        />
        {/* Clear search button */}
        {localSearchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
            onClick={clearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {/* Search indicator */}
        {isSearching && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
          </div>
        )}
      </div>

      {/* Advanced Filters Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto relative bg-white" disabled={shouldDisableFilters}>
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
              onCheckedChange={(checked) => handleVisitTypeChange(type, checked)}
              disabled={shouldDisableFilters}
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
              onClick={clearAllFilters}
              disabled={shouldDisableFilters}
            >
              Clear All Filters
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
