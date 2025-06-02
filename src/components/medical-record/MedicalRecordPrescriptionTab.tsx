import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Pill, RefreshCw } from "lucide-react"
import type { MedicalRecord } from "@/types/medical-record"
import { getPrescriptionsByPatient } from "@/data/prescription"
import PrescriptionDetailsDialog from "@/components/prescription/PrescriptionDetailsDialog"
import type { PrescriptionWithDetails } from "@/types/prescription"

interface MedicalRecordPrescriptionTabProps {
  medicalRecord: MedicalRecord
}

export function MedicalRecordPrescriptionTab({ medicalRecord }: MedicalRecordPrescriptionTabProps) {
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionWithDetails | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Get prescriptions for this patient
  const prescriptions = getPrescriptionsByPatient(medicalRecord.patientID)

  // Find prescriptions related to this medical record
  const relatedPrescriptions = prescriptions.filter(
    (p) =>
      medicalRecord.prescriptions?.includes(p.prescriptionID) ||
      new Date(p.createdAt).toDateString() === new Date(medicalRecord.visitDate).toDateString(),
  )

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

  const handleViewPrescription = (prescription: PrescriptionWithDetails) => {
    setSelectedPrescription(prescription)
    setDialogOpen(true)
  }

  if (relatedPrescriptions.length === 0) {
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Prescriptions ({relatedPrescriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {relatedPrescriptions.map((prescription) => (
              <div key={prescription.prescriptionID} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium">Prescription ID: {prescription.prescriptionID}</h4>
                    <p className="text-sm text-gray-500">
                      Issued: {new Date(prescription.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(prescription.status)}>
                    {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                  </Badge>
                </div>

                <div>
                  <h5 className="font-medium mb-3">Medications ({prescription.details.length})</h5>
                  <div className="space-y-3">
                    {prescription.details.slice(0, 2).map((detail) => (
                      <div key={detail.detailID} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h6 className="font-medium text-teal-700">{detail.medicine.name}</h6>
                          <p className="text-sm text-gray-600 mb-1">{detail.medicine.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-500">Dosage:</span> {detail.dosage}mg
                            </div>
                            <div>
                              <span className="font-medium text-gray-500">Quantity:</span> {detail.quantity}
                            </div>
                            <div>
                              <span className="font-medium text-gray-500">Form:</span> {detail.medicine.dosageForm}
                            </div>
                            <div>
                              <span className="font-medium text-gray-500">Strength:</span> {detail.medicine.strength}
                            </div>
                          </div>
                          {detail.note && (
                            <div className="mt-2">
                              <span className="font-medium text-gray-500 text-sm">Instructions:</span>
                              <p className="text-sm mt-1 text-gray-700">{detail.note}</p>
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold">${detail.subTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    {prescription.details.length > 2 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{prescription.details.length - 2} more medications
                      </p>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-lg">Total: ${prescription.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => handleViewPrescription(prescription)}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    {prescription.status === "active" && (
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Request Refill
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <PrescriptionDetailsDialog open={dialogOpen} onOpenChange={setDialogOpen} prescription={selectedPrescription} />
    </>
  )
}
