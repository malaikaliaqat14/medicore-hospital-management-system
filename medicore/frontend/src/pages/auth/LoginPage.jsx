import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  Users,
  CalendarCheck,
  FileText,
  Building2,
  CheckCircle2,
  Activity,
  HeartPulse,
  ArrowRight,
  ShieldAlert,
  Loader2,
  UserPlus
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function LoginPage() {
  // roleTab: 'login' | 'patient'
  const [roleTab, setRoleTab] = useState('login')
  // mode: 'login' | 'register' (register is for patient self-signup)
  const [mode, setMode] = useState('login')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const login = useAuthStore(s => s.login)
  const navigate = useNavigate()

  const REDIRECTS = {
    SUPER_ADMIN: '/admin',
    CLINIC_ADMIN: '/clinic/dashboard',
    RECEPTIONIST: '/reception/desk',
    DOCTOR: '/doctor/desk',
    PATIENT: '/patient/home',
  }

  const handleTabChange = (tab) => {
    setRoleTab(tab)
    setMode('login')
    reset()
  }

  const onSubmit = async (data) => {
    setLoading(true)
    if (mode === 'login') {
      try {
        const identifier = data.emailOrPhone?.trim()
        const user = await login(identifier, data.password)
        toast.success(`Welcome back, ${user.name || 'User'}!`)
        navigate(REDIRECTS[user.role] || '/')
      } catch (err) {
        toast.error('Invalid credentials. Check your email or phone number and password.')
        setLoading(false)
      }
    } else {
      // Patient Self-Registration
      try {
        await api.post('/api/auth/register/', {
          name: data.name,
          phone: data.phone,
          email: data.email || undefined,
          password: data.password,
        })
        toast.success('Patient account registered! Logging in...')
        const identifier = data.phone || data.email
        const user = await login(identifier, data.password)
        navigate('/patient/home')
      } catch (err) {
        const msg = err.response?.data
          ? Object.values(err.response.data).flat().join(' ')
          : 'Registration failed. Please check details.'
        toast.error(msg)
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#03181E] flex items-center justify-center px-3 py-6 sm:p-6 lg:p-10 font-sans selection:bg-teal-500 selection:text-white overflow-x-hidden">
      {/* Outer Card Container */}
      <div className="w-full max-w-[1340px] bg-[#041D24] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-teal-900/40 grid grid-cols-1 lg:grid-cols-12 relative">

        {/* ================= LEFT HERO PANEL (60%) ================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden min-h-0 lg:min-h-[720px]">

          {/* Background Doctor Photo with Soft Ambient Vignette */}
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
            style={{
              backgroundImage: `url('/doctor-hero.jpg')`,
              backgroundPosition: 'right 20% center'
            }}
          />
          {/* Radial & Linear Teal Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#041D24] via-[#041D24]/90 to-[#041D24]/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041D24] via-transparent to-[#041D24]/80 pointer-events-none" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 flex items-center gap-3 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#00A896] to-[#028073] flex items-center justify-center text-white shadow-lg shadow-teal-900/50 shrink-0">
              <HeartPulse size={22} className="sm:w-[26px] sm:h-[26px]" strokeWidth={2.4} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-2xl font-black text-white tracking-tight truncate">MediCore Clinical Enterprise</span>
              </div>
              <p className="text-[11px] sm:text-xs text-teal-200/70 font-medium tracking-wide mt-0.5 truncate">
                Smarter Healthcare. Better Tomorrow.
              </p>
            </div>
          </div>

          {/* Central Hero Headline & Description */}
          <div className="relative z-10 my-6 sm:my-10 lg:my-14 max-w-xl">
            <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-black text-white leading-[1.18] tracking-tight">
              Modern Clinical Platform <br className="hidden sm:inline" />
              for Clinics & Hospitals
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-teal-100/75 mt-2.5 sm:mt-4 leading-relaxed font-normal">
              Streamline your operations, manage patients, empower your staff, and deliver better care — all in one place.
            </p>

            {/* 4 Feature Badges (Responsive layout: inline on mobile, vertical stack on tablet/desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-teal-800/40">
              {/* Badge 1 */}
              <div className="flex items-center sm:flex-col sm:items-start gap-2.5 sm:gap-0 text-left">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-inner shadow-teal-500/20 shrink-0 sm:mb-2">
                  <User size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-teal-100 leading-tight">Patient<br className="hidden sm:inline" /> Management</span>
              </div>

              {/* Badge 2 */}
              <div className="flex items-center sm:flex-col sm:items-start gap-2.5 sm:gap-0 text-left">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-inner shadow-teal-500/20 shrink-0 sm:mb-2">
                  <CalendarCheck size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-teal-100 leading-tight">Appointments<br className="hidden sm:inline" /> & Scheduling</span>
              </div>

              {/* Badge 3 */}
              <div className="flex items-center sm:flex-col sm:items-start gap-2.5 sm:gap-0 text-left">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-inner shadow-teal-500/20 shrink-0 sm:mb-2">
                  <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-teal-100 leading-tight">Medical<br className="hidden sm:inline" /> Records</span>
              </div>

              {/* Badge 4 */}
              <div className="flex items-center sm:flex-col sm:items-start gap-2.5 sm:gap-0 text-left">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-inner shadow-teal-500/20 shrink-0 sm:mb-2">
                  <Building2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-teal-100 leading-tight">Multi-Tenant<br className="hidden sm:inline" /> Support</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 flex items-center gap-2.5 text-[11px] sm:text-xs text-teal-200/80 font-medium pt-3 sm:pt-2 border-t border-teal-800/20 sm:border-t-0">
            <div className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0">
              <CheckCircle2 size={13} strokeWidth={2.5} />
            </div>
            <span className="truncate sm:whitespace-normal">Trusted by 500+ clinics & hospitals worldwide</span>
          </div>
        </div>

        {/* ================= RIGHT FORM PANEL (40%) ================= */}
        <div className="lg:col-span-5 bg-[#03181E]/60 p-3.5 sm:p-8 lg:p-12 flex items-center justify-center relative">

          {/* Floating Crisp White Card */}
          <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-slate-100 relative z-10">

            {/* Card Header */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl lg:text-[28px] font-extrabold text-slate-900 tracking-tight leading-tight">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {mode === 'login'
                  ? 'Sign in to your MediCore account'
                  : 'Register universal patient portal account'}
              </p>
            </div>

            {/* Segmented Pill Tabs (2 Tabs: Login | Patient Portal) */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-5 sm:mb-6 gap-1">
              <button
                type="button"
                onClick={() => handleTabChange('login')}
                className={`py-2 sm:py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all text-center truncate ${roleTab === 'login' && mode === 'login'
                  ? 'bg-[#005c55] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('patient')}
                className={`py-2 sm:py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all text-center truncate ${roleTab === 'patient' || mode === 'register'
                  ? 'bg-[#005c55] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Patient Portal
              </button>
            </div>

            {/* Mode Sub-switcher for Patients (Sign In vs Register) */}
            {roleTab === 'patient' && (
              <div className="mb-4 flex items-center justify-between px-3 py-2 bg-teal-50/70 border border-teal-100 rounded-xl text-xs">
                <span className="text-teal-900 font-semibold truncate">
                  {mode === 'login' ? 'Have token or account?' : 'New patient?'}
                </span>
                <button
                  type="button"
                  onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); reset(); }}
                  className="text-[#005c55] font-bold hover:underline ml-2 shrink-0"
                >
                  {mode === 'login' ? 'New? Sign Up' : 'Sign In'}
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 sm:space-y-4">

              {/* Register-only Fields: Full Name & Phone */}
              {mode === 'register' && (
                <>
                  <div>
                    <label className="text-slate-700 text-xs font-semibold block mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        {...register('name', { required: 'Full name is required' })}
                        type="text"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 h-11 sm:h-12 text-slate-900 text-sm focus:border-[#005c55] focus:ring-2 focus:ring-teal-600/15 focus:outline-none transition-all placeholder:text-slate-400"
                        placeholder="e.g. Usama Khan"
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="text-slate-700 text-xs font-semibold block mb-1.5">
                      Mobile Phone Number * (Login ID)
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        {...register('phone', { required: 'Mobile phone number is required' })}
                        type="tel"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 h-11 sm:h-12 text-slate-900 text-sm focus:border-[#005c55] focus:ring-2 focus:ring-teal-600/15 focus:outline-none transition-all placeholder:text-slate-400"
                        placeholder="03001234567"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>}
                  </div>
                </>
              )}

              {/* Email or Phone field */}
              <div>
                <label className="text-slate-700 text-xs font-semibold block mb-1.5">
                  {roleTab === 'patient'
                    ? 'Mobile Number or Email *'
                    : 'Email Address'}
                </label>
                <div className="relative">
                  {roleTab === 'patient' ? (
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  ) : (
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  )}
                  <input
                    {...register('emailOrPhone', {
                      required: mode === 'login' ? 'Please enter your email or phone number' : false
                    })}
                    type="text"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 h-11 sm:h-12 text-slate-900 text-sm focus:border-[#005c55] focus:ring-2 focus:ring-teal-600/15 focus:outline-none transition-all placeholder:text-slate-400"
                    placeholder={
                      roleTab === 'patient'
                        ? 'e.g. 03001234567 or email'
                        : 'Enter your email'
                    }
                  />
                </div>
                {errors.emailOrPhone && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.emailOrPhone.message}</p>
                )}
                {roleTab === 'patient' && mode === 'login' && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tip: Enter mobile phone number given at reception.
                  </p>
                )}
              </div>

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-700 text-xs font-semibold">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => toast('For clinic staff, contact your admin. For patients, check your token slip or ask reception.', { icon: 'ℹ️' })}
                      className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 4, message: 'Password must be at least 4 characters' }
                    })}
                    type={showPw ? 'text' : 'password'}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-11 h-11 sm:h-12 text-slate-900 text-sm focus:border-[#005c55] focus:ring-2 focus:ring-teal-600/15 focus:outline-none transition-all placeholder:text-slate-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>
                )}
                {roleTab === 'patient' && mode === 'login' && (
                  <p className="text-[11px] text-teal-700 font-medium mt-1">
                    Use the auto-generated password on your Token Slip.
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              {mode === 'login' && (
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#005c55] focus:ring-[#005c55] cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs text-slate-600 select-none cursor-pointer">
                    Remember me
                  </label>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#005c55] hover:bg-[#004741] text-white font-bold h-11 sm:h-12 rounded-xl text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : mode === 'login' ? (
                  <span>Sign In</span>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Bottom Card Footer Links */}
            <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-100 text-center">
              {mode === 'login' ? (
                roleTab === 'patient' ? (
                  <p className="text-xs text-slate-500">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('register'); reset(); }}
                      className="text-[#005c55] font-bold hover:underline"
                    >
                      Register as Patient
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Don't have an account?{' '}
                    <span className="text-slate-700 font-medium">Contact your admin</span>
                  </p>
                )
              ) : (
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); reset(); }}
                    className="text-[#005c55] font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
