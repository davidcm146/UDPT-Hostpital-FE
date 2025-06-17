// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Calendar, Pill, Eye, User, DollarSign } from "lucide-react"
// import type { PrescriptionWithDetails } from "@/types/prescription"
// import type { Patient } from "@/types/patient"

// interface PrescriptionCardProps {
//   prescription: PrescriptionWithDetails
//   patient?: Patient
//   onViewDetails: (prescription: PrescriptionWithDetails) => void
//   onViewPatient?: (patientId: string) => void
// }

// export function PrescriptionCard({ prescription, patient, onViewDetails, onViewPatient }: PrescriptionCardProps) {
//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "active":
//         return "bg-green-100 text-green-800"
//       case "completed":
//         return "bg-blue-100 text-blue-800"
//       case "cancelled":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   return (
//     <Card className="hover:shadow-md transition-shadow">
//       <CardHeader className="pb-3">
//         <div className="flex justify-between items-start">
//           <div className="space-y-2">
//             <CardTitle className="text-lg">Prescription #{prescription.id.slice(-8)}</CardTitle>
//             <div className="flex items-center space-x-2">
//               <Badge className={getStatusColor(prescription.status)}>{prescription.status}</Badge>
//             </div>
//           </div>
//           <div className="flex space-x-2">
//             <Button variant="outline" size="sm" onClick={() => onViewDetails(prescription)}>
//               <Eye className="h-4 w-4 mr-1" />
//               View
//             </Button>
//             {onViewPatient && (
//               <Button variant="outline" size="sm" onClick={() => onViewPatient(prescription.patientId)}>
//                 <User className="h-4 w-4 mr-1" />
//                 Patient
//               </Button>
//             )}
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-3">
//         {patient && (
//           <div className="flex items-center text-sm text-gray-600">
//             <User className="h-4 w-4 mr-2" />
//             <span>Patient: {patient.name}</span>
//           </div>
//         )}

//         <div className="flex items-center text-sm text-gray-600">
//           <Calendar className="h-4 w-4 mr-2" />
//           <span>Created: {new Date(prescription.createdAt).toLocaleDateString()}</span>
//         </div>

//         <div>
//           <p className="text-sm font-medium text-gray-700 mb-2">Medications ({prescription.details.length}):</p>
//           <div className="space-y-1">
//             {prescription.details.slice(0, 2).map((detail, index) => (
//               <p key={index} className="text-sm text-gray-600">
//                 • {detail.medicine.name} - {detail.dosage} {detail.medicine.unit}
//               </p>
//             ))}
//             {prescription.details.length > 2 && (
//               <p className="text-sm text-gray-500">+{prescription.details.length - 2} more medication(s)</p>
//             )}
//           </div>
//         </div>

//         <div className="flex items-center justify-between pt-2 border-t">
//           <div className="flex items-center text-sm text-gray-500">
//             <Pill className="h-4 w-4 mr-1" />
//             <span>{prescription.details.length} Medication(s)</span>
//           </div>
//           <div className="flex items-center text-sm font-medium">
//             <DollarSign className="h-4 w-4 mr-1" />
//             <span>${prescription.totalPrice.toFixed(2)}</span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
