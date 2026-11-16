import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'

import LoginPage from './pages/auth/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import ClinicDashboard from './pages/clinic/ClinicDashboard'
import ConsultationDesk from './pages/doctor/ConsultationDesk'
import PatientHome from './pages/patient/PatientHome'
import ReceptionistDashboard from './pages/reception/ReceptionistDashboard'

const qc = new QueryClient()

function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role) {
    if (Array.isArray(role) && !role.includes(user?.role)) return <Navigate to="/login" replace />
    if (typeof role === 'string' && user?.role !== role) return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#0F172A', color: '#F8FAFC', borderRadius: '12px', border: '1px solid #1E293B', fontSize: '13px', fontWeight: '500' },
        success: { iconTheme: { primary: '#0F766E', secondary: '#FFFFFF' } },
        error: { iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' } }
      }} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={<ProtectedRoute role="SUPER_ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/clinic/*" element={<ProtectedRoute role="CLINIC_ADMIN"><ClinicDashboard /></ProtectedRoute>} />
          <Route path="/reception/*" element={<ProtectedRoute role={['RECEPTIONIST', 'CLINIC_ADMIN']}><ReceptionistDashboard /></ProtectedRoute>} />
          <Route path="/doctor/*" element={<ProtectedRoute role="DOCTOR"><ConsultationDesk /></ProtectedRoute>} />
          <Route path="/patient/*" element={<ProtectedRoute role="PATIENT"><PatientHome /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
