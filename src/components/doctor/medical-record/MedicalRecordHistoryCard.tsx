"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, User, Stethoscope, FileText, Pill, Clock, Phone, Heart, AlertTriangle } from "lucide-react"
import type { MedicalRecord } from "@/types/medical-record"
import type { DoctorPatient } from "@/data/doctor-patients"
import { formatDate } from "@/lib/MedicalRecordUtils"

interface MedicalRecordHistoryCardProps {
  record: MedicalRecord
  patient?: DoctorPatient
  onViewDetails?: (recordID: string) => void
  onViewPatient?: (patientID: string) => void
  onAddPrescription?: (recordID: string) => void
}

export function MedicalRecordHistoryCard({
  record,
  patient,
  onViewDetails,
  onViewPatient,
  onAddPrescription,
}: MedicalRecordHistoryCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getVisitTypeColor = (visitType: string) => {
    switch (visitType.toLowerCase()) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "follow-up":
        return "bg-blue-100 text-blue-800"
      case "consultation":
        return "bg-purple-100 text-purple-800"
      case "regular checkup":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getVisitTypeIcon = (visitType: string) => {
    switch (visitType.toLowerCase()) {
      case "emergency":
        return AlertTriangle
      case "follow-up":
        return Clock
      case "consultation":
        return User
      case "regular checkup":
        return Stethoscope
      default:
        return Stethoscope
    }
  }

  const IconComponent = getVisitTypeIcon(record.visitType)

  const handleViewDetails = () => {
    onViewDetails?.(record.recordID)
  }

  const handleViewPatient = () => {
    onViewPatient?.(record.patientID)
  }

  const handleAddPrescription = () => {
    onAddPrescription?.(record.recordID)
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <IconComponent className="h-5 w-5 text-teal-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">{record.diagnosis}</h4>
                  <Badge variant="outline" className={`${getVisitTypeColor(record.visitType)}`}>
                    {record.visitType}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{record.treatment}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(record.visitDate)}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Created {formatDate(record.createdAt)}</span>
                </div>
              </div>
            </div>
            <Badge variant="outline" className={`${getStatusColor(record.status)}`}>
              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
            </Badge>
          </div>

          {/* Patient Information */}
          {patient && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt={patient.name} />
                    <AvatarFallback>
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{patient.name}</p>
                    <div className="flex items-center text-xs text-gray-500 space-x-3">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>
                          {patient.age}y, {patient.gender}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-3 w-3 mr-1 text-red-500" />
                        <span>{patient.bloodType}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        <span>{patient.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {patient.isUrgent && (
                  <Badge variant="outline" className="border-red-500 text-red-600 text-xs">
                    Urgent
                  </Badge>
                )}
              </div>

              {patient.allergies && patient.allergies !== "No known allergies" && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center">
                    <AlertTriangle className="h-3 w-3 text-yellow-600 mr-1" />
                    <span className="text-xs font-medium text-yellow-800">Allergies: </span>
                    <span className="text-xs text-yellow-700">{patient.allergies}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Record Details Preview */}
          {record.description && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 line-clamp-2">{record.description}</p>
            </div>
          )}

          {/* Prescriptions Info */}
          {record.prescriptions && record.prescriptions.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Pill className="h-4 w-4 mr-1" />
                <span>{record.prescriptions.length} prescription(s) associated</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleViewDetails}>
              <FileText className="mr-2 h-4 w-4" />
              View Details
            </Button>
            <Button variant="outline" onClick={handleViewPatient}>
              <User className="mr-2 h-4 w-4" />
              View Patient
            </Button>
            {record.status === "Active" && (
              <Button variant="outline" onClick={handleAddPrescription}>
                <Pill className="mr-2 h-4 w-4" />
                Add Prescription
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
