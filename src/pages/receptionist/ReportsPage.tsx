"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Download, Calendar, Users, TrendingUp, BarChart3, Activity } from "lucide-react"

export default function ReceptionistReportsPage() {
  const [reportType, setReportType] = useState("")
  const [dateRange, setDateRange] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const reportTypes = [
    { value: "patient-registration", label: "Patient Registration Report" },
    { value: "appointment-summary", label: "Appointment Summary Report" },
    { value: "medicine-inventory", label: "Medicine Inventory Report" },
    { value: "daily-activity", label: "Daily Activity Report" },
    { value: "monthly-summary", label: "Monthly Summary Report" },
    { value: "financial-summary", label: "Financial Summary Report" },
  ]

  const quickReports = [
    {
      title: "Today's Summary",
      description: "Overview of today's activities",
      icon: Activity,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => generateReport("daily-summary"),
    },
    {
      title: "Patient List",
      description: "Complete patient database",
      icon: Users,
      color: "bg-green-600 hover:bg-green-700",
      action: () => generateReport("patient-list"),
    },
    {
      title: "Appointment Schedule",
      description: "Current appointment schedule",
      icon: Calendar,
      color: "bg-purple-600 hover:bg-purple-700",
      action: () => generateReport("appointment-schedule"),
    },
    {
      title: "Medicine Stock",
      description: "Current medicine inventory",
      icon: BarChart3,
      color: "bg-orange-600 hover:bg-orange-700",
      action: () => generateReport("medicine-stock"),
    },
  ]

  const recentReports = [
    {
      id: 1,
      name: "Daily Activity Report - Jan 19, 2024",
      type: "Daily Activity",
      generatedAt: "2024-01-19 18:30",
      size: "2.3 MB",
    },
    {
      id: 2,
      name: "Patient Registration Report - Jan 2024",
      type: "Patient Registration",
      generatedAt: "2024-01-19 15:45",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "Medicine Inventory Report - Jan 19, 2024",
      type: "Medicine Inventory",
      generatedAt: "2024-01-19 12:20",
      size: "956 KB",
    },
  ]

  const generateReport = (type: string) => {
    console.log("Generating report:", type)
    // Implement report generation logic
  }

  const handleCustomReportGeneration = () => {
    if (!reportType) {
      alert("Please select a report type")
      return
    }

    console.log("Generating custom report:", {
      type: reportType,
      dateRange,
      startDate,
      endDate,
    })
    // Implement custom report generation logic
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Generate and download various reports for analysis</p>
      </div>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickReports.map((report) => {
              const Icon = report.icon
              return (
                <Button key={report.title} className={`h-auto p-4 ${report.color}`} onClick={report.action}>
                  <div className="text-center">
                    <Icon className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-xs opacity-90 mt-1">{report.description}</p>
                  </div>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Report Generator */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Report Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date-range">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {dateRange === "custom" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleCustomReportGeneration}>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reports Generated</p>
                <p className="text-2xl font-bold text-blue-600">156</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Exported</p>
                <p className="text-2xl font-bold text-green-600">45.2 GB</p>
                <p className="text-sm text-gray-500">Total size</p>
              </div>
              <Download className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Most Requested</p>
                <p className="text-lg font-bold text-purple-600">Daily Activity</p>
                <p className="text-sm text-gray-500">Report type</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-500">
                      {report.type} • Generated on {report.generatedAt} • {report.size}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
