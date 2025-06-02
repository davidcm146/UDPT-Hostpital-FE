"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Phone, Mail, MapPin, User, Calendar } from "lucide-react"
import type { Patient } from "@/types/patient"
import { calculateBMI, getBMICategory, formatHeight, formatWeight } from "@/data/patient"

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
          <CardContent className="p-6 text-center text-gray-500">Select a patient to view details</CardContent>
        </Card>
      </div>
    )
  }

  // Calculate BMI if height and weight are available
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
              <Badge variant="secondary">Patient ID: {patient.patientID}</Badge>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">Date of Birth:</span>
                  <p>
                    {patient.dateOfBirth
                      ? new Date(patient.dateOfBirth).toLocaleDateString("en-US")
                      : "Not recorded"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">Age & Gender:</span>
                  <p>
                    {patient.age} years, {patient.gender}
                  </p>
                </div>
              </div>
            </div>

            {/* Physical Information */}
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

            {/* Address */}
            <div>
              <span className="text-sm text-gray-500">Address:</span>
              <p className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                {patient.address}
              </p>
            </div>

            {/* Medical Information */}
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
                {patient.currentMedications && (
                  <div>
                    <span className="text-sm text-gray-500">Current Medications:</span>
                    <p>{patient.currentMedications}</p>
                  </div>
                )}
                {patient.chronicConditions && (
                  <div>
                    <span className="text-sm text-gray-500">Chronic Conditions:</span>
                    <p>{patient.chronicConditions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h5 className="font-medium mb-2">Emergency Contact</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Name:</span>
                  <p>{patient.emergencyContactName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Phone:</span>
                  <p>{patient.emergencyContactPhone}</p>
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            {patient.insuranceProvider && (
              <div>
                <h5 className="font-medium mb-2">Insurance Information</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Provider:</span>
                    <p>{patient.insuranceProvider}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Policy Number:</span>
                    <p>{patient.insurancePolicyNumber}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patient.primaryPhysician && (
                <div>
                  <span className="text-sm text-gray-500">Primary Physician:</span>
                  <p>{patient.primaryPhysician}</p>
                </div>
              )}
              {patient.lastVisitDate && (
                <div>
                  <span className="text-sm text-gray-500">Last Visit:</span>
                  <p>{new Date(patient.lastVisitDate).toLocaleDateString("en-US")}</p>
                </div>
              )}
            </div>

            <Button onClick={() => onEditPatient(patient)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Information
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
