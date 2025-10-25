import { useEffect, useState, FormEvent } from 'react'
import { User } from '../types'

/*
  UserForm.tsx
  - Reusable form component used for both creating and editing users.
  - Props:
    * initial: optional initial field values (used when editing)
    * onSave: called with the form payload when the form is submitted
    * onCancel: called when the user cancels the form
  - Uses local component state for each input so the form is fully controlled.
*/

/**
 * Props (runtime): { initial?, onSave, onCancel }
 */
export default function UserForm({
  initial = {},
  onSave,
  onCancel,
}: {
  initial?: Partial<User>
  onSave: (payload: Partial<User>) => void
  onCancel: () => void
}) {
  const [username, setUsername] = useState(initial.username || '')
  const [email, setEmail] = useState(initial.email || '')
  const [state, setState] = useState(initial.state || '')
  const [country, setCountry] = useState(initial.country || '')
  const [age, setAge] = useState<number | ''>(initial.age ?? '')

  // When the `initial` prop changes (e.g. when editing a different user), update the form fields.
  useEffect(() => {
    setUsername(initial.username || '')
    setEmail(initial.email || '')
    setState(initial.state || '')
    setCountry(initial.country || '')
    setAge(initial.age ?? '')
  }, [initial])

  // Gather field values and call onSave with a Partial<User> payload.
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!username || !email) return
    const payload = {
      ...initial,
      username: username.trim(),
      email: email.trim(),
      state: state.trim(),
      country: country.trim(),
      age: typeof age === 'number' ? age : Number(age) || 0,
    }
    onSave(payload)
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
      <label>
        Username
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>

      <label>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <label>
        State
        <input value={state} onChange={(e) => setState(e.target.value)} />
      </label>

      <label>
        Country
        <input value={country} onChange={(e) => setCountry(e.target.value)} />
      </label>

      <label>
        Age
        <input
          type="number"
          value={age === '' ? '' : String(age)}
          onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
        />
      </label>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

