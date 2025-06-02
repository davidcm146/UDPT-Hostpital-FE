import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, Calendar, Users, Heart, Mail, Phone, MapPin, Briefcase, Languages } from "lucide-react"
import type { Patient } from "@/types/patient"

interface PersonalInformationProps {
  patientData: Patient
  isEditing: boolean
}

export function PersonalInformation({ patientData, isEditing }: PersonalInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Basic personal and demographic information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input id="name" defaultValue={patientData.name} />
              ) : (
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patientData.name}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              {isEditing ? (
                <Input id="age" type="number" defaultValue={patientData.age} />
              ) : (
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patientData.age} years old</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              {isEditing ? (
                <Input id="dateOfBirth" type="date" defaultValue={patientData.dateOfBirth} />
              ) : (
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patientData.dateOfBirth && new Date(patientData.dateOfBirth).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              {isEditing ? (
                <select
                  id="gender"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={patientData.gender}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              ) : (
                <div className="flex items-center mt-1">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patientData.gender}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="maritalStatus">Marital Status</Label>
              {isEditing ? (
                <select
                  id="maritalStatus"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={patientData.maritalStatus}
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              ) : (
                <div className="flex items-center mt-1">
                  <Heart className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patientData.maritalStatus}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input id="email" type="email" defaultValue={patientData.email} />
              ) : (
                <div className="flex items-center mt-1">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patientData.email}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input id="phone" defaultValue={patientData.phone} />
              ) : (
                <div className="flex items-center mt-1">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patientData.phone}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              {isEditing ? (
                <Input id="address" defaultValue={patientData.address} />
              ) : (
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patientData.address}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="occupation">Occupation</Label>
              {isEditing ? (
                <Input id="occupation" defaultValue={patientData.occupation} />
              ) : (
                <div className="flex items-center mt-1">
                  <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patientData.occupation}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="preferredLanguage">Preferred Language</Label>
              {isEditing ? (
                <Input id="preferredLanguage" defaultValue={patientData.preferredLanguage} />
              ) : (
                <div className="flex items-center mt-1">
                  <Languages className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patientData.preferredLanguage}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <Button className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
