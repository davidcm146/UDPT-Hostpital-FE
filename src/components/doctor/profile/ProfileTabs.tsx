"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, GraduationCap, Calendar } from "lucide-react"
import PersonalInfoTab from "./PersonalInfoTab"
import ScheduleTab from "./ScheduleTab"
import type { Doctor } from "@/types/doctor"
import type { Schedule } from "@/types/schedule"

interface ProfileTabsProps {
  doctorData: Doctor
  isEditing: boolean
  onSave?: (data: Partial<Doctor>) => void
  // onScheduleSave?: (data: Partial<Schedule[]>) => void
}

const ProfileTabs = ({ doctorData, isEditing, onSave }: ProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState("personal")

  return (
    <Tabs defaultValue="personal" onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="personal" className="flex items-center">
          <User className="mr-2 h-4 w-4" />
          Personal Information
        </TabsTrigger>
        <TabsTrigger value="schedule" className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule & Availability
        </TabsTrigger>
      </TabsList>

      {/* Personal Information Tab */}
      <TabsContent value="personal">
        <PersonalInfoTab doctorData={doctorData} isEditing={isEditing} onSave={onSave} />
      </TabsContent>

      {/* Schedule Tab */}
      <TabsContent value="schedule">
        <ScheduleTab doctorData={doctorData}
        // isEditing={isEditing} 
        // onSave={onScheduleSave}
         />
      </TabsContent>
    </Tabs>
  )
}

export default ProfileTabs
