"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pill, Plus } from "lucide-react"
import { MedicineSearch } from "@/components/receptionist/medicines/MedicineSearch"
import { MedicineCard } from "@/components/receptionist/medicines/MedicineCard"
import { MedicineStockDialog } from "@/components/receptionist/medicines/MedicineStockDialog"
import { MedicineEditDialog } from "@/components/receptionist/medicines/MedicineEditDialog"
import { MedicineAddDialog } from "@/components/receptionist/medicines/MedicineAddDialog"
import { mockMedicines, getMedicineCategories } from "@/data/medicine"
import type { Medicine, MedicineStockUpdate } from "@/types/medicine"

const ReceptionistMedicinesPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const categories = getMedicineCategories()

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "" || medicine.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleUpdateStock = (update: MedicineStockUpdate) => {
    setMedicines(
      medicines.map((medicine) => {
        if (medicine.medicineID === update.medicineID) {
          const currentStock = medicine.stockQuantity || 0
          const newStock =
            update.type === "add" ? currentStock + update.quantity : Math.max(0, currentStock - update.quantity)

          return { ...medicine, stockQuantity: newStock }
        }
        return medicine
      }),
    )
  }

  const handleEditMedicine = (updatedMedicine: Medicine) => {
    setMedicines(
      medicines.map((medicine) => (medicine.medicineID === updatedMedicine.medicineID ? updatedMedicine : medicine)),
    )
  }

  const handleAddMedicine = (newMedicine: Medicine) => {
    setMedicines([...medicines, newMedicine])
  }

  const handleOpenStockDialog = (medicine: Medicine) => {
    setSelectedMedicine(medicine)
    setIsStockDialogOpen(true)
  }

  const handleOpenEditDialog = (medicine: Medicine) => {
    setSelectedMedicine(medicine)
    setIsEditDialogOpen(true)
  }

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true)
  }

  const lowStockCount = medicines.filter(
    (medicine) =>
      medicine.stockQuantity !== undefined &&
      medicine.minimumStock !== undefined &&
      medicine.stockQuantity <= medicine.minimumStock,
  ).length

  const expiringSoonCount = medicines.filter(
    (medicine) =>
      medicine.expiryDate && new Date(medicine.expiryDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000,
  ).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medicine Management</h1>
          <p className="text-gray-600">Manage medicine inventory and stock levels</p>
        </div>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Medicine
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Medicines</p>
                <p className="text-2xl font-bold text-blue-600">{medicines.length}</p>
              </div>
              <Pill className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
              </div>
              <Pill className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">{expiringSoonCount}</p>
              </div>
              <Pill className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-green-600">{categories.length}</p>
              </div>
              <Pill className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Pill className="mr-2 h-5 w-5" />
            Medicine Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6">
            <MedicineSearch
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onSearchChange={setSearchTerm}
              onCategoryChange={setSelectedCategory}
              categories={categories}
            />
          </div>

          {/* Medicine Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedicines.map((medicine) => (
              <MedicineCard
                key={medicine.medicineID}
                medicine={medicine}
                onEdit={handleOpenEditDialog}
                onUpdateStock={handleOpenStockDialog}
              />
            ))}
          </div>

          {filteredMedicines.length === 0 && (
            <div className="text-center py-8 text-gray-500">No medicines found matching your criteria</div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <MedicineStockDialog
        medicine={selectedMedicine}
        isOpen={isStockDialogOpen}
        onClose={() => setIsStockDialogOpen(false)}
        onUpdateStock={handleUpdateStock}
      />

      <MedicineEditDialog
        medicine={selectedMedicine}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditMedicine}
      />

      <MedicineAddDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onAdd={handleAddMedicine} />
    </div>
  )
}

export default ReceptionistMedicinesPage
