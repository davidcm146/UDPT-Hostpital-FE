"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Stethoscope, Pill, User, Plus } from "lucide-react"
import type { MedicalRecord } from "@/types/medical-record"
import type { DoctorPatient } from "@/data/doctor-patients"
import { CreatePrescriptionDialog } from "../prescriptions/CreatePrescriptionDialog"
import PrescriptionDetailsDialog from "@/components/prescription/PrescriptionDetailsDialog"
import { getPrescriptionsByPatient } from "@/data/prescription"
import type { PrescriptionWithDetails } from "@/types/prescription"

interface MedicalRecordDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    record: MedicalRecord | null
    patient: DoctorPatient | null
}

export function MedicalRecordDetailsDialog({ open, onOpenChange, record, patient }: MedicalRecordDetailsDialogProps) {
    const [createPrescriptionOpen, setCreatePrescriptionOpen] = useState(false)
    const [prescriptionDetailsOpen, setPrescriptionDetailsOpen] = useState(false)
    const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionWithDetails | null>(null)

    if (!record || !patient) return null

    // Get actual prescription data
    const allPrescriptions = getPrescriptionsByPatient(patient.patientID)
    const recordPrescriptions = allPrescriptions.filter((p) => record.prescriptions.includes(p.prescriptionID))

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800"
            case "Completed":
                return "bg-blue-100 text-blue-800"
            case "Cancelled":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getVisitTypeColor = (visitType: string) => {
        switch (visitType) {
            case "Emergency":
                return "bg-red-100 text-red-800"
            case "Follow-up":
                return "bg-yellow-100 text-yellow-800"
            case "Regular Checkup":
                return "bg-green-100 text-green-800"
            case "Consultation":
                return "bg-blue-100 text-blue-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const handleAddPrescription = () => {
        setCreatePrescriptionOpen(true)
    }

    const handleViewPrescriptionDetails = (prescriptionID: string) => {
        const prescription = recordPrescriptions.find((p) => p.prescriptionID === prescriptionID)
        if (prescription) {
            setSelectedPrescription(prescription)
            setPrescriptionDetailsOpen(true)
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:min-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Medical Record Details</DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="details">Record Details</TabsTrigger>
                            <TabsTrigger value="prescriptions">Prescriptions ({record.prescriptions.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details">
                            <div className="space-y-6">
                                {/* Header Information */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{record.diagnosis}</CardTitle>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <Badge className={getVisitTypeColor(record.visitType)}>{record.visitType}</Badge>
                                                    <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                                                </div>
                                            </div>
                                            <div className="text-right text-sm text-gray-500">
                                                <p>Record ID: {record.recordID}</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>

                                {/* Patient & Visit Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <User className="h-5 w-5 mr-2" />
                                                Patient Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <p className="font-medium">Name:</p>
                                                <p className="text-gray-700">{patient.name}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium">Patient ID:</p>
                                                <p className="text-gray-700">{record.patientID}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium">Age:</p>
                                                <p className="text-gray-700">{patient.age} years old</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <Calendar className="h-5 w-5 mr-2" />
                                                Visit Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <p className="font-medium">Visit Date:</p>
                                                <p className="text-gray-700">{record.visitDate.toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium">Visit Type:</p>
                                                <p className="text-gray-700">{record.visitType}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium">Created:</p>
                                                <p className="text-gray-700">{record.createdAt.toLocaleDateString()}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Medical Details */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Stethoscope className="h-5 w-5 mr-2" />
                                            Medical Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="font-medium text-gray-700 mb-2">Diagnosis:</p>
                                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <p className="text-blue-800">{record.diagnosis}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="font-medium text-gray-700 mb-2">Treatment:</p>
                                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <p className="text-green-800">{record.treatment}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="font-medium text-gray-700 mb-2">Description:</p>
                                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                                <p className="text-gray-800">{record.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="prescriptions">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Prescriptions for this Visit</h3>
                                    <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleAddPrescription}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Prescription
                                    </Button>
                                </div>

                                {recordPrescriptions.length > 0 ? (
                                    <div className="space-y-4">
                                        {recordPrescriptions.map((prescription, index) => (
                                            <Card key={prescription.prescriptionID}>
                                                <CardContent className="p-5 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h2 className="text-lg font-semibold text-teal-700">
                                                                Prescription #{index + 1}
                                                            </h2>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Status: {prescription.status} • Total:{" "}
                                                                <span className="font-medium text-black">${prescription.totalPrice}</span>
                                                            </p>
                                                            <p className="text-xs text-gray-400">ID: {prescription.prescriptionID}</p>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewPrescriptionDetails(prescription.prescriptionID)}
                                                        >
                                                            View Details
                                                        </Button>
                                                    </div>

                                                    <div className="border-t pt-3 space-y-3">
                                                        {prescription.details.map((detail, detailIndex) => (
                                                            <div key={detailIndex}>
                                                                <h3 className="text-base font-medium text-teal-700">{detail.medicine.name}</h3>
                                                                <p className="text-sm text-gray-600">
                                                                    {detail.medicine.description}
                                                                </p>
                                                                <div className="text-sm text-gray-700 mt-1">
                                                                    <span className="font-medium">Dosage:</span> {detail.dosage}mg
                                                                    <span className="ml-4 font-medium">Quantity:</span> {detail.quantity}
                                                                </div>
                                                                <div className="text-sm text-gray-700 mt-1">
                                                                    <span className="font-medium">Instructions:</span> {detail.note}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <Card>
                                        <CardContent className="p-6 text-center">
                                            <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions</h3>
                                            <p className="text-gray-500 mb-4">No prescriptions have been added to this medical record.</p>
                                            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleAddPrescription}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add First Prescription
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>

            {/* Create Prescription Dialog */}
            <CreatePrescriptionDialog
                open={createPrescriptionOpen}
                onOpenChange={setCreatePrescriptionOpen}
                patient={patient}
                medicalRecordID={record?.recordID}
            />

            {/* Prescription Details Dialog */}
            <PrescriptionDetailsDialog
                open={prescriptionDetailsOpen}
                onOpenChange={setPrescriptionDetailsOpen}
                prescription={selectedPrescription}
            />
        </>
    )
}
