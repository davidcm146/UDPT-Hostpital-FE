import { Response } from "@/types/api"
import type { AvailableScheduleResponse, DoctorScheduleResponse, Schedule, ScheduleResponse } from "@/types/schedule"
import Cookies from "js-cookie"

// API service functions for schedule management
export class ScheduleService {
  private static baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

  // Get doctor's schedule for a specific date
  static async getDoctorSchedule(doctorID: string, date: string): Promise<ScheduleResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/doctor-schedules/available?doctorId=${doctorID}&date=${date}`,{
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error("Failed to fetch doctor schedule")
      }

      const json: Response<ScheduleResponse> = await response.json()

      if (json.code !== 200) {
        throw new Error(json.message || "Failed to fetch doctor schedule")
      }

      // Check that json.data is not an array and is valid
      if (!json.data || Array.isArray(json.data)) {
        throw new Error("Invalid data format")
      }
      console.log(json.data);
      return json.data
    } catch (error) {
      console.error("Error fetching doctor schedule:", error)
      throw error
    }
  }

  static async fetchDoctorSchedules(doctorId: string): Promise<DoctorScheduleResponse[]> {
    const res = await fetch(`${this.baseUrl}/doctor-schedules?doctorId=${doctorId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to fetch doctor schedules")
    }

    const json = await res.json()

    if (json.code !== 200 || !Array.isArray(json.data)) {
      throw new Error("Invalid schedule response format")
    }

    return json.data as DoctorScheduleResponse[]
  }

  static async getDoctorAvailableSchedule(
    doctorId: string,
    date: string
  ): Promise<AvailableScheduleResponse> {
    const queryParams = new URLSearchParams({
      doctorId,
      date,
    })

    const res = await fetch(`${this.baseUrl}/doctor-schedules/available?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json"
      }
    })

    if (!res.ok) {
      throw new Error("Failed to fetch available schedule")
    }

    const json: Response<AvailableScheduleResponse> = await res.json();

    if (json.code !== 200) {
      throw Error(json.message || "Unknown error");
    }

    if (!json.data || Array.isArray(json.data)) {
      throw Error ("Invalid format");
    }
    return json.data as AvailableScheduleResponse
  }

  // Get doctor's working hours for a specific date
  // static async getDoctorWorkingHours(
  //   doctorID: string,
  //   date: string,
  // ): Promise<{ startTime: string; endTime: string } | null> {
  //   try {
  //     const schedule = await this.getDoctorSchedule(doctorID, date)
  //     if (!schedule) return null

  //     return {
  //       startTime: schedule.startTime,
  //       endTime: schedule.endTime,
  //     }
  //   } catch (error) {
  //     console.error("Error fetching doctor working hours:", error)
  //     throw error
  //   }
  // }

  // Get doctor's schedule for multiple dates (week/month view)
  static async getDoctorScheduleRange(doctorID: string, startDate: string, endDate: string): Promise<Schedule[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/schedules/doctor/${doctorID}/range?startDate=${startDate}&endDate=${endDate}`,
      )
      if (!response.ok) throw new Error("Failed to fetch doctor schedule range")
      return await response.json()
    } catch (error) {
      console.error("Error fetching doctor schedule range:", error)
      throw error
    }
  }

  // Check if doctor is working on a specific date
  static async isDoctorWorking(doctorID: string, date: string): Promise<boolean> {
    try {
      const schedule = await this.getDoctorSchedule(doctorID, date)
      return schedule !== null
    } catch (error) {
      console.error("Error checking if doctor is working:", error)
      return false
    }
  }

  // Create or update doctor schedule
  static async upsertDoctorSchedule(schedule: Omit<Schedule, "id" | "createdAt" | "updatedAt">): Promise<Schedule> {
    try {
      const response = await fetch(`${this.baseUrl}/schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(schedule),
      })
      if (!response.ok) throw new Error("Failed to create/update schedule")
      return await response.json()
    } catch (error) {
      console.error("Error creating/updating schedule:", error)
      throw error
    }
  }

  // Delete doctor schedule
  static async deleteDoctorSchedule(scheduleId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/schedules/${scheduleId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete schedule")
    } catch (error) {
      console.error("Error deleting schedule:", error)
      throw error
    }
  }
}
