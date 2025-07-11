import type { Prescription, PrescriptionWithDetails, CreatePrescriptionRequest, PrescriptionsParams, PrescriptionDetail } from "@/types/prescription"
import type { ApiResponse, Response } from "@/types/api"
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

  static async fetchPrescriptionsByMedicalRecord(medicalRecordId: string): Promise<Prescription[]> {
    const query = new URLSearchParams()
    query.append("medicalRecordId", medicalRecordId)

    const res = await fetch(`${this.baseUrl}/prescriptions?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to fetch prescriptions")
    }

    const json: Response<Prescription> = await res.json();

    if (json.code !== 200) {
      throw new Error(json.message || "Unknown error");
    }

    if (!json.data|| !Array.isArray(json.data)){
      throw new Error("Invalid format");
    }

    return json.data as Prescription[]
  }

  static async getPrescriptionById(prescriptionId: string): Promise<Prescription> {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/prescriptions/${prescriptionId}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to fetch prescription")
    }

    const json: Response<Prescription> = await res.json()

    if (json.code !== 200) {
      throw new Error(json.message || "Unknown error");
    }

    if (!json.data || Array.isArray(json.data)) {
      throw new Error("Invalid format");
    }
    return json.data as Prescription
  }

  // Get prescription by ID with details
  static async getPrescriptionDetails(prescriptionId: string): Promise<PrescriptionDetail[]> {
    const res = await fetch(
      `${this.baseUrl}/prescriptions/details?prescriptionId=${prescriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!res.ok) {
      throw new Error("Failed to fetch prescription details")
    }

    const json: Response<PrescriptionDetail> = await res.json()

    if (json.code !== 200) {
      throw new Error(json.message || "Unknown error");
    }

    if (!json.data || !Array.isArray(json.data)) {
      throw new Error("Invalid format");
    }
    return json.data as PrescriptionDetail[]
  }

  static async updatePrescriptionStatus(id: string, status: "TAKEN" | "NOT_TAKEN") {
    const res = await fetch(`${this.baseUrl}/prescriptions/${id}/status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) {
      throw new Error("Failed to update prescription status")
    }

    const json: Response<Prescription> = await res.json()

    if (json.code !== 200) {
      throw new Error("Invalid response format when updating prescription status")
    }

    if (!json.data || Array.isArray(json.data)) {
      throw new Error("Invalid response format when updating prescription status")

    }

    return json.data
  }

  static async createPrescription(payload: CreatePrescriptionRequest) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/prescriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      throw new Error("Failed to create prescription")
    }

    const json: Response<Prescription> = await res.json();

    if (json.code !== 200) {
      throw new Error(json.message || "Unknown error");
    }

    if (!json.data || Array.isArray(json.data)) {
      throw new Error("Invalid response format")
    }

    return json.data;
  }
}
