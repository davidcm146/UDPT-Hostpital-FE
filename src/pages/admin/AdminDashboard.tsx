"use client"
import { AdminDashboardStats } from "@/components/admin/AdminDashboardStats"
import { AdminRecentActivity } from "@/components/admin/AdminRecentActivity"
import { AdminQuickActions } from "@/components/admin/AdminQuickActions"
import { AdminSystemOverview } from "@/components/admin/AdminSystemOverview"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of the healthcare management system</p>
      </div>

      <AdminDashboardStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminSystemOverview />
        </div>
        <div>
          <AdminQuickActions />
        </div>
      </div>

      <AdminRecentActivity />
    </div>
  )
}
