"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, Pill, DollarSign, FileText, RefreshCw } from "lucide-react"
import type { PrescriptionWithDetails } from "@/types/prescription"
import { mockDoctors } from "@/data/doctors"

interface PrescriptionDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prescription: PrescriptionWithDetails | null
}

export function PrescriptionDetailsDialog ({ open, onOpenChange, prescription }: PrescriptionDetailsDialogProps) {
  if (!prescription) return null

  const doctor = mockDoctors.find((d) => d.userId === prescription.doctorId)

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between p-4">
            <DialogTitle className="text-xl">Prescription Details</DialogTitle>
            <Badge className={getStatusColor(prescription.status)}>
              {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
            </Badge>
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
                    <span>{prescription.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Date Issued:</span>
                    <span>{prescription.createdAt.toString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Prescribed by:</span>
                    <span>{doctor?.name || "Unknown Doctor"}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Total Medications:</span>
                    <span>{prescription.details?.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Total Price:</span>
                    <span className="font-semibold">${prescription.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medication Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medication Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescription.details?.map((detail, index) => (
                  <div key={detail.id}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-teal-700">{detail.medicine.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{detail.medicine.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-500">Dosage:</span>
                            <p>
                              {detail.dosage} {detail.medicine.unit}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Quantity:</span>
                            <p>{detail.quantity}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Unit Price:</span>
                            <p>${detail.medicine.price.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Subtotal:</span>
                            <p className="font-semibold">${detail.subTotal.toFixed(2)}</p>
                          </div>
                        </div>

                        {detail.note && (
                          <div className="mt-2">
                            <span className="font-medium text-gray-500 text-sm">Instructions:</span>
                            <p className="text-sm mt-1">{detail.note}</p>
                          </div>
                        )}
                      </div>

                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center ml-4">
                        <Pill className="h-5 w-5 text-teal-600" />
                      </div>
                    </div>

                    {index < prescription.details?.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
