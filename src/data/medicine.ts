import type { Medicine } from "@/types/medicine"

export const mockMedicines: Medicine[] = [
  {
    medicineID: "med-001",
    name: "Atorvastatin",
    unit: 30, // 30 tablets per package
    description: "Cholesterol-lowering medication used to reduce the risk of heart disease",
    price: 2.5, // Price per tablet
    category: "Cardiovascular",
    manufacturer: "Pfizer",
    dosageForm: "tablet",
    strength: "20mg",
    stockQuantity: 500,
    minimumStock: 50,
    expiryDate: new Date("2025-12-31"),
    batchNumber: "AT2024001",
    prescriptionRequired: true,
    createdAt: new Date("2024-01-01T00:00:00"),
  },
  {
    medicineID: "med-002",
    name: "Vitamin D3",
    unit: 60, // 60 capsules per package
    description: "Vitamin D supplement for bone health and immune system support",
    price: 0.15, // Price per capsule
    category: "Vitamins",
    manufacturer: "Nature Made",
    dosageForm: "capsule",
    strength: "2000 IU",
    stockQuantity: 300,
    minimumStock: 30,
    expiryDate: new Date("2026-06-30"),
    batchNumber: "VD2024002",
    prescriptionRequired: false,
    createdAt: new Date("2024-01-01T00:00:00"),
  },
  {
    medicineID: "med-003",
    name: "Lisinopril",
    unit: 30, // 30 tablets per package
    description: "ACE inhibitor used to treat high blood pressure and heart failure",
    price: 1.2, // Price per tablet
    category: "Cardiovascular",
    manufacturer: "Merck",
    dosageForm: "tablet",
    strength: "10mg",
    stockQuantity: 400,
    minimumStock: 40,
    expiryDate: new Date("2025-09-30"),
    batchNumber: "LS2024003",
    prescriptionRequired: true,
    createdAt: new Date("2024-01-01T00:00:00"),
  },
  {
    medicineID: "med-004",
    name: "Metformin",
    unit: 60, // 60 tablets per package
    description: "Diabetes medication that helps control blood sugar levels",
    price: 0.8, // Price per tablet
    category: "Endocrine",
    manufacturer: "Teva",
    dosageForm: "tablet",
    strength: "500mg",
    stockQuantity: 600,
    minimumStock: 60,
    expiryDate: new Date("2025-11-30"),
    batchNumber: "MF2024004",
    prescriptionRequired: true,
    createdAt: new Date("2024-01-01T00:00:00"),
  },
  {
    medicineID: "med-005",
    name: "Albuterol Inhaler",
    unit: 1, // 1 inhaler per package
    description: "Bronchodilator inhaler for asthma and COPD relief",
    price: 45.0, // Price per inhaler
    category: "Respiratory",
    manufacturer: "GSK",
    dosageForm: "inhaler",
    strength: "90mcg/actuation",
    stockQuantity: 50,
    minimumStock: 10,
    expiryDate: new Date("2025-08-31"),
    batchNumber: "AL2024005",
    prescriptionRequired: true,
    createdAt: new Date("2024-01-01T00:00:00"),
  },
  {
    medicineID: "med-006",
    name: "Omeprazole",
    unit: 30, // 30 capsules per package
    description: "Proton pump inhibitor for treating acid reflux and stomach ulcers",
    price: 1.5, // Price per capsule
    category: "Gastrointestinal",
    manufacturer: "AstraZeneca",
    dosageForm: "capsule",
    strength: "20mg",
    stockQuantity: 250,
    minimumStock: 25,
    expiryDate: new Date("2025-10-31"),
    batchNumber: "OM2024006",
    prescriptionRequired: true,
    createdAt: new Date("2024-01-01T00:00:00"),
  },
  {
    medicineID: "med-007",
    name: "Ibuprofen",
    unit: 100, // 100 tablets per package
    description: "Nonsteroidal anti-inflammatory drug for pain and fever relief",
    price: 0.1, // Price per tablet
    category: "Pain Relief",
    manufacturer: "Advil",
    dosageForm: "tablet",
    strength: "200mg",
    stockQuantity: 800,
    minimumStock: 80,
    expiryDate: new Date("2026-03-31"),
    batchNumber: "IB2024007",
    prescriptionRequired: false,
    createdAt: new Date("2024-01-01T00:00:00"),
  },
  {
    medicineID: "med-008",
    name: "Amoxicillin",
    unit: 21, // 21 capsules per package
    description: "Antibiotic used to treat bacterial infections",
    price: 2.0, // Price per capsule
    category: "Antibiotics",
    manufacturer: "Amoxil",
    dosageForm: "capsule",
    strength: "500mg",
    stockQuantity: 150,
    minimumStock: 20,
    expiryDate: new Date("2025-07-31"),
    batchNumber: "AM2024008",
    prescriptionRequired: true,
    createdAt: new Date("2024-01-01T00:00:00"),
  },
  {
    medicineID: "med-009",
    name: "Aspirin",
    unit: 100, // 100 tablets per package
    description: "Low-dose aspirin for cardiovascular protection and pain relief",
    price: 0.05, // Price per tablet
    category: "Cardiovascular",
    manufacturer: "Bayer",
    dosageForm: "tablet",
    strength: "81mg",
    stockQuantity: 1000,
    minimumStock: 100,
    expiryDate: new Date("2026-12-31"),
    batchNumber: "AS2024009",
    prescriptionRequired: false,
    createdAt: new Date("2024-01-01T00:00:00"),
  },
  {
    medicineID: "med-010",
    name: "Insulin Glargine",
    unit: 1, // 1 pen per package
    description: "Long-acting insulin for diabetes management",
    price: 120.0, // Price per pen
    category: "Endocrine",
    manufacturer: "Lantus",
    dosageForm: "injection",
    strength: "100 units/mL",
    stockQuantity: 30,
    minimumStock: 5,
    expiryDate: new Date("2025-05-31"),
    batchNumber: "IN2024010",
    prescriptionRequired: true,
    createdAt: new Date("2024-01-01T00:00:00"),
  },
]

// Helper functions
export const getMedicineById = (medicineID: string): Medicine | undefined => {
  return mockMedicines.find((medicine) => medicine.medicineID === medicineID)
}

export const getMedicinesByCategory = (category: string): Medicine[] => {
  return mockMedicines.filter((medicine) => medicine.category.toLowerCase() === category.toLowerCase())
}

export const searchMedicines = (query: string): Medicine[] => {
  const searchTerm = query.toLowerCase()
  return mockMedicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm) ||
      medicine.description.toLowerCase().includes(searchTerm) ||
      medicine.category.toLowerCase().includes(searchTerm),
  )
}

export const getLowStockMedicines = (): Medicine[] => {
  return mockMedicines.filter(
    (medicine) =>
      medicine.stockQuantity !== undefined &&
      medicine.minimumStock !== undefined &&
      medicine.stockQuantity <= medicine.minimumStock,
  )
}

export const getMedicineCategories = (): string[] => {
  return [...new Set(mockMedicines.map((medicine) => medicine.category))]
}

export const updateMedicineStock = (medicineID: string, newStock: number): boolean => {
  const medicine = mockMedicines.find((m) => m.medicineID === medicineID)
  if (medicine) {
    medicine.stockQuantity = newStock
    return true
  }
  return false
}
