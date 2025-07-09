import type { Patient } from "@/types/patient"
import type { ApiResponse, Response } from "@/types/api"
import Cookies from "js-cookie"


export class PatientService {
  // private static baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
  private static baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"


  // Get all patients with pagination
  static async getAllPatients(
    signal?: AbortSignal,
    offset: number = 0,
    limit: number = 4
  ): Promise<Patient[]> {
    try {
      const url = `${this.baseUrl}/users?roles=PATIENT&limit=${limit}&offset=${offset}`
      const response = await fetch(url,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        },
        signal: signal
      })

      if (!response.ok) throw new Error("Failed to fetch patients")

      const json: Response<Patient> = await response.json()

      if (json.code !== 200) throw new Error(json.message || "Unknown error")

      // if (!json.data) return []

      if (!json.data || !Array.isArray(json.data)) {
        throw new Error("Invalid data format")
      }

      return json.data;
    } catch (error) {
      console.error("Error fetching patients:", error)
      return []
    }
  }

  static async updatePatient(patientId: string, updatedData: Partial<Patient>): Promise<Patient> {
    const res = await fetch(`${this.baseUrl}/users/${patientId}`, {
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
        bloodType: updatedData.bloodType,
        height: updatedData.height,
        allergies: updatedData.allergies,
        pastIllness: updatedData.pastIllness,
      }),
    })

    if (!res.ok) throw new Error("Failed to update patient")

    const json: Response<Patient> = await res.json();

    if (json.code !== 200) throw new Error(json.message || "Unknown error")


    if (!json.data || Array.isArray(json.data)) {
      throw new Error("Invalid data format")
    }
    return json.data;
  }

  // Get patient by ID
  static async getPatientById(id: string): Promise<Patient> {
    const res = await fetch(`${this.baseUrl}/users/${id}?role=PATIENT`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch patient info");

    const json = await res.json();

    if (json.code !== 200) {
      throw new Error(json.message || "Unknown error");
    }

    if (Array.isArray(json.data)) {
      throw new Error("Invalid format");
    }

    if (typeof json.data.allergies === "string") {
      try {
        json.data.allergies = JSON.parse(json.data.allergies.replace(/'/g, '"'));
      } catch (e) {
        json.data.allergies = json.data.allergies;
      }
    }
    return json.data;
  }


  // Search patients
  static async searchPatients(query: string): Promise<Patient[]> {
    try {
      const response = await fetch(`${this.baseUrl}/patients/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error("Failed to search patients")
      const data: ApiResponse<Patient[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error searching patients:", error)
      throw error
    }
  }

  // Create new patient
  static async createPatient(patient: Omit<Patient, "userId" | "createdAt" | "updatedAt">): Promise<Patient> {
    try {
      const response = await fetch(`${this.baseUrl}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patient),
      })
      if (!response.ok) throw new Error("Failed to create patient")
      const data: ApiResponse<Patient> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error creating patient:", error)
      throw error
    }
  }

  // Delete patient
  static async deletePatient(patientId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/patients/${patientId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete patient")
    } catch (error) {
      console.error("Error deleting patient:", error)
      throw error
    }
  }

  // Get patient statistics
  static async getPatientStats(): Promise<{
    total: number
    male: number
    female: number
    averageAge: number
    byBloodType: Record<string, number>
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/patients/stats`)
      if (!response.ok) throw new Error("Failed to fetch patient statistics")
      const data: ApiResponse<{
        total: number
        male: number
        female: number
        averageAge: number
        byBloodType: Record<string, number>
      }> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching patient statistics:", error)
      throw error
    }
  }

  // Calculate BMI
  static calculateBMI(height: number, weight: number): number {
    const heightInMeters = height / 100
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
  }

  // Get BMI category
  static getBMICategory(bmi: number): string {
    if (bmi < 18.5) return "Underweight"
    if (bmi < 25) return "Normal weight"
    if (bmi < 30) return "Overweight"
    return "Obese"
  }

  // Get patients by blood type
  static async getPatientsByBloodType(bloodType: string): Promise<Patient[]> {
    try {
      const response = await fetch(`${this.baseUrl}/patients?bloodType=${encodeURIComponent(bloodType)}`)
      if (!response.ok) throw new Error("Failed to fetch patients by blood type")
      const data: ApiResponse<Patient[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching patients by blood type:", error)
      throw error
    }
  }

  // Get patients by age range
  static async getPatientsByAgeRange(minAge: number, maxAge: number): Promise<Patient[]> {
    try {
      const response = await fetch(`${this.baseUrl}/patients?minAge=${minAge}&maxAge=${maxAge}`)
      if (!response.ok) throw new Error("Failed to fetch patients by age range")
      const data: ApiResponse<Patient[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching patients by age range:", error)
      throw error
    }
  }
}
