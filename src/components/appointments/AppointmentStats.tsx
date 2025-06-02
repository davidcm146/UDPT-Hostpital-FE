"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react"
import type { Appointment } from "@/types/appointment"

interface AppointmentStatsProps {
  appointments: Appointment[]
}

const AppointmentStats = ({ appointments }: AppointmentStatsProps) => {
  const stats = {
    total: appointments.length,
    pending: appointments.filter((apt) => apt.status === "pending").length,
    confirmed: appointments.filter((apt) => apt.status === "confirmed").length,
    completed: appointments.filter((apt) => apt.status === "completed").length,
    cancelled: appointments.filter((apt) => apt.status === "cancelled").length,
  }

  const statCards = [
    {
      title: "Total Appointments",
      value: stats.total,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Confirmed",
      value: stats.confirmed,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default AppointmentStats
