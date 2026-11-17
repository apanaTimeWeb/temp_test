'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import {
  Eye, EyeOff, BookOpen, CheckCircle, Lock,
  Shield, Zap, Users, Sparkles, LayoutGrid, Clock,
} from 'lucide-react';
import { LibraryLoader, ButtonLoader } from '@/components/ui/loader/LibraryLoader';

interface RoleConfig {
  id: 'superadmin' | 'admin' | 'manager';
  label: string;
  email: string;
  password: string;
  icon: string;
  redirectTo: string;
  setupComplete: boolean;
}

const ROLES: RoleConfig[] = [
  {
    id: 'superadmin',
    label: 'Super Admin',
    email: 'superadmin@library.com',
    password: 'Password@123',
    icon: '👑',
    redirectTo: '/superadmin/superadmin_dashboard',
    setupComplete: true,
  },
  {
    id: 'admin',
    label: 'Admin',
    email: 'admin@library.com',
    password: 'Password@123',
    icon: '⚡',
    redirectTo: '/admin',
    setupComplete: true,
  },
  {
    id: 'manager',
    label: 'Manager',
    email: 'manager@library.com',
    password: 'Password@123',
    icon: '👥',
    redirectTo: '/manager',
    setupComplete: true,
  },
];

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['superadmin', 'admin', 'manager']),
});

type LoginFormData = z.infer<typeof loginSchema>;

const ROLE_DEST_LABEL: Record<string, string> = {
  superadmin: 'Setup Library Profile & Platform Analytics',
  admin: 'Branch Dashboard & Seats-Shifts-Lockers',
  manager: 'Daily Ops, Attendance & Members',
};

function getRedirectUrl(role: RoleConfig): string {
  if (role.id === 'superadmin' && !role.setupComplete) return '/superadmin/superadmin_setup-wizard';
  return role.redirectTo;
}

const LOGIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; }

  .login-bg {
    background: #030712;
    font-family: 'Inter', sans-serif;
  }

  .dot-grid {
    background-image: radial-gradient(rgba(99,102,241,0.12) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  .aurora-orb-1 {
    position: absolute;
    width: 700px; height: 700px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
    animation: orb-float 14s ease-in-out infinite alternate;
  }
  .aurora-orb-2 {
    position: absolute;
    width: 500px; height: 500px;
    background: radial-gradient(ellipse, rgba(139,92,246,0.14) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
    animation: orb-float 18s ease-in-out infinite alternate-reverse;
  }
  .aurora-orb-3 {
    position: absolute;
    width: 400px; height: 400px;
    background: radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
    animation: orb-float 10s ease-in-out infinite alternate;
  }

  @keyframes orb-float {
    0% { transform: translate(0,0) scale(1); }
    100% { transform: translate(50px, 30px) scale(1.08); }
  }

  .glass-login {
    background: rgba(8,8,22,0.75);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    border: 1px solid rgba(99,102,241,0.2);
    box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(99,102,241,0.08);
  }

  .glass-left {
    background: rgba(5,5,18,0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-right: 1px solid rgba(99,102,241,0.1);
  }

  .gradient-text {
    background: linear-gradient(135deg, #a78bfa 0%, #6366f1 40%, #22d3ee 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .shimmer-btn {
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #22d3ee, #6366f1);
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
  }

  .glow-indigo {
    box-shadow: 0 0 30px rgba(99,102,241,0.5), 0 0 60px rgba(99,102,241,0.15);
  }

  .input-field {
    background: rgba(10,10,28,0.8);
    border: 1px solid rgba(99,102,241,0.2);
    color: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  .input-field::placeholder {
    color: rgba(148,163,184,0.5);
  }

  .input-field:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  }

  .input-error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important;
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 50px #0a0a1c inset !important;
    -webkit-text-fill-color: #fff !important;
  }

  .role-tab {
    color: rgba(148,163,184,0.7);
    border: 1px solid transparent;
    transition: all 0.25s ease;
  }

  .role-tab:hover {
    color: #fff;
    background: rgba(99,102,241,0.08);
  }

  .role-tab-active {
    background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2));
    border-color: rgba(99,102,241,0.4) !important;
    color: #fff;
    box-shadow: 0 4px 20px rgba(99,102,241,0.2);
  }

  .feature-pill {
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.2);
    transition: all 0.25s;
  }

  .feature-pill:hover {
    background: rgba(99,102,241,0.15);
    border-color: rgba(99,102,241,0.4);
    transform: translateY(-2px);
  }

  @keyframes float-card {
    0%,100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  .float-card-1 { animation: float-card 6s ease-in-out infinite; }
  .float-card-2 { animation: float-card 8s ease-in-out infinite 1s; }
  .float-card-3 { animation: float-card 7s ease-in-out infinite 2s; }

  .stat-card {
    background: rgba(15,15,35,0.8);
    border: 1px solid rgba(255,255,255,0.06);
    backdrop-filter: blur(12px);
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #030712; }
  ::-webkit-scrollbar-thumb { background: #2d2d5e; border-radius: 10px; }

  @keyframes spin-slow { to { transform: rotate(360deg); } }
  .spin-slow { animation: spin-slow 20s linear infinite; }

  .submit-btn {
    position: relative;
    overflow: hidden;
  }
  .submit-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.5s;
  }
  .submit-btn:hover::before { left: 100%; }

  /* ===== Library Loader (Login redirect overlay - Translucent Modal) ===== */
  .login-loader-overlay {
    background: rgba(3, 7, 18, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .login-loader-modal {
    background: #F7F3EA;
    border: 2px solid #E8DFC9;
    border-radius: 24px;
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(200, 145, 42, 0.25);
    animation: modalPop 0.25s ease-out;
  }
  @keyframes modalPop {
    from { transform: scale(0.92); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  .login-loader-box {
    position: relative;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    width: 96px; height: 96px;
  }
  .login-loader-aura {
    position: absolute; inset: 0; border-radius: 50%;
    filter: blur(12px); opacity: 0.4; pointer-events: none;
    background: radial-gradient(circle, #F4D03F 0%, #C8912A 50%, transparent 80%);
  }
  .login-loader-ring {
    width: 100%; height: 100%;
    animation: loginSpinCW 1.4s linear infinite;
  }
  .login-loader-inner {
    position: absolute; inset: 0;
    animation: loginSpinCCW 2.4s linear infinite;
  }
  .login-loader-icon {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none; user-select: none;
    color: #1E3A5F;
  }
  .login-loader-icon svg {
    width: 45%; height: 45%;
    filter: drop-shadow(0 0 4px rgba(200,145,42,0.45));
  }
  @keyframes loginSpinCW  { to { transform: rotate(360deg); } }
  @keyframes loginSpinCCW { to { transform: rotate(-360deg); } }
  @media (prefers-reduced-motion: reduce) {
    .login-loader-ring  { animation-duration: 4s !important; }
    .login-loader-inner { animation-duration: 6s !important; }
  }
`;

const roleIcons: Record<string, ReactNode> = {
  superadmin: <Shield size={16} className="text-violet-400" />,
  admin: <Zap size={16} className="text-cyan-400" />,
  manager: <Users size={16} className="text-emerald-400" />,
};

const roleColors: Record<string, string> = {
  superadmin: 'from-violet-500/20 to-purple-500/10 border-violet-500/30',
  admin: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30',
  manager: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
};

export default function PublicAuthSignInPage() {
  const [showPw, setShowPw] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleConfig>(ROLES[0]);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const { register, handleSubmit, setValue, setError, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    // Auto-fill SuperAdmin credentials by default
    defaultValues: { email: ROLES[0].email, password: ROLES[0].password, role: 'superadmin' },
  });

  const handleRoleSelect = (role: RoleConfig) => {
    setSelectedRole(role);
    // Auto-fill credentials for the selected role
    setValue('email', role.email, { shouldValidate: false });
    setValue('password', role.password, { shouldValidate: false });
    setValue('role', role.id as LoginFormData['role']);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      // ── Frontend-only mock authentication ──────────────────────────────
      // Find matching role credential from hardcoded list
      const matchedRole = ROLES.find(
        (r) => r.id === data.role && r.email.toLowerCase() === data.email.toLowerCase() && r.password === data.password
      );

      if (!matchedRole) {
        throw new Error('Invalid email or password. Please check your credentials.');
      }

      // Simulate a JWT token (mock)
      const mockToken = btoa(JSON.stringify({ role: matchedRole.id, email: data.email, exp: Date.now() + 900000 }));
      const mockUser = { id: `${matchedRole.id}-001`, name: matchedRole.label, email: data.email, role: matchedRole.id, phone: '' };

      // Store in localStorage + cookie (same as real auth flow)
      localStorage.setItem('access_token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      document.cookie = `access_token=${mockToken}; path=/; SameSite=Strict; max-age=900`;

      // Show success popup and delay redirect
      setLoginSuccess(true);
      setTimeout(() => {
        window.location.href = getRedirectUrl(matchedRole);
      }, 1500);
    } catch (err: any) {
      setError('root', { message: err.message || 'Invalid credentials. Please try again.' });
    }
  };

  return (
    <main className="login-bg flex min-h-screen text-white overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: LOGIN_CSS }} />

      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-50" />
      <div className="aurora-orb-1" style={{ top: '-15%', left: '-10%' }} />
      <div className="aurora-orb-2" style={{ bottom: '-10%', right: '-8%' }} />
      <div className="aurora-orb-3" style={{ top: '40%', left: '30%' }} />

      {/* SUCCESS / REDIRECT OVERLAY */}
      {loginSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center login-loader-overlay" role="status" aria-label="Loading">
          <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
            <defs>
              <linearGradient id="loginLibGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F4D03F" />
                <stop offset="50%" stopColor="#C8912A" />
                <stop offset="100%" stopColor="#1E3A5F" />
              </linearGradient>
            </defs>
          </svg>

          <div className="login-loader-modal">
            <div className="login-loader-box">
              <div className="login-loader-aura" />

              {/* Outer CW ring (golden gradient) */}
              <svg className="login-loader-ring" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="44" stroke="#C8912A" strokeWidth="2.5"
                  strokeDasharray="4 6" opacity="0.3" vectorEffect="non-scaling-stroke"/>
                <circle cx="50" cy="50" r="44" stroke="url(#loginLibGrad)" strokeWidth="3"
                  strokeLinecap="round" strokeDasharray="95 180" vectorEffect="non-scaling-stroke"/>
              </svg>

              {/* Inner CCW ring (navy dashed) */}
              <svg className="login-loader-inner" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="35" stroke="#1E3A5F" strokeWidth="1.5"
                  strokeDasharray="6 10" opacity="0.4" vectorEffect="non-scaling-stroke"/>
              </svg>

              {/* Dashboard icon */}
              <div className="login-loader-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="9" rx="1"/>
                  <rect x="14" y="3" width="7" height="5" rx="1"/>
                  <rect x="14" y="12" width="7" height="9" rx="1"/>
                  <rect x="3" y="16" width="7" height="5" rx="1"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LEFT BRAND PANEL ── */}
      <section className="hidden lg:flex lg:w-[55%] flex-col justify-between p-14 relative z-10 glass-left">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl blur-md opacity-80" />
            <div className="relative w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-2xl font-black tracking-tight">
            Library<span className="gradient-text">OS</span>
          </span>
        </div>

        {/* Center Content */}
        <div className="space-y-10 max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            2,400+ study libraries trust LibraryOS
          </div>

          {/* Hero Text */}
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tight leading-[1.08]">
              Welcome back to<br />
              <span className="gradient-text">The Smartest</span><br />
              Study Library Platform
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Manage seats, shifts, lockers, biometric attendance, and fee collections — all from one powerful operating system built for modern Indian study libraries &amp; reading rooms.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: <CheckCircle size={13} />, label: 'Seats & Shifts Matrix', color: 'text-cyan-400' },
              { icon: <CheckCircle size={13} />, label: 'Smart ID & Biometrics', color: 'text-emerald-400' },
              { icon: <CheckCircle size={13} />, label: 'Locker Allocation', color: 'text-violet-400' },
              { icon: <CheckCircle size={13} />, label: 'WhatsApp Automation', color: 'text-amber-400' },
              { icon: <CheckCircle size={13} />, label: 'Multi-Branch Network', color: 'text-rose-400' },
              { icon: <CheckCircle size={13} />, label: 'Fee & Daily Settlement', color: 'text-indigo-400' },
            ].map((f) => (
              <div key={f.label} className="feature-pill flex items-center gap-2 px-4 py-2 rounded-xl cursor-default">
                <span className={f.color}>{f.icon}</span>
                <span className="text-xs font-semibold text-slate-300">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Floating Stat Cards */}
          <div className="relative h-36">
            <div className="stat-card rounded-2xl p-4 absolute left-0 top-0 float-card-1 w-56">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <LayoutGrid size={16} className="text-cyan-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Study Desks Managed</div>
                  <div className="text-xl font-black text-white">50,000+</div>
                </div>
              </div>
            </div>
            <div className="stat-card rounded-2xl p-4 absolute left-60 top-4 float-card-2 w-56">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Users size={16} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Enrolled Students</div>
                  <div className="text-xl font-black text-white">1.8L+</div>
                </div>
              </div>
            </div>
            <div className="stat-card rounded-2xl p-4 absolute left-28 top-16 float-card-3 w-56">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <Clock size={16} className="text-violet-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Daily Shift Check-ins</div>
                  <div className="text-xl font-black text-white">85K+</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} LibraryOS. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </section>

      {/* ── RIGHT AUTH PANEL ── */}
      <section className="w-full lg:w-[45%] flex items-center justify-center p-6 md:p-10 relative z-10">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center items-center gap-3 mb-10">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl blur-md opacity-70" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight">Library<span className="gradient-text">OS</span></span>
          </div>

          <div className="glass-login rounded-3xl p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 mb-5">
                <Lock size={24} className="text-indigo-400" />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Welcome Back</h2>
              <p className="text-slate-400 text-sm">Select your role and sign in to continue</p>
            </div>

            {/* Role Selector */}
            <div className="grid grid-cols-3 gap-2 mb-7 p-1.5 rounded-2xl" style={{ background: 'rgba(10,10,25,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
              {ROLES.map((role) => {
                const isActive = selectedRole.id === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    id={`role-btn-${role.id}`}
                    onClick={() => handleRoleSelect(role)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1.5 role-tab ${isActive ? 'role-tab-active' : ''}`}
                  >
                    <span>{roleIcons[role.id]}</span>
                    <span>{role.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Role Info Banner */}
            <div className={`bg-gradient-to-r ${roleColors[selectedRole.id]} border rounded-xl p-3 flex items-center gap-3 mb-6`}>
              <span className="text-lg">{selectedRole.icon}</span>
              <div>
                <div className="text-xs font-black text-white">{selectedRole.label} Portal</div>
                <div className="text-[11px] text-slate-400">Will redirect to: {ROLE_DEST_LABEL[selectedRole.id]}</div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <input type="hidden" {...register('role')} />

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Email Address</label>
                <input
                  id="login-email"
                  type="text"
                  placeholder="Enter your email"
                  {...register('email')}
                  className={`input-field w-full rounded-xl px-4 py-3.5 text-sm ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && <p className="text-rose-400 text-xs font-medium mt-1 flex items-center gap-1"><span>⚠</span>{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password')}
                    className={`input-field w-full rounded-xl px-4 py-3.5 text-sm pr-12 ${errors.password ? 'input-error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-400 text-xs font-medium mt-1 flex items-center gap-1"><span>⚠</span>{errors.password.message}</p>}
              </div>

              {/* Root Error */}
              {errors.root && (
                <div className="bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">⚠️</span>
                  <span>{errors.root.message}</span>
                </div>
              )}

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isSubmitting || loginSuccess}
                className="submit-btn shimmer-btn glow-indigo w-full text-white font-black text-sm py-4 rounded-xl transition-all active:scale-[0.98] mt-2 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="login-loader-box" style={{ width: 20, height: 20 }}>
                    <div className="login-loader-aura" style={{ opacity: 0.2 }} />
                    <svg className="login-loader-ring" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="44" stroke="#C8912A" strokeWidth="2.5" strokeDasharray="4 6" opacity="0.5" vectorEffect="non-scaling-stroke"/>
                      <circle cx="50" cy="50" r="44" stroke="#F4D03F" strokeWidth="3" strokeLinecap="round" strokeDasharray="95 180" vectorEffect="non-scaling-stroke"/>
                    </svg>
                    <svg className="login-loader-inner" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="35" stroke="#1E3A5F" strokeWidth="1.5" strokeDasharray="6 10" opacity="0.4" vectorEffect="non-scaling-stroke"/>
                    </svg>
                    <div className="login-loader-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="9" rx="1"/>
                        <rect x="14" y="3" width="7" height="5" rx="1"/>
                        <rect x="14" y="12" width="7" height="9" rx="1"/>
                        <rect x="3" y="16" width="7" height="5" rx="1"/>
                      </svg>
                    </div>
                  </div>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Sign In</span>
                    <Sparkles size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
              <p className="text-sm text-slate-400 text-center">
                New to LibraryOS?{' '}
                <Link href="/auth/signup" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                  Create an account
                </Link>
              </p>
              <p className="text-xs text-slate-500 text-center">
                Protected by enterprise-grade SSL encryption
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 mt-6">
            {[
              { icon: <Shield size={13} />, label: 'SSL Secured' },
              { icon: <Zap size={13} />, label: '99.9% Uptime' },
              { icon: <CheckCircle size={13} />, label: 'GDPR Compliant' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5 text-slate-500 text-xs">
                <span className="text-indigo-400/60">{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
