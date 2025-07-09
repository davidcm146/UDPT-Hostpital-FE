import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AppointmentPaginationProps {
  currentPage: number // 0-based
  totalPages: number
  onPageChange: (page: number) => void
}

export function AppointmentPagination({
  currentPage,
  totalPages,
  onPageChange,
}: AppointmentPaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 0) onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages - 1) onPageChange(currentPage + 1)
  }

  // ✅ Chỉ render đúng số lượng page thực tế
  const getPageNumbers = (): number[] => {
    const pages: number[] = []
    for (let i = 0; i < totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage === 0}
        className="flex items-center bg-transparent hover:bg-gray-50"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>

      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={
              currentPage === page
                ? "bg-teal-600 hover:bg-teal-700 text-white"
                : "hover:bg-gray-50"
            }
          >
            {page + 1}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
        className="flex items-center bg-transparent hover:bg-gray-50"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  )
}
