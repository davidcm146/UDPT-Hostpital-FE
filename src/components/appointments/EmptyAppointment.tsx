"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarPlus, Calendar } from "lucide-react"

export const EmptyAppointment = () => {
  return (
    <Card className="text-center py-12">
      <CardContent className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
          <Calendar className="h-8 w-8 text-teal-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">No appointments found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            No appointments match your current filters. Try adjusting your search criteria or schedule a new
            appointment.
          </p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Schedule New Appointment
        </Button>
      </CardContent>
    </Card>
  )
}
