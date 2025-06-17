export interface Schedule {
  id: string
  doctorID: string
  date: Date | string
  startTime: string
  endTime: string
  createdAt: Date | string
  updatedAt?: Date | string
}
