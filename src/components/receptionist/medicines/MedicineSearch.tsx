import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface MedicineSearchProps {
  searchTerm: string
  selectedCategory: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  categories: string[]
}

export function MedicineSearch({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  categories,
}: MedicineSearchProps) {
  const handleClearFilters = () => {
    onSearchChange("")
    onCategoryChange("")
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="search">Search Medicine</Label>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by name, category, or manufacturer..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="w-full p-2 border mt-2 border-gray-300 rounded-md"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          className="flex items-center gap-1"
          disabled={!searchTerm && !selectedCategory}
        >
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      </div>
    </div>
  )
}
