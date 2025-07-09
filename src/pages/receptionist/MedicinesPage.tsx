"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pill, Plus, RefreshCw, AlertCircle } from "lucide-react"
import { MedicineSearch } from "@/components/receptionist/medicines/MedicineSearch"
import { MedicineCard } from "@/components/receptionist/medicines/MedicineCard"
import { MedicinePagination } from "@/components/receptionist/medicines/MedicinePagination"
import { MedicineStockDialog } from "@/components/receptionist/medicines/MedicineStockDialog"
import { MedicineEditDialog } from "@/components/receptionist/medicines/MedicineEditDialog"
import { MedicineAddDialog } from "@/components/receptionist/medicines/MedicineAddDialog"
import { Loading } from "@/components/ui/loading"
import { MedicineService } from "@/services/medicineService"
import type { Medicine, MedicineStockUpdate } from "@/types/medicine"

const ReceptionistMedicinesPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  const itemsPerPage = 12

  // Fetch medicines from API
  const fetchMedicines = useCallback(
    async (page = 0, resetData = false) => {
      const controller = new AbortController()
      setIsLoading(true)
      setError(null)

      try {
        const params = {
          limit: itemsPerPage,
          offset: page * itemsPerPage,
          signal: controller.signal,
          ...(searchTerm && { name: searchTerm }),
          ...(selectedCategory && { category: selectedCategory }),
        }

        const response = await MedicineService.fetchMedications(params)

        if (resetData || page === 0) {
          setMedicines(response)
        } else {
          setMedicines((prev) => [...prev, ...response])
        }

        // Calculate pagination info
        setTotalItems(response.length + page * itemsPerPage)
        setTotalPages(Math.ceil((response.length + page * itemsPerPage) / itemsPerPage))
      } catch (err) {
        console.error("Failed to fetch medicines:", err)
        setError("Failed to load medicines. Please check your connection and try again.")
        // Don't use fallback data - just show empty state
        if (page === 0) {
          setMedicines([])
          setTotalItems(0)
          setTotalPages(0)
        }
      } finally {
        setIsLoading(false)
      }

      return () => controller.abort()
    },
    [searchTerm, selectedCategory, itemsPerPage],
  )

  // Initial load and when filters change
  useEffect(() => {
    setCurrentPage(0)
    fetchMedicines(0, true)
  }, [searchTerm, selectedCategory])

  // Filter medicines for display (client-side filtering for mock data)
  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const matchesSearch =
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "" || medicine.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [medicines, searchTerm, selectedCategory])

  // Paginate filtered medicines for display
  const paginatedMedicines = useMemo(() => {
    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredMedicines.slice(0, endIndex) // Show all items up to current page
  }, [filteredMedicines, currentPage, itemsPerPage])

  const handleUpdateStock = async (update: MedicineStockUpdate) => {
    try {
      // Use the API when ready
      // await MedicineService.updateMedicineStock(update.medicineID, update.quantity, update.type)

      setMedicines(
        medicines.map((medicine) => {
          if (medicine.id === update.medicineID) {
            const currentStock = medicine.stockQuantity || 0
            const newStock =
              update.type === "add" ? currentStock + update.quantity : Math.max(0, currentStock - update.quantity)
            return { ...medicine, stockQuantity: newStock }
          }
          return medicine
        }),
      )
    } catch (error) {
      console.error("Failed to update stock:", error)
      setError("Failed to update stock. Please try again.")
    }
  }

  const handleEditMedicine = (updatedMedicine: Medicine) => {
    setMedicines(medicines.map((medicine) => (medicine.id === updatedMedicine.id ? updatedMedicine : medicine)))
  }

  const handleAddMedicine = (newMedicine: Medicine) => {
    setMedicines([newMedicine, ...medicines]) // Add to beginning of list
    setError(null) // Clear any existing errors
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (page * itemsPerPage >= medicines.length) {
      fetchMedicines(page)
    }
  }

  const handleLoadMore = () => {
    const nextPage = Math.floor(medicines.length / itemsPerPage)
    fetchMedicines(nextPage)
  }

  const handleRefresh = () => {
    setCurrentPage(0)
    fetchMedicines(0, true)
  }

  // Calculate stats
  const lowStockThreshold = 50
  const lowStockCount = filteredMedicines.filter(
    (medicine) => medicine.stockQuantity !== undefined && medicine.stockQuantity <= lowStockThreshold,
  ).length

  const expiringSoonCount = filteredMedicines.filter(
    (medicine) =>
      medicine.expiryDate && new Date(medicine.expiryDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000,
  ).length

  // Get categories from actual medicine data
  const categories = useMemo(() => {
    const cats = medicines.map((medicine) => medicine.category)
    return [...new Set(cats)].sort()
  }, [medicines])

  // Show loading component during initial load
  if (isLoading && medicines.length === 0) {
    return (
      <Loading
        message="Loading Medicines"
        subMessage="Fetching medicine inventory from the system..."
        variant="heartbeat"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medicine Management</h1>
          <p className="text-gray-600">Manage medicine inventory and stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={handleOpenAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Medicine
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Medicines</p>
                <p className="text-2xl font-bold text-blue-600">{filteredMedicines.length}</p>
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
            {paginatedMedicines.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                onEdit={handleOpenEditDialog}
                onUpdateStock={handleOpenStockDialog}
              />
            ))}
          </div>

          {paginatedMedicines.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              {error ? "Unable to load medicines. Please try refreshing." : "No medicines found matching your criteria"}
            </div>
          )}

          {/* Pagination */}
          {filteredMedicines.length > 0 && (
            <MedicinePagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredMedicines.length / itemsPerPage)}
              totalItems={filteredMedicines.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onLoadMore={handleLoadMore}
              hasMore={medicines.length < totalItems}
              isLoading={isLoading}
            />
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
