"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Save, X, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { ReceptionistService } from "@/services/receptionistService"
import type { Receptionist } from "@/types/receptionist"
import { toast } from "react-toastify"

interface ProfileDisplayProps {
  receptionist: Receptionist
  onSave: (updatedReceptionist: Receptionist) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
}

export function ProfileDisplay({ receptionist, onSave, isEditing, setIsEditing }: ProfileDisplayProps) {
  const [formData, setFormData] = useState<Receptionist>(receptionist)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFormData(receptionist)
  }, [receptionist])

  const handleInputChange = (field: keyof Receptionist, value: string) => {
    setFormData({ ...formData, [field]: value })
    // Clear messages when user starts typing
    if (error) setError(null)
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedReceptionist = await ReceptionistService.updateReceptionist(receptionist.id, {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        dob: formData.dob,
        experience: formData.experience,
        education: formData.education,
      })

      onSave(updatedReceptionist)
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err)
      setError(err instanceof Error ? err.message : "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(receptionist)
    setIsEditing(false)
    setError(null)
  }

  if (!isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">Full Name</Label>
              <p className="mt-1 text-sm text-gray-900">{receptionist.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Email Address</Label>
              <p className="mt-1 text-sm text-gray-900">{receptionist.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
              <p className="mt-1 text-sm text-gray-900">{receptionist.phoneNumber || "Not provided"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Date of Birth</Label>
              <p className="mt-1 text-sm text-gray-900">
                {receptionist.dob
                  ? new Date(receptionist.dob).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not provided"}
              </p>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Address</Label>
            <p className="mt-1 text-sm text-gray-900">{receptionist.address || "Not provided"}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Experience</Label>
            <p className="mt-1 text-sm text-gray-900">{receptionist.experience || "Not provided"}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Education</Label>
            <p className="mt-1 text-sm text-gray-900">{receptionist.education || "Not provided"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Edit Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={isLoading}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={isLoading}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              disabled={isLoading}
              className="mt-2"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData?.dob?.toString() || ""}
              onChange={(e) => handleInputChange("dob", e.target.value)}
              disabled={isLoading}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            disabled={isLoading}
            className="mt-2"
            rows={2}
            placeholder="Enter your full address"
          />
        </div>

        <div>
          <Label htmlFor="experience">Experience</Label>
          <Textarea
            id="experience"
            value={formData.experience || ""}
            onChange={(e) => handleInputChange("experience", e.target.value)}
            disabled={isLoading}
            className="mt-2"
            rows={2}
            placeholder="Describe your work experience"
          />
        </div>

        <div>
          <Label htmlFor="education">Education</Label>
          <Textarea
            id="education"
            value={formData.education || ""}
            onChange={(e) => handleInputChange("education", e.target.value)}
            disabled={isLoading}
            className="mt-2"
            rows={2}
            placeholder="Describe your educational background"
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <Button onClick={handleSave} disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading} className="bg-transparent">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
