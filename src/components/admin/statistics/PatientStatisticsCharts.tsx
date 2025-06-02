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
import { mockDoctorPatients } from "@/data/doctor-patients"
import { calculateBMI, getBMICategory } from "@/data/patient"
import { useMemo } from "react"

interface PatientStatisticsChartsProps {
  filters: {
    ageGroup: string
    gender: string
    dateFrom: Date | undefined
    dateTo: Date | undefined
  }
}

export function PatientStatisticsCharts({ filters }: PatientStatisticsChartsProps) {
  // Filter patients based on the selected filters
  const filteredPatients = useMemo(() => {
    return mockDoctorPatients.filter((patient) => {
      // Filter by age group
      if (filters.ageGroup !== "all") {
        const age = new Date().getFullYear() - new Date(patient.dateOfBirth ? patient.dateOfBirth : "").getFullYear()
        const [minAge, maxAge] = filters.ageGroup.includes("+")
          ? [Number.parseInt(filters.ageGroup), 150]
          : filters.ageGroup.split("-").map(Number)

        if (!(age >= minAge && (maxAge ? age <= maxAge : true))) {
          return false
        }
      }

      // Filter by gender
      if (filters.gender !== "all" && patient.gender.toLowerCase() !== filters.gender.toLowerCase()) {
        return false
      }

      // Filter by registration date range
      const registrationDate = new Date(patient.registrationDate ? patient.registrationDate : "")
      if (filters.dateFrom && registrationDate < filters.dateFrom) {
        return false
      }
      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo)
        dateTo.setHours(23, 59, 59, 999)
        if (registrationDate > dateTo) {
          return false
        }
      }

      return true
    })
  }, [filters])

  // Age Distribution
  const ageGroups = useMemo(() => {
    return filteredPatients.reduce((acc: Record<string, number>, patient) => {
      const birthDate = new Date(patient.dateOfBirth ? patient.dateOfBirth : "")
      const age = new Date().getFullYear() - birthDate.getFullYear()

      let ageGroup = ""
      if (age < 18) ageGroup = "0-17"
      else if (age < 35) ageGroup = "18-34"
      else if (age < 50) ageGroup = "35-49"
      else if (age < 65) ageGroup = "50-64"
      else ageGroup = "65+"

      acc[ageGroup] = (acc[ageGroup] || 0) + 1
      return acc
    }, {})
  }, [filteredPatients])

  const ageGroupData = useMemo(() => {
    const data = Object.entries(ageGroups).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / filteredPatients.length) * 100),
    }))
    return data
  }, [ageGroups, filteredPatients.length])

  // Gender Distribution
  const genderGroups = useMemo(() => {
    return filteredPatients.reduce((acc: Record<string, number>, patient) => {
      const gender = patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)
      acc[gender] = (acc[gender] || 0) + 1
      return acc
    }, {})
  }, [filteredPatients])

  const genderData = useMemo(() => {
    return Object.entries(genderGroups).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / filteredPatients.length) * 100),
    }))
  }, [genderGroups, filteredPatients.length])

  // BMI Distribution
  const bmiGroups = useMemo(() => {
    return filteredPatients.reduce((acc: Record<string, number>, patient) => {
      if (patient.weight && patient.height) {
        const bmi = calculateBMI(patient.height, patient.weight)
        const category = getBMICategory(bmi)
        acc[category] = (acc[category] || 0) + 1
      }
      return acc
    }, {})
  }, [filteredPatients])

  const bmiData = useMemo(() => {
    return Object.entries(bmiGroups).map(([name, value]) => ({ name, value }))
  }, [bmiGroups])

  // Registration Trends (Monthly)
  const registrationTrends = useMemo(() => {
    return filteredPatients.reduce((acc: Record<string, number>, patient) => {
      const date = new Date(patient.registrationDate ? patient.registrationDate : "")
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      acc[monthYear] = (acc[monthYear] || 0) + 1
      return acc
    }, {})
  }, [filteredPatients])

  const registrationData = useMemo(() => {
    return Object.entries(registrationTrends)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([month, count]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        count,
      }))
  }, [registrationTrends])

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
          <CardTitle>Patient Registration Trends</CardTitle>
          <CardDescription>Monthly patient registration over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={registrationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Patients" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Age Distribution</CardTitle>
          <CardDescription>Patient distribution by age groups</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ageGroupData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {ageGroupData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, "Patients"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
          <CardDescription>Patient distribution by gender</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, "Patients"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>BMI Distribution</CardTitle>
          <CardDescription>Patient distribution by BMI categories</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bmiData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Patients" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Patient Growth Trend</CardTitle>
          <CardDescription>Cumulative patient count over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={registrationData.map((item, index) => ({
                ...item,
                total: registrationData.slice(0, index + 1).reduce((sum, curr) => sum + curr.count, 0),
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" name="Total Patients" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
