import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from '../api/axios'

// Decode JWT payload without a library
function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return {}
  }
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const res = await axios.post('/api/auth/login/', { email, password })
        const { access, refresh } = res.data
        // Decode user info from the JWT payload (name, role, clinic_id are embedded)
        const payload = parseJwt(access)
        const user = {
          id: payload.user_id,
          email: payload.email || email,
          phone: payload.phone || '',
          name: payload.name,
          role: payload.role,
          clinic_id: payload.clinic_id,
        }
        localStorage.setItem('refresh', refresh)
        set({ user, accessToken: access, isAuthenticated: true })
        return user
      },

      logout: async () => {
        try {
          const refresh = localStorage.getItem('refresh')
          if (refresh) {
            await axios.post('/api/auth/logout/', { refresh })
          }
        } catch {
          // ignore logout errors
        } finally {
          localStorage.removeItem('refresh')
          set({ user: null, accessToken: null, isAuthenticated: false })
        }
      },

      setToken: (access) => set({ accessToken: access }),
    }),
    {
      name: 'medicore-auth',
      partialize: (s) => ({ user: s.user, accessToken: s.accessToken, isAuthenticated: s.isAuthenticated })
    }
  )
)
