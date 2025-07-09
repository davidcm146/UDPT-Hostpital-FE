import { useState, useMemo, useEffect, useCallback } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { AppointmentHeader } from "@/components/receptionist/appointments/AppointmentHeader"
import { AppointmentFilters } from "@/components/receptionist/appointments/AppointmentFilters"
import { AppointmentTabs } from "@/components/receptionist/appointments/AppointmentTabs"
import { AppointmentList } from "@/components/receptionist/appointments/AppointmentList"
import { AppointmentService } from "@/services/appointmentService"
import { mockAppointments } from "@/data/appointment"
import type { Appointment } from "@/types/appointment"

export default function AppointmentConfirmationPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [activeTab, setActiveTab] = useState("PENDING")
  const [showUrgentOnly, setShowUrgentOnly] = useState(false)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // Fetch appointments from API
  const fetchAppointments = useCallback(
    async (resetPage = false) => {
      const controller = new AbortController()
      setIsLoading(true)
      setError(null)

      try {
        const currentPage = resetPage ? 0 : page
        const params = {
          page: currentPage,
          size: 5,
          signal: controller.signal,
          ...(searchTerm && { reason: searchTerm }),
          ...(activeTab !== "all" && { status: activeTab }),
          ...(selectedTypes.length > 0 && { type: selectedTypes[0] }),
        }

        const response = await AppointmentService.getAppointments(params)

        if (resetPage) {
          setAppointments(response.data)
          setPage(0)
        } else {
          setAppointments((prev) => [...prev, ...response.data])
        }

        setTotalPages(response.totalPages)
        setTotalElements(response.totalElements)

        // If no appointments from API, use mock data as fallback
        if (response.data.length === 0 && currentPage === 0) {
          setAppointments(mockAppointments)
        }
      } catch (err) {
        console.error("Failed to fetch appointments:", err)
        setError("Failed to load appointments. Using offline data.")
        // Use mock data as fallback
        if (page === 0) {
          setAppointments(mockAppointments)
        }
      } finally {
        setIsLoading(false)
      }

      return () => controller.abort()
    },
    [page, searchTerm, activeTab, selectedTypes],
  )

  // Initial load and when filters change
  useEffect(() => {
    fetchAppointments(true)
  }, [searchTerm, activeTab, selectedTypes])

  // Handle filter changes
  const handleFilterChange = (urgent: boolean, statuses: string[], types: string[]) => {
    setShowUrgentOnly(urgent)
    setSelectedStatuses(statuses)
    setSelectedTypes(types)
  }

  // Filter appointments based on all criteria EXCEPT tab filter (for counting)
  const baseFilteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Parse date from startTime (format: "2025-07-09 08:15:00")
      const appointmentDate = new Date(appointment.startTime)

      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        (appointment.patientName && appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appointment.doctorName && appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        appointment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase())

      // Date filter
      const matchesDate = !selectedDate || appointmentDate.toDateString() === selectedDate.toDateString()

      // Urgent filter
      const isUrgent = appointment.type === "EMERGENCY"
      const matchesUrgent = !showUrgentOnly || isUrgent

      // Status filter (for local filtering when multiple statuses selected)
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(appointment.status)

      return matchesSearch && matchesDate && matchesUrgent && matchesStatus
    })
  }, [appointments, searchTerm, selectedDate, showUrgentOnly, selectedStatuses])

  // Filter appointments for display (includes tab filter)
  const filteredAppointments = useMemo(() => {
    return baseFilteredAppointments.filter((appointment) => {
      return activeTab === "all" || appointment.status === activeTab
    })
  }, [baseFilteredAppointments, activeTab])

  // Calculate counts for tabs (based on filtered results, not tab-specific)
  const tabCounts = useMemo(
    () => ({
      pending: baseFilteredAppointments.filter((apt) => apt.status === "PENDING").length,
      confirmed: baseFilteredAppointments.filter((apt) => apt.status === "CONFIRMED").length,
      cancelled: baseFilteredAppointments.filter((apt) => apt.status === "CANCELLED").length,
    }),
    [baseFilteredAppointments],
  )

  const handleEdit = (appointmentID: string) => {
    console.log("Edit appointment:", appointmentID)
  }

  const handleDecline = async (appointmentID: string) => {
    try {
      const appointment = appointments.find((apt) => apt.id === appointmentID)
      if (appointment) {
        // await AppointmentService.updateAppointmentStatus(appointment.id, "CANCELLED")
        setAppointments(
          appointments.map((apt) =>
            apt.id === appointmentID
              ? { ...apt, status: "CANCELLED" as const, updatedAt: new Date().toISOString() }
              : apt,
          ),
        )
      }
    } catch (error) {
      console.error("Failed to decline appointment:", error)
      // Still update locally for better UX
      setAppointments(
        appointments.map((apt) =>
          apt.id === appointmentID
            ? { ...apt, status: "CANCELLED" as const, updatedAt: new Date().toISOString() }
            : apt,
        ),
      )
    }
  }

  const handleLoadMore = () => {
    if (page < totalPages - 1) {
      setPage((prev) => prev + 1)
      fetchAppointments()
    }
  }

  const handleRefresh = () => {
    setPage(0)
    fetchAppointments(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <AppointmentHeader />
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AppointmentFilters
          searchTerm={searchTerm}
          selectedDate={selectedDate}
          onSearchChange={setSearchTerm}
          onDateChange={setSelectedDate}
          onFilterChange={handleFilterChange}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <AppointmentTabs activeTab={activeTab} onTabChange={setActiveTab} counts={tabCounts} />

          <TabsContent value="PENDING" className="mt-6">
            <AppointmentList
              appointments={filteredAppointments}
              emptyMessage="No pending appointments found"
              onEdit={handleEdit}
              onDecline={handleDecline}
            />
          </TabsContent>

          <TabsContent value="CONFIRMED" className="mt-6">
            <AppointmentList
              appointments={filteredAppointments}
              emptyMessage="No confirmed appointments found"
              onEdit={handleEdit}
            />
          </TabsContent>

          <TabsContent value="CANCELLED" className="mt-6">
            <AppointmentList appointments={filteredAppointments} emptyMessage="No cancelled appointments found" />
          </TabsContent>
        </Tabs>

        {/* Load More Button */}
        {page < totalPages - 1 && (
          <div className="flex justify-center mt-6">
            <Button onClick={handleLoadMore} disabled={isLoading} variant="outline" className="bg-transparent">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                `Load More (${appointments.length} of ${totalElements})`
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
