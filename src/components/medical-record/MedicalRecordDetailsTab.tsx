import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, User, Stethoscope, FileText, MapPin, Phone, Mail, GraduationCap } from "lucide-react"
import type { MedicalRecord } from "@/types/medical-record"
import type { Doctor } from "@/types/doctor"
import { getDoctorById } from "@/data/doctors"

interface MedicalRecordDetailsTabProps {
  medicalRecord: MedicalRecord
}

export function MedicalRecordDetailsTab({ medicalRecord }: MedicalRecordDetailsTabProps) {
  const doctor = getDoctorById(medicalRecord.doctorId) as Doctor | undefined

  const getVisitTypeColor = (visitType: MedicalRecord["visitType"]) => {
    switch (visitType) {
      case "Emergency":
        return "bg-red-100 text-red-800"
      case "Follow-up":
        return "bg-blue-100 text-blue-800"
      case "Consultation":
        return "bg-purple-100 text-purple-800"
      case "Regular Checkup":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medical Record Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Visit Date:</span>
                <span>{formatDate(medicalRecord.visitDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Visit Type:</span>
                <Badge variant="outline" className={getVisitTypeColor(medicalRecord.visitType)}>
                  {medicalRecord.visitType}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Record ID:</span>
                <span className="text-sm font-mono">{medicalRecord.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Created:</span>
                <span className="text-sm">{formatDate(medicalRecord.createdAt)}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Diagnosis</h4>
            <p className="text-gray-700">{medicalRecord.diagnosis}</p>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Treatment</h4>
            <p className="text-gray-700">{medicalRecord.treatment}</p>
          </div>

          {medicalRecord.description && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700">{medicalRecord.description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {doctor && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attending Physician</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600">{getInitials(doctor.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">Dr. {doctor.name}</h3>
                  <p className="text-gray-600">{doctor.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm text-gray-500">Experience: {doctor.experience}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{doctor.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>Doctor ID: {doctor.userId}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <h5 className="font-medium text-sm">Education & Qualifications</h5>
                  </div>
                  <p className="text-sm text-gray-600">{doctor.education}</p>
                </div>

                <div className="text-xs text-gray-500">
                  <p>Joined: {formatDate(doctor.createdAt)}</p>
                  {doctor.updatedAt !== doctor.createdAt && <p>Last updated: {formatDate(doctor.updatedAt)}</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
