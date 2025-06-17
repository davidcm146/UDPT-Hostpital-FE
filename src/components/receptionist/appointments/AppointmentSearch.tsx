"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"

interface AppointmentSearchProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function AppointmentSearch({ searchTerm, onSearchChange }: AppointmentSearchProps) {
  return (
    <div className="flex gap-4 items-center w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by patient name, ID, or reason..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>
    </div>
  )
}
