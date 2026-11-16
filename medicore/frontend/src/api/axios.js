import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({ baseURL: '/' })

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refresh = localStorage.getItem('refresh')
        if (!refresh) throw new Error('No refresh token')
        const res = await axios.post('/api/auth/refresh/', { refresh })
        const newAccess = res.data.access
        useAuthStore.getState().setToken(newAccess)
        originalRequest.headers.Authorization = `Bearer ${newAccess}`
        return api(originalRequest)
      } catch {
        useAuthStore.getState().logout()
      }
    }
    return Promise.reject(err)
  }
)

export default api
