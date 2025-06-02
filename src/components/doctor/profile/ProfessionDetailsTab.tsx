"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { GraduationCap, Award, Briefcase, Languages, Stethoscope, X } from "lucide-react"
import type { Doctor } from "@/types/doctor"

interface ProfessionalDetailsTabProps {
  doctorData: Doctor
  isEditing: boolean
  onSave?: (data: Partial<Doctor>) => void
}

const ProfessionalDetailsTab = ({ doctorData, isEditing, onSave }: ProfessionalDetailsTabProps) => {
  const handleSave = () => {
    // In a real app, collect form data and call onSave
    onSave?.({
      education: doctorData.education,
      experience: doctorData.experience,
      certifications: doctorData.certifications,
      languages: doctorData.languages,
      specializations: doctorData.specializations,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Details</CardTitle>
        <CardDescription>Your education, certifications, and specializations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium flex items-center">
              <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
              Education & Training
            </h3>
            {isEditing ? (
              <Textarea className="mt-2" defaultValue={doctorData.education} rows={3} />
            ) : (
              <p className="mt-2 text-gray-700">{doctorData.education}</p>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium flex items-center">
              <Award className="h-4 w-4 text-gray-400 mr-2" />
              Certifications
            </h3>
            {isEditing ? (
              <div className="mt-2 space-y-2">
                {doctorData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center">
                    <Input defaultValue={cert} className="flex-1" />
                    <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 text-gray-400 hover:text-gray-500">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="mt-2">
                  Add Certification
                </Button>
              </div>
            ) : (
              <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
                {doctorData.certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium flex items-center">
                <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                Experience
              </h3>
              {isEditing ? (
                <Textarea className="mt-2" defaultValue={doctorData.experience} rows={3} />
              ) : (
                <p className="mt-2 text-gray-700">{doctorData.experience}</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium flex items-center">
                <Languages className="h-4 w-4 text-gray-400 mr-2" />
                Languages
              </h3>
              {isEditing ? (
                <div className="mt-2 space-y-2">
                  {doctorData.languages.map((lang, index) => (
                    <div key={index} className="flex items-center">
                      <Input defaultValue={lang} className="flex-1" />
                      <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 text-gray-400 hover:text-gray-500">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="mt-2">
                    Add Language
                  </Button>
                </div>
              ) : (
                <p className="mt-2 text-gray-700">{doctorData.languages.join(", ")}</p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium flex items-center">
              <Stethoscope className="h-4 w-4 text-gray-400 mr-2" />
              Specializations
            </h3>
            {isEditing ? (
              <div className="mt-2 space-y-2">
                {doctorData.specializations.map((spec, index) => (
                  <div key={index} className="flex items-center">
                    <Input defaultValue={spec} className="flex-1" />
                    <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 text-gray-400 hover:text-gray-500">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="mt-2">
                  Add Specialization
                </Button>
              </div>
            ) : (
              <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
                {doctorData.specializations.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
            )}
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfessionalDetailsTab
