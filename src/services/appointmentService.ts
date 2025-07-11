import { AppointmentRequest, AppointmentResponse, Response } from "@/types/api"
import type { Appointment, CreateAppointmentRequest, UpdateAppointmentPayload } from "@/types/appointment"
import Cookies from "js-cookie"

// API service functions for appointment management
export class AppointmentService {
  private static baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

  // Get appointments for a specific doctor and date
  static async getAppointments(
    params: AppointmentRequest
  ): Promise<AppointmentResponse<Appointment>> {
    try {
      const queryParams = new URLSearchParams()

      if (params.patientId) queryParams.append("patientId", params.patientId)
      if (params.doctorId) queryParams.append("doctorId", params.doctorId)
      if (params.type) queryParams.append("type", params.type)
      if (params.status) queryParams.append("status", params.status)
      if (params.reason) queryParams.append("reason", params.reason)
      if (params.appointmentId) queryParams.append("appointmentId", params.appointmentId)

      const limit = params.size ?? 5
      const offset = (params.page ?? 0) * limit

      queryParams.append("limit", limit.toString())
      queryParams.append("offset", offset.toString())

      const response = await fetch(`${this.baseUrl}/appointments?${queryParams.toString()}`, {
        signal: params.signal,
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        }
      })

      const json: Response<Appointment> & {
        page: number
        pageSize: number
        totalPages: number
        totalElements: number
      } = await response.json();

      if (!json.data || !Array.isArray(json.data)) {
        throw new Error("Invalid data format")
      }


      if (json.code !== 200) throw new Error("Failed to fetch appointments")

      console.log(json.data);

      return {
        data: json.data,
        page: json.page,
        pageSize: json.pageSize,
        totalPages: json.totalPages,
        totalElements: json.totalElements,
      }
    } catch (error) {
      console.error("Error fetching doctor appointments:", error)
      throw error
    }
  }

  static async updateAppointmentStatus(
    appointmentId: string,
    payload: UpdateAppointmentPayload,
    signal?: AbortSignal
  ): Promise<Appointment> {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/appointments/${appointmentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal,
    })

    if (!res.ok) {
      throw new Error("Failed to update appointment")
    }

    const json: Response<Appointment> = await res.json()

    if (json.code !== 200) {
      throw new Error("Failed to update appointment")
    }

    if (!json.data || Array.isArray(json.data)) {
      throw new Error("Invalid data format")
    }

    return json.data
  }

  static async getAppointmentById(appointmentId: string): Promise<Appointment> {
    try {
      const response = await fetch(`${this.baseUrl}/appointments/${appointmentId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch appointment: ${response.status} ${response.statusText}`)
      }

      const json: Response<Appointment> = await response.json()

      if (json.code !== 200) {
        throw new Error(json.message || "Failed to fetch appointment")
      }

      if (!json.data) {
        throw new Error("Invalid response data")
      }

      if (!json.data || Array.isArray(json.data)) {
        throw new Error("Invalid data format")
      }

      console.log(json.data);

      return json.data
    } catch (error) {
      console.error("Error fetching appointment:", error)
      throw error
    }
  }

  static async createAppointment(appointmentData: CreateAppointmentRequest): Promise<Appointment> {
    try {
      console.log("Sending appointment request:", appointmentData)
      appointmentData.doctorId = "fde7f72c-3156-4a00-95ae-873600eb2798"

      const response = await fetch(`${this.baseUrl}/appointments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(appointmentData),
      })

      const json: Response<Appointment> = await response.json()
      console.log("Appointment response:", json)

      if (json.code !== 200) {
        throw new Error(json.message || "Failed to create appointment")
      }
      console.log(json.code);

      if (!json.data) {
        throw new Error("Invalid response data")
      }

      if (!json.data || Array.isArray(json.data)) {
        throw new Error("Invalid data format")
      }

      console.log("Appointment created successfully:", json.data)
      return json.data
    } catch (error) {
      console.error("Error creating appointment:", error)
      throw error
    }
  }

  // Add method to check existing appointments (if available)
  // static async getExistingAppointments(doctorId: string, date: string): Promise<Appointment[]> {
  //   try {
  //     const response = await fetch(`${this.baseUrl}/appointments?doctorId=${doctorId}&date=${date}`)

  //     if (!response.ok) {
  //       if (response.status === 404) return []
  //       throw new Error("Failed to fetch existing appointments")
  //     }

  //     const json: Response<Appointment[]> = await response.json()

  //     if (json.code !== 200) {
  //       throw new Error(json.message || "Failed to fetch existing appointments")
  //     }

  //     if (!json.data || Array.isArray(json.data)) {
  //       throw new Error("Invalid data format")
  //     }

  //     return json.data || []
  //   } catch (error) {
  //     console.error("Error fetching existing appointments:", error)
  //     return []
  //   }
  // }

  // Get appointments for a date range
  static async getDoctorAppointmentsRange(
    doctorID: string,
    startDate: string,
    endDate: string,
  ): Promise<Appointment[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/appointments/doctor/${doctorID}/range?startDate=${startDate}&endDate=${endDate}`,
      )
      if (!response.ok) throw new Error("Failed to fetch doctor appointments range")
      return await response.json()
    } catch (error) {
      console.error("Error fetching doctor appointments range:", error)
      throw error
    }
  }

  // Update appointment
  static async updateAppointment(appointmentID: string, updates: Partial<Appointment>): Promise<Appointment> {
    try {
      const response = await fetch(`${this.baseUrl}/appointments/${appointmentID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error("Failed to update appointment")
      return await response.json()
    } catch (error) {
      console.error("Error updating appointment:", error)
      throw error
    }
  }

  // Cancel appointment
  static async cancelAppointment(appointmentID: string, cancelReason: string): Promise<Appointment> {
    try {
      const response = await fetch(`${this.baseUrl}/appointments/${appointmentID}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cancelReason }),
      })
      if (!response.ok) throw new Error("Failed to cancel appointment")
      return await response.json()
    } catch (error) {
      console.error("Error canceling appointment:", error)
      throw error
    }
  }
}
