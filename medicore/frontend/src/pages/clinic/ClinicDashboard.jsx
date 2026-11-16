import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import {
  Calendar, Clock, CheckCircle, Users, Activity, Plus, X,
  Stethoscope, LogOut, UserPlus, Pencil, Trash2, Search,
  Menu, FileText, ChevronRight, ArrowRight, ShieldCheck,
  ChevronDown, AlertCircle, RefreshCw, BarChart2, TrendingUp,
  DollarSign, CheckCircle2, AlertTriangle, Layers, ArrowUpRight,
  ExternalLink, Sparkles, Filter, ChevronUp, UserCheck, HelpCircle,
  LayoutDashboard, HeartPulse
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts'

const STATUS_PILLS = {
  BOOKED: 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]',
  CHECK_IN: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
  IN_PROGRESS: 'bg-[#CCFBF1] text-[#0F766E] border-[#5EEAD4]',
  COMPLETED: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
  CANCELLED: 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]',
}

const STATUS_FLOW = {
  BOOKED: 'CHECK_IN',
  CHECK_IN: 'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
}

// ── Modal: Add / Edit Doctor ────────────────────────────────────────────────
function DoctorModal({ doctorObj, onClose }) {
  const qc = useQueryClient()
  const isEdit = !!doctorObj
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: doctorObj ? {
      ...doctorObj,
      schedule_days: doctorObj.schedule?.days || [],
      schedule_start_time: doctorObj.schedule?.start_time || '',
      schedule_end_time: doctorObj.schedule?.end_time || '',
    } : { schedule_days: [] }
  })

  const save = useMutation({
    mutationFn: (data) =>
      isEdit
        ? api.patch(`/api/clinic/doctors/${doctorObj.id}/`, data)
        : api.post('/api/clinic/doctors/', data),
    onSuccess: () => {
      qc.invalidateQueries(['clinic-doctors'])
      toast.success(isEdit ? 'Doctor updated!' : 'Doctor onboarded!')
      onClose()
    },
    onError: (err) => {
      const msg = err.response?.data
        ? Object.values(err.response.data).flat().join(' ')
        : 'Failed to save doctor.'
      toast.error(msg)
    }
  })

  const onSubmit = (d) => {
    const payload = { ...d }
    payload.schedule = {
      days: d.schedule_days || [],
      start_time: d.schedule_start_time,
      end_time: d.schedule_end_time,
    }
    delete payload.schedule_days
    delete payload.schedule_start_time
    delete payload.schedule_end_time
    save.mutate(payload)
  }

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-[580px] shadow-2xl border border-outline-variant/40 overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-surface-container-low border-b border-outline-variant/30 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Practitioner Onboarding</span>
            <h3 className="font-bold text-on-surface text-base sm:text-lg">{isEdit ? 'Edit Doctor Profile' : 'Accredit New Doctor'}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Doctor Full Name *</label>
              <input
                {...register(isEdit ? 'user_name' : 'name', { required: 'Name is required' })}
                className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
                placeholder="Dr. Alexander Smith"
              />
            </div>

            <div>
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Email Address *</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                disabled={isEdit}
                className={`w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none ${isEdit ? 'bg-surface-container-low text-on-surface-variant' : ''}`}
                placeholder="doctor@hospital.org"
              />
            </div>

            {!isEdit && (
              <div>
                <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Initial Password *</label>
                <input
                  {...register('password', { required: 'Password is required' })}
                  type="password"
                  className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Clinical Specialty *</label>
              <input
                {...register('specialty', { required: 'Specialty is required' })}
                className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
                placeholder="e.g. Cardiology, Pediatrics"
              />
            </div>

            <div>
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Medical License / Reg No. *</label>
              <input
                {...register('registration_number', { required: 'Reg No is required' })}
                className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
                placeholder="MED-74892"
              />
            </div>

            <div>
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Consultation Fee (Rs.) *</label>
              <input
                {...register('consultation_fee', { required: 'Fee is required' })}
                type="number"
                className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none font-mono"
                placeholder="2500"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-2 sm:pt-5">
              <input
                {...register('is_available')}
                type="checkbox"
                id="is_avail"
                className="w-4 h-4 rounded accent-primary-container cursor-pointer"
              />
              <label htmlFor="is_avail" className="text-xs font-semibold text-on-surface cursor-pointer select-none">
                Active in consultation rota
              </label>
            </div>

            <div className="col-span-1 sm:col-span-2 pt-2 border-t border-surface-container-high/60">
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-2">Practice Rota (Working Days)</label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <label key={day} className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-outline-variant/40 cursor-pointer hover:bg-surface-container-low transition-colors text-xs font-semibold text-on-surface">
                    <input
                      type="checkbox"
                      value={day}
                      {...register('schedule_days')}
                      className="accent-primary-container"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Clinic Shift Start</label>
              <input
                {...register('schedule_start_time')}
                type="time"
                className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Clinic Shift End</label>
              <input
                {...register('schedule_end_time')}
                type="time"
                className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
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
              {save.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Accredit Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal: Register Patient ──────────────────────────────────────────────────
function PatientModal({ patientObj, onClose }) {
  const qc = useQueryClient()
  const isEdit = !!patientObj
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: patientObj || {}
  })

  const save = useMutation({
    mutationFn: (data) =>
      isEdit
        ? api.patch(`/api/clinic/patients/${patientObj.id}/`, data)
        : api.post('/api/clinic/patients/', data),
    onSuccess: () => {
      qc.invalidateQueries(['clinic-patients'])
      toast.success(isEdit ? 'Patient profile updated.' : 'Patient enrolled successfully!')
      onClose()
    },
    onError: (err) => {
      const msg = err.response?.data ? Object.values(err.response.data).flat().join(' ') : 'Failed to save patient.'
      toast.error(msg)
    }
  })

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-[500px] shadow-2xl border border-outline-variant/40 overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-surface-container-low border-b border-outline-variant/30 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Patient Demographics</span>
            <h3 className="font-bold text-on-surface text-base sm:text-lg">{isEdit ? 'Update Patient' : 'Register New Patient'}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(d => save.mutate(d))} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Full Legal Name *</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div>
            <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Email Address *</label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              disabled={isEdit}
              className={`w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none ${isEdit ? 'bg-surface-container-low text-on-surface-variant' : ''}`}
              placeholder="patient@email.com"
            />
          </div>

          {!isEdit && (
            <div>
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Initial Password *</label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Contact Phone</label>
            <input
              {...register('phone')}
              className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none"
              placeholder="+92 300 0000000"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container-high/60 shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface">
              Cancel
            </button>
            <button
              type="submit"
              disabled={save.isPending}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm disabled:opacity-60"
            >
              {save.isPending ? 'Enrolling…' : isEdit ? 'Save Changes' : 'Enroll Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal: Register Receptionist ─────────────────────────────────────────────
function ReceptionistModal({ onClose }) {
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const save = useMutation({
    mutationFn: (data) => api.post('/api/clinic/receptionists/', data),
    onSuccess: () => {
      qc.invalidateQueries(['clinic-receptionists'])
      toast.success('Receptionist credentials provisioned!')
      onClose()
    },
    onError: (err) => {
      const msg = err.response?.data ? Object.values(err.response.data).flat().join(' ') : 'Failed to register receptionist.'
      toast.error(msg)
    }
  })

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-[480px] shadow-2xl border border-outline-variant/40 overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-surface-container-low border-b border-outline-variant/30 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Front Desk Staff</span>
            <h3 className="font-bold text-on-surface text-base sm:text-lg">Register Clinic Receptionist</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(d => save.mutate(d))} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Staff Member Name *</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
              placeholder="e.g. Ayesha Khan"
            />
            {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Email Address (Login Username) *</label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
              placeholder="reception@clinic.com"
            />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Temporary Password *</label>
            <input
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
              type="password"
              className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low text-[11px] text-on-surface-variant leading-relaxed">
            Receptionist accounts have direct access to the <strong>Walk-in Reception Desk</strong> to register walk-in patients, allocate tokens to any doctor, and print OPD slips.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-high/60 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={save.isPending}
              className="px-5 py-2.5 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-xl text-sm transition-all shadow-sm disabled:opacity-60"
            >
              {save.isPending ? 'Registering…' : 'Create Receptionist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal: Schedule Patient Appointment ──────────────────────────────────────
function AppointmentModal({ doctors, patients, onClose }) {
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { scheduled_at: new Date().toISOString().slice(0, 16) }
  })

  const save = useMutation({
    mutationFn: (data) => api.post('/api/patient/appointments/', data),
    onSuccess: () => {
      qc.invalidateQueries(['clinic-appointments'])
      toast.success('Appointment scheduled and token provisioned!')
      onClose()
    },
    onError: (err) => {
      const msg = err.response?.data ? Object.values(err.response.data).flat().join(' ') : 'Failed to schedule.'
      toast.error(msg)
    }
  })

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-[500px] shadow-2xl border border-outline-variant/40 overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-surface-container-low border-b border-outline-variant/30 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Triage & Scheduling</span>
            <h3 className="font-bold text-on-surface text-base sm:text-lg">Book Patient Encounter</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(d => save.mutate(d))} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Select Patient *</label>
            <select
              {...register('patient', { required: 'Patient is required' })}
              className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none bg-surface-container-lowest"
            >
              <option value="">-- Choose registered patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Attending Physician *</label>
            <select
              {...register('doctor', { required: 'Doctor is required' })}
              className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none bg-surface-container-lowest"
            >
              <option value="">-- Choose practitioner --</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>Dr. {d.user_name} ({d.specialty})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">Appointment Date & Time *</label>
            <input
              {...register('scheduled_at', { required: 'Date and time is required' })}
              type="datetime-local"
              className="w-full border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container-high/60 shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface">
              Cancel
            </button>
            <button
              type="submit"
              disabled={save.isPending}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm disabled:opacity-60"
            >
              {save.isPending ? 'Generating Token…' : 'Schedule & Issue Token'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal: Patient History ───────────────────────────────────────────────────
function PatientHistoryModal({ patient, onClose }) {
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['patient-history', patient.id],
    queryFn: () => api.get(`/api/clinic/patients/${patient.id}/history/`).then(r => r.data),
  })

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-[650px] max-h-[85vh] shadow-2xl border border-outline-variant/40 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-surface-container-low border-b border-outline-variant/30 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Longitudinal Medical Record</span>
            <h3 className="font-bold text-on-surface text-base sm:text-lg">{patient.name}'s History</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {isLoading ? (
            <div className="p-12 text-center text-on-surface-variant text-sm">Loading health history…</div>
          ) : history.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={36} className="mx-auto text-outline mb-2" />
              <p className="font-bold text-on-surface text-sm">No historical consultations recorded</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map(c => (
                <div key={c.id} className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary font-mono">
                      {new Date(c.created_at).toLocaleDateString([], { dateStyle: 'medium' })}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold">
                      {c.doctor_name ? `Dr. ${c.doctor_name}` : 'Attending Physician'}
                    </span>
                  </div>
                  {c.diagnosis && (
                    <div>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Diagnosis</span>
                      <p className="text-xs font-bold text-on-surface mt-0.5">{c.diagnosis}</p>
                    </div>
                  )}
                  {c.notes && (
                    <div>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Clinical Notes</span>
                      <p className="text-xs text-on-surface-variant mt-0.5 whitespace-pre-wrap">{c.notes}</p>
                    </div>
                  )}
                  {c.prescription && (
                    <div>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Prescription</span>
                      <p className="text-xs font-mono text-on-surface mt-0.5 whitespace-pre-wrap bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20">
                        {typeof c.prescription === 'string' ? c.prescription : JSON.stringify(c.prescription, null, 2)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Clinic Admin Dashboard Component ─────────────────────────────────────────
export default function ClinicDashboard() {
  const [tab, setTab] = useState('overview') // 'overview' | 'queue' | 'appointments' | 'doctors' | 'patients' | 'reception' | 'analytics'
  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [editDoctor, setEditDoctor] = useState(null)
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [editPatient, setEditPatient] = useState(null)
  const [showApptModal, setShowApptModal] = useState(false)
  const [showReceptionModal, setShowReceptionModal] = useState(false)
  const [showHistoryFor, setShowHistoryFor] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showReceptionGuide, setShowReceptionGuide] = useState(false)

  const qc = useQueryClient()
  const { user, logout } = useAuthStore()

  // 1. Appointments Query
  const { data: appointments = [] } = useQuery({
    queryKey: ['clinic-appointments'],
    queryFn: () => api.get('/api/patient/appointments/').then(r => r.data),
    refetchInterval: 12000,
  })

  // 2. Doctors Query
  const { data: doctors = [] } = useQuery({
    queryKey: ['clinic-doctors'],
    queryFn: () => api.get('/api/clinic/doctors/').then(r => r.data),
  })

  // 3. Patients Query
  const { data: patients = [] } = useQuery({
    queryKey: ['clinic-patients'],
    queryFn: () => api.get('/api/clinic/patients/').then(r => r.data),
  })

  // 4. Receptionists Query
  const { data: receptionists = [] } = useQuery({
    queryKey: ['clinic-receptionists'],
    queryFn: () => api.get('/api/clinic/receptionists/').then(r => Array.isArray(r.data) ? r.data : []).catch(() => []),
  })

  // 5. Analytics Query
  const { data: analytics } = useQuery({
    queryKey: ['clinic-analytics'],
    queryFn: () => api.get('/api/clinic/analytics/').then(r => r.data),
    enabled: tab === 'analytics' || tab === 'overview',
  })

  // Mutations
  const advance = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/api/patient/appointments/${id}/set_status/`, { status }),
    onSuccess: () => {
      qc.invalidateQueries(['clinic-appointments'])
      toast.success('Patient triage status updated!')
    },
    onError: () => toast.error('Failed to advance token status.')
  })

  const deleteDoctor = useMutation({
    mutationFn: (id) => api.delete(`/api/clinic/doctors/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries(['clinic-doctors'])
      toast.success('Doctor removed from rota.')
    },
    onError: () => toast.error('Failed to delete doctor.')
  })

  const deletePatient = useMutation({
    mutationFn: (id) => api.delete(`/api/clinic/patients/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries(['clinic-patients'])
      toast.success('Patient archived.')
    },
    onError: () => toast.error('Failed to archive patient.')
  })

  const deleteReceptionist = useMutation({
    mutationFn: (id) => api.delete(`/api/clinic/receptionists/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries(['clinic-receptionists'])
      toast.success('Receptionist removed.')
    },
    onError: () => toast.error('Failed to remove receptionist.')
  })

  const today = appointments.filter(a => {
    return new Date(a.scheduled_at).toDateString() === new Date().toDateString()
  })

  // Derived Overview & Chart Telemetry
  const waitingCount = today.filter(a => a.status === 'CHECK_IN' || a.status === 'BOOKED').length
  const inProgressCount = today.filter(a => a.status === 'IN_PROGRESS').length
  const completedCount = today.filter(a => a.status === 'COMPLETED').length
  const cancelledCount = today.filter(a => a.status === 'CANCELLED' || a.status === 'NO_SHOW').length

  const last7DaysTrend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dayStr = d.toLocaleDateString([], { weekday: 'short' })
    const count = appointments.filter(a => new Date(a.scheduled_at).toDateString() === d.toDateString()).length
    return { day: dayStr, visits: count }
  })

  const queueDistribution = [
    { name: 'Waiting', value: waitingCount, color: '#F59E0B' },
    { name: 'In Progress', value: inProgressCount, color: '#0F766E' },
    { name: 'Completed', value: completedCount, color: '#10B981' },
    { name: 'Cancelled', value: cancelledCount, color: '#94A3B8' },
  ].filter(item => item.value > 0)

  const doctorWorkloadData = doctors.slice(0, 5).map(doc => {
    const count = today.filter(a => a.doctor === doc.id || a.doctor_name === doc.name || a.doctor_name === doc.user?.name).length
    return {
      name: (doc.name || doc.user?.name || `Dr. #${doc.id}`).replace(/^Dr\.?\s*/i, 'Dr. '),
      specialty: doc.specialization || 'General',
      tokens: count,
    }
  })

  const totalCalculatedRevenue = analytics?.monthly_earnings?.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0) || 0

  return (
    <div className="min-h-screen w-full max-w-full bg-background text-on-surface font-sans flex antialiased overflow-x-hidden">
      {/* Modals */}
      {showDoctorModal && <DoctorModal doctorObj={editDoctor} onClose={() => setShowDoctorModal(false)} />}
      {showPatientModal && <PatientModal patientObj={editPatient} onClose={() => setShowPatientModal(false)} />}
      {showReceptionModal && <ReceptionistModal onClose={() => setShowReceptionModal(false)} />}
      {showApptModal && <AppointmentModal doctors={doctors} patients={patients} onClose={() => setShowApptModal(false)} />}
      {showHistoryFor && <PatientHistoryModal patient={showHistoryFor} onClose={() => setShowHistoryFor(null)} />}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. PERSISTENT CLINIC SIDEBAR                                        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 max-w-[85vw] bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        {/* Brand Logo Header (Fixed at top) */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-surface-container-high/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-black shadow-sm">
              <Stethoscope size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-on-surface text-base tracking-tight leading-tight">MediCore Clinical Enterprise</span>
              <span className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">Facility Hub</span>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {/* Clinic Meta Badge */}
          <div className="m-3 sm:m-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">CLINIC MANAGEMENT</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                CLINIC ADMIN
              </span>
            </div>
            <p className="font-bold text-xs text-on-surface truncate">{user?.name || 'Clinic Operations'}</p>
            <p className="text-[11px] text-on-surface-variant">{today.length} Patients Scheduled Today</p>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-2 space-y-6 pb-6">
            <div>
              <span className="px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
                Care Operations
              </span>
              <nav className="space-y-1">
                {[
                  { key: 'overview', label: 'Main Overview & Telemetry', icon: LayoutDashboard },
                  { key: 'queue', label: 'Live Token Queue', icon: Clock, badge: `${today.length} Live` },
                  { key: 'appointments', label: 'Appointments Ledger', icon: Calendar },
                  { key: 'patients', label: 'Patients Directory', icon: Users, badge: patients.length },
                  { key: 'doctors', label: 'Doctor Directory', icon: Stethoscope, badge: doctors.length },
                  { key: 'reception', label: 'Reception & Front Desk', icon: ShieldCheck, badge: receptionists.length },
                  { key: 'analytics', label: 'Facility Analytics & Revenue', icon: BarChart2 },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => { setTab(item.key); setMobileMenuOpen(false) }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors ${tab === item.key
                        ? 'bg-primary-container text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon size={17} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tab === item.key ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <span className="px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
                Quick Actions
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => setShowApptModal(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-surface-container-high/40 transition-colors"
                >
                  <Calendar size={15} />
                  <span>Schedule Patient Visit</span>
                </button>
                <button
                  onClick={() => { setEditPatient(null); setShowPatientModal(true) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-surface-container-high/40 transition-colors"
                >
                  <UserPlus size={15} />
                  <span>Enroll New Patient</span>
                </button>
                <button
                  onClick={() => setShowReceptionModal(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-surface-container-high/40 transition-colors"
                >
                  <ShieldCheck size={15} />
                  <span>Register Receptionist</span>
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
                CA
              </div>
              <span className="text-xs font-bold text-on-surface truncate">{user?.name || 'Clinic Admin'}</span>
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

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-on-surface/30 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. OPERATIONAL CONTENT STAGE                                        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 w-full">
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-1.5 sm:p-2 text-on-surface-variant hover:text-on-surface shrink-0">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider hidden sm:inline">
                Clinic Operations
              </span>
              <span className="hidden sm:inline text-outline">•</span>
              <span className="text-xs font-bold text-primary capitalize truncate">
                {tab === 'overview' ? 'Main Overview & Telemetry' : tab === 'queue' ? 'Live Triage Board' : tab === 'reception' ? 'Reception & Front Desk' : tab}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowApptModal(true)}
              className="px-3 sm:px-3.5 py-1.5 bg-primary-container hover:bg-primary text-on-primary text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>Book Visit</span>
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 w-full max-w-full overflow-x-hidden">

          {/* ── TAB: OVERVIEW & TELEMETRY ── */}
          {tab === 'overview' && (
            <div className="space-y-6 animate-fade-in w-full">
              {/* Header & Status Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Facility Operations Telemetry</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-on-surface tracking-tight">
                    {user?.name ? `${user.name} Operations` : 'Clinical Executive Dashboard'}
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                    Real-time monitoring of outpatient triage, active doctor consultations, and facility capacity.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setTab('queue')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface border border-outline-variant/40 font-bold rounded-xl text-xs transition-all shadow-xs"
                  >
                    <Clock size={15} className="text-primary" />
                    <span>Live Triage</span>
                  </button>
                  <button
                    onClick={() => setShowApptModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-xl text-xs transition-all shadow-xs"
                  >
                    <Plus size={15} />
                    <span>Schedule Visit</span>
                  </button>
                </div>
              </div>

              {/* 4 Primary KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {/* 1. Today's Footfall */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Today's Visits</span>
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Users size={20} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-black text-on-surface font-mono tracking-tight">{today.length}</div>
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-1">
                      <span className="text-emerald-700 font-bold flex items-center">
                        <TrendingUp size={13} className="mr-0.5" /> Active
                      </span>
                      <span>tokens today</span>
                    </div>
                  </div>
                </div>

                {/* 2. Triage / Waiting */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Awaiting Doctor</span>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <Clock size={20} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-black text-on-surface font-mono tracking-tight">{waitingCount}</div>
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-1">
                      <span className="text-amber-700 font-bold">In Waiting Room</span>
                      <span>triage</span>
                    </div>
                  </div>
                </div>

                {/* 3. In Consultation */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">In Consultation</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Stethoscope size={20} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-black text-on-surface font-mono tracking-tight">{inProgressCount}</div>
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-1">
                      <span className="text-emerald-700 font-bold">{doctors.length} doctors</span>
                      <span>on facility rota</span>
                    </div>
                  </div>
                </div>

                {/* 4. Total Invoices / Billed */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs hover:border-indigo-400 transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Completed Visits</span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                      <CheckCircle2 size={20} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-black text-on-surface font-mono tracking-tight">{completedCount}</div>
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-1">
                      <span className="text-indigo-700 font-bold font-mono">
                        {totalCalculatedRevenue > 0 ? `Rs ${totalCalculatedRevenue.toLocaleString()}` : `${appointments.length} Total visits`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Interactive Graphs Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
                {/* 7-Day Inflow Trend (2 Cols) */}
                <div className="lg:col-span-2 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-on-surface text-sm sm:text-base flex items-center gap-2">
                        <TrendingUp size={18} className="text-primary" />
                        <span>7-Day Patient Volume & Intake Velocity</span>
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Historical trend of scheduled outpatient consultations and walk-ins.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
                      Real-time Feed
                    </span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={last7DaysTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#0F766E" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                            fontSize: '12px'
                          }}
                        />
                        <Area type="monotone" dataKey="visits" stroke="#0F766E" strokeWidth={2.5} fillOpacity={1} fill="url(#areaGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Queue Distribution Donut (1 Col) */}
                <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-on-surface text-sm sm:text-base flex items-center gap-2 mb-1">
                      <Layers size={18} className="text-primary" />
                      <span>Today's Queue Triage</span>
                    </h3>
                    <p className="text-xs text-on-surface-variant">Breakdown by current token status.</p>
                  </div>

                  <div className="h-44 w-full my-2 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={queueDistribution.length > 0 ? queueDistribution : [{ name: 'Intake Ready', value: 1, color: '#E2E8F0' }]}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {(queueDistribution.length > 0 ? queueDistribution : [{ color: '#E2E8F0' }]).map((entry, idx) => (
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
                      <span className="text-2xl font-black text-on-surface font-mono">{today.length}</span>
                      <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Patients</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                      <span className="text-xs text-on-surface font-medium truncate">Waiting: <strong>{waitingCount}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0"></span>
                      <span className="text-xs text-on-surface font-medium truncate">In Room: <strong>{inProgressCount}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                      <span className="text-xs text-on-surface font-medium truncate">Done: <strong>{completedCount}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0"></span>
                      <span className="text-xs text-on-surface font-medium truncate">Cancelled: <strong>{cancelledCount}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Telemetry: Doctor Workload & Quick Operational Matrix */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
                {/* Doctor Workload Distribution */}
                <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-on-surface text-sm sm:text-base flex items-center gap-2">
                      <Stethoscope size={18} className="text-primary" />
                      <span>Doctor Consultation Load (Today)</span>
                    </h3>
                    <button
                      onClick={() => setTab('doctors')}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>View Rota</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="h-56 w-full">
                    {doctorWorkloadData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={doctorWorkloadData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} angle={-15} textAnchor="end" />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} allowDecimals={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '12px',
                              border: '1px solid #E2E8F0',
                              fontSize: '11px'
                            }}
                          />
                          <Bar dataKey="tokens" fill="#0F766E" radius={[6, 6, 0, 0]} name="Patient Visits" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-on-surface-variant">
                        No doctors currently registered in this facility.
                      </div>
                    )}
                  </div>
                </div>

                {/* Facility Fast Access & Top Clinical Diagnoses */}
                <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-on-surface text-sm sm:text-base flex items-center gap-2 mb-1">
                      <Activity size={18} className="text-primary" />
                      <span>Frequent Diagnoses & Fast Hub</span>
                    </h3>
                    <p className="text-xs text-on-surface-variant mb-4">Clinical disease epidemiology and direct departmental dispatch.</p>

                    {/* Top Diagnoses Chips */}
                    <div className="space-y-2 mb-5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Top Recorded Conditions:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {analytics?.diseases?.length > 0 ? (
                          analytics.diseases.slice(0, 6).map((dis, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface text-xs font-medium border border-outline-variant/20 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                              <span>{dis.diagnosis}</span>
                              <span className="text-[10px] font-bold text-primary font-mono bg-primary/10 px-1 rounded">{dis.count}</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-on-surface-variant italic">Top diagnoses will appear as consultations are recorded.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fast Action Shortcuts */}
                  <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-outline-variant/20">
                    <button
                      onClick={() => setTab('queue')}
                      className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high/70 text-left transition-all border border-outline-variant/20 group"
                    >
                      <div className="flex items-center justify-between text-primary mb-1">
                        <Clock size={16} />
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <div className="font-bold text-xs text-on-surface">Live Triage Board</div>
                      <div className="text-[10px] text-on-surface-variant">{today.length} active patients</div>
                    </button>

                    <button
                      onClick={() => setTab('reception')}
                      className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high/70 text-left transition-all border border-outline-variant/20 group"
                    >
                      <div className="flex items-center justify-between text-primary mb-1">
                        <ShieldCheck size={16} />
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <div className="font-bold text-xs text-on-surface">Reception & Front Desk</div>
                      <div className="text-[10px] text-on-surface-variant">{receptionists.length} staff registered</div>
                    </button>

                    <button
                      onClick={() => setTab('appointments')}
                      className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high/70 text-left transition-all border border-outline-variant/20 group"
                    >
                      <div className="flex items-center justify-between text-primary mb-1">
                        <Calendar size={16} />
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <div className="font-bold text-xs text-on-surface">Appointments Ledger</div>
                      <div className="text-[10px] text-on-surface-variant">{appointments.length} total records</div>
                    </button>

                    <button
                      onClick={() => setTab('analytics')}
                      className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high/70 text-left transition-all border border-outline-variant/20 group"
                    >
                      <div className="flex items-center justify-between text-primary mb-1">
                        <BarChart2 size={16} />
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <div className="font-bold text-xs text-on-surface">Financial Reports</div>
                      <div className="text-[10px] text-on-surface-variant">Revenue analytics</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: LIVE QUEUE ── */}
          {tab === 'queue' && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
                    Live Token Queue
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                    Real-time outpatient reception, check-in progression, and consultation room handoffs.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                  <span className="text-xs font-bold text-primary">Live Syncing</span>
                </div>
              </div>

              {/* Bento Quick Status Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
                <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center shrink-0">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Scheduled Today</span>
                    <p className="text-xl sm:text-2xl font-black text-on-surface font-mono mt-0.5">{today.length}</p>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-secondary-container/40 text-primary flex items-center justify-center shrink-0">
                    <Clock size={22} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">In Consultation</span>
                    <p className="text-xl sm:text-2xl font-black text-on-surface font-mono mt-0.5">
                      {today.filter(a => a.status === 'IN_PROGRESS').length}
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-surface-container-low text-secondary flex items-center justify-center shrink-0">
                    <CheckCircle size={22} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Completed</span>
                    <p className="text-xl sm:text-2xl font-black text-on-surface font-mono mt-0.5">
                      {today.filter(a => a.status === 'COMPLETED').length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Queue List Table */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden w-full">
                <div className="p-4 sm:p-5 border-b border-surface-container-high/40 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-on-surface text-sm sm:text-base">Active Waiting Line</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">Patients queued for triage and examination</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-xs font-bold font-mono shrink-0">
                    {today.length} Patients
                  </span>
                </div>

                {today.length === 0 ? (
                  <div className="p-12 text-center">
                    <Clock size={36} className="mx-auto text-outline mb-2" />
                    <p className="font-bold text-on-surface text-sm">No appointments scheduled for today</p>
                    <p className="text-xs text-on-surface-variant mt-1">Use "Book Visit" to schedule a patient consultation.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-surface-container">
                    {today.map(appt => (
                      <div key={appt.id} className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-surface-container-low/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-container-low flex items-center justify-center font-black font-mono text-primary text-xs sm:text-sm border border-outline-variant/20 shrink-0">
                            #{appt.token_number || '—'}
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-on-surface text-sm truncate">{appt.patient_name}</p>
                            <p className="text-xs text-on-surface-variant mt-0.5">Attending: Dr. {appt.doctor_name}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t border-outline-variant/10 sm:border-0">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border ${STATUS_PILLS[appt.status] || 'bg-surface-container text-on-surface-variant border-outline-variant/40'}`}>
                            {appt.status === 'IN_PROGRESS' && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>}
                            {appt.status.replace('_', ' ')}
                          </span>

                          {STATUS_FLOW[appt.status] && (
                            <button
                              onClick={() => advance.mutate({ id: appt.id, status: STATUS_FLOW[appt.status] })}
                              className="px-3 py-1.5 bg-primary-container hover:bg-primary text-on-primary text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1 shadow-xs shrink-0"
                            >
                              <span>Advance →</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: DOCTORS ── */}
          {tab === 'doctors' && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
                    Doctor Directory & Rostering
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                    Medical specialists and doctors registered under this clinic.
                  </p>
                </div>
                <button
                  onClick={() => { setEditDoctor(null); setShowDoctorModal(true) }}
                  className="px-3.5 sm:px-4 py-2 bg-primary-container hover:bg-primary text-on-primary text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
                >
                  <Plus size={16} />
                  <span>Add Doctor</span>
                </button>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden w-full">
                {doctors.length === 0 ? (
                  <div className="p-12 text-center text-on-surface-variant text-sm">No doctors onboarded yet.</div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-low/70 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                            <th className="py-3 px-5">Doctor Profile</th>
                            <th className="py-3 px-5">Specialty</th>
                            <th className="py-3 px-5">Consultation Fee</th>
                            <th className="py-3 px-5">Status</th>
                            <th className="py-3 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container text-xs text-on-surface">
                          {doctors.map(doc => (
                            <tr key={doc.id} className="hover:bg-surface-container-low/40 transition-colors">
                              <td className="py-3.5 px-5">
                                <p className="font-bold text-on-surface text-sm">Dr. {doc.user_name}</p>
                                <p className="text-[11px] text-on-surface-variant">Reg #{doc.registration_number}</p>
                              </td>
                              <td className="py-3.5 px-5">
                                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container text-[11px] font-semibold">
                                  {doc.specialty}
                                </span>
                              </td>
                              <td className="py-3.5 px-5 font-bold font-mono text-on-surface">
                                Rs. {doc.consultation_fee}
                              </td>
                              <td className="py-3.5 px-5">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${doc.is_available ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'}`}>
                                  {doc.is_available ? 'Available' : 'Unavailable'}
                                </span>
                              </td>
                              <td className="py-3.5 px-5 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => { setEditDoctor(doc); setShowDoctorModal(true) }}
                                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Revoke accreditation for Dr. ${doc.user_name}?`)) {
                                        deleteDoctor.mutate(doc.id)
                                      }
                                    }}
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
                      {doctors.map(doc => (
                        <div key={doc.id} className="p-3.5 space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-on-surface text-sm">Dr. {doc.user_name}</h4>
                              <p className="text-[11px] text-on-surface-variant">Reg #{doc.registration_number}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container text-[10px] font-semibold shrink-0">
                              {doc.specialty}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-on-surface-variant bg-surface-container-low/40 p-2 rounded-xl">
                            <span>Fee: <strong className="font-mono text-on-surface">Rs. {doc.consultation_fee}</strong></span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${doc.is_available ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'}`}>
                              {doc.is_available ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => { setEditDoctor(doc); setShowDoctorModal(true) }}
                              className="px-3 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-semibold text-on-surface hover:bg-surface-container-low flex items-center gap-1"
                            >
                              <Pencil size={13} /> Edit
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Revoke accreditation for Dr. ${doc.user_name}?`)) {
                                  deleteDoctor.mutate(doc.id)
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-semibold text-error hover:bg-error-container/20 flex items-center gap-1"
                            >
                              <Trash2 size={13} /> Remove
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

          {/* ── TAB: PATIENTS ── */}
          {tab === 'patients' && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
                    Patient Population Registry
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                    Registered patient health records and past clinical encounter history.
                  </p>
                </div>
                <button
                  onClick={() => { setEditPatient(null); setShowPatientModal(true) }}
                  className="px-3.5 sm:px-4 py-2 bg-primary-container hover:bg-primary text-on-primary text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
                >
                  <UserPlus size={16} />
                  <span>Register Patient</span>
                </button>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden w-full">
                {patients.length === 0 ? (
                  <div className="p-12 text-center text-on-surface-variant text-sm">No patients enrolled yet.</div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-low/70 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                            <th className="py-3 px-5">Patient Name</th>
                            <th className="py-3 px-5">Email Address</th>
                            <th className="py-3 px-5">Enrolled Date</th>
                            <th className="py-3 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container text-xs text-on-surface">
                          {patients.map(p => (
                            <tr key={p.id} className="hover:bg-surface-container-low/40 transition-colors">
                              <td className="py-3.5 px-5 font-bold text-on-surface">{p.name}</td>
                              <td className="py-3.5 px-5 text-on-surface-variant">{p.email}</td>
                              <td className="py-3.5 px-5 text-on-surface-variant">
                                {new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="py-3.5 px-5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setShowHistoryFor(p)}
                                    className="px-3 py-1 bg-surface-container-low hover:bg-primary-container hover:text-on-primary text-primary font-bold text-xs rounded-lg transition-colors"
                                  >
                                    View History
                                  </button>
                                  <button
                                    onClick={() => { setEditPatient(p); setShowPatientModal(true) }}
                                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Archive profile for ${p.name}?`)) {
                                        deletePatient.mutate(p.id)
                                      }
                                    }}
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
                      {patients.map(p => (
                        <div key={p.id} className="p-3.5 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-on-surface text-sm">{p.name}</span>
                            <span className="text-[10px] text-on-surface-variant font-mono">
                              {new Date(p.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant">{p.email}</p>
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <button
                              onClick={() => setShowHistoryFor(p)}
                              className="px-3 py-1.5 bg-surface-container-low hover:bg-primary-container hover:text-on-primary text-primary font-bold text-xs rounded-lg transition-colors flex-1"
                            >
                              View History
                            </button>
                            <button
                              onClick={() => { setEditPatient(p); setShowPatientModal(true) }}
                              className="p-1.5 rounded-lg border border-outline-variant/40 text-on-surface-variant hover:text-on-surface"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Archive profile for ${p.name}?`)) {
                                  deletePatient.mutate(p.id)
                                }
                              }}
                              className="p-1.5 rounded-lg border border-outline-variant/40 text-error hover:bg-error-container/20"
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

          {/* ── TAB: APPOINTMENTS ── */}
          {tab === 'appointments' && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
                    Appointments Ledger
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                    Schedule tracking and token ledger across all clinic practitioners.
                  </p>
                </div>
                <button
                  onClick={() => setShowApptModal(true)}
                  className="px-3.5 sm:px-4 py-2 bg-primary-container hover:bg-primary text-on-primary text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
                >
                  <Plus size={16} />
                  <span>Book Appointment</span>
                </button>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden w-full">
                {appointments.length === 0 ? (
                  <div className="py-12 text-center text-on-surface-variant text-sm">No appointments found.</div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-low/70 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                            <th className="py-3 px-5">Scheduled Date & Time</th>
                            <th className="py-3 px-5">Patient Name</th>
                            <th className="py-3 px-5">Assigned Doctor</th>
                            <th className="py-3 px-5">Encounter Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container text-xs text-on-surface">
                          {appointments.map(appt => (
                            <tr key={appt.id} className="hover:bg-surface-container-low/40 transition-colors">
                              <td className="py-3.5 px-5">
                                <p className="font-semibold text-on-surface">
                                  {new Date(appt.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                                <p className="text-[11px] text-on-surface-variant">
                                  {new Date(appt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </td>
                              <td className="py-3.5 px-5 font-bold text-on-surface">{appt.patient_name}</td>
                              <td className="py-3.5 px-5 text-on-surface-variant font-medium">Dr. {appt.doctor_name}</td>
                              <td className="py-3.5 px-5">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_PILLS[appt.status] || 'bg-surface-container text-on-surface-variant border-outline-variant/40'}`}>
                                  {appt.status.replace('_', ' ')}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block md:hidden divide-y divide-surface-container">
                      {appointments.map(appt => (
                        <div key={appt.id} className="p-3.5 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-on-surface text-sm">{appt.patient_name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_PILLS[appt.status] || STATUS_PILLS.BOOKED}`}>
                              {appt.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-on-surface-variant">
                            <span>Dr. {appt.doctor_name}</span>
                            <span className="font-mono">
                              {new Date(appt.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(appt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

          {/* ── TAB: RECEPTION & FRONT DESK ── */}
          {tab === 'reception' && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
                      Walk-in Intake Station
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-medium">Front Desk Portal</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                    Reception & Front Desk Management
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                    Provision front desk operator accounts and manage walk-in OPD token issuance.
                  </p>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <button
                    onClick={() => setShowReceptionGuide(!showReceptionGuide)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface border border-outline-variant/40 font-bold rounded-xl text-xs transition-all shadow-xs"
                  >
                    <HelpCircle size={15} className="text-primary" />
                    <span>{showReceptionGuide ? 'Hide Guide' : 'How it Works'}</span>
                  </button>
                  <a
                    href="/reception/desk"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface border border-outline-variant/40 font-bold rounded-xl text-xs transition-all shadow-xs"
                  >
                    <ExternalLink size={15} />
                    <span>Open Reception Desk ↗</span>
                  </a>
                  <button
                    onClick={() => setShowReceptionModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-xl text-xs transition-all shadow-xs"
                  >
                    <Plus size={16} />
                    <span>Register Receptionist</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Clean Workflow Guide */}
              {showReceptionGuide && (
                <div className="p-5 rounded-2xl bg-surface-container-lowest border border-primary/20 shadow-xs animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface text-sm">Receptionist Terminal Workflow</h4>
                        <p className="text-[11px] text-on-surface-variant">Three-step patient intake & triage pipeline</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowReceptionGuide(false)}
                      className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1">
                        <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">1</span>
                        <span>Create Login</span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Register receptionist email & password here. Staff signs in at <code>/login</code> to access their dedicated station.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1">
                        <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">2</span>
                        <span>Walk-In Intake</span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        When an OPD patient arrives, receptionist enters patient name & phone, then selects their attending doctor.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1">
                        <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">3</span>
                        <span>Issue Token</span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Clicking <strong>"Issue Token"</strong> automatically places the patient into that doctor's real-time queue.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Quick Stat Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Users size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Active Staff</span>
                    <p className="text-lg font-black text-on-surface font-mono">{receptionists.length} Registered</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Triage Status</span>
                    <p className="text-lg font-black text-emerald-700 font-mono">Live & Operational</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                    <ExternalLink size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Terminal Path</span>
                    <p className="text-xs font-mono font-bold text-on-surface truncate">/reception/desk</p>
                  </div>
                </div>
              </div>

              {/* Staff Table */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden w-full">
                <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-primary" />
                    <h3 className="font-bold text-on-surface text-sm sm:text-base">Front Desk Personnel</h3>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-bold">
                      {receptionists.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowReceptionModal(true)}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} />
                    <span>Add Staff</span>
                  </button>
                </div>

                {receptionists.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container mx-auto flex items-center justify-center text-outline mb-3">
                      <Users size={28} />
                    </div>
                    <p className="font-bold text-on-surface text-sm">No reception staff registered yet</p>
                    <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                      Register a front desk receptionist to handle walk-in patient triage and OPD token issuance.
                    </p>
                    <button
                      onClick={() => setShowReceptionModal(true)}
                      className="mt-4 px-4 py-2 bg-primary-container text-on-primary text-xs font-bold rounded-xl shadow-xs hover:bg-primary transition-colors"
                    >
                      + Register First Receptionist
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low/70 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                          <th className="py-3 px-5">Staff Member</th>
                          <th className="py-3 px-5">Login Email</th>
                          <th className="py-3 px-5">Access Role</th>
                          <th className="py-3 px-5">Registered Date</th>
                          <th className="py-3 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container text-xs text-on-surface">
                        {receptionists.map(rec => (
                          <tr key={rec.id} className="hover:bg-surface-container-low/40 transition-colors">
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-container/15 text-primary flex items-center justify-center font-bold text-xs uppercase">
                                  {(rec.name || 'R').charAt(0)}
                                </div>
                                <div>
                                  <span className="font-bold text-on-surface block">{rec.name}</span>
                                  <span className="text-[10px] text-on-surface-variant">Front Desk Staff</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-5 font-mono text-on-surface-variant">{rec.email}</td>
                            <td className="py-3.5 px-5">
                              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold uppercase">
                                RECEPTIONIST
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-on-surface-variant font-mono">
                              {rec.created_at ? new Date(rec.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Active'}
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <button
                                onClick={() => {
                                  if (window.confirm(`Remove receptionist ${rec.name}?`)) {
                                    deleteReceptionist.mutate(rec.id)
                                  }
                                }}
                                className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors"
                                title="Remove Receptionist"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: ANALYTICS ── */}
          {tab === 'analytics' && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
                  Facility Analytics & Financials
                </h1>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                  Revenue telemetry, doctor fee yields, and diagnostic disease frequency.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
                <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-sm h-72 sm:h-80 flex flex-col w-full overflow-hidden">
                  <h3 className="font-bold text-on-surface text-sm mb-3 sm:mb-4 flex items-center gap-2">
                    <Activity size={16} className="text-primary" />
                    <span>Monthly Revenue (Last 6 Months)</span>
                  </h3>
                  <div className="flex-1 min-h-0 w-full">
                    {analytics?.monthly_earnings?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.monthly_earnings}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `Rs ${v}`} width={65} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                          <Bar dataKey="revenue" fill="#0F766E" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-on-surface-variant text-xs">No revenue entries recorded yet.</div>
                    )}
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-sm h-72 sm:h-80 flex flex-col w-full overflow-hidden">
                  <h3 className="font-bold text-on-surface text-sm mb-3 sm:mb-4 flex items-center gap-2">
                    <Stethoscope size={16} className="text-primary" />
                    <span>Doctor Revenue Yield</span>
                  </h3>
                  <div className="flex-1 min-h-0 w-full">
                    {analytics?.doctor_revenue?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.doctor_revenue} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `Rs ${v}`} />
                          <YAxis dataKey="doctor" type="category" axisLine={false} tickLine={false} tick={{ fill: '#0F172A', fontSize: 11, fontWeight: 600 }} width={80} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                          <Bar dataKey="revenue" fill="#14B8A6" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-on-surface-variant text-xs">No doctor revenues recorded yet.</div>
                    )}
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
