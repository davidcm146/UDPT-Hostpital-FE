import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { BadgeIcon as IdCard, Camera, Shield, FileText, UserCheck, Clock, CreditCard } from "lucide-react"
import type { Patient } from "@/types/patient"

interface ProfileSidebarProps {
  patientData: Patient
  isEditing: boolean
}

export function ProfileSidebar({ patientData, isEditing }: ProfileSidebarProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
              <AvatarFallback className="text-2xl">
                {patientData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                size="icon"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-teal-600 hover:bg-teal-700"
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{patientData.name}</h2>
          <p className="text-gray-500 text-sm mt-1">
            Member since {patientData.registrationDate && new Date(patientData.registrationDate).getFullYear()}
          </p>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <div className="flex items-center">
            <IdCard className="h-4 w-4 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Medical Record #</p>
              <p className="text-sm">{patientData.medicalRecordNumber}</p>
            </div>
          </div>
          <div className="flex items-center">
            <UserCheck className="h-4 w-4 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Primary Physician</p>
              <p className="text-sm">{patientData.primaryPhysician}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Last Visit</p>
              <p className="text-sm">
                {patientData.lastVisitDate && new Date(patientData.lastVisitDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Insurance</p>
              <p className="text-sm">{patientData.insuranceProvider}</p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Shield className="mr-2 h-4 w-4" />
            Privacy Settings
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
            <FileText className="mr-2 h-4 w-4" />
            Request Medical Records
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
