interface PatientListHeaderProps {
  patientCount?: number
}

export function PatientListHeader({ patientCount = 0 }: PatientListHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
        <p className="text-gray-600 mt-2">
          View and manage your patients' medical records
          {patientCount > 0 && (
            <span className="ml-2">
              • {patientCount} total patients
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
