"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Heart, CreditCard } from "lucide-react"
import { mockPatientData } from "@/data/patient"
import type { Patient } from "@/types/patient"

import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileSidebar } from "@/components/profile/ProfileSidebar"
import { PersonalInformation } from "@/components/profile/PersonalInformation"
import { MedicalInformationTab } from "@/components/profile/MedicalInformationTab"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [patientData, setPatientData] = useState<Patient>(mockPatientData)

  const handleSaveChanges = () => {
    setIsEditing(false)
  }

  const handleCancelChanges = () => {
    setPatientData(mockPatientData)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen px-8 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader isEditing={isEditing} setIsEditing={setIsEditing} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar patientData={patientData} isEditing={isEditing} />
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
                <PersonalInformation patientData={patientData} isEditing={isEditing} onChange={setPatientData} />
              </TabsContent>

              {/* Medical Information Tab */}
              <TabsContent value="medical">
                <MedicalInformationTab patientData={patientData} isEditing={isEditing} onChange={setPatientData} />
              </TabsContent>
            </Tabs>
            {isEditing && (
              <div className="mt-6 flex justify-end">
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
