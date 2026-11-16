import { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import {
  Users, Stethoscope, Clock, CheckCircle, Printer, Plus,
  Search, RefreshCw, LogOut, Activity, AlertCircle, ChevronRight,
  X, User, Phone, Mail, FileText, Building2, Calendar, Sparkles, Filter,
  LayoutDashboard, Menu, TrendingUp, Layers
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { useAuthStore } from '../../store/authStore'

const STATUS_PILLS = {
  BOOKED:      'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]',
  CHECK_IN:    'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
  IN_PROGRESS: 'bg-[#CCFBF1] text-[#0F766E] border-[#5EEAD4]',
  COMPLETED:   'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
  CANCELLED:   'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]',
}

// ── Printable Token Slip Modal ───────────────────────────────────────────────
function TokenSlipModal({ appointment, clinicName, onClose }) {
  if (!appointment) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-on-surface/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col border border-outline-variant/30 max-h-[92vh]">
        {/* Header */}
        <div className="bg-surface-container-low p-4 text-center relative border-b border-outline-variant/30 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X size={18} />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary block">OPD TOKEN SLIP</span>
          <h2 className="text-on-surface font-black text-base sm:text-lg tracking-tight mt-0.5 truncate">
            {appointment.clinic_name || clinicName || 'Medicore Hospital'}
          </h2>
          <p className="text-[10px] text-on-surface-variant">Walk-in Patient Dispatch</p>
        </div>

        {/* Token Number Display */}
        <div className="p-6 text-center bg-secondary-container/15 border-b border-outline-variant/20 shrink-0">
          <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Queue Token Number</p>
          <h1 className="text-6xl font-black text-primary font-mono tracking-tight leading-none">
            #{appointment.token_number ? String(appointment.token_number).padStart(2, '0') : '--'}
          </h1>
          <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
            <CheckCircle size={12} />
            <span>Checked In — Ready for Doctor</span>
          </div>
        </div>

        {/* Details list */}
        <div className="p-4 space-y-2.5 text-xs overflow-y-auto flex-1">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
            <span className="text-on-surface-variant font-medium">Patient Name:</span>
            <span className="font-bold text-on-surface">{appointment.patient_name}</span>
          </div>
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
            <span className="text-on-surface-variant font-medium">Attending Doctor:</span>
            <span className="font-bold text-primary">Dr. {appointment.doctor_name}</span>
          </div>
          {appointment.doctor_specialty && (
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
              <span className="text-on-surface-variant font-medium">Specialty:</span>
              <span className="font-semibold text-on-surface">{appointment.doctor_specialty}</span>
            </div>
          )}
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
            <span className="text-on-surface-variant font-medium">Issued At:</span>
            <span className="font-mono text-on-surface">
              {new Date(appointment.scheduled_at || appointment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          {appointment.notes && (
            <div className="pt-1">
              <span className="text-[10px] text-on-surface-variant uppercase font-bold block mb-0.5">Intake Notes:</span>
              <p className="text-xs text-on-surface font-mono bg-surface-container-low p-2 rounded-lg truncate">
                {appointment.notes}
              </p>
            </div>
          )}

          {/* ONLINE PORTAL CREDENTIALS BOX (PRINTABLE) */}
          <div className="mt-3 p-3 bg-secondary-container/20 rounded-xl border border-secondary-container/50 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-primary text-[11px] uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Online Patient Portal Access</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-on-surface-variant font-medium">Portal Login ID:</span>
              <span className="font-mono font-black text-on-surface">
                {appointment.login_id || appointment.patient_phone || 'Your Mobile Number'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-on-surface-variant font-medium">Default Password:</span>
              <span className="font-mono font-black text-primary">
                {appointment.portal_password || 'Pass1234'}
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant pt-1 border-t border-outline-variant/20 mt-1">
              Ghar baithe prescription, lab reports aur agla visit token dekhne ke liye portal par login karein.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 pt-0 text-center shrink-0 flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary-container hover:bg-primary text-on-primary font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Printer size={15} /> Print Token Slip
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Receptionist Desk Dashboard ─────────────────────────────────────────
export default function ReceptionistDashboard() {
  const { user, logout } = useAuthStore()
  const qc = useQueryClient()

  // Time state for live front desk clock
  const [currentTime, setCurrentTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Intake Form State
  const [activeNav, setActiveNav] = useState('overview') // 'overview' | 'walkin' | 'queue' | 'doctors'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [patientName, setPatientName] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [resetPassword, setResetPassword] = useState(false)
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [symptomsNotes, setSymptomsNotes] = useState('')
  const [tokenSlipAppt, setTokenSlipAppt] = useState(null)

  // Filters for Queue Monitor
  const [filterDoctor, setFilterDoctor] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // 1. Fetch Doctors in this clinic
  const { data: rawDoctors = [], isLoading: loadingDoctors } = useQuery({
    queryKey: ['clinic-doctors'],
    queryFn: () => api.get('/api/clinic/doctors/').then(r => Array.isArray(r.data) ? r.data : []).catch(() => []),
  })
  const doctors = Array.isArray(rawDoctors) ? rawDoctors : []

  // Auto-select first doctor if none selected
  useEffect(() => {
    if (!selectedDoctorId && doctors.length > 0) {
      setSelectedDoctorId(String(doctors[0].id))
    }
  }, [doctors, selectedDoctorId])

  // 2. Fetch Today's Live Queue for this Clinic (polls every 10s)
  const { data: rawAppts = [], isLoading: loadingAppts, refetch: refetchAppts } = useQuery({
    queryKey: ['reception-appointments'],
    queryFn: () => api.get('/api/patient/appointments/').then(r => Array.isArray(r.data) ? r.data : []).catch(() => []),
    refetchInterval: 10000,
  })
  const appointments = Array.isArray(rawAppts) ? rawAppts : []

  // Filter only today's appointments
  const todayAppts = useMemo(() => {
    const todayStr = new Date().toDateString()
    return appointments.filter(a => {
      return new Date(a.scheduled_at).toDateString() === todayStr
    })
  }, [appointments])

  // Doctor waiting counts mapping
  const doctorWaitingCounts = useMemo(() => {
    const counts = {}
    todayAppts.forEach(a => {
      const docId = String(a.doctor)
      if (['BOOKED', 'CHECK_IN'].includes(a.status)) {
        counts[docId] = (counts[docId] || 0) + 1
      }
    })
    return counts
  }, [todayAppts])

  // Metrics
  const stats = useMemo(() => {
    const waiting = todayAppts.filter(a => a.status === 'CHECK_IN').length
    const inProgress = todayAppts.filter(a => a.status === 'IN_PROGRESS').length
    const completed = todayAppts.filter(a => a.status === 'COMPLETED').length
    const total = todayAppts.length
    return { waiting, inProgress, completed, total }
  }, [todayAppts])

  // Doctor workload distribution for chart
  const doctorWorkloadData = useMemo(() => {
    return doctors.map(doc => ({
      name: (doc.user_name || doc.name || `Dr. #${doc.id}`).replace(/^Dr\.?\s*/i, ''),
      waiting: doctorWaitingCounts[String(doc.id)] || 0,
      specialty: doc.specialty || 'General',
    }))
  }, [doctors, doctorWaitingCounts])

  // Queue status ratio for donut
  const queueStatusData = useMemo(() => {
    const booked = todayAppts.filter(a => a.status === 'BOOKED').length
    return [
      { name: 'Waiting in OPD', value: stats.waiting || (todayAppts.length === 0 ? 0 : 1), color: '#F59E0B' },
      { name: 'In Doctor Cabin', value: stats.inProgress, color: '#0F766E' },
      { name: 'Completed Care', value: stats.completed, color: '#10B981' },
      { name: 'Booked Scheduled', value: booked, color: '#0284C7' },
    ].filter(item => item.value > 0)
  }, [stats, todayAppts])

  // Walk-in Intake Mutation
  const walkinMutation = useMutation({
    mutationFn: (payload) => api.post('/api/patient/appointments/walkin-intake/', payload),
    onSuccess: (res) => {
      qc.invalidateQueries(['reception-appointments'])
      toast.success(`Token #${res.data?.token_number} issued for Dr. ${res.data?.doctor_name}!`)
      setTokenSlipAppt(res.data)
      // Reset form
      setPatientName('')
      setPatientPhone('')
      setPatientEmail('')
      setSymptomsNotes('')
    },
    onError: (err) => {
      const msg = err.response?.data
        ? Object.values(err.response.data).flat().join(' ')
        : 'Failed to process walk-in intake.'
      toast.error(msg)
    }
  })

  // Status transition mutation (e.g. check in an online booked patient arriving at desk)
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/api/patient/appointments/${id}/set_status/`, { status }),
    onSuccess: () => {
      qc.invalidateQueries(['reception-appointments'])
      toast.success('Patient status updated!')
    },
    onError: () => toast.error('Failed to update status.')
  })

  const handleWalkinSubmit = (e) => {
    e.preventDefault()
    if (!patientName.trim()) {
      return toast.error('Please enter patient name.')
    }
    if (!patientPhone.trim() && !patientEmail.trim()) {
      return toast.error('Please enter patient mobile phone number for their portal login ID.')
    }
    if (!selectedDoctorId) {
      return toast.error('Please select an attending doctor.')
    }
    walkinMutation.mutate({
      patient_name: patientName.trim(),
      patient_phone: patientPhone.trim(),
      patient_email: patientEmail.trim(),
      reset_password: resetPassword,
      doctor_id: parseInt(selectedDoctorId),
      notes: symptomsNotes.trim(),
    })
  }

  // Filtered Queue for Display
  const filteredQueue = useMemo(() => {
    return todayAppts.filter(a => {
      // Doctor filter
      if (filterDoctor !== 'ALL' && String(a.doctor) !== String(filterDoctor)) {
        return false
      }
      // Status filter
      if (filterStatus !== 'ALL' && a.status !== filterStatus) {
        return false
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = (a.patient_name || '').toLowerCase().includes(q)
        const matchToken = String(a.token_number || '').includes(q)
        const matchNotes = (a.notes || '').toLowerCase().includes(q)
        if (!matchName && !matchToken && !matchNotes) return false
      }
      return true
    })
  }, [todayAppts, filterDoctor, filterStatus, searchQuery])

  // Render Fast Walk-in Intake Form
  const renderIntakeForm = (fullWidth = false) => (
    <div className={`bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4 sm:p-6 shadow-sm space-y-4 ${fullWidth ? 'max-w-2xl mx-auto' : ''}`}>
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
            <Sparkles size={12} /> Fast OPD Triage
          </span>
          <h2 className="text-base sm:text-lg font-bold text-on-surface">Walk-in Patient Intake</h2>
        </div>
        <span className="text-[11px] font-mono font-semibold text-on-surface-variant px-2 py-0.5 rounded-full bg-surface-container-low">
          ~10 sec
        </span>
      </div>

      <form onSubmit={handleWalkinSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
            Patient Full Name *
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-3.5 text-on-surface-variant pointer-events-none" />
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Usama Khan"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
            Mobile Phone Number * (Patient Portal Login ID)
          </label>
          <div className="relative">
            <Phone size={16} className="absolute left-3.5 top-3.5 text-on-surface-variant pointer-events-none" />
            <input
              type="tel"
              required
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              placeholder="e.g. 03001234567"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:border-primary focus:outline-none font-mono"
            />
          </div>
          <p className="text-[10px] text-on-surface-variant mt-1">
            Mareez is mobile number aur unique password se portal login karega (jo token slip par print hoga).
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
          <label className="text-[11px] font-semibold text-on-surface flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={resetPassword}
              onChange={(e) => setResetPassword(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant"
            />
            <span>Regenerate New Unique Password</span>
          </label>
          <span className="text-[10px] text-on-surface-variant font-mono">For lost passwords</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
            Email Address (Optional)
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-3.5 text-on-surface-variant pointer-events-none" />
            <input
              type="email"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              placeholder="e.g. patient@example.com (optional)"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Select Attending Doctor *
            </label>
            <span className="text-[10px] text-on-surface-variant">
              {doctors.length} Doctors on rota
            </span>
          </div>

          {loadingDoctors ? (
            <div className="p-4 text-center text-xs text-on-surface-variant">Loading doctors...</div>
          ) : doctors.length === 0 ? (
            <div className="p-4 text-center text-xs text-error border border-error/20 rounded-xl bg-error/5">
              No active doctors found in this clinic.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {doctors.map((doc) => {
                const isSelected = String(selectedDoctorId) === String(doc.id)
                const waitCount = doctorWaitingCounts[String(doc.id)] || 0
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctorId(String(doc.id))}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-outline-variant/40 bg-surface-container-lowest hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? 'bg-primary-container text-on-primary' : 'bg-surface-container-low text-on-surface'
                      }`}>
                        <Stethoscope size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs sm:text-sm text-on-surface truncate">
                          Dr. {doc.user_name || doc.name}
                        </p>
                        <p className="text-[10px] text-on-surface-variant truncate">
                          {doc.specialty || 'General Practitioner'} · ${Number(doc.consultation_fee || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        waitCount > 0 ? 'bg-[#FFFBEB] text-[#B45309]' : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        {waitCount} waiting
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
            Symptoms / Reason for Visit (Optional)
          </label>
          <textarea
            rows={2}
            value={symptomsNotes}
            onChange={(e) => setSymptomsNotes(e.target.value)}
            placeholder="e.g. Eye pain, fever since yesterday, checkup..."
            className="w-full p-3 text-xs bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:border-primary focus:outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={walkinMutation.isPending}
          className="w-full py-3 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-xl text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {walkinMutation.isPending ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Allocating Token...</span>
            </>
          ) : (
            <>
              <Plus size={18} />
              <span>Issue Token Slip & Check In</span>
            </>
          )}
        </button>
      </form>
    </div>
  )

  // Render Queue Monitor
  const renderQueueMonitor = (maxHeight = '500px') => (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
            <Clock size={18} className="text-primary" /> Today's Live OPD Queue
          </h2>
          <p className="text-xs text-on-surface-variant">Real-time status of patients waiting and inside doctor cabins</p>
        </div>

        <button
          onClick={() => refetchAppts()}
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors self-start sm:self-auto cursor-pointer"
          title="Refresh Queue"
        >
          <RefreshCw size={16} className={loadingAppts ? 'animate-spin text-primary' : ''} />
        </button>
      </div>

      {/* Filter controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div>
          <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">Doctor</label>
          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
            className="w-full p-2 text-xs bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none"
          >
            <option value="ALL">All Doctors</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>Dr. {d.user_name || d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-2 text-xs bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none"
          >
            <option value="ALL">All States</option>
            <option value="CHECK_IN">Waiting (Checked In)</option>
            <option value="IN_PROGRESS">In Consultation</option>
            <option value="BOOKED">Booked (Online)</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-on-surface-variant pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Patient or Token #..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Queue List Table / Cards */}
      <div className="space-y-2.5 overflow-y-auto pr-1" style={{ maxHeight }}>
        {filteredQueue.length === 0 ? (
          <div className="p-8 text-center text-xs text-on-surface-variant border border-dashed border-outline-variant/40 rounded-xl">
            No patients found matching the selected filters.
          </div>
        ) : (
          filteredQueue.map((appt) => (
            <div
              key={appt.id}
              className="p-3.5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest hover:border-primary/40 transition-colors flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase">Token</span>
                  <span className="text-base sm:text-lg font-black text-primary font-mono leading-none">
                    #{appt.token_number || '--'}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-on-surface truncate">
                      {appt.patient_name}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${STATUS_PILLS[appt.status] || STATUS_PILLS.BOOKED}`}>
                      {appt.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 truncate">
                    Attending: <strong className="text-on-surface">Dr. {appt.doctor_name}</strong>
                    {appt.doctor_specialty ? ` (${appt.doctor_specialty})` : ''}
                  </p>
                  {appt.notes && (
                    <p className="text-[10px] text-on-surface-variant/80 font-mono mt-0.5 truncate max-w-xs">
                      {appt.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {appt.status === 'BOOKED' && (
                  <button
                    onClick={() => updateStatusMutation.mutate({ id: appt.id, status: 'CHECK_IN' })}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FFFBEB] hover:bg-[#FDE68A] text-[#B45309] font-bold text-xs transition-colors cursor-pointer"
                    title="Check In Patient"
                  >
                    Check In
                  </button>
                )}

                <button
                  onClick={() => setTokenSlipAppt(appt)}
                  className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  title="Print Token Slip"
                >
                  <Printer size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen w-full max-w-full bg-background text-on-surface font-sans flex antialiased overflow-x-hidden">
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. PERSISTENT RECEPTION SIDEBAR                                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 max-w-[85vw] bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        {/* Brand Logo Header (Fixed at top) */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-surface-container-high/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-black shadow-sm">
              <Building2 size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-on-surface text-base tracking-tight leading-tight">MediCore Clinical Enterprise</span>
              <span className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">Front Desk Station</span>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {/* Reception Meta Badge */}
          <div className="m-3 sm:m-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">CLINIC FRONT DESK</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                RECEPTIONIST
              </span>
            </div>
            <p className="font-bold text-xs text-on-surface truncate">{user?.name || 'Reception Desk'}</p>
            <p className="text-[11px] text-on-surface-variant">{todayAppts.length} Patients Intaked Today</p>
          </div>

          {/* Navigation Section */}
          <div className="px-3 py-2 space-y-6 pb-6">
            <div>
              <span className="px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
                Front Desk Operations
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => { setActiveNav('overview'); setMobileMenuOpen(false) }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors ${activeNav === 'overview'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard size={17} />
                    <span>Main Overview & Telemetry</span>
                  </div>
                </button>

                <button
                  onClick={() => { setActiveNav('walkin'); setMobileMenuOpen(false) }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors ${activeNav === 'walkin'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={17} />
                    <span>Walk-in Patient Intake</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container font-bold text-on-surface-variant">
                    ~10s
                  </span>
                </button>

                <button
                  onClick={() => { setActiveNav('queue'); setMobileMenuOpen(false) }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors ${activeNav === 'queue'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock size={17} />
                    <span>Today's Live Queue</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeNav === 'queue' ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                    {todayAppts.length} Live
                  </span>
                </button>

                <button
                  onClick={() => { setActiveNav('doctors'); setMobileMenuOpen(false) }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors ${activeNav === 'doctors'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Stethoscope size={17} />
                    <span>Doctors & Cabin Rota</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeNav === 'doctors' ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                    {doctors.length}
                  </span>
                </button>
              </nav>
            </div>

            <div>
              <span className="px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
                Quick Actions
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveNav('walkin'); setMobileMenuOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-surface-container-high/40 transition-colors"
                >
                  <Plus size={16} />
                  <span>Issue Walk-in Token</span>
                </button>
                <button
                  onClick={() => {
                    refetchAppts()
                    toast.success('Live queue updated!')
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-surface-container-high/40 transition-colors"
                >
                  <RefreshCw size={15} />
                  <span>Sync OPD Queue</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Session Footer (Pinned at bottom, always visible) */}
        <div className="p-4 border-t border-surface-container-high/40 bg-surface-container-low/50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                {(user?.name || 'R').charAt(0)}
              </div>
              <span className="text-xs font-bold text-on-surface truncate">{user?.name || 'Receptionist'}</span>
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
      {/* 2. OPERATIONAL CONTENT STAGE                                        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 w-full shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-1.5 text-on-surface-variant hover:text-on-surface shrink-0">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-on-surface truncate">
                {activeNav === 'overview'
                  ? 'Main Overview & Telemetry'
                  : activeNav === 'walkin'
                  ? 'Walk-in Patient Intake Station'
                  : activeNav === 'queue'
                  ? "Today's Live OPD Queue"
                  : 'Doctors & Examination Cabin Rota'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Live Clock */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-mono font-bold text-xs text-on-surface">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-[10px] text-on-surface-variant">
                {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="h-6 w-px bg-outline-variant/30 hidden sm:block" />

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span>{stats.waiting} Waiting in OPD</span>
            </div>

            <button
              onClick={() => refetchAppts()}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/30 transition-all cursor-pointer"
              title="Refresh Live Queue"
            >
              <RefreshCw size={14} className={loadingAppts ? 'animate-spin text-primary' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 w-full max-w-full overflow-x-hidden">
          {/* ── STAGE 1: OVERVIEW & TELEMETRY ─────────────────────────────── */}
          {activeNav === 'overview' && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Front Desk Telemetry</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-on-surface tracking-tight">
                    Front Desk Operations & OPD Intake
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                    Real-time patient check-ins, doctor cabin allocation, and live OPD queue monitoring.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveNav('walkin')}
                    className="px-4 py-2.5 bg-primary-container hover:bg-primary text-on-primary font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>Issue Walk-in Token</span>
                  </button>
                </div>
              </div>

              {/* 4 Bento KPI Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant block">Total Issued Today</span>
                    <p className="text-2xl sm:text-3xl font-black text-on-surface font-mono mt-1">{stats.total}</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Walk-ins & scheduled</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Building2 size={18} />
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#B45309] block">Waiting in OPD</span>
                    <p className="text-2xl sm:text-3xl font-black text-[#B45309] font-mono mt-1">{stats.waiting}</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Checked-in queue</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Clock size={18} />
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary block">In Doctor Cabin</span>
                    <p className="text-2xl sm:text-3xl font-black text-primary font-mono mt-1">{stats.inProgress}</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Consultation active</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Stethoscope size={18} />
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#047857] block">Completed Care</span>
                    <p className="text-2xl sm:text-3xl font-black text-[#047857] font-mono mt-1">{stats.completed}</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Finished visits</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0">
                    <CheckCircle size={18} />
                  </div>
                </div>
              </div>

              {/* 2 Recharts Telemetry Visualizations */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
                {/* Doctor Workload Distribution BarChart */}
                <div className="lg:col-span-2 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-on-surface text-sm sm:text-base flex items-center gap-2">
                        <TrendingUp size={18} className="text-primary" />
                        <span>Doctor OPD Waiting Load by Cabin</span>
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">Patients currently queued up per attending specialist.</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
                      Live Rota
                    </span>
                  </div>
                  <div className="h-60 w-full">
                    {doctorWorkloadData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={doctorWorkloadData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
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
                          <Bar dataKey="waiting" fill="#0F766E" radius={[6, 6, 0, 0]} name="Patients Waiting" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-on-surface-variant">
                        No active doctors rostered yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Queue Status Ratio Donut PieChart */}
                <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-on-surface text-sm sm:text-base flex items-center gap-2 mb-1">
                      <Layers size={18} className="text-primary" />
                      <span>Today's Queue Breakdown</span>
                    </h3>
                    <p className="text-xs text-on-surface-variant">Intake vs consultation states.</p>
                  </div>

                  <div className="h-44 w-full my-2 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={queueStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {queueStatusData.map((entry, idx) => (
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
                      <span className="text-2xl font-black text-on-surface font-mono">{todayAppts.length}</span>
                      <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Visits</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-outline-variant/20">
                    {queueStatusData.map((entry, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></span>
                          <span className="text-on-surface-variant truncate">{entry.name}</span>
                        </div>
                        <span className="font-bold text-on-surface font-mono">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2-Column Responsive Layout: Walkin + Queue */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start w-full">
                <div className="lg:col-span-5 w-full">
                  {renderIntakeForm(false)}
                </div>
                <div className="lg:col-span-7 w-full">
                  {renderQueueMonitor('500px')}
                </div>
              </div>
            </div>
          )}

          {/* ── STAGE 2: DEDICATED WALKIN INTAKE STATION ──────────────────── */}
          {activeNav === 'walkin' && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
              <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
                    Fast OPD Triage
                  </span>
                  <span className="text-[11px] text-on-surface-variant font-medium">Walk-in Station</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                  Walk-in Patient Registration & Token Dispenser
                </h1>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                  Register new OPD arrival, choose doctor, and automatically dispense printed token slip.
                </p>
              </div>

              <div className="w-full">
                {renderIntakeForm(true)}
              </div>
            </div>
          )}

          {/* ── STAGE 3: DEDICATED LIVE QUEUE MONITOR ─────────────────────── */}
          {activeNav === 'queue' && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
              <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Live Queue Terminal</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                  Today's Live Outpatient Queue
                </h1>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                  Monitor patients waiting in reception, mark arrivals checked in, and reprint token slips.
                </p>
              </div>

              <div className="w-full">
                {renderQueueMonitor('700px')}
              </div>
            </div>
          )}

          {/* ── STAGE 4: DOCTORS & CABIN ROTA ─────────────────────────────── */}
          {activeNav === 'doctors' && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
              <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Active Doctors Rota</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                  Doctors Directory & Examination Cabins
                </h1>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                  Specialist availability, consultation charges, and current waiting queue count per doctor.
                </p>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low/70 border-b border-outline-variant/30 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                        <th className="py-3.5 px-4 sm:px-6">Attending Doctor</th>
                        <th className="py-3.5 px-4 sm:px-6">Specialty</th>
                        <th className="py-3.5 px-4 sm:px-6">Consultation Fee</th>
                        <th className="py-3.5 px-4 sm:px-6">Active Queue</th>
                        <th className="py-3.5 px-4 sm:px-6 text-right">Quick Intake</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {doctors.map((doc) => {
                        const waitCount = doctorWaitingCounts[String(doc.id)] || 0
                        return (
                          <tr key={doc.id} className="hover:bg-surface-container-low/40 transition-colors">
                            <td className="py-3.5 px-4 sm:px-6">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                                  <Stethoscope size={16} />
                                </div>
                                <div>
                                  <span className="font-bold text-on-surface text-sm">Dr. {doc.user_name || doc.name}</span>
                                  <p className="text-[11px] text-on-surface-variant font-mono">Cabin #{doc.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 sm:px-6">
                              <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
                                {doc.specialty || 'General Practitioner'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-on-surface">
                              ${Number(doc.consultation_fee || 0).toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4 sm:px-6">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                                waitCount > 0 ? 'bg-[#FFFBEB] text-[#B45309]' : 'bg-surface-container text-on-surface-variant'
                              }`}>
                                {waitCount} waiting
                              </span>
                            </td>
                            <td className="py-3.5 px-4 sm:px-6 text-right">
                              <button
                                onClick={() => {
                                  setSelectedDoctorId(String(doc.id))
                                  setActiveNav('walkin')
                                }}
                                className="px-3 py-1.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary text-xs font-bold transition-all shadow-xs"
                              >
                                Issue Token
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Token Slip Modal */}
      {tokenSlipAppt && (
        <TokenSlipModal
          appointment={tokenSlipAppt}
          clinicName={user?.clinic_name}
          onClose={() => setTokenSlipAppt(null)}
        />
      )}
    </div>
  )
}

