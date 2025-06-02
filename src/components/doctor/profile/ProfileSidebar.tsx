import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BadgeIcon as IdCard, Camera, Stethoscope, Calendar, Clock, UserCheck } from "lucide-react"
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
              <AvatarImage src={doctorData.image || "/placeholder.svg"} alt={doctorData.name} />
              <AvatarFallback className="text-2xl">
                {doctorData.firstName[0]}
                {doctorData.lastName[0]}
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
          <p className="text-gray-500 text-sm mt-1">Staff ID: {doctorData.staffId}</p>
          {doctorData.rating && (
            <div className="flex items-center mt-2">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600 ml-1">{doctorData.rating} rating</span>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <div className="flex items-center">
            <IdCard className="h-4 w-4 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">License Number</p>
              <p className="text-sm">{doctorData.licenseNumber}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Stethoscope className="h-4 w-4 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">NPI Number</p>
              <p className="text-sm">{doctorData.npiNumber}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Next Appointment</p>
              <p className="text-sm">{doctorData.nextAppointment || "No upcoming appointments"}</p>
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
