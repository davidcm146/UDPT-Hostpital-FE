"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Phone } from "lucide-react"
import type { Patient } from "@/types/patient"
import { useState } from "react"

interface PatientListProps {
  patients: Patient[]
  selectedPatient: Patient | null
  editingPatient?: Patient | null
  onSelectPatient: (patient: Patient) => void
  onEditPatient: (patient: Patient) => void
  itemsPerPage?: number
}

export function PatientList({
  patients,
  selectedPatient,
  editingPatient = null,
  onSelectPatient,
  onEditPatient,
  itemsPerPage = 5,
}: PatientListProps) {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage)

  // Load more handler (chỉ load thêm tối đa 3 patient mỗi lần)
  const handleViewMore = () => {
    const remaining = patients.length - visibleCount
    const loadCount = Math.min(3, remaining)
    setVisibleCount((prev) => prev + loadCount)
  }

  const getCardStyle = (patient: Patient) => {
    const isSelected = selectedPatient?.id === patient.id
    const isEditing = editingPatient?.id === patient.id
    if (isSelected && isEditing) {
      return "bg-amber-50 border-amber-300 ring-2 ring-amber-300"
    } else if (isEditing) {
      return "bg-amber-50 border-amber-300"
    } else if (isSelected) {
      return "bg-blue-50 border-blue-200"
    } else {
      return "hover:bg-gray-50"
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Patient List</h3>
      <div className="space-y-3 mb-4">
        {patients.slice(0, visibleCount).map((patient) => (
          <Card
            key={patient.id}
            className={`cursor-pointer transition-all ${getCardStyle(patient)}`}
            onClick={() => onSelectPatient(patient)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{patient.name}</h4>
                  <p className="text-sm text-gray-500">Patient ID: {patient.id}</p>
                  <div className="flex items-center mt-1">
                    <Phone className="h-3 w-3 mr-1 text-gray-400" />
                    <span className="text-sm text-gray-600">{patient.phoneNumber}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={editingPatient?.id === patient.id ? "default" : "outline"}
                  className={editingPatient?.id === patient.id ? "bg-amber-500 hover:bg-amber-600" : ""}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditPatient(patient)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              {editingPatient?.id === patient.id && (
                <div className="mt-2 text-xs text-amber-600 font-medium flex items-center">
                  <Edit className="h-3 w-3 mr-1" /> Currently editing
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {/* View More button */}
      {visibleCount < patients.length && (
        <div className="flex justify-center mt-4">
          <Button onClick={handleViewMore} variant="outline">
            View More
          </Button>
        </div>
      )}
      {/* Info text */}
      {patients.length > 0 && (
        <div className="text-sm text-gray-500 mt-2 text-center">
          Showing {Math.min(visibleCount, patients.length)} of {patients.length} patients
        </div>
      )}
    </div>
  )
}
