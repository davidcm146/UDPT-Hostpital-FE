import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pill, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { PrescriptionService } from "@/services/prescriptionService"
import type { Prescription } from "@/types/prescription"
import { PrescriptionList } from "../prescription/PrescriptionList"

interface MedicalRecordPrescriptionTabProps {
  medicalRecordId: string
  onViewPrescriptionDetails?: (prescriptionId: string) => void
}

export function MedicalRecordPrescriptionTab({
  medicalRecordId,
  onViewPrescriptionDetails,
}: MedicalRecordPrescriptionTabProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrescriptions = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await PrescriptionService.fetchPrescriptionsByMedicalRecord(medicalRecordId)
      setPrescriptions(data)
    } catch (err) {
      console.error("Failed to fetch prescriptions:", err)
      setError("Failed to load prescriptions. Please try again.")
      setPrescriptions([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (medicalRecordId) {
      fetchPrescriptions()
    }
  }, [medicalRecordId])

  const handleRefresh = () => {
    fetchPrescriptions()
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Prescriptions</CardTitle>
            <Button variant="outline" size="sm" disabled className="bg-transparent">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600 mr-2" />
            <span className="text-gray-600">Loading prescriptions...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Prescriptions</CardTitle>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="bg-transparent">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (prescriptions?.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Prescriptions</CardTitle>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="bg-transparent">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Pill className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              No prescriptions were issued for this medical record or they may be processed separately.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Prescriptions ({prescriptions?.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="bg-transparent">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <PrescriptionList prescriptions={prescriptions} />
      </CardContent>
    </Card>
  )
}
