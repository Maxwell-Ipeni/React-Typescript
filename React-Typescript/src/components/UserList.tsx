/*
  UserList.tsx
  - Presentational component that renders a list of users in a table.
  - Props (runtime):
    * users: array of user objects
    * onEdit: callback when Edit is clicked (receives user)
    * onDelete: callback when Delete is clicked (receives id)
*/



// @ts-nocheck
// Runtime-only UserList component (no TypeScript-only syntax to avoid editor false-positives)
// Props: { users, onEdit, onDelete }
export default function UserList(props) {
  const { users, onEdit, onDelete } = props || {}
  // Provide safe no-op defaults so callers that omit handlers won't cause runtime errors.
  const safeOnEdit = onEdit || (() => {})
  const safeOnDelete = onDelete || (() => {})
  // Simple empty-state handling.
  if (!users || users.length === 0) return <div>No users yet</div>

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left' }}>Username</th>
          <th style={{ textAlign: 'left' }}>Email</th>
          <th>State</th>
          <th>Country</th>
          <th>Age</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  {users.map((u) => (
          <tr key={u.id} style={{ borderTop: '1px solid #eee' }}>
            <td>{u.username}</td>
            <td>{u.email}</td>
            <td>{u.state}</td>
            <td>{u.country}</td>
            <td style={{ textAlign: 'center' }}>{u.age}</td>
            <td>
              {/* Edit passes the full user object back to the parent */}
              <button onClick={() => safeOnEdit(u)}>Edit</button>{' '}
              {/* Delete only needs the id */}
              <button onClick={() => safeOnDelete(u.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

 

