"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPrescriptionBottleMedical,
  faCalendarAlt,
  faUserMd,
  faRedo,
  faExclamationCircle,
  faHistory,
  faPlus,
  faCheckCircle,
  faSearch,
} from "@fortawesome/free-solid-svg-icons"
import { Input } from "@/components/ui/input"

// Mock data for prescriptions
const activePrescriptions = [
  {
    id: 1,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    prescribedBy: "Dr. Sarah Johnson",
    prescribedDate: "April 15, 2025",
    refillsRemaining: 2,
    status: "Active",
    needsRefill: false,
  },
  {
    id: 2,
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily at bedtime",
    prescribedBy: "Dr. Sarah Johnson",
    prescribedDate: "April 15, 2025",
    refillsRemaining: 0,
    status: "Active",
    needsRefill: true,
  },
  {
    id: 3,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily with meals",
    prescribedBy: "Dr. Robert Kim",
    prescribedDate: "March 10, 2025",
    refillsRemaining: 3,
    status: "Active",
    needsRefill: false,
  },
]

const pastPrescriptions = [
  {
    id: 4,
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times daily",
    prescribedBy: "Dr. Emily Rodriguez",
    prescribedDate: "January 5, 2025",
    refillsRemaining: 0,
    status: "Completed",
    needsRefill: false,
  },
  {
    id: 5,
    name: "Prednisone",
    dosage: "10mg",
    frequency: "Once daily for 7 days",
    prescribedBy: "Dr. Michael Chen",
    prescribedDate: "December 10, 2024",
    refillsRemaining: 0,
    status: "Completed",
    needsRefill: false,
  },
]

const PrescriptionsPage = () => {
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter prescriptions based on search query
  const filteredActivePrescriptions = activePrescriptions.filter(
    (prescription) =>
      prescription.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.prescribedBy.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredPastPrescriptions = pastPrescriptions.filter(
    (prescription) =>
      prescription.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.prescribedBy.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600">Manage your medications and request refills</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
            Request New Prescription
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search prescriptions by name or doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="active" className="flex items-center">
            <FontAwesomeIcon icon={faPrescriptionBottleMedical} className="mr-2 h-4 w-4" />
            Active Medications ({filteredActivePrescriptions.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center">
            <FontAwesomeIcon icon={faHistory} className="mr-2 h-4 w-4" />
            Medication History ({filteredPastPrescriptions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {filteredActivePrescriptions.length > 0 ? (
            <div className="space-y-4">
              {filteredActivePrescriptions.map((prescription) => (
                <PrescriptionCard key={prescription.id} prescription={prescription} />
              ))}
            </div>
          ) : (
            <EmptyState type="active" searchQuery={searchQuery} />
          )}
        </TabsContent>

        <TabsContent value="past">
          {filteredPastPrescriptions.length > 0 ? (
            <div className="space-y-4">
              {filteredPastPrescriptions.map((prescription) => (
                <PrescriptionCard key={prescription.id} prescription={prescription} />
              ))}
            </div>
          ) : (
            <EmptyState type="past" searchQuery={searchQuery} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PrescriptionCardProps {
  prescription: {
    id: number
    name: string
    dosage: string
    frequency: string
    prescribedBy: string
    prescribedDate: string
    refillsRemaining: number
    status: string
    needsRefill: boolean
  }
}

const PrescriptionCard = ({ prescription }: PrescriptionCardProps) => {
  return (
    <Card className={prescription.needsRefill ? "border-orange-200 bg-orange-50" : ""}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                prescription.needsRefill ? "bg-orange-100" : "bg-blue-100"
              }`}
            >
              <FontAwesomeIcon
                icon={prescription.needsRefill ? faExclamationCircle : faPrescriptionBottleMedical}
                className={`h-5 w-5 ${prescription.needsRefill ? "text-orange-600" : "text-blue-600"}`}
              />
            </div>
            <div>
              <div className="flex items-center">
                <h4 className="font-medium text-gray-900">{prescription.name}</h4>
                <Badge
                  variant={prescription.needsRefill ? "outline" : "secondary"}
                  className={`ml-2 ${prescription.needsRefill ? "border-orange-500 text-orange-600" : ""}`}
                >
                  {prescription.needsRefill
                    ? "Refill Needed"
                    : prescription.status === "Active"
                      ? `${prescription.refillsRemaining} refills left`
                      : "Completed"}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                {prescription.dosage} • {prescription.frequency}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center text-sm">
            <FontAwesomeIcon icon={faUserMd} className="h-4 w-4 text-gray-400 mr-2" />
            <span>{prescription.prescribedBy}</span>
          </div>
          <div className="flex items-center text-sm">
            <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 text-gray-400 mr-2" />
            <span>Prescribed: {prescription.prescribedDate}</span>
          </div>
        </div>

        {prescription.status === "Active" && (
          <div className="mt-4 flex space-x-2">
            {prescription.needsRefill ? (
              <Button className="bg-orange-500 hover:bg-orange-600">
                <FontAwesomeIcon icon={faRedo} className="mr-2 h-4 w-4" />
                Request Refill
              </Button>
            ) : (
              <Button className="bg-teal-600 hover:bg-teal-700">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2 h-4 w-4" />
                View Details
              </Button>
            )}
            <Button variant="outline">Contact Doctor</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface EmptyStateProps {
  type: "active" | "past"
  searchQuery: string
}

const EmptyState = ({ type, searchQuery }: EmptyStateProps) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg border">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <FontAwesomeIcon
          icon={type === "active" ? faPrescriptionBottleMedical : faHistory}
          className="h-8 w-8 text-gray-400"
        />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">
        {searchQuery
          ? "No Matching Prescriptions"
          : type === "active"
            ? "No Active Prescriptions"
            : "No Prescription History"}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {searchQuery
          ? `No prescriptions match your search for "${searchQuery}".`
          : type === "active"
            ? "You don't have any active prescriptions at the moment."
            : "Your past prescription history will appear here."}
      </p>
      {searchQuery ? (
        <Button variant="outline" onClick={() => window.location.reload()}>
          Clear Search
        </Button>
      ) : (
        type === "active" && (
          <Button className="bg-teal-600 hover:bg-teal-700">
            <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
            Request New Prescription
          </Button>
        )
      )}
    </div>
  )
}

export default PrescriptionsPage
