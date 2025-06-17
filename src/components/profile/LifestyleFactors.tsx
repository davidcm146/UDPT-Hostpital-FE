import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Cigarette, Wine } from "lucide-react"
import type { Patient } from "@/types/patient"

interface LifestyleFactorsProps {
  patientData: Patient
  isEditing: boolean
  onChange: (data: Patient) => void
}

export function LifestyleFactors({ patientData, isEditing, onChange }: LifestyleFactorsProps) {
  const handleFieldChange = (field: keyof Patient, value: any) => {
    onChange({ ...patientData, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lifestyle Factors</CardTitle>
        <CardDescription>Smoking, alcohol consumption, and other lifestyle information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Smoking Status */}
          <div>
            <Label htmlFor="smokingStatus">Smoking Status</Label>
            {isEditing ? (
              <select
                id="smokingStatus"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={patientData.smokingStatus}
                onChange={(e) => handleFieldChange("smokingStatus", e.target.value)}
              >
                <option value="Never">Never</option>
                <option value="Former">Former</option>
                <option value="Current">Current</option>
              </select>
            ) : (
              <div className="flex items-center mt-1">
                <Cigarette className="h-4 w-4 text-gray-400 mr-2" />
                <span>{patientData.smokingStatus}</span>
              </div>
            )}
          </div>

          {/* Alcohol Consumption */}
          <div>
            <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
            {isEditing ? (
              <select
                id="alcoholConsumption"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={patientData.alcoholConsumption}
                onChange={(e) => handleFieldChange("alcoholConsumption", e.target.value)}
              >
                <option value="None">None</option>
                <option value="Occasional">Occasional</option>
                <option value="Moderate">Moderate</option>
                <option value="Heavy">Heavy</option>
              </select>
            ) : (
              <div className="flex items-center mt-1">
                <Wine className="h-4 w-4 text-gray-400 mr-2" />
                <span>{patientData.alcoholConsumption}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
