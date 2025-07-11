import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { getVisitTypeColor } from '@/lib/MedicalRecordUtils'
import { MedicalRecord } from '@/types/medical-record'
import { Stethoscope } from 'lucide-react'
import { formatDate } from '@/lib/DateTimeUtils'

interface MedicalHistoryTabProps {
    medicalRecords: MedicalRecord[]
    record: MedicalRecord | null | undefined
}

export const MedicalHistoryTab = ({ medicalRecords, record }: MedicalHistoryTabProps) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Medical History</h3>
            </div>

            {medicalRecords.length > 0 ? (
                <div className="space-y-4">
                    {medicalRecords.map((medicalRecord) => (
                        <Card
                            key={medicalRecord.id}
                            className={record?.id === medicalRecord.id ? "ring-2 ring-teal-500" : ""}
                        >
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-lg font-semibold text-teal-700">{medicalRecord.diagnosis}</h4>
                                            {record?.id === medicalRecord.id && (
                                                <Badge variant="outline" className="text-xs bg-teal-50 border-teal-300">
                                                    Current Context
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <Badge className={getVisitTypeColor(medicalRecord.visitType)}>
                                                {medicalRecord.visitType}
                                            </Badge>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                <span>{formatDate(medicalRecord.visitDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-1">Treatment:</p>
                                        <p className="text-gray-600">{medicalRecord.treatment}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                                        <p className="text-gray-600">{medicalRecord.description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-6 text-center">
                        <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical History</h3>
                        <p className="text-gray-500">No medical records found for this patient.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}