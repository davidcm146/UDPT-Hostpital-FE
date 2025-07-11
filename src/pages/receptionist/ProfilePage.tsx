import { useState, useEffect } from "react"
import { ProfileDisplay } from "@/components/receptionist/profile/ProfileForm"
import { ProfileSidebar } from "@/components/receptionist/profile/ProfileSidebar"
import { currentReceptionist } from "@/data/receptionist"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, RefreshCw, AlertCircle } from "lucide-react"
import { Loading } from "@/components/ui/loading"
import { ReceptionistService } from "@/services/receptionistService"
import type { Receptionist } from "@/types/receptionist"
import { useAuth } from "@/hooks/AuthContext"

export default function ReceptionistProfilePage() {
  const [receptionist, setReceptionist] = useState<Receptionist | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth();

  const receptionistId = user?.sub as string

  const fetchReceptionistData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await ReceptionistService.getReceptionistById(receptionistId)
      setReceptionist(data)
    } catch (err) {
      setError("Failed to load profile data. Using offline data.")
      // Fallback to mock data if API fails
      setReceptionist(currentReceptionist)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReceptionistData()
  }, [receptionistId])

  const handleSave = (updatedReceptionist: Receptionist) => {
    setReceptionist(updatedReceptionist)
    setIsEditing(false)
  }

  const handleRefresh = () => {
    fetchReceptionistData()
  }

  // Show loading component during initial load
  if (isLoading) {
    return <Loading message="Loading Profile" subMessage="Fetching your profile information..." variant="heartbeat" />
  }

  // Show error if no receptionist data
  if (!receptionist) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Profile</h2>
          <p className="text-gray-600 mb-4">We couldn't load your profile information.</p>
          <Button onClick={handleRefresh} className="bg-teal-600 hover:bg-teal-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">View and manage your professional information</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="bg-teal-600 hover:bg-teal-700">
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <ProfileSidebar receptionist={receptionist} />
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <Tabs defaultValue="personal">
            <TabsList className="mb-6">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <ProfileDisplay
                receptionist={receptionist}
                onSave={handleSave}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
