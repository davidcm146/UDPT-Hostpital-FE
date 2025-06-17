import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { User, Calendar, Users, Mail, Phone, MapPin, Briefcase } from "lucide-react"
import type { Patient } from "@/types/patient"
import { calculateAge } from "@/lib/PatientUtils"

interface PersonalInformationProps {
  patientData: Patient
  isEditing: boolean
  onChange: (data: Patient) => void
}

export function PersonalInformation({ patientData, isEditing, onChange }: PersonalInformationProps) {
  const handleFieldChange = (field: keyof Patient, value: any) => {
    onChange({ ...patientData, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Basic personal and demographic information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={patientData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patientData.name}</span>
                </div>
              )}
            </div>

            {/* Age (chỉ hiển thị, không chỉnh sửa trực tiếp) */}
            <div>
              <Label htmlFor="age">Age</Label>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <span>{calculateAge(patientData.DOB)} years old</span>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              {isEditing ? (
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={patientData.DOB ? new Date(patientData.DOB).toISOString().split("T")[0] : ""}
                  onChange={(e) => handleFieldChange("DOB", e.target.value)}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patientData.DOB && new Date(patientData.DOB).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Gender */}
            <div>
              <Label htmlFor="gender">Gender</Label>
              {isEditing ? (
                <select
                  id="gender"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={patientData.gender}
                  onChange={(e) => handleFieldChange("gender", e.target.value)}
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
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={patientData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patientData.email}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={patientData.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patientData.phone}</span>
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={patientData.address}
                  onChange={(e) => handleFieldChange("address", e.target.value)}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patientData.address}</span>
                </div>
              )}
            </div>

            {/* Occupation */}
            <div>
              <Label htmlFor="occupation">Occupation</Label>
              {isEditing ? (
                <Input
                  id="occupation"
                  value={patientData.occupation}
                  onChange={(e) => handleFieldChange("occupation", e.target.value)}
                />
              ) : (
                <div className="flex items-center mt-1">
                  <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patientData.occupation}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
