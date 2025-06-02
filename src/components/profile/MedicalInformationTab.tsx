import { Button } from "@/components/ui/button"
import { VitalStatistics } from "./VitalStatistics"
import { MedicalHistory } from "./MedicalHistory"
import { LifestyleFactors } from "./LifestyleFactors"
import type { Patient } from "@/types/patient"

interface MedicalInformationTabProps {
  patientData: Patient
  isEditing: boolean
}

export function MedicalInformationTab({ patientData, isEditing }: MedicalInformationTabProps) {
  return (
    <div className="space-y-6">
      <VitalStatistics patientData={patientData} isEditing={isEditing} />
      <MedicalHistory patientData={patientData} isEditing={isEditing} />
      <LifestyleFactors patientData={patientData} isEditing={isEditing} />

      {isEditing && (
        <div className="flex justify-end">
          <Button className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
        </div>
      )}
    </div>
  )
}
