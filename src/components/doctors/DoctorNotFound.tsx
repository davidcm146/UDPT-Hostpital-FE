import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"

const NoDoctorsFound = () => {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Search className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
        <p className="text-gray-600 text-center max-w-md">
          We couldn't find any doctors matching your search criteria. Try adjusting your filters or search terms.
        </p>
      </CardContent>
    </Card>
  )
}

export default NoDoctorsFound
