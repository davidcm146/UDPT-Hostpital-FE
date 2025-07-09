// Format date thành dd/mm/yyyy
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

// Format time string thành HH:MM (24h)
export function formatTime(time: string): string {
  // Giả sử time string đúng chuẩn HH:MM, nếu cần parse từ 12h AM/PM có thể mở rộng
  const [hours, minutes] = time.split(":")
  const h = String(hours).padStart(2, "0")
  const m = String(minutes).padStart(2, "0")
  return `${h}:${m}`
}

export function formatTimeFromHHMM(time: string): string {
  const [hours, minutes] = time.split(":")
  if (!hours || !minutes) return "Invalid time"

  const h = String(hours).padStart(2, "0")
  const m = String(minutes).padStart(2, "0")
  return `${h}:${m}`
}

export function formatTimeFromISO(isoString: string): string {
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return "Invalid time"

  const h = String(date.getHours()).padStart(2, "0")
  const m = String(date.getMinutes()).padStart(2, "0")
  return `${h}:${m}`
}

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins} minutes`
  if (mins === 0) return `${hours} hour${hours > 1 ? "s" : ""}`
  return `${hours} hour${hours > 1 ? "s" : ""} ${mins} minutes`
}

export const formatTimeForAPI = (date: Date, time: string): string => {
  const dateStr = date.toISOString().split("T")[0] // YYYY-MM-DD
  return `${dateStr} ${time}:00` // YYYY-MM-DD HH:mm:ss
}
