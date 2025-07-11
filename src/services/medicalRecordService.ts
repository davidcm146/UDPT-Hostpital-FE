import type { CreateMedicalRecordRequest, MedicalRecord, MedicalRecordsParams } from "@/types/medical-record"
import type { ApiResponse, Response } from "@/types/api"
import Cookies from "js-cookie"

export class MedicalRecordService {
  private static baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

  // Get all medical records with pagination
  static async getMedicalRecords(params: MedicalRecordsParams): Promise<{
    data: MedicalRecord[]
    page: number
    pageSize: number
    totalPages: number
    totalElements: number
  }> {
    const query = new URLSearchParams()

    if (params.doctorId) query.append("doctorId", params.doctorId)
    if (params.patientId) query.append("patientId", params.patientId)
    if (params.doctorName) query.append("doctorName", params.doctorName)
    if (params.visitType) query.append("visitType", params.visitType)
    if (params.from) query.append("from", params.from)
    if (params.to) query.append("to", params.to)
    if (params.diagnosis) query.append("diagnosis", params.diagnosis)
    if (params.limit !== undefined) query.append("limit", params.limit.toString())
    if (params.offset !== undefined) query.append("offset", params.offset.toString())

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/medical-records?${query.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      signal: params.signal,
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch medical records: ${res.status} ${res.statusText}`)
    }

    const json = await res.json()

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
      data: json.data as MedicalRecord[],
      page: json.page,
      pageSize: json.pageSize,
      totalPages: json.totalPages,
      totalElements: json.totalElements,
    }
  }

  // Get medical record by ID
  static async getMedicalRecordById(id: string): Promise<MedicalRecord> {
    const res = await fetch(`${this.baseUrl}/medical-records/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      }
    })

    if (!res.ok) {
      throw new Error('Failed to fetch medical record')
    }

    const json: Response<MedicalRecord> = await res.json();

    if (json.code !== 200) {
      throw Error (json.message || "Unknown error");
    }

    if (!json.data || Array.isArray(json.data)) {
      throw Error("Invalid format");
    }
    return json.data as MedicalRecord
  }

  static async createMedicalRecord(
    payload: CreateMedicalRecordRequest,
    signal?: AbortSignal
  ): Promise<MedicalRecord> {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/medical-records`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal,
    })

    if (!res.ok) {
      throw new Error(`Failed to create medical record: ${res.status} ${res.statusText}`)
    }

    const json: Response<MedicalRecord> = await res.json();

    if (json.code !== 200) {
      throw new Error(json.message || "Unknown error");
    }

    if (!json.data || Array.isArray(json.data)) {
      throw Error ("Invalid format");
    }

    return json.data as MedicalRecord
  }

  // Get medical records by patient
  static async getMedicalRecordsByPatient(patientId: string): Promise<MedicalRecord[]> {
    try {
      const response = await fetch(`${this.baseUrl}/medical-records/patient/${patientId}`)
      if (!response.ok) throw new Error("Failed to fetch medical records by patient")
      const data: ApiResponse<MedicalRecord[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching medical records by patient:", error)
      throw error
    }
  }

  // Get medical records by doctor
  static async getMedicalRecordsByDoctor(doctorId: string): Promise<MedicalRecord[]> {
    try {
      const response = await fetch(`${this.baseUrl}/medical-records/doctor/${doctorId}`)
      if (!response.ok) throw new Error("Failed to fetch medical records by doctor")
      const data: ApiResponse<MedicalRecord[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching medical records by doctor:", error)
      throw error
    }
  }

  // Get recent medical records (last 30 days)
  static async getRecentMedicalRecords(): Promise<MedicalRecord[]> {
    try {
      const response = await fetch(`${this.baseUrl}/medical-records/recent`)
      if (!response.ok) throw new Error("Failed to fetch recent medical records")
      const data: ApiResponse<MedicalRecord[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching recent medical records:", error)
      throw error
    }
  }

  // Get past medical records (older than 30 days)
  static async getPastMedicalRecords(): Promise<MedicalRecord[]> {
    try {
      const response = await fetch(`${this.baseUrl}/medical-records/past`)
      if (!response.ok) throw new Error("Failed to fetch past medical records")
      const data: ApiResponse<MedicalRecord[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching past medical records:", error)
      throw error
    }
  }

  // Search medical records
  static async searchMedicalRecords(query: string): Promise<MedicalRecord[]> {
    try {
      const response = await fetch(`${this.baseUrl}/medical-records/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error("Failed to search medical records")
      const data: ApiResponse<MedicalRecord[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error searching medical records:", error)
      throw error
    }
  }

  // Filter medical records by date range
  static async filterMedicalRecordsByDateRange(
    startDate: string,
    endDate: string,
    patientId?: string,
    doctorId?: string,
  ): Promise<MedicalRecord[]> {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      })
      if (patientId) params.append("patientId", patientId)
      if (doctorId) params.append("doctorId", doctorId)

      const response = await fetch(`${this.baseUrl}/medical-records/filter?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to filter medical records")
      const data: ApiResponse<MedicalRecord[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error filtering medical records:", error)
      throw error
    }
  }

  // Update medical record
  static async updateMedicalRecord(recordId: string, updates: Partial<MedicalRecord>): Promise<MedicalRecord> {
    try {
      const response = await fetch(`${this.baseUrl}/medical-records/${recordId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error("Failed to update medical record")
      const data: ApiResponse<MedicalRecord> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error updating medical record:", error)
      throw error
    }
  }

  // Delete medical record
  static async deleteMedicalRecord(recordId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/medical-records/${recordId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete medical record")
    } catch (error) {
      console.error("Error deleting medical record:", error)
      throw error
    }
  }

  // Get medical record statistics for a doctor
  static async getDoctorMedicalRecordStats(doctorId: string): Promise<{
    totalRecords: number
    totalPatients: number
    thisMonthRecords: number
    emergencyRecords: number
    averageRecordsPerDay: number
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/medical-records/doctor/${doctorId}/stats`)
      if (!response.ok) throw new Error("Failed to fetch doctor medical record statistics")
      const data: ApiResponse<{
        totalRecords: number
        totalPatients: number
        thisMonthRecords: number
        emergencyRecords: number
        averageRecordsPerDay: number
      }> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching doctor medical record statistics:", error)
      throw error
    }
  }

  // Get medical records by visit type
  static async getMedicalRecordsByVisitType(visitType: string): Promise<MedicalRecord[]> {
    try {
      const response = await fetch(`${this.baseUrl}/medical-records?visitType=${encodeURIComponent(visitType)}`)
      if (!response.ok) throw new Error("Failed to fetch medical records by visit type")
      const data: ApiResponse<MedicalRecord[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching medical records by visit type:", error)
      throw error
    }
  }
}
