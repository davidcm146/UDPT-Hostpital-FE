"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Pill, Activity, TrendingUp, TrendingDown } from "lucide-react"
import { mockDoctorPatients } from "@/data/doctor-patients"
import { mockPrescriptions } from "@/data/prescription"
import { mockMedicines } from "@/data/medicine"
import { mockDoctorAppointments } from "@/data/doctor-appointment"
import { mockMedicalRecords } from "@/data/medical-record"

export function AdminDashboardStats() {
  // Calculate statistics from real data
  const totalPatients = mockDoctorPatients.length
  const totalPrescriptions = mockPrescriptions.length
  const totalMedicines = mockMedicines.length
  const totalAppointments = mockDoctorAppointments.length
  const totalMedicalRecords = mockMedicalRecords.length

  // Calculate new patients this month
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const newPatientsThisMonth = mockDoctorPatients.filter((patient) => {
    const registrationDate = new Date(patient.registrationDate ? patient.registrationDate : "")
    return registrationDate.getMonth() === currentMonth && registrationDate.getFullYear() === currentYear
  }).length

  // Calculate active patients (visited in last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const activePatients = mockDoctorPatients.filter(
    (patient) => patient.lastVisitDate && new Date(patient.lastVisitDate) > thirtyDaysAgo,
  ).length

  // Calculate prescription trends
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  const prescriptionsThisMonth = mockPrescriptions.filter(
    (prescription) => new Date(prescription.createdAt) > lastMonth,
  ).length

  const stats = [
    {
      title: "Total Patients",
      value: totalPatients.toString(),
      description: `${activePatients} active patients`,
      icon: Users,
      trend: "up",
      color: "text-blue-600",
    },
    {
      title: "New Patients",
      value: newPatientsThisMonth.toString(),
      description: "This month",
      icon: UserPlus,
      trend: "up",
      color: "text-green-600",
    },
    {
      title: "Prescriptions",
      value: prescriptionsThisMonth.toString(),
      description: "This month",
      icon: Pill,
      trend: prescriptionsThisMonth > 10 ? "up" : "down",
      color: "text-orange-600",
    },
    {
      title: "Medical Records",
      value: totalMedicalRecords.toString(),
      description: `${totalMedicines} medicines available`,
      icon: Activity,
      trend: "up",
      color: "text-purple-600",
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
