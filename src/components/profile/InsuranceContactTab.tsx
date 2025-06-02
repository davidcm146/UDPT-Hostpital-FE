import { Button } from "@/components/ui/button"
import { EmergencyContact } from "./EmergencyContact"
import { InsuranceInformation } from "./InsuranceInformation"
import type { Patient } from "@/types/patient"

interface InsuranceContactTabProps {
  patientData: Patient
  isEditing: boolean
}

export function InsuranceContactTab({ patientData, isEditing }: InsuranceContactTabProps) {
  return (
    <div className="space-y-6">
      <EmergencyContact patientData={patientData} isEditing={isEditing} />
      <InsuranceInformation patientData={patientData} isEditing={isEditing} />

      {isEditing && (
        <div className="flex justify-end">
          <Button className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
        </div>
      )}
    </div>
  )
}
