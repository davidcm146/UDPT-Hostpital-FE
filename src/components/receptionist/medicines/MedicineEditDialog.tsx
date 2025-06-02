import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Medicine } from "@/types/medicine"

interface MedicineEditDialogProps {
  medicine: Medicine | null
  isOpen: boolean
  onClose: () => void
  onSave: (medicine: Medicine) => void
}

export function MedicineEditDialog({ medicine, isOpen, onClose, onSave }: MedicineEditDialogProps) {
  const [editForm, setEditForm] = useState<Medicine | null>(null)

  // Initialize form when medicine changes
  useEffect(() => {
    if (medicine) {
      setEditForm({ ...medicine })
    }
  }, [medicine])

  const handleInputChange = (field: keyof Medicine, value: any) => {
    if (!editForm) return
    setEditForm({ ...editForm, [field]: value })
  }

  const handleSubmit = () => {
    if (!editForm) return
    onSave(editForm)
    onClose()
  }

  const handleClose = () => {
    setEditForm(null)
    onClose()
  }

  if (!medicine || !editForm) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Medicine - {medicine.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Medicine Name</Label>
              <Input id="name" value={editForm.name} onChange={(e) => handleInputChange("name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                value={editForm.manufacturer}
                onChange={(e) => handleInputChange("manufacturer", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editForm.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={editForm.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dosageForm">Dosage Form</Label>
              <select
                id="dosageForm"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editForm.dosageForm}
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
              <Label htmlFor="strength">Strength</Label>
              <Input
                id="strength"
                value={editForm.strength}
                onChange={(e) => handleInputChange("strength", e.target.value)}
                placeholder="e.g., 20mg, 500mg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price per Unit ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={editForm.price}
                onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="unit">Units per Package</Label>
              <Input
                id="unit"
                type="number"
                min="1"
                value={editForm.unit}
                onChange={(e) => handleInputChange("unit", Number.parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <Label htmlFor="minimumStock">Minimum Stock</Label>
              <Input
                id="minimumStock"
                type="number"
                min="0"
                value={editForm.minimumStock || ""}
                onChange={(e) => handleInputChange("minimumStock", Number.parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="batchNumber">Batch Number</Label>
              <Input
                id="batchNumber"
                value={editForm.batchNumber || ""}
                onChange={(e) => handleInputChange("batchNumber", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={editForm.expiryDate ? new Date(editForm.expiryDate).toISOString().split("T")[0] : ""}
                onChange={(e) => handleInputChange("expiryDate", e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="prescriptionRequired"
              checked={editForm.prescriptionRequired}
              onCheckedChange={(checked) => handleInputChange("prescriptionRequired", checked)}
            />
            <Label htmlFor="prescriptionRequired">Prescription Required</Label>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
