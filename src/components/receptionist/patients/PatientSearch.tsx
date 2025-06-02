"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Search, Filter, UserPlus, X, CalendarIcon } from "lucide-react"

interface Patient {
  id: string
  name: string
  dob: Date
  gender: string
}

interface PatientSearchProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  placeholder?: string
}

export const PatientSearch: React.FC<PatientSearchProps> = ({ searchTerm, onSearchChange, placeholder }) => {
  const [patients, setPatients] = useState<Patient[]>([])

  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const handleClearSearch = () => {
    onSearchChange("")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={placeholder || "Search patients (name, phone number, patient ID)..."}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearSearch}
          disabled={!searchTerm}
          className="flex items-center gap-1 ml-2"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  )
}
