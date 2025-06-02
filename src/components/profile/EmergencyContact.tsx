import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { User, Phone } from "lucide-react"
import type { Patient } from "@/types/patient"

interface EmergencyContactProps {
  patientData: Patient
  isEditing: boolean
}

export function EmergencyContact({ patientData, isEditing }: EmergencyContactProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Contact</CardTitle>
        <CardDescription>Primary emergency contact information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
            {isEditing ? (
              <Input id="emergencyContactName" defaultValue={patientData.emergencyContactName} />
            ) : (
              <div className="flex items-center mt-1">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span>{patientData.emergencyContactName}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
            {isEditing ? (
              <Input id="emergencyContactPhone" defaultValue={patientData.emergencyContactPhone} />
            ) : (
              <div className="flex items-center mt-1">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <span>{patientData.emergencyContactPhone}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
