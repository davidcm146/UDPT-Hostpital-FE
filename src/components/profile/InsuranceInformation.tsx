import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CreditCard, BadgeIcon as IdCard, Shield, Camera } from "lucide-react"
import type { Patient } from "@/types/patient"

interface InsuranceInformationProps {
  patientData: Patient
  isEditing: boolean
}

export function InsuranceInformation({ patientData, isEditing }: InsuranceInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Information</CardTitle>
        <CardDescription>Health insurance details and coverage information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="insuranceProvider">Insurance Provider</Label>
            {isEditing ? (
              <Input id="insuranceProvider" defaultValue={patientData.insuranceProvider} />
            ) : (
              <div className="flex items-center mt-1">
                <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                <span>{patientData.insuranceProvider}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
            {isEditing ? (
              <Input id="insurancePolicyNumber" defaultValue={patientData.insurancePolicyNumber} />
            ) : (
              <div className="flex items-center mt-1">
                <IdCard className="h-4 w-4 text-gray-400 mr-2" />
                <span>{patientData.insurancePolicyNumber}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-700">Insurance Card</h4>
              <p className="text-sm text-blue-600 mt-1">
                Please bring your insurance card to all appointments. You can also upload a digital copy for our
                records.
              </p>
              {isEditing && (
                <Button variant="outline" className="mt-3 bg-white">
                  <Camera className="mr-2 h-4 w-4" />
                  Upload Insurance Card
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
