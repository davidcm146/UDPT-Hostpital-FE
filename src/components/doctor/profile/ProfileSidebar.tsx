import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BadgeIcon as Camera, Stethoscope, Clock, UserCheck } from "lucide-react"
import { BookOpen } from "lucide-react"
import type { Doctor } from "@/types/doctor"

interface ProfileSidebarProps {
  doctorData: Doctor
  isEditing: boolean
}

const ProfileSidebar = ({ doctorData, isEditing }: ProfileSidebarProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={doctorData.avatar || "/placeholder.svg"} alt={doctorData.name} />
              <AvatarFallback className="text-2xl">
                {doctorData.name
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
          <h2 className="text-xl font-bold text-gray-900">{doctorData.name}</h2>
          <p className="text-gray-500 text-sm">{doctorData.specialty}</p>
          <p className="text-gray-500 text-sm mt-1">Staff ID: {doctorData.userId}</p>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
           <div className="flex items-center">
            <BookOpen className="h-4 w-4 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Education</p>
              <p className="text-sm">{doctorData.education}</p>
            </div>
          </div>
          <div className="flex items-center">
            <UserCheck className="h-4 w-4 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Experience</p>
              <p className="text-sm">{doctorData.experience}</p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Clock className="mr-2 h-4 w-4" />
            Set Availability
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Stethoscope className="mr-2 h-4 w-4" />
            Update Specialties
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileSidebar
