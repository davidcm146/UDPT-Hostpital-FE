"use client"

import { Button } from "@/components/ui/button"
import { Download, RefreshCw, BarChart3 } from "lucide-react"

export function PatientStatisticsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Patient Statistics
        </h1>
        <p className="text-muted-foreground">Comprehensive analytics and insights about patient data</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        <Button size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
    </div>
  )
}
