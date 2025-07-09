import type { Doctor } from "@/types/doctor"
import type { ApiResponse, Response } from "@/types/api"
import Cookies from "js-cookie"

export class DoctorService {
  private static baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

  // Get all doctors
  static async getAllDoctors(signal?: AbortSignal): Promise<Doctor[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users?roles=DOCTOR`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          ContentType: "application/json"
        },
        signal 
      });
      if (!response.ok) throw new Error("Failed to fetch doctors")

      const json: Response<Doctor> = await response.json()
      if (json.code !== 200) throw new Error(json.message || "Unknown error")

      if (!json.data) return []

      return Array.isArray(json.data) ? json.data : [json.data]
    } catch (error) {
      console.error("Error fetching doctors:", error)
      return []
    }
  }

  static async updateDoctor(doctorId: string, updatedData: Partial<Doctor>): Promise<Doctor> {
    const res = await fetch(`${this.baseUrl}/users/${doctorId}`, {
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
        specialty: updatedData.specialty,
        experience: updatedData.experience,
        education: updatedData.education,
      }),
    })

    if (!res.ok) throw new Error("Failed to update doctor")

    const json: Response<Doctor> = await res.json();

    if (json.code !== 200) throw new Error(json.message || "Unknown error")


    if (!json.data || Array.isArray(json.data)) {
      throw new Error("Invalid data format")
    }
    return json.data;
  }

  // Get doctor by ID
  static async getDoctorById(id: string): Promise<Doctor> {
    console.log(id);
    const res = await fetch(`${this.baseUrl}/users/${id}?role=DOCTOR`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch doctor info");

    const json = await res.json();

    if (json.code !== 200) {
      throw new Error(json.message || "Unknown error");
    }

    console.log(json);

    if (!json.data || Array.isArray(json.data)) {
      throw new Error("Invalid data format")
    }
    return json.data as Doctor;
  }

  // Get doctors by specialty
  static async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    try {
      const response = await fetch(`${this.baseUrl}/doctors?specialty=${encodeURIComponent(specialty)}`)
      if (!response.ok) throw new Error("Failed to fetch doctors by specialty")
      const data: ApiResponse<Doctor[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching doctors by specialty:", error)
      throw error
    }
  }

  // Search doctors
  static async searchDoctors(query: string): Promise<Doctor[]> {
    try {
      const response = await fetch(`${this.baseUrl}/doctors/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error("Failed to search doctors")
      const data: ApiResponse<Doctor[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error searching doctors:", error)
      throw error
    }
  }

  // Create new doctor
  static async createDoctor(doctor: Omit<Doctor, "userId" | "createdAt" | "updatedAt">): Promise<Doctor> {
    try {
      const response = await fetch(`${this.baseUrl}/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctor),
      })
      if (!response.ok) throw new Error("Failed to create doctor")
      const data: ApiResponse<Doctor> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error creating doctor:", error)
      throw error
    }
  }

  // Delete doctor
  static async deleteDoctor(doctorId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/doctors/${doctorId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete doctor")
    } catch (error) {
      console.error("Error deleting doctor:", error)
      throw error
    }
  }

  // Get doctor statistics
  static async getDoctorStats(): Promise<{
    total: number
    bySpecialty: Record<string, number>
    averageExperience: number
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/doctors/stats`)
      if (!response.ok) throw new Error("Failed to fetch doctor statistics")
      const data: ApiResponse<{
        total: number
        bySpecialty: Record<string, number>
        averageExperience: number
      }> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching doctor statistics:", error)
      throw error
    }
  }
}
