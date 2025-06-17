"use client"

import { useState, useEffect } from "react"

interface StatProps {
  value: number
  label: string
  suffix?: string
  duration?: number
}

const Stat = ({ value, label, suffix = "", duration = 2000 }: StatProps) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = Math.min(value, 9999)
    const incrementTime = duration / end

    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, incrementTime)

    return () => {
      clearInterval(timer)
    }
  }, [value, duration])

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  )
}

const StatsSection = () => {
  return (
    <section className="pt-20 bg-white">
      <div className="container mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Healthcare Professionals</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our system is making a significant impact on healthcare delivery and management.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat value={50} label="Hospitals" suffix="+" />
          <Stat value={1500} label="Doctors" suffix="+" />
          <Stat value={98} label="Satisfaction Rate" suffix="%" />
          <Stat value={100} label="Patients Served" suffix="+" />
        </div>

        <div className="mt-20 h-full bg-gradient-to-r from-teal-50 to-blue-50 p-8 md:p-12 rounded-2xl px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                "This system has revolutionized how we manage patient care and hospital operations."
              </h3>
              <p className="text-gray-600 mb-4">
                The microservices architecture allows us to scale individual components as needed, and the integrated
                notification system has significantly reduced missed appointments.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-teal-200 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold">Dr. Jane Smith</div>
                  <div className="text-sm text-gray-500">Chief Medical Officer, General Hospital</div>
                </div>
              </div>
            </div>
            <div className="md:w-1/3">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Hospital Staff"
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection
