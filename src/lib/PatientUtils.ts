export const formatHeight = (heightCm: number): string => {
  const feet = Math.floor(heightCm / 30.48)
  const inches = Math.round((heightCm / 30.48 - feet) * 12)
  return `${feet}'${inches}" (${heightCm} cm)`
}

export const formatWeight = (weightKg: number): string => {
  const pounds = Math.round(weightKg * 2.20462)
  return `${pounds} lbs (${weightKg} kg)`
}

export function calculateAge(DOB: string | Date): number {
  const birthDate = new Date(DOB)
  const today = new Date()

  let age = today.getFullYear() - birthDate.getFullYear()

  // Kiểm tra nếu chưa tới sinh nhật năm nay thì trừ đi 1
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())

  if (!hasHadBirthdayThisYear) {
    age--
  }

  return age
}
