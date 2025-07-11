"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, User, Pill, FileText, Loader2, AlertCircle } from "lucide-react"
import type { Prescription, PrescriptionDetail } from "@/types/prescription"
import type { Doctor } from "@/types/doctor"
import { PrescriptionService } from "@/services/prescriptionService"
import { DoctorService } from "@/services/doctorService"
import { formatDate } from "@/lib/DateTimeUtils"
import { MedicineService } from "@/services/medicineService"
import type { Medicine } from "@/types/medicine"

interface PrescriptionCardProps {
  prescription: Prescription
  onViewDetails?: (prescriptionId: string) => void
}

// Enhanced prescription details with medicine information
interface EnhancedPrescriptionDetail extends PrescriptionDetail {
  medicine?: Medicine
}

const PrescriptionCard = ({ prescription, onViewDetails }: PrescriptionCardProps) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [prescriptionDetails, setPrescriptionDetails] = useState<EnhancedPrescriptionDetail[]>([])
  const [isLoadingDoctor, setIsLoadingDoctor] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [doctorError, setDoctorError] = useState<string | null>(null)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  // Fetch doctor information
  useEffect(() => {
    const fetchDoctor = async () => {
      if (!prescription.doctorId) return

      setIsLoadingDoctor(true)
      setDoctorError(null)
      try {
        const doctorData = await DoctorService.getDoctorById(prescription.doctorId)
        setDoctor(doctorData)
      } catch (err) {
        console.error("Failed to fetch doctor:", err)
        setDoctorError("Failed to load doctor info")
        setDoctor(null)
      } finally {
        setIsLoadingDoctor(false)
      }
    }

    fetchDoctor()
  }, [prescription.doctorId])

  // Fetch prescription details with medicine information
  useEffect(() => {
    const fetchDetailsWithMedicines = async () => {
      setIsLoadingDetails(true)
      setDetailsError(null)
      try {
        const details = await PrescriptionService.getPrescriptionDetails(prescription.id)

        // Fetch medicine details for each prescription detail
        const detailsWithMedicines: EnhancedPrescriptionDetail[] = []

        for (const detail of details) {
          try {
            const medicine = await MedicineService.getMedicationById(detail.medicationId)
            detailsWithMedicines.push({
              ...detail,
              medicine,
            })
          } catch (medicineError) {
            console.error(`Failed to fetch medicine ${detail.medicationId}:`, medicineError)
            // Add detail without medicine info if fetch fails
            detailsWithMedicines.push(detail)
          }
        }

        setPrescriptionDetails(detailsWithMedicines)
      } catch (err) {
        console.error("Failed to fetch prescription details:", err)
        setDetailsError("Failed to load prescription details")
        setPrescriptionDetails([])
      } finally {
        setIsLoadingDetails(false)
      }
    }

    fetchDetailsWithMedicines()
  }, [prescription.id])

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "TAKEN":
        return "bg-green-100 text-green-800"
      case "NOT_TAKEN":
        return "bg-yellow-100 text-yellow-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatStatus = (status: string) => {
    switch (status.toUpperCase()) {
      case "TAKEN":
        return "Completed"
      case "NOT_TAKEN":
        return "Pending"
      case "CANCELLED":
        return "Cancelled"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    }
  }

  // Handle view details click
  const handleViewDetailsClick = () => {
    console.log("View details clicked for prescription:", prescription.id)
    if (onViewDetails) {
      onViewDetails(prescription.id)
    } else {
      console.warn("onViewDetails callback not provided")
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Prescription #{prescription.id.slice(-8)}</CardTitle>
            {isLoadingDoctor ? (
              <div className="flex items-center text-sm text-gray-500">
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Loading doctor...
              </div>
            ) : doctorError ? (
              <p className="text-red-500 text-sm">{doctorError}</p>
            ) : (
              <p className="text-gray-600">{doctor?.name || "Unknown Doctor"}</p>
            )}
          </div>
          <Badge className={getStatusColor(prescription.status)}>{formatStatus(prescription.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-teal-600" />
              <span className="text-sm">{formatDate(prescription.createdAt.toString())}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <User className="w-4 h-4 mr-2 text-teal-600" />
              <span className="text-sm">
                {isLoadingDoctor ? "Loading..." : doctor?.specialty || "General Medicine"}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Pill className="w-4 h-4 mr-2 text-teal-600" />
              <span className="text-sm">
                {isLoadingDetails ? (
                  <span className="flex items-center">
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    Loading...
                  </span>
                ) : detailsError ? (
                  "Error loading"
                ) : (
                  `${prescriptionDetails.length} medication(s)`
                )}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Medications:</h4>
          {isLoadingDetails ? (
            <div className="flex items-center text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading medication details...
            </div>
          ) : detailsError ? (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{detailsError}</AlertDescription>
            </Alert>
          ) : prescriptionDetails.length > 0 ? (
            <>
              {prescriptionDetails.slice(0, 2).map((detail) => (
                <div key={detail.id} className="text-sm text-gray-600">
                  • {detail.medicine?.name || `Medicine ID: ${detail.medicationId}`} - {detail.dosage}mg (Qty:{" "}
                  {detail.quantity})
                  {detail.medicine?.dosageForm && (
                    <span className="ml-2 text-xs text-blue-600">({detail.medicine.dosageForm})</span>
                  )}
                </div>
              ))}
              {prescriptionDetails.length > 2 && (
                <div className="text-sm text-gray-500">+{prescriptionDetails.length - 2} more medication(s)</div>
              )}
            </>
          ) : (
            <div className="text-sm text-gray-500">No medication details available</div>
          )}
        </div>

        {prescription.note && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Notes:</p>
            <p className="text-sm text-blue-700">{prescription.note}</p>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleViewDetailsClick}>
            <FileText className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PrescriptionCard
