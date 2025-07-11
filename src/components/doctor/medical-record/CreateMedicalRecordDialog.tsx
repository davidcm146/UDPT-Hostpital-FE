import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Save, X, Loader2 } from "lucide-react"
import type { MedicalRecord, CreateMedicalRecordRequest } from "@/types/medical-record"
import type { Appointment } from "@/types/appointment"
import { AppointmentService } from "@/services/appointmentService"
import { MedicalRecordService } from "@/services/medicalRecordService"
import { toast } from "react-toastify"
import { useAuth } from "@/hooks/AuthContext"

interface CreateMedicalRecordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRecordCreated: (record: MedicalRecord) => void
}

interface PatientOption {
  id: string
  name: string
}

export function CreateMedicalRecordDialog({ open, onOpenChange, onRecordCreated }: CreateMedicalRecordDialogProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateMedicalRecordRequest>({
    patientId: "",
    doctorId: user?.sub as string, // Default doctor ID
    diagnosis: "",
    treatment: "",
    description: "",
    visitType: "CHECKUP",
    visitDate: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [patients, setPatients] = useState<PatientOption[]>([])
  const [isLoadingPatients, setIsLoadingPatients] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<PatientOption | null>(null)

  // Fetch patients from appointments when dialog opens
  useEffect(() => {
    if (open) {
      fetchPatients()
    }
  }, [open])

  const fetchPatients = async () => {
    setIsLoadingPatients(true)
    try {
      const response = await AppointmentService.getAppointments({
        doctorId: formData.doctorId,
      })

      // Extract unique patients from appointments
      const uniquePatients = new Map<string, PatientOption>()

      response.data.forEach((appointment: Appointment) => {
        if (appointment.patientId && !uniquePatients.has(appointment.patientId)) {
          uniquePatients.set(appointment.patientId, {
            id: appointment.patientId,
            name: appointment.patientName || "Invalid name",
          })
        }
      })

      const patientList = Array.from(uniquePatients.values())
      setPatients(patientList)
    } catch (error) {
      console.error("Error fetching patients:", error)
      setPatients([])
    } finally {
      setIsLoadingPatients(false)
    }
  }

  const handleInputChange = (field: keyof CreateMedicalRecordRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePatientSelect = (patientId: string) => {
    const selected = patients.find((p) => p.id === patientId)
    if (selected) {
      setSelectedPatient(selected)
      setFormData((prev) => ({ ...prev, patientId: patientId }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient) {
      toast.error("Please select a patient")
      return
    }

    if (!formData.diagnosis.trim() || !formData.treatment.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      // Prepare the payload for the API
      const payload: CreateMedicalRecordRequest = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        visitType: formData.visitType,
        diagnosis: formData.diagnosis.trim(),
        treatment: formData.treatment.trim(),
        description: formData.description.trim(),
        visitDate: formData.visitDate,
      }

      console.log("Creating medical record with payload:", payload)

      // Call the API to create the medical record
      const createdRecord = await MedicalRecordService.createMedicalRecord(payload)

      console.log("Medical record created successfully:", createdRecord)

      // Show success message
      toast.success(
        `Medical record created successfully!\n` +
          `Patient: ${createdRecord.patientName}\n` +
          `Diagnosis: ${createdRecord.diagnosis}\n` +
          `Visit Type: ${createdRecord.visitType}\n` +
          `Date: ${createdRecord.visitDate}`,
      )

      // Reset form after successful creation
      setFormData({
        patientId: "",
        doctorId: user?.sub as string,
        diagnosis: "",
        treatment: "",
        description: "",
        visitType: "CHECKUP",
        visitDate: new Date().toISOString().split("T")[0],
      })
      setSelectedPatient(null)

      // Close dialog and notify parent component
      onOpenChange(false)
      onRecordCreated(createdRecord)
    } catch (error) {
      console.error("Error creating medical record:", error)

      let errorMessage = "Failed to create medical record. Please try again."
      if (error instanceof Error) {
        if (error.message.includes("400")) {
          errorMessage = "Invalid data provided. Please check all fields and try again."
        } else if (error.message.includes("401")) {
          errorMessage = "You are not authorized to create medical records. Please log in again."
        } else if (error.message.includes("404")) {
          errorMessage = "Patient or doctor not found. Please refresh and try again."
        } else if (error.message.includes("500")) {
          errorMessage = "Server error occurred. Please try again later."
        } else {
          errorMessage = `Error: ${error.message}`
        }
      }

      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      patientId: "",
      doctorId: user?.sub as string,
      diagnosis: "",
      treatment: "",
      description: "",
      visitType: "CHECKUP",
      visitDate: new Date().toISOString().split("T")[0],
    })
    setSelectedPatient(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Create New Medical Record
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Select Patient *</Label>
                  {isLoadingPatients ? (
                    <div className="flex items-center mt-2 p-2 border rounded-md bg-gray-50">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm text-gray-600">Loading patients...</span>
                    </div>
                  ) : (
                    <Select value={selectedPatient?.id || ""} onValueChange={handlePatientSelect}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.length > 0 ? (
                          patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No patients found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">Patient ID</Label>
                  <Input value={selectedPatient?.id || ""} className="bg-gray-50 mt-2" disabled />
                </div>
              </div>
              {selectedPatient && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">
                    <strong>Selected:</strong> {selectedPatient.name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visit Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="visitType" className="text-sm font-medium">
                  Visit Type *
                </Label>
                <Select
                  value={formData.visitType}
                  onValueChange={(value) => handleInputChange("visitType", value as any)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select visit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHECKUP">Regular Checkup</SelectItem>
                    <SelectItem value="FOLLOW_UP">Follow-up</SelectItem>
                    <SelectItem value="EMERGENCY">Emergency</SelectItem>
                    <SelectItem value="CONSULTATION">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="visitDate" className="text-sm font-medium">
                  Visit Date *
                </Label>
                <Input
                  id="visitDate"
                  type="date"
                  value={formData.visitDate}
                  onChange={(e) => handleInputChange("visitDate", e.target.value)}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="diagnosis" className="text-sm font-medium">
                  Diagnosis *
                </Label>
                <Textarea
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                  placeholder="Enter primary diagnosis and any secondary conditions..."
                  className="mt-2 min-h-[80px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="treatment" className="text-sm font-medium">
                  Treatment Plan *
                </Label>
                <Textarea
                  id="treatment"
                  value={formData.treatment}
                  onChange={(e) => handleInputChange("treatment", e.target.value)}
                  placeholder="Describe the treatment plan, medications, procedures..."
                  className="mt-2 min-h-[80px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Visit Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Detailed description of the visit, symptoms, examination findings..."
                  className="mt-2 min-h-[100px]"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700"
              disabled={
                isSubmitting ||
                !selectedPatient ||
                !formData.diagnosis.trim() ||
                !formData.treatment.trim() ||
                !formData.description.trim() ||
                !formData.visitDate
              }
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
