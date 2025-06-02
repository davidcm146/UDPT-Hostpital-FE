"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Edit, Save, User, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Receptionist } from "@/types/receptionist"

interface ProfileDisplayProps {
  receptionist: Receptionist
  onSave: (receptionist: Receptionist) => void
}

export function ProfileDisplay({ receptionist, onSave }: ProfileDisplayProps) {
  const [isEditing, setIsEditing] = useState(false)
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

    // Simulate API call
    setTimeout(() => {
      onSave(formData)
      setIsLoading(false)
      setIsEditing(false)
    }, 1000)
  }

  const handleCancel = () => {
    setFormData({ ...receptionist })
    setIsEditing(false)
  }

  const initials = receptionist.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={receptionist.profilePicture || "/placeholder.svg"} alt={receptionist.name} />
                <AvatarFallback className="text-2xl bg-blue-600 text-white">{initials}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-10 w-10 rounded-full shadow-md border-2 border-white"
                >
                  <Camera className="h-5 w-5" />
                  <span className="sr-only">Upload photo</span>
                </Button>
              )}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{receptionist.name}</h2>
              <p className="text-lg text-gray-600">{receptionist.position}</p>
              <p className="text-sm text-gray-500">{receptionist.department}</p>
              <div className="mt-2 flex items-center justify-center md:justify-start gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
                <span className="text-sm text-gray-500">ID: {receptionist.employeeId}</span>
              </div>
            </div>
            <div className="ml-auto mt-4 md:mt-0">
              {!isEditing ? (
                <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Your personal and contact information</CardDescription>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input
                      id="employeeId"
                      name="employeeId"
                      value={formData.employeeId}
                      readOnly
                      className="bg-gray-50 w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Work Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      readOnly
                      className="bg-gray-50 w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      value={formData.department}
                      readOnly
                      className="bg-gray-50 w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="mt-1 text-base">{receptionist.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Employee ID</p>
                    <p className="mt-1 text-base">{receptionist.employeeId}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="mt-1 text-base">{receptionist.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="mt-1 text-base">{receptionist.phone}</p>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Work Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Position</p>
                    <p className="mt-1 text-base">{receptionist.position}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Department</p>
                    <p className="mt-1 text-base">{receptionist.department}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
