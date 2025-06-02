import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Pill, User, Trash2, Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DoctorPatient } from "@/data/doctor-patients"
import type { Medicine } from "@/types/medicine"
import type { CreatePrescriptionRequest } from "@/types/prescription"
import { mockMedicines, searchMedicines } from "@/data/medicine"
import { createPrescription } from "@/data/prescription"
// import { addPrescriptionToRecord } from "@/data/medical-record"

interface CreatePrescriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: DoctorPatient | null
  medicalRecordID?: string | null
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
  patient,
  medicalRecordID,
}: CreatePrescriptionDialogProps) {
  const [medicines, setPrescriptionMedicines] = useState<PrescriptionMedicine[]>([
    { medicine: null, dosage: 0, quantity: 0, note: "" },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!patient) return null

  // Mock current doctor ID - in real app this would come from authentication
  const currentDoctorID = "550e8400-e29b-41d4-a716-446655440001"

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
    const selectedMedicine = mockMedicines.find((med) => med.medicineID === medicineId)
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
        alert("Please add at least one medicine with proper dosage and quantity.")
        return
      }

      // Create prescription request
      const prescriptionRequest: CreatePrescriptionRequest = {
        patientID: patient.patientID,
        doctorID: currentDoctorID,
        medicines: validMedicines.map((item) => ({
          medicineID: item.medicine!.medicineID,
          dosage: item.dosage,
          quantity: item.quantity,
          note: item.note,
        })),
      }

      // Create the prescription
      const newPrescription = createPrescription(prescriptionRequest)

      // If medicalRecordID is provided, link the prescription to the record
      if (medicalRecordID) {
        // addPrescriptionToRecord(medicalRecordID, newPrescription.prescriptionID)
      }

      alert(
        `Prescription created successfully!\nPrescription ID: ${newPrescription.prescriptionID}\nTotal: $${newPrescription.totalPrice.toFixed(2)}${
          medicalRecordID ? "\nLinked to medical record: " + medicalRecordID : ""
        }`,
      )

      // Reset form and close dialog
      setPrescriptionMedicines([{ medicine: null, dosage: 0, quantity: 0, note: "" }])
      onOpenChange(false)
    } catch (error) {
      alert("Failed to create prescription. Please try again.")
      console.error("Error creating prescription:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFilteredMedicines = () => {
    if (!searchTerm) return mockMedicines.slice(0, 10) // Show first 10 medicines
    return searchMedicines(searchTerm)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Pill className="mr-2 h-5 w-5 text-teal-600" />
            Create New Prescription
            {medicalRecordID && <span className="ml-2 text-sm text-gray-500">(for Record: {medicalRecordID})</span>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="mr-2 h-4 w-4" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-medium text-gray-500">Patient Name:</p>
                  <p className="text-gray-900">{patient.name}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Patient ID:</p>
                  <p className="text-gray-900">{patient.patientID}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Age:</p>
                  <p className="text-gray-900">{patient.age} years</p>
                </div>
              </div>
              {patient.allergies && patient.allergies !== "No known allergies" && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-medium text-red-800">⚠️ Allergies: {patient.allergies}</p>
                </div>
              )}
            </CardContent>
          </Card>

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
                        <Select onValueChange={(value) => handleMedicineSelect(index, value)}>
                          <SelectTrigger className="mt-2 w-full">
                            <SelectValue placeholder="Select medicine" />
                          </SelectTrigger>
                          <SelectContent>
                            {getFilteredMedicines().map((medicine) => (
                              <SelectItem key={medicine.medicineID} value={medicine.medicineID}>
                                <div>
                                  <p className="font-medium">{medicine.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {medicine.strength} • ${medicine.price.toFixed(2)}
                                  </p>
                                </div>
                              </SelectItem>
                            ))}
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
                        />
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
                          Category: {item.medicine.category} • Manufacturer: {item.medicine.manufacturer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                <Button variant="outline" onClick={handleAddMedicine} className="w-full">
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
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              onClick={handleSubmit}
              disabled={isSubmitting || medicines.filter((item) => item.medicine && item.quantity > 0).length === 0}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Prescription"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
