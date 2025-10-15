// src/api/axios.ts
import axios from 'axios'

// For dev, we'll use the Vite proxy ("/api" → "http://localhost:8000")
const api = axios.create({
  baseURL: '/api', // This matches the proxy rule in vite.config.ts
})

// Attach access token to every request if it exists
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refresh = sessionStorage.getItem('refresh')
      if (refresh) {
        try {
          const res = await axios.post('/api/auth/refresh/', { refresh })
          const newAccess = res.data.access
          sessionStorage.setItem('access', newAccess)
          originalRequest.headers.Authorization = `Bearer ${newAccess}`
          return axios(originalRequest)
        } catch (err) {
          console.error('Token refresh failed:', err)
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
