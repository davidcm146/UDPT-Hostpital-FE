import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AlertTriangle, FileText, Heart, Pill } from "lucide-react"
import type { Patient } from "@/types/patient"

interface MedicalHistoryProps {
  patientData: Patient
  isEditing: boolean
}

export function MedicalHistory({ patientData, isEditing }: MedicalHistoryProps) {
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
              <Input id="allergies" defaultValue={patientData.allergies} />
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
              <Input id="pastIllness" defaultValue={patientData.pastIllness} />
            ) : (
              <div className="flex items-start mt-1">
                <FileText className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                <span>{patientData.pastIllness || "No significant past illnesses"}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="chronicConditions">Chronic Conditions</Label>
            {isEditing ? (
              <Input id="chronicConditions" defaultValue={patientData.chronicConditions} />
            ) : (
              <div className="flex items-start mt-1">
                <Heart className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                <span>{patientData.chronicConditions || "No chronic conditions"}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="currentMedications">Current Medications</Label>
            {isEditing ? (
              <textarea
                id="currentMedications"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue={patientData.currentMedications}
              />
            ) : (
              <div className="flex items-start mt-1">
                <Pill className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                <span>{patientData.currentMedications || "No current medications"}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="familyHistory">Family Medical History</Label>
            {isEditing ? (
              <textarea
                id="familyHistory"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue={patientData.familyHistory}
              />
            ) : (
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p>{patientData.familyHistory || "No significant family history"}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
