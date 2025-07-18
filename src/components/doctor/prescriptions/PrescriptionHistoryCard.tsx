"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, User, Pill, Phone, Heart, AlertTriangle } from "lucide-react"
import type { PrescriptionWithDetails } from "@/types/prescription"
import type { Patient } from "@/types/patient"
import { calculateAge } from "@/lib/PatientUtils"

interface PrescriptionHistoryCardProps {
  prescription: PrescriptionWithDetails
  patient?: Patient
  onViewDetails?: (prescription: PrescriptionWithDetails) => void
  onViewPatient?: (patientId: string) => void
}

export function PrescriptionHistoryCard({
  prescription,
  patient,
  onViewDetails,
  onViewPatient,
}: PrescriptionHistoryCardProps) {
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

  const handleViewDetails = () => {
    onViewDetails?.(prescription)
  }

  const handleViewPatient = () => {
    onViewPatient?.(prescription.patientId)
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <Pill className="h-5 w-5 text-teal-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">Prescription #{prescription.id.slice(-8)}</h4>
                  <Badge variant="outline" className={getStatusColor(prescription.status)}>
                    {prescription.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {prescription.details.length} medication(s) • Total: ${prescription.totalPrice.toFixed(2)}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Created {new Date(prescription.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          {patient && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
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
                          {calculateAge(patient.dob)}y, {patient.gender}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-3 w-3 mr-1 text-red-500" />
                        <span>{patient.bloodType}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        <span>{patient.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
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

          {/* Medications Preview */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Medications:</p>
            <div className="space-y-1">
              {prescription.details.slice(0, 2).map((detail, index) => (
                <div key={index} className="text-sm text-gray-600">
                  • {detail.medicine.name} - {detail.dosage} {detail.medicine.stockQuantity} x{detail.quantity}
                </div>
              ))}
              {prescription.details.length > 2 && (
                <div className="text-sm text-gray-500">+{prescription.details.length - 2} more medication(s)</div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleViewDetails}>
              <Pill className="mr-2 h-4 w-4" />
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
