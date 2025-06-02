"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, Pill, DollarSign, FileText, RefreshCw } from "lucide-react"
import type { PrescriptionWithDetails } from "@/types/prescription"
import { mockDoctors } from "@/data/doctors"

interface PrescriptionCardProps {
  prescription: PrescriptionWithDetails
  onViewDetails?: () => void
}

const PrescriptionCard = ({ prescription, onViewDetails }: PrescriptionCardProps) => {
  const doctor = mockDoctors.find((d) => d.id === prescription.doctorID)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Prescription #{prescription.prescriptionID}</CardTitle>
            <p className="text-gray-600">{doctor?.name || "Unknown Doctor"}</p>
          </div>
          <Badge className={getStatusColor(prescription.status)}>
            {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-teal-600" />
              <span className="text-sm">{prescription.createdAt.toString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <User className="w-4 h-4 mr-2 text-teal-600" />
              <span className="text-sm">{doctor?.specialty || "General Medicine"}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Pill className="w-4 h-4 mr-2 text-teal-600" />
              <span className="text-sm">{prescription.details.length} medication(s)</span>
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-2 text-teal-600" />
              <span className="text-sm">${prescription.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Medications:</h4>
          {prescription.details.slice(0, 2).map((detail) => (
            <div key={detail.detailID} className="text-sm text-gray-600">
              • {detail.medicine.name} - {detail.dosage}
              {detail.medicine.unit} (Qty: {detail.quantity})
            </div>
          ))}
          {prescription.details.length > 2 && (
            <div className="text-sm text-gray-500">+{prescription.details.length - 2} more medication(s)</div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={onViewDetails}>
            <FileText className="mr-2 h-4 w-4" />
            View Details
          </Button>
          {prescription.status === "active" && (
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Request Refill
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default PrescriptionCard
