"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"
import { mockPrescriptions, mockPrescriptionDetails } from "@/data/prescription"
import { getMedicineById } from "@/data/medicine"
import { useMemo } from "react"

interface PrescriptionStatisticsChartsProps {
  filters: {
    category: string
    doctorId: string
    dateFrom: Date | undefined
    dateTo: Date | undefined
  }
}

export function PrescriptionStatisticsCharts({ filters }: PrescriptionStatisticsChartsProps) {
  // Filter prescriptions based on the selected filters
  const filteredPrescriptions = useMemo(() => {
    return mockPrescriptions.filter((prescription) => {
      // Filter by doctor
      if (filters.doctorId !== "all" && prescription.doctorID !== filters.doctorId) {
        return false
      }

      // Filter by date range
      const createdDate = new Date(prescription.createdAt)
      if (filters.dateFrom && createdDate < filters.dateFrom) {
        return false
      }
      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo)
        dateTo.setHours(23, 59, 59, 999)
        if (createdDate > dateTo) {
          return false
        }
      }

      return true
    })
  }, [filters])

  // Filter prescription details based on filtered prescriptions and category
  const filteredPrescriptionDetails = useMemo(() => {
    const prescriptionIds = filteredPrescriptions.map((p) => p.prescriptionID)

    return mockPrescriptionDetails.filter((detail) => {
      // Filter by prescription ID (from filtered prescriptions)
      if (!prescriptionIds.includes(detail.prescriptionID)) {
        return false
      }

      // Filter by medicine category
      if (filters.category !== "all") {
        const medicine = getMedicineById(detail.medicineID)
        if (!medicine || medicine.category.toLowerCase() !== filters.category.toLowerCase()) {
          return false
        }
      }

      return true
    })
  }, [filteredPrescriptions, filters.category])

  // Monthly prescription trends
  const monthlyPrescriptions = useMemo(() => {
    return filteredPrescriptions.reduce((acc: Record<string, { count: number; cost: number }>, prescription) => {
      const date = new Date(prescription.createdAt)
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!acc[monthYear]) {
        acc[monthYear] = { count: 0, cost: 0 }
      }
      acc[monthYear].count += 1
      acc[monthYear].cost += prescription.totalPrice

      return acc
    }, {})
  }, [filteredPrescriptions])

  const monthlyData = useMemo(() => {
    return Object.entries(monthlyPrescriptions)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([month, data]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        prescriptions: data.count,
        cost: data.cost,
      }))
  }, [monthlyPrescriptions])

  // Medicine category distribution from prescription details
  const medicineCategories = useMemo(() => {
    return filteredPrescriptionDetails.reduce((acc: Record<string, number>, detail) => {
      const medicine = getMedicineById(detail.medicineID)
      if (medicine) {
        acc[medicine.category] = (acc[medicine.category] || 0) + 1
      }
      return acc
    }, {})
  }, [filteredPrescriptionDetails])

  const categoryData = useMemo(() => {
    return Object.entries(medicineCategories).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / filteredPrescriptionDetails.length) * 100),
    }))
  }, [medicineCategories, filteredPrescriptionDetails.length])

  // Top prescribed medicines
  const medicineCounts = useMemo(() => {
    return filteredPrescriptionDetails.reduce((acc: Record<string, number>, detail) => {
      const medicine = getMedicineById(detail.medicineID)
      if (medicine) {
        acc[medicine.name] = (acc[medicine.name] || 0) + detail.quantity
      }
      return acc
    }, {})
  }, [filteredPrescriptionDetails])

  const topMedicines = useMemo(() => {
    return Object.entries(medicineCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
  }, [medicineCounts])

  // Doctor prescription analysis
  const doctorPrescriptions = useMemo(() => {
    return filteredPrescriptions.reduce((acc: Record<string, number>, prescription) => {
      acc[prescription.doctorID] = (acc[prescription.doctorID] || 0) + 1
      return acc
    }, {})
  }, [filteredPrescriptions])

  const doctorNames: Record<string, string> = {
    "550e8400-e29b-41d4-a716-446655440001": "Dr. Sarah Johnson",
    "550e8400-e29b-41d4-a716-446655440002": "Dr. Michael Chen",
    "550e8400-e29b-41d4-a716-446655440003": "Dr. Emily Rodriguez",
  }

  const doctorData = useMemo(() => {
    return Object.entries(doctorPrescriptions)
      .sort(([, a], [, b]) => b - a)
      .map(([doctorId, count]) => ({
        doctor: doctorNames[doctorId] || `Dr. ${doctorId.substring(0, 8)}`,
        count,
      }))
  }, [doctorPrescriptions])

  const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180
    const radius = outerRadius * 1.1
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Prescription Trends</CardTitle>
          <CardDescription>Monthly prescription count and total cost</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="prescriptions" name="Prescriptions" fill="#0088FE" />
              <Line yAxisId="right" type="monotone" dataKey="cost" name="Cost ($)" stroke="#FF8042" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medicine Categories</CardTitle>
          <CardDescription>Distribution by medicine categories</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, "Prescriptions"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Medicines</CardTitle>
          <CardDescription>Most prescribed medicines by quantity</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={topMedicines} margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Quantity" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Prescribing Doctors</CardTitle>
          <CardDescription>Doctors with most prescriptions</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={doctorData} margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="doctor" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Prescriptions" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Prescription Cost Analysis</CardTitle>
          <CardDescription>Monthly prescription costs over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cost" name="Cost ($)" stroke="#FF8042" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
