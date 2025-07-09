import type { Prescription, PrescriptionWithDetails, CreatePrescriptionRequest, PrescriptionsParams } from "@/types/prescription"
import type { ApiResponse } from "@/types/api"
import Cookies from "js-cookie"

export class PrescriptionService {
  private static baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

  // Get all prescriptions with pagination
  static async getPrescriptions(params: PrescriptionsParams): Promise<
    {
      data: Prescription[]
      page: number
      pageSize: number
      totalPages: number
      totalElements: number
    }> {
    const query = new URLSearchParams()

    if (params.patientId) query.append("patientId", params.patientId)
    if (params.doctorId) query.append("doctorId", params.doctorId)
    if (params.limit !== undefined) query.append("limit", params.limit.toString())
    if (params.offset !== undefined) query.append("offset", params.offset.toString())

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/prescriptions?${query.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      signal: params.signal,
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch prescriptions: ${res.status} ${res.statusText}`)
    }

    const json = await res.json()

    if (json.code !== 200) {
      throw new Error(json.message || "Unknown error")
    }

    if (
      json.code !== 200 ||
      !Array.isArray(json.data) ||
      typeof json.page !== "number" ||
      typeof json.pageSize !== "number" ||
      typeof json.totalPages !== "number" ||
      typeof json.totalElements !== "number"
    ) {
      throw new Error("Invalid response format from server")
    }

    return {
      data: json.data as Prescription[],
      page: json.page,
      pageSize: json.pageSize,
      totalPages: json.totalPages,
      totalElements: json.totalElements,
    }
  }

  // Get prescription by ID with details
  static async getPrescriptionWithDetails(prescriptionId: string): Promise<PrescriptionWithDetails | null> {
    try {
      const response = await fetch(`${this.baseUrl}/prescriptions/${prescriptionId}/details`)
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error("Failed to fetch prescription with details")
      }
      const data: ApiResponse<PrescriptionWithDetails> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching prescription with details:", error)
      throw error
    }
  }

  // Get prescriptions by patient
  static async getPrescriptionsByPatient(patientId: string): Promise<PrescriptionWithDetails[]> {
    try {
      const response = await fetch(`${this.baseUrl}/prescriptions/patient/${patientId}`)
      if (!response.ok) throw new Error("Failed to fetch prescriptions by patient")
      const data: ApiResponse<PrescriptionWithDetails[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching prescriptions by patient:", error)
      throw error
    }
  }

  // Get prescriptions by doctor
  static async getPrescriptionsByDoctor(doctorId: string): Promise<PrescriptionWithDetails[]> {
    try {
      const response = await fetch(`${this.baseUrl}/prescriptions/doctor/${doctorId}`)
      if (!response.ok) throw new Error("Failed to fetch prescriptions by doctor")
      const data: ApiResponse<PrescriptionWithDetails[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching prescriptions by doctor:", error)
      throw error
    }
  }

  // Get prescriptions by medical record
  static async getPrescriptionsByMedicalRecord(medicalRecordId: string): Promise<Prescription[]> {
    try {
      const response = await fetch(`${this.baseUrl}/prescriptions/medical-record/${medicalRecordId}`)
      if (!response.ok) throw new Error("Failed to fetch prescriptions by medical record")
      const data: ApiResponse<Prescription[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching prescriptions by medical record:", error)
      throw error
    }
  }

  // Create new prescription
  static async createPrescription(request: CreatePrescriptionRequest): Promise<Prescription> {
    try {
      const response = await fetch(`${this.baseUrl}/prescriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })
      if (!response.ok) throw new Error("Failed to create prescription")
      const data: ApiResponse<Prescription> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error creating prescription:", error)
      throw error
    }
  }

  // Update prescription status
  static async updatePrescriptionStatus(prescriptionId: string, status: Prescription["status"]): Promise<Prescription> {
    try {
      const response = await fetch(`${this.baseUrl}/prescriptions/${prescriptionId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) throw new Error("Failed to update prescription status")
      const data: ApiResponse<Prescription> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error updating prescription status:", error)
      throw error
    }
  }

  // Update prescription
  static async updatePrescription(prescriptionId: string, updates: Partial<Prescription>): Promise<Prescription> {
    try {
      const response = await fetch(`${this.baseUrl}/prescriptions/${prescriptionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error("Failed to update prescription")
      const data: ApiResponse<Prescription> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error updating prescription:", error)
      throw error
    }
  }

  // Delete prescription
  static async deletePrescription(prescriptionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/prescriptions/${prescriptionId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete prescription")
    } catch (error) {
      console.error("Error deleting prescription:", error)
      throw error
    }
  }

  // Get prescriptions by status
  static async getPrescriptionsByStatus(status: Prescription["status"]): Promise<PrescriptionWithDetails[]> {
    try {
      const response = await fetch(`${this.baseUrl}/prescriptions?status=${encodeURIComponent(status)}`)
      if (!response.ok) throw new Error("Failed to fetch prescriptions by status")
      const data: ApiResponse<PrescriptionWithDetails[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching prescriptions by status:", error)
      throw error
    }
  }

  // Search prescriptions
  static async searchPrescriptions(query: string): Promise<PrescriptionWithDetails[]> {
    try {
      const response = await fetch(`${this.baseUrl}/prescriptions/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error("Failed to search prescriptions")
      const data: ApiResponse<PrescriptionWithDetails[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error searching prescriptions:", error)
      throw error
    }
  }

  // Get prescription statistics
  static async getPrescriptionStats(): Promise<{
    total: number
    taken: number
    notTaken: number
    totalValue: number
    averageValue: number
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/prescriptions/stats`)
      if (!response.ok) throw new Error("Failed to fetch prescription statistics")
      const data: ApiResponse<{
        total: number
        taken: number
        notTaken: number
        totalValue: number
        averageValue: number
      }> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching prescription statistics:", error)
      throw error
    }
  }
}
