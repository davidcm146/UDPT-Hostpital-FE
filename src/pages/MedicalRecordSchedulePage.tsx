"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  CalendarCheck,
  History,
  CalendarPlus,
  User,
  Stethoscope,
  ClipboardList,
  FileText,
} from "lucide-react"
import { MedicalRecordDetailsDialog } from "@/components/medical-record/MedicalRecordDetailsDialog"
import { mockMedicalRecords, getRecentMedicalRecords, getPastMedicalRecords } from "@/data/medical-record"
import type { MedicalRecord } from "@/types/medical-record"

// Icon mapping for visit types
const getVisitTypeIcon = (visitType: string) => {
  switch (visitType?.toLowerCase()) {
    case "emergency":
      return ClipboardList
    case "follow-up":
      return CalendarCheck
    case "consultation":
      return User
    case "regular checkup":
      return Stethoscope
    default:
      return Stethoscope
  }
}

const MedicalRecordSchedulePage = () => {
  const [activeTab, setActiveTab] = useState("recent")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)

  // Get filtered medical records
  const recentMedicalRecords = getRecentMedicalRecords()
  const pastMedicalRecords = getPastMedicalRecords()

  const openRecordDetails = (id: string) => {
    setSelectedRecordId(id)
    setDialogOpen(true)
  }

  return (
    <div className="min-h-screen px-8 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
            <p className="text-gray-600">View and manage your medical record history</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Schedule New Visit
            </Button>
          </div>
        </div>

        <Tabs defaultValue="recent" onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="recent" className="flex items-center">
              <CalendarCheck className="mr-2 h-4 w-4" />
              Recent Records ({recentMedicalRecords.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="mr-2 h-4 w-4" />
              Medical History ({pastMedicalRecords.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent">
            {recentMedicalRecords.length > 0 ? (
              <div className="space-y-4">
                {recentMedicalRecords.map((record) => (
                  <MedicalRecordCard
                    key={record.recordID}
                    medicalRecord={record}
                    isRecent={true}
                    onViewDetails={() => openRecordDetails(record.recordID)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState type="recent" />
            )}
          </TabsContent>

          <TabsContent value="history">
            {pastMedicalRecords.length > 0 ? (
              <div className="space-y-4">
                {pastMedicalRecords.map((record) => (
                  <MedicalRecordCard
                    key={record.recordID}
                    medicalRecord={record}
                    isRecent={false}
                    onViewDetails={() => openRecordDetails(record.recordID)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState type="history" />
            )}
          </TabsContent>
        </Tabs>

        <MedicalRecordDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          recordId={selectedRecordId}
          medicalRecords={mockMedicalRecords}
        />
      </div>
    </div>
  )
}

interface MedicalRecordCardProps {
  medicalRecord: MedicalRecord
  isRecent: boolean
  onViewDetails?: () => void
}

const MedicalRecordCard = ({ medicalRecord, isRecent, onViewDetails }: MedicalRecordCardProps) => {
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getVisitTypeColor = (visitType: string) => {
    switch (visitType.toLowerCase()) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "follow-up":
        return "bg-blue-100 text-blue-800"
      case "consultation":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  const IconComponent = getVisitTypeIcon(medicalRecord.visitType)

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <IconComponent className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{medicalRecord.diagnosis}</h4>
                <Badge variant="outline" className={`${getVisitTypeColor(medicalRecord.visitType)} mt-1`}>
                  {medicalRecord.visitType}
                </Badge>
              </div>
            </div>
            <Badge variant="outline" className={`${getStatusColor(medicalRecord.status)}`}>
              {medicalRecord.status.charAt(0).toUpperCase() + medicalRecord.status.slice(1)}
            </Badge>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex items-center text-sm">
              <CalendarDays className="h-4 w-4 text-gray-400 mr-2" />
              <span>{new Date(medicalRecord.visitDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 text-gray-400 mr-2" />
              <span>Dr. {medicalRecord.doctorID.slice(0, 8)}...</span>
            </div>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-600 line-clamp-2">{medicalRecord.treatment}</p>
          </div>

          <div className="mt-4 flex space-x-2">
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={onViewDetails}>
              <FileText className="mr-2 h-4 w-4" />
              View Details
            </Button>
            {medicalRecord.prescriptions && medicalRecord.prescriptions.length > 0 && (
              <Button variant="outline">
                <ClipboardList className="mr-2 h-4 w-4" />
                View Prescriptions
              </Button>
            )}
            {isRecent && medicalRecord.status === "Active" && (
              <Button variant="outline">
                <CalendarDays className="mr-2 h-4 w-4" />
                Schedule Follow-up
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface EmptyStateProps {
  type: "recent" | "history"
}

const EmptyState = ({ type }: EmptyStateProps) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg border">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        {type === "recent" ? (
          <CalendarDays className="h-8 w-8 text-gray-400" />
        ) : (
          <History className="h-8 w-8 text-gray-400" />
        )}
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">
        {type === "recent" ? "No Recent Medical Records" : "No Medical History"}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {type === "recent" ? "You don't have any recent medical records." : "Your medical history will appear here."}
      </p>
      {type === "recent" && (
        <Button className="bg-teal-600 hover:bg-teal-700">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Schedule a Visit
        </Button>
      )}
    </div>
  )
}

export default MedicalRecordSchedulePage
