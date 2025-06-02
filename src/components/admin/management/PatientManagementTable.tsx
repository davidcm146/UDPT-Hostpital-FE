"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Edit, Trash2, MoreHorizontal, Phone, Mail } from "lucide-react"
import { useState } from "react"

const patients = [
  {
    id: "P-001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    age: 45,
    gender: "Male",
    registrationDate: "2024-01-15",
    lastVisit: "2024-01-20",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1 (555) 234-5678",
    age: 32,
    gender: "Female",
    registrationDate: "2024-01-10",
    lastVisit: "2024-01-18",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-003",
    name: "Bob Johnson",
    email: "bob.johnson@email.com",
    phone: "+1 (555) 345-6789",
    age: 67,
    gender: "Male",
    registrationDate: "2023-12-20",
    lastVisit: "2024-01-05",
    status: "Inactive",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-004",
    name: "Alice Brown",
    email: "alice.brown@email.com",
    phone: "+1 (555) 456-7890",
    age: 28,
    gender: "Female",
    registrationDate: "2024-01-08",
    lastVisit: "2024-01-22",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "P-005",
    name: "Charlie Wilson",
    email: "charlie.wilson@email.com",
    phone: "+1 (555) 567-8901",
    age: 55,
    gender: "Male",
    registrationDate: "2023-11-15",
    lastVisit: "2024-01-12",
    status: "Pending",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export function PatientManagementTable() {
  const [selectedPatients, setSelectedPatients] = useState<string[]>([])

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatients((prev) =>
      prev.includes(patientId) ? prev.filter((id) => id !== patientId) : [...prev, patientId],
    )
  }

  const handleSelectAll = () => {
    setSelectedPatients(selectedPatients.length === patients.length ? [] : patients.map((p) => p.id))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Patient Records</CardTitle>
            <CardDescription>Manage and update patient information</CardDescription>
          </div>
          {selectedPatients.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedPatients.length} selected</span>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Bulk Edit
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedPatients.length === patients.length}
                  onChange={handleSelectAll}
                  className="rounded border border-input"
                />
              </TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedPatients.includes(patient.id)}
                    onChange={() => handleSelectPatient(patient.id)}
                    className="rounded border border-input"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-muted-foreground">{patient.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3" />
                      {patient.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3" />
                      {patient.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.registrationDate}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      patient.status === "Active" ? "default" : patient.status === "Pending" ? "secondary" : "outline"
                    }
                  >
                    {patient.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Patient
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Patient
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
