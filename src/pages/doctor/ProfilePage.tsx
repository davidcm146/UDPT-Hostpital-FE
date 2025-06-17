import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User, Edit } from "lucide-react"
import ProfileSidebar from "@/components/doctor/profile/ProfileSidebar"
import ProfileTabs from "@/components/doctor/profile/ProfileTabs"
import { mockDoctors } from "@/data/doctors"
import type { Doctor } from "@/types/doctor"
import type { Schedule } from "@/types/schedule"

const DoctorProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false)

  // Mock current doctor ID - in real app this would come from authentication
  const currentDoctorID = "550e8400-e29b-41d4-a716-446655440002"
  const [doctorData, setDoctorData] = useState<Doctor>(
    mockDoctors.find((doctor) => doctor.userId === currentDoctorID) || mockDoctors[0],
  )

  const handleSave = (updatedData: Partial<Doctor>) => {
    setDoctorData((prev) => ({ ...prev, ...updatedData }))
    setIsEditing(false)
    // In a real app, you would save to backend here
    console.log("Saving doctor profile:", updatedData)
  }

  // const handleScheduleSave = (updatedSchedule: Partial<Schedule[]>) => {
  //   setIsEditing(false)
  //   // In a real app, you would save schedule to backend here
  //   console.log("Saving doctor schedule:", updatedSchedule)
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">View and manage your professional information</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              className={isEditing ? "bg-gray-600 hover:bg-gray-700" : "bg-teal-600 hover:bg-teal-700"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <User className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar doctorData={doctorData} isEditing={isEditing} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <ProfileTabs
              doctorData={doctorData}
              isEditing={isEditing}
              onSave={handleSave}
              // onScheduleSave={handleScheduleSave}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfilePage
