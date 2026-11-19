'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Eye, EyeOff, BookOpen, Lock,
  Shield, Zap, Users,
} from 'lucide-react';
import { PublicAuthBlockerOverlay, PublicAuthButtonLoader } from '@/app/public_auth/auth_sign_in/components/PublicAuthSignInLoader';
import { usePublicAuthLoginMutation } from '@/app/public_auth/auth_sign_in/hooks/usePublicAuthSignInMutation';
import { usePublicAuthIdempotencyKey } from '@/app/public_auth/auth_sign_in/hooks/usePublicAuthSignInIdempotencyKey';
import { PublicAuthApiError, getPublicAuthApiErrorMessage } from '@/app/public_auth/auth_sign_in/api/PublicAuthSignInApi';
import { PUBLIC_AUTH_INTERNAL_URLS, PUBLIC_AUTH_ROLE_REDIRECTS } from '@/app/public_auth/auth_sign_in/config/public_auth_sign_in_url_config';
import { PUBLIC_AUTH_SIGN_IN_DEMO } from '@/app/public_auth/auth_sign_in/mocks/fixtures/PublicAuthSignInFixtures';
import { createPublicAuthLoginSchema, type PublicAuthLoginFormData } from '@/app/public_auth/auth_sign_in/schemas/PublicAuthSignInValidationSchemas';
import type { PublicAuthRole } from '@/app/public_auth/auth_sign_in/utils/PublicAuthSignInConstants';

interface RoleConfig {
  id: PublicAuthRole;
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
    redirectTo: PUBLIC_AUTH_ROLE_REDIRECTS.superadmin,
    setupComplete: true,
  },
  {
    id: 'admin',
    label: 'Admin',
    email: 'admin@library.com',
    password: 'Password@123',
    icon: '⚡',
    redirectTo: PUBLIC_AUTH_ROLE_REDIRECTS.admin,
    setupComplete: true,
  },
  {
    id: 'manager',
    label: 'Manager',
    email: 'manager@library.com',
    password: 'Password@123',
    icon: '👥',
    redirectTo: PUBLIC_AUTH_ROLE_REDIRECTS.manager,
    setupComplete: true,
  },
];

const ROLE_DEST_LABEL: Record<string, string> = {
  superadmin: 'Multi-Branch & Platform Administration',
  admin: 'Branch Dashboard, Seats, Shifts & Lockers',
  manager: 'Daily Operations, Attendance & Admissions',
};

const LOGIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; }

  .login-bg {
    background: #030712;
    background-image: 
      radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.12) 0px, transparent 50%),
      radial-gradient(at 50% 50%, rgba(34, 211, 238, 0.04) 0px, transparent 50%);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .dot-grid {
    background-image: radial-gradient(rgba(99, 102, 241, 0.12) 1px, transparent 1px);
    background-size: 24px 24px;
    mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%);
    -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%);
  }

  .aurora-orb-1 {
    position: absolute;
    width: 650px; height: 650px;
    background: radial-gradient(ellipse, rgba(99, 102, 241, 0.14) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
    animation: orb-float 16s ease-in-out infinite alternate;
  }
  .aurora-orb-2 {
    position: absolute;
    width: 500px; height: 500px;
    background: radial-gradient(ellipse, rgba(139, 92, 246, 0.12) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
    animation: orb-float 20s ease-in-out infinite alternate-reverse;
  }

  @keyframes orb-float {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(40px, 24px) scale(1.06); }
  }

  .glass-login {
    background: rgba(11, 13, 33, 0.84);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(255, 255, 255, 0.11);
    box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 0 40px -10px rgba(99, 102, 241, 0.12);
  }

  .glass-left {
    background: rgba(6, 7, 22, 0.65);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-right: 1px solid rgba(255, 255, 255, 0.07);
  }

  .brand-logo-mark {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%);
    border: 1px solid rgba(255, 255, 255, 0.22);
    color: #ffffff;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 4px 14px rgba(99, 102, 241, 0.4);
    flex-shrink: 0;
  }

  .input-field {
    background: rgba(14, 16, 40, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.10);
    color: #ffffff;
    transition: all 0.2s ease;
    outline: none;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25);
  }

  .input-field::placeholder {
    color: rgba(148, 163, 184, 0.45);
  }

  .input-field:focus {
    background: rgba(18, 20, 48, 0.95);
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.10);
  }

  .input-error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 50px #0e1028 inset !important;
    -webkit-text-fill-color: #ffffff !important;
  }

  .role-tab {
    color: rgba(148, 163, 184, 0.75);
    border: 1px solid transparent;
    background: transparent;
    transition: all 0.2s ease;
  }

  .role-tab:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
  }

  .role-tab-active {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.24), rgba(139, 92, 246, 0.18));
    border-color: rgba(99, 102, 241, 0.40) !important;
    color: #ffffff;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 2px 10px rgba(99, 102, 241, 0.2);
  }

  .submit-btn {
    position: relative;
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #4338ca 100%);
    border: 1px solid rgba(255, 255, 255, 0.22);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 6px 20px -3px rgba(99, 102, 241, 0.5);
    transition: all 0.2s ease;
    overflow: hidden;
  }
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(1.08);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 10px 25px -3px rgba(99, 102, 241, 0.65);
  }
  .submit-btn:active:not(:disabled) {
    transform: translateY(0) scale(0.99);
  }
