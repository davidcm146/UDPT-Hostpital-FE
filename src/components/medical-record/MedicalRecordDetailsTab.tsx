import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, User, Stethoscope, Phone, FileText, Clock, Loader2, AlertCircle, Mail, MapPin } from "lucide-react"
import type { MedicalRecord } from "@/types/medical-record"
import type { Doctor } from "@/types/doctor"
import { MedicalRecordService } from "@/services/medicalRecordService"
import { DoctorService } from "@/services/doctorService"
import { formatDate } from "@/lib/DateTimeUtils"

interface MedicalRecordDetailsTabProps {
  recordId: string | null
}

export function MedicalRecordDetailsTab({ recordId }: MedicalRecordDetailsTabProps) {
  const [record, setRecord] = useState<MedicalRecord | null>(null)
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDoctor, setIsLoadingDoctor] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [doctorError, setDoctorError] = useState<string | null>(null)

  // Fetch medical record if recordId is available
  useEffect(() => {
    const fetchMedicalRecord = async () => {
      if (!recordId) {
        return // Don't fetch if no ID provided
      }

      setIsLoading(true)
      setError(null)

      try {
        const fetchedRecord = await MedicalRecordService.getMedicalRecordById(recordId)
        setRecord(fetchedRecord)

        if (fetchedRecord.doctorId) {
          setIsLoadingDoctor(true)
          setDoctorError(null)
          try {
            const fetchedDoctor = await DoctorService.getDoctorById(fetchedRecord.doctorId)
            setDoctor(fetchedDoctor)
          } catch (doctorErr) {
            console.error("Error fetching doctor:", doctorErr)
            setDoctorError("Failed to load doctor information")
            setDoctor(null)
          } finally {
            setIsLoadingDoctor(false)
          }
        }
      } catch (err) {
        console.error("Error fetching medical record:", err)
        setError("Failed to load medical record details")
        setRecord(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMedicalRecord()
  }, [recordId])

  const getVisitTypeBadgeColor = (visitType: string) => {
    switch (visitType) {
      case "EMERGENCY":
        return "bg-red-100 text-red-800"
      case "FOLLOW_UP":
        return "bg-blue-100 text-blue-800"
      case "CHECKUP":
        return "bg-green-100 text-green-800"
      case "CONSULTATION":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600 mr-3" />
        <span className="text-gray-600">Loading medical record details...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!record) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No medical record data available.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Visit Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Visit Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Visit Date</p>
                  <p className="text-sm text-gray-900">{formatDate(record.visitDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Visit Type</p>
                  <Badge className={getVisitTypeBadgeColor(record.visitType)}>{record.visitType}</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Stethoscope className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Doctor</p>
                  <p className="text-sm text-gray-900">{record.doctorName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Patient</p>
                  <p className="text-sm text-gray-900">{record.patientName}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Medical Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Diagnosis</h4>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{record.diagnosis}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Treatment</h4>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{record.treatment}</p>
            </div>
            {record.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{record.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="mr-2 h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Patient Phone</p>
              <p className="text-sm text-gray-900">{record.patientPhoneNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Information - Replacing Record Identifiers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Stethoscope className="mr-2 h-5 w-5" />
              Attending Doctor Information
            </CardTitle>
            {isLoadingDoctor && (
              <div className="flex items-center text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading doctor info...
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {doctorError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{doctorError}</AlertDescription>
            </Alert>
          )}

          {!isLoadingDoctor && !doctorError && doctor ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Doctor Name</p>
                    <p className="text-lg font-semibold text-gray-900">{doctor.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Stethoscope className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Specialty</p>
                    <p className="text-sm text-gray-900">{doctor.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone Number</p>
                    <p className="text-sm text-gray-900">{doctor.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : !isLoadingDoctor && !doctorError && !doctor ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Doctor information not available</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Record Metadata */}
      {(record.createdAt || record.updatedAt) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Record Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              {record.createdAt && (
                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <p className="text-gray-900">{formatDate(record.createdAt.toString())}</p>
                </div>
              )}
              {record.updatedAt && (
                <div>
                  <span className="font-medium text-gray-700">Last Updated:</span>
                  <p className="text-gray-900">{formatDate(record.updatedAt.toString())}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
