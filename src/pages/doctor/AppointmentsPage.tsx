import { useState, useMemo, useCallback, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Calendar, CalendarCheck, CalendarX, Search, Loader2, AlertCircle } from "lucide-react"
import { AppointmentConfirmationCard } from "@/components/doctor/appointments/AppointmentConfirmationCard"
import { AppointmentConfirmationFilters } from "@/components/doctor/appointments/AppointmentConfirmationFilters"
import { AppointmentConfirmationHeader } from "@/components/doctor/appointments/AppointmentConfirmationHeader"
import { AppointmentService } from "@/services/appointmentService"
import type { Appointment } from "@/types/appointment"
import { toast } from "react-toastify"
import { useAuth } from "@/hooks/AuthContext"

const DoctorAppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [showUrgentOnly, setShowUrgentOnly] = useState(false)
  const [selectedAppointmentTypes, setSelectedAppointmentTypes] = useState<string[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const { user } = useAuth();

  // Mock doctor ID - in real app this would come from authentication
  const currentDoctorID = user?.sub
  const itemsPerPage = 4

  // Fetch appointments from API
  const fetchAppointments = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await AppointmentService.getAppointments({
        doctorId: currentDoctorID,
        page: currentPage,
        size: itemsPerPage,
      })

      setAppointments(response.data)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (err) {
      // if (!error) toast.error("Failed to load appointments")
      setError("Failed to load appointments")
    } finally {
      setIsLoading(false)
    }
  }, [currentDoctorID, currentPage, itemsPerPage])

  // Load appointments on component mount and when page changes
  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  // Handle filter changes
  const handleFilterChange = useCallback((urgentOnly: boolean, types: string[]) => {
    setShowUrgentOnly(urgentOnly)
    setSelectedAppointmentTypes(types)
  }, [])

  // Handle appointment confirmation
  const handleConfirmAppointment = useCallback(async (appointmentID: string) => {
    try {
      // await AppointmentService.updateAppointmentStatus(appointmentID, "CONFIRMED")

      // Update local state
      setAppointments((prev) => prev.map((apt) => (apt.id === appointmentID ? { ...apt, status: "CONFIRMED" } : apt)))

      toast.success("Appointment confirmed successfully!")
    } catch (error) {
      console.error("Error confirming appointment:", error)
      toast.error("Failed to confirm appointment. Please try again.")
    }
  }, [])

  // Handle appointment decline
  const handleDeclineAppointment = useCallback(async (appointmentID: string, reason: string) => {
    try {
      // await AppointmentService.updateAppointmentStatus(appointmentID, "CANCELLED")

      // Update local state
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentID ? { ...apt, status: "CANCELLED", cancelReason: reason } : apt)),
      )

      toast.success("Appointment declined successfully!")
    } catch (error) {
      console.error("Error declining appointment:", error)
      toast.error("Failed to decline appointment. Please try again.")
    }
  }, [])

  // Filter appointments based on search query and filters
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === "" ||
        (appointment.patientName && appointment.patientName.toLowerCase().includes(searchLower)) ||
        appointment.patientId.toLowerCase().includes(searchLower) ||
        (appointment.reason && appointment.reason.toLowerCase().includes(searchLower))

      // Urgent filter (Emergency type is considered urgent)
      const matchesUrgent = !showUrgentOnly || appointment.type === "EMERGENCY"

      // Type filter
      const matchesType = selectedAppointmentTypes.length === 0 || selectedAppointmentTypes.includes(appointment.type)

      return matchesSearch && matchesUrgent && matchesType
    })
  }, [appointments, searchQuery, showUrgentOnly, selectedAppointmentTypes])

  // Group filtered appointments by status
  const appointmentsByStatus = useMemo(() => {
    return {
      pending: filteredAppointments.filter((apt) => apt.status === "PENDING"),
      confirmed: filteredAppointments.filter((apt) => apt.status === "CONFIRMED"),
      declined: filteredAppointments.filter((apt) => apt.status === "CANCELLED"),
    }
  }, [filteredAppointments])

  const clearAllFilters = () => {
    setSearchQuery("")
    setShowUrgentOnly(false)
    setSelectedAppointmentTypes([])
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600" />
              <p className="text-gray-600">Loading appointments...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Appointments</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchAppointments}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 space-y-6">
        <AppointmentConfirmationHeader />

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by patient name, ID, or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          <AppointmentConfirmationFilters onFilterChange={handleFilterChange} />
        </div>

        <Tabs defaultValue="pending" onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Pending Requests ({appointmentsByStatus.pending.length})
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="flex items-center">
              <CalendarCheck className="mr-2 h-4 w-4" />
              Confirmed ({appointmentsByStatus.confirmed.length})
            </TabsTrigger>
            <TabsTrigger value="declined" className="flex items-center">
              <CalendarX className="mr-2 h-4 w-4" />
              Declined ({appointmentsByStatus.declined.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="space-y-4">
              {appointmentsByStatus.pending.length > 0 ? (
                appointmentsByStatus.pending.map((appointment) => (
                  <AppointmentConfirmationCard
                    key={appointment.id}
                    appointment={appointment}
                    onConfirm={handleConfirmAppointment}
                    onDecline={handleDeclineAppointment}
                  />
                ))
              ) : (
                <div className="text-center p-8 bg-white rounded-lg border">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No pending appointments match your current filters.</p>
                  <button onClick={clearAllFilters} className="text-teal-600 hover:text-teal-700 underline">
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="confirmed">
            <div className="space-y-4">
              {appointmentsByStatus.confirmed.length > 0 ? (
                appointmentsByStatus.confirmed.map((appointment) => (
                  <AppointmentConfirmationCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <div className="text-center p-8 bg-white rounded-lg border">
                  <CalendarCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No confirmed appointments match your current filters.</p>
                  <button onClick={clearAllFilters} className="text-teal-600 hover:text-teal-700 underline">
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="declined">
            <div className="space-y-4">
              {appointmentsByStatus.declined.length > 0 ? (
                appointmentsByStatus.declined.map((appointment) => (
                  <AppointmentConfirmationCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <div className="text-center p-8 bg-white rounded-lg border">
                  <CalendarX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No declined appointments match your current filters.</p>
                  <button onClick={clearAllFilters} className="text-teal-600 hover:text-teal-700 underline">
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-2 text-sm bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-2 text-sm bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorAppointmentsPage
