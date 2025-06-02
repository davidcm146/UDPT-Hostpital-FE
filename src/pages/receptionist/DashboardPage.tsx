"use client"

import type React from "react"
import { DashboardStats } from "@/components/receptionist/dashboard/DashboardStats"
import { QuickActions } from "@/components/receptionist/dashboard/QuickActions"
import { TodaySummary } from "@/components/receptionist/dashboard/TodaySummary"

const ReceptionistDashboardPage: React.FC = () => {
  const stats = {
    todayAppointments: 12,
    pendingAppointments: 5,
    totalPatients: 150,
    lowStockMedicines: 3,
    completedToday: 7,
    cancelledToday: 2,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-600">Chào mừng bạn đến với hệ thống quản lý lễ tân</p>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats stats={stats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Today's Summary */}
      <TodaySummary stats={stats} />
    </div>
  )
}

export default ReceptionistDashboardPage
