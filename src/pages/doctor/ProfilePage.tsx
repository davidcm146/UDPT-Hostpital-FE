import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { User, Edit } from "lucide-react"
import { Loading } from "@/components/ui/loading"
import ProfileSidebar from "@/components/doctor/profile/ProfileSidebar"
import ProfileTabs from "@/components/doctor/profile/ProfileTabs"
import type { Doctor } from "@/types/doctor"
import { toast } from "react-toastify"
import { DoctorService } from "@/services/doctorService"

const DoctorProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [doctorData, setDoctorData] = useState<Doctor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock current doctor ID - in real app this would come from authentication
  const currentDoctorID = "fde7f72c-3156-4a00-95ae-873600eb2798"

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("Fetching doctor with ID:", currentDoctorID)
        const doctor = await DoctorService.getDoctorById(currentDoctorID)
        console.log("Fetched doctor data:", doctor)

        setDoctorData(doctor)
      } catch (error) {
        console.error("Failed to load doctor data", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to load doctor profile"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    if (currentDoctorID) {
      fetchDoctor()
    }
  }, [currentDoctorID])

  const handleSave = async (updatedData: Partial<Doctor>) => {
    if (!doctorData) return

    try {
      setIsSaving(true)
      console.log("Raw update response", updatedData)

      // Call the actual API to update the doctor profile
      const updatedDoctor = await DoctorService.updateDoctor(currentDoctorID, updatedData)

      console.log("Updated doctor data received:", updatedDoctor)

      // Update local state with the response from the server
      setDoctorData(updatedDoctor)
      setIsEditing(false)

      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Failed to update profile:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile"
      toast.error(`Failed to update profile: ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // If canceling edit, you might want to reset any unsaved changes
      setIsEditing(false)
      toast.info("Edit mode canceled")
    } else {
      setIsEditing(true)
    }
  }

  // Loading state with enhanced UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Loading
            message="Loading Doctor Profile"
            subMessage="Retrieving your professional information and settings..."
            variant="pulse"
          />
        </div>
      </div>
    )
  }

  // Error state
  if (error || !doctorData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
              <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-red-800 mb-2">Profile Load Failed</h2>
              <p className="text-red-600 mb-4">{error || "Unable to load your profile information."}</p>
              <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">View and manage your professional information</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              className={isEditing ? "bg-gray-600 hover:bg-gray-700" : "bg-teal-600 hover:bg-teal-700"}
              onClick={handleEditToggle}
              disabled={isSaving}
            >
              {isEditing ? (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Cancel Editing
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar doctorData={doctorData} isEditing={isEditing} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <ProfileTabs doctorData={doctorData} isEditing={isEditing} onSave={handleSave} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfilePage
