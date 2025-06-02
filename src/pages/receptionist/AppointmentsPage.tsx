"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList } from "lucide-react"
import { AppointmentFilters } from "@/components/receptionist/appointments/AppointmentFilters"
import { AppointmentCard } from "@/components/receptionist/appointments/AppointmentCard"
import { mockAppointments } from "@/data/appointment"
import type { Appointment } from "@/types/appointment"

const ReceptionistAppointmentListPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")

  // Mock data for patient and doctor names (in real app, this would come from API)
  const getPatientName = (patientID: string) => {
    const patientNames: Record<string, string> = {
      "550e8400-e29b-41d4-a716-446655440201": "John Smith",
      "550e8400-e29b-41d4-a716-446655440202": "Jane Doe",
      "550e8400-e29b-41d4-a716-446655440203": "Bob Johnson",
      "550e8400-e29b-41d4-a716-446655440204": "Alice Brown",
    }
    return patientNames[patientID] || "Unknown Patient"
  }

  const getDoctorName = (doctorID: string) => {
    const doctorNames: Record<string, string> = {
      "550e8400-e29b-41d4-a716-446655440001": "Dr. Sarah Wilson",
      "550e8400-e29b-41d4-a716-446655440002": "Dr. Michael Chen",
      "550e8400-e29b-41d4-a716-446655440003": "Dr. Emily Davis",
    }
    return doctorNames[doctorID] || "Unknown Doctor"
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const patientName = getPatientName(appointment.patientID)
    const doctorName = getDoctorName(appointment.doctorID)

    const matchesSearch =
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.appointmentID.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDate = selectedDate === "" || appointment.appointmentDate.toISOString().split("T")[0] === selectedDate

    return matchesSearch && matchesDate
  })

  const handleEditAppointment = (appointment: Appointment) => {
    console.log("Edit appointment:", appointment)
    // Implement edit functionality
  }

  const handleCancelAppointment = (appointmentID: string) => {
    setAppointments(
      appointments.map((apt) => (apt.appointmentID === appointmentID ? { ...apt, status: "cancelled" as const } : apt)),
    )
  }

  const handleDeleteAppointment = (appointmentID: string) => {
    setAppointments(appointments.filter((apt) => apt.appointmentID !== appointmentID))
  }

  // Group appointments by status
  const groupedAppointments = {
    pending: filteredAppointments.filter((apt) => apt.status === "pending"),
    confirmed: filteredAppointments.filter((apt) => apt.status === "confirmed"),
    completed: filteredAppointments.filter((apt) => apt.status === "completed"),
    cancelled: filteredAppointments.filter((apt) => apt.status === "cancelled"),
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Appointment List</h1>
        <p className="text-gray-600">View and manage all appointments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{groupedAppointments.pending.length}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">{groupedAppointments.confirmed.length}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{groupedAppointments.completed.length}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{groupedAppointments.cancelled.length}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="mr-2 h-5 w-5" />
            All Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6">
            <AppointmentFilters
              searchTerm={searchTerm}
              selectedDate={selectedDate}
              onSearchChange={setSearchTerm}
              onDateChange={setSelectedDate}
            />
          </div>

          {/* Appointments by Status */}
          <div className="space-y-6">
            {Object.entries(groupedAppointments).map(([status, appointments]) => (
              <div key={status}>
                <h3 className="text-lg font-semibold mb-3 capitalize">
                  {status} Appointments ({appointments.length})
                </h3>

                {appointments.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-gray-500">No {status} appointments found</CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.appointmentID}
                        appointment={appointment}
                        patientName={getPatientName(appointment.patientID)}
                        doctorName={getDoctorName(appointment.doctorID)}
                        onEdit={handleEditAppointment}
                        onCancel={handleCancelAppointment}
                        onDelete={handleDeleteAppointment}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReceptionistAppointmentListPage
