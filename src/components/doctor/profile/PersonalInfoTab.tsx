"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { User, BadgeIcon as IdCard, Mail, Phone, MapPin, Stethoscope } from "lucide-react"
import type { Doctor } from "@/types/doctor"

interface PersonalInfoTabProps {
  doctorData: Doctor
  isEditing: boolean
  onSave?: (data: Partial<Doctor>) => void
}

const PersonalInfoTab = ({ doctorData, isEditing, onSave }: PersonalInfoTabProps) => {
  const handleSave = () => {
    // In a real app, collect form data and call onSave
    onSave?.({
      firstName: doctorData.firstName,
      lastName: doctorData.lastName,
      specialty: doctorData.specialty,
      email: doctorData.email,
      phone: doctorData.phone,
      address: doctorData.address,
      licenseNumber: doctorData.licenseNumber,
      npiNumber: doctorData.npiNumber,
    })
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
              <Label htmlFor="firstName">First Name</Label>
              {isEditing ? (
                <Input id="firstName" defaultValue={doctorData.firstName} />
              ) : (
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{doctorData.firstName}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              {isEditing ? (
                <Input id="lastName" defaultValue={doctorData.lastName} />
              ) : (
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{doctorData.lastName}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="specialty">Specialty</Label>
              {isEditing ? (
                <Input id="specialty" defaultValue={doctorData.specialty} />
              ) : (
                <div className="flex items-center mt-1">
                  <Stethoscope className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{doctorData.specialty}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              {isEditing ? (
                <Input id="licenseNumber" defaultValue={doctorData.licenseNumber} />
              ) : (
                <div className="flex items-center mt-1">
                  <IdCard className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{doctorData.licenseNumber}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input id="email" type="email" defaultValue={doctorData.email} />
              ) : (
                <div className="flex items-center mt-1">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{doctorData.email}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input id="phone" defaultValue={doctorData.phone} />
              ) : (
                <div className="flex items-center mt-1">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{doctorData.phone}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="address">Office Address</Label>
              {isEditing ? (
                <Input id="address" defaultValue={doctorData.address} />
              ) : (
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{doctorData.address}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="npiNumber">NPI Number</Label>
              {isEditing ? (
                <Input id="npiNumber" defaultValue={doctorData.npiNumber} />
              ) : (
                <div className="flex items-center mt-1">
                  <IdCard className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{doctorData.npiNumber}</span>
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
