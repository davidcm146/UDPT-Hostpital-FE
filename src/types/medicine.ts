export interface Medicine {
  medicineID: string // uuid - Primary key
  name: string // varchar
  unit: number // int - Units per package
  description: string // text
  price: number // decimal - Price per unit
  createdAt: Date // Datetime

  // Additional fields for hospital management
  category: string
  manufacturer?: string
  dosageForm: string // tablet, capsule, injection, etc.
  strength: string // e.g., "500mg", "10mg/ml"
  stockQuantity?: number
  minimumStock?: number
  expiryDate?: Date
  batchNumber?: string
  prescriptionRequired: boolean
}

export interface MedicineStockUpdate {
  medicineID: string
  quantity: number
  type: "add" | "subtract"
  reason: string
  updatedBy: string
}
