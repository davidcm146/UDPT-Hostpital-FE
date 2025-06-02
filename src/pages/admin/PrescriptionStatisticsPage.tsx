import { useState } from "react"
import { PrescriptionStatisticsHeader } from "@/components/admin/statistics/PrescriptionStatisticsHeader"
import { PrescriptionStatisticsCharts } from "@/components/admin/statistics/PrescriptionStatisticsCharts"
import { PrescriptionStatisticsTable } from "@/components/admin/statistics/PrescriptionStatisticsTable"
import { PrescriptionStatisticsFilters } from "@/components/admin/statistics/PrescriptionStatisticsFilters"

export default function PrescriptionStatisticsPage() {
  const [filters, setFilters] = useState({
    category: "all",
    doctorId: "all",
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
  })

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  return (
    <div className="space-y-6">
      <PrescriptionStatisticsHeader />
      <PrescriptionStatisticsFilters onFilterChange={handleFilterChange} />
      <PrescriptionStatisticsCharts filters={filters} />
      <PrescriptionStatisticsTable filters={filters} />
    </div>
  )
}