`;

const roleIcons: Record<string, ReactNode> = {
  superadmin: <Shield size={15} className="text-violet-400" />,
  admin: <Zap size={15} className="text-cyan-400" />,
  manager: <Users size={15} className="text-emerald-400" />,
};

const roleColors: Record<string, string> = {
  superadmin: 'from-violet-500/20 via-purple-500/10 to-transparent border-violet-500/30 text-violet-300',
  admin: 'from-cyan-500/20 via-blue-500/10 to-transparent border-cyan-500/30 text-cyan-300',
  manager: 'from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-500/30 text-emerald-300',
};

export default function PublicAuthSignInPage() {
  const t = useTranslations('AUTH');
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleConfig>(ROLES[0]);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const isProduction = process.env.NODE_ENV === 'production';
  const demoFillEnabled = !isProduction && process.env.NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED === 'true';

  const { getKey, clearKey } = usePublicAuthIdempotencyKey();
  const loginMutation = usePublicAuthLoginMutation();

  const validationSchema = useMemo(() => createPublicAuthLoginSchema({
    emailRequired: t('VALIDATION.emailRequired'),
    passwordRequired: t('VALIDATION.passwordRequired'),
  }), [t]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PublicAuthLoginFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: ROLES[0].email,
      password: ROLES[0].password,
      role: 'superadmin',
    },
  });

  // Watch input changes to clear idempotency key
  useEffect(() => {
    const subscription = watch(() => clearKey());
    return () => subscription.unsubscribe();
  }, [watch, clearKey]);

  const handleRoleSelect = (role: RoleConfig) => {
    setSelectedRole(role);
    setValue('email', role.email, { shouldValidate: false, shouldDirty: true });
    setValue('password', role.password, { shouldValidate: false, shouldDirty: true });
    setValue('role', role.id, { shouldValidate: true, shouldDirty: true });
  };

  const handleDemoFill = () => {
    setValue('email', PUBLIC_AUTH_SIGN_IN_DEMO.email, { shouldValidate: true, shouldDirty: true });
    setValue('password', PUBLIC_AUTH_SIGN_IN_DEMO.password, { shouldValidate: true, shouldDirty: true });
    setValue('role', PUBLIC_AUTH_SIGN_IN_DEMO.role, { shouldValidate: true, shouldDirty: true });
    const matched = ROLES.find((r) => r.id === PUBLIC_AUTH_SIGN_IN_DEMO.role);
    if (matched) setSelectedRole(matched);
  };

  const isBusy = loginMutation.isPending || isSubmitting;

  const onSubmit = async (data: PublicAuthLoginFormData) => {
    try {
      const idempotencyKey = await getKey();
      await loginMutation.mutateAsync({
        payload: { email: data.email, password: data.password, role: data.role },
        idempotencyKey,
      });
      clearKey();

      const matchedRole = ROLES.find((r) => r.id === data.role);
      const mockToken = btoa(JSON.stringify({ role: data.role, email: data.email, exp: Date.now() + 900000 }));
      const mockUser = { id: `${data.role}-001`, name: matchedRole?.label ?? data.role, email: data.email, role: data.role, phone: '' };

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        document.cookie = `access_token=${mockToken}; path=/; SameSite=Strict; max-age=900`;
      }

      setLoginSuccess(true);
      const target = PUBLIC_AUTH_ROLE_REDIRECTS[data.role] ?? '/admin';
      router.replace(target);

      setTimeout(() => {
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/public_auth')) {
          window.location.href = target;
        }
      }, 1000);
    } catch (error) {
      const fieldMap: Record<string, keyof PublicAuthLoginFormData> = { email: 'email', password: 'password', role: 'role' };
      const validationErrors = error instanceof PublicAuthApiError ? error.validationErrors : [];
      let hasUnknownField = false;
      for (const validationError of validationErrors) {
        const field = fieldMap[validationError.field];
        if (field) {
          setError(field, { type: 'server', message: t('errors.requestFailed') });
        } else {
          hasUnknownField = true;
        }
      }
      if (validationErrors.length === 0 || hasUnknownField) {
        setError('root.server', {
          type: 'server',
          message: getPublicAuthApiErrorMessage(error, {
            configuration: t('errors.configuration'),
            connection: t('errors.connection'),
            requestFailed: t('errors.requestFailed'),
            unexpected: t('errors.unexpected'),
          }),
        });
      }
    }
  };

  return (
    <main className="login-bg min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden flex text-white relative">
      <style dangerouslySetInnerHTML={{ __html: LOGIN_CSS }} />

      {/* Subtle Background Lighting */}
      <div className="absolute inset-0 dot-grid opacity-35 pointer-events-none" />
      <div className="aurora-orb-1" style={{ top: '-20%', left: '-10%' }} />
      <div className="aurora-orb-2" style={{ bottom: '-15%', right: '-10%' }} />

      {/* SUCCESS / REDIRECT OVERLAY */}
      {loginSuccess && <PublicAuthBlockerOverlay />}

      {/* ── LEFT BRAND PANEL (Desktop single-viewport fit) ── */}
      <section className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col justify-between p-8 xl:p-12 h-full glass-left relative z-10">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <span className="brand-logo-mark" aria-hidden="true">
            <BookOpen size={18} strokeWidth={2.2} className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-white flex items-center">
            <span>Library</span>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-black ml-0.5">OS</span>
          </span>
        </div>

        {/* Center Content: User's exact multi-branch copy */}
        <div className="max-w-xl space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Multi-Branch Study Library Management System
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              One Platform. Every Branch.<br />
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Complete Control.
              </span>
            </h1>

            <p className="text-slate-300/90 text-sm xl:text-base leading-relaxed">
              Manage your entire study library operation from one centralized platform. Oversee multiple branches, manage student admissions and memberships, organize seats and shifts, track attendance, assign smart lockers, and monitor fees, finance and daily operations — all in one place.
            </p>
          </div>

          <div className="pt-1">
            <div className="inline-flex items-center gap-2.5 rounded-xl border border-indigo-500/25 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent px-4 py-2.5 text-xs font-bold text-white shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
              <span>Designed for Modern Study Libraries &amp; Reading Rooms.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3">
          <p>&copy; {new Date().getFullYear()} LibraryOS. All rights reserved.</p>
          <span className="text-[11px] text-slate-500">Multi-Branch Platform</span>
        </div>
      </section>

      {/* ── RIGHT AUTH PANEL (Compact premium login section, NO SCROLL) ── */}
      <section className="w-full lg:w-[48%] xl:w-[45%] flex items-center justify-center p-4 sm:p-6 lg:p-8 h-full relative z-10">
        <div className="w-full max-w-[380px] xl:max-w-[390px]">

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center items-center gap-2.5 mb-5">
            <span className="brand-logo-mark" aria-hidden="true">
              <BookOpen size={18} strokeWidth={2.2} className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center">
              <span>Library</span>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-black ml-0.5">OS</span>
            </span>
          </div>

          <div className="glass-login rounded-2xl p-6 sm:p-7">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-cyan-500/10 border border-indigo-500/30 mb-2.5 shadow-md shadow-indigo-500/10">
                <Lock size={18} className="text-indigo-400" />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-white">Sign In</h2>
              <p className="text-slate-400 text-xs mt-0.5">Select your role to access your workspace</p>
            </div>

            {/* Non-production Demo Fill Button */}
            {demoFillEnabled && (
              <div className="mb-3 flex justify-end">
                <button
                  data-testid="auth-login-demo-fill"
                  type="button"
                  disabled={isBusy}
                  onClick={handleDemoFill}
                  className="rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-0.5 text-[11px] font-semibold text-indigo-300 hover:bg-indigo-500/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                >
                  {t('COMMON.demoFill')}
                </button>
              </div>
            )}

            {/* Role Selector */}
            <div className="grid grid-cols-3 gap-1.5 mb-3 p-1 rounded-xl bg-[rgba(10,10,28,0.7)] border border-white/[0.08]">
              {ROLES.map((role) => {
                const isActive = selectedRole.id === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    id={`role-btn-${role.id}`}
                    data-testid={`auth-login-role-${role.id}-select`}
                    aria-pressed={isActive}
                    disabled={isBusy}
                    onClick={() => handleRoleSelect(role)}
                    className={`py-2 px-1 rounded-lg text-xs font-bold transition-all duration-200 flex flex-col items-center gap-1 role-tab cursor-pointer ${isActive ? 'role-tab-active' : ''}`}
                  >
                    <span>{roleIcons[role.id]}</span>
                    <span>{role.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Role Info Banner */}
            <div className={`bg-gradient-to-r ${roleColors[selectedRole.id]} border rounded-lg px-3 py-1.5 flex items-center gap-2 mb-3.5 text-xs`}>
              <span className="text-sm shrink-0">{selectedRole.icon}</span>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-white text-[11px] block truncate">{selectedRole.label} Portal</span>
                <span className="text-[10px] text-slate-400 block truncate">Destination: {ROLE_DEST_LABEL[selectedRole.id]}</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
              <input
                type="hidden"
                data-testid="auth-login-role-value"
                {...register('role')}
                value={selectedRole.id}
              />

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="login-email" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Email Address
                  <span aria-hidden="true" className="ml-1 text-indigo-400">*</span>
                  <span className="sr-only">{t('COMMON.required')}</span>
                </label>
                <input
                  id="login-email"
                  data-testid="auth-login-email-input"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Enter your email"
                  disabled={isBusy}
                  {...register('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'auth-login-email-error' : undefined}
                  className={`input-field w-full rounded-lg px-3.5 py-2.5 text-sm ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && (
                  <p
                    id="auth-login-email-error"
                    data-testid="auth-login-email-validation-error"
                    className="text-rose-400 text-xs font-medium mt-1 flex items-center gap-1"
                    role="alert"
                  >
                    <span>⚠</span>{errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="login-password" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Password
                    <span aria-hidden="true" className="ml-1 text-indigo-400">*</span>
                    <span className="sr-only">{t('COMMON.required')}</span>
                  </label>
                  <Link href={PUBLIC_AUTH_INTERNAL_URLS.FORGOT_PASSWORD} className="text-[11px] text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    data-testid="auth-login-password-input"
                    type={showPw ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    disabled={isBusy}
                    {...register('password')}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'auth-login-password-error' : undefined}
                    className={`input-field w-full rounded-lg px-3.5 py-2.5 text-sm pr-10 ${errors.password ? 'input-error' : ''}`}
                  />
                  <button
                    type="button"
                    data-testid="auth-login-password-toggle"
                    disabled={isBusy}
                    aria-label={showPw ? t('PASSWORD.hide') : t('PASSWORD.show')}
                    aria-pressed={showPw}
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p
                    id="auth-login-password-error"
                    data-testid="auth-login-password-validation-error"
                    className="text-rose-400 text-xs font-medium mt-1 flex items-center gap-1"
                    role="alert"
                  >
                    <span>⚠</span>{errors.password.message}
                  </p>
                )}
              </div>

              {/* Root Server Error */}
              {errors.root?.server?.message && (
                <div
                  data-testid="auth-login-server-error-state"
                  className="bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs px-3 py-2 rounded-lg flex items-start gap-2"
                  role="alert"
                >
                  <span className="shrink-0 mt-0.5">⚠️</span>
                  <span>{errors.root.server.message}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                id="login-submit-btn"
                data-testid="auth-login-submit"
                type="submit"
                disabled={isBusy || loginSuccess}
                className="submit-btn w-full text-white font-bold text-sm py-2.5 rounded-xl transition-all mt-1 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isBusy || loginSuccess ? (
                  <PublicAuthButtonLoader />
                ) : (
                  <>
                    <Lock size={14} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-4 pt-3 border-t border-white/[0.08] text-center">
              <p className="text-xs text-slate-400">
                New to LibraryOS?{' '}
                <Link href={PUBLIC_AUTH_INTERNAL_URLS.SIGNUP} className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
