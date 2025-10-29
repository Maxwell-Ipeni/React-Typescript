// This code defines the shape of a User object used in the application with 
// required fields (id, username, email) and optional fields (state, country, age).
export interface User {
  id: string
  username: string
  email: string
  state?: string
  country?: string
  age: number
  // this allows extra fields if needed
  [key: string]: unknown
}
