"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { PatientSearch } from "@/components/receptionist/patients/PatientSearch"
import { PatientList } from "@/components/receptionist/patients/PatientList"
import { PatientDetails } from "@/components/receptionist/patients/PatientDetails"
import { PatientEditForm } from "@/components/receptionist/patients/PatientEditForm"
import type { Patient } from "@/types/patient"
import { mockPatientData } from "@/data/patient"

const ReceptionistPatientsPage = () => {
  // Create multiple patients based on the mock data
  const [patients, setPatients] = useState<Patient[]>([
    mockPatientData,
    {
      ...mockPatientData,
      patientID: "550e8400-e29b-41d4-a716-446655440998",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(555) 987-6543",
      gender: "Female",
      bloodType: "A+",
      dateOfBirth: "1990-08-12",
      age: 33,
      weight: 62,
      height: 165,
      allergies: "Sulfa drugs, Latex",
      pastIllness: "Tonsillectomy (2010)",
      insuranceProvider: "Aetna",
      insurancePolicyNumber: "AET-987654321",
    },
    {
      ...mockPatientData,
      patientID: "550e8400-e29b-41d4-a716-446655440997",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "(555) 456-7890",
      gender: "Male",
      bloodType: "B-",
      dateOfBirth: "1975-03-22",
      age: 49,
      weight: 88,
      height: 182,
      allergies: "None",
      pastIllness: "Appendectomy (2005), Knee surgery (2018)",
      chronicConditions: "Type 2 Diabetes",
      currentMedications: "Metformin 500mg twice daily",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.patientID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsEditing(true)
  }

  const handleSavePatient = (updatedPatient: Patient) => {
    setPatients(patients.map((p) => (p.patientID === updatedPatient.patientID ? updatedPatient : p)))
    setSelectedPatient(updatedPatient)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
          {/* Search Section */}
          <div className="mb-6">
            <PatientSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>

          {/* Edit Form */}
          {isEditing && selectedPatient && (
            <div className="mb-6">
              <PatientEditForm patient={selectedPatient} onSave={handleSavePatient} onCancel={handleCancelEdit} />
            </div>
          )}

          {/* Patient List and Details */}
          {!isEditing && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PatientList
                patients={filteredPatients}
                selectedPatient={selectedPatient}
                onSelectPatient={setSelectedPatient}
                onEditPatient={handleEditPatient}
              />
              <PatientDetails patient={selectedPatient} onEditPatient={handleEditPatient} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ReceptionistPatientsPage
