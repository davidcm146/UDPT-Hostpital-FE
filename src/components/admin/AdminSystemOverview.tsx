"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Server, Database, Cpu, HardDrive, Wifi, Shield } from "lucide-react"

const systemMetrics = [
  {
    name: "Server Status",
    value: "Online",
    status: "healthy",
    icon: Server,
    details: "Uptime: 99.9%",
  },
  {
    name: "Database",
    value: "Connected",
    status: "healthy",
    icon: Database,
    details: "Response: 12ms",
  },
  {
    name: "CPU Usage",
    value: "45%",
    status: "normal",
    icon: Cpu,
    details: "8 cores active",
    progress: 45,
  },
  {
    name: "Storage",
    value: "67%",
    status: "normal",
    icon: HardDrive,
    details: "2.1TB / 3.2TB",
    progress: 67,
  },
  {
    name: "Network",
    value: "Stable",
    status: "healthy",
    icon: Wifi,
    details: "Latency: 8ms",
  },
  {
    name: "Security",
    value: "Secure",
    status: "healthy",
    icon: Shield,
    details: "Last scan: 2h ago",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "healthy":
      return (
        <Badge variant="default" className="bg-green-500">
          Healthy
        </Badge>
      )
    case "normal":
      return <Badge variant="secondary">Normal</Badge>
    case "warning":
      return <Badge variant="destructive">Warning</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export function AdminSystemOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Overview</CardTitle>
        <CardDescription>Current system health and performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {systemMetrics.map((metric) => (
            <div key={metric.name} className="flex items-center space-x-4 p-3 border rounded-lg">
              <metric.icon className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{metric.name}</h4>
                  {getStatusBadge(metric.status)}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-muted-foreground">{metric.details}</p>
                  <p className="text-sm font-medium">{metric.value}</p>
                </div>
                {metric.progress && <Progress value={metric.progress} className="mt-2" />}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
