"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Phone } from "lucide-react"
import type { Patient } from "@/types/patient"

interface PatientListProps {
  patients: Patient[]
  selectedPatient: Patient | null
  onSelectPatient: (patient: Patient) => void
  onEditPatient: (patient: Patient) => void
}

export function PatientList({ patients, selectedPatient, onSelectPatient, onEditPatient }: PatientListProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Patient List</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {patients.map((patient) => (
          <Card
            key={patient.patientID}
            className={`cursor-pointer transition-colors ${
              selectedPatient?.patientID === patient.patientID ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
            }`}
            onClick={() => onSelectPatient(patient)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{patient.name}</h4>
                  <p className="text-sm text-gray-500">Patient ID: {patient.patientID}</p>
                  <div className="flex items-center mt-1">
                    <Phone className="h-3 w-3 mr-1 text-gray-400" />
                    <span className="text-sm text-gray-600">{patient.phone}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditPatient(patient)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
