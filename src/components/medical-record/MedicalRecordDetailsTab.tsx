import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, User, Stethoscope, ClipboardList, FileText, MapPin, Phone, Mail, Star } from "lucide-react"
import type { MedicalRecord } from "@/types/medical-record"
import { getDoctorById } from "@/data/doctors"

interface MedicalRecordDetailsTabProps {
  medicalRecord: MedicalRecord
}

export function MedicalRecordDetailsTab({ medicalRecord }: MedicalRecordDetailsTabProps) {
  const doctor = getDoctorById(medicalRecord.doctorID)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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
                <Badge variant="outline" className={`${getVisitTypeColor(medicalRecord.visitType)}`}>
                  {medicalRecord.visitType}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Status:</span>
                <Badge variant="outline" className={`${getStatusColor(medicalRecord.status)}`}>
                  {medicalRecord.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Record ID:</span>
                <span className="text-sm font-mono">{medicalRecord.recordID}</span>
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
                <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                <AvatarFallback>
                  {doctor.firstName[0]}
                  {doctor.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{doctor.name}</h3>
                  <p className="text-gray-600">{doctor.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                    <span className="text-sm text-gray-500">• {doctor.experience}</span>
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
                    <span>{doctor.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>Staff ID: {doctor.staffId}</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-sm mb-2">Education & Certifications</h5>
                  <p className="text-sm text-gray-600 mb-2">{doctor.education}</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.certifications.slice(0, 2).map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                    {doctor.certifications.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{doctor.certifications.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-sm mb-2">Specializations</h5>
                  <div className="flex flex-wrap gap-1">
                    {doctor.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-sm mb-2">Languages</h5>
                  <p className="text-sm text-gray-600">{doctor.languages.join(", ")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {medicalRecord.prescriptions && medicalRecord.prescriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Associated Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {medicalRecord.prescriptions.map((prescriptionId, index) => (
                <Badge key={index} variant="outline" className="font-mono text-xs">
                  {prescriptionId}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
