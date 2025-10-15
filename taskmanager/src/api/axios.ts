
import axios from 'axios'

const api = axios.create({
  baseURL: '/api', 
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})


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
