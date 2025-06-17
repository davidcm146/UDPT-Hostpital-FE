import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, X } from "lucide-react"
import type { Receptionist } from "@/types/receptionist"

interface ProfileDisplayProps {
  receptionist: Receptionist
  onSave: (receptionist: Receptionist) => void
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
}

export function ProfileDisplay({ receptionist, onSave, isEditing, setIsEditing }: ProfileDisplayProps) {
  const [formData, setFormData] = useState<Receptionist>({ ...receptionist })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      onSave(formData)
      setIsLoading(false)
    }, 1000)
  }

  const handleCancel = () => {
    setFormData({ ...receptionist })
    setIsEditing(false)
  }

  return (
    <Card className="bg-white shadow-sm border">
      <CardContent className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <p className="text-sm text-gray-500">Your basic personal and contact information</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Input id="education" name="education" value={formData.education} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Office Address</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
              >
                <Save className="h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Personal Information</h3>
              <p className="text-sm text-gray-500 mb-6">Your basic personal and contact information</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="mt-1 flex items-center gap-2">
                    <span className="text-gray-900">{receptionist.name}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="mt-1 text-gray-900">{receptionist.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Specialty</p>
                  <p className="mt-1 text-gray-900">{receptionist.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="mt-1 text-gray-900">{receptionist.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Education</p>
                  <p className="mt-1 text-gray-900">{receptionist.education}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Experience</p>
                  <p className="mt-1 text-gray-900">{receptionist.experience}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Office Address</p>
                  <p className="mt-1 text-gray-900">{receptionist.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
