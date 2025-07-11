"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Pill, User, Trash2, Save, Loader2, AlertTriangle, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Medicine } from "@/types/medicine"
import type { CreatePrescriptionRequest } from "@/types/prescription"
import type { Patient } from "@/types/patient"
import { PrescriptionService } from "@/services/prescriptionService"
import { PatientService } from "@/services/patientService"
import { MedicineService } from "@/services/medicineService"
import { calculateAge } from "@/lib/PatientUtils"
import { toast } from "react-toastify"

interface CreatePrescriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicalRecordId?: string | null
  onPrescriptionCreated?: () => void
  patientId: string
}

interface PrescriptionMedicine {
  medicine: Medicine | null
  dosage: number
  quantity: number
  note: string
}

export function CreatePrescriptionDialog({
  open,
  onOpenChange,
  medicalRecordId,
  onPrescriptionCreated,
  patientId
}: CreatePrescriptionDialogProps) {
  const [medicines, setPrescriptionMedicines] = useState<PrescriptionMedicine[]>([
    { medicine: null, dosage: 0, quantity: 0, note: "" },
  ])
  const [availableMedicines, setAvailableMedicines] = useState<Medicine[]>([])
  // const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingMedicines, setIsLoadingMedicines] = useState(false)
  const [prescriptionNote, setPrescriptionNote] = useState("")

  // Mock current doctor ID - in real app this would come from authentication
  const currentDoctorID = "cd90c404-6e72-4d57-8d97-05add77c7be1"
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchMedicines = useCallback(async (searchName?: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoadingMedicines(true)

    try {
      const medicineData = await MedicineService.fetchMedications({
        limit: 50,
        offset: 0,
        name: searchName?.trim() || undefined,
        signal: controller.signal,
      })

      // Only update if this request wasn't cancelled
      if (!controller.signal.aborted) {
        setAvailableMedicines(medicineData)
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error("Error fetching medicines:", error)
        setAvailableMedicines([])
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoadingMedicines(false)
      }
    }
  }, [])

  // Fetch medicines when dialog opens
  useEffect(() => {
    if (open) {
      fetchMedicines()
    } else {
      // Cancel any ongoing requests when dialog closes
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      // Reset state when dialog closes
      setAvailableMedicines([])
    }
  }, [open, fetchMedicines])

  const handleAddMedicine = () => {
    setPrescriptionMedicines([...medicines, { medicine: null, dosage: 0, quantity: 0, note: "" }])
  }

  const handleRemoveMedicine = (index: number) => {
    if (medicines.length > 1) {
      setPrescriptionMedicines(medicines.filter((_, i) => i !== index))
    }
  }

  const handleMedicineChange = (index: number, field: keyof PrescriptionMedicine, value: any) => {
    const updatedMedicines = [...medicines]
    updatedMedicines[index] = { ...updatedMedicines[index], [field]: value }
    setPrescriptionMedicines(updatedMedicines)
  }

  const handleMedicineSelect = (index: number, medicineId: string) => {
    const selectedMedicine = availableMedicines.find((med) => med.id === medicineId)
    if (selectedMedicine) {
      handleMedicineChange(index, "medicine", selectedMedicine)
    }
  }

  const calculateTotal = () => {
    return medicines.reduce((total, item) => {
      if (item.medicine) {
        return total + item.medicine.price * item.quantity
      }
      return total
    }, 0)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Validate form
      const validMedicines = medicines.filter((item) => item.medicine && item.dosage > 0 && item.quantity > 0)

      if (validMedicines.length === 0) {
        toast.error("Please add at least one medicine with proper dosage and quantity.")
        return
      }

      if (!patientId) {
        toast.error("Patient ID is required to create a prescription.")
        return
      }

      if (!medicalRecordId) {
        toast.error("Medical record ID is required to create a prescription.")
        return
      }

      const prescriptionRequest: CreatePrescriptionRequest = {
        patientId: patientId,
        medicalRecordId: medicalRecordId,
        doctorId: currentDoctorID,
        note: prescriptionNote.trim(),
        prescriptionDetails: validMedicines.map((item) => ({
          medicationId: item.medicine!.id,
          dosage: item.dosage,
          quantity: item.quantity,
          note: item.note.trim(),
        })),
      }

      console.log("Creating prescription with payload:", prescriptionRequest)

      // Create the prescription using the service
      const newPrescription = await PrescriptionService.createPrescription(prescriptionRequest)

      console.log("Prescription created successfully:", newPrescription)

      toast.success(
        `Prescription created successfully!\n` +
          `Prescription ID: ${newPrescription.id}\n` +
          `Total: $${newPrescription.totalPrice.toFixed(2)}\n` +
          `Status: ${newPrescription.status}\n` +
          `Medicines: ${validMedicines.length} item(s)`,
      )

      // Reset form and close dialog
      setPrescriptionMedicines([{ medicine: null, dosage: 0, quantity: 0, note: "" }])
      setPrescriptionNote("")
      onOpenChange(false)

      // Notify parent component
      if (onPrescriptionCreated) {
        onPrescriptionCreated()
      }
    } catch (error) {
      console.error("Error creating prescription:", error)

      let errorMessage = "Failed to create prescription. Please try again."
      if (error instanceof Error) {
        if (error.message.includes("400")) {
          errorMessage = "Invalid prescription data. Please check all fields and try again."
        } else if (error.message.includes("401")) {
          errorMessage = "You are not authorized to create prescriptions. Please log in again."
        } else if (error.message.includes("404")) {
          errorMessage = "Patient or medical record not found. Please refresh and try again."
        } else if (error.message.includes("500")) {
          errorMessage = "Server error occurred. Please try again later."
        } else {
          errorMessage = `Error: ${error.message}`
        }
      }

      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setPrescriptionMedicines([{ medicine: null, dosage: 0, quantity: 0, note: "" }])
    setPrescriptionNote("")
    // setSearchTerm("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Pill className="mr-2 h-5 w-5 text-teal-600" />
            Create New Prescription
            {medicalRecordId && <span className="ml-2 text-sm text-gray-500">(for Record: {medicalRecordId})</span>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Prescription Note */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prescription Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="prescription-note">General Prescription Notes</Label>
                <Textarea
                  id="prescription-note"
                  className="mt-2"
                  placeholder="Enter general notes for this prescription..."
                  value={prescriptionNote}
                  onChange={(e) => setPrescriptionNote(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Prescription Medicines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prescription Medicines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicines.map((item, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Medicine {index + 1}</h4>
                      {medicines.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveMedicine(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor={`medicine-${index}`}>Medicine</Label>
                        <Select
                          onValueChange={(value) => handleMedicineSelect(index, value)}
                          disabled={isLoadingMedicines || availableMedicines.length === 0}
                        >
                          <SelectTrigger className="mt-2 w-full">
                            <SelectValue placeholder="Select medicine" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableMedicines.length > 0 ? (
                              availableMedicines.map((medicine) => (
                                <SelectItem key={medicine.id} value={medicine.id}>
                                  <div>
                                    <p className="font-medium">{medicine.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {medicine.dosageForm} • ${medicine.price.toFixed(2)} • Stock:{" "}
                                      {medicine.stockQuantity}
                                    </p>
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <div>
                                {isLoadingMedicines ? "Loading medicines..." : "No medicines available"}
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`dosage-${index}`}>Dosage (mg)</Label>
                        <Input
                          id={`dosage-${index}`}
                          type="number"
                          className="mt-2"
                          placeholder="0"
                          value={item.dosage || ""}
                          onChange={(e) => handleMedicineChange(index, "dosage", Number(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          className="mt-2"
                          placeholder="0"
                          value={item.quantity || ""}
                          onChange={(e) => handleMedicineChange(index, "quantity", Number(e.target.value))}
                          max={item.medicine?.stockQuantity || undefined}
                        />
                        {item.medicine && item.quantity > item.medicine.stockQuantity && (
                          <p className="text-xs text-red-600 mt-1">
                            ⚠️ Quantity exceeds available stock ({item.medicine.stockQuantity})
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Subtotal</Label>
                        <div className="h-10 mt-2 flex items-center">
                          <span className="font-medium">
                            ${item.medicine ? (item.medicine.price * item.quantity).toFixed(2) : "0.00"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label htmlFor={`instructions-${index}`}>Instructions</Label>
                      <Textarea
                        id={`instructions-${index}`}
                        className="mt-2"
                        placeholder="Enter dosage instructions, frequency, and special notes..."
                        value={item.note}
                        onChange={(e) => handleMedicineChange(index, "note", e.target.value)}
                        rows={2}
                      />
                    </div>

                    {item.medicine && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">{item.medicine.name}</span> - {item.medicine.description}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Category: {item.medicine.category} • Form: {item.medicine.dosageForm} • Stock:{" "}
                          {item.medicine.stockQuantity}
                        </p>
                        {item.medicine.expiryDate && (
                          <p className="text-xs text-blue-600">
                            Expires: {new Date(item.medicine.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <Button variant="outline" onClick={handleAddMedicine} className="w-full bg-transparent">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Medicine
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Prescription Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prescription Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Medicines:</span>
                  <span className="font-medium">{medicines.filter((item) => item.medicine).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Quantity:</span>
                  <span className="font-medium">
                    {medicines.reduce((sum, item) => sum + (item.quantity || 0), 0)} units
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Price:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                isLoadingMedicines ||
                medicines.filter((item) => item.medicine && item.quantity > 0).length === 0
              }
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Prescription"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
