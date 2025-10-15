// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import { jwtDecode } from 'jwt-decode'

type Jwt = { exp: number; username?: string; user_id?: number }

interface AuthContextType {
  isAuth: boolean
  user: { username?: string } | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as any)
export const useAuth = () => useContext(AuthContext)

function tokenExpired(token: string | null) {
  if (!token) return true
  try {
    const { exp } = jwtDecode<Jwt>(token)
    if (!exp) return true
    // exp is seconds; Date.now is ms
    return Date.now() >= exp * 1000
  } catch {
    return true
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [user, setUser] = useState<{ username?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize from sessionStorage on first load
  useEffect(() => {
    const access = sessionStorage.getItem('access')
    const refresh = sessionStorage.getItem('refresh')

    // If access is expired but refresh exists, try refresh flow once at boot
    const boot = async () => {
      try {
        if (access && !tokenExpired(access)) {
          const decoded = jwtDecode<Jwt>(access)
          setUser({ username: decoded.username })
          setIsAuth(true)
        } else if (refresh && !tokenExpired(refresh)) {
          // Attempt silent refresh on boot
          const res = await api.post('/auth/refresh/', { refresh })
          const newAccess = res.data.access
          sessionStorage.setItem('access', newAccess)
          const decoded = jwtDecode<Jwt>(newAccess)
          setUser({ username: decoded.username })
          setIsAuth(true)
        } else {
          // tokens invalid
          sessionStorage.removeItem('access')
          sessionStorage.removeItem('refresh')
          setIsAuth(false)
          setUser(null)
        }
      } catch {
        // refresh failed
        sessionStorage.removeItem('access')
        sessionStorage.removeItem('refresh')
        setIsAuth(false)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    boot()
  }, [])

  // Keep other tabs in sync (logout/login across tabs)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'access' || e.key === 'refresh') {
        const access = sessionStorage.getItem('access')
        if (access && !tokenExpired(access)) {
          const decoded = jwtDecode<Jwt>(access)
          setUser({ username: decoded.username })
          setIsAuth(true)
        } else {
          setIsAuth(false)
          setUser(null)
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const login = async (username: string, password: string) => {
    const { data } = await api.post('/auth/login/', { username, password })
    sessionStorage.setItem('access', data.access)
    sessionStorage.setItem('refresh', data.refresh)
    const decoded = jwtDecode<Jwt>(data.access)
    setUser({ username: decoded.username || username })
    setIsAuth(true)
  }

  const register = async (username: string, email: string, password: string) => {
    await api.post('/auth/register/', { username, email, password })
  }

  const logout = () => {
    sessionStorage.removeItem('access')
    sessionStorage.removeItem('refresh')
    setIsAuth(false)
    setUser(null)
  }

  const value = useMemo(
    () => ({ isAuth, user, isLoading, login, register, logout }),
    [isAuth, user, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
