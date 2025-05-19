import { useState } from "react"
import { Link } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCalendarAlt,
  faCalendarCheck,
  faHistory,
  faCalendarPlus,
  faUserMd,
  faMapMarkerAlt,
  faStethoscope,
  faVial,
  faXRay,
} from "@fortawesome/free-solid-svg-icons"

// Mock data for upcoming examinations
const upcomingExaminations = [
  {
    id: 1,
    name: "Annual Physical Examination",
    type: "General Checkup",
    doctor: "Dr. Sarah Johnson",
    date: "May 20, 2025",
    time: "10:30 AM",
    location: "Main Hospital, Floor 3",
    status: "Confirmed",
    icon: faStethoscope,
  },
  {
    id: 2,
    name: "Blood Test - Lipid Panel",
    type: "Laboratory",
    doctor: "Dr. Michael Chen",
    date: "June 5, 2025",
    time: "2:15 PM",
    location: "Main Hospital Laboratory, Floor 1",
    status: "Confirmed",
    icon: faVial,
  },
  {
    id: 3,
    name: "Chest X-Ray",
    type: "Imaging",
    doctor: "Dr. Emily Rodriguez",
    date: "June 12, 2025",
    time: "9:45 AM",
    location: "Radiology Department, Floor 2",
    status: "Pending Approval",
    icon: faXRay,
  },
]

// Mock data for past examinations
const pastExaminations = [
  {
    id: 4,
    name: "Complete Blood Count (CBC)",
    type: "Laboratory",
    doctor: "Dr. Sarah Johnson",
    date: "April 15, 2025",
    time: "11:00 AM",
    location: "Main Hospital Laboratory, Floor 1",
    status: "Completed",
    icon: faVial,
    hasResults: true,
  },
  {
    id: 5,
    name: "Electrocardiogram (ECG)",
    type: "Cardiology",
    doctor: "Dr. Robert Kim",
    date: "March 22, 2025",
    time: "9:45 AM",
    location: "Cardiology Department, Floor 4",
    status: "Completed",
    icon: faStethoscope,
    hasResults: true,
  },
  {
    id: 6,
    name: "MRI Brain",
    type: "Imaging",
    doctor: "Dr. Michael Chen",
    date: "February 10, 2025",
    time: "3:30 PM",
    location: "Radiology Department, Floor 2",
    status: "Completed",
    icon: faXRay,
    hasResults: true,
  },
]

const ExaminationSchedulePage = () => {
  const [activeTab, setActiveTab] = useState("upcoming")

  return (
    <div className="container mx-auto px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Examination Schedule</h1>
          <p className="text-gray-600">Manage your upcoming and past medical examinations</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <FontAwesomeIcon icon={faCalendarPlus} className="mr-2 h-4 w-4" />
            Schedule New Examination
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming" className="flex items-center">
            <FontAwesomeIcon icon={faCalendarCheck} className="mr-2 h-4 w-4" />
            Upcoming Examinations
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center">
            <FontAwesomeIcon icon={faHistory} className="mr-2 h-4 w-4" />
            Examination History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingExaminations.length > 0 ? (
            <div className="space-y-4">
              {upcomingExaminations.map((examination) => (
                <ExaminationCard key={examination.id} examination={examination} isUpcoming={true} />
              ))}
            </div>
          ) : (
            <EmptyState type="upcoming" />
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastExaminations.length > 0 ? (
            <div className="space-y-4">
              {pastExaminations.map((examination) => (
                <ExaminationCard key={examination.id} examination={examination} isUpcoming={false} />
              ))}
            </div>
          ) : (
            <EmptyState type="past" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ExaminationCardProps {
  examination: {
    id: number
    name: string
    type: string
    doctor: string
    date: string
    time: string
    location: string
    status: string
    icon: any
    hasResults?: boolean
  }
  isUpcoming: boolean
}

const ExaminationCard = ({ examination, isUpcoming }: ExaminationCardProps) => {
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending approval":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <FontAwesomeIcon icon={examination.icon} className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{examination.name}</h4>
                <p className="text-sm text-gray-500">{examination.type}</p>
              </div>
            </div>
            <Badge variant="outline" className={`${getStatusColor(examination.status)}`}>
              {examination.status}
            </Badge>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex items-center text-sm">
              <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 text-gray-400 mr-2" />
              <span>
                {examination.date} • {examination.time}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <FontAwesomeIcon icon={faUserMd} className="h-4 w-4 text-gray-400 mr-2" />
              <span>{examination.doctor}</span>
            </div>
          </div>

          <div className="mt-2 flex items-center text-sm">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 text-gray-400 mr-2" />
            <span>{examination.location}</span>
          </div>

          <div className="mt-4 flex space-x-2">
            {isUpcoming ? (
              <>
                <Button className="bg-teal-600 hover:bg-teal-700">Check In</Button>
                <Button variant="outline">Reschedule</Button>
                <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                {examination.hasResults ? (
                  <Link to={`/examination-history/${examination.id}`}>
                    <Button className="bg-teal-600 hover:bg-teal-700">View Results</Button>
                  </Link>
                ) : (
                  <Button disabled>Results Pending</Button>
                )}
                <Button variant="outline">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 h-4 w-4" />
                  Schedule Follow-up
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface EmptyStateProps {
  type: "upcoming" | "past"
}

const EmptyState = ({ type }: EmptyStateProps) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg border">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <FontAwesomeIcon icon={type === "upcoming" ? faCalendarAlt : faHistory} className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">
        {type === "upcoming" ? "No Upcoming Examinations" : "No Examination History"}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {type === "upcoming"
          ? "You don't have any scheduled examinations at the moment."
          : "Your past examination history will appear here."}
      </p>
      {type === "upcoming" && (
        <Button className="bg-teal-600 hover:bg-teal-700">
          <FontAwesomeIcon icon={faCalendarPlus} className="mr-2 h-4 w-4" />
          Schedule an Examination
        </Button>
      )}
    </div>
  )
}

export default ExaminationSchedulePage
