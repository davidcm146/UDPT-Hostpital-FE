import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { BadgeIcon as Camera, IdCard } from "lucide-react"
import type { Patient } from "@/types/patient"

interface ProfileSidebarProps {
  patientData: Patient
  isEditing: boolean
}

export function ProfileSidebar({ patientData, isEditing }: ProfileSidebarProps) {
  return (
    <Card>
      <CardContent className="pt-8 flex flex-col items-center">
        {/* Avatar */}
        <div className="relative mb-4">
          <Avatar className="h-28 w-28 border border-gray-300 shadow-sm">
            <AvatarImage src={patientData.avatar || "/placeholder.svg?height=112&width=112"} alt="Profile" />
            <AvatarFallback className="text-2xl font-semibold text-teal-700 bg-teal-100">
              {patientData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          {isEditing && (
            <Button
              size="icon"
              className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-teal-600 hover:bg-teal-700 shadow-lg"
            >
              <Camera className="h-4 w-4 text-white" />
            </Button>
          )}
        </div>

        {/* Name */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{patientData.name}</h2>

        {/* Medical Record */}
        <div className="flex items-center space-x-2 text-gray-600 mb-4">
          <IdCard className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{patientData.userId}</span>
        </div>

        <Separator className="my-3" />

        {/* Join Year */}
        <p className="text-gray-500 text-sm">
          Member since{" "}
          <span className="font-medium text-gray-700">
            {patientData.createdAt && new Date(patientData.createdAt).getFullYear()}
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
