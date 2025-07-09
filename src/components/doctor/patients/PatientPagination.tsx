import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface PatientPaginationProps {
  currentPage: number
  totalPages: number
  totalPatients: number
  patientsPerPage: number
  onPageChange: (page: number) => void
}

export function PatientPagination({
  currentPage,
  totalPages,
  totalPatients,
  patientsPerPage,
  onPageChange,
}: PatientPaginationProps) {
  const startIndex = currentPage * patientsPerPage + 1
  const endIndex = Math.min((currentPage + 1) * patientsPerPage, totalPatients)

  const handlePreviousPage = () => onPageChange(Math.max(0, currentPage - 1))
  const handleNextPage = () => onPageChange(Math.min(totalPages - 1, currentPage + 1))

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1)

    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="sm:flex-row items-center w-full justify-between gap-4">
      {/* Pagination controls */}
      <div className="flex items-center justify-center gap-2">
        {/* Previous page */}
        <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 0}>
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Previous</span>
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[40px] ${currentPage === pageNum ? "bg-teal-600 hover:bg-teal-700" : ""}`}
            >
              {pageNum + 1}
            </Button>
          ))}
        </div>

        {/* Next page */}
        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
          <span className="hidden sm:inline mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
