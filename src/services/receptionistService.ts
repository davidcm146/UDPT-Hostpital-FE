import type { Receptionist } from "@/types/receptionist"
import type { ApiResponse, Response } from "@/types/api"
import Cookies from "js-cookie"

export class ReceptionistService {
  private static baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

  // Get all receptionists
  static async getAllReceptionists(): Promise<Receptionist[]> {
    try {
      const response = await fetch(`${this.baseUrl}/receptionists`)
      if (!response.ok) throw new Error("Failed to fetch receptionists")
      const data: ApiResponse<Receptionist[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching receptionists:", error)
      throw error
    }
  }

  static async updateReceptionist(receptionistId: string, updatedData: Partial<Receptionist>): Promise<Receptionist> {
    const res = await fetch(`${this.baseUrl}/users/${receptionistId}`, {
      method: "PUT",
      headers: { 
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: updatedData.email,
        name: updatedData.name,
        address: updatedData.address,
        phoneNumber: updatedData.phoneNumber,
        dob: updatedData.dob,
        experience: updatedData.experience,
        education: updatedData.education,
      }),
    })

    if (!res.ok) throw new Error("Failed to update doctor")

    const json: Response<Receptionist> = await res.json();

    if (json.code !== 200) throw new Error(json.message || "Unknown error")


    if (!json.data || Array.isArray(json.data)) {
      throw new Error("Invalid data format")
    }
    return json.data;
  }

  static async getReceptionistById(id: string): Promise<Receptionist> {
    const res = await fetch(`${this.baseUrl}/users/${id}?role=RECEPTIONIST`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch patient info");

    const json = await res.json();

    if (json.code !== 200 || Array.isArray(json.data)) {
      throw new Error("Invalid response format");
    }
    return json.data;
  }

  // Get current receptionist (from authentication context)
  static async getCurrentReceptionist(): Promise<Receptionist | null> {
    try {
      const response = await fetch(`${this.baseUrl}/receptionists/current`)
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error("Failed to fetch current receptionist")
      }
      const data: ApiResponse<Receptionist> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching current receptionist:", error)
      throw error
    }
  }

  // Get receptionists by department
  static async getReceptionistsByDepartment(department: string): Promise<Receptionist[]> {
    try {
      const response = await fetch(`${this.baseUrl}/receptionists?department=${encodeURIComponent(department)}`)
      if (!response.ok) throw new Error("Failed to fetch receptionists by department")
      const data: ApiResponse<Receptionist[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching receptionists by department:", error)
      throw error
    }
  }

  // Search receptionists
  static async searchReceptionists(query: string): Promise<Receptionist[]> {
    try {
      const response = await fetch(`${this.baseUrl}/receptionists/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error("Failed to search receptionists")
      const data: ApiResponse<Receptionist[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error searching receptionists:", error)
      throw error
    }
  }

  // Create new receptionist
  static async createReceptionist(
    receptionist: Omit<Receptionist, "userId" | "createdAt" | "updatedAt">,
  ): Promise<Receptionist> {
    try {
      const response = await fetch(`${this.baseUrl}/receptionists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(receptionist),
      })
      if (!response.ok) throw new Error("Failed to create receptionist")
      const data: ApiResponse<Receptionist> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error creating receptionist:", error)
      throw error
    }
  }

  // Delete receptionist
  static async deleteReceptionist(receptionistId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/receptionists/${receptionistId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete receptionist")
    } catch (error) {
      console.error("Error deleting receptionist:", error)
      throw error
    }
  }

  // Get receptionist statistics
  static async getReceptionistStats(): Promise<{
    total: number
    byDepartment: Record<string, number>
    averageExperience: number
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/receptionists/stats`)
      if (!response.ok) throw new Error("Failed to fetch receptionist statistics")
      const data: ApiResponse<{
        total: number
        byDepartment: Record<string, number>
        averageExperience: number
      }> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching receptionist statistics:", error)
      throw error
    }
  }
}
