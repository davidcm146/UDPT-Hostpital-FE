import { Button } from "@/components/ui/button"
import { VitalStatistics } from "./VitalStatistics"
import { MedicalHistory } from "./MedicalHistory"
import { LifestyleFactors } from "./LifestyleFactors"
import type { Patient } from "@/types/patient"

interface MedicalInformationTabProps {
  patientData: Patient
  isEditing: boolean
  onChange: (data: Patient) => void
}

export function MedicalInformationTab({ patientData, isEditing, onChange }: MedicalInformationTabProps) {
  return (
    <div className="space-y-6">
      <VitalStatistics patientData={patientData} isEditing={isEditing} onChange={onChange} />
      <MedicalHistory patientData={patientData} isEditing={isEditing} onChange={onChange} />
      <LifestyleFactors patientData={patientData} isEditing={isEditing} onChange={onChange} />
    </div>
  )
}
