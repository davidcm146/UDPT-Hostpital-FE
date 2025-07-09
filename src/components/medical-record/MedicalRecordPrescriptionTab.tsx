"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Pill, Loader2, AlertCircle } from "lucide-react"
import { PrescriptionService } from "@/services/prescriptionService"
import type { Prescription } from "@/types/prescription"

interface MedicalRecordPrescriptionTabProps {
  medicalRecordId: string
}

export function MedicalRecordPrescriptionTab({ medicalRecordId }: MedicalRecordPrescriptionTabProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await PrescriptionService.getPrescriptionsByMedicalRecord(medicalRecordId)
        setPrescriptions(data)
      } catch (err) {
        console.error("Failed to fetch prescriptions:", err)
        setError("Failed to load prescriptions. Please try again.")
        setPrescriptions([])
      } finally {
        setIsLoading(false)
      }
    }

    if (medicalRecordId) {
      fetchPrescriptions()
    }
  }, [medicalRecordId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "TAKEN":
        return "bg-green-100 text-green-800"
      case "NOT_TAKEN":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "TAKEN":
        return "Completed"
      case "NOT_TAKEN":
        return "Pending"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600 mr-2" />
            <span className="text-gray-600">Loading prescriptions...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (prescriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Pill className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              No prescriptions were issued for this medical record or they may be processed separately.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Prescriptions ({prescriptions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-medium">Prescription ID: {prescription.id}</h4>
                  <p className="text-sm text-gray-500">
                    Issued:{" "}
                    {new Date(prescription.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <Badge className={getStatusColor(prescription.status)}>{getStatusLabel(prescription.status)}</Badge>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h6 className="font-medium text-teal-700">Prescription Details</h6>
                      <p className="text-sm text-gray-600 mt-1">
                        This prescription contains medications prescribed by the doctor.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                        <div>
                          <span className="font-medium text-gray-500">Patient ID:</span> {prescription.patientId}
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Doctor ID:</span> {prescription.doctorId}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-lg">${prescription.totalPrice.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Total Amount</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-lg">Total: ${prescription.totalPrice.toFixed(2)}</span>
                  <p className="text-sm text-gray-500">
                    Status: {getStatusLabel(prescription.status)} • Updated:{" "}
                    {new Date(prescription.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
