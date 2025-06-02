"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Download, Search } from "lucide-react"
import { mockPrescriptions, getPrescriptionWithDetails } from "@/data/prescription"
import { mockDoctorPatients } from "@/data/doctor-patients"
import { getMedicineById } from "@/data/medicine"
import { format } from "date-fns"
import { useState, useMemo } from "react"

interface PrescriptionStatisticsTableProps {
  filters: {
    category: string
    doctorId: string
    dateFrom: Date | undefined
    dateTo: Date | undefined
  }
}

export function PrescriptionStatisticsTable({ filters }: PrescriptionStatisticsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter and process prescription data for the table
  const prescriptionStats = useMemo(() => {
    return mockPrescriptions
      .filter((prescription) => {
        // Filter by doctor
        if (filters.doctorId !== "all" && prescription.doctorID !== filters.doctorId) {
          return false
        }

        // Filter by date range
        const createdDate = new Date(prescription.createdAt)
        if (filters.dateFrom && createdDate < filters.dateFrom) {
          return false
        }
        if (filters.dateTo) {
          const dateTo = new Date(filters.dateTo)
          dateTo.setHours(23, 59, 59, 999)
          if (createdDate > dateTo) {
            return false
          }
        }

        // Filter by medicine category
        if (filters.category !== "all") {
          const prescriptionWithDetails = getPrescriptionWithDetails(prescription.prescriptionID)
          if (!prescriptionWithDetails) return false

          // Check if any medicine in the prescription matches the category
          const hasMedicineInCategory = prescriptionWithDetails.details.some((detail) => {
            const medicine = getMedicineById(detail.medicineID)
            return medicine && medicine.category.toLowerCase() === filters.category.toLowerCase()
          })

          if (!hasMedicineInCategory) return false
        }

        return true
      })
      .map((prescription) => {
        const patient = mockDoctorPatients.find((p) => p.patientID === prescription.patientID)
        const prescriptionWithDetails = getPrescriptionWithDetails(prescription.prescriptionID)

        // Determine status based on prescription status
        const getStatusVariant = (status: string) => {
          switch (status) {
            case "active":
              return "default"
            case "pending":
              return "secondary"
            case "completed":
              return "outline"
            default:
              return "outline"
          }
        }

        return {
          id: prescription.prescriptionID,
          patientName: patient ? patient.name : "Unknown Patient",
          doctorName:
            filters.doctorId !== "all" && filters.doctorId === prescription.doctorID
              ? "Dr. Sarah Johnson"
              : prescription.doctorID === "550e8400-e29b-41d4-a716-446655440002"
                ? "Dr. Michael Chen"
                : prescription.doctorID === "550e8400-e29b-41d4-a716-446655440003"
                  ? "Dr. Emily Rodriguez"
                  : `Dr. ${prescription.doctorID.substring(0, 8)}`,
          medicineCount: prescriptionWithDetails?.details.length || 0,
          medicines:
            prescriptionWithDetails?.details
              .map((d) => {
                const medicine = getMedicineById(d.medicineID)
                return medicine ? medicine.name : "Unknown"
              })
              .join(", ") || "",
          totalPrice: `$${prescription.totalPrice.toFixed(2)}`,
          createdDate: format(new Date(prescription.createdAt), "MMM dd, yyyy"),
          status: prescription.status,
          statusVariant: getStatusVariant(prescription.status),
        }
      })
  }, [filters])

  // Further filter by search query
  const filteredPrescriptions = useMemo(() => {
    if (!searchQuery) return prescriptionStats

    const query = searchQuery.toLowerCase()
    return prescriptionStats.filter(
      (prescription) =>
        prescription.patientName.toLowerCase().includes(query) ||
        prescription.doctorName.toLowerCase().includes(query) ||
        prescription.id.toLowerCase().includes(query) ||
        prescription.medicines.toLowerCase().includes(query),
    )
  }, [prescriptionStats, searchQuery])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Prescription Details</CardTitle>
            <CardDescription>Comprehensive prescription information and statistics</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search prescriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prescription ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Medicines</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrescriptions.length > 0 ? (
                filteredPrescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell className="font-medium">{prescription.id}</TableCell>
                    <TableCell>{prescription.patientName}</TableCell>
                    <TableCell>{prescription.doctorName}</TableCell>
                    <TableCell>
                      {prescription.medicineCount > 0 ? `${prescription.medicineCount} medicines` : "No medicines"}
                    </TableCell>
                    <TableCell>{prescription.totalPrice}</TableCell>
                    <TableCell>{prescription.createdDate}</TableCell>
                    <TableCell>
                      <Badge variant={prescription.statusVariant as any}>
                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No prescriptions found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
