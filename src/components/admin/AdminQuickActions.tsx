"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, FileText, Download, Settings, RefreshCw, Shield } from "lucide-react"

const quickActions = [
  {
    title: "Add New Patient",
    description: "Register a new patient",
    icon: UserPlus,
    action: () => console.log("Add patient"),
  },
  {
    title: "Generate Report",
    description: "Create system report",
    icon: FileText,
    action: () => console.log("Generate report"),
  },
  {
    title: "Export Data",
    description: "Download patient data",
    icon: Download,
    action: () => console.log("Export data"),
  },
  {
    title: "System Settings",
    description: "Configure system",
    icon: Settings,
    action: () => console.log("System settings"),
  },
  {
    title: "Backup System",
    description: "Create system backup",
    icon: RefreshCw,
    action: () => console.log("Backup system"),
  },
  {
    title: "Security Audit",
    description: "Run security check",
    icon: Shield,
    action: () => console.log("Security audit"),
  },
]

export function AdminQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {quickActions.map((action) => (
            <Button key={action.title} variant="ghost" className="justify-start h-auto p-3" onClick={action.action}>
              <action.icon className="mr-3 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
