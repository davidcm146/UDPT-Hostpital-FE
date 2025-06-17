import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateBMI, getBMICategory } from '@/data/patient'
import { calculateAge, formatHeight, formatWeight } from '@/lib/PatientUtils'
import { Patient } from '@/types/patient'
import { Activity, AlertTriangle, Calendar, Heart, History, Mail, MapPin, Phone, User } from 'lucide-react'

interface PatientDetailsInfoProps {
    patient: Patient | null
}

export const PatientDetailsInfo = ({ patient }: PatientDetailsInfoProps) => {

    const bmi = patient?.weight ? calculateBMI(patient.height, patient.weight) : 0
    const bmiCategory = bmi > 0 ? getBMICategory(bmi) : "Unknown"

    const getBMIColor = (category: string) => {
        switch (category) {
            case "Underweight":
                return "bg-blue-100 text-blue-800"
            case "Normal weight":
                return "bg-green-100 text-green-800"
            case "Overweight":
                return "bg-yellow-100 text-yellow-800"
            case "Obese":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }
    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <User className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="font-medium">Name:</span>
                                <span className="ml-2">{patient?.name}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="font-medium">Age:</span>
                                <span className="ml-2">
                                    {patient?.DOB ? `${calculateAge(patient.DOB)} years old` : "N/A"}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <User className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="font-medium">Gender:</span>
                                <span className="ml-2">{patient?.gender}</span>
                            </div>
                            <div className="flex items-center">
                                <Heart className="h-4 w-4 text-red-500 mr-2" />
                                <span className="font-medium">Blood Type:</span>
                                <span className="ml-2 font-bold text-red-600">{patient?.bloodType}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="font-medium">Phone:</span>
                                <span className="ml-2">{patient?.phone}</span>
                            </div>
                            <div className="flex items-center">
                                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="font-medium">Email:</span>
                                <span className="ml-2">{patient?.email}</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="font-medium">Address:</span>
                                <span className="ml-2">{patient?.address}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Vital Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle>Vital Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <Activity className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-500">Height</p>
                            <p className="text-lg font-bold">{formatHeight(patient?.height ?? 0)}</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <Activity className="h-6 w-6 text-green-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-500">Weight</p>
                            <p className="text-lg font-bold">{patient?.weight && formatWeight(patient.weight)}</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <Activity className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-500">BMI</p>
                            <p className="text-lg font-bold">{bmi > 0 ? bmi : "N/A"}</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <Activity className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-500">BMI Category</p>
                            {bmi > 0 && <Badge className={getBMIColor(bmiCategory)}>{bmiCategory}</Badge>}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="space-y-6">
                {/* Allergies */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                            Allergies
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={`p-4 rounded-lg ${patient?.allergies && patient.allergies !== "No known allergies"
                                ? "bg-red-50 border border-red-200"
                                : "bg-green-50 border border-green-200"
                                }`}
                        >
                            <p
                                className={
                                    patient?.allergies && patient.allergies !== "No known allergies"
                                        ? "text-red-800"
                                        : "text-green-800"
                                }
                            >
                                {patient?.allergies || "No known allergies"}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Past Illness */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <History className="h-5 w-5 text-purple-500 mr-2" />
                            Past Medical History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <p className="text-purple-800">{patient?.pastIllness || "No significant past medical history"}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Lifestyle Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lifestyle Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="font-medium text-gray-500">Smoking Status:</p>
                                <p className="text-gray-700">{patient?.smokingStatus}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">Alcohol Consumption:</p>
                                <p className="text-gray-700">{patient?.alcoholConsumption}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">Occupation:</p>
                                <p className="text-gray-700">{patient?.occupation}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}