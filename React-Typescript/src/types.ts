export interface User {
  id: string
  username: string
  email: string
  state?: string
  country?: string
  age?: number
  // allow extra fields if needed
  [key: string]: unknown
}
