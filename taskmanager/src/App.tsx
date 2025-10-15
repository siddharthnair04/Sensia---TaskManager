import { Routes, Route, Link } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login  from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import { useAuth } from './context/AuthContext'

export default function App(){
  const { isAuth, logout } = useAuth()
    return (
      <div>
        <nav style={{ display:'flex', gap:12, padding:12, borderBottom:'1px solid #eee' }}>
          <Link to="/">Dashboard</Link>
          <Link to="/tasks">Tasks</Link>
          <span style={{ marginLeft:'auto' }}>
            {isAuth ? <button onClick={logout}>Logout</button> : <><Link to="/login">Login</Link> | <Link to="/register">Register</Link></>}
          </span>
        </nav>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks/></ProtectedRoute>} />
        </Routes>
      </div>
  )
}