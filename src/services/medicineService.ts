import type { CreateMedicineRequest, Medicine, MedicineParams } from "@/types/medicine"
import type { ApiResponse, Response } from "@/types/api"
import Cookies from "js-cookie"

export class MedicineService {
  private static baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

  // Get all medicines with pagination
  static async fetchMedications({
    limit,
    offset,
    name,
    category,
    signal,
  }: MedicineParams): Promise<Medicine[]> {
    const query = new URLSearchParams()

    query.append("limit", limit.toString())
    query.append("offset", offset.toString())

    if (name) query.append("name", name)
    if (category) query.append("category", category)

    const res = await fetch(`${this.baseUrl}/medications?${query.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      signal,
    })

    if (!res.ok) {
      throw new Error("Failed to fetch medications")
    }

    const json: Response<Medicine> = await res.json();
    console.log(json.data);

    if (json.code !== 200) {
      throw new Error("Invalid medication response")
    }

    if (!json.data || !Array.isArray(json.data)) {
      throw new Error("Invalid data format")
    }

    return json.data as Medicine[]
  }

  static async getMedicationById(id: string): Promise<Medicine> {
    const res = await fetch(`${this.baseUrl}/medications/${id}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to fetch medication")
    }

    const json: Response<Medicine> = await res.json()

    if (json.code !== 200) {
      throw new Error(json.message || "Unknown error");
    }

    if (!json.data || Array.isArray(json.data)) {
      throw new Error("Invalid format");
    }

    return json.data as Medicine
  }

  static async createMedicine({
    name,
    description,
    dosageForm,
    category,
    expiryDate,
    price,
    stockQuantity,
  }: CreateMedicineRequest): Promise<Medicine> {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/medications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        dosageForm,
        category,
        expiryDate,
        price,
        stockQuantity,
      }),
    })

    if (!res.ok) {
      throw new Error(`Failed to create medicine: ${res.status} ${res.statusText}`)
    }

    const json: Response<Medicine> = await res.json()

    if (json.code !== 200 || !json.data || Array.isArray(json.data)) {
      throw new Error(json.message || "Invalid response from server")
    }

    return json.data
  }

  static async updateMedicine(
    id: string,
    {
      name,
      description,
      dosageForm,
      category,
      expiryDate,
      price,
      stockQuantity,
    }: CreateMedicineRequest
  ): Promise<Medicine> {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/medications/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        dosageForm,
        category,
        expiryDate,
        price,
        stockQuantity,
      }),
    })

    if (!res.ok) {
      throw new Error(`Failed to update medicine: ${res.status} ${res.statusText}`)
    }

    const json: Response<Medicine> = await res.json()
    console.log(json.data);

    if (json.code !== 200 || !json.data || Array.isArray(json.data)) {
      throw new Error(json.message || "Invalid response from server")
    }

    return json.data
  }

  // Get medicine by ID
  static async getMedicineById(medicineId: string): Promise<Medicine | null> {
    try {
      const response = await fetch(`${this.baseUrl}/medicines/${medicineId}`)
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error("Failed to fetch medicine")
      }
      const data: ApiResponse<Medicine> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching medicine:", error)
      throw error
    }
  }

  // Get medicines by category
  static async getMedicinesByCategory(category: string): Promise<Medicine[]> {
    try {
      const response = await fetch(`${this.baseUrl}/medicines?category=${encodeURIComponent(category)}`)
      if (!response.ok) throw new Error("Failed to fetch medicines by category")
      const data: ApiResponse<Medicine[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching medicines by category:", error)
      throw error
    }
  }

  // Search medicines
  static async searchMedicines(query: string): Promise<Medicine[]> {
    try {
      const response = await fetch(`${this.baseUrl}/medicines/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error("Failed to search medicines")
      const data: ApiResponse<Medicine[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error searching medicines:", error)
      throw error
    }
  }

  // Get low stock medicines
  static async getLowStockMedicines(): Promise<Medicine[]> {
    try {
      const response = await fetch(`${this.baseUrl}/medicines/low-stock`)
      if (!response.ok) throw new Error("Failed to fetch low stock medicines")
      const data: ApiResponse<Medicine[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching low stock medicines:", error)
      throw error
    }
  }

  // Get medicine categories
  static async getMedicineCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/medicines/categories`)
      if (!response.ok) throw new Error("Failed to fetch medicine categories")
      const data: ApiResponse<string[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching medicine categories:", error)
      throw error
    }
  }

  // Update medicine stock
  static async updateMedicineStock(medicineId: string, newStock: number): Promise<Medicine> {
    try {
      const response = await fetch(`${this.baseUrl}/medicines/${medicineId}/stock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stockQuantity: newStock }),
      })
      if (!response.ok) throw new Error("Failed to update medicine stock")
      const data: ApiResponse<Medicine> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error updating medicine stock:", error)
      throw error
    }
  }

  // Delete medicine
  static async deleteMedicine(medicineId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/medicines/${medicineId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete medicine")
    } catch (error) {
      console.error("Error deleting medicine:", error)
      throw error
    }
  }

  // Get medicines expiring soon
  static async getMedicinesExpiringSoon(days = 30): Promise<Medicine[]> {
    try {
      const response = await fetch(`${this.baseUrl}/medicines/expiring?days=${days}`)
      if (!response.ok) throw new Error("Failed to fetch medicines expiring soon")
      const data: ApiResponse<Medicine[]> = await response.json()
      return data.data
    } catch (error) {
      console.error("Error fetching medicines expiring soon:", error)
      throw error
    }
  }
}
