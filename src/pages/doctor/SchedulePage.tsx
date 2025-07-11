import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Calendar, CalendarDays } from "lucide-react"
import { ScheduleHeader } from "@/components/doctor/schedule/ScheduleHeader"
import { DoctorScheduleCalendar } from "@/components/doctor/schedule/ScheduleCalendar"
import { DoctorScheduleList } from "@/components/doctor/schedule/ScheduleList"
import { useAuth } from "@/hooks/AuthContext"

const DoctorSchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("today");
  const { user } = useAuth();

  // In a real app, this would come from authentication context
  const currentDoctorID = user?.sub;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <ScheduleHeader />

          <Tabs defaultValue="today" onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="today" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Today's Schedule
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                Upcoming Schedule
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Calendar View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today">
              <DoctorScheduleList date={new Date()} isUpcoming={false} doctorID={currentDoctorID} />
            </TabsContent>

            <TabsContent value="upcoming">
              <DoctorScheduleList date={undefined} isUpcoming={true} doctorID={currentDoctorID} />
            </TabsContent>

            <TabsContent value="calendar">
              <DoctorScheduleCalendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                doctorID={currentDoctorID}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default DoctorSchedulePage
