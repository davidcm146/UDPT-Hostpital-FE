"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, X, Loader2 } from "lucide-react"
import { MedicineService } from "@/services/medicineService"
import type { Medicine } from "@/types/medicine"
import { toast } from "react-toastify"

interface MedicineEditDialogProps {
  medicine: Medicine | null
  isOpen: boolean
  onClose: () => void
  onSave: (medicine: Medicine) => void
}

export function MedicineEditDialog({ medicine, isOpen, onClose, onSave }: MedicineEditDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dosageForm: "TABLET",
    category: "",
    price: 0,
    stockQuantity: 0,
    expiryDate: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name,
        description: medicine.description || "",
        dosageForm: medicine.dosageForm,
        category: medicine.category,
        price: medicine.price,
        stockQuantity: medicine.stockQuantity || 0,
        expiryDate: medicine.expiryDate.toString() || "",
      })
    }
  }, [medicine])

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Medicine name is required"
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required"
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0"
    }

    if (formData.stockQuantity < 0) {
      newErrors.stockQuantity = "Stock quantity cannot be negative"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!medicine || !validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const updatedMedicine = await MedicineService.updateMedicine(medicine.id, {
        name: formData.name,
        description: formData.description || "",
        dosageForm: formData.dosageForm,
        category: formData.category,
        price: formData.price,
        stockQuantity: formData.stockQuantity,
        expiryDate: formData.expiryDate || "",
      })

      onSave(updatedMedicine)
      toast.success("Medicine updated!");
      handleClose()
    } catch (error) {
      console.error("Failed to update medicine:", error)
      setErrors({ submit: error instanceof Error ? error.message : "Failed to update medicine" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (isLoading) return // Prevent closing while loading

    setErrors({})
    onClose()
  }

  const dosageForms = [
    { value: "TABLET", label: "Tablet" },
    { value: "CAPSULE", label: "Capsule" },
    { value: "INJECTION", label: "Injection" },
    { value: "SYRUP", label: "Syrup" },
    { value: "INHALER", label: "Inhaler" },
    { value: "CREAM", label: "Cream" },
    { value: "DROPS", label: "Drops" },
    { value: "POWDER", label: "Powder" },
    { value: "OINTMENT", label: "Ointment" },
  ]

  const categories = [
    { value: "ANTIBIOTICS", label: "Antibiotics" },
    { value: "PAIN_RELIEF", label: "Pain Relief" },
    { value: "VITAMIN_D3", label: "Vitamin D3" },
    { value: "VITAMIN_B", label: "Vitamin B" },
    { value: "VITAMIN_C", label: "Vitamin C" },
    { value: "ANTACIDS", label: "Antacids" },
    { value: "ANTIHISTAMINES", label: "Antihistamines" },
    { value: "CARDIOVASCULAR", label: "Cardiovascular" },
    { value: "DIABETES", label: "Diabetes" },
    { value: "RESPIRATORY", label: "Respiratory" },
  ]

  if (!medicine) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="mr-2 h-5 w-5" />
            Edit Medicine
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Medicine Name */}
          <div>
            <Label htmlFor="name">Medicine Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500 mt-2" : "mt-2"}
              placeholder="Enter medicine name"
              disabled={isLoading}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="mt-2"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              placeholder="Enter medicine description"
              disabled={isLoading}
            />
          </div>

          {/* Dosage Form and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dosageForm">Dosage Form *</Label>
              <Select
                value={formData.dosageForm}
                onValueChange={(value) => handleInputChange("dosageForm", value)}
                disabled={isLoading}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select dosage form" />
                </SelectTrigger>
                <SelectContent>
                  {dosageForms.map((form) => (
                    <SelectItem key={form.value} value={form.value}>
                      {form.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.category ? "border-red-500 mt-2" : "mt-2"}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price per Unit ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                className={errors.price ? "border-red-500 mt-2" : "mt-2"}
                placeholder="0.00"
                disabled={isLoading}
              />
              {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <Label htmlFor="stockQuantity">Stock Quantity *</Label>
              <Input
                id="stockQuantity"
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => handleInputChange("stockQuantity", Number.parseInt(e.target.value) || 0)}
                className={errors.stockQuantity ? "border-red-500 mt-2" : "mt-2"}
                placeholder="0"
                disabled={isLoading}
              />
              {errors.stockQuantity && <p className="text-sm text-red-500 mt-1">{errors.stockQuantity}</p>}
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <div className="relative mt-2">
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                className="pr-10"
                min={new Date().toISOString().split("T")[0]} // Prevent past dates
                max={new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} // Max 10 years from now
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {formData.expiryDate && (
              <div className="mt-1 space-y-1">
                <p className="text-xs text-gray-500">
                  Expires:{" "}
                  {new Date(formData.expiryDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {new Date(formData.expiryDate).getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000 && (
                  <p className="text-xs text-orange-600 font-medium">⚠️ Expires within 90 days</p>
                )}
              </div>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent" disabled={isLoading}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
