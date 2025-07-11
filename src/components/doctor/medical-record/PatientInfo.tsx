"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatDate } from "@/lib/DateTimeUtils"
import { calculateAge } from "@/lib/PatientUtils"
import { PatientService } from "@/services/patientService"
import type { Patient } from "@/types/patient"
import { AlertTriangle, Heart, Phone, User, Loader2 } from "lucide-react"

interface PatientInfoProps {
  patientId: string
}

export const PatientInfo = ({ patientId }: PatientInfoProps) => {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) {
        setError("No patient ID provided")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const fetchedPatient = await PatientService.getPatientById(patient?.id as string);
        setPatient(fetchedPatient)
      } catch (err) {
        console.error("Error fetching patient:", err)
        setError("Failed to load patient information")
        setPatient(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatient()
  }, [patientId])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600 mr-3" />
            <span className="text-gray-600">Loading patient information...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !patient) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error || "Patient information could not be loaded"}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
            <AvatarFallback className="text-lg">
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-2xl font-semibold">{patient.name}</h3>
            <div className="flex items-center text-sm text-gray-500 space-x-4 mt-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>
                  {calculateAge(patient.dob)} years, {patient.gender}
                </span>
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1 text-red-500" />
                <span>{patient.bloodType}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                <span>{patient.phoneNumber}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-900 text-lg">Personal Information</h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">{patient.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-gray-900">{patient.address}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                <p className="text-gray-900">
                  {formatDate(patient.dob)} ({calculateAge(patient.dob)} years)
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Occupation</p>
                <p className="text-gray-900">{patient.occupation || "Not specified"}</p>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-900 text-lg">Medical Information</h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Height</p>
                <p className="text-gray-900">{patient.height} cm</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Weight</p>
                <p className="text-gray-900">{patient.weight} kg</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">BMI</p>
                <p className="text-gray-900">
                  {(patient.weight / ((patient.height / 100) * (patient.height / 100))).toFixed(1)}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Blood Type</p>
                <p className="text-gray-900">{patient.bloodType}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Health History */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-6 text-lg">Health History</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Allergies</p>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center">
                    {patient.allergies && patient.allergies !== "No known allergies" ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                        <span className="text-yellow-700">{patient.allergies}</span>
                      </>
                    ) : (
                      <span className="text-gray-700">No known allergies</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Past Illness</p>
                <p className="text-gray-900">{patient.pastIllness || "None reported"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Smoking Status</p>
                <p className="text-gray-900">{patient.smokingStatus || "Not specified"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Alcohol Consumption</p>
                <p className="text-gray-900">{patient.alcoholConsumption || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
