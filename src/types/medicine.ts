export interface Medicine {
  id: string // uuid - Primary key
  name: string // varchar
  description: string // text
  price: number // decimal - Price per unit
  createdAt?: Date // Datetime
  // Additional fields for hospital management
  category: string
  dosageForm: string // tablet, capsule, injection, etc.
  stockQuantity: number
  expiryDate: Date | string
}

export interface CreateMedicineRequest {
  name: string // varchar
  description: string // text
  price: number // decimal - Price per unit
  createdAt?: Date // Datetime
  // Additional fields for hospital management
  category: string
  dosageForm: string // tablet, capsule, injection, etc.
  stockQuantity: number
  expiryDate: Date | string
}


export interface MedicineStockUpdate {
  medicineID: string
  quantity: number
  type: "add" | "subtract"
  reason: string
  updatedBy: string
}

export interface MedicineParams {
  limit: number
  offset: number
  name?: string
  category?: string
  signal?: AbortSignal
}
