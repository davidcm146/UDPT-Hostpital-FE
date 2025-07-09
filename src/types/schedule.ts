export interface Schedule {
  id: string
  doctorID: string
  date: Date | string
  startTime: string
  endTime: string
  createdAt: Date | string
  updatedAt?: Date | string
}

export interface TimeFrame {
  startTime: string
  endTime: string
}

export interface ScheduleResponse {
  doctorId: string
  timeFrames: TimeFrame[]
}

export interface DoctorScheduleResponse {
  doctorId: string
  date: string
  workShifts: TimeFrame[]
}

export interface AvailableScheduleResponse {
  doctorId: string
  timeFrames: TimeFrame[]
}
