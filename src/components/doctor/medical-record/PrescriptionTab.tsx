import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { MedicalRecord } from '@/types/medical-record'
import { Prescription, PrescriptionWithDetails } from '@/types/prescription'
import { Pill, Plus } from 'lucide-react'

interface PrescriptionTabProps {
    prescriptions: Prescription[]
    record: MedicalRecord | null | undefined
    handleCreatePrescription: () => void
    handleViewPrescriptionDetails: (prescription: PrescriptionWithDetails) => void
}

export const PrescriptionTab = ({ prescriptions, record, handleViewPrescriptionDetails, handleCreatePrescription }: PrescriptionTabProps) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                    {record ? `Prescriptions for ${record.diagnosis}` : "All Patient Prescriptions"}
                </h3>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleCreatePrescription}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Prescription
                </Button>
            </div>

            {prescriptions.length > 0 ? (
                <div className="space-y-4">
                    {prescriptions.map((prescription, index) => (
                        <Card key={prescription.id}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="text-lg font-semibold text-teal-700">Prescription #{index + 1}</h4>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <Badge
                                                className={
                                                    prescription.status === "Taken"
                                                        ? "bg-green-100 text-green-800"
                                                        : prescription.status === "Not taken"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-gray-100 text-gray-800"
                                                }
                                            >
                                                {prescription.status}
                                            </Badge>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                <span>{new Date(prescription.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <span className="text-sm font-medium">
                                                Total: ${prescription.totalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewPrescriptionDetails(prescription)}
                                    >
                                        View Details
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    <h5 className="font-medium text-gray-700">Medications:</h5>
                                    {prescription.details?.map((detail: PrescriptionWithDetails, detailIndex: string) => (
                                        <div key={detailIndex} className="pl-4 border-l-2 border-teal-200">
                                            <h6 className="font-medium text-teal-700">{detail.medicine.name}</h6>
                                            <p className="text-sm text-gray-600 mb-1">{detail.medicine.description}</p>
                                            <div className="text-sm text-gray-700">
                                                <span className="font-medium">Dosage:</span> {detail.dosage} {detail.medicine.unit}
                                                <span className="ml-4 font-medium">Quantity:</span> {detail.quantity}
                                            </div>
                                            {detail.note && (
                                                <div className="text-sm text-gray-700 mt-1">
                                                    <span className="font-medium">Instructions:</span> {detail.note}
                                                </div>
                                            )}
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
                        <p className="text-gray-500 mb-4">
                            {record
                                ? "No prescriptions have been created for this medical record."
                                : "No prescriptions have been created for this patient."}
                        </p>
                        <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleCreatePrescription}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create First Prescription
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}