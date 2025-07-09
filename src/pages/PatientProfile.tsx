import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Heart, AlertCircle, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loading } from "@/components/ui/loading"
import { PatientService } from "@/services/patientService"
import { useAuth } from "@/hooks/AuthContext"
import { toast } from "react-toastify"
import type { Patient } from "@/types/patient"

// Import your existing components
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileSidebar } from "@/components/profile/ProfileSidebar"
import { PersonalInformation } from "@/components/profile/PersonalInformation"
import { MedicalInformationTab } from "@/components/profile/MedicalInformationTab"

export default function PatientProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [originalData, setOriginalData] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Use the patient ID from URL params or current user ID
  const patientId = "123456"

  const fetchPatient = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("Fetching patient with ID:", patientId)
      const data = await PatientService.getPatientById(patientId)
      setPatient(data)
      console.log("Fetched patient data:", data)
      // console.log("Patient DOB:", data.dob)
    } catch (err: any) {
      console.error("Error fetching patient:", err)
      setError(err.message || "Failed to fetch patient data")
      toast.error("Failed to load patient information")
    } finally {
      setIsLoading(false)
    }
  }

  const updatePatient = async (updatedData: Partial<Patient>) => {
    if (!patient) return false

    try {
      setIsSaving(true)
      console.log("Updating patient with data:", updatedData)

      // Call the actual API to update the patient
      const updatedPatient = await PatientService.updatePatient(patientId, updatedData)

      console.log("Updated patient data received:", updatedPatient)

      // Update local state with the response from the server
      setPatient(updatedPatient)
      toast.success("Patient information updated successfully")
      return true
    } catch (err: any) {
      console.error("Failed to update patient:", err)
      const errorMessage = err.message || "Failed to update patient information"
      toast.error(`Failed to update patient: ${errorMessage}`)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  // Fetch patient data on component mount
  useEffect(() => {
    if (patientId) {
      fetchPatient()
    }
  }, [patientId])

  // Store original data when entering edit mode
  useEffect(() => {
    if (isEditing && patient && !originalData) {
      setOriginalData({ ...patient })
    }
  }, [isEditing, patient, originalData])

  const handleSaveChanges = async () => {
    if (!patient) return

    const success = await updatePatient(patient)
    if (success) {
      setIsEditing(false)
      setOriginalData(null)
    }
  }

  const handleCancelChanges = () => {
    if (originalData) {
      setPatient(originalData)
    }
    setIsEditing(false)
    setOriginalData(null)
    toast.info("Changes cancelled")
  }

  const handleEditToggle = () => {
    if (isEditing) {
      handleCancelChanges()
    } else {
      setIsEditing(true)
    }
  }

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen px-8 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Loading
            message="Loading Patient Profile"
            subMessage="Retrieving patient information and medical records..."
            variant="medical"
          />
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !patient) {
    return (
      <div className="min-h-screen px-8 bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to Load Profile</h3>
              <p className="text-sm text-gray-600 mb-4">{error || "Patient information could not be retrieved."}</p>
              <div className="flex space-x-2">
                <Button onClick={fetchPatient} variant="outline" size="sm" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Try Again
                </Button>
                <Button onClick={() => navigate("/")} size="sm">
                  Go Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-8 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader
          isEditing={isEditing}
          setIsEditing={handleEditToggle}
          patientName={patient.name}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar patientData={patient} isEditing={isEditing} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="personal" onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="personal" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Personal Information
                </TabsTrigger>
                <TabsTrigger value="medical" className="flex items-center">
                  <Heart className="mr-2 h-4 w-4" />
                  Medical Information
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal">
                <PersonalInformation patientData={patient} isEditing={isEditing} onChange={setPatient} />
              </TabsContent>

              {/* Medical Information Tab */}
              <TabsContent value="medical">
                <MedicalInformationTab patientData={patient} isEditing={isEditing} onChange={setPatient} />
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            {isEditing && (
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={handleCancelChanges} disabled={isSaving}>
                  Cancel
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSaveChanges} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
