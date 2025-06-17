"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { AppointmentHeader } from "@/components/receptionist/appointments/AppointmentHeader"
import { AppointmentFilters } from "@/components/receptionist/appointments/AppointmentFilters"
import { AppointmentTabs } from "@/components/receptionist/appointments/AppointmentTabs"
import { AppointmentList } from "@/components/receptionist/appointments/AppointmentList"
import { mockAppointments } from "@/data/appointment"
import { getPatientById } from "@/data/patient"
import type { Appointment } from "@/types/appointment"

export default function AppointmentConfirmationPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [activeTab, setActiveTab] = useState("PENDING")
  const [showUrgentOnly, setShowUrgentOnly] = useState(false)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  // Handle filter changes
  const handleFilterChange = (urgent: boolean, statuses: string[], types: string[]) => {
    setShowUrgentOnly(urgent)
    setSelectedStatuses(statuses)
    setSelectedTypes(types)
  }

  // Check if any filters are active (excluding tab filter)
  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm !== "" ||
      selectedDate !== undefined ||
      showUrgentOnly ||
      selectedStatuses.length > 0 ||
      selectedTypes.length > 0
    )
  }, [searchTerm, selectedDate, showUrgentOnly, selectedStatuses, selectedTypes])

  // Filter appointments based on all criteria EXCEPT tab filter (for counting)
  const baseFilteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const patientName = getPatientById(appointment.patientID)?.name
      const appointmentDate =
        typeof appointment.appointmentDate === "string"
          ? new Date(appointment.appointmentDate)
          : appointment.appointmentDate

      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.appointmentID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase())

      // Date filter
      const matchesDate = !selectedDate || appointmentDate.toDateString() === selectedDate.toDateString()

      // Urgent filter
      const isUrgent = appointment.type === "EMERGENCY"
      const matchesUrgent = !showUrgentOnly || isUrgent

      // Status filter
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(appointment.status)

      // Type filter
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(appointment.type)

      return matchesSearch && matchesDate && matchesUrgent && matchesStatus && matchesType
    })
  }, [appointments, searchTerm, selectedDate, showUrgentOnly, selectedStatuses, selectedTypes])

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

  // Calculate total appointment counts (for header)
  const totalCounts = useMemo(
    () => ({
      pending: appointments.filter((apt) => apt.status === "PENDING").length,
      confirmed: appointments.filter((apt) => apt.status === "CONFIRMED").length,
      cancelled: appointments.filter((apt) => apt.status === "CANCELLED").length,
    }),
    [appointments],
  )

  const handleEdit = (appointmentID: string) => {
    console.log("Edit appointment:", appointmentID)
  }

  const handleDecline = (appointmentID: string) => {
    setAppointments(
      appointments.map((apt) =>
        apt.appointmentID === appointmentID ? { ...apt, status: "CANCELLED" as const, updatedAt: new Date() } : apt,
      ),
    )
  }

  const handleDelete = (appointmentID: string) => {
    setAppointments(appointments.filter((apt) => apt.appointmentID !== appointmentID))
  }

  const handleConfirmAllPending = () => {
    setAppointments(
      appointments.map((apt) =>
        apt.status === "PENDING" ? { ...apt, status: "CONFIRMED" as const, updatedAt: new Date() } : apt,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <AppointmentHeader pendingCount={totalCounts.pending} onConfirmAllPending={handleConfirmAllPending} />

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
      </div>
    </div>
  )
}
