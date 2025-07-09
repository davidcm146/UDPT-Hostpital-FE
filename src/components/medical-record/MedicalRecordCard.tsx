import { getDoctorById } from "@/data/doctors"
import { MedicalRecord } from "@/types/medical-record"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { CalendarDays, FileText, User } from "lucide-react"
import { Button } from "../ui/button"
import { getVisitTypeIcon } from "@/lib/MedicalRecordUtils"
import { formatDate } from "@/lib/DateTimeUtils"

interface MedicalRecordCardProps {
  medicalRecord: MedicalRecord
  onViewDetails?: () => void
}

export const MedicalRecordCard = ({ medicalRecord, onViewDetails }: MedicalRecordCardProps) => {
  const doctor = getDoctorById(medicalRecord.doctorId)

  const getVisitTypeColor = (visitType: string) => {
    switch (visitType.toLowerCase()) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "follow-up":
        return "bg-blue-100 text-blue-800"
      case "consultation":
        return "bg-purple-100 text-purple-800"
      case "regular checkup":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
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
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex items-center text-sm">
              <CalendarDays className="h-4 w-4 text-gray-400 mr-2" />
              <span>{formatDate(medicalRecord.visitDate)}</span>
            </div>
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 text-gray-400 mr-2" />
              <span>Dr. {doctor?.name || "Unknown Doctor"}</span>
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}