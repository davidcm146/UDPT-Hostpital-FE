"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Stethoscope, Phone, FileText, Clock } from "lucide-react"
import type { MedicalRecord } from "@/types/medical-record"

interface MedicalRecordDetailsTabProps {
  medicalRecord: MedicalRecord
}

export function MedicalRecordDetailsTab({ medicalRecord }: MedicalRecordDetailsTabProps) {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getVisitTypeBadgeColor = (visitType: string) => {
    switch (visitType) {
      case "Emergency":
        return "bg-red-100 text-red-800"
      case "Follow-up":
        return "bg-blue-100 text-blue-800"
      case "Regular Checkup":
        return "bg-green-100 text-green-800"
      case "Consultation":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Visit Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Visit Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Visit Date</p>
                  <p className="text-sm text-gray-900">{formatDate(medicalRecord.visitDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Visit Type</p>
                  <Badge className={getVisitTypeBadgeColor(medicalRecord.visitType)}>{medicalRecord.visitType}</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Stethoscope className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Doctor</p>
                  <p className="text-sm text-gray-900">{medicalRecord.doctorName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Patient</p>
                  <p className="text-sm text-gray-900">{medicalRecord.patientName}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Medical Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Diagnosis</h4>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{medicalRecord.diagnosis}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Treatment</h4>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{medicalRecord.treatment}</p>
            </div>
            {medicalRecord.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{medicalRecord.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="mr-2 h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Patient Phone</p>
              <p className="text-sm text-gray-900">{medicalRecord.patientPhoneNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Record Metadata */}
      {(medicalRecord.createdAt || medicalRecord.updatedAt) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Record Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              {medicalRecord.createdAt && (
                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <p className="text-gray-900">{formatDate(medicalRecord.createdAt)}</p>
                </div>
              )}
              {medicalRecord.updatedAt && (
                <div>
                  <span className="font-medium text-gray-700">Last Updated:</span>
                  <p className="text-gray-900">{formatDate(medicalRecord.updatedAt)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
