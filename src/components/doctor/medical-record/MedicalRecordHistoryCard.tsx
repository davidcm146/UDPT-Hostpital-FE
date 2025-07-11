"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, User, Stethoscope, FileText, Clock, Phone, AlertTriangle } from "lucide-react"
import type { MedicalRecord } from "@/types/medical-record"
import { formatDate } from "@/lib/DateTimeUtils"

interface MedicalRecordHistoryCardProps {
  record: MedicalRecord
  onViewDetails?: (recordID: string) => void
  onViewPatient?: (patientID: string) => void
}

export function MedicalRecordHistoryCard({
  record,
  onViewDetails,
  onViewPatient,
}: MedicalRecordHistoryCardProps) {
  const getVisitTypeColor = (visitType: string) => {
    switch (visitType.toLowerCase()) {
      case "EMERGENCY":
        return "bg-red-100 text-red-800"
      case "FOLLOW_UP":
        return "bg-blue-100 text-blue-800"
      case "CONSULTATION":
        return "bg-purple-100 text-purple-800"
      case "CHECKUP":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getVisitTypeIcon = (visitType: string) => {
    switch (visitType.toLowerCase()) {
      case "EMERGENCY":
        return AlertTriangle
      case "FOLLOW_UP":
        return Clock
      case "CONSULTATION":
        return User
      case "CHECKUP":
        return Stethoscope
      default:
        return Stethoscope
    }
  }

  const IconComponent = getVisitTypeIcon(record.visitType)

  const handleViewDetails = () => {
    onViewDetails?.(record.id)
  }

  const handleViewPatient = () => {
    onViewPatient?.(record.patientId)
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
                  <span>{formatDate(record.visitDate.toString())}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Created {formatDate(record.createdAt?.toString() || "")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Information - Now using data from MedicalRecord */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={record.patientName} />
                  <AvatarFallback>
                    {record.patientName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{record.patientName}</p>
                  <div className="flex items-center text-xs text-gray-500 space-x-3">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      <span>ID: {record.patientId.slice(-8)}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      <span>{record.patientPhoneNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <Stethoscope className="h-3 w-3 mr-1" />
                      <span>Dr. {record.doctorName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Record Details Preview */}
          {record.description && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 line-clamp-2">{record.description}</p>
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
