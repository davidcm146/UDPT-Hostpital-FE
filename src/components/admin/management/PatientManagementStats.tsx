"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, UserCheck, UserX, TrendingUp, TrendingDown } from "lucide-react"
import { mockDoctorPatients } from "@/data/doctor-patients"

export function PatientManagementStats() {
  const totalPatients = mockDoctorPatients.length

  // Calculate new patients this month
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const newPatientsThisMonth = mockDoctorPatients.filter((patient) => {
    const registrationDate = new Date(patient.registrationDate ? patient.registrationDate : "")
    return registrationDate.getMonth() === currentMonth && registrationDate.getFullYear() === currentYear
  }).length

  // Calculate new patients last month for comparison
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
  const newPatientsLastMonth = mockDoctorPatients.filter((patient) => {
    const registrationDate = new Date(patient.registrationDate ? patient.registrationDate : "")
    return registrationDate.getMonth() === lastMonth && registrationDate.getFullYear() === lastMonthYear
  }).length

  // Calculate active patients (visited in last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const activePatients = mockDoctorPatients.filter(
    (patient) => patient.lastVisitDate && new Date(patient.lastVisitDate) > thirtyDaysAgo,
  ).length

  // Calculate inactive patients
  const inactivePatients = totalPatients - activePatients

  // Calculate growth percentages
  const newPatientGrowth =
    newPatientsLastMonth > 0 ? ((newPatientsThisMonth - newPatientsLastMonth) / newPatientsLastMonth) * 100 : 0

  const stats = [
    {
      title: "Total Patients",
      value: totalPatients.toString(),
      description: `${((activePatients / totalPatients) * 100).toFixed(1)}% active`,
      icon: Users,
      trend: "up",
      color: "text-blue-600",
    },
    {
      title: "New This Month",
      value: newPatientsThisMonth.toString(),
      description: `${newPatientGrowth > 0 ? "+" : ""}${newPatientGrowth.toFixed(1)}% from last month`,
      icon: UserPlus,
      trend: newPatientGrowth >= 0 ? "up" : "down",
      color: "text-green-600",
    },
    {
      title: "Active Patients",
      value: activePatients.toString(),
      description: "Visited in last 30 days",
      icon: UserCheck,
      trend: "up",
      color: "text-purple-600",
    },
    {
      title: "Inactive Patients",
      value: inactivePatients.toString(),
      description: "No recent visits",
      icon: UserX,
      trend: "down",
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stat.trend === "up" ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              {stat.description}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
