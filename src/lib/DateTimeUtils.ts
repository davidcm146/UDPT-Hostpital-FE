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
