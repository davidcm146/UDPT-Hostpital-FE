import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Download, Search } from "lucide-react"
import { mockDoctorPatients } from "@/data/doctor-patients"
import { calculateBMI, getBMICategory } from "@/data/patient"
import { format } from "date-fns"
import { useState, useMemo } from "react"

interface PatientStatisticsTableProps {
  filters: {
    ageGroup: string
    gender: string
    dateFrom: Date | undefined
    dateTo: Date | undefined
  }
}

export function PatientStatisticsTable({ filters }: PatientStatisticsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Process and filter patient data for the table
  const patientStats = useMemo(() => {
    return mockDoctorPatients
      .filter((patient) => {
        // Filter by age group
        if (filters.ageGroup !== "all") {
          const age = new Date().getFullYear() - new Date(patient.dateOfBirth ? patient.dateOfBirth : "").getFullYear()
          const [minAge, maxAge] = filters.ageGroup.includes("+")
            ? [Number.parseInt(filters.ageGroup), 150]
            : filters.ageGroup.split("-").map(Number)

          if (!(age >= minAge && (maxAge ? age <= maxAge : true))) {
            return false
          }
        }

        // Filter by gender
        if (filters.gender !== "all" && patient.gender.toLowerCase() !== filters.gender.toLowerCase()) {
          return false
        }

        // Filter by registration date range
        const registrationDate = new Date(patient.registrationDate ? patient.registrationDate : "")
        if (filters.dateFrom && registrationDate < filters.dateFrom) {
          return false
        }
        if (filters.dateTo) {
          const dateTo = new Date(filters.dateTo)
          dateTo.setHours(23, 59, 59, 999)
          if (registrationDate > dateTo) {
            return false
          }
        }

        return true
      })
      .map((patient) => {
        const age = new Date().getFullYear() - new Date(patient.dateOfBirth ? patient.dateOfBirth : "").getFullYear()
        const bmi = patient.weight && patient.height ? calculateBMI(patient.height, patient.weight) : null
        const bmiCategory = bmi ? getBMICategory(bmi) : "N/A"

        // Determine status based on last visit
        let status = "Inactive"
        if (patient.lastVisitDate) {
          const lastVisit = new Date(patient.lastVisitDate)
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          status = lastVisit > thirtyDaysAgo ? "Active" : "Inactive"
        }

        return {
          id: patient.patientID,
          name: patient.name,
          age,
          gender: patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1),
          registrationDate: format(new Date(patient.registrationDate ? patient.registrationDate : ""
          ), "MMM dd, yyyy"),
          lastVisit: patient.lastVisitDate ? format(new Date(patient.lastVisitDate), "MMM dd, yyyy") : "Never",
          bmi: bmi ? bmi.toFixed(1) : "N/A",
          bmiCategory,
          status,
          phone: patient.phone,
          email: patient.email,
        }
      })
  }, [filters])

  // Further filter by search query
  const filteredPatients = useMemo(() => {
    if (!searchQuery) return patientStats

    const query = searchQuery.toLowerCase()
    return patientStats.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.id.toLowerCase().includes(query) ||
        patient.email?.toLowerCase().includes(query) ||
        patient.phone?.includes(query),
    )
  }, [patientStats, searchQuery])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Patient Details</CardTitle>
            <CardDescription>Comprehensive patient information and statistics</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
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
                <TableHead>Patient ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>BMI</TableHead>
                <TableHead>BMI Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.id}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.registrationDate}</TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell>{patient.bmi}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          patient.bmiCategory === "Normal weight"
                            ? "default"
                            : patient.bmiCategory === "Overweight"
                              ? "secondary"
                              : patient.bmiCategory === "Obese"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {patient.bmiCategory}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={patient.status === "Active" ? "default" : "secondary"}>{patient.status}</Badge>
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
                  <TableCell colSpan={10} className="h-24 text-center">
                    No patients found matching your criteria.
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
