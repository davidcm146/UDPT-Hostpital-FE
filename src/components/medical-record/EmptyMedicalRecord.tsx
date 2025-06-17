import { CalendarPlus, ClipboardList } from "lucide-react"
import { Button } from "../ui/button"

export const EmptyMedicalRecord = () => {
  return (
    <div className="text-center py-12 bg-white rounded-lg border">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <ClipboardList className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">No Medical Records Found</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        No medical records match your current search and filter criteria. Try adjusting your filters or search terms.
      </p>
      <Button className="bg-teal-600 hover:bg-teal-700">
        <CalendarPlus className="mr-2 h-4 w-4" />
        Schedule a Visit
      </Button>
    </div>
  )
}