import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { GraduationCap, Clock } from "lucide-react"
import type { Receptionist } from "@/types/receptionist"

interface ProfileSidebarProps {
  receptionist: Receptionist
}

export function ProfileSidebar({ receptionist }: ProfileSidebarProps) {
  const initials = receptionist.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="p-6 h-fit">
      <div className="flex flex-col items-center mb-6">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={receptionist.avatar || "/placeholder.svg"} alt={receptionist.name} />
          <AvatarFallback className="text-2xl bg-gray-100 text-gray-800">{initials}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold text-center">{receptionist.name}</h2>
        <p className="text-gray-500">{receptionist.department}</p>
        <p className="text-sm text-gray-500 mt-2">Staff ID: {receptionist.id.substring(0, 8)}...</p>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-2">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
            <GraduationCap className="h-4 w-4 mr-2" />
            Education
          </h3>
          <p className="text-sm">{receptionist.education}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Experience
          </h3>
          <p className="text-sm">{receptionist.experience}</p>
        </div>
      </div>
    </Card>
  )
}
