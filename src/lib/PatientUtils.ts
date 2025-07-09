export const formatHeight = (heightCm: number): string => {
  const feet = Math.floor(heightCm / 30.48)
  const inches = Math.round((heightCm / 30.48 - feet) * 12)
  return `${feet}'${inches}" (${heightCm} cm)`
}

export const formatWeight = (weightKg: number): string => {
  const pounds = Math.round(weightKg * 2.20462)
  return `${pounds} lbs (${weightKg} kg)`
}
export function calculateAge(dob?: string | Date): number | null {
  if (!dob) return null

  const birthDate = typeof dob === "string" ? new Date(dob) : dob
  if (isNaN(birthDate.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()

  const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
  if (today < thisYearBirthday) {
    age--
  }

  return age
}

