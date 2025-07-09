import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, X } from "lucide-react"
import type { Patient } from "@/types/patient"
import { calculateBMI, getBMICategory } from "@/data/patient"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
                <Input id="name" className="mt-2" value={editForm.name} onChange={(e) => handleInputChange("name", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" className="mt-2" value={editForm.phoneNumber} onChange={(e) => handleInputChange("phoneNumber", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="mt-2"
                  value={editForm.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  className="mt-2"
                  value={
                    editForm.dob instanceof Date
                      ? editForm.dob.toISOString().slice(0, 10)
                      : editForm.dob || ""
                  }
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
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
                  className="mt-2"
                  value={editForm.height || ""}
                  onChange={(e) => handleInputChange("height", Number.parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  className="mt-2"
                  value={editForm.weight || ""}
                  onChange={(e) => handleInputChange("weight", Number.parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="bloodType">Blood Type</Label>
                <select
                  id="bloodType"
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
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
                  className={`font-medium ${getBMICategory(bmi) === "Normal weight"
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
              className="mt-2"
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
                  className="mt-2"
                  value={editForm.allergies}
                  onChange={(e) => handleInputChange("allergies", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="pastIllness">Past Illness</Label>
                <Textarea
                  id="pastIllness"
                  className="mt-2"
                  value={editForm.pastIllness || ""}
                  onChange={(e) => handleInputChange("pastIllness", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Life Factors</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="smokingStatus">Smoking Status</Label>
                <Select
                  value={editForm.smokingStatus || ""}
                  onValueChange={(value) => handleInputChange("smokingStatus", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Former">Former smoker</SelectItem>
                    <SelectItem value="Current">Current smoker</SelectItem>
                  </SelectContent>
                </Select>

              </div>

              <div>
                <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
                <Select
                  value={editForm.alcoholConsumption || ""}
                  onValueChange={(value) => handleInputChange("alcoholConsumption", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Occasional">Occasional</SelectItem>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Heavy">Heavy</SelectItem>
                  </SelectContent>
                </Select>

              </div>
            </div>
          </div>
        </div>
        <div className="space-x-2 mt-6 float-end">
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
      </CardContent>
    </Card>
  )
}
