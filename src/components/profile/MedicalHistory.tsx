import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AlertTriangle, FileText } from "lucide-react"
import type { Patient } from "@/types/patient"

interface MedicalHistoryProps {
  patientData: Patient
  isEditing: boolean
  onChange: (data: Patient) => void
}

export function MedicalHistory({ patientData, isEditing, onChange }: MedicalHistoryProps) {
  const handleFieldChange = (field: keyof Patient, value: any) => {
    onChange({ ...patientData, [field]: value })
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical History</CardTitle>
        <CardDescription>Health conditions, allergies, and medical background</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="allergies">Allergies</Label>
            {isEditing ? (
              <Input id="allergies" 
              value={patientData.allergies}
              onChange={(e) => handleFieldChange("allergies", e.target.value)} />
            ) : (
              <div className="flex items-start mt-1">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                <span>{patientData.allergies || "No known allergies"}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="pastIllness">Past Illnesses</Label>
            {isEditing ? (
              <Input id="pastIllness" 
              value={patientData.pastIllness}
              onChange={(e) => handleFieldChange("pastIllness", e.target.value)}
               />
            ) : (
              <div className="flex items-start mt-1">
                <FileText className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                <span>{patientData.pastIllness || "No significant past illnesses"}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
