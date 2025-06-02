"use client"

import { PatientManagementHeader } from "@/components/admin/management/PatientManagementHeader"
import { PatientManagementFilters } from "@/components/admin/management/PatientManagementFilters"
import { PatientManagementTable } from "@/components/admin/management/PatientManagementTable"
import { PatientManagementStats } from "@/components/admin/management/PatientManagementStats"

export default function PatientManagementPage() {
  return (
    <div className="space-y-6">
      <PatientManagementHeader />
      <PatientManagementStats />
      <PatientManagementFilters />
      <PatientManagementTable />
    </div>
  )
}
