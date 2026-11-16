import { useState, useMemo, useEffect, Fragment } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import {
  Stethoscope, Activity, FileText, FlaskConical, User, Users,
  CheckCircle, Clock, ChevronRight, ArrowLeft, Search,
  AlertCircle, Pill, Thermometer, Heart, Weight,
  Calendar, LogOut, Check, Sparkles, RefreshCw, Eye,
  Copy, History, ArrowUpRight, Table as TableIcon,
  LayoutGrid, ChevronDown, ChevronUp, Layers, LayoutDashboard,
  Menu, X, Building2, TrendingUp
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { useAuthStore } from '../../store/authStore'

const STATUS_PILLS = {
  BOOKED: 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]',
  CHECK_IN: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
  IN_PROGRESS: 'bg-[#CCFBF1] text-[#0F766E] border-[#5EEAD4]',
  COMPLETED: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
  CANCELLED: 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]',
}

// ── Prescription Formatter (Strips raw JSON [] or formats medication lists) ──
function formatRx(val) {
  if (!val) return ''
  if (typeof val === 'string') {
    const trimmed = val.trim()
    if (trimmed === '[]' || trimmed === '{}' || trimmed === 'null' || trimmed === '""') return ''
    return val
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return ''
    return val.map(m => {
      if (typeof m === 'string') {
        const t = m.trim()
        return (t === '[]' || t === '{}') ? '' : t
      }
      if (typeof m === 'object' && m) {
        return `${m.drug || m.name || ''} ${m.dosage || ''} ${m.frequency || ''} ${m.instructions || ''}`.trim()
      }
      return ''
    }).filter(Boolean).join('\n')
  }
  return ''
}

// ── Telemetry Vital Card with Comparative Baseline & Live Auto-Save ──────────
function VitalCard({ label, value, unit, icon: Icon, placeholder, prevValue, onSave }) {
  const [val, setVal] = useState(value || '')

  useEffect(() => {
    setVal(value || '')
  }, [value])

  return (
    <div className="bg-surface-container-lowest p-3.5 sm:p-4 rounded-xl border border-outline-variant/30 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] hover:border-primary/40 transition-colors w-full min-w-0">
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5 truncate">
          <Icon size={14} className="text-primary shrink-0" />
          <span className="truncate">{label}</span>
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container-low text-secondary font-semibold shrink-0">
          {unit}
        </span>
      </div>
      <div className="flex items-baseline gap-1 mt-1">
        <input
          type="text"
          value={val}
          placeholder={placeholder}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => {
            if (val !== (value || '')) {
              onSave(val)
            }
          }}
          className="w-full text-lg sm:text-2xl font-black text-on-surface font-mono tracking-tight bg-transparent border-b border-transparent hover:border-outline-variant focus:border-primary focus:outline-none transition-colors"
        />
      </div>
      {prevValue ? (
        <div className="text-[10px] text-on-surface-variant font-mono mt-1.5 flex items-center gap-1 truncate">
          <span className="text-[9px] uppercase font-bold text-secondary shrink-0">Last:</span>
          <span className="font-semibold text-on-surface truncate">{prevValue} {unit}</span>
        </div>
      ) : (
        <div className="text-[10px] text-on-surface-variant/40 font-mono mt-1.5">
          <span>First baseline reading</span>
        </div>
      )}
    </div>
  )
}

