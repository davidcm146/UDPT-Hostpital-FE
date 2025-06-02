"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, ClipboardList, Pill } from "lucide-react"
import { Link } from "react-router-dom"

export function QuickActions() {
  const actions = [
    {
      title: "Patient Management",
      icon: Users,
      path: "/receptionist/patients",
      description: "Update patient information",
    },
    {
      title: "Schedule Appointment",
      icon: Calendar,
      path: "/receptionist/appointments",
      description: "Create new appointment",
    },
    {
      title: "View Appointments",
      icon: ClipboardList,
      path: "/receptionist/appointment-list",
      description: "View appointment list",
    },
    {
      title: "Medicine Management",
      icon: Pill,
      path: "/receptionist/medicines",
      description: "Manage medicine inventory",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.path} to={action.path}>
                <Button className="h-20 w-full flex flex-col items-center justify-center p-4 hover:bg-teal-600">
                  <Icon className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium text-center">{action.title}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
