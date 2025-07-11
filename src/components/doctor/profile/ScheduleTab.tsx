import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Calendar, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DoctorScheduleResponse } from "@/types/schedule"
import type { Doctor } from "@/types/doctor"
import { ScheduleService } from "@/services/scheduleService"
import { toast } from "react-toastify"
import ScheduleItem from "./ScheduleItem"

interface ScheduleTabProps {
  doctorData: Doctor
  onSave?: (schedules: DoctorScheduleResponse[]) => void
}

const ScheduleTab = ({ doctorData, onSave }: ScheduleTabProps) => {
  const [schedules, setSchedules] = useState<DoctorScheduleResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedules = async () => {
    setLoading(true)
    setError(null)

    try {

      // Fetch all schedules for this doctor
      const doctorSchedules = await ScheduleService.fetchDoctorSchedules(doctorData.id)

      console.log("Fetched schedules:", doctorSchedules[0])
      setSchedules(doctorSchedules)
    } catch (error) {
      console.error("Error fetching schedules:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch schedules"
      setError(errorMessage)
      toast.error(errorMessage)
      setSchedules([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (doctorData.id) {
      fetchSchedules()
    }
  }, [doctorData.id])

  const handleRefresh = () => {
    fetchSchedules()
  }

  const handleSave = async () => {
    try {
      console.log("Saving schedules:", schedules)
      onSave?.(schedules)
      toast.success("Schedule saved successfully")
    } catch (error) {
      console.error("Error saving schedules:", error)
      toast.error("Failed to save schedule")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Schedule & Availability</CardTitle>
          <CardDescription>Loading schedule...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600" />
              <p className="text-gray-600">Loading your schedule...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Schedule & Availability</CardTitle>
          <CardDescription>Error loading schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Schedule</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Schedule & Availability</CardTitle>
            <CardDescription className="mt-2">View all your scheduled availability</CardDescription>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {schedules.map((schedule, index) => (
            <ScheduleItem
              key={index}
              schedule={schedule}
              date={new Date().toISOString().split("T")[0]} // You might want to pass actual date from API
            />
          ))}

          {schedules.length === 0 && !loading && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedules Found</h3>
              <p className="text-gray-600 mb-4">No schedules have been configured for this doctor.</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Schedule
              </Button>
            </div>
          )}          
        </div>
      </CardContent>
    </Card>
  )
}

export default ScheduleTab
