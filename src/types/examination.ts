export interface ExaminationResult {
  name: string
  value: string | number
  unit?: string
  referenceRange?: string
  status: "normal" | "abnormal" | "pending"
}

export interface ExaminationImage {
  url: string
  description: string
}

export interface Examination {
  id: number
  name: string
  category: "laboratory" | "imaging" | "cardiology" | "neurology" | "general"
  date: string
  doctor: string
  facility: string
  status: "normal" | "abnormal" | "pending"
  summary?: string
  results?: ExaminationResult[]
  images?: ExaminationImage[]
  doctorNotes?: string
  hasReport: boolean
}
