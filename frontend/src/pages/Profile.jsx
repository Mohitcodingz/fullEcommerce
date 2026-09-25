import { useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import AuthContext from '../context/authContextValue'

export default function Profile() {
  const { user } = useContext(AuthContext)

  if (!user) return <Navigate to="/login" replace />

  return (
    <main className="profile-page">
      <p className="homeKicker">Your account</p>
      <h1>{user.name}</h1>
      <dl>
        <div><dt>Email</dt><dd>{user.email}</dd></div>
        <div><dt>Account type</dt><dd>{user.role || 'customer'}</dd></div>
      </dl>
      <Link to="/shop">Browse products</Link>
    </main>
  )
}