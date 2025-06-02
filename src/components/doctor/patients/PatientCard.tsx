"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, ClipboardList, Pill, History, AlertTriangle, Phone, Mail, Heart } from "lucide-react"
import type { DoctorPatient } from "@/data/doctor-patients"

interface PatientCardProps {
  patient: DoctorPatient
  onViewRecords?: (patientID: string) => void
  onViewPrescriptions?: (patientID: string) => void
  onScheduleAppointment?: (patientID: string) => void
}

export function PatientCard({ patient, onViewRecords, onViewPrescriptions, onScheduleAppointment }: PatientCardProps) {
  const getChronicConditions = () => {
    if (!patient.chronicConditions) return []
    return patient.chronicConditions.split(", ").slice(0, 3)
  }

  const handleViewRecords = () => {
    onViewRecords?.(patient.patientID)
  }

  const handleViewPrescriptions = () => {
    onViewPrescriptions?.(patient.patientID)
  }

  const handleScheduleAppointment = () => {
    onScheduleAppointment?.(patient.patientID)
  }

  return (
    <Card className={patient.isUrgent ? "border-red-300 bg-red-50" : ""}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                patient.isUrgent ? "bg-red-100" : "bg-blue-100"
              }`}
            >
              {patient.isUrgent ? (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              ) : (
                <User className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div>
              <div className="flex items-center">
                <h4 className="font-medium text-gray-900">{patient.name}</h4>
                {patient.isUrgent && (
                  <Badge variant="outline" className="ml-2 border-red-500 text-red-600">
                    Needs Attention
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {patient.age} years • {patient.gender} • ID: {patient.patientID}
              </p>
              <div className="flex items-center mt-1 space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-3 w-3 mr-1" />
                  {patient.phone}
                </div>
                {patient.email && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-3 w-3 mr-1" />
                    {patient.email}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-500">
              <Heart className="h-3 w-3 mr-1 text-red-500" />
              {patient.bloodType}
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center text-sm">
            <History className="h-4 w-4 text-gray-400 mr-2" />
            <span>Last Visit: {patient.lastVisit || patient.lastVisitDate || "No visits"}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <span>Next: {patient.upcomingAppointment || "No upcoming"}</span>
          </div>
        </div>

        {patient.allergies && patient.allergies !== "No known allergies" && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">Allergies: </span>
              <span className="text-sm text-yellow-700">{patient.allergies}</span>
            </div>
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-1">
          {getChronicConditions().map((condition, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-100">
              {condition.trim()}
            </Badge>
          ))}
        </div>

        {patient.notes && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Notes: </span>
              {patient.notes}
            </p>
          </div>
        )}

        <div className="mt-4 flex space-x-2">
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleViewRecords}>
            <ClipboardList className="mr-2 h-4 w-4" />
            View Records
          </Button>
          <Button variant="outline" onClick={handleViewPrescriptions}>
            <Pill className="mr-2 h-4 w-4" />
            Prescriptions ({patient.recentPrescriptions || 0})
          </Button>
          <Button variant="outline" onClick={handleScheduleAppointment}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
