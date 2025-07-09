"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, MapPin, Stethoscope, GraduationCap } from "lucide-react"
import type { Doctor } from "@/types/doctor"

interface PersonalInfoTabProps {
  doctorData: Doctor
  isEditing: boolean
  onSave?: (data: Partial<Doctor>) => void
}

const PersonalInfoTab = ({ doctorData, isEditing, onSave }: PersonalInfoTabProps) => {
  const [formData, setFormData] = useState<Partial<Doctor>>({})

  // Cập nhật formData khi doctorData thay đổi
  useEffect(() => {
    setFormData(doctorData)
  }, [doctorData])

  const handleChange = (field: keyof Doctor, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    onSave?.(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Your basic personal and contact information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name || ""}
                  className="mt-2"
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{doctorData.name}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="specialty">Specialty</Label>
              {isEditing ? (
                <Input
                  id="specialty"
                  value={formData.specialty || ""}
                  className="mt-2"
                  onChange={(e) => handleChange("specialty", e.target.value)}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <Stethoscope className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{doctorData.specialty}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="education">Education</Label>
              {isEditing ? (
                <Input
                  id="education"
                  value={formData.education || ""}
                  className="mt-2"
                  onChange={(e) => handleChange("education", e.target.value)}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{doctorData.education}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="experience">Experience</Label>
              {isEditing ? (
                <Input
                  id="experience"
                  value={formData.experience || ""}
                  className="mt-2"
                  onChange={(e) => handleChange("experience", e.target.value)}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{doctorData.experience}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  className="mt-2"
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{doctorData.email}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber || ""}
                  className="mt-2"
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{doctorData.phoneNumber}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="address">Office Address</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={formData.address || ""}
                  className="mt-2"
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{doctorData.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PersonalInfoTab
