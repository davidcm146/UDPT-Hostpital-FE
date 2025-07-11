"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  User,
  Pill,
  DollarSign,
  FileText,
  Loader2,
  AlertCircle,
  Phone,
  MapPin,
  Package,
  Clock,
} from "lucide-react"
import type { Prescription, PrescriptionDetail } from "@/types/prescription"
import type { Patient } from "@/types/patient"
import type { Medicine } from "@/types/medicine"
import { PrescriptionService } from "@/services/prescriptionService"
import { PatientService } from "@/services/patientService"
import { MedicineService } from "@/services/medicineService"
import { formatDate } from "@/lib/DateTimeUtils"

interface PrescriptionDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prescriptionId: string | null
}

interface EnhancedPrescriptionDetail extends PrescriptionDetail {
  medicine?: Medicine
}

export function PrescriptionDetailsDialog({ open, onOpenChange, prescriptionId }: PrescriptionDetailsDialogProps) {
  const [prescription, setPrescription] = useState<Prescription | null>(null)
  const [prescriptionDetails, setPrescriptionDetails] = useState<EnhancedPrescriptionDetail[]>([])
  // const [patient, setPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMedications, setIsLoadingMedications] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      if (!open || !prescriptionId) {
        setPrescription(null)
        setPrescriptionDetails([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Fetch prescription basic info and details in parallel
        const [prescriptionData, detailsData] = await Promise.all([
          PrescriptionService.getPrescriptionById(prescriptionId),
          PrescriptionService.getPrescriptionDetails(prescriptionId),
        ])

        setPrescription(prescriptionData)
        setIsLoadingMedications(true)
        const detailsWithMedicineInfo: EnhancedPrescriptionDetail[] = []

        for (const detail of detailsData) {
          try {
            // Fetch medicine details using the medicationId from prescription details
            const medicine = await MedicineService.getMedicationById(detail.medicationId)
            detailsWithMedicineInfo.push({
              ...detail,
              medicine,
            })
          } catch (medicineError) {
            console.error(`Error fetching medicine details for ${detail.medicationId}:`, medicineError)
            // Add the detail without medicine details if fetch fails
            detailsWithMedicineInfo.push(detail)
          }
        }

        setPrescriptionDetails(detailsWithMedicineInfo)
      } catch (err) {
        console.error("Error fetching prescription data:", err)
        setError("Failed to load prescription details")
        setPrescription(null)
        setPrescriptionDetails([])
        // setPatient(null)
      } finally {
        setIsLoading(false)
        setIsLoadingMedications(false)
      }
    }

    fetchPrescriptionData()
  }, [open, prescriptionId])

  if (!prescriptionId) return null

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "TAKEN":
        return "bg-green-100 text-green-800 border-green-200"
      case "NOT_TAKEN":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatStatus = (status: string) => {
    switch (status.toUpperCase()) {
      case "NOT_TAKEN":
        return "Not Taken"
      case "TAKEN":
        return "Taken"
      case "CANCELLED":
        return "Cancelled"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    }
  }

  const getDosageFormColor = (dosageForm: string) => {
    switch (dosageForm.toLowerCase()) {
      case "tablet":
        return "bg-blue-100 text-blue-800"
      case "capsule":
        return "bg-purple-100 text-purple-800"
      case "injection":
        return "bg-red-100 text-red-800"
      case "syrup":
        return "bg-orange-100 text-orange-800"
      case "cream":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatExpiryDate = (expiryDate: Date | string) => {
    const date = typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate
    const now = new Date()
    const isExpired = date < now
    const daysUntilExpiry = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return {
      formatted: formatDate(date.toString()),
      isExpired,
      daysUntilExpiry,
      isNearExpiry: daysUntilExpiry <= 30 && daysUntilExpiry > 0,
    }
  }

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
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Prescription Details</DialogTitle>
            <Badge variant="outline" className={getStatusColor(prescription.status)}>
              {formatStatus(prescription.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Prescription Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Prescription Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Prescription ID:</span>
                    <span className="text-sm font-mono">{prescription.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Date Created:</span>
                    <span>{formatDate(prescription.createdAt.toString())}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Last Updated:</span>
                    <span>{formatDate(prescription.updatedAt.toString())}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Medical Record ID:</span>
                    <span className="text-sm font-mono">{prescription.medicalRecordId}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Total Price:</span>
                    <span className="font-bold text-green-600 text-lg">${prescription.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Total Medications:</span>
                    <span>{prescriptionDetails.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Doctor ID:</span>
                    <span className="text-sm font-mono">{prescription.doctorId}</span>
                  </div>
                </div>
              </div>

              {prescription.note && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-medium text-blue-800 mb-2">Prescription Notes:</p>
                  <p className="text-blue-700">{prescription.note}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medication Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Pill className="h-5 w-5 mr-2" />
                  Medication Details ({prescriptionDetails.length} items)
                </CardTitle>
                {isLoadingMedications && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading medication details...
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {prescriptionDetails.length > 0 ? (
                <div className="space-y-6">
                  {prescriptionDetails.map((detail, index) => {
                    const medicine = detail.medicine
                    const expiryInfo = medicine?.expiryDate ? formatExpiryDate(medicine.expiryDate) : null

                    return (
                      <div key={detail.id}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                                <Pill className="h-6 w-6 text-teal-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-teal-700 text-lg">
                                    {medicine?.name || "Unknown Medicine"}
                                  </h4>
                                  {medicine?.dosageForm && (
                                    <Badge variant="outline" className={getDosageFormColor(medicine.dosageForm)}>
                                      {medicine.dosageForm}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {medicine?.description || detail.description || "No description available"}
                                </p>
                                {medicine?.category && (
                                  <p className="text-xs text-gray-500 mt-1">Category: {medicine.category}</p>
                                )}
                              </div>
                            </div>

                            {/* Enhanced medication information */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="font-medium text-gray-700 text-sm">Dosage:</span>
                                <p className="font-semibold">{detail.dosage} mg</p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="font-medium text-gray-700 text-sm">Quantity:</span>
                                <p className="font-semibold">{detail.quantity}</p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="font-medium text-gray-700 text-sm">Unit Price:</span>
                                <p className="font-semibold">${(medicine?.price || detail.price).toFixed(2)}</p>
                              </div>
                              <div className="bg-green-50 p-3 rounded-lg">
                                <span className="font-medium text-green-700 text-sm">Subtotal:</span>
                                <p className="font-bold text-green-600">${detail.subTotal.toFixed(2)}</p>
                              </div>
                            </div>

                            {/* Additional medication info */}
                            {medicine && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Package className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium text-blue-700 text-sm">Stock Available:</span>
                                  </div>
                                  <p className="font-semibold text-blue-800">{medicine.stockQuantity} units</p>
                                  {medicine.stockQuantity < 10 && (
                                    <p className="text-xs text-red-600 mt-1">⚠️ Low stock</p>
                                  )}
                                </div>
                                {expiryInfo && (
                                  <div
                                    className={`p-3 rounded-lg ${
                                      expiryInfo.isExpired
                                        ? "bg-red-50"
                                        : expiryInfo.isNearExpiry
                                          ? "bg-yellow-50"
                                          : "bg-gray-50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <Clock
                                        className={`h-4 w-4 ${
                                          expiryInfo.isExpired
                                            ? "text-red-600"
                                            : expiryInfo.isNearExpiry
                                              ? "text-yellow-600"
                                              : "text-gray-600"
                                        }`}
                                      />
                                      <span
                                        className={`font-medium text-sm ${
                                          expiryInfo.isExpired
                                            ? "text-red-700"
                                            : expiryInfo.isNearExpiry
                                              ? "text-yellow-700"
                                              : "text-gray-700"
                                        }`}
                                      >
                                        Expiry Date:
                                      </span>
                                    </div>
                                    <p
                                      className={`font-semibold ${
                                        expiryInfo.isExpired
                                          ? "text-red-800"
                                          : expiryInfo.isNearExpiry
                                            ? "text-yellow-800"
                                            : "text-gray-800"
                                      }`}
                                    >
                                      {expiryInfo.formatted}
                                    </p>
                                    {expiryInfo.isExpired && <p className="text-xs text-red-600 mt-1">⚠️ Expired</p>}
                                    {expiryInfo.isNearExpiry && (
                                      <p className="text-xs text-yellow-600 mt-1">
                                        ⚠️ Expires in {expiryInfo.daysUntilExpiry} days
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {detail.note && (
                              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                                <span className="font-medium text-yellow-800 text-sm">Instructions:</span>
                                <p className="text-yellow-700 mt-1">{detail.note}</p>
                              </div>
                            )}

                            <div className="mt-3 text-xs text-gray-500">
                              <span>Medication ID: {detail.medicationId}</span>
                              <span className="mx-2">•</span>
                              <span>Detail ID: {detail.id}</span>
                              {detail.createdAt && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>Created: {formatDate(detail.createdAt.toString())}</span>
                                </>
                              )}
                              {medicine?.createdAt && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>Medicine Added: {formatDate(medicine.createdAt.toString())}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {index < prescriptionDetails.length - 1 && <Separator className="mt-6" />}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No medication details available for this prescription.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prescription Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{prescriptionDetails.length}</p>
                  <p className="text-sm text-blue-700">Total Items</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">${prescription.totalPrice.toFixed(2)}</p>
                  <p className="text-sm text-green-700">Total Cost</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{formatStatus(prescription.status)}</p>
                  <p className="text-sm text-purple-700">Status</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-600">
                    {prescriptionDetails.reduce((sum, detail) => sum + detail.quantity, 0)}
                  </p>
                  <p className="text-sm text-gray-700">Total Quantity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
