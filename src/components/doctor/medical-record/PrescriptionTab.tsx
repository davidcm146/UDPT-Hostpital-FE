import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pill, Plus, Loader2, RefreshCw, Calendar, DollarSign, Check } from "lucide-react"
import type { MedicalRecord } from "@/types/medical-record"
import type { Prescription } from "@/types/prescription"
import { formatDate } from "@/lib/DateTimeUtils"
import { PrescriptionService } from "@/services/prescriptionService"
import { toast } from "react-toastify"

interface PrescriptionTabProps {
  prescriptions: Prescription[]
  record: MedicalRecord | null | undefined
  isLoading?: boolean
  onCreatePrescription: () => void
  onViewPrescriptionDetails: (prescriptionId: string) => void
  onRefreshPrescriptions: () => void
}

export const PrescriptionTab = ({
  prescriptions,
  record,
  isLoading = false,
  onCreatePrescription,
  onViewPrescriptionDetails,
  onRefreshPrescriptions,
}: PrescriptionTabProps) => {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
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
    switch (status) {
      case "NOT_TAKEN":
        return "Not Taken"
      case "TAKEN":
        return "Taken"
      case "CANCELLED":
        return "Cancelled"
      default:
        return status
    }
  }

  const handleMarkAsTaken = async (prescriptionId: string) => {
    setUpdatingStatus(prescriptionId)
    try {
      await PrescriptionService.updatePrescriptionStatus(prescriptionId, "TAKEN")

      toast.success("Prescription marked as taken successfully!")

      // Refresh the prescriptions list to show updated status
      onRefreshPrescriptions()
    } catch (error) {
      console.error("Error updating prescription status:", error)

      let errorMessage = "Failed to update prescription status. Please try again."
      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage = "You are not authorized to update this prescription. Please log in again."
        } else if (error.message.includes("404")) {
          errorMessage = "Prescription not found. It may have been deleted."
        } else if (error.message.includes("500")) {
          errorMessage = "Server error occurred. Please try again later."
        } else {
          errorMessage = `Error: ${error.message}`
        }
      }

      toast.error(errorMessage)
    } finally {
      setUpdatingStatus(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Prescriptions for this Visit</h3>
          {record && (
            <p className="text-sm text-gray-500">
              Medical Record: {record.diagnosis} • {formatDate(record.visitDate)}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefreshPrescriptions}
            disabled={isLoading}
            className="bg-transparent"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={onCreatePrescription}>
            <Plus className="mr-2 h-4 w-4" />
            Add Prescription
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600 mr-2" />
          <span className="text-gray-600">Loading prescriptions...</span>
        </div>
      )}

      {!isLoading && prescriptions.length > 0 && (
        <div className="space-y-4">
          {prescriptions.map((prescription, index) => (
            <Card key={prescription.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <Pill className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-teal-700">Prescription #{index + 1}</h4>
                      <p className="text-xs text-gray-400">ID: {prescription.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getStatusColor(prescription.status)}>
                      {formatStatus(prescription.status)}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onViewPrescriptionDetails(prescription.id)}>
                        View Details
                      </Button>
                      {prescription.status === "NOT_TAKEN" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleMarkAsTaken(prescription.id)}
                          disabled={updatingStatus === prescription.id}
                        >
                          {updatingStatus === prescription.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Mark as Taken
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Total Price</p>
                      <p className="text-lg font-bold text-green-600">${prescription.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-gray-600">{formatDate(prescription.createdAt.toString())}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-gray-600">{formatDate(prescription.updatedAt.toString())}</p>
                    </div>
                  </div>
                </div>

                {prescription.note && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-1">Notes:</p>
                    <p className="text-sm text-blue-700">{prescription.note}</p>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Patient ID:</span>
                      <br />
                      {prescription.patientId.slice(-8)}
                    </div>
                    <div>
                      <span className="font-medium">Doctor ID:</span>
                      <br />
                      {prescription.doctorId.slice(-8)}
                    </div>
                    <div>
                      <span className="font-medium">Record ID:</span>
                      <br />
                      {prescription.medicalRecordId.slice(-8)}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <br />
                      {formatStatus(prescription.status)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && prescriptions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions</h3>
            <p className="text-gray-500 mb-4">No prescriptions have been added to this medical record yet.</p>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={onCreatePrescription}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Prescription
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
