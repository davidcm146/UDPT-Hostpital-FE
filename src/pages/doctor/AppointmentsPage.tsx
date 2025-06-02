"use client"

import { useState, useMemo, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Calendar, CalendarCheck, CalendarX, Search } from "lucide-react"
import { AppointmentConfirmationCard } from "@/components/doctor/appointments/AppointmentConfirmationCard"
import { AppointmentConfirmationFilters } from "@/components/doctor/appointments/AppointmentConfirmationFilters"
import { AppointmentConfirmationHeader } from "@/components/doctor/appointments/AppointmentConfirmationHeader"
import {
  mockDoctorAppointments,
  confirmAppointment,
  declineAppointment,
  confirmAllPendingAppointments,
} from "@/data/doctor-appointment"
import type { DoctorAppointment } from "@/data/doctor-appointment"

const DoctorAppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [showUrgentOnly, setShowUrgentOnly] = useState(false)
  const [selectedAppointmentTypes, setSelectedAppointmentTypes] = useState<string[]>([])
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(mockDoctorAppointments)

  // Mock doctor ID - in real app this would come from authentication
  const currentDoctorID = "550e8400-e29b-41d4-a716-446655440001"

  // Handle filter changes
  const handleFilterChange = useCallback((urgentOnly: boolean, types: string[]) => {
    setShowUrgentOnly(urgentOnly)
    setSelectedAppointmentTypes(types)
  }, [])

  // Handle appointment confirmation
  const handleConfirmAppointment = useCallback((appointmentID: string) => {
    if (confirmAppointment(appointmentID)) {
      setAppointments((prev) =>
        prev.map((apt) => (apt.appointmentID === appointmentID ? { ...apt, status: "confirmed" as const } : apt)),
      )
    }
  }, [])

  // Handle appointment decline
  const handleDeclineAppointment = useCallback((appointmentID: string, reason: string) => {
    if (declineAppointment(appointmentID, reason)) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.appointmentID === appointmentID ? { ...apt, status: "cancelled" as const, declineReason: reason } : apt,
        ),
      )
    }
  }, [])

  // Handle confirm all pending
  const handleConfirmAllPending = useCallback(() => {
    const confirmedCount = confirmAllPendingAppointments(currentDoctorID)
    if (confirmedCount > 0) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.status === "pending" && apt.doctorID === currentDoctorID ? { ...apt, status: "confirmed" as const } : apt,
        ),
      )
      alert(`${confirmedCount} appointments confirmed successfully!`)
    }
  }, [currentDoctorID])

  // Filter appointments based on search query and filters
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Only show appointments for current doctor
      if (appointment.doctorID !== currentDoctorID) return false

      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === "" ||
        appointment.patientName.toLowerCase().includes(searchLower) ||
        appointment.patientID.toLowerCase().includes(searchLower) ||
        appointment.reason.toLowerCase().includes(searchLower)

      // Urgent filter
      const matchesUrgent = !showUrgentOnly || appointment.isUrgent

      // Type filter
      const matchesType = selectedAppointmentTypes.length === 0 || selectedAppointmentTypes.includes(appointment.type)

      return matchesSearch && matchesUrgent && matchesType
    })
  }, [appointments, searchQuery, showUrgentOnly, selectedAppointmentTypes, currentDoctorID])

  // Group filtered appointments by status
  const appointmentsByStatus = useMemo(() => {
    return {
      pending: filteredAppointments.filter((apt) => apt.status === "pending"),
      confirmed: filteredAppointments.filter((apt) => apt.status === "confirmed"),
      declined: filteredAppointments.filter((apt) => apt.status === "cancelled"),
    }
  }, [filteredAppointments])

  const clearAllFilters = () => {
    setSearchQuery("")
    setShowUrgentOnly(false)
    setSelectedAppointmentTypes([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 space-y-6">
        <AppointmentConfirmationHeader onConfirmAll={handleConfirmAllPending} />

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
                    key={appointment.appointmentID}
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
                  <AppointmentConfirmationCard key={appointment.appointmentID} appointment={appointment} />
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
                  <AppointmentConfirmationCard key={appointment.appointmentID} appointment={appointment} />
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
      </div>
    </div>
  )
}

export default DoctorAppointmentsPage
