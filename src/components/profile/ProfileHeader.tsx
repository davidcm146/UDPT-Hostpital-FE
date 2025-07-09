"use client"

import { Button } from "@/components/ui/button"
import { Edit, X } from "lucide-react"

interface ProfileHeaderProps {
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  patientName: string
}

export function ProfileHeader({ isEditing, setIsEditing, patientName }: ProfileHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Patient Profile</h1>
        <p className="text-gray-600 mt-1">{patientName}</p>
      </div>
      <Button
        onClick={() => setIsEditing(!isEditing)}
        variant={isEditing ? "outline" : "default"}
        className={isEditing ? "" : "bg-teal-600 hover:bg-teal-700"}
      >
        {isEditing ? (
          <>
            <X className="h-4 w-4 mr-2" />
            Cancel Edit
          </>
        ) : (
          <>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </>
        )}
      </Button>
    </div>
  )
}
