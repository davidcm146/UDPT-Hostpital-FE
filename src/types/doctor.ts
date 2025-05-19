export interface Doctor {
  id: number
  name: string
  specialty: string
  location: string
  image: string
  availability: string
  education: string
  experience: string
  languages: string[]
  gender: string
  acceptingNewPatients: boolean
  about: string
}
