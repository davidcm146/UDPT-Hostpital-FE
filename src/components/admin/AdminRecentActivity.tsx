"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { mockDoctorPatients } from "@/data/doctor-patients"
import { mockPrescriptions } from "@/data/prescription"
import { mockDoctorAppointments } from "@/data/doctor-appointment"
import { mockMedicalRecords } from "@/data/medical-record"

interface Activity {
  id: string
  type: "patient_created" | "prescription_issued" | "appointment_scheduled" | "medical_record_created"
  description: string
  user: string
  userAvatar?: string
  timestamp: Date
  details: string
}

export function AdminRecentActivity() {
  // Convert data to activities
  const activities: Activity[] = []

  // Add recent patient registrations
  mockDoctorPatients
    .filter((patient) => {
      const registrationDate = new Date(patient.registrationDate ? patient.registrationDate : "")
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return registrationDate > sevenDaysAgo
    })
    .forEach((patient) => {
      activities.push({
        id: `patient-${patient.patientID}`,
        type: "patient_created",
        description: "New patient registered",
        user: "Registration System",
        timestamp: new Date(patient.registrationDate ? patient.registrationDate : ""),
        details: `${patient.name} (${patient.patientID})`,
      })
    })

  // Add recent prescriptions
  mockPrescriptions
    .filter((prescription) => {
      const createdDate = new Date(prescription.createdAt)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return createdDate > sevenDaysAgo
    })
    .forEach((prescription) => {
      const patient = mockDoctorPatients.find((p) => p.patientID === prescription.patientID)
      activities.push({
        id: `prescription-${prescription.prescriptionID}`,
        type: "prescription_issued",
        description: "Prescription issued",
        user: `Dr. ${prescription.doctorID}`,
        timestamp: new Date(prescription.createdAt),
        details: `For ${patient?.name} - $${prescription.totalPrice}`,
      })
    })

  // Add recent appointments
  mockDoctorAppointments
    .filter((appointment) => {
      const createdDate = new Date(appointment.createdAt)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return createdDate > sevenDaysAgo
    })
    .forEach((appointment) => {
      activities.push({
        id: `appointment-${appointment.appointmentID}`,
        type: "appointment_scheduled",
        description: "Appointment scheduled",
        user: "Scheduling System",
        timestamp: new Date(appointment.createdAt),
        details: `${appointment.patientName} - ${appointment.reason}`,
      })
    })

  // Add recent medical records
  mockMedicalRecords
    .filter((record) => {
      const recordDate = new Date(record.createdAt)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return recordDate > sevenDaysAgo
    })
    .forEach((record) => {
      const patient = mockDoctorPatients.find((p) => p.patientID === record.patientID)
      activities.push({
        id: `record-${record.recordID}`,
        type: "medical_record_created",
        description: "Medical record created",
        user: `Dr. ${record.doctorID}`,
        timestamp: new Date(record.createdAt),
        details: `${record.diagnosis} for ${patient?.name}`,
      })
    })

  // Sort by most recent first
  activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  // Take only the most recent 10 activities
  const recentActivities = activities.slice(0, 10)

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "patient_created":
        return <Badge variant="default">New Patient</Badge>
      case "prescription_issued":
        return <Badge variant="secondary">Prescription</Badge>
      case "appointment_scheduled":
        return <Badge variant="outline">Appointment</Badge>
      case "medical_record_created":
        return <Badge className="bg-purple-100 text-purple-800">Medical Record</Badge>
      default:
        return <Badge variant="outline">Activity</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest system activities and changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.userAvatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.description}</p>
                  {getActivityBadge(activity.type)}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    by {activity.user} • {activity.details}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
