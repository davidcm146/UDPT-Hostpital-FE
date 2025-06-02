"use client"

import { useState } from "react"
import { ProfileDisplay } from "@/components/receptionist/profile/ProfileForm"
import { currentReceptionist } from "@/data/receptionist"
import type { Receptionist } from "@/types/receptionist"

export default function ReceptionistProfilePage() {
  const [receptionist, setReceptionist] = useState(currentReceptionist)

  const handleSave = (updatedReceptionist: Receptionist) => {
    setReceptionist(updatedReceptionist)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">View and manage your personal information</p>
      </div>

      <ProfileDisplay receptionist={receptionist} onSave={handleSave} />
    </div>
  )
}
