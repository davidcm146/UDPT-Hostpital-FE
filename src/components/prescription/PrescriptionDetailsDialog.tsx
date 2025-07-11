"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, User, Pill, DollarSign, FileText, Loader2, AlertCircle } from "lucide-react"
import type { Prescription, PrescriptionDetail } from "@/types/prescription"
import type { Doctor } from "@/types/doctor"
import { PrescriptionService } from "@/services/prescriptionService"
import { DoctorService } from "@/services/doctorService"
import { formatDate } from "@/lib/DateTimeUtils"

// Add MedicineService import
import { MedicineService } from "@/services/medicineService"
import type { Medicine } from "@/types/medicine"

interface PrescriptionDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prescriptionId: string | null
}

// Add enhanced prescription detail interface
interface EnhancedPrescriptionDetail extends PrescriptionDetail {
  medicine?: Medicine
}

export function PrescriptionDetailsDialog({ open, onOpenChange, prescriptionId }: PrescriptionDetailsDialogProps) {
  const [prescription, setPrescription] = useState<Prescription | null>(null)
  // Update state to use enhanced prescription details
  const [prescriptionDetails, setPrescriptionDetails] = useState<EnhancedPrescriptionDetail[]>([])
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [isLoadingDoctor, setIsLoadingDoctor] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailsError, setDetailsError] = useState<string | null>(null)
  const [doctorError, setDoctorError] = useState<string | null>(null)

  // Fetch prescription data when dialog opens
  useEffect(() => {
    const fetchPrescriptionData = async () => {
      if (!open || !prescriptionId) {
        setPrescription(null)
        setPrescriptionDetails([])
        setDoctor(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Fetch prescription basic info
        const prescriptionData = await PrescriptionService.getPrescriptionById(prescriptionId)
        setPrescription(prescriptionData)

        // Replace the prescription details fetching logic in the useEffect
        // Fetch prescription details with medicine information
        setIsLoadingDetails(true)
        setDetailsError(null)
        try {
          const details = await PrescriptionService.getPrescriptionDetails(prescriptionId)

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
        } catch (detailsErr) {
          console.error("Failed to fetch prescription details:", detailsErr)
          setDetailsError("Failed to load prescription details")
          setPrescriptionDetails([])
        } finally {
          setIsLoadingDetails(false)
        }

        // Fetch doctor information
        if (prescriptionData.doctorId) {
          setIsLoadingDoctor(true)
          setDoctorError(null)
          try {
            const doctorData = await DoctorService.getDoctorById(prescriptionData.doctorId)
            setDoctor(doctorData)
          } catch (doctorErr) {
            console.error("Failed to fetch doctor:", doctorErr)
            setDoctorError("Failed to load doctor information")
            setDoctor(null)
          } finally {
            setIsLoadingDoctor(false)
          }
        }
      } catch (err) {
        console.error("Failed to fetch prescription:", err)
        setError("Failed to load prescription information")
        setPrescription(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrescriptionData()
  }, [open, prescriptionId])

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

  if (!prescriptionId) return null

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:min-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Loading Prescription Details...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600 mr-3" />
            <span className="text-gray-600">Loading prescription information...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error || !prescription) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:min-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Error Loading Prescription</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error || "Prescription not found"}</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between p-4">
            <DialogTitle className="text-xl">Prescription Details</DialogTitle>
            <Badge className={getStatusColor(prescription.status)}>{formatStatus(prescription.status)}</Badge>
          </div>
        </DialogHeader>
        <div className="space-y-6 px-4">
          {/* Prescription Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prescription Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Prescription ID:</span>
                    <span className="font-mono text-sm">{prescription.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Date Issued:</span>
                    <span>{formatDate(prescription.createdAt.toString())}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Prescribed by:</span>
                    {isLoadingDoctor ? (
                      <div className="flex items-center">
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        <span className="text-sm">Loading...</span>
                      </div>
                    ) : doctorError ? (
                      <span className="text-red-500 text-sm">{doctorError}</span>
                    ) : (
                      <span>{doctor?.name || "Unknown Doctor"}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Total Medications:</span>
                    {isLoadingDetails ? (
                      <div className="flex items-center">
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        <span className="text-sm">Loading...</span>
                      </div>
                    ) : (
                      <span>{prescriptionDetails?.length || 0}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Total Price:</span>
                    <span className="font-semibold">${prescription.totalPrice.toFixed(2)}</span>
                  </div>
                  {doctor?.specialty && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Specialty:</span>
                      <span>{doctor.specialty}</span>
                    </div>
                  )}
                </div>
              </div>

              {prescription.note && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Prescription Notes:</p>
                  <p className="text-sm text-blue-700">{prescription.note}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medication Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Medication Details
                {isLoadingDetails && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin inline mr-1" />
                    Loading...
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {detailsError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{detailsError}</AlertDescription>
                </Alert>
              ) : prescriptionDetails?.length > 0 ? (
                <div className="space-y-4">
                  {prescriptionDetails.map((detail, index) => (
                    <div key={detail.id}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                              <Pill className="h-5 w-5 text-teal-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-teal-700 text-lg">
                                {detail.medicine?.name || `Medicine ID: ${detail.medicationId}`}
                              </h4>
                              {detail.medicine?.description && (
                                <p className="text-sm text-gray-600">{detail.medicine.description}</p>
                              )}
                              {detail.medicine?.category && (
                                <p className="text-xs text-gray-500">Category: {detail.medicine.category}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <span className="font-medium text-gray-500">Dosage:</span>
                              <p className="font-semibold">{detail.dosage}mg</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <span className="font-medium text-gray-500">Quantity:</span>
                              <p className="font-semibold">{detail.quantity}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <span className="font-medium text-gray-500">Unit Price:</span>
                              <p className="font-semibold">${(detail.medicine?.price || detail.price).toFixed(2)}</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                              <span className="font-medium text-green-700">Subtotal:</span>
                              <p className="font-bold text-green-600">${detail.subTotal.toFixed(2)}</p>
                            </div>
                          </div>

                          {detail.medicine && (
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <span className="font-medium text-blue-700">Dosage Form:</span>
                                <p className="font-semibold text-blue-800">{detail.medicine.dosageForm}</p>
                              </div>
                            </div>
                          )}

                          {detail.note && (
                            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-2">
                              <span className="font-medium text-yellow-800 text-sm">Instructions:</span>
                              <p className="text-yellow-700 mt-1">{detail.note}</p>
                            </div>
                          )}

                          {detail.description && (
                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg mb-2">
                              <span className="font-medium text-gray-800 text-sm">Description:</span>
                              <p className="text-gray-700 mt-1">{detail.description}</p>
                            </div>
                          )}

                        </div>
                      </div>
                      {index < prescriptionDetails.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              ) : !isLoadingDetails ? (
                <div className="text-center py-8">
                  <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No medication details available for this prescription.</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
