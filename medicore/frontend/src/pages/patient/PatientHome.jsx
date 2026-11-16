import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'
import {
  Calendar, FileText, LogOut, Activity, CreditCard, Clock,
  Bell, ChevronRight, X, Plus, UploadCloud, Printer, CheckCircle,
  AlertCircle, Stethoscope, User, Pill, ExternalLink, RefreshCw,
  Building2, MapPin, Phone, ArrowLeft, Check, Search, CalendarDays,
  LayoutDashboard, Menu, Sparkles, HeartPulse, ShieldCheck, TrendingUp
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import toast from 'react-hot-toast'

const STATUS_PILLS = {
  BOOKED: 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]',
  CHECK_IN: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
  IN_PROGRESS: 'bg-[#CCFBF1] text-[#0F766E] border-[#5EEAD4]',
  COMPLETED: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
  CANCELLED: 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]',
}

// ── Consultation Details Modal ───────────────────────────────────────────────
function PatientConsultationModal({ appointment, onClose, onLabUploaded }) {
  const { data: consultation, isLoading } = useQuery({
    queryKey: ['consultation', appointment.id],
    queryFn: () => api.get(`/api/doctor/consultations/for_appointment/?appointment=${appointment.id}`).then(r => r.data),
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-on-surface/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-outline-variant/30">
        {/* Header */}
        <div className="bg-surface-container-low px-5 sm:px-6 py-4 flex items-center justify-between border-b border-outline-variant/30 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Encounter Summary</span>
            <h2 className="font-extrabold text-on-surface text-base sm:text-lg">Dr. {appointment.doctor_name}</h2>
            <p className="text-xs text-on-surface-variant">
              {new Date(appointment.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at{' '}
              {new Date(appointment.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-5 bg-background">
          {isLoading ? (
            <div className="text-center py-10 text-on-surface-variant text-sm flex items-center justify-center gap-2">
              <RefreshCw size={18} className="animate-spin text-primary" />
              Loading clinical records…
            </div>
          ) : (
            <>
              {/* Telemetry Vitals */}
              {consultation?.vitals && Object.keys(consultation.vitals).length > 0 && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 sm:p-5 shadow-xs">
                  <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Activity size={14} className="text-primary" /> Recorded Vitals
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    {Object.entries(consultation.vitals).map(([key, value]) => (
                      <div key={key} className="bg-surface-container-low/60 rounded-lg p-2.5">
                        <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">{key}</p>
                        <p className="font-black text-on-surface text-sm sm:text-base font-mono mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prescription */}
              {consultation?.prescription && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 sm:p-5 shadow-xs">
                  <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Pill size={14} className="text-primary" /> Prescribed Medications
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-on-surface whitespace-pre-wrap bg-surface-container-low/40 p-3.5 rounded-lg border border-outline-variant/20">
                    {typeof consultation.prescription === 'string' ? consultation.prescription : JSON.stringify(consultation.prescription, null, 2)}
                  </p>
                </div>
              )}

              {/* Clinical Notes / Diagnosis */}
              {(consultation?.diagnosis || consultation?.notes) && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 sm:p-5 shadow-xs space-y-3">
                  {consultation?.diagnosis && (
                    <div>
                      <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Diagnosis</h3>
                      <p className="text-xs sm:text-sm font-bold text-primary">{consultation.diagnosis}</p>
                    </div>
                  )}
                  {consultation?.notes && (
                    <div>
                      <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Doctor Advice / Notes</h3>
                      <p className="text-xs sm:text-sm text-on-surface whitespace-pre-wrap leading-relaxed">{consultation.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Lab Request Notice */}
              {consultation?.lab_ordered && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 sm:p-5 relative overflow-hidden">
                  <h3 className="text-sm font-bold text-primary mb-1">Laboratory Investigation Requested</h3>
                  <p className="text-xs text-on-surface-variant mb-3">
                    Tests ordered: <span className="font-bold text-on-surface">{consultation.lab_test_details || 'Routine Diagnostic Workup'}</span>
                  </p>
                  <label className="inline-flex items-center gap-2 bg-primary-container hover:bg-primary text-on-primary font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors shadow-sm">
                    <UploadCloud size={15} /> Upload Lab Report File
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (!file) return
                        const formData = new FormData()
                        formData.append('report_file', file)
                        formData.append('file_name', `Result: ${consultation.lab_test_details || file.name}`)

                        toast.promise(
                          api.post('/api/labs/reports/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
                          {
                            loading: 'Uploading report to clinical record…',
                            success: () => {
                              onLabUploaded()
                              return 'Report attached successfully!'
                            },
                            error: 'Failed to upload report.'
                          }
                        )
                      }}
                    />
                  </label>
                </div>
              )}

              {!consultation?.vitals && !consultation?.prescription && !consultation?.notes && !consultation?.lab_ordered && (
                <p className="text-center text-on-surface-variant text-sm font-medium py-8 border border-dashed border-outline-variant/40 rounded-xl">
                  Encounter details have not been entered yet.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Digital Token Receipt Modal ──────────────────────────────────────────────
function TokenReceiptModal({ appointment, user, onClose }) {
  if (!appointment) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-on-surface/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col border border-outline-variant/30 max-h-[92vh]">
        <div className="bg-surface-container-low p-4 sm:p-5 text-center relative border-b border-outline-variant/30 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X size={18} />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary block">Official Clinic Token</span>
          <h2 className="text-on-surface font-extrabold text-base sm:text-lg tracking-tight mt-0.5 truncate">
            {appointment.clinic_name || 'Medicore Healthcare'}
          </h2>
        </div>

        <div className="p-5 sm:p-6 text-center bg-secondary-container/15 border-b border-outline-variant/20 shrink-0">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Queue Token Number</p>
          <h1 className="text-5xl sm:text-6xl font-black text-primary font-mono tracking-tight">
            #{appointment.token_number ? String(appointment.token_number).padStart(2, '0') : '--'}
          </h1>
          <p className="text-xs text-secondary font-semibold mt-1">
            {appointment.queue_position === 0 ? 'Next in line for doctor!' : `${appointment.queue_position || 1} ahead in line`}
          </p>
        </div>

        <div className="p-4 sm:p-5 space-y-2.5 text-xs overflow-y-auto flex-1">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
            <span className="text-on-surface-variant font-medium">Patient</span>
            <span className="font-bold text-on-surface">{appointment.patient_name || user?.name}</span>
          </div>
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
            <span className="text-on-surface-variant font-medium">Doctor</span>
            <span className="font-bold text-on-surface">Dr. {appointment.doctor_name}</span>
          </div>
          {appointment.doctor_specialty && (
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
              <span className="text-on-surface-variant font-medium">Specialty</span>
              <span className="font-medium text-on-surface">{appointment.doctor_specialty}</span>
            </div>
          )}
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
            <span className="text-on-surface-variant font-medium">Appointment Date</span>
            <span className="font-bold font-mono text-on-surface">
              {new Date(appointment.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
            <span className="text-on-surface-variant font-medium">Scheduled Time</span>
            <span className="font-bold font-mono text-on-surface">
              {new Date(appointment.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant font-medium">Clinical State</span>
            <span className="font-bold uppercase text-primary">{(appointment.status || '').replace('_', ' ')}</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 pt-0 text-center shrink-0">
          <button
            onClick={() => window.print()}
            className="w-full inline-flex items-center justify-center gap-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-bold text-xs py-2.5 rounded-xl border border-outline-variant/40 transition-colors"
          >
            <Printer size={15} /> Print / Save Pass
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Discovery Booking Modal (Tareeqa A: Central Patient Discovery Portal) ─────
function DiscoveryBookingModal({ isOpen, onClose, onBooked, user }) {
  const [step, setStep] = useState(1) // 1: Select Clinic | 2: Select Doctor | 3: Select Date & Confirm
  const [clinicSearch, setClinicSearch] = useState('')
  const [selectedClinic, setSelectedClinic] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [scheduledAt, setScheduledAt] = useState('')
  const [notes, setNotes] = useState('')
  const qc = useQueryClient()

  // 1. Fetch Clinics Directory
  const { data: rawClinics = [], isLoading: loadingClinics } = useQuery({
    queryKey: ['clinic-directory'],
    queryFn: () => api.get('/api/clinic/directory/').then(r => Array.isArray(r.data) ? r.data : []).catch(() => []),
    enabled: isOpen,
  })
  const clinics = Array.isArray(rawClinics) ? rawClinics : []

  // 2. Fetch Doctors for Selected Clinic
  const { data: rawDoctors = [], isLoading: loadingDoctors } = useQuery({
    queryKey: ['clinic-doctors-discovery', selectedClinic?.id],
    queryFn: () => api.get(`/api/clinic/doctors/?clinic_id=${selectedClinic?.id}`).then(r => Array.isArray(r.data) ? r.data : []).catch(() => []),
    enabled: !!selectedClinic?.id,
  })
  const doctors = Array.isArray(rawDoctors) ? rawDoctors : []

  const bookMutation = useMutation({
    mutationFn: (payload) => api.post('/api/patient/appointments/', payload),
    onSuccess: (res) => {
      qc.invalidateQueries(['patient-appointments'])
      toast.success(`Token #${res.data?.token_number || ''} reserved successfully!`)
      onClose()
      onBooked(res.data)
      setStep(1)
      setSelectedClinic(null)
      setSelectedDoctor(null)
      setScheduledAt('')
      setNotes('')
    },
    onError: (err) => {
      const msg = err.response?.data
        ? Object.values(err.response.data).flat().join(' ')
        : 'Failed to book appointment. Please try again.'
      toast.error(msg)
    }
  })

  if (!isOpen) return null

  const filteredClinics = clinics.filter(c => {
    const q = clinicSearch.toLowerCase()
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.city || '').toLowerCase().includes(q) ||
      (c.address || '').toLowerCase().includes(q)
    )
  })

  const handleConfirm = (e) => {
    e.preventDefault()
    if (!selectedClinic || !selectedDoctor || !scheduledAt) {
      return toast.error('Please complete all booking steps.')
    }
    bookMutation.mutate({
      clinic: selectedClinic.id,
      doctor: selectedDoctor.id,
      patient: user.id,
      scheduled_at: new Date(scheduledAt).toISOString(),
      notes: notes.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-on-surface/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-xl shadow-2xl border border-outline-variant/30 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Header with Stepper */}
        <div className="bg-surface-container-low px-5 sm:px-6 py-4 border-b border-outline-variant/30 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Care Discovery & Booking</span>
              <h2 className="text-base sm:text-lg font-bold text-on-surface">Book Doctor Consultation</h2>
            </div>
            <button
              onClick={() => {
                onClose()
                setStep(1)
                setSelectedClinic(null)
                setSelectedDoctor(null)
              }}
              className="w-8 h-8 rounded-full bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Stepper progress */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${step === 1 ? 'bg-primary-container text-on-primary font-bold shadow-xs' : selectedClinic ? 'bg-secondary-container/40 text-on-surface font-semibold' : 'bg-surface-container-lowest text-on-surface-variant'}`}>
              <Building2 size={14} />
              <span className="truncate">1. Clinic</span>
            </div>
            <div className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${step === 2 ? 'bg-primary-container text-on-primary font-bold shadow-xs' : selectedDoctor ? 'bg-secondary-container/40 text-on-surface font-semibold' : 'bg-surface-container-lowest text-on-surface-variant'}`}>
              <Stethoscope size={14} />
              <span className="truncate">2. Doctor</span>
            </div>
            <div className={`p-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${step === 3 ? 'bg-primary-container text-on-primary font-bold shadow-xs' : 'bg-surface-container-lowest text-on-surface-variant'}`}>
              <CalendarDays size={14} />
              <span className="truncate">3. Confirm</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* STEP 1: Select Clinic */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-3.5 text-on-surface-variant pointer-events-none" />
                <input
                  type="text"
                  value={clinicSearch}
                  onChange={(e) => setClinicSearch(e.target.value)}
                  placeholder="Search clinics by name, city, or address..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:border-primary focus:outline-none"
                />
              </div>

              {loadingClinics ? (
                <div className="p-8 text-center text-xs text-on-surface-variant flex items-center justify-center gap-2">
                  <RefreshCw size={16} className="animate-spin text-primary" /> Loading healthcare clinics...
                </div>
              ) : filteredClinics.length === 0 ? (
                <div className="p-8 text-center text-xs text-on-surface-variant border border-dashed border-outline-variant/40 rounded-xl">
                  No clinic found matching "{clinicSearch}".
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {filteredClinics.map((clinic) => (
                    <div
                      key={clinic.id}
                      onClick={() => {
                        setSelectedClinic(clinic)
                        setSelectedDoctor(null)
                        setStep(2)
                      }}
                      className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest hover:border-primary hover:bg-surface-container-low cursor-pointer transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-secondary-container/40 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Building2 size={20} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                            {clinic.name}
                          </h4>
                          <p className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5 truncate">
                            <MapPin size={11} className="text-secondary shrink-0" />
                            {clinic.address || clinic.city || 'Central Campus'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant block">
                          {clinic.total_doctors || 0} Doctors
                        </span>
                        <span className="text-[10px] text-primary font-bold mt-1 inline-flex items-center gap-0.5">
                          Select <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Select Doctor */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Selected Clinic</span>
                  <p className="text-xs font-bold text-primary truncate flex items-center gap-1.5 mt-0.5">
                    <Building2 size={14} /> {selectedClinic?.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-secondary hover:underline shrink-0"
                >
                  Change Clinic
                </button>
              </div>

              <p className="text-xs font-semibold text-on-surface-variant">Available Attending Specialists:</p>

              {loadingDoctors ? (
                <div className="p-8 text-center text-xs text-on-surface-variant flex items-center justify-center gap-2">
                  <RefreshCw size={16} className="animate-spin text-primary" /> Loading physicians...
                </div>
              ) : doctors.length === 0 ? (
                <div className="p-8 text-center text-xs text-on-surface-variant border border-dashed border-outline-variant/40 rounded-xl">
                  No active doctors available at {selectedClinic?.name}. Please select another clinic.
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="block mx-auto mt-2 text-primary font-bold underline"
                  >
                    Back to Clinic Directory
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {doctors.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setSelectedDoctor(doc)
                        setStep(3)
                      }}
                      className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest hover:border-primary hover:bg-surface-container-low cursor-pointer transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform font-bold text-sm">
                          <Stethoscope size={20} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                            Dr. {doc.user_name || doc.name}
                          </h4>
                          <p className="text-[11px] text-secondary font-semibold mt-0.5">
                            {doc.specialty || 'General Practitioner'}
                          </p>
                          {doc.schedule?.start_time && (
                            <p className="text-[10px] text-on-surface-variant mt-0.5 font-mono">
                              Hours: {doc.schedule.start_time} - {doc.schedule.end_time || 'Close'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-on-surface block">
                          ${Number(doc.consultation_fee || 0).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-primary font-bold mt-1 inline-flex items-center gap-0.5">
                          Select <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Select Date & Confirm */}
          {step === 3 && (
            <form onSubmit={handleConfirm} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Hospital / Clinic:</span>
                  <span className="font-bold text-on-surface truncate max-w-[200px]">{selectedClinic?.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Attending Doctor:</span>
                  <span className="font-bold text-primary">Dr. {selectedDoctor?.user_name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Specialty & Fee:</span>
                  <span className="font-semibold text-on-surface">
                    {selectedDoctor?.specialty} · ${Number(selectedDoctor?.consultation_fee || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Appointment Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Chief Complaint / Reason for Visit (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Eye redness, routine checkup, fever..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 border border-outline-variant/40 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={bookMutation.isPending}
                  className="flex-1 py-2.5 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-xl text-xs transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {bookMutation.isPending ? 'Allocating Token…' : 'Confirm & Reserve Daily Token'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Patient Home Component ──────────────────────────────────────────────
export default function PatientHome() {
  const { user, logout } = useAuthStore()
  const queryClient = useQueryClient()
  const [activeNav, setActiveNav] = useState('overview') // 'overview' | 'appointments' | 'history' | 'labs' | 'billing'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [receiptAppt, setReceiptAppt] = useState(null)
  const [selectedAppt, setSelectedAppt] = useState(null)

  // 1. Fetch Patient Appointments
  const { data: appointments = [], isLoading: loadingAppts, refetch: refetchAppts } = useQuery({
    queryKey: ['patient-appointments'],
    queryFn: () => api.get('/api/patient/appointments/').then(r => Array.isArray(r.data) ? r.data : []).catch(() => []),
  })

  // 2. Lab Reports
  const { data: rawLabs = [] } = useQuery({
    queryKey: ['patient-labs'],
    queryFn: () => api.get('/api/labs/reports/').then(r => Array.isArray(r.data) ? r.data : []).catch(() => []),
  })
  const labs = Array.isArray(rawLabs) ? rawLabs : []

  // 3. Invoices
  const { data: rawInvoices = [] } = useQuery({
    queryKey: ['patient-invoices'],
    queryFn: () => api.get('/api/invoices/invoices/').then(r => Array.isArray(r.data) ? r.data : []).catch(() => []),
  })
  const invoices = Array.isArray(rawInvoices) ? rawInvoices : []

  const apptList = Array.isArray(appointments) ? appointments : []
  const upcoming = apptList.filter(a => !['COMPLETED', 'CANCELLED'].includes(a.status))
  const completed = apptList.filter(a => a.status === 'COMPLETED')

  const totalBills = invoices.length
    ? invoices.reduce((acc, inv) => acc + (Number(inv?.amount) || 0), 0).toFixed(2)
    : '0.00'

  // Telemetry Chart Data for Health Overview
  const visitTrendData = useMemo(() => {
    const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
    const totalEncounters = apptList.length
    return months.map((m, idx) => ({
      month: m,
      visits: totalEncounters > 0 ? (idx === 4 ? completed.length : idx === 5 ? upcoming.length : Math.max(0, idx % 2)) : 0,
      vitals: 95 + (idx % 4)
    }))
  }, [apptList, completed, upcoming])

  const portfolioData = useMemo(() => {
    return [
      { name: 'Active Visits', value: Math.max(upcoming.length, 1), color: '#006A60' },
      { name: 'Completed Visits', value: Math.max(completed.length, 1), color: '#047857' },
      { name: 'Diagnostic Labs', value: Math.max(labs.length, 1), color: '#0EA5E9' },
      { name: 'Invoices', value: Math.max(invoices.length, 1), color: '#F59E0B' },
    ]
  }, [upcoming, completed, labs, invoices])

  return (
    <div className="min-h-screen w-full max-w-full bg-background text-on-surface font-sans flex antialiased overflow-x-hidden">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* VERTICAL SIDEBAR NAVIGATION (Consistent with Admin/Doctor/Reception)*/}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 max-w-[85vw] bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Pinned Top Brand Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-surface-container-high/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
              <Activity size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-on-surface">MediCore</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary-container/15 text-primary">
                  Patient
                </span>
              </div>
              <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Clinical Enterprise</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3.5 space-y-4">
          {/* Patient Context Card */}
          <div className="p-3.5 bg-surface-container-low/70 rounded-2xl border border-outline-variant/20 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1">
                <HeartPulse size={12} /> Patient Portal
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                Active
              </span>
            </div>
            <p className="font-bold text-xs text-on-surface truncate">{user?.name || 'Patient User'}</p>
            <p className="text-[11px] text-on-surface-variant">
              {upcoming.length} active consultation{upcoming.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
              Care & Services
            </span>
            <nav className="space-y-1">
              <button
                onClick={() => { setActiveNav('overview'); setMobileMenuOpen(false) }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                  activeNav === 'overview'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard size={17} />
                  <span>Health Overview</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveNav('appointments'); setMobileMenuOpen(false) }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                  activeNav === 'appointments'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar size={17} />
                  <span>My Appointments</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeNav === 'appointments' ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'
                }`}>
                  {upcoming.length} Live
                </span>
              </button>

              <button
                onClick={() => { setActiveNav('history'); setMobileMenuOpen(false) }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                  activeNav === 'history'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText size={17} />
                  <span>Visit History</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeNav === 'history' ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'
                }`}>
                  {completed.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveNav('labs'); setMobileMenuOpen(false) }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                  activeNav === 'labs'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity size={17} />
                  <span>Diagnostic Reports</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeNav === 'labs' ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'
                }`}>
                  {labs.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveNav('billing'); setMobileMenuOpen(false) }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                  activeNav === 'billing'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard size={17} />
                  <span>Billing & Invoices</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeNav === 'billing' ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'
                }`}>
                  {invoices.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="pt-2">
            <span className="px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
              Appointments
            </span>
            <button
              onClick={() => {
                setIsBookingModalOpen(true)
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-primary-container hover:bg-primary text-on-primary font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Book New Visit</span>
            </button>
          </div>
        </div>

        {/* User Session Footer (Pinned at bottom, always visible) */}
        <div className="p-4 border-t border-surface-container-high/40 bg-surface-container-low/50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                {(user?.name || 'P').charAt(0)}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-on-surface truncate block">{user?.name || 'Patient'}</span>
                <span className="text-[10px] text-on-surface-variant">Patient Access</span>
              </div>
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

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* OPERATIONAL STAGE                                                   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        {/* Pinned Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 w-full shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base lg:text-lg tracking-tight text-on-surface truncate">
                  {activeNav === 'overview' && 'Health Overview & Telemetry'}
                  {activeNav === 'appointments' && 'My Active & Upcoming Appointments'}
                  {activeNav === 'history' && 'Past Consultations & Encounters'}
                  {activeNav === 'labs' && 'Diagnostic Reports & Laboratory Records'}
                  {activeNav === 'billing' && 'Billing Ledger & Statements'}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  <ShieldCheck size={11} /> Verified Care
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant truncate">
                MediCore Clinical Enterprise • Patient Self-Care Workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => {
                refetchAppts()
                queryClient.invalidateQueries(['patient-labs'])
                queryClient.invalidateQueries(['patient-invoices'])
                toast.success('Patient records refreshed')
              }}
              className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
              title="Refresh Records"
            >
              <RefreshCw size={16} className={loadingAppts ? 'animate-spin text-primary' : ''} />
            </button>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-xl text-xs transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Book New Visit</span>
              <span className="sm:hidden">Book</span>
            </button>
          </div>
        </header>

        {/* Dynamic Main Views */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto animate-fade-in overflow-x-hidden">
          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* TAB 1: HEALTH OVERVIEW & TELEMETRY                                */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeNav === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">Patient Portal</span>
                  <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight mt-0.5">
                    Welcome back, {user?.name || 'Patient'}
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                    Review your upcoming clinical consultations, laboratory results, and medical invoices.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-xl text-xs transition-all shadow-sm shrink-0 cursor-pointer"
                  >
                    <Plus size={16} /> Book New Visit
                  </button>
                </div>
              </div>

              {/* Bento Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
                {/* Next Visit */}
                <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-xs min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant truncate">Next Visit</span>
                    <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                      <Calendar size={16} />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-on-surface font-mono mt-1">
                    {upcoming.length > 0
                      ? new Date(upcoming[0].scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
                      : 'None'}
                  </p>
                  <p className="text-xs text-secondary mt-1 font-medium truncate">
                    {upcoming.length > 0 ? `With Dr. ${upcoming[0].doctor_name}` : 'No upcoming visits'}
                  </p>
                </div>

                {/* Active Queue Visits */}
                <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-xs min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant truncate">Active Queue</span>
                    <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
                      <Clock size={16} />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-on-surface font-mono mt-1">{upcoming.length}</p>
                  <p className="text-xs text-on-surface-variant mt-1 font-medium truncate">Scheduled consultations</p>
                </div>

                {/* Lab Records */}
                <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-xs min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant truncate">Diagnostic Labs</span>
                    <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                      <Activity size={16} />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-on-surface font-mono mt-1">{labs.length}</p>
                  <p className="text-xs text-on-surface-variant mt-1 font-medium truncate">Archived test reports</p>
                </div>

                {/* Total Bills */}
                <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-xs min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant truncate">Billing Ledger</span>
                    <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
                      <CreditCard size={16} />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-on-surface font-mono mt-1">${totalBills}</p>
                  <p className="text-xs text-on-surface-variant mt-1 font-medium truncate">{invoices.length} invoices generated</p>
                </div>
              </div>

              {/* Telemetry Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
                {/* 6-Month Care Trajectory AreaChart */}
                <div className="lg:col-span-2 bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-on-surface flex items-center gap-2">
                        <TrendingUp size={16} className="text-primary" /> Care Trajectory & Consultations
                      </h3>
                      <p className="text-xs text-on-surface-variant">Monthly encounter activity and wellness trends</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      6-Month Trend
                    </span>
                  </div>

                  <div className="h-56 sm:h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={visitTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="patientColorVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#006A60" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#006A60" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="visits" stroke="#006A60" strokeWidth={2.5} fillOpacity={1} fill="url(#patientColorVisits)" name="Visits" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Health Portfolio Donut PieChart */}
                <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
                  <div className="mb-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-on-surface flex items-center gap-2">
                      <HeartPulse size={16} className="text-primary" /> Health Portfolio
                    </h3>
                    <p className="text-xs text-on-surface-variant">Distribution of clinical care records</p>
                  </div>

                  <div className="h-44 sm:h-48 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={portfolioData}
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {portfolioData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/20 text-xs">
                    {portfolioData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[11px] text-on-surface-variant truncate">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Split Workspace: Upcoming Consultation Preview + Labs / Invoices */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 w-full">
                {/* LEFT 2 COLUMNS: UPCOMING CONSULTATIONS PREVIEW */}
                <div className="lg:col-span-2 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                      <Clock size={18} className="text-primary" /> Active & Upcoming Consultations
                    </h3>
                    <button
                      onClick={() => setActiveNav('appointments')}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View All ({upcoming.length}) <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {upcoming.slice(0, 3).map((appt) => (
                      <div
                        key={appt.id}
                        className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col items-center justify-center shrink-0">
                            <span className="text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase">
                              {new Date(appt.scheduled_at).toLocaleDateString([], { month: 'short' })}
                            </span>
                            <span className="text-base sm:text-lg font-black text-on-surface font-mono leading-none">
                              {new Date(appt.scheduled_at).toLocaleDateString([], { day: 'numeric' })}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-on-surface text-sm sm:text-base truncate">Dr. {appt.doctor_name}</h4>
                              {appt.clinic_name && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-surface-variant flex items-center gap-1">
                                  <Building2 size={10} className="text-primary" /> {appt.clinic_name}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5 font-mono">
                              <Clock size={12} className="text-secondary" />
                              {new Date(appt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t border-outline-variant/20 sm:border-0">
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Queue Status</span>
                            <span className="text-xs font-bold text-primary">
                              {['BOOKED', 'CHECK_IN'].includes(appt.status)
                                ? appt.queue_position === 0
                                  ? 'Next in line!'
                                  : `${appt.queue_position || 1} ahead`
                                : '--'}
                            </span>
                            <div className="mt-0.5 flex items-center gap-1 sm:justify-end">
                              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Token:</span>
                              <span className="font-mono font-bold text-xs text-on-surface">#{appt.token_number || '--'}</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${STATUS_PILLS[appt.status] || STATUS_PILLS.BOOKED}`}>
                              {appt.status.replace('_', ' ')}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setReceiptAppt(appt)}
                                className="p-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                                title="Digital Token Receipt"
                              >
                                <FileText size={16} />
                              </button>
                              <button
                                onClick={() => setSelectedAppt(appt)}
                                className="p-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                                title="View Details"
                              >
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {upcoming.length === 0 && (
                      <div className="bg-surface-container-lowest border border-dashed border-outline-variant/50 rounded-2xl p-6 sm:p-8 text-center">
                        <Calendar size={32} className="mx-auto mb-2 text-on-surface-variant/30" />
                        <p className="text-sm font-bold text-on-surface">No upcoming consultations</p>
                        <p className="text-xs text-on-surface-variant mt-1">Book a new appointment with our doctors to receive care.</p>
                        <button
                          onClick={() => setIsBookingModalOpen(true)}
                          className="mt-4 px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                          Book Visit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN: LABS & BILLING OVERVIEW PREVIEW */}
                <div className="space-y-5 sm:space-y-6">
                  {/* Lab Reports Card */}
                  <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-xs space-y-3.5 w-full">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
                        <Activity size={16} className="text-primary" /> Diagnostic Reports
                      </h3>
                      <button
                        onClick={() => setActiveNav('labs')}
                        className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                      >
                        All Labs ({labs.length})
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {labs.slice(0, 3).map((lab) => (
                        <div key={lab.id} className="flex items-center justify-between border-b border-outline-variant/20 pb-2.5 last:border-0 last:pb-0 gap-2">
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-on-surface truncate">{lab.file_name || lab.name || 'Lab Document'}</p>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">
                              {new Date(lab.uploaded_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                          {lab.report_file && (
                            <a
                              href={lab.report_file}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline shrink-0"
                            >
                              <ExternalLink size={12} /> View
                            </a>
                          )}
                        </div>
                      ))}

                      {labs.length === 0 && (
                        <p className="text-xs text-on-surface-variant text-center py-4">No diagnostic reports uploaded yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Invoices & Receipts Preview */}
                  <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-xs space-y-3.5 w-full">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
                        <CreditCard size={16} className="text-secondary" /> Billing & Statements
                      </h3>
                      <button
                        onClick={() => setActiveNav('billing')}
                        className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                      >
                        Ledger ({invoices.length})
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {invoices.slice(0, 3).map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between border-b border-outline-variant/20 pb-2.5 last:border-0 last:pb-0 gap-2">
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-on-surface truncate">Invoice #{inv.id}</p>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">{inv.date || 'Recent'}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-black text-xs text-on-surface font-mono">${inv.amount}</p>
                            <span className={`text-[10px] font-bold uppercase ${inv.status === 'Paid' ? 'text-[#047857]' : 'text-primary'}`}>
                              {inv.status || 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))}

                      {invoices.length === 0 && (
                        <p className="text-xs text-on-surface-variant text-center py-4">No pending invoices.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* TAB 2: MY APPOINTMENTS & LIVE QUEUE                               */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeNav === 'appointments' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-outline-variant/20">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-on-surface">Scheduled Consultations</h2>
                  <p className="text-xs text-on-surface-variant">Live OPD queue positions and upcoming doctor appointments</p>
                </div>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  <Plus size={15} /> Book Appointment
                </button>
              </div>

              <div className="space-y-3">
                {upcoming.map((appt) => (
                  <div
                    key={appt.id}
                    className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                          {new Date(appt.scheduled_at).toLocaleDateString([], { month: 'short' })}
                        </span>
                        <span className="text-lg font-black text-on-surface font-mono leading-none">
                          {new Date(appt.scheduled_at).toLocaleDateString([], { day: 'numeric' })}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-on-surface text-sm sm:text-base truncate">Dr. {appt.doctor_name}</h3>
                          {appt.clinic_name && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-surface-variant flex items-center gap-1">
                              <Building2 size={10} className="text-primary" /> {appt.clinic_name}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5 font-mono">
                          <Clock size={12} className="text-secondary" />
                          {new Date(appt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t border-outline-variant/20 sm:border-0">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Queue Position</span>
                        <span className="text-xs font-bold text-primary">
                          {['BOOKED', 'CHECK_IN'].includes(appt.status)
                            ? appt.queue_position === 0
                              ? 'Next in line!'
                              : `${appt.queue_position || 1} ahead`
                            : '--'}
                        </span>
                        <div className="mt-0.5 flex items-center gap-1 sm:justify-end">
                          <span className="text-[10px] uppercase font-bold text-on-surface-variant">Token:</span>
                          <span className="font-mono font-bold text-xs text-on-surface">#{appt.token_number || '--'}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${STATUS_PILLS[appt.status] || STATUS_PILLS.BOOKED}`}>
                          {appt.status.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setReceiptAppt(appt)}
                            className="p-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                            title="Digital Token Receipt"
                          >
                            <FileText size={16} />
                          </button>
                          <button
                            onClick={() => setSelectedAppt(appt)}
                            className="p-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {upcoming.length === 0 && (
                  <div className="bg-surface-container-lowest border border-dashed border-outline-variant/50 rounded-2xl p-8 sm:p-12 text-center">
                    <Calendar size={40} className="mx-auto mb-3 text-on-surface-variant/30" />
                    <p className="text-base font-bold text-on-surface">No upcoming consultations</p>
                    <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                      You have no active or scheduled doctor visits. Book a consultation now to get an instant digital queue token.
                    </p>
                    <button
                      onClick={() => setIsBookingModalOpen(true)}
                      className="mt-4 px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Book New Consultation
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* TAB 3: VISIT HISTORY & CLINICAL SUMMARIES                         */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeNav === 'history' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-outline-variant/20">
                <h2 className="text-lg sm:text-xl font-extrabold text-on-surface">Past Consultations & Encounters</h2>
                <p className="text-xs text-on-surface-variant">Archived history, diagnoses, clinical advice, and past prescriptions</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {completed.map((appt) => (
                  <div
                    key={appt.id}
                    className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4 sm:p-5 shadow-xs hover:border-primary/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] uppercase">
                          COMPLETED
                        </span>
                        <span className="text-xs font-mono text-on-surface-variant">
                          {new Date(appt.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="font-bold text-on-surface text-sm sm:text-base truncate">Dr. {appt.doctor_name}</h4>
                      {appt.clinic_name && (
                        <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1">
                          <Building2 size={12} className="text-primary" /> {appt.clinic_name}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedAppt(appt)}
                      className="mt-4 w-full py-2 bg-surface-container-low hover:bg-primary-container hover:text-on-primary text-on-surface text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      View Clinical Summary
                    </button>
                  </div>
                ))}

                {completed.length === 0 && (
                  <div className="col-span-full bg-surface-container-lowest border border-dashed border-outline-variant/40 rounded-2xl p-8 sm:p-12 text-center">
                    <FileText size={40} className="mx-auto mb-3 text-on-surface-variant/30" />
                    <p className="text-sm font-bold text-on-surface">No completed visits on record</p>
                    <p className="text-xs text-on-surface-variant mt-1">Completed encounters will be archived here with clinical notes.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* TAB 4: DIAGNOSTIC REPORTS & LABS                                  */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeNav === 'labs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-outline-variant/20">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-on-surface">Diagnostic Reports & Records</h2>
                  <p className="text-xs text-on-surface-variant">Upload and access clinical tests, imaging results, and blood work</p>
                </div>
                <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container hover:bg-primary text-xs font-bold text-on-primary cursor-pointer transition-all shadow-xs shrink-0 self-start sm:self-auto">
                  <UploadCloud size={15} /> Upload Diagnostic File
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (!file) return
                      const formData = new FormData()
                      formData.append('report_file', file)
                      formData.append('file_name', file.name)

                      toast.promise(
                        api.post('/api/labs/reports/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
                        {
                          loading: 'Uploading report…',
                          success: () => {
                            queryClient.invalidateQueries(['patient-labs'])
                            return 'Report uploaded successfully!'
                          },
                          error: 'Failed to upload report'
                        }
                      )
                    }}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {labs.map((lab) => (
                  <div
                    key={lab.id}
                    className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                          <Activity size={16} />
                        </div>
                        <span className="text-[10px] font-mono text-on-surface-variant">
                          {new Date(lab.uploaded_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-on-surface truncate">
                        {lab.file_name || lab.name || 'Lab Document'}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">Uploaded diagnostic file</p>
                    </div>

                    {lab.report_file && (
                      <a
                        href={lab.report_file}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 w-full inline-flex items-center justify-center gap-1.5 py-2 bg-surface-container-low hover:bg-primary-container hover:text-on-primary text-xs font-bold text-on-surface rounded-xl transition-all"
                      >
                        <ExternalLink size={14} /> Open Document
                      </a>
                    )}
                  </div>
                ))}

                {labs.length === 0 && (
                  <div className="col-span-full bg-surface-container-lowest border border-dashed border-outline-variant/40 rounded-2xl p-8 sm:p-12 text-center">
                    <Activity size={40} className="mx-auto mb-3 text-on-surface-variant/30" />
                    <p className="text-sm font-bold text-on-surface">No diagnostic reports uploaded</p>
                    <p className="text-xs text-on-surface-variant mt-1">Upload reports or tests to share with your attending doctors.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* TAB 5: BILLING & INVOICES                                         */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeNav === 'billing' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-outline-variant/20">
                <h2 className="text-lg sm:text-xl font-extrabold text-on-surface">Billing Ledger & Statements</h2>
                <p className="text-xs text-on-surface-variant">Consultation fees, itemized invoices, and settlement status</p>
              </div>

              <div className="space-y-3">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
                        <CreditCard size={18} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-on-surface truncate">Invoice #{inv.id}</h4>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">{inv.date || 'Recent statement'}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-black text-sm sm:text-base text-on-surface font-mono">${inv.amount}</p>
                      <span className={`text-[10px] font-bold uppercase ${inv.status === 'Paid' ? 'text-[#047857]' : 'text-primary'}`}>
                        {inv.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}

                {invoices.length === 0 && (
                  <div className="bg-surface-container-lowest border border-dashed border-outline-variant/40 rounded-2xl p-8 sm:p-12 text-center">
                    <CreditCard size={40} className="mx-auto mb-3 text-on-surface-variant/30" />
                    <p className="text-sm font-bold text-on-surface">No invoices found</p>
                    <p className="text-xs text-on-surface-variant mt-1">Settled and pending consultation charges will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODALS: BOOKING, CONSULTATION, TOKEN PASS                           */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {isBookingModalOpen && (
        <DiscoveryBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onBooked={(newAppt) => setReceiptAppt(newAppt)}
          user={user}
        />
      )}

      {selectedAppt && (
        <PatientConsultationModal
          appointment={selectedAppt}
          onClose={() => setSelectedAppt(null)}
          onLabUploaded={() => queryClient.invalidateQueries(['patient-labs'])}
        />
      )}

      {receiptAppt && (
        <TokenReceiptModal
          appointment={receiptAppt}
          user={user}
          onClose={() => setReceiptAppt(null)}
        />
      )}
    </div>
  )
}
