import { useEffect, useState } from 'react'
import api from './api/dummyApi'
import UserForm from './components/UserForm'
import UserList from './components/UserList'
import { User } from './types'
import './App.css'

/*
  App.tsx — demo learning app

  Purpose:
 - This App component fetches user data from a remote JSON API on mount, falls back to local storage if the network fails, and enables full CRUD operations 
 (create, read, update, delete) using a mock API with React state and useEffect.
*/

export default function App() {
  // Generates a short unique id used when upstream data doesn't have a stable id.
  function makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  }
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Load data on mount. Primary source is remote JSON API; fallback is local dummyApi.
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        // Primary data source: public dummy JSON API.
        const res = await fetch('https://dummyjson.com/users')
        if (!res.ok) throw new Error('network')
        const json = await res.json()
        type RemoteUser = {
          id?: number | string
          username?: string
          firstName?: string
          lastName?: string
          email?: string
          address?: { state?: string; city?: string; country?: string }
          age?: number
        }

        const remote = (json.users || []) as RemoteUser[]

        // Convert the remote shape to our local shape. Provide sensible defaults.
        const mapped: User[] = remote.map((u) => ({
          id: String(u.id ?? makeId()),
          username: u.username || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'user',
          email: u.email || '',
          state: u.address?.state || u.address?.city || '',
          country: u.address?.country || '',
          age: u.age ?? 0,
        }))

        // Seed localStorage for the demo API so that subsequent CRUD operations are persisted locally.
        try {
          localStorage.setItem('dummy_users_v1', JSON.stringify(mapped))
        } catch {
          // Storage may fail in some environments; ignore and continue with in-memory data.
        }

        setUsers(mapped)
      } catch {
        // If network fails, fall back to the bundled dummy API which reads from localStorage.
        const local = await api.getAll()
        setUsers(local)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // Create a new user via the dummy API and update local state.
  async function handleCreate(payload: Partial<User>) {
    setLoading(true)
    const u = await api.create(payload)
    setUsers((s) => [u, ...s])
    setShowForm(false)
    setLoading(false)
  }

  // Update an existing user by id. The dummy API returns the updated user or null if not found.
  async function handleUpdate(payload: Partial<User> & { id: string }) {
    setLoading(true)
    const id = payload.id
    const updated = await api.update(id, payload)
    if (updated) setUsers((s) => s.map((x) => (x.id === id ? updated : x)))
    setEditing(null)
    setShowForm(false)
    setLoading(false)
  }

  // Delete a user by id and remove from local state on success.
  async function handleDelete(id: string) {
    const ok = await api.remove(id)
    if (ok) setUsers((s) => s.filter((u) => u.id !== id))
  }

  function startEdit(user: User) {
    setEditing(user)
    setShowForm(true)
  }

  function startCreate() {
    setEditing(null)
    setShowForm(true)
  }

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', padding: 12 }}>
      <header style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <h1>Demo Showing Use of synchronous commands(PUT,GET,POST,DELETE) <br />
          to Fetch data from a json api <br/> using useEffect & useState hooks</h1>
          
      </header>
      <div style={{ marginTop: 8, color: '#555' }}>
        React and TypeScript are used. This demo also exercised common git commands (init, pull, push, add, commit, clone).
      </div>
      <section style={{ marginTop: 16, display: 'grid', gap: 16 }}>
        {showForm && (
          <div>
            <h3>{editing ? 'Edit user(GET)' : 'Create user(POST)'}</h3>
            <UserForm
              initial={editing || {}}
              onSave={(data) => {
                if (editing && editing.id) {
                  handleUpdate({ ...data, id: editing.id })
                } else {
                  handleCreate(data)
                }
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>All users {loading ? '(loading...)' : `(${users.length})`}</h3>
            <div>
              <button onClick={startCreate}>New user</button>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <UserList users={users} onEdit={startEdit} onDelete={handleDelete} />
          </div>
        </div>
      </section>
    </div>
  )
}
 
