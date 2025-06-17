import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Ruler, Weight, Activity } from "lucide-react"
import type { Patient } from "@/types/patient"
import { calculateBMI, getBMICategory } from "@/data/patient"
import { formatHeight, formatWeight } from "@/lib/PatientUtils"

interface VitalStatisticsProps {
  patientData: Patient
  isEditing: boolean
  onChange: (data: Patient) => void
}

export function VitalStatistics({ patientData, isEditing, onChange }: VitalStatisticsProps) {
  const bmi = patientData.weight ? calculateBMI(patientData.height, patientData.weight) : 0
  const bmiCategory = bmi > 0 ? getBMICategory(bmi) : "Unknown"

  const handleFieldChange = (field: keyof Patient, value: any) => {
    onChange({ ...patientData, [field]: value })
  }

  const getBMIColor = (category: string) => {
    switch (category) {
      case "Underweight":
        return "bg-blue-100 text-blue-800"
      case "Normal weight":
        return "bg-green-100 text-green-800"
      case "Overweight":
        return "bg-yellow-100 text-yellow-800"
      case "Obese":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vital Statistics</CardTitle>
        <CardDescription>Physical measurements and vital signs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Height */}
          <div>
            <Label htmlFor="height">Height</Label>
            {isEditing ? (
              <Input
                id="height"
                type="number"
                value={patientData.height}
                placeholder="cm"
                onChange={(e) => handleFieldChange("height", Number(e.target.value))}
              />
            ) : (
              <div className="flex items-center mt-1">
                <Ruler className="h-4 w-4 text-gray-400 mr-2" />
                <span>{formatHeight(patientData.height)}</span>
              </div>
            )}
          </div>

          {/* Weight */}
          <div>
            <Label htmlFor="weight">Weight</Label>
            {isEditing ? (
              <Input
                id="weight"
                type="number"
                value={patientData.weight}
                placeholder="kg"
                onChange={(e) => handleFieldChange("weight", Number(e.target.value))}
              />
            ) : (
              <div className="flex items-center mt-1">
                <Weight className="h-4 w-4 text-gray-400 mr-2" />
                <span>{patientData.weight && formatWeight(patientData.weight)}</span>
              </div>
            )}
          </div>

          {/* BMI */}
          <div>
            <Label htmlFor="bmi">BMI</Label>
            <div className="flex items-center mt-1">
              <Activity className="h-4 w-4 text-gray-400 mr-2" />
              <span className="mr-2">{bmi > 0 ? bmi : "N/A"}</span>
              {bmi > 0 && <Badge className={getBMIColor(bmiCategory)}>{bmiCategory}</Badge>}
            </div>
          </div>
        </div>

        {/* Blood Type */}
        <div className="mt-4">
          <Label htmlFor="bloodType">Blood Type</Label>
          {isEditing ? (
            <select
              id="bloodType"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={patientData.bloodType}
              onChange={(e) => handleFieldChange("bloodType", e.target.value)}
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
          ) : (
            <div className="flex items-center mt-1">
              <span className="text-red-600 font-bold text-lg mr-2">{patientData.bloodType}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
