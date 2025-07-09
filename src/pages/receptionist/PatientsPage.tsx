"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { PatientSearch } from "@/components/receptionist/patients/PatientSearch"
import { PatientList } from "@/components/receptionist/patients/PatientList"
import { PatientDetails } from "@/components/receptionist/patients/PatientDetails"
import { PatientEditForm } from "@/components/receptionist/patients/PatientEditForm"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Patient } from "@/types/patient"
import { PatientService } from "@/services/patientService"
import { mockPatients } from "@/data/patient"
import { toast } from "react-toastify"

const ReceptionistPatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch patients from API
  const fetchPatients = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const fetchedPatients = await PatientService.getAllPatients()
      setPatients(fetchedPatients.length > 0 ? fetchedPatients : mockPatients)
    } catch (error) {
      console.error("Failed to fetch patients:", error)
      setError("Failed to load patients. Using offline data.")
      // Fallback to mock data if API fails
      setPatients(mockPatients)
    } finally {
      setIsLoading(false)
    }
  }

  // Load patients on component mount
  useEffect(() => {
    fetchPatients()
  }, [])

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.phoneNumber?.includes(searchTerm) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setEditingPatient(patient)
    setIsEditing(true)
  }

  const handleSavePatient = async (updatedPatient: Patient) => {
    setIsSaving(true)
    setError(null)

    try {
      // Call the API to update the patient
      const savedPatient = await PatientService.updatePatient(updatedPatient.id, updatedPatient)

      // Update local state with the updated patient
      // setPatients(patients.map((p) => (p.id === savedPatient.id ? savedPatient : p)))

      setSelectedPatient(savedPatient)
      setEditingPatient(null)
      setIsEditing(false)
      toast.success("Updated patient successfully!")
    } catch (error) {
      console.error("Failed to update patient:", error)
      setError("Failed to update patient. Changes saved locally only.")

      // Still update local state for better UX even if API fails
      setPatients(patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)))
      setSelectedPatient(updatedPatient)
      setEditingPatient(null)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditingPatient(null)
  }

  const handleRefresh = () => {
    fetchPatients()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600">Update and manage patient records</p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoading || isSaving}
          className="flex items-center gap-2 bg-transparent"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Patient Records
            {(isLoading || isSaving) && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
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
                editingPatient={editingPatient}
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
