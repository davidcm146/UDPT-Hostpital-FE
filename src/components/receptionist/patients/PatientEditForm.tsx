import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, X } from "lucide-react"
import type { Patient } from "@/types/patient"
import { calculateBMI, getBMICategory } from "@/data/patient"

interface PatientEditFormProps {
  patient: Patient
  onSave: (patient: Patient) => void
  onCancel: () => void
}

export function PatientEditForm({ patient, onSave, onCancel }: PatientEditFormProps) {
  const [editForm, setEditForm] = useState<Patient>({ ...patient })
  const [bmi, setBmi] = useState<number | null>(
    patient.height && patient.weight ? calculateBMI(patient.height, patient.weight) : null,
  )

  const handleInputChange = (field: keyof Patient, value: any) => {
    setEditForm({ ...editForm, [field]: value })

    // Recalculate BMI if height or weight changes
    if (field === "height" || field === "weight") {
      const height = field === "height" ? Number(value) : editForm.height
      const weight = field === "weight" ? Number(value) : editForm.weight

      if (height && weight) {
        setBmi(calculateBMI(height, weight))
      }
    }
  }

  const handleSave = () => {
    onSave(editForm)
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Edit Patient Information
          <div className="space-x-2">
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={editForm.name} onChange={(e) => handleInputChange("name", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={editForm.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={
                    editForm.dateOfBirth instanceof Date
                      ? editForm.dateOfBirth.toISOString().slice(0, 10)
                      : editForm.dateOfBirth || ""
                  }
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={editForm.age}
                  onChange={(e) => handleInputChange("age", Number.parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editForm.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Physical Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Physical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={editForm.height || ""}
                  onChange={(e) => handleInputChange("height", Number.parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={editForm.weight || ""}
                  onChange={(e) => handleInputChange("weight", Number.parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="bloodType">Blood Type</Label>
                <select
                  id="bloodType"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editForm.bloodType}
                  onChange={(e) => handleInputChange("bloodType", e.target.value)}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
            </div>

            {bmi && (
              <div className="mt-2 p-2 bg-gray-50 rounded-md">
                <span className="text-sm">BMI: </span>
                <span
                  className={`font-medium ${
                    getBMICategory(bmi) === "Normal weight"
                      ? "text-green-600"
                      : getBMICategory(bmi) === "Underweight"
                        ? "text-yellow-600"
                        : getBMICategory(bmi) === "Overweight"
                          ? "text-orange-600"
                          : "text-red-600"
                  }`}
                >
                  {bmi} ({getBMICategory(bmi)})
                </span>
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={editForm.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows={2}
            />
          </div>

          {/* Medical Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Medical Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Input
                  id="allergies"
                  value={editForm.allergies}
                  onChange={(e) => handleInputChange("allergies", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="pastIllness">Past Illness</Label>
                <Textarea
                  id="pastIllness"
                  value={editForm.pastIllness || ""}
                  onChange={(e) => handleInputChange("pastIllness", e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Textarea
                  id="currentMedications"
                  value={editForm.currentMedications || ""}
                  onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                <Input
                  id="chronicConditions"
                  value={editForm.chronicConditions || ""}
                  onChange={(e) => handleInputChange("chronicConditions", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  value={editForm.emergencyContactName || ""}
                  onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  value={editForm.emergencyContactPhone || ""}
                  onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Insurance Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Insurance Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Input
                  id="insuranceProvider"
                  value={editForm.insuranceProvider || ""}
                  onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                <Input
                  id="insurancePolicyNumber"
                  value={editForm.insurancePolicyNumber || ""}
                  onChange={(e) => handleInputChange("insurancePolicyNumber", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
