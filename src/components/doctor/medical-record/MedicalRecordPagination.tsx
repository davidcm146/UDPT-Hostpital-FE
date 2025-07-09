"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

interface MedicalRecordPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function MedicalRecordPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading = false,
}: MedicalRecordPaginationProps) {
  const startItem = currentPage * itemsPerPage + 1
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems)

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(0, currentPage - 2)
      let endPage = Math.min(totalPages - 1, currentPage + 2)

      // Adjust if we're near the beginning or end
      if (currentPage < 2) {
        endPage = Math.min(totalPages - 1, 4)
      } else if (currentPage > totalPages - 3) {
        startPage = Math.max(0, totalPages - 5)
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-center mt-6">
        <div className="text-sm text-gray-600">
          Showing {totalItems} {totalItems === 1 ? "record" : "records"}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Info */}
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalItems} medical records
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* Previous Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0 || isLoading}
          className="bg-transparent"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        {/* Show ellipsis if there are pages before visible range */}
        {pageNumbers[0] > 0 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(0)}
              disabled={isLoading}
              className="bg-transparent"
            >
              1
            </Button>
            {pageNumbers[0] > 1 && <span className="px-2 text-gray-400">...</span>}
          </>
        )}

        {/* Visible page numbers */}
        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNum)}
            disabled={isLoading}
            className={currentPage === pageNum ? "bg-teal-600 hover:bg-teal-700 text-white" : "bg-transparent"}
          >
            {pageNum + 1}
          </Button>
        ))}

        {/* Show ellipsis if there are pages after visible range */}
        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 2 && <span className="px-2 text-gray-400">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages - 1)}
              disabled={isLoading}
              className="bg-transparent"
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* Next Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1 || isLoading}
          className="bg-transparent"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center text-sm text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading...
        </div>
      )}
    </div>
  )
}
