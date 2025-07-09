"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Phone, Mail, MapPin, User, Calendar, Briefcase } from "lucide-react"
import type { Patient } from "@/types/patient"
import { calculateBMI, getBMICategory } from "@/data/patient"
import { calculateAge, formatHeight, formatWeight } from "@/lib/PatientUtils"

interface PatientDetailsProps {
  patient: Patient | null
  onEditPatient: (patient: Patient) => void
}

export function PatientDetails({ patient, onEditPatient }: PatientDetailsProps) {
  if (!patient) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Patient Details</h3>
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            Select a patient to view details
          </CardContent>
        </Card>
      </div>
    )
  }

  const bmi = patient.weight && patient.height ? calculateBMI(patient.height, patient.weight) : null
  const bmiCategory = bmi ? getBMICategory(bmi) : null

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Patient Details</h3>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium">{patient.name}</h4>
              <Badge variant="secondary">ID: {patient.id}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <span>{patient.phoneNumber}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">Date of Birth:</span>
                  <p>{patient.dob ? new Date(patient.dob).toLocaleDateString("en-US") : "Not recorded"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">Age & Gender:</span>
                  <p>{calculateAge(patient.dob)} years, {patient.gender}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <h5 className="font-medium mb-2">Physical Information</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Height:</span>
                  <p>{patient.height ? formatHeight(patient.height) : "Not recorded"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Weight:</span>
                  <p>{patient.weight ? formatWeight(patient.weight) : "Not recorded"}</p>
                </div>
                {bmi && (
                  <div>
                    <span className="text-sm text-gray-500">BMI:</span>
                    <p
                      className={`font-medium ${
                        bmiCategory === "Normal weight"
                          ? "text-green-600"
                          : bmiCategory === "Underweight"
                          ? "text-yellow-600"
                          : bmiCategory === "Overweight"
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {bmi} ({bmiCategory})
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-500">Blood Type:</span>
                  <p>{patient.bloodType}</p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-500">Address:</span>
              <p className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                {patient.address}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <h5 className="font-medium mb-2">Medical Information</h5>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Allergies:</span>
                  <p>{patient.allergies || "None"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Past Illness:</span>
                  <p>{patient.pastIllness || "None"}</p>
                </div>
                {patient.smokingStatus && (
                  <div>
                    <span className="text-sm text-gray-500">Smoking Status:</span>
                    <p>{patient.smokingStatus}</p>
                  </div>
                )}
                {patient.alcoholConsumption && (
                  <div>
                    <span className="text-sm text-gray-500">Alcohol Consumption:</span>
                    <p>{patient.alcoholConsumption}</p>
                  </div>
                )}
              </div>
            </div>

            {patient.occupation && (
              <div>
                <h5 className="font-medium mb-2">Occupation</h5>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                  <p>{patient.occupation}</p>
                </div>
              </div>
            )}

            <Button className="float-end" onClick={() => onEditPatient(patient)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Information
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
