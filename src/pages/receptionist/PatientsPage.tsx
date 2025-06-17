"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { PatientSearch } from "@/components/receptionist/patients/PatientSearch"
import { PatientList } from "@/components/receptionist/patients/PatientList"
import { PatientDetails } from "@/components/receptionist/patients/PatientDetails"
import { PatientEditForm } from "@/components/receptionist/patients/PatientEditForm"
import type { Patient } from "@/types/patient"
import { mockPatients } from "@/data/patient"

const ReceptionistPatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsEditing(true)
  }

  const handleSavePatient = (updatedPatient: Patient) => {
    setPatients(patients.map((p) => (p.userId === updatedPatient.userId ? updatedPatient : p)))
    setSelectedPatient(updatedPatient)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
        <p className="text-gray-600">Update and manage patient records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Patient Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <PatientSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>

          {isEditing && selectedPatient && (
            <div className="mb-6">
              <PatientEditForm
                patient={selectedPatient}
                onSave={handleSavePatient}
                onCancel={handleCancelEdit}
              />
            </div>
          )}

          {!isEditing && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PatientList
                patients={filteredPatients}
                selectedPatient={selectedPatient}
                onSelectPatient={setSelectedPatient}
                onEditPatient={handleEditPatient}
              />
              <PatientDetails
                patient={selectedPatient}
                onEditPatient={handleEditPatient}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ReceptionistPatientsPage
