"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loading } from "@/components/ui/loading"
import { AppointmentCard } from "@/components/appointments/AppointmentCard"
import { AppointmentFilters } from "@/components/appointments/AppointmentFilters"
import { AppointmentDetailsDialog } from "@/components/appointments/AppointmentDetailsDialog"
import { AppointmentPagination } from "@/components/appointments/AppointmentPagination"
import { EmptyAppointment } from "@/components/appointments/EmptyAppointment"
import { AppointmentService } from "@/services/appointmentService"
import type { Appointment } from "@/types/appointment"
import { useAuth } from "@/hooks/AuthContext"

const AppointmentsPage = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("ALL")
  const [activeTab, setActiveTab] = useState("ALL")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const itemsPerPage = 4

  // Memoized function to load appointments
  const loadAppointments = useCallback(async () => {
    const controller = new AbortController()
    setIsLoading(true)

    try {
      const res = await AppointmentService.getAppointments({
        patientId: user?.sub,
        type: selectedType !== "ALL" ? selectedType : undefined,
        status: activeTab !== "ALL" ? activeTab : undefined,
        page: currentPage,
        size: itemsPerPage,
        signal: controller.signal,
      })
      setAppointments(res.data)
      setTotalPages(res.totalPages)
      setTotalElements(res.totalElements)
      console.log(res.data)
    } catch (err) {
      if (err !== "AbortError") {
        console.error("Failed to fetch appointments", err)
      }
    } finally {
      setIsLoading(false)
    }

    return () => controller.abort()
  }, [searchTerm, selectedType, activeTab, currentPage, itemsPerPage])

  // Load appointments when dependencies change
  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  // Reset page to 0 when filters change (but not when currentPage changes)
  useEffect(() => {
    setCurrentPage(0)
  }, [searchTerm, selectedType, activeTab])

  const openAppointmentDetails = (id: string) => {
    console.log(id)
    setSelectedAppointmentId(id)
    setDialogOpen(true)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    console.log("Edit appointment:", appointment.id)
  }

  const handleDeclineAppointment = (appointment: Appointment) => {
    console.log("Decline appointment:", appointment.id)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    // Page reset will be handled by the useEffect above
  }

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    // Page reset will be handled by the useEffect above
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    // Page reset will be handled by the useEffect above
  }

  if (isLoading) {
    return (
      <Loading
        message="Loading Appointments"
        subMessage="Retrieving your scheduled appointments and medical visits..."
        variant="pulse"
      />
    )
  }

  return (
    <div className="min-h-screen px-8 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600">Manage and view all your appointments</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <AppointmentFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {["ALL", "PENDING", "CONFIRMED", "CANCELLED"].map((status) => (
              <TabsTrigger key={status} value={status}>
                {status}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {totalElements === 0 ? 0 : currentPage * itemsPerPage + 1}-
                {Math.min((currentPage + 1) * itemsPerPage, totalElements)} of {totalElements} appointments
              </p>
              {totalPages > 1 && (
                <p className="text-sm text-gray-600">
                  Page {currentPage + 1} of {totalPages}
                </p>
              )}
            </div>

            {/* Appointment list */}
            {totalElements > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onViewDetails={() => openAppointmentDetails(appointment.id)}
                    onEdit={() => handleEditAppointment(appointment)}
                  />
                ))}
              </div>
            ) : (
              <EmptyAppointment />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <AppointmentPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </TabsContent>
        </Tabs>

        <AppointmentDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          appointmentId={selectedAppointmentId}
        />
      </div>
    </div>
  )
}

export default AppointmentsPage
