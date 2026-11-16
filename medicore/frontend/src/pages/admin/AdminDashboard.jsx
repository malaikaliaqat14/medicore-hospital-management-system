import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import {
  Building2, Users, Activity, Plus, X, Power,
  Pencil, LogOut, Phone, MapPin, Percent,
  Trash2, ChevronRight, ArrowLeft, Stethoscope,
  Calendar, Clock, FileText, CheckCircle, ShieldCheck,
  Search, Download, Menu, Radio, ExternalLink,
  ChevronDown, UserCheck, AlertCircle, RefreshCw,
  TrendingUp, Layers, CheckCircle2, DollarSign,
  ArrowUpRight, Sparkles, Filter, PieChart as PieIcon
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'

const STATUS_PILLS = {
  BOOKED: 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]',
  CHECK_IN: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
  IN_PROGRESS: 'bg-[#CCFBF1] text-[#0F766E] border-[#5EEAD4]',
  COMPLETED: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
  CANCELLED: 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]',
}

// ── Modal: Onboard / Edit Clinic ─────────────────────────────────────────────
function ClinicModal({ clinic, onClose }) {
  const qc = useQueryClient()
  const isEdit = !!clinic
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: clinic || {
      timezone: 'UTC',
      discount_percent: '0.00',
      sms_enabled: false,
      admin_password: 'password123'
    }
  })

  const save = useMutation({
    mutationFn: (data) =>
      isEdit
        ? api.patch(`/api/admin/clinics/${clinic.id}/`, data)
        : api.post('/api/admin/clinics/', data),
    onSuccess: () => {
      qc.invalidateQueries(['admin-clinics'])
      toast.success(isEdit ? 'Clinic configuration updated.' : 'Clinic node & Primary Admin provisioned successfully!')
      onClose()
    },
    onError: (err) => {
      const msg = err.response?.data
        ? Object.values(err.response.data).flat().join(' ')
        : 'Failed to save clinic.'
      toast.error(msg)
    }
  })

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-[560px] shadow-2xl border border-outline-variant/40 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-surface-container-low border-b border-outline-variant/30 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Clinic Registration</span>
            <h3 className="font-bold text-on-surface text-base sm:text-lg">{isEdit ? 'Edit Clinic Details' : 'Add New Clinic'}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(d => save.mutate(d))} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">
                Clinic / Hospital Name *
              </label>
              <input
                {...register('name', { required: 'Clinic name is required' })}
                className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
                placeholder="e.g. St. Jude Medical Pavilion"
              />
              {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">
                Direct Phone Line *
              </label>
              <input
                {...register('phone', { required: 'Phone is required' })}
                className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
                placeholder="+92 300 1234567"
              />
              {errors.phone && <p className="text-error text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">
                Regional Timezone
              </label>
              <select
                {...register('timezone')}
                className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none bg-surface-container-lowest"
              >
                <option value="UTC">UTC (Standard)</option>
                <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">
                Facility Physical Address *
              </label>
              <textarea
                {...register('address', { required: 'Address is required' })}
                rows={2}
                className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none resize-none"
                placeholder="Campus street, building wing, city, postal code"
              />
              {errors.address && <p className="text-error text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">
                Default Discount %
              </label>
              <input
                {...register('discount_percent')}
                type="number" min="0" max="100" step="0.01"
                className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-2 sm:pt-5">
              <input
                {...register('sms_enabled')}
                type="checkbox"
                id="sms_enabled_modal"
                className="w-4 h-4 rounded accent-primary-container cursor-pointer"
              />
              <label htmlFor="sms_enabled_modal" className="text-xs font-semibold text-on-surface cursor-pointer select-none">
                Enable SMS gateway dispatch
              </label>
            </div>

            {/* ── Clinic Manager Account Section ──────── */}
            {!isEdit && (
              <div className="col-span-1 sm:col-span-2 bg-surface-container-low/60 rounded-xl p-3.5 sm:p-4 border border-outline-variant/30 space-y-3 mt-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    <UserCheck size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                      Clinic Manager Account
                    </h4>
                    <p className="text-[11px] text-on-surface-variant">
                      This person will log in as the manager for this clinic.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">
                      Manager Full Name *
                    </label>
                    <input
                      {...register('admin_name', { required: !isEdit ? 'Manager name is required' : false })}
                      className="w-full border border-outline-variant/60 rounded-xl px-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none bg-surface-container-lowest"
                      placeholder="e.g. Dr. Malaika Khan"
                    />
                    {errors.admin_name && <p className="text-error text-xs mt-1">{errors.admin_name.message}</p>}
                  </div>

                  <div>
                    <label className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">
                      Manager Login Email *
                    </label>
                    <input
                      type="email"
                      {...register('admin_email', { required: !isEdit ? 'Manager email is required' : false })}
                      className="w-full border border-outline-variant/60 rounded-xl px-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none bg-surface-container-lowest"
                      placeholder="manager@clinic.com"
                    />
                    {errors.admin_email && <p className="text-error text-xs mt-1">{errors.admin_email.message}</p>}
                  </div>

                  <div>
                    <label className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">
                      Login Password *
                    </label>
                    <input
                      type="text"
                      {...register('admin_password', {
                        required: !isEdit ? 'Password is required' : false,
                        minLength: { value: 6, message: 'Minimum 6 characters' }
                      })}
                      className="w-full border border-outline-variant/60 rounded-xl px-3 py-2 text-xs font-mono text-on-surface focus:border-primary focus:outline-none bg-surface-container-lowest"
                      placeholder="e.g. password123"
                    />
                    {errors.admin_password && <p className="text-error text-xs mt-1">{errors.admin_password.message}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container-high/60 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={save.isPending}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm disabled:opacity-60"
            >
              {save.isPending ? 'Provisioning…' : isEdit ? 'Save Changes' : 'Provision Clinic & Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal: Add / Assign Clinic Admin ─────────────────────────────────────────
function AddClinicAdminModal({ clinic, onClose }) {
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { password: 'password123' }
  })

  const addMutation = useMutation({
    mutationFn: (data) => api.post(`/api/admin/clinics/${clinic.id}/admins/`, data),
    onSuccess: () => {
      qc.invalidateQueries(['admin-clinic-admins', clinic.id])
      qc.invalidateQueries(['admin-clinics'])
      toast.success('Clinic Administrator provisioned and assigned!')
      onClose()
    },
    onError: (err) => {
      const msg = err.response?.data
        ? Object.values(err.response.data).flat().join(' ')
        : 'Failed to provision admin.'
      toast.error(msg)
    }
  })

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-[460px] shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-surface-container-low border-b border-outline-variant/30 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Access Control</span>
            <h3 className="font-bold text-on-surface text-base sm:text-lg">Add Administrator for {clinic.name}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(d => addMutation.mutate(d))} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">
              Admin Full Name *
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none bg-surface-container-lowest"
              placeholder="e.g. Dr. Salman Akhtar"
            />
            {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">
              Login Email Address *
            </label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none bg-surface-container-lowest"
              placeholder="admin@clinic.com"
            />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">
              Initial Temporary Password *
            </label>
            <input
              type="text"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' }
              })}
              className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm font-mono text-on-surface focus:border-primary focus:outline-none bg-surface-container-lowest"
              placeholder="e.g. password123"
            />
            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
          </div>

          <p className="text-[11px] text-on-surface-variant bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20">
            This account will receive <strong>Clinic Admin</strong> privileges strictly scoped to <strong>{clinic.name}</strong>.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-high/60 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm disabled:opacity-60"
            >
              {addMutation.isPending ? 'Provisioning…' : 'Create & Assign Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Bento Metric Card ────────────────────────────────────────────────────────
function MetricCard({ title, value, sub, icon: Icon, badge, accent }) {
  return (
    <div className="relative overflow-hidden bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] hover:shadow-md transition-shadow group min-w-0 w-full">
      <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant truncate">{title}</span>
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-colors shrink-0">
          <Icon size={17} />
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-mono">{value}</span>
      </div>
      <div className="flex items-center justify-between gap-1 text-xs text-on-surface-variant pt-2 border-t border-surface-container-low">
        <span className="font-medium text-secondary truncate text-[11px] sm:text-xs">{sub}</span>
        {badge && (
          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold text-[10px] shrink-0">
            {badge}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Super Admin Dashboard Component ──────────────────────────────────────────
export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('clinics') // 'clinics' | 'analytics'
  const [selectedClinic, setSelectedClinic] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [clinicDrawerTab, setClinicDrawerTab] = useState('doctors') // 'doctors' | 'patients' | 'admins'
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'active' | 'inactive'
  const [searchQuery, setSearchQuery] = useState('')
  const [showClinicModal, setShowClinicModal] = useState(false)
  const [editClinic, setEditClinic] = useState(null)
  const [showAddAdminModal, setShowAddAdminModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const qc = useQueryClient()
  const { user, logout } = useAuthStore()

  // 1. All Clinics
  const { data: clinics = [], isLoading: loadingClinics } = useQuery({
    queryKey: ['admin-clinics'],
    queryFn: () => api.get('/api/admin/clinics/').then(r => r.data),
  })

  // 2. Selected Clinic Doctors
  const { data: clinicDoctors = [], isLoading: loadingDoctors } = useQuery({
    queryKey: ['admin-clinic-doctors', selectedClinic?.id],
    queryFn: () => api.get(`/api/admin/clinics/${selectedClinic.id}/doctors/`).then(r => r.data),
    enabled: !!selectedClinic,
  })

  // 3. Selected Clinic Patients
  const { data: clinicPatients = [], isLoading: loadingPatients } = useQuery({
    queryKey: ['admin-clinic-patients', selectedClinic?.id],
    queryFn: () => api.get(`/api/admin/clinics/${selectedClinic.id}/patients/`).then(r => r.data),
    enabled: !!selectedClinic && clinicDrawerTab === 'patients',
  })

  // 4. Selected Clinic Admins
  const { data: clinicAdmins = [], isLoading: loadingAdmins } = useQuery({
    queryKey: ['admin-clinic-admins', selectedClinic?.id],
    queryFn: () => api.get(`/api/admin/clinics/${selectedClinic.id}/admins/`).then(r => r.data),
    enabled: !!selectedClinic && clinicDrawerTab === 'admins',
  })

  // 5. Selected Doctor's Patients & Appointments
  const { data: doctorData, isLoading: loadingDoctorPatients } = useQuery({
    queryKey: ['admin-doctor-patients', selectedDoctor?.id],
    queryFn: () => api.get(`/api/admin/clinics/doctor-patients/${selectedDoctor.id}/`).then(r => r.data),
    enabled: !!selectedDoctor,
  })

  // 6. Global Analytics
  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => api.get('/api/auth/analytics/').then(r => r.data),
    enabled: activeNav === 'analytics' || activeNav === 'clinics',
  })

  // Mutations
  const toggleClinic = useMutation({
    mutationFn: (id) => api.post(`/api/admin/clinics/${id}/toggle_active/`),
    onSuccess: (res, id) => {
      qc.invalidateQueries(['admin-clinics'])
      toast.success(`Clinic partition ${res.data.is_active ? 'activated' : 'suspended'}.`)
      if (selectedClinic && selectedClinic.id === id) {
        setSelectedClinic(prev => prev ? { ...prev, is_active: res.data.is_active } : null)
      }
    },
    onError: () => toast.error('Failed to change status.')
  })

  const deleteClinic = useMutation({
    mutationFn: (id) => api.delete(`/api/admin/clinics/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries(['admin-clinics'])
      toast.success('Clinic partition removed.')
      setSelectedClinic(null)
      setSelectedDoctor(null)
    },
    onError: () => toast.error('Failed to delete clinic.')
  })

  // Filtered Clinics
  const filteredClinics = useMemo(() => {
    return clinics.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone || '').toLowerCase().includes(searchQuery.toLowerCase())
      if (!matchesSearch) return false
      if (statusFilter === 'active') return c.is_active
      if (statusFilter === 'inactive') return !c.is_active
      return true
    })
  }, [clinics, searchQuery, statusFilter])

  const activeClinicsCount = clinics.filter(c => c.is_active).length
  const inactiveClinicsCount = clinics.length - activeClinicsCount

  const clinicDoctorsData = useMemo(() => {
    return clinics.slice(0, 6).map(c => ({
      name: c.name.length > 15 ? c.name.slice(0, 14) + '…' : c.name,
      fullName: c.name,
      doctors: Number(c.total_doctors) || 0,
    }))
  }, [clinics])

  const tenantStatusData = useMemo(() => [
    { name: 'Active', value: activeClinicsCount || (clinics.length ? clinics.length : 1), color: '#0F766E' },
    { name: 'Suspended', value: inactiveClinicsCount, color: '#94A3B8' },
  ].filter(item => item.value > 0), [activeClinicsCount, inactiveClinicsCount, clinics.length])

  const platformGrowthData = useMemo(() => [
    { month: 'May', clinics: Math.max(1, Math.round(clinics.length * 0.4)), revenue: 65000 },
    { month: 'Jun', clinics: Math.max(1, Math.round(clinics.length * 0.55)), revenue: 95000 },
    { month: 'Jul', clinics: Math.max(1, Math.round(clinics.length * 0.7)), revenue: 140000 },
    { month: 'Aug', clinics: Math.max(1, Math.round(clinics.length * 0.85)), revenue: 190000 },
    { month: 'Sep', clinics: Math.max(1, Math.round(clinics.length * 0.95)), revenue: 250000 },
    { month: 'Oct', clinics: clinics.length || 1, revenue: analytics?.global_revenue ? Number(analytics.global_revenue) : 320000 }
  ], [clinics.length, analytics?.global_revenue])

  return (
    <div className="min-h-screen w-full max-w-full bg-background text-on-surface font-sans flex antialiased overflow-x-hidden">
      {showClinicModal && <ClinicModal clinic={editClinic} onClose={() => setShowClinicModal(false)} />}
      {showAddAdminModal && selectedClinic && (
        <AddClinicAdminModal clinic={selectedClinic} onClose={() => setShowAddAdminModal(false)} />
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. PERSISTENT CLINICAL SIDEBAR (DESKTOP)                             */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 max-w-[85vw] bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        {/* Brand Logo Header (Fixed at top) */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-surface-container-high/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-black shadow-sm">
              <Activity size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-on-surface text-base tracking-tight leading-tight">MediCore Clinical Enterprise</span>
              <span className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">Platform Hub</span>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {/* Tenant Meta Badge */}
          <div className="m-3 sm:m-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">PLATFORM ACCESS</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                SUPER ADMIN
              </span>
            </div>
            <p className="font-bold text-xs text-on-surface truncate">MediCore Clinical Enterprise</p>
            <p className="text-[11px] text-on-surface-variant">{clinics.length} Hospital Clinics Active</p>
          </div>

          {/* Navigation Section */}
          <div className="px-3 py-2 space-y-6 pb-6">
            <div>
              <span className="px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
                Hospital Network
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setActiveNav('clinics')
                    setSelectedClinic(null)
                    setSelectedDoctor(null)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors ${activeNav === 'clinics' && !selectedClinic && !selectedDoctor
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 size={17} />
                    <span>Clinics Directory</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeNav === 'clinics' ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                    {clinics.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveNav('analytics')
                    setSelectedClinic(null)
                    setSelectedDoctor(null)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors ${activeNav === 'analytics'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                    }`}
                >
                  <Activity size={17} />
                  <span>Platform Analytics</span>
                </button>
              </nav>
            </div>

            <div>
              <span className="px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
                Quick Actions
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => { setEditClinic(null); setShowClinicModal(true); setMobileMenuOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-surface-container-high/40 transition-colors"
                >
                  <Plus size={16} />
                  <span>Add New Clinic</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Session Footer (Always visible at bottom) */}
        <div className="p-4 border-t border-surface-container-high/40 bg-surface-container-low/50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                SA
              </div>
              <span className="text-xs font-bold text-on-surface truncate">{user?.name || 'Super Admin'}</span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high hover:text-error transition-colors shrink-0 cursor-pointer"
            >
              <LogOut size={15} />
              <span className="text-xs font-medium">Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-on-surface/30 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. MAIN OPERATIONAL STAGE                                           */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 w-full">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-1.5 sm:p-2 text-on-surface-variant hover:text-on-surface shrink-0">
              <Menu size={20} />
            </button>
            <div className="relative flex-1 max-w-xs sm:max-w-sm min-w-0">
              <Search size={14} className="absolute left-3 top-2.5 text-on-surface-variant pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search clinics..."
                className="w-full h-9 pl-8 sm:pl-9 pr-3 text-xs bg-surface-container-low border border-transparent rounded-xl focus:bg-surface-container-lowest focus:border-primary/40 focus:outline-none transition-all placeholder:text-outline"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span>All Clinics Operational</span>
            </div>
            <button
              onClick={() => { setEditClinic(null); setShowClinicModal(true) }}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-primary-container hover:bg-primary text-on-primary text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Add Clinic</span>
            </button>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 w-full max-w-full overflow-x-hidden">

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* LEVEL 2: DOCTOR'S PATIENTS VIEW                                    */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {selectedDoctor && selectedClinic && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
              {/* Breadcrumb Header */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-on-surface-variant flex-wrap">
                <button onClick={() => { setSelectedClinic(null); setSelectedDoctor(null) }} className="hover:text-primary transition-colors flex items-center gap-1">
                  <Building2 size={13} /> Clinics
                </button>
                <ChevronRight size={13} className="text-outline shrink-0" />
                <button onClick={() => setSelectedDoctor(null)} className="hover:text-primary transition-colors truncate max-w-[140px] sm:max-w-none">
                  {selectedClinic.name}
                </button>
                <ChevronRight size={13} className="text-outline shrink-0" />
                <span className="text-primary font-bold truncate">Dr. {selectedDoctor.name}'s Patients</span>
              </div>

              {/* Doctor Profile Banner */}
              <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary-container/10 text-primary flex items-center justify-center font-bold text-lg sm:text-xl border border-primary/20 shrink-0">
                    <Stethoscope size={24} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <h2 className="text-lg sm:text-xl font-extrabold text-on-surface">Dr. {selectedDoctor.name}</h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] sm:text-[11px] font-bold">
                        {selectedDoctor.specialty || 'General Practice'}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <span>{selectedDoctor.email}</span>
                      <span>Reg: #{selectedDoctor.registration_number || 'N/A'}</span>
                      <span>Fee: Rs. {selectedDoctor.consultation_fee}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="self-start md:self-auto flex items-center gap-1.5 px-3.5 py-2 border border-outline-variant/60 text-on-surface-variant hover:text-on-surface text-xs font-bold rounded-xl hover:bg-surface-container-low transition-colors shrink-0"
                >
                  <ArrowLeft size={14} /> Back to {selectedClinic.name}
                </button>
              </div>

              {/* Patient Appointments Table / Cards */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-surface-container-high/40 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-on-surface text-sm sm:text-base">Treated Patients & Encounters</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">Historical appointments booked under Dr. {selectedDoctor.name}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-xs font-bold font-mono shrink-0">
                    {doctorData?.appointments?.length || 0} Records
                  </span>
                </div>

                {loadingDoctorPatients ? (
                  <div className="p-12 text-center text-on-surface-variant text-sm">Loading patient records…</div>
                ) : !doctorData?.appointments || doctorData.appointments.length === 0 ? (
                  <div className="p-12 text-center">
                    <Users size={36} className="mx-auto text-outline mb-2" />
                    <p className="font-bold text-on-surface text-sm">No patient encounters recorded yet</p>
                    <p className="text-xs text-on-surface-variant mt-1">Appointments booked for this doctor will display here.</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-low/50 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                            <th className="py-3 px-5">Patient Name</th>
                            <th className="py-3 px-5">Scheduled Date & Time</th>
                            <th className="py-3 px-5 text-center">Token</th>
                            <th className="py-3 px-5">Encounter Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container text-xs text-on-surface">
                          {doctorData.appointments.map(appt => (
                            <tr key={appt.id} className="hover:bg-surface-container-low/50 transition-colors">
                              <td className="py-3.5 px-5 font-bold text-on-surface">{appt.patient_name}</td>
                              <td className="py-3.5 px-5 font-mono text-on-surface-variant">
                                {new Date(appt.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                              </td>
                              <td className="py-3.5 px-5 text-center font-bold text-primary font-mono">
                                #{appt.token_number || '—'}
                              </td>
                              <td className="py-3.5 px-5">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${STATUS_PILLS[appt.status] || STATUS_PILLS.BOOKED}`}>
                                  {appt.status.replace('_', ' ')}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card List View */}
                    <div className="block md:hidden divide-y divide-surface-container">
                      {doctorData.appointments.map(appt => (
                        <div key={appt.id} className="p-3.5 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-on-surface text-sm">{appt.patient_name}</span>
                            <span className="px-2 py-0.5 rounded-lg bg-surface-container-low font-mono font-bold text-primary text-xs">
                              Token #{appt.token_number || '—'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-on-surface-variant">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock size={12} className="text-secondary" />
                              {new Date(appt.scheduled_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${STATUS_PILLS[appt.status] || STATUS_PILLS.BOOKED}`}>
                              {appt.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* LEVEL 1: CLINIC DRILL-DOWN MODAL / DETAIL STAGE                     */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {selectedClinic && !selectedDoctor && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
              {/* Back to All Clinics Breadcrumb */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                  <button onClick={() => setSelectedClinic(null)} className="hover:text-primary transition-colors flex items-center gap-1">
                    <Building2 size={13} /> Clinics Directory
                  </button>
                  <ChevronRight size={13} className="text-outline" />
                  <span className="text-primary font-bold truncate">{selectedClinic.name}</span>
                </div>

                <button
                  onClick={() => setSelectedClinic(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low text-xs font-semibold rounded-xl text-on-surface hover:bg-surface-container-high transition-colors shrink-0"
                >
                  <ArrowLeft size={13} /> Back
                </button>
              </div>

              {/* Sub-Tabs: Doctors, Patients, Admins */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
                <div className="flex items-center justify-start p-3 sm:p-4 bg-surface-container-low/50 border-b border-surface-container-high/40 overflow-x-auto no-scrollbar">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => setClinicDrawerTab('doctors')}
                      className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${clinicDrawerTab === 'doctors'
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                    >
                      Doctors ({clinicDoctors.length})
                    </button>
                    <button
                      onClick={() => setClinicDrawerTab('patients')}
                      className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${clinicDrawerTab === 'patients'
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                    >
                      Patients ({clinicPatients.length})
                    </button>
                    <button
                      onClick={() => setClinicDrawerTab('admins')}
                      className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${clinicDrawerTab === 'admins'
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                    >
                      Clinic Admins ({clinicAdmins.length})
                    </button>
                  </div>
                </div>

                {/* TAB 1: DOCTORS */}
                {clinicDrawerTab === 'doctors' && (
                  <div>
                    {loadingDoctors ? (
                      <div className="p-12 text-center text-on-surface-variant text-sm">Loading clinic doctors…</div>
                    ) : clinicDoctors.length === 0 ? (
                      <div className="p-12 text-center">
                        <Stethoscope size={36} className="mx-auto text-outline mb-2" />
                        <p className="font-bold text-on-surface text-sm">No doctors accredited yet</p>
                        <p className="text-xs text-on-surface-variant mt-1">Medical practitioners can be assigned in clinic administration.</p>
                      </div>
                    ) : (
                      <>
                        {/* Desktop Doctors Table */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-surface-container-low/50 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                                <th className="py-3 px-5">Doctor Profile</th>
                                <th className="py-3 px-5">Specialty</th>
                                <th className="py-3 px-5">Consultation Fee</th>
                                <th className="py-3 px-5 text-center">Enrolled Patients</th>
                                <th className="py-3 px-5 text-center">Appointments</th>
                                <th className="py-3 px-5 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container text-xs text-on-surface">
                              {clinicDoctors.map(doc => (
                                <tr
                                  key={doc.id}
                                  onClick={() => setSelectedDoctor(doc)}
                                  className="hover:bg-surface-container-low/50 transition-colors cursor-pointer group"
                                >
                                  <td className="py-3.5 px-5">
                                    <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 rounded-xl bg-primary-container/10 text-primary font-bold flex items-center justify-center text-xs">
                                        {doc.name.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <p className="font-bold text-on-surface group-hover:text-primary transition-colors">Dr. {doc.name}</p>
                                        <p className="text-[11px] text-on-surface-variant">{doc.email} · Reg #{doc.registration_number || 'N/A'}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-5">
                                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/60 text-on-secondary-container text-[11px] font-semibold">
                                      {doc.specialty || 'General Practitioner'}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-5 font-bold font-mono text-on-surface">
                                    Rs. {doc.consultation_fee}
                                  </td>
                                  <td className="py-3.5 px-5 text-center font-bold text-primary font-mono">
                                    {doc.total_patients} Patients
                                  </td>
                                  <td className="py-3.5 px-5 text-center font-semibold font-mono text-on-surface-variant">
                                    {doc.total_appointments} Encounters
                                  </td>
                                  <td className="py-3.5 px-5 text-right" onClick={e => e.stopPropagation()}>
                                    <button
                                      onClick={() => setSelectedDoctor(doc)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-container hover:bg-primary text-on-primary font-bold text-xs rounded-lg transition-all shadow-xs"
                                    >
                                      <Users size={13} />
                                      <span>View Patients</span>
                                      <ChevronRight size={13} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Doctors Card List */}
                        <div className="block md:hidden divide-y divide-surface-container">
                          {clinicDoctors.map(doc => (
                            <div key={doc.id} className="p-4 space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-primary-container/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                                    {doc.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-on-surface text-sm">Dr. {doc.name}</h4>
                                    <p className="text-[11px] text-on-surface-variant">{doc.email}</p>
                                  </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-secondary-container/60 text-on-secondary-container text-[10px] font-semibold shrink-0">
                                  {doc.specialty || 'General'}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs text-on-surface-variant bg-surface-container-low/40 p-2.5 rounded-xl">
                                <span>Fee: <strong className="font-mono text-on-surface">Rs. {doc.consultation_fee}</strong></span>
                                <span><strong className="text-primary font-mono">{doc.total_patients}</strong> Patients</span>
                                <span><strong className="font-mono">{doc.total_appointments}</strong> Visits</span>
                              </div>

                              <button
                                onClick={() => setSelectedDoctor(doc)}
                                className="w-full py-2 bg-primary-container hover:bg-primary text-on-primary font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                              >
                                <Users size={14} />
                                <span>Drill Down: View Doctor's Patients</span>
                                <ChevronRight size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* TAB 2: PATIENTS */}
                {clinicDrawerTab === 'patients' && (
                  <div>
                    {loadingPatients ? (
                      <div className="p-12 text-center text-on-surface-variant text-sm">Loading clinic patients…</div>
                    ) : clinicPatients.length === 0 ? (
                      <div className="p-12 text-center">
                        <Users size={36} className="mx-auto text-outline mb-2" />
                        <p className="font-bold text-on-surface text-sm">No registered patients</p>
                        <p className="text-xs text-on-surface-variant mt-1">Patients booked at this facility will populate here.</p>
                      </div>
                    ) : (
                      <>
                        {/* Desktop Patients Table */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-surface-container-low/50 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                                <th className="py-3 px-5">Patient Name</th>
                                <th className="py-3 px-5">Email Address</th>
                                <th className="py-3 px-5 text-center">Total Appointments</th>
                                <th className="py-3 px-5">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container text-xs text-on-surface">
                              {clinicPatients.map(pt => (
                                <tr key={pt.id} className="hover:bg-surface-container-low/50 transition-colors">
                                  <td className="py-3.5 px-5 font-bold text-on-surface">{pt.name}</td>
                                  <td className="py-3.5 px-5 text-on-surface-variant">{pt.email}</td>
                                  <td className="py-3.5 px-5 text-center font-bold text-primary font-mono">{pt.total_appointments}</td>
                                  <td className="py-3.5 px-5">
                                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                                      Active Patient
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Patients Card List */}
                        <div className="block md:hidden divide-y divide-surface-container">
                          {clinicPatients.map(pt => (
                            <div key={pt.id} className="p-3.5 flex items-center justify-between gap-3">
                              <div>
                                <h4 className="font-bold text-on-surface text-sm">{pt.name}</h4>
                                <p className="text-[11px] text-on-surface-variant">{pt.email}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="font-mono font-bold text-primary text-xs">{pt.total_appointments} Visits</span>
                                <span className="block px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[9px] font-bold mt-1">
                                  Active
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* TAB 3: ADMINS */}
                {clinicDrawerTab === 'admins' && (
                  <div className="space-y-4">
                    {/* Header with Add Admin button */}
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-high/40 bg-surface-container-low/30">
                      <div>
                        <h4 className="font-bold text-sm text-on-surface">Clinic Administrators</h4>
                        <p className="text-xs text-on-surface-variant">Users authorized with clinic administration privileges for {selectedClinic.name}.</p>
                      </div>
                      <button
                        onClick={() => setShowAddAdminModal(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto"
                      >
                        <Plus size={14} />
                        <span>Add Clinic Admin</span>
                      </button>
                    </div>

                    {loadingAdmins ? (
                      <div className="p-12 text-center text-on-surface-variant text-sm">Loading clinic administrators…</div>
                    ) : clinicAdmins.length === 0 ? (
                      <div className="p-10 sm:p-12 text-center space-y-3">
                        <UserCheck size={36} className="mx-auto text-outline mb-2" />
                        <p className="font-bold text-on-surface text-base">No administrators assigned yet</p>
                        <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                          Every clinic partition needs an administrator so clinic management can log in, accredit doctors, and oversee patient care.
                        </p>
                        <button
                          onClick={() => setShowAddAdminModal(true)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-bold text-xs shadow-xs transition-all"
                        >
                          <Plus size={14} />
                          <span>Provision Primary Admin Now</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Desktop Admins Table */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-surface-container-low/50 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                                <th className="py-3 px-5">Admin Name</th>
                                <th className="py-3 px-5">Email Address</th>
                                <th className="py-3 px-5">Role Assigned</th>
                                <th className="py-3 px-5">Access State</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container text-xs text-on-surface">
                              {clinicAdmins.map(adm => (
                                <tr key={adm.id} className="hover:bg-surface-container-low/50 transition-colors">
                                  <td className="py-3.5 px-5 font-bold text-on-surface">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 rounded-lg bg-secondary-container/50 text-secondary font-bold text-xs flex items-center justify-center shrink-0">
                                        {adm.name.charAt(0).toUpperCase()}
                                      </div>
                                      <span>{adm.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-5 text-on-surface-variant font-mono">{adm.email}</td>
                                  <td className="py-3.5 px-5">
                                    <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container text-[10px] font-bold uppercase">
                                      CLINIC ADMIN
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-5">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${adm.is_active ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'}`}>
                                      {adm.is_active ? 'Operational' : 'Disabled'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Admins Card List */}
                        <div className="block md:hidden divide-y divide-surface-container">
                          {clinicAdmins.map(adm => (
                            <div key={adm.id} className="p-3.5 flex items-center justify-between gap-2">
                              <div>
                                <h4 className="font-bold text-on-surface text-sm">{adm.name}</h4>
                                <p className="text-[11px] text-on-surface-variant font-mono">{adm.email}</p>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container text-[10px] font-bold uppercase shrink-0">
                                Clinic Admin
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* LEVEL 0: MASTER MULTI-TENANT CLINICS DIRECTORY                      */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {!selectedClinic && !selectedDoctor && activeNav === 'clinics' && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
              {/* Enterprise Network Header */}
              <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider flex-wrap">
                    <span className="text-primary font-bold">MediCore Platform</span>
                    <ChevronRight size={13} className="text-outline shrink-0" />
                    <span>Clinic Management</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-on-surface tracking-tight mt-1">
                    MediCore Clinical Enterprise
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                    Manage all hospital branches, clinics, doctors, and patient records from one place.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    onClick={() => { setEditClinic(null); setShowClinicModal(true) }}
                    className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-primary-container hover:bg-primary text-on-primary text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    <Plus size={16} />
                    <span>Add New Clinic</span>
                  </button>
                </div>
              </section>

              {/* 3 Bento KPI Metric Cards (Revenue Card Removed) */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
                <MetricCard
                  title="Total Clinics"
                  value={clinics.length}
                  sub={`${activeClinicsCount} Active • ${inactiveClinicsCount} Suspended`}
                  icon={Building2}
                  badge="Active Network"
                />
                <MetricCard
                  title="Active Doctors"
                  value={analytics?.total_doctors || '—'}
                  sub="Accredited practitioners"
                  icon={Stethoscope}
                  badge="On Duty"
                />
                <MetricCard
                  title="Registered Patients"
                  value={analytics?.total_patients || '—'}
                  sub="Synchronized patient profiles"
                  icon={Users}
                  badge="Live"
                />
              </section>

              {/* Network Capacity & Distribution Graphs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 w-full">
                {/* Doctor Capacity by Clinic Partition */}
                <div className="lg:col-span-2 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-on-surface text-sm sm:text-base flex items-center gap-2">
                        <Stethoscope size={18} className="text-primary" />
                        <span>Medical Staffing Distribution across Clinics</span>
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Active accredited doctors provisioned across hospital branches.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
                      Hospital Network
                    </span>
                  </div>
                  <div className="h-56 w-full">
                    {clinicDoctorsData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={clinicDoctorsData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} angle={-10} textAnchor="end" />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} allowDecimals={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '12px',
                              border: '1px solid #E2E8F0',
                              fontSize: '11px'
                            }}
                          />
                          <Bar dataKey="doctors" fill="#0F766E" radius={[6, 6, 0, 0]} name="Doctors Rostered" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-on-surface-variant">
                        No clinics registered yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Clinic Operational Status (Donut) */}
                <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-on-surface text-sm sm:text-base flex items-center gap-2 mb-1">
                      <Layers size={18} className="text-primary" />
                      <span>Clinic Status Overview</span>
                    </h3>
                    <p className="text-xs text-on-surface-variant">Active operational clinics vs suspended.</p>
                  </div>

                  <div className="h-40 w-full my-1 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tenantStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {tenantStatusData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '10px',
                            border: '1px solid #E2E8F0',
                            fontSize: '11px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black text-on-surface font-mono">{clinics.length}</span>
                      <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Clinics</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0"></span>
                      <span className="text-xs text-on-surface font-medium truncate">Active: <strong>{activeClinicsCount}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0"></span>
                      <span className="text-xs text-on-surface font-medium truncate">Suspended: <strong>{inactiveClinicsCount}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center bg-surface-container-low p-1 rounded-xl overflow-x-auto no-scrollbar shrink-0">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${statusFilter === 'all'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                  >
                    All ({clinics.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('active')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${statusFilter === 'active'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                  >
                    Active ({activeClinicsCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('inactive')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${statusFilter === 'inactive'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                  >
                    Suspended ({inactiveClinicsCount})
                  </button>
                </div>

                <span className="text-[11px] sm:text-xs text-on-surface-variant font-medium">
                  Showing {filteredClinics.length} of {clinics.length} registered clinics
                </span>
              </div>

              {/* Clinic Directory: Desktop Table + Mobile Card Grid */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden w-full">
                {loadingClinics ? (
                  <div className="p-12 text-center text-on-surface-variant text-sm">Loading clinic partitions…</div>
                ) : filteredClinics.length === 0 ? (
                  <div className="p-12 text-center">
                    <Building2 size={36} className="mx-auto text-outline mb-2" />
                    <p className="font-bold text-on-surface text-sm">No clinics found</p>
                    <p className="text-xs text-on-surface-variant mt-1">Try adjusting your search query or filter.</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-low/70 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                            <th className="py-3.5 px-5">Clinic & Tenant ID</th>
                            <th className="py-3.5 px-5">Location / Address</th>
                            <th className="py-3.5 px-5 text-center">Practitioners</th>
                            <th className="py-3.5 px-5 text-center">Discount %</th>
                            <th className="py-3.5 px-5">Status</th>
                            <th className="py-3.5 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container text-xs text-on-surface">
                          {filteredClinics.map(clinic => (
                            <tr
                              key={clinic.id}
                              onClick={() => setSelectedClinic(clinic)}
                              className="hover:bg-surface-container-low/40 transition-colors cursor-pointer group"
                            >
                              <td className="py-4 px-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center font-bold text-primary text-sm shadow-xs shrink-0">
                                    {clinic.name.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-on-surface text-sm group-hover:text-primary transition-colors truncate">
                                      {clinic.name}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px]">
                                      <span className="font-mono text-outline font-semibold">TID-{String(clinic.id).padStart(4, '0')}</span>
                                      <span>•</span>
                                      <span className="text-secondary font-medium">{clinic.timezone}</span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-1">
                                      {clinic.primary_admin ? (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container-low text-secondary text-[10px] font-semibold truncate max-w-xs">
                                          <UserCheck size={11} className="shrink-0" />
                                          <span className="truncate">Admin: {clinic.primary_admin.name} ({clinic.primary_admin.email})</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-error-container/20 text-error text-[10px] font-semibold">
                                          <AlertCircle size={11} className="shrink-0" />
                                          No Admin Assigned
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-5">
                                <p className="font-medium text-on-surface truncate max-w-xs">{clinic.address}</p>
                                <p className="text-on-surface-variant text-[11px]">{clinic.phone}</p>
                              </td>
                              <td className="py-4 px-5 text-center font-bold font-mono text-primary">
                                <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-xs">
                                  {clinic.total_doctors || 0} Doctors
                                </span>
                              </td>
                              <td className="py-4 px-5 text-center font-semibold font-mono text-on-surface-variant">
                                {clinic.discount_percent}%
                              </td>
                              <td className="py-4 px-5">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${clinic.is_active ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${clinic.is_active ? 'bg-secondary' : 'bg-outline'}`}></span>
                                  {clinic.is_active ? 'Active' : 'Suspended'}
                                </span>
                              </td>
                              <td className="py-4 px-5 text-right" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedClinic(clinic)}
                                    className="px-3 py-1.5 bg-surface-container-low hover:bg-primary-container hover:text-on-primary text-on-surface text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                                  >
                                    <span>View Details</span>
                                    <ChevronRight size={13} />
                                  </button>
                                  <button
                                    onClick={() => { setEditClinic(clinic); setShowClinicModal(true) }}
                                    title="Edit Clinic"
                                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    onClick={() => toggleClinic.mutate(clinic.id)}
                                    title={clinic.is_active ? 'Suspend Clinic' : 'Activate Clinic'}
                                    className={`p-1.5 rounded-lg transition-colors ${clinic.is_active ? 'text-on-surface-variant hover:text-error hover:bg-error-container/30' : 'text-primary hover:bg-secondary-container/40'}`}
                                  >
                                    <Power size={14} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Are you sure you want to delete clinic "${clinic.name}"? This cannot be undone.`)) {
                                        deleteClinic.mutate(clinic.id)
                                      }
                                    }}
                                    title="Delete Clinic"
                                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block md:hidden divide-y divide-surface-container">
                      {filteredClinics.map(clinic => (
                        <div key={clinic.id} className="p-3.5 sm:p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center font-bold text-primary text-xs shrink-0">
                                {clinic.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-on-surface text-sm truncate">{clinic.name}</h4>
                                <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                                  <span className="font-mono">TID-{String(clinic.id).padStart(4, '0')}</span>
                                  <span>•</span>
                                  <span className="text-secondary">{clinic.timezone}</span>
                                </div>
                                {clinic.primary_admin && (
                                  <p className="text-[10px] text-primary truncate mt-0.5">
                                    Admin: {clinic.primary_admin.name} ({clinic.primary_admin.email})
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${clinic.is_active ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${clinic.is_active ? 'bg-secondary' : 'bg-outline'}`}></span>
                              {clinic.is_active ? 'Active' : 'Suspended'}
                            </span>
                          </div>

                          <div className="text-xs text-on-surface-variant space-y-1 bg-surface-container-low/50 p-2.5 rounded-xl">
                            <p className="truncate"><span className="font-semibold text-on-surface">Address:</span> {clinic.address}</p>
                            <p><span className="font-semibold text-on-surface">Phone:</span> {clinic.phone}</p>
                            <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 text-[11px]">
                              <span><strong className="text-primary font-mono">{clinic.total_doctors || 0}</strong> Doctors</span>
                              <span>Discount: <strong className="font-mono text-on-surface">{clinic.discount_percent}%</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-1.5 pt-1">
                            <button
                              onClick={() => setSelectedClinic(clinic)}
                              className="flex-1 py-2 bg-primary-container hover:bg-primary text-on-primary text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1"
                            >
                              <span>View Clinic Details</span>
                              <ChevronRight size={14} />
                            </button>
                            <button
                              onClick={() => { setEditClinic(clinic); setShowClinicModal(true) }}
                              className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors border border-outline-variant/30"
                              title="Edit Clinic"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => toggleClinic.mutate(clinic.id)}
                              className={`p-2 rounded-xl transition-colors border border-outline-variant/30 ${clinic.is_active ? 'text-on-surface-variant hover:text-error' : 'text-primary'}`}
                              title={clinic.is_active ? 'Suspend' : 'Activate'}
                            >
                              <Power size={14} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete clinic "${clinic.name}"?`)) {
                                  deleteClinic.mutate(clinic.id)
                                }
                              }}
                              className="p-2 rounded-xl text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors border border-outline-variant/30"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* VIEW: GLOBAL ANALYTICS                                            */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeNav === 'analytics' && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">System Telemetry</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-on-surface tracking-tight">
                    MediCore Clinical Enterprise Analytics
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                    Platform performance, active clinics, and medical staff capacity across all branches.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                    Live System
                  </span>
                </div>
              </div>

              {/* 3 Bento Cards (Revenue Removed) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
                <MetricCard title="Total Clinics" value={analytics?.total_clinics || clinics.length} sub={`${activeClinicsCount} Operational`} icon={Building2} badge="Active" />
                <MetricCard title="Active Doctors" value={analytics?.total_doctors || 0} sub="Accredited practitioners" icon={Stethoscope} badge="Rostered" />
                <MetricCard title="Registered Patients" value={analytics?.total_patients || 0} sub="Active patient population" icon={Users} badge="Live" />
              </div>

              {/* Platform Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
                {/* Platform Growth & Encounters Trajectory */}
                <div className="lg:col-span-2 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-on-surface text-sm sm:text-base flex items-center gap-2">
                        <TrendingUp size={18} className="text-primary" />
                        <span>Patient Encounters & Network Growth Trajectory</span>
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">Overall patient consultations and active clinical branches over time.</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold">
                      6-Month Window
                    </span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={platformGrowthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="platformAreaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#0F766E" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `Rs ${v}`} width={70} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #E2E8F0',
                            fontSize: '12px'
                          }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#0F766E" strokeWidth={2.5} fillOpacity={1} fill="url(#platformAreaGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Partition Health Donut */}
                <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-on-surface text-sm sm:text-base flex items-center gap-2 mb-1">
                      <Layers size={18} className="text-primary" />
                      <span>Clinic Status Overview</span>
                    </h3>
                    <p className="text-xs text-on-surface-variant">Active vs suspended clinic branches.</p>
                  </div>

                  <div className="h-44 w-full my-2 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tenantStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {tenantStatusData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '10px',
                            border: '1px solid #E2E8F0',
                            fontSize: '11px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black text-on-surface font-mono">{clinics.length}</span>
                      <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Clinics</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0"></span>
                      <span className="text-xs text-on-surface font-medium truncate">Active: <strong>{activeClinicsCount}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0"></span>
                      <span className="text-xs text-on-surface font-medium truncate">Suspended: <strong>{inactiveClinicsCount}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
