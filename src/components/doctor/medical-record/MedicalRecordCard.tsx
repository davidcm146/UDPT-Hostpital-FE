"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Pill, Eye, Plus } from "lucide-react"
import type { MedicalRecord } from "@/types/medical-record"
import { getVisitTypeColor } from "@/lib/MedicalRecordUtils"

interface MedicalRecordCardProps {
  record: MedicalRecord
  prescriptionCount: number
  onViewDetails: (recordID: string) => void
  onAddPrescription: (recordID: string) => void
}

export function MedicalRecordCard({
  record,
  prescriptionCount,
  onViewDetails,
  onAddPrescription,
}: MedicalRecordCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-lg">{record.diagnosis}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getVisitTypeColor(record.visitType)}>{record.visitType}</Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(record.id)}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button variant="outline" size="sm" onClick={() => onAddPrescription(record.id)}>
              <Plus className="h-4 w-4 mr-1" />
              Prescription
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Visit Date: {record.visitDate.toLocaleDateString()}</span>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Treatment:</p>
          <p className="text-sm text-gray-600 line-clamp-2">{record.treatment}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
          <p className="text-sm text-gray-600 line-clamp-2">{record.description}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center text-sm text-gray-500">
            <Pill className="h-4 w-4 mr-1" />
            <span>{prescriptionCount} Prescription(s)</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FileText className="h-4 w-4 mr-1" />
            <span>Record ID: {record.id}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
