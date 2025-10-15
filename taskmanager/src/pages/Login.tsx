import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(username.trim(), password)
      navigate(from, { replace: true })
    } catch (err: any) {
      // Axios errors may have .response.data, but keep it simple:
      setError('Invalid username or password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: '6rem auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 16 }}>Sign in</h1>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
        <input
          autoFocus
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}
        />

        <button
          type="submit"
          disabled={submitting || !username || !password}
          style={{
            padding: '10px 12px',
            border: 0,
            borderRadius: 6,
            background: submitting ? '#bbb' : '#111',
            color: '#fff',
            cursor: submitting ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      {error && <p style={{ color: 'crimson', marginTop: 10 }}>{error}</p>}

      <p style={{ marginTop: 16, color: '#555' }}>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  )
}
