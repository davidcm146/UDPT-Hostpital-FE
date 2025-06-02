"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus } from "lucide-react"
import type { Medicine, MedicineStockUpdate } from "@/types/medicine"

interface MedicineStockDialogProps {
  medicine: Medicine | null
  isOpen: boolean
  onClose: () => void
  onUpdateStock: (update: MedicineStockUpdate) => void
}

export function MedicineStockDialog({ medicine, isOpen, onClose, onUpdateStock }: MedicineStockDialogProps) {
  const [quantity, setQuantity] = useState("")
  const [type, setType] = useState<"add" | "subtract">("add")
  const [reason, setReason] = useState("")

  const handleSubmit = () => {
    if (!medicine || !quantity || !reason) return

    const update: MedicineStockUpdate = {
      medicineID: medicine.medicineID,
      quantity: Number.parseInt(quantity),
      type,
      reason,
      updatedBy: "Receptionist", // In real app, get from auth context
    }

    onUpdateStock(update)
    setQuantity("")
    setReason("")
    onClose()
  }

  const handleClose = () => {
    setQuantity("")
    setReason("")
    onClose()
  }

  if (!medicine) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Stock - {medicine.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Current Stock</p>
            <p className="text-lg font-semibold">{medicine.stockQuantity || 0} units</p>
          </div>

          <div>
            <Label>Operation Type</Label>
            <div className="flex space-x-2 mt-1">
              <Button
                type="button"
                variant={type === "add" ? "default" : "outline"}
                onClick={() => setType("add")}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Stock
              </Button>
              <Button
                type="button"
                variant={type === "subtract" ? "default" : "outline"}
                onClick={() => setType("subtract")}
                className="flex-1"
              >
                <Minus className="h-4 w-4 mr-1" />
                Remove Stock
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for stock update..."
              rows={3}
            />
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">
              New Stock: {medicine.stockQuantity || 0} {type === "add" ? "+" : "-"} {quantity || 0} ={" "}
              <span className="font-semibold">
                {(medicine.stockQuantity || 0) + (type === "add" ? 1 : -1) * (Number.parseInt(quantity) || 0)} units
              </span>
            </p>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!quantity || !reason} className="flex-1">
              Update Stock
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
