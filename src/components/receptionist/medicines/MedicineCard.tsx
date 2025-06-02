"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Package, AlertTriangle, CheckCircle } from "lucide-react"
import type { Medicine } from "@/types/medicine"

interface MedicineCardProps {
  medicine: Medicine
  onEdit: (medicine: Medicine) => void
  onUpdateStock: (medicine: Medicine) => void
}

export function MedicineCard({ medicine, onEdit, onUpdateStock }: MedicineCardProps) {
  const isLowStock =
    medicine.stockQuantity !== undefined &&
    medicine.minimumStock !== undefined &&
    medicine.stockQuantity <= medicine.minimumStock

  const isExpiringSoon =
    medicine.expiryDate && new Date(medicine.expiryDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000 // 30 days

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-lg">{medicine.name}</h4>
            <p className="text-sm text-gray-600">
              {medicine.strength} • {medicine.dosageForm}
            </p>
            <p className="text-sm text-gray-500">{medicine.manufacturer}</p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge variant="secondary">{medicine.category}</Badge>
            {medicine.prescriptionRequired && (
              <Badge variant="outline" className="text-xs">
                Prescription Required
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Price per unit:</span>
            <span className="font-medium">${medicine.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Stock:</span>
            <span className={`font-medium ${isLowStock ? "text-red-600" : "text-green-600"}`}>
              {medicine.stockQuantity || 0} units
            </span>
          </div>
          {medicine.expiryDate && (
            <div className="flex justify-between text-sm">
              <span>Expires:</span>
              <span className={`font-medium ${isExpiringSoon ? "text-orange-600" : "text-gray-600"}`}>
                {new Date(medicine.expiryDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="space-y-2 mb-4">
          {isLowStock && (
            <div className="flex items-center p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-sm text-red-800">Low stock alert</span>
            </div>
          )}
          {isExpiringSoon && (
            <div className="flex items-center p-2 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
              <span className="text-sm text-orange-800">Expiring soon</span>
            </div>
          )}
          {!isLowStock && !isExpiringSoon && (
            <div className="flex items-center p-2 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-green-800">Stock OK</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(medicine)} className="flex-1">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" onClick={() => onUpdateStock(medicine)} className="flex-1">
            <Package className="h-4 w-4 mr-1" />
            Update Stock
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
