import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { register } = useAuth();
    const nav = useNavigate()
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await register(username, email, password)
        nav('/login')
    }
    return (
        <div style={{ maxWidth: 360, margin: '6rem auto' }}>
            <h1>Register</h1>
            <form onSubmit={onSubmit}>
                <input placeholder="Username" value={username}
                    onChange={e=>setUsername(e.target.value)} />
                <input placeholder="Email" value={email}
                    onChange={e=>setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password}
                    onChange={e=>setPassword(e.target.value)} />
                <button type="submit">Create account</button>
            </form>
            <p>Have an account? <Link to="/login">Login</Link></p>
        </div>
    )
}