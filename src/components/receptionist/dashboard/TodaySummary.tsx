"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, Clock, TrendingUp } from "lucide-react"

interface TodaySummaryProps {
  stats: {
    completedToday: number
    cancelledToday: number
    pendingAppointments: number
    lowStockMedicines: number
  }
}

export function TodaySummary({ stats }: TodaySummaryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
            Today's Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Completed Appointments</span>
              <span className="font-medium text-green-600">{stats.completedToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Cancelled Appointments</span>
              <span className="font-medium text-red-600">{stats.cancelledToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Pending Appointments</span>
              <span className="font-medium text-blue-600">{stats.pendingAppointments}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.lowStockMedicines > 0 && (
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <p className="font-medium text-red-800">Low Stock Medicines</p>
                  <p className="text-sm text-red-600">{stats.lowStockMedicines} medicines need restocking</p>
                </div>
              </div>
            )}

            {stats.pendingAppointments > 0 && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="font-medium text-yellow-800">Pending Appointments</p>
                  <p className="text-sm text-yellow-600">{stats.pendingAppointments} appointments need confirmation</p>
                </div>
              </div>
            )}

            {stats.lowStockMedicines === 0 && stats.pendingAppointments === 0 && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-green-800">System Operating Normally</p>
                  <p className="text-sm text-green-600">No alerts</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
