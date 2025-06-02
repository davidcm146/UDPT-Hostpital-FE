import { useState } from "react"
import { PatientStatisticsHeader } from "@/components/admin/statistics/PatientStatisticsHeader"
import { PatientStatisticsCharts } from "@/components/admin/statistics/PatientStatisticsCharts"
import { PatientStatisticsTable } from "@/components/admin/statistics/PatientStatisticsTable"
import { PatientStatisticsFilters } from "@/components/admin/statistics/PatientStatisticsFilters"

export default function PatientStatisticsPage() {
  const [filters, setFilters] = useState({
    ageGroup: "all",
    gender: "all",
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
  })

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  return (
    <div className="space-y-6">
      <PatientStatisticsHeader />
      <PatientStatisticsFilters onFilterChange={handleFilterChange} />
      <PatientStatisticsCharts filters={filters} />
      <PatientStatisticsTable filters={filters} />
    </div>
  )
}
