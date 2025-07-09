import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Calendar, ClipboardList, Pill, AlertTriangle, Phone, Mail, Heart } from "lucide-react"
import type { Patient } from "@/types/patient"
import { getPrescriptionsByPatient } from "@/data/prescription"
import { calculateAge, formatWeight } from "@/lib/PatientUtils"

interface PatientCardProps {
  patient: Patient
  onViewRecords?: (patientID: string) => void
  onViewPrescriptions?: (patientID: string) => void
  onScheduleAppointment?: (patientID: string) => void
}

export function PatientCard({ patient, onViewRecords }: PatientCardProps) {
  const handleViewRecords = () => {
    onViewRecords?.(patient.id)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-start space-x-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
            <AvatarFallback>
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-3 w-3 mr-1" />
                    <span>
                      {calculateAge(patient?.dob)} years, {patient.gender}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Heart className="h-3 w-3 mr-1 text-red-500" />
                    <span>{patient.bloodType}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400">ID: {patient.id?.slice(-8)}</p>
                {patient.occupation && <p className="text-xs text-gray-500 mt-1">{patient.occupation}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Phone className="h-3 w-3 mr-1" />
            <span>{patient.phoneNumber}</span>
          </div>
          {patient.email && (
            <div className="flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              <span>{patient.email}</span>
            </div>
          )}
        </div>

        {/* Physical Information */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-500">Height</p>
            <p className="font-medium">{patient.height} cm</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-500">Weight</p>
            <p className="font-medium">{patient.weight} kg</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-500">BMI</p>
            <p className="font-medium">
              {formatWeight(patient.weight)}
            </p>
          </div>
        </div>

        {/* Health Alerts */}
        {patient.allergies && patient.allergies !== "No known allergies" && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">Allergies: </span>
              <span className="text-sm text-yellow-700">{patient.allergies}</span>
            </div>
          </div>
        )}

        {/* Health History Summary */}
        <div className="mb-4 space-y-2">
          {patient.pastIllness && patient.pastIllness !== "None" && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Past Illness: </span>
              <span className="text-gray-600">{patient.pastIllness}</span>
            </div>
          )}

          <div className="flex space-x-4 text-xs text-gray-500">
            {patient.smokingStatus && (
              <div>
                <span className="font-medium">Smoking: </span>
                <span>{patient.smokingStatus}</span>
              </div>
            )}
            {patient.alcoholConsumption && (
              <div>
                <span className="font-medium">Alcohol: </span>
                <span>{patient.alcoholConsumption}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
          <Button className="bg-teal-600 w-36 hover:bg-teal-700 flex-1" onClick={handleViewRecords}>
            <ClipboardList className="mr-2 h-4 w-4" />
            View Details
          </Button>
        

        {/* Footer with Last Updated */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Created: {new Date(patient.createdAt).toLocaleDateString()}</span>
            <span>Updated: {new Date(patient.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
