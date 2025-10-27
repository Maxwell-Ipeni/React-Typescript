import { User } from '../types'

const STORAGE_KEY = 'dummy_users_v1'

// A compact unique id for demo records.
function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// This code reads persisted users from localStorage. Returns [] on error.
function read(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User[]) : []
  } catch {
    return []
  }
}

// Write users back to localStorage.
function write(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

// This function checks if user data exists in storage; if not, it seeds the storage with sample users and returns 
// them—ensuring the app always starts with valid data
function ensureSeed() {
  const users = read()
  if (users.length === 0) {
    const sample: User[] = [
      { id: makeId(), username: 'alice', email: 'alice@example.com', state: 'CA', country: 'USA', age: 28 },
      { id: makeId(), username: 'bob', email: 'bob@example.com', state: 'NY', country: 'USA', age: 34 },
    ]
    write(sample)
    return sample
  }
  return users
}

// Small promise-based delay used to simulate network latency in the demo.
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

const dummyApi = {
  // Return all users (newest first). Ensures seed data.
  async getAll(): Promise<User[]> {
    await delay()
    return ensureSeed().slice().reverse()
  },

  // Return single user by id or null if not found.
  async getById(id: string): Promise<User | null> {
    await delay()
    return read().find((u) => u.id === id) || null
  },

  // Create a new user from partial data. Returns the created user.
  async create(data: Partial<User>): Promise<User> {
    await delay()
    const users = read()
    const user: User = {
      id: makeId(),
      username: data.username || 'unknown',
      email: data.email || '',
      state: data.state || '',
      country: data.country || '',
      age: data.age ?? 0,
    }
    users.unshift(user)
    write(users)
    return user
  },

  // Update an existing user. Returns the updated user or null when not found.
  async update(id: string, patch: Partial<User>): Promise<User | null> {
    await delay()
    const users = read()
    const i = users.findIndex((u) => u.id === id)
    if (i === -1) return null
    users[i] = { ...users[i], ...patch }
    write(users)
    return users[i]
  },

  // Remove a user by id. Returns true when a user was deleted.
  async remove(id: string): Promise<boolean> {
    await delay()
    const users = read()
    const filtered = users.filter((u) => u.id !== id)
    if (filtered.length === users.length) return false
    write(filtered)
    return true
  },
}

export default dummyApi
