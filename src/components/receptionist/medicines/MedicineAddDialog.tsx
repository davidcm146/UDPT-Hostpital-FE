"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, X } from "lucide-react"
import type { Medicine } from "@/types/medicine"

interface MedicineAddDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (medicine: Medicine) => void
}

export function MedicineAddDialog({ isOpen, onClose, onAdd }: MedicineAddDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    description: "",
    category: "",
    dosageForm: "tablet",
    strength: "",
    price: 0,
    unit: 1,
    stockQuantity: 0,
    minimumStock: 10,
    batchNumber: "",
    expiryDate: "",
    prescriptionRequired: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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
    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = "Manufacturer is required"
    }
    if (!formData.category.trim()) {
      newErrors.category = "Category is required"
    }
    if (!formData.strength.trim()) {
      newErrors.strength = "Strength is required"
    }
    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0"
    }
    if (formData.unit <= 0) {
      newErrors.unit = "Units per package must be greater than 0"
    }
    if (formData.stockQuantity < 0) {
      newErrors.stockQuantity = "Stock quantity cannot be negative"
    }
    if (formData.minimumStock < 0) {
      newErrors.minimumStock = "Minimum stock cannot be negative"
    }
    if (!formData.batchNumber.trim()) {
      newErrors.batchNumber = "Batch number is required"
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const newMedicine: Medicine = {
      medicineID: `med-${Date.now()}`, // Generate unique ID
      name: formData.name,
      manufacturer: formData.manufacturer,
      description: formData.description,
      category: formData.category,
      dosageForm: formData.dosageForm,
      strength: formData.strength,
      price: formData.price,
      unit: formData.unit,
      stockQuantity: formData.stockQuantity,
      minimumStock: formData.minimumStock,
      batchNumber: formData.batchNumber,
      expiryDate: new Date(formData.expiryDate),
      prescriptionRequired: formData.prescriptionRequired,
      createdAt: new Date(),
    }

    onAdd(newMedicine)
    handleClose()
  }

  const handleClose = () => {
    // Reset form
    setFormData({
      name: "",
      manufacturer: "",
      description: "",
      category: "",
      dosageForm: "tablet",
      strength: "",
      price: 0,
      unit: 1,
      stockQuantity: 0,
      minimumStock: 10,
      batchNumber: "",
      expiryDate: "",
      prescriptionRequired: false,
    })
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Add New Medicine
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Medicine Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500 mt-2" : "mt-2"}
                placeholder="Enter medicine name"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="manufacturer">Manufacturer *</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                className={errors.manufacturer ? "border-red-500 mt-2" : "mt-2"}
                placeholder="Enter manufacturer name"
              />
              {errors.manufacturer && <p className="text-sm text-red-500 mt-1">{errors.manufacturer}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="mt-2"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={2}
              placeholder="Enter medicine description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={errors.category ? "border-red-500 mt-2" : "mt-2"}
                placeholder="e.g., Antibiotics, Pain Relief"
              />
              {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
            </div>
            <div>
              <Label htmlFor="dosageForm">Dosage Form</Label>
              <select
                id="dosageForm"
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                value={formData.dosageForm}
                onChange={(e) => handleInputChange("dosageForm", e.target.value)}
              >
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="injection">Injection</option>
                <option value="syrup">Syrup</option>
                <option value="inhaler">Inhaler</option>
                <option value="cream">Cream</option>
                <option value="drops">Drops</option>
              </select>
            </div>
            <div>
              <Label htmlFor="strength">Strength *</Label>
              <Input
                id="strength"
                value={formData.strength}
                onChange={(e) => handleInputChange("strength", e.target.value)}
                className={errors.strength ? "border-red-500 mt-2" : "mt-2"}
                placeholder="e.g., 20mg, 500mg"
              />
              {errors.strength && <p className="text-sm text-red-500 mt-1">{errors.strength}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              />
              {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <Label htmlFor="unit">Units per Package *</Label>
              <Input
                id="unit"
                type="number"
                min="1"
                value={formData.unit}
                onChange={(e) => handleInputChange("unit", Number.parseInt(e.target.value) || 1)}
                className={errors.unit ? "border-red-500 mt-2" : "mt-2"}
                placeholder="1"
              />
              {errors.unit && <p className="text-sm text-red-500 mt-1">{errors.unit}</p>}
            </div>
            <div>
              <Label htmlFor="minimumStock">Minimum Stock *</Label>
              <Input
                id="minimumStock"
                type="number"
                min="0"
                value={formData.minimumStock}
                onChange={(e) => handleInputChange("minimumStock", Number.parseInt(e.target.value) || 0)}
                className={errors.minimumStock ? "border-red-500 mt-2" : "mt-2"}
                placeholder="10"
              />
              {errors.minimumStock && <p className="text-sm text-red-500 mt-1">{errors.minimumStock}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="stockQuantity">Initial Stock Quantity *</Label>
              <Input
                id="stockQuantity"
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => handleInputChange("stockQuantity", Number.parseInt(e.target.value) || 0)}
                className={errors.stockQuantity ? "border-red-500 mt-2" : "mt-2"}
                placeholder="0"
              />
              {errors.stockQuantity && <p className="text-sm text-red-500 mt-1">{errors.stockQuantity}</p>}
            </div>
            <div>
              <Label htmlFor="batchNumber">Batch Number *</Label>
              <Input
                id="batchNumber"
                value={formData.batchNumber}
                onChange={(e) => handleInputChange("batchNumber", e.target.value)}
                className={errors.batchNumber ? "border-red-500 mt-2" : "mt-2"}
                placeholder="e.g., BT2024001"
              />
              {errors.batchNumber && <p className="text-sm text-red-500 mt-1">{errors.batchNumber}</p>}
            </div>
            <div>
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                className={errors.expiryDate ? "border-red-500 mt-2" : "mt-2"}
                min={new Date().toISOString().split("T")[0]} // Prevent past dates
              />
              {errors.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="prescriptionRequired"
              checked={formData.prescriptionRequired}
              onCheckedChange={(checked) => handleInputChange("prescriptionRequired", checked)}
            />
            <Label htmlFor="prescriptionRequired">Prescription Required</Label>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
