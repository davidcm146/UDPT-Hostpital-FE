"use client"

import { Button } from "@/components/ui/button"
import { User, Edit } from "lucide-react"

interface ProfileHeaderProps {
  isEditing: boolean
  setIsEditing: (value: boolean) => void
}

export function ProfileHeader({ isEditing, setIsEditing }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patient Profile</h1>
        <p className="text-gray-600">View and manage patient information</p>
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
  )
}
