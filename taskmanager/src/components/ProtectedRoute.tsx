import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { JSX } from 'react'

type Props = { children: JSX.Element }

export default function ProtectedRoute({ children }: Props) {
  const { isAuth, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <span>Loading…</span>
      </div>
    )
  }

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
