"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarPlus } from "lucide-react"
import { AppointmentCard } from "@/components/appointments/AppointmentCard"
import { AppointmentFilters } from "@/components/appointments/AppointmentFilters"
import { AppointmentDetailsDialog } from "@/components/appointments/AppointmentDetailsDialog"
import { EmptyAppointment } from "@/components/appointments/EmptyAppointment"
import { mockAppointments } from "@/data/appointment"
import { getDoctorById } from "@/data/doctors"
import type { Appointment } from "@/types/appointment"

const AppointmentsPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("ALL")
  const [activeTab, setActiveTab] = useState("ALL")

  // Filter appointments based on search, type, and status
  const filteredAppointments = useMemo(() => {
    return mockAppointments.filter((appointment) => {
      const doctor = getDoctorById(appointment.doctorID)
      const doctorName = doctor?.name || ""

      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.type.toLowerCase().includes(searchTerm.toLowerCase())

      // Type filter
      const matchesType = selectedType === "ALL" || appointment.type === selectedType

      // Status filter (tab)
      const matchesStatus = activeTab === "ALL" || appointment.status === activeTab

      return matchesSearch && matchesType && matchesStatus
    })
  }, [mockAppointments, searchTerm, selectedType, activeTab])

  const openAppointmentDetails = (id: string) => {
    setSelectedAppointmentId(id)
    setDialogOpen(true)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    // TODO: Implement edit functionality
    console.log("Edit appointment:", appointment.appointmentID)
  }

  const handleDeclineAppointment = (appointment: Appointment) => {
    // TODO: Implement decline functionality
    console.log("Decline appointment:", appointment.appointmentID)
  }

  const getTabCount = (status: string) => {
    const typeFilteredAppointments = mockAppointments.filter((appointment) => {
      // Apply type filter
      const matchesType = selectedType === "ALL" || appointment.type === selectedType
      return matchesType
    })

    if (status === "ALL") return typeFilteredAppointments.length
    return typeFilteredAppointments.filter((apt) => apt.status === status).length
  }

  return (
    <div className="min-h-screen px-8 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600">Manage and view all your appointments</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Schedule New Appointment
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <AppointmentFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />
        </div>

        {/* Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="ALL" className="flex items-center gap-2">
              All
              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">{getTabCount("ALL")}</span>
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="flex items-center gap-2">
              Pending
              <span className="bg-yellow-200 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                {getTabCount("PENDING")}
              </span>
            </TabsTrigger>
            <TabsTrigger value="CONFIRMED" className="flex items-center gap-2">
              Confirmed
              <span className="bg-green-200 text-green-700 px-2 py-0.5 rounded-full text-xs">
                {getTabCount("CONFIRMED")}
              </span>
            </TabsTrigger>
            <TabsTrigger value="CANCELLED" className="flex items-center gap-2">
              Cancelled
              <span className="bg-red-200 text-red-700 px-2 py-0.5 rounded-full text-xs">
                {getTabCount("CANCELLED")}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {/* Results Summary */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredAppointments.length} of {mockAppointments.length} appointments
              </p>
            </div>

            {/* Appointments List */}
            {filteredAppointments.length > 0 ? (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.appointmentID}
                    appointment={appointment}
                    onViewDetails={() => openAppointmentDetails(appointment.appointmentID)}
                    onEdit={() => handleEditAppointment(appointment)}
                    onDecline={() => handleDeclineAppointment(appointment)}
                  />
                ))}
              </div>
            ) : (
              <EmptyAppointment />
            )}
          </TabsContent>
        </Tabs>

        <AppointmentDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          appointmentId={selectedAppointmentId}
          appointments={mockAppointments}
        />
      </div>
    </div>
  )
}

export default AppointmentsPage