// ── Patient Lab Reports Component ────────────────────────────────────────────
function PatientLabsViewer({ patientId }) {
  const { data: labs = [], isLoading } = useQuery({
    queryKey: ['doctor-patient-labs', patientId],
    queryFn: () => api.get(`/api/labs/reports/?patient=${patientId}`).then(r => r.data),
    enabled: !!patientId,
  })

  if (isLoading) {
    return (
      <div className="p-8 text-center text-on-surface-variant text-sm flex items-center justify-center gap-2">
        <RefreshCw size={18} className="animate-spin text-primary" />
        Loading diagnostic records…
      </div>
    )
  }

  if (labs.length === 0) {
    return (
      <div className="bg-surface-container-low/40 rounded-2xl p-6 sm:p-8 text-center border border-dashed border-outline-variant/50">
        <FlaskConical size={32} className="mx-auto mb-2 text-on-surface-variant/40" />
        <p className="text-sm font-semibold text-on-surface-variant">No laboratory records on file for this patient.</p>
        <p className="text-xs text-on-surface-variant/70 mt-1">Uploaded reports by patient or clinic will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {labs.map(lab => (
        <div key={lab.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3.5 sm:p-4 flex items-center justify-between shadow-xs hover:border-primary/40 transition-colors gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-secondary-container/30 flex items-center justify-center text-primary shrink-0">
              <FlaskConical size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs sm:text-sm text-on-surface truncate">{lab.file_name || lab.name || 'Laboratory Report'}</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Archived: {new Date(lab.uploaded_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          {lab.report_file && (
            <a
              href={lab.report_file}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-primary-container hover:text-on-primary text-xs font-semibold text-on-surface transition-all shrink-0"
            >
              <Eye size={14} /> View
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Main Consultation Desk ───────────────────────────────────────────────────
export default function ConsultationDesk() {
  const [selectedAppt, setSelectedAppt] = useState(null)
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'prescription' | 'notes' | 'history' | 'labs'
  const [mainNav, setMainNav] = useState('overview') // 'overview' | 'queue' | 'history' | 'schedule'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState('all') // 'today' | 'upcoming' | 'all'
  const [viewMode, setViewMode] = useState('table') // 'table' | 'cards'
  const [expandedPatientId, setExpandedPatientId] = useState(null)
  const [isFinishing, setIsFinishing] = useState(false)
  const [rxInput, setRxInput] = useState('')

  const qc = useQueryClient()
  const { user, logout } = useAuthStore()

  // 1. Fetch Doctor Consultation Queue (live polling every 15s)
  const { data: rawQueue = [], isLoading: loadingQueue, refetch } = useQuery({
    queryKey: ['doctor-queue'],
    queryFn: () => api.get('/api/doctor/consultations/queue/').then(r => r.data),
    refetchInterval: 15000,
  })

  // Group appointments by unique patient so each patient appears ONCE in the queue
  // with their latest token replacing older ones, and previous appointments archived in details.
  const groupedQueue = useMemo(() => {
    if (!Array.isArray(rawQueue) || rawQueue.length === 0) return []

    // Sort by scheduled_at ascending so later appointments naturally supersede earlier ones
    const sorted = [...rawQueue].sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))

    const patientMap = new Map()

    for (const appt of sorted) {
      const pid = appt.patient || appt.patient_id || appt.patient_email || appt.patient_name
      if (!patientMap.has(pid)) {
        patientMap.set(pid, {
          ...appt,
          past_encounters: [],
          total_encounters: 1,
        })
      } else {
        const existing = patientMap.get(pid)
        const isNewer = new Date(appt.scheduled_at) >= new Date(existing.scheduled_at)

        if (isNewer) {
          // Newer appointment replaces the older token on the main roster!
          const pastList = [
            ...existing.past_encounters,
            {
              id: existing.id,
              token_number: existing.token_number,
              scheduled_at: existing.scheduled_at,
              status: existing.status,
              notes: existing.notes,
            }
          ]
          patientMap.set(pid, {
            ...appt,
            past_encounters: pastList,
            total_encounters: pastList.length + 1,
          })
        } else {
          // Add this older appointment into past_encounters list
          existing.past_encounters.push({
            id: appt.id,
            token_number: appt.token_number,
            scheduled_at: appt.scheduled_at,
            status: appt.status,
            notes: appt.notes,
          })
          existing.total_encounters = existing.past_encounters.length + 1
        }
      }
    }

    // Sort final roster so newest scheduled appointments appear on top
    return Array.from(patientMap.values()).sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at))
  }, [rawQueue])

  // 2. Fetch Active Consultation details for the selected appointment
  const { data: consultation, isLoading: loadingConsultation } = useQuery({
    queryKey: ['consultation', selectedAppt?.id],
    queryFn: () => api.get(`/api/doctor/consultations/for_appointment/?appointment=${selectedAppt?.id}`).then(r => {
      const rx = formatRx(r.data?.prescription)
      setRxInput(rx)
      return r.data
    }),
    enabled: !!selectedAppt?.id,
  })

  // 3. Fetch Patient's Historical Consultations & Encounters across all visits
  const patientId = selectedAppt?.patient || selectedAppt?.patient_id
  const { data: pastConsultations = [], isLoading: loadingHistory } = useQuery({
    queryKey: ['patient-consultations-history', patientId],
    queryFn: () => api.get(`/api/doctor/consultations/patient_history/?patient=${patientId}`).then(r => Array.isArray(r.data) ? r.data : []).catch(() => []),
    enabled: !!patientId,
  })

  // Filter out the current active appointment from history
  const previousVisits = useMemo(() => {
    return pastConsultations.filter(c => c.appointment !== selectedAppt?.id && String(c.appointment) !== String(selectedAppt?.id))
  }, [pastConsultations, selectedAppt?.id])

  // Last visit with vitals recorded
  const lastVisitWithVitals = useMemo(() => {
    return previousVisits.find(v => v.vitals && Object.keys(v.vitals).length > 0)
  }, [previousVisits])

  // Most recent visit that has diagnosis, notes, prescription, or vitals
  const mostRecentVisitWithRecord = useMemo(() => {
    return previousVisits.find(v => v.diagnosis || formatRx(v.prescription) || v.notes || (v.vitals && Object.keys(v.vitals).length > 0)) || previousVisits[0]
  }, [previousVisits])

  // 4. Complete Consultation Mutation
  const completeMutation = useMutation({
    mutationFn: (id) => api.patch(`/api/patient/appointments/${id}/set_status/`, { status: 'COMPLETED' }),
    onMutate: () => setIsFinishing(true),
    onSuccess: () => {
      setIsFinishing(false)
      qc.invalidateQueries(['doctor-queue'])
      qc.invalidateQueries(['patient-consultations-history', patientId])
      toast.success('Consultation finalized. Invoice and discharge summary queued.')
      setSelectedAppt(null)
    },
    onError: () => {
      setIsFinishing(false)
      toast.error('Failed to complete consultation.')
    }
  })

  // Date partition helpers on grouped unique patients
  const todayStr = new Date().toDateString()
  const todayQueue = useMemo(() => groupedQueue.filter(a => new Date(a.scheduled_at).toDateString() === todayStr), [groupedQueue, todayStr])
  const upcomingQueue = useMemo(() => groupedQueue.filter(a => new Date(a.scheduled_at).toDateString() !== todayStr), [groupedQueue, todayStr])

  // 7-day consultation trajectory data for chart
  const trajectoryData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const list = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dayName = days[d.getDay()]
      const dateStr = d.toDateString()
      const count = groupedQueue.filter(a => new Date(a.scheduled_at).toDateString() === dateStr).length
      list.push({
        day: `${dayName} ${d.getDate()}`,
        patients: count,
      })
    }
    return list
  }, [groupedQueue])

  // Queue status breakdown donut
  const queueStatusData = useMemo(() => {
    const waiting = groupedQueue.filter(a => ['BOOKED', 'CHECK_IN'].includes(a.status)).length
    const inProgress = groupedQueue.filter(a => a.status === 'IN_PROGRESS').length
    const completed = groupedQueue.filter(a => a.status === 'COMPLETED').length
    const upcoming = upcomingQueue.length
    return [
      { name: 'Waiting in OPD', value: waiting || (groupedQueue.length === 0 ? 0 : 1), color: '#D97706' },
      { name: 'In Consultation', value: inProgress, color: '#0F766E' },
      { name: 'Upcoming Visits', value: upcoming, color: '#0284C7' },
      { name: 'Completed Visits', value: completed, color: '#10B981' },
    ].filter(item => item.value > 0)
  }, [groupedQueue, upcomingQueue])

  // Immediate next waiting patient
  const nextWaitingPatient = useMemo(() => {
    return groupedQueue.find(a => ['CHECK_IN', 'BOOKED'].includes(a.status))
  }, [groupedQueue])

  // Current displayed queue based on filter and search
  const displayedQueue = useMemo(() => {
    let list = groupedQueue
    if (filterMode === 'today') list = todayQueue
    if (filterMode === 'upcoming') list = upcomingQueue

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(a =>
        (a.patient_name || '').toLowerCase().includes(q) ||
        (a.patient_email || '').toLowerCase().includes(q) ||
        String(a.token_number || '').includes(q) ||
        (a.status || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [groupedQueue, todayQueue, upcomingQueue, filterMode, searchQuery])

  // Helper to patch consultation fields
  const updateConsultation = (patchData, successMsg) => {
    if (!consultation?.id) return
    api.patch(`/api/doctor/consultations/${consultation.id}/`, patchData)
      .then(() => {
        if (successMsg) toast.success(successMsg)
        qc.invalidateQueries(['consultation', selectedAppt?.id])
      })
      .catch(() => toast.error('Failed to save consultation changes.'))
  }

  // Quick vital updater
  const handleSaveVital = (key, val) => {
    const nextVitals = { ...(consultation?.vitals || {}), [key]: val }
    updateConsultation({ vitals: nextVitals }, `Vital: ${key.toUpperCase()} recorded`)
  }

  // Copy previous prescription to current visit
  const handleCopyPreviousRx = (prevRx) => {
    const text = formatRx(prevRx)
    if (!text) return
    setRxInput(text)
    updateConsultation({ prescription: text }, "Previous prescription copied to today's encounter!")
    setActiveTab('prescription')
  }

  return (
    <div className="min-h-screen w-full max-w-full bg-background text-on-surface font-sans flex antialiased overflow-x-hidden">
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. PERSISTENT DOCTOR SIDEBAR                                        */}
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
              <span className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">Doctor Workstation</span>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {/* Doctor Meta Badge */}
          <div className="m-3 sm:m-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">ATTENDING SPECIALIST</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                DOCTOR
              </span>
            </div>
            <p className="font-bold text-xs text-on-surface truncate">Dr. {user?.name || 'Physician'}</p>
            <p className="text-[11px] text-on-surface-variant">{todayQueue.length} Patients in Queue Today</p>
          </div>

          {/* Navigation Section */}
          <div className="px-3 py-2 space-y-6 pb-6">
            <div>
              <span className="px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
                Clinical Workspace
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setMainNav('overview')
                    setSelectedAppt(null)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors ${mainNav === 'overview' && !selectedAppt
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
                  onClick={() => {
                    setMainNav('queue')
                    setSelectedAppt(null)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors ${mainNav === 'queue' && !selectedAppt
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock size={17} />
                    <span>Outpatient Queue</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${mainNav === 'queue' && !selectedAppt ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                    {todayQueue.length} Live
                  </span>
                </button>

                <button
                  onClick={() => {
                    setMainNav('history')
                    setSelectedAppt(null)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors ${mainNav === 'history' && !selectedAppt
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <History size={17} />
                    <span>Patient Records & History</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${mainNav === 'history' && !selectedAppt ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                    {groupedQueue.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setMainNav('schedule')
                    setSelectedAppt(null)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors ${mainNav === 'schedule' && !selectedAppt
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar size={17} />
                    <span>OPD Timetable & Hours</span>
                  </div>
                </button>
              </nav>
            </div>

            <div>
              <span className="px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
                Quick Actions
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    refetch()
                    toast.success('Queue synchronized with reception!')
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

        {/* User Session Footer (Always visible at bottom) */}
        <div className="p-4 border-t border-surface-container-high/40 bg-surface-container-low/50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                DR
              </div>
              <span className="text-xs font-bold text-on-surface truncate">Dr. {user?.name || 'Physician'}</span>
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
            {selectedAppt ? (
              <button
                onClick={() => setSelectedAppt(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <ArrowLeft size={15} />
                <span>Return to Consultation Queue</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-on-surface truncate">
                  {mainNav === 'overview'
                    ? 'Main Overview & Telemetry'
                    : mainNav === 'queue'
                    ? 'Outpatient Consultation Queue'
                    : mainNav === 'history'
                    ? 'Patient Records & Encounter History'
                    : 'OPD Schedule & Hours'}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span>{groupedQueue.filter(a => ['BOOKED', 'CHECK_IN'].includes(a.status)).length} Waiting in OPD</span>
            </div>
            <button
              onClick={() => refetch()}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/30 transition-all"
              title="Refresh Queue"
            >
              <RefreshCw size={14} className={loadingQueue ? 'animate-spin text-primary' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 w-full max-w-full overflow-x-hidden">
        {!selectedAppt ? (
          <>
            {/* ── STAGE 1: MAIN OVERVIEW & TELEMETRY ───────────────────────── */}
            {mainNav === 'overview' && (
              <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Doctor Clinical Telemetry</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-on-surface tracking-tight">
                      Doctor Clinical Overview
                    </h1>
                    <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                      Outpatient consultation metrics, waiting patient volume, and weekly care progression.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMainNav('queue')}
                      className="px-4 py-2.5 bg-primary-container hover:bg-primary text-on-primary font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2"
                    >
                      <Clock size={15} />
                      <span>Open Live Queue ({todayQueue.length})</span>
                    </button>
                  </div>
                </div>

                {/* 4 Bento KPI Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                        Active Patients
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-on-surface font-mono">
                        {groupedQueue.length}
                      </span>
                      <span className="text-[10px] text-on-surface-variant block mt-0.5">Rostered in clinic</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                      <Users size={18} />
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block mb-1">
                        Waiting Room
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
                        {groupedQueue.filter(a => ['BOOKED', 'CHECK_IN'].includes(a.status)).length}
                      </span>
                      <span className="text-[10px] text-on-surface-variant block mt-0.5">Checked in at reception</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                      <Clock size={18} />
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-1">
                        In Consultation
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-primary font-mono">
                        {groupedQueue.filter(a => a.status === 'IN_PROGRESS').length}
                      </span>
                      <span className="text-[10px] text-on-surface-variant block mt-0.5">Inside cabin now</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Stethoscope size={18} />
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                        Upcoming Visits
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-on-surface-variant font-mono">
                        {upcomingQueue.length}
                      </span>
                      <span className="text-[10px] text-on-surface-variant block mt-0.5">Scheduled appointments</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0">
                      <Calendar size={18} />
                    </div>
                  </div>
                </div>

                {/* Next in Line Callout */}
                {nextWaitingPatient && (
                  <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-amber-500 text-white font-mono font-black text-base flex items-center justify-center shrink-0 shadow-sm">
                        #{nextWaitingPatient.token_number || '--'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm sm:text-base text-on-surface truncate">
                            Next in Line: {nextWaitingPatient.patient_name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                            {nextWaitingPatient.status}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                          Scheduled: {new Date(nextWaitingPatient.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Waiting in OPD Reception
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedAppt(nextWaitingPatient)
                        setActiveTab('overview')
                      }}
                      className="px-4 sm:px-5 py-2.5 bg-primary-container hover:bg-primary text-on-primary font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                    >
                      <span>Start Consultation</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                )}

                {/* 2 Recharts Telemetry Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
                  {/* Trajectory AreaChart */}
                  <div className="lg:col-span-2 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-on-surface text-sm sm:text-base flex items-center gap-2">
                          <TrendingUp size={18} className="text-primary" />
                          <span>7-Day Outpatient Consultations Trajectory</span>
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">Daily completed and scheduled patient visits.</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold">
                        Past 7 Days
                      </span>
                    </div>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="doctorAreaGradient" x1="0" y1="0" x2="0" y2="1">
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
                              fontSize: '12px'
                            }}
                          />
                          <Area type="monotone" dataKey="patients" stroke="#0F766E" strokeWidth={2.5} fillOpacity={1} fill="url(#doctorAreaGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Status Donut PieChart */}
                  <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-on-surface text-sm sm:text-base flex items-center gap-2 mb-1">
                        <Layers size={18} className="text-primary" />
                        <span>Queue Status Breakdown</span>
                      </h3>
                      <p className="text-xs text-on-surface-variant">Live OPD waiting ratio.</p>
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
                        <span className="text-2xl font-black text-on-surface font-mono">{groupedQueue.length}</span>
                        <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Patients</span>
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

                {/* Immediate Next 5 Patients Quick Roster */}
                <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-on-surface text-base">Next Patients in Queue</h3>
                      <p className="text-xs text-on-surface-variant">Immediate OPD patients ready for clinical intake.</p>
                    </div>
                    <button
                      onClick={() => setMainNav('queue')}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>View Full Outpatient Queue ({groupedQueue.length})</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="divide-y divide-outline-variant/20">
                    {displayedQueue.slice(0, 5).map((appt) => (
                      <div key={appt.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-9 h-9 rounded-xl bg-surface-container-high text-primary font-mono font-black text-xs flex items-center justify-center shrink-0 border border-outline-variant/30">
                            #{appt.token_number || '--'}
                          </span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-on-surface truncate">{appt.patient_name}</h4>
                            <p className="text-[11px] text-on-surface-variant truncate">
                              {new Date(appt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {appt.notes || 'Routine consultation'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${STATUS_PILLS[appt.status] || STATUS_PILLS.BOOKED}`}>
                            {appt.status.replace('_', ' ')}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedAppt(appt)
                              setActiveTab('overview')
                            }}
                            className="px-3 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-bold text-xs flex items-center gap-1 transition-all shadow-xs"
                          >
                            <span>Open</span>
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── STAGE 2: FULL OUTPATIENT QUEUE ───────────────────────────── */}
            {mainNav === 'queue' && (
              <div className="space-y-5 sm:space-y-6">
            {/* Queue Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                    Active Patients
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-on-surface font-mono">
                    {groupedQueue.length}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Users size={18} />
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                    Waiting Room
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
                    {groupedQueue.filter(a => ['BOOKED', 'CHECK_IN'].includes(a.status)).length}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                    In Consultation
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-primary font-mono">
                    {groupedQueue.filter(a => a.status === 'IN_PROGRESS').length}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Stethoscope size={18} />
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                    Upcoming Visits
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-on-surface-variant font-mono">
                    {upcomingQueue.length}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0">
                  <Calendar size={18} />
                </div>
              </div>
            </div>

            {/* Filter, View Switcher, and Search Bar */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl overflow-x-auto no-scrollbar">
                {[
                  { key: 'all', label: `All Patients (${groupedQueue.length})` },
                  { key: 'today', label: `Today's Queue (${todayQueue.length})` },
                  { key: 'upcoming', label: `Upcoming (${upcomingQueue.length})` },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilterMode(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filterMode === key
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2.5 flex-1 lg:max-w-md justify-end">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="text"
                    placeholder="Search patient, token, email…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl pl-9 pr-3 py-1.5 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary"
                  />
                </div>

                {/* View Mode Toggle: Table vs Cards */}
                <div className="flex items-center bg-surface-container-low p-1 rounded-xl shrink-0 border border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${viewMode === 'table'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    title="Tabular Table View"
                  >
                    <TableIcon size={15} />
                    <span className="hidden sm:inline">Table</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${viewMode === 'cards'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    title="Grid Card View"
                  >
                    <LayoutGrid size={15} />
                    <span className="hidden sm:inline">Cards</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Patient Queue Content (Tabular Table or Cards) */}
            <div className="space-y-3">
              {loadingQueue ? (
                <div className="p-12 text-center text-on-surface-variant text-sm flex items-center justify-center gap-2">
                  <RefreshCw size={20} className="animate-spin text-primary" />
                  Synchronizing outpatient queue…
                </div>
              ) : displayedQueue.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-2xl p-8 sm:p-12 text-center border border-dashed border-outline-variant/40">
                  <User size={36} className="mx-auto mb-2 text-on-surface-variant/40" />
                  <p className="font-bold text-on-surface text-base">No patients found in this filter.</p>
                  <p className="text-xs text-on-surface-variant mt-1">Appointments booked through clinic reception or online portal will appear live here.</p>
                </div>
              ) : viewMode === 'table' ? (
                /* ── TABULAR FORM VIEW (REQUESTED FORMAT) ─────────────────── */
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low/70 border-b border-outline-variant/30 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                          <th className="py-3.5 px-4 sm:px-6">Active Token</th>
                          <th className="py-3.5 px-4 sm:px-6">Patient Details</th>
                          <th className="py-3.5 px-4 sm:px-6">Latest Encounter</th>
                          <th className="py-3.5 px-4 sm:px-6">Visit History</th>
                          <th className="py-3.5 px-4 sm:px-6">Status</th>
                          <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        {displayedQueue.map((appt) => {
                          const isExpanded = expandedPatientId === appt.id
                          const hasPastEncounters = appt.past_encounters && appt.past_encounters.length > 0

                          return (
                            <Fragment key={appt.id}>
                              <tr className="hover:bg-surface-container-low/40 transition-colors group">
                                {/* 1. Active Token (Latest Token replaces older token) */}
                                <td className="py-3.5 px-4 sm:px-6">
                                  <div className="flex items-center gap-2">
                                    <span className="w-10 h-10 rounded-xl bg-surface-container-high text-primary font-mono font-black text-sm flex items-center justify-center shrink-0 border border-outline-variant/30 group-hover:border-primary/50 transition-colors">
                                      #{appt.token_number || '--'}
                                    </span>
                                  </div>
                                </td>

                                {/* 2. Patient Details */}
                                <td className="py-3.5 px-4 sm:px-6">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                      <User size={15} />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-on-surface text-sm truncate">{appt.patient_name}</span>
                                        {hasPastEncounters && (
                                          <span className="px-1.5 py-0.5 rounded bg-secondary-container/40 text-secondary text-[10px] font-bold shrink-0">
                                            Returning
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[11px] text-on-surface-variant truncate block font-mono">
                                        {appt.patient_email || 'Verified Patient'}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                {/* 3. Latest Scheduled Visit Date & Time */}
                                <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                                  <div className="space-y-0.5">
                                    <p className="font-bold text-on-surface text-xs flex items-center gap-1.5">
                                      <Calendar size={13} className="text-secondary shrink-0" />
                                      {new Date(appt.scheduled_at).toLocaleDateString([], {
                                        month: 'short', day: 'numeric', year: 'numeric'
                                      })}
                                    </p>
                                    <p className="text-[11px] text-on-surface-variant flex items-center gap-1 font-mono">
                                      <Clock size={11} className="shrink-0" />
                                      {new Date(appt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                </td>

                                {/* 4. Longitudinal History / Previous Encounters */}
                                <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                                  {hasPastEncounters ? (
                                    <button
                                      type="button"
                                      onClick={() => setExpandedPatientId(isExpanded ? null : appt.id)}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-xs font-semibold text-primary transition-colors border border-outline-variant/30"
                                      title="Click to view previous archived tokens and visits"
                                    >
                                      <History size={13} />
                                      <span>{appt.past_encounters.length} Past Token(s)</span>
                                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                    </button>
                                  ) : (
                                    <span className="text-xs text-on-surface-variant/60 italic flex items-center gap-1">
                                      First Visit
                                    </span>
                                  )}
                                </td>

                                {/* 5. Status */}
                                <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${STATUS_PILLS[appt.status] || STATUS_PILLS.BOOKED}`}>
                                    {appt.status.replace('_', ' ')}
                                  </span>
                                </td>

                                {/* 6. Actions */}
                                <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                                  <button
                                    onClick={() => {
                                      setSelectedAppt(appt)
                                      setActiveTab('overview')
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-bold text-xs transition-all shadow-xs"
                                  >
                                    <span>Open Encounter</span>
                                    <ChevronRight size={14} />
                                  </button>
                                </td>
                              </tr>

                              {/* Expandable Previous Encounters Sub-row */}
                              {isExpanded && hasPastEncounters && (
                                <tr className="bg-surface-container-low/50 border-t border-b border-outline-variant/30 animate-fade-in">
                                  <td colSpan={6} className="p-3 sm:p-5">
                                    <div className="bg-surface-container-lowest rounded-xl p-3.5 sm:p-4 border border-outline-variant/30 space-y-2.5">
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                                        <span className="font-bold text-on-surface flex items-center gap-1.5 uppercase tracking-wider">
                                          <History size={14} className="text-primary" />
                                          Archived Previous Visits & Historical Tokens for {appt.patient_name}:
                                        </span>
                                        <span className="text-[11px] text-on-surface-variant font-medium">
                                          Latest active token replaces earlier tokens on the active roster
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                                        {appt.past_encounters.map((past, pIdx) => (
                                          <div
                                            key={past.id || pIdx}
                                            className="bg-surface-container-low/50 p-3 rounded-lg border border-outline-variant/20 text-xs space-y-1.5 flex flex-col justify-between"
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="font-mono font-bold text-primary text-xs">
                                                Previous Token #{past.token_number || '--'}
                                              </span>
                                              <span className="text-[9px] uppercase font-bold text-on-surface-variant px-1.5 py-0.5 rounded bg-surface-container-high">
                                                {past.status}
                                              </span>
                                            </div>
                                            <p className="text-[11px] text-on-surface flex items-center gap-1">
                                              <Calendar size={11} className="text-secondary shrink-0" />
                                              {new Date(past.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(past.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            {past.notes && (
                                              <p className="text-[10px] text-on-surface-variant line-clamp-1 italic bg-surface-container-lowest p-1 rounded">
                                                "{past.notes}"
                                              </p>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* ── GRID CARD VIEW ────────────────────────────────────────── */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {displayedQueue.map((appt) => (
                    <div
                      key={appt.id}
                      className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4 sm:p-5 shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="w-10 h-10 rounded-xl bg-surface-container-high text-primary font-mono font-black text-sm flex items-center justify-center shrink-0 border border-outline-variant/30">
                              #{appt.token_number || '--'}
                            </span>
                            <div className="min-w-0">
                              <h3 className="font-bold text-sm sm:text-base text-on-surface truncate group-hover:text-primary transition-colors">
                                {appt.patient_name}
                              </h3>
                              <p className="text-[11px] text-on-surface-variant flex items-center gap-1 font-mono">
                                <Clock size={11} className="shrink-0" />
                                {new Date(appt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase shrink-0 ${STATUS_PILLS[appt.status] || STATUS_PILLS.BOOKED}`}>
                            {appt.status.replace('_', ' ')}
                          </span>
                        </div>

                        {appt.past_encounters && appt.past_encounters.length > 0 && (
                          <div className="bg-secondary-container/20 border border-secondary/20 rounded-xl p-2 text-xs flex items-center justify-between">
                            <span className="text-secondary font-bold text-[11px] flex items-center gap-1">
                              <History size={12} />
                              {appt.past_encounters.length} Previous Token(s) Saved
                            </span>
                            <span className="text-[10px] font-mono text-on-surface-variant">
                              Last: #{appt.past_encounters[appt.past_encounters.length - 1]?.token_number}
                            </span>
                          </div>
                        )}

                        {appt.notes && (
                          <p className="text-xs text-on-surface-variant bg-surface-container-low/40 p-2.5 rounded-xl line-clamp-2 italic border border-outline-variant/20">
                            "{appt.notes}"
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between gap-2 mt-3">
                        <span className="text-[11px] text-on-surface-variant font-medium">
                          {new Date(appt.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedAppt(appt)
                            setActiveTab('overview')
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                        >
                          <span>Open Encounter</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STAGE 3: PATIENT RECORDS & HISTORY ──────────────────────────── */}
        {mainNav === 'history' && (
          <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
            <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Patient Records Archive</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                Patient Records & Encounter History
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                Directory of patients rostered under your care with historical token counters and visit history.
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/70 border-b border-outline-variant/30 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4 sm:px-6">Patient</th>
                      <th className="py-3.5 px-4 sm:px-6">Contact / Portal ID</th>
                      <th className="py-3.5 px-4 sm:px-6">Visit Encounters</th>
                      <th className="py-3.5 px-4 sm:px-6">Latest Visit</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {groupedQueue.map((patient) => (
                      <tr key={patient.id} className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                              <User size={15} />
                            </div>
                            <span className="font-bold text-on-surface">{patient.patient_name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-on-surface-variant font-mono text-xs">
                          {patient.patient_email || patient.patient_phone || 'Verified'}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6">
                          <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-xs font-bold font-mono">
                            {patient.total_encounters || 1} consultation(s)
                          </span>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-xs text-on-surface-variant">
                          {new Date(patient.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <button
                            onClick={() => {
                              setSelectedAppt(patient)
                              setActiveTab('history')
                            }}
                            className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-primary hover:text-on-primary text-xs font-bold text-primary transition-all border border-outline-variant/30"
                          >
                            View Clinical History
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── STAGE 4: OPD CLINIC SCHEDULE & HOURS ─────────────────────────── */}
        {mainNav === 'schedule' && (
          <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
            <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Doctor Roster & Availability</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                OPD Consultation Timetable & Roster
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                Active outpatient session schedule, examination cabin allocation, and intake hours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs space-y-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Assigned Examination Cabin</span>
                <h3 className="font-extrabold text-lg text-on-surface">Doctor Consultation Cabin 04</h3>
                <p className="text-xs text-on-surface-variant">OPD Clinical Wing • Ground Floor</p>
              </div>
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs space-y-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">OPD Operational Hours</span>
                <h3 className="font-extrabold text-lg text-on-surface">09:00 AM - 05:00 PM</h3>
                <p className="text-xs text-on-surface-variant">Monday through Saturday (Daily Walk-ins & Appointments)</p>
              </div>
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xs space-y-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Live Queue Integration</span>
                <h3 className="font-extrabold text-lg text-on-surface">Front Desk Linked</h3>
                <p className="text-xs text-on-surface-variant">Walk-in tokens appear in live queue in real-time</p>
              </div>
            </div>
          </div>
        )}
      </>
    ) : (
          /* ── ACTIVE CONSULTATION STAGE ──────────────────────────────────── */
          <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
            {/* Top Navigation & Action Banner */}
            <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setSelectedAppt(null)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors border border-outline-variant/30 shrink-0"
                  title="Return to Queue"
                >
                  <ArrowLeft size={17} />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <h2 className="text-lg sm:text-2xl font-black text-on-surface truncate">{selectedAppt.patient_name}</h2>
                    <span className="px-2 sm:px-2.5 py-0.5 rounded-lg bg-surface-container-high text-primary font-mono font-bold text-xs border border-outline-variant/30 shrink-0">
                      Active Token #{selectedAppt.token_number}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border uppercase tracking-wider shrink-0 ${STATUS_PILLS[selectedAppt.status] || STATUS_PILLS.BOOKED}`}>
                      {selectedAppt.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1.5 truncate">
                    <Calendar size={12} className="text-secondary shrink-0" />
                    Visit Time: {new Date(selectedAppt.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              {/* Complete & Bill Button */}
              <button
                onClick={() => completeMutation.mutate(selectedAppt.id)}
                disabled={isFinishing || completeMutation.isPending}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm disabled:opacity-60 shrink-0"
              >
                {isFinishing ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" /> Finalizing…
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} /> Complete Consultation & Bill
                  </>
                )}
              </button>
            </div>

            {/* Consultation Navigation Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 border-b border-outline-variant/30 pb-2 overflow-x-auto no-scrollbar whitespace-nowrap">
              {[
                { key: 'overview', label: 'Current Telemetry & Vitals', icon: Activity },
                { key: 'prescription', label: 'Rx Prescription & Labs', icon: Pill },
                { key: 'notes', label: 'Clinical Charting & SOAP', icon: FileText },
                { key: 'history', label: `Past Visits & History (${previousVisits.length})`, icon: History },
                { key: 'labs', label: 'Lab Records Viewer', icon: FlaskConical },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === key
                    ? 'bg-primary-container text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                    }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {/* ── TAB 1: CURRENT TELEMETRY & VITALS ─────────────────────────── */}
            {activeTab === 'overview' && (
              <div className="space-y-5 sm:space-y-6 w-full">
                {/* Historical Visits Banner if Patient Visited Before */}
                {previousVisits.length > 0 && (
                  <div className="bg-secondary-container/20 border border-secondary/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm shrink-0">
                        <History size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-on-surface">
                          Returning Patient • {previousVisits.length} Previous Visit(s) On File
                        </h4>
                        <p className="text-xs text-on-surface-variant">
                          Last visit was on {new Date(mostRecentVisitWithRecord?.scheduled_at || mostRecentVisitWithRecord?.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} with Dr. {mostRecentVisitWithRecord?.doctor_name || 'Physician'}.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="px-3.5 py-1.5 bg-surface-container-lowest hover:bg-primary-container hover:text-on-primary text-primary font-bold text-xs rounded-xl border border-outline-variant/30 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                    >
                      <span>Review All {previousVisits.length} Past Visits</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                )}

                {/* Telemetry Readouts with Comparative Vitals */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2.5">
                    Today's Biometric Telemetry Readouts (Live Auto-Save)
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
                    <VitalCard
                      label="Blood Pressure"
                      value={consultation?.vitals?.bp}
                      unit="mmHg"
                      icon={Activity}
                      placeholder="120/80"
                      prevValue={lastVisitWithVitals?.vitals?.bp}
                      onSave={(val) => handleSaveVital('bp', val)}
                    />
                    <VitalCard
                      label="Heart Rate"
                      value={consultation?.vitals?.pulse || consultation?.vitals?.hr}
                      unit="bpm"
                      icon={Heart}
                      placeholder="72"
                      prevValue={lastVisitWithVitals?.vitals?.pulse || lastVisitWithVitals?.vitals?.hr}
                      onSave={(val) => handleSaveVital('pulse', val)}
                    />
                    <VitalCard
                      label="Body Temp"
                      value={consultation?.vitals?.temperature}
                      unit="°F"
                      icon={Thermometer}
                      placeholder="98.6"
                      prevValue={lastVisitWithVitals?.vitals?.temperature}
                      onSave={(val) => handleSaveVital('temperature', val)}
                    />
                    <VitalCard
                      label="Weight / Mass"
                      value={consultation?.vitals?.weight}
                      unit="kg"
                      icon={Weight}
                      placeholder="70"
                      prevValue={lastVisitWithVitals?.vitals?.weight}
                      onSave={(val) => handleSaveVital('weight', val)}
                    />
                  </div>
                </div>

                {/* Longitudinal Medical Background Card right on Overview */}
                {previousVisits.length > 0 && (
                  <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-secondary-container/40 text-secondary flex items-center justify-center shrink-0">
                          <History size={16} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-on-surface">
                            Last Encounter Clinical Record ({new Date(mostRecentVisitWithRecord?.scheduled_at || mostRecentVisitWithRecord?.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })})
                          </h4>
                          <p className="text-xs text-on-surface-variant">
                            Physician: <strong className="text-on-surface">Dr. {mostRecentVisitWithRecord?.doctor_name || 'Physician'}</strong> • Daily Token: <strong className="font-mono text-primary">#{mostRecentVisitWithRecord?.token_number || '--'}</strong>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('history')}
                        className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-primary-container hover:text-on-primary text-xs font-bold text-primary transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                      >
                        <span>Full Historical Timeline</span>
                        <ArrowUpRight size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      {/* Previous Diagnosis */}
                      <div className="bg-surface-container-low/40 p-3.5 rounded-xl border border-outline-variant/20">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                          Previous Diagnosis
                        </span>
                        <p className="font-bold text-primary text-sm">
                          {mostRecentVisitWithRecord?.diagnosis || 'Routine Checkup / Follow-up'}
                        </p>
                      </div>

                      {/* Previous Prescription */}
                      <div className="bg-surface-container-low/40 p-3.5 rounded-xl border border-outline-variant/20 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1 flex items-center gap-1">
                            <Pill size={12} className="text-primary" /> Last Prescribed Rx
                          </span>
                          <p className="font-mono text-on-surface line-clamp-2">
                            {formatRx(mostRecentVisitWithRecord?.prescription) || 'No medicines recorded'}
                          </p>
                        </div>
                        {formatRx(mostRecentVisitWithRecord?.prescription) && (
                          <button
                            type="button"
                            onClick={() => handleCopyPreviousRx(mostRecentVisitWithRecord?.prescription)}
                            className="mt-2 text-left text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            <Copy size={11} /> Copy into Today's Prescription
                          </button>
                        )}
                      </div>

                      {/* Previous Notes or Labs */}
                      <div className="bg-surface-container-low/40 p-3.5 rounded-xl border border-outline-variant/20">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1 flex items-center gap-1">
                          <FileText size={12} className="text-secondary" /> Clinical Notes & Labs
                        </span>
                        <p className="text-on-surface line-clamp-2">
                          {mostRecentVisitWithRecord?.notes || 'No progress notes logged'}
                        </p>
                        {mostRecentVisitWithRecord?.lab_ordered && (
                          <span className="inline-block mt-2 px-2 py-0.5 rounded bg-secondary-container/40 text-secondary text-[10px] font-bold">
                            Lab Ordered: {mostRecentVisitWithRecord?.lab_test_details || 'Pending'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Patient Summary Card */}
                <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs w-full">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-1.5">
                    <User size={14} className="text-primary" /> Today's Encounter Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-[11px] text-on-surface-variant block font-medium">Patient Name</span>
                      <span className="font-bold text-on-surface text-sm sm:text-base">{selectedAppt.patient_name}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-on-surface-variant block font-medium">Encounter Queue State</span>
                      <span className="font-bold text-primary text-sm sm:text-base uppercase">{selectedAppt.status.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-on-surface-variant block font-medium">Active Token</span>
                      <span className="font-bold font-mono text-on-surface text-sm sm:text-base">#{selectedAppt.token_number}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: PRESCRIPTION & LAB ORDER ───────────────────────────── */}
            {activeTab === 'prescription' && (
              <div className="space-y-5 sm:space-y-6 w-full">
                {/* Previous Prescription Helper Card */}
                {previousVisits.length > 0 && formatRx(mostRecentVisitWithRecord?.prescription) && (
                  <div className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-on-surface">
                          Previous Prescription (from {new Date(mostRecentVisitWithRecord.scheduled_at || mostRecentVisitWithRecord.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}):
                        </span>
                        {mostRecentVisitWithRecord.diagnosis && (
                          <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary text-[10px] font-semibold">
                            {mostRecentVisitWithRecord.diagnosis}
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-secondary max-w-xl whitespace-pre-wrap">
                        {formatRx(mostRecentVisitWithRecord.prescription)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyPreviousRx(mostRecentVisitWithRecord.prescription)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-bold text-xs shadow-xs hover:bg-primary transition-all shrink-0 self-start sm:self-auto"
                    >
                      <Copy size={13} /> Copy to Today's Rx
                    </button>
                  </div>
                )}

                {/* Prescription Box */}
                <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-3 w-full">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                        <Pill size={16} className="text-primary" /> Today's Pharmaceutical Prescription
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Document current dosage, frequency (e.g. 500mg BID x 5 days), and updated administration instructions.
                      </p>
                    </div>
                  </div>
                  <textarea
                    value={rxInput || ''}
                    onChange={(e) => setRxInput(e.target.value)}
                    onBlur={(e) => {
                      if (consultation?.id && e.target.value !== (formatRx(consultation?.prescription) || '')) {
                        updateConsultation({ prescription: e.target.value }, "Prescription saved for today's visit")
                      }
                    }}
                    rows={7}
                    placeholder="e.g.&#10;1. Amoxicillin 500mg — 1 capsule every 8 hours for 7 days&#10;2. Paracetamol 650mg — 1 tablet PRN for temperature > 100°F"
                    className="w-full bg-surface-container-low/50 border border-outline-variant/50 rounded-xl p-3.5 text-xs sm:text-sm font-mono text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all resize-y"
                  />
                </div>

                {/* Diagnostics Lab Orders */}
                <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-3 w-full">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                        <FlaskConical size={16} className="text-secondary" /> Diagnostic Orders & Pathology
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Flag if today's encounter requires outbound laboratory or radiological workup.
                      </p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/40 hover:border-primary transition-colors shrink-0">
                      <input
                        type="checkbox"
                        defaultChecked={consultation?.lab_ordered}
                        onChange={(e) => updateConsultation({ lab_ordered: e.target.checked }, 'Lab order state saved')}
                        className="w-4 h-4 rounded accent-primary cursor-pointer"
                      />
                      <span className="text-xs font-bold text-on-surface">Lab Required</span>
                    </label>
                  </div>

                  {consultation?.lab_ordered && (
                    <div className="animate-fade-in pt-2">
                      <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                        Required Tests / Investigation Panels
                      </label>
                      <input
                        type="text"
                        defaultValue={consultation?.lab_test_details || ''}
                        placeholder="e.g. Complete Blood Count (CBC), Fasting Blood Sugar, Chest X-Ray (PA)"
                        onBlur={(e) => {
                          if (e.target.value !== (consultation?.lab_test_details || '')) {
                            updateConsultation({ lab_test_details: e.target.value }, 'Lab investigation details saved')
                          }
                        }}
                        className="w-full bg-surface-container-low/50 border border-outline-variant/50 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 3: CLINICAL CHARTING & NOTES ──────────────────────────── */}
            {activeTab === 'notes' && (
              <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4 w-full">
                {previousVisits.length > 0 && mostRecentVisitWithRecord?.diagnosis && (
                  <div className="bg-surface-container-low/50 border border-outline-variant/20 rounded-xl p-3 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-on-surface-variant font-medium">Previous Diagnosis: </span>
                      <strong className="text-primary font-bold">{mostRecentVisitWithRecord.diagnosis}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateConsultation({ diagnosis: mostRecentVisitWithRecord.diagnosis }, 'Reused previous diagnosis')}
                      className="text-primary font-bold hover:underline text-[11px]"
                    >
                      Reuse as Today's Diagnosis
                    </button>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    Primary Clinical Diagnosis (ICD-10 / System Classification)
                  </label>
                  <input
                    type="text"
                    defaultValue={consultation?.diagnosis || ''}
                    placeholder="e.g. Essential Hypertension (I10), Acute Sinusitis (J01)"
                    onBlur={(e) => {
                      if (e.target.value !== (consultation?.diagnosis || '')) {
                        updateConsultation({ diagnosis: e.target.value }, 'Diagnosis saved')
                      }
                    }}
                    className="w-full bg-surface-container-low/50 border border-outline-variant/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    Consultation Progress Notes & Findings (SOAP Format)
                  </label>
                  <textarea
                    defaultValue={consultation?.notes || ''}
                    onBlur={(e) => {
                      if (e.target.value !== (consultation?.notes || '')) {
                        updateConsultation({ notes: e.target.value }, 'Consultation notes saved')
                      }
                    }}
                    rows={9}
                    placeholder="Subjective complaints, objective physical examination, assessment and clinical plan…"
                    className="w-full bg-surface-container-low/50 border border-outline-variant/50 rounded-xl p-3.5 text-xs sm:text-sm text-on-surface leading-relaxed focus:outline-none focus:border-primary resize-y"
                  />
                </div>
              </div>
            )}

            {/* ── TAB 4: PAST VISITS & MEDICAL HISTORY TIMELINE ──────────────── */}
            {activeTab === 'history' && (
              <div className="space-y-4 w-full">
                <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                        <History size={18} className="text-primary" />
                        Patient Longitudinal Medical History
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Chronological record of every previous visit date, token, past doctor findings, and previous prescriptions.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-xs font-bold font-mono">
                      {previousVisits.length} Historical Visits
                    </span>
                  </div>

                  {loadingHistory ? (
                    <div className="p-12 text-center text-on-surface-variant text-sm flex items-center justify-center gap-2">
                      <RefreshCw size={18} className="animate-spin text-primary" />
                      Loading past medical records…
                    </div>
                  ) : previousVisits.length === 0 ? (
                    <div className="p-8 text-center bg-surface-container-low/30 rounded-xl border border-dashed border-outline-variant/40">
                      <History size={32} className="mx-auto mb-2 text-on-surface-variant/40" />
                      <p className="text-sm font-bold text-on-surface">First Visit For This Patient</p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        No previous visits recorded in the system. Today's diagnosis and prescription will be saved as the first medical record.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2">
                      {previousVisits.map((visit, idx) => {
                        const visitRx = formatRx(visit.prescription)
                        return (
                          <div
                            key={visit.id || visit.appointment}
                            className="bg-surface-container-low/40 border border-outline-variant/30 rounded-xl p-4 sm:p-5 space-y-3 relative overflow-hidden"
                          >
                            {/* Visit Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-3">
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-surface-container-high text-primary font-bold text-xs flex items-center justify-center font-mono shrink-0">
                                  #{previousVisits.length - idx}
                                </span>
                                <div>
                                  <h4 className="font-bold text-on-surface text-sm">
                                    {new Date(visit.scheduled_at || visit.created_at).toLocaleDateString([], {
                                      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                                    })} at {new Date(visit.scheduled_at || visit.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </h4>
                                  <p className="text-xs text-on-surface-variant">
                                    Physician: <strong className="text-on-surface">Dr. {visit.doctor_name || 'Medical Officer'}</strong> • Daily Token: <strong className="font-mono text-primary">#{visit.token_number || '--'}</strong>
                                  </p>
                                </div>
                              </div>

                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase shrink-0 self-start sm:self-auto ${STATUS_PILLS[visit.appointment_status] || STATUS_PILLS.COMPLETED}`}>
                                {visit.appointment_status ? visit.appointment_status.replace('_', ' ') : 'COMPLETED'}
                              </span>
                            </div>

                            {/* Historical Vitals on that Date */}
                            {visit.vitals && Object.keys(visit.vitals).length > 0 ? (
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                                  Vitals Recorded On That Visit
                                </span>
                                <div className="flex items-center gap-4 flex-wrap text-xs bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/20 font-mono">
                                  {Object.entries(visit.vitals).map(([k, v]) => (
                                    <span key={k}>
                                      <strong className="uppercase text-on-surface-variant">{k}:</strong> <span className="font-bold text-on-surface">{v}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-[11px] text-on-surface-variant/70 italic">
                                No telemetry / vitals recorded on this visit.
                              </div>
                            )}

                            {/* Historical Diagnosis */}
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-0.5">
                                Diagnosis Given
                              </span>
                              <p className="text-xs font-bold text-primary">
                                {visit.diagnosis || 'Routine Checkup / Follow-up'}
                              </p>
                            </div>

                            {/* Historical Prescription on that Date */}
                            {visitRx ? (
                              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                                    <Pill size={12} className="text-primary" /> Medicines Prescribed On That Visit:
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyPreviousRx(visit.prescription)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary-container/50 hover:bg-secondary-container text-on-secondary-container font-bold text-[11px] transition-colors"
                                  >
                                    <Copy size={12} /> Copy to Today's Rx
                                  </button>
                                </div>
                                <p className="text-xs font-mono text-on-surface whitespace-pre-wrap leading-relaxed">
                                  {visitRx}
                                </p>
                              </div>
                            ) : (
                              <div className="text-[11px] text-on-surface-variant/70 italic">
                                No medications prescribed on this visit.
                              </div>
                            )}

                            {/* Historical Doctor Notes */}
                            {visit.notes && (
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-0.5">
                                  Doctor Notes From That Visit:
                                </span>
                                <p className="text-xs text-on-surface-variant whitespace-pre-wrap leading-relaxed bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/20">
                                  {visit.notes}
                                </p>
                              </div>
                            )}

                            {/* Historical Lab Orders */}
                            {visit.lab_ordered && (
                              <div className="flex items-center gap-2 text-xs text-secondary font-medium bg-secondary-container/20 p-2.5 rounded-lg border border-secondary/20">
                                <FlaskConical size={14} className="shrink-0" />
                                <span>Diagnostic Test Ordered: <strong>{visit.lab_test_details || 'Pathology Panel'}</strong></span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 5: LAB REPORTS VIEWER ─────────────────────────────────── */}
            {activeTab === 'labs' && (
              <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4 w-full">
                <div>
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Historical Diagnostic Artifacts</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">Access digital test results uploaded by the laboratory or patient.</p>
                </div>
                <PatientLabsViewer patientId={selectedAppt.appointment?.patient || selectedAppt.patient} />
              </div>
            )}
          </div>
        )}
      </main>
      </div>
    </div>
  )
}
