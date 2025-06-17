import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle, FileText } from "lucide-react"

interface AppointmentTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  counts: {
    pending: number
    confirmed: number
    cancelled: number
  }
}

export function AppointmentTabs({ activeTab, onTabChange, counts }: AppointmentTabsProps) {
  return (
    <TabsList className="bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] mb-4">
      <TabsTrigger value="PENDING" className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Pending Requests ({counts.pending})
      </TabsTrigger>
      <TabsTrigger value="CONFIRMED" className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4" />
        Confirmed ({counts.confirmed})
      </TabsTrigger>
      <TabsTrigger value="CANCELLED" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Cancelled ({counts.cancelled})
      </TabsTrigger>
    </TabsList>
  )
}
