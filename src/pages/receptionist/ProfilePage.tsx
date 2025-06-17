"use client"

import { useState } from "react"
import { ProfileDisplay } from "@/components/receptionist/profile/ProfileForm"
import { ProfileSidebar } from "@/components/receptionist/profile/ProfileSidebar"
import { currentReceptionist } from "@/data/receptionist"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, User } from "lucide-react"
import type { Receptionist } from "@/types/receptionist"

export default function ReceptionistProfilePage() {
  const [receptionist, setReceptionist] = useState<Receptionist>(currentReceptionist)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = (updatedReceptionist: Receptionist) => {
    setReceptionist(updatedReceptionist)
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">View and manage your professional information</p>
        </div>
        <Button onClick={() => setIsEditing(true)} className="bg-teal-600 hover:bg-teal-700">
          Edit Profile
        </Button>
      </div>

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
