"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Save, X } from "lucide-react"
import type { MedicalRecord, CreateMedicalRecordRequest } from "@/types/medical-record"
import { Patient } from "@/types/patient"

interface CreateMedicalRecordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
  onRecordCreated: (record: MedicalRecord) => void
}

export function CreateMedicalRecordDialog({
  open,
  onOpenChange,
  patient,
  onRecordCreated,
}: CreateMedicalRecordDialogProps) {
  const [formData, setFormData] = useState<CreateMedicalRecordRequest>({
    patientID: "",
    doctorID: "550e8400-e29b-41d4-a716-446655440001", // Default doctor ID
    diagnosis: "",
    treatment: "",
    description: "",
    visitType: "Regular Checkup",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update patient ID when patient changes
  useEffect(() => {
    if (patient) {
      setFormData((prev) => ({ ...prev, patientID: patient.userId }))
    }
  }, [patient])

  const handleInputChange = (field: keyof CreateMedicalRecordRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patient) return

    setIsSubmitting(true)
    try {
      setFormData({
        patientID: patient.userId,
        doctorID: "550e8400-e29b-41d4-a716-446655440001",
        diagnosis: "",
        treatment: "",
        description: "",
        visitType: "Regular Checkup",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating medical record:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      patientID: patient?.userId || "",
      doctorID: "550e8400-e29b-41d4-a716-446655440001",
      diagnosis: "",
      treatment: "",
      description: "",
      visitType: "Regular Checkup",
    })
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
                  <Label className="text-sm font-medium">Patient Name</Label>
                  <Input value={patient?.name} className="bg-gray-50 mt-2" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Patient ID</Label>
                  <Input value={patient?.userId} className="bg-gray-50 mt-2" />
                </div>
              </div>
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
                    <SelectItem value="Regular Checkup">Regular Checkup</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
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
              disabled={isSubmitting || !formData.diagnosis || !formData.treatment || !formData.description}
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
