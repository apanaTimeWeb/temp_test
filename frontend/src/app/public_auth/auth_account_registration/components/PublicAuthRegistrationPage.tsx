'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen, Eye, EyeOff, Sparkles, User, Building, Mail, Phone, Lock, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PublicAuthRegistrationApiError, getPublicAuthRegistrationApiErrorMessage } from '@/app/public_auth/auth_account_registration/api/PublicAuthRegistrationApi';
import { PUBLIC_AUTH_REGISTRATION_URLS } from '@/app/public_auth/auth_account_registration/config/public_auth_registration_url_config';
import PublicAuthRegistrationPasswordStrengthMeter from '@/app/public_auth/auth_account_registration/components/PublicAuthRegistrationPasswordStrengthMeter';
import { usePublicAuthRegistrationMutation } from '@/app/public_auth/auth_account_registration/hooks/usePublicAuthRegistrationMutation';
import { usePublicAuthRegistrationIdempotencyKey } from '@/app/public_auth/auth_account_registration/hooks/usePublicAuthRegistrationIdempotencyKey';
import { PUBLIC_AUTH_REGISTRATION_DEMO } from '@/app/public_auth/auth_account_registration/mocks/fixtures/PublicAuthRegistrationFixtures';
import { createPublicAuthRegistrationSchema, type PublicAuthRegistrationFormData } from '@/app/public_auth/auth_account_registration/schemas/PublicAuthRegistrationValidationSchemas';
import type { PublicAuthRegistrationRequest } from '@/app/public_auth/auth_account_registration/types/PublicAuthRegistrationApiTypes';

const REGISTRATION_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; }

  .reg-bg {
    background: #030712;
    font-family: 'Inter', sans-serif;
  }

  .dot-grid {
    background-image: radial-gradient(rgba(99,102,241,0.12) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  .aurora-orb-1 {
    position: absolute;
    width: 650px; height: 650px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.16) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
  }
  .aurora-orb-2 {
    position: absolute;
    width: 550px; height: 550px;
    background: radial-gradient(ellipse, rgba(34,211,238,0.10) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
  }

  .glass-card {
    background: rgba(8,8,24,0.8);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    border: 1px solid rgba(99,102,241,0.22);
    box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 50px rgba(99,102,241,0.08);
  }

  .gradient-text {
    background: linear-gradient(135deg, #a78bfa 0%, #6366f1 40%, #22d3ee 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .input-field {
    background: rgba(10,10,28,0.85);
    border: 1px solid rgba(99,102,241,0.2);
    color: #fff;
    transition: all 0.2s;
    outline: none;
  }

  .input-field::placeholder {
    color: rgba(148,163,184,0.45);
  }

  .input-field:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  }

  .input-error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important;
  }

  .shimmer-btn {
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #22d3ee, #6366f1);
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .glow-indigo {
    box-shadow: 0 0 30px rgba(99,102,241,0.45);
  }
`;

export default function PublicAuthRegistrationPage() {
  const t = useTranslations('AUTH');
  const router = useRouter();
  const demoFillEnabled = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED === 'true';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { getKey, clearKey } = usePublicAuthRegistrationIdempotencyKey();
  const signupMutation = usePublicAuthRegistrationMutation();
  const validationSchema = useMemo(() => createPublicAuthRegistrationSchema({
    ownerNameMin: t('VALIDATION.ownerNameMin'),
    libraryNameRequired: t('VALIDATION.libraryNameRequired'),
    emailRequired: t('VALIDATION.emailRequired'),
    emailInvalid: t('VALIDATION.emailInvalid'),
    phoneRequired: t('VALIDATION.phoneRequired'),
    phoneInvalid: t('VALIDATION.phoneInvalid'),
    passwordMin: t('VALIDATION.passwordMin'),
    passwordUppercase: t('VALIDATION.passwordUppercase'),
    passwordNumber: t('VALIDATION.passwordNumber'),
    confirmPasswordRequired: t('VALIDATION.confirmPasswordRequired'),
    passwordMismatch: t('VALIDATION.passwordMismatch'),
  }), [t]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PublicAuthRegistrationFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: { ownerName: '', libraryName: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  useEffect(() => {
    const subscription = watch(() => clearKey());
    return () => subscription.unsubscribe();
  }, [watch, clearKey]);

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const isBusy = signupMutation.isPending || isSubmitting;

  const onSubmit = async (values: PublicAuthRegistrationFormData) => {
    const payload: PublicAuthRegistrationRequest = {
      ownerName: values.ownerName,
      libraryName: values.libraryName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    };
    try {
      await signupMutation.mutateAsync({ payload, idempotencyKey: await getKey() });
      clearKey();
      router.replace(PUBLIC_AUTH_REGISTRATION_URLS.POST_SUCCESS);
    } catch (error) {
      const fieldMap: Record<string, keyof PublicAuthRegistrationFormData> = { ownerName: 'ownerName', libraryName: 'libraryName', email: 'email', phone: 'phone', password: 'password' };
      const validationErrors = error instanceof PublicAuthRegistrationApiError ? error.validationErrors : [];
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
          message: getPublicAuthRegistrationApiErrorMessage(error, {
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
    <main className="reg-bg relative min-h-screen flex items-center justify-center p-4 sm:p-8 text-white overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: REGISTRATION_CSS }} />

      {/* Ambient background glows */}
      <div className="absolute inset-0 dot-grid opacity-50" />
      <div className="aurora-orb-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="aurora-orb-2" style={{ bottom: '-10%', right: '-10%' }} />

      <div className="w-full max-w-2xl relative z-10 space-y-6 my-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl blur-md opacity-80" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Library<span className="gradient-text">OS</span>
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles size={12} className="text-cyan-400" />
            Empowering Modern Indian Study Libraries
          </span>
        </div>

        {/* Signup Glass Card */}
        <section className="glass-card rounded-3xl p-6 sm:p-10" aria-labelledby="auth-signup-title">
          <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/5 pb-5">
            <div>
              <h1 id="auth-signup-title" className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {t('SIGNUP.title')}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">{t('SIGNUP.description')}</p>
            </div>
            {demoFillEnabled && (
              <button
                data-testid="auth-signup-demo-fill"
                type="button"
                disabled={isBusy}
                onClick={() => {
                  setValue('ownerName', PUBLIC_AUTH_REGISTRATION_DEMO.ownerName, { shouldDirty: true });
                  setValue('libraryName', PUBLIC_AUTH_REGISTRATION_DEMO.libraryName, { shouldDirty: true });
                  setValue('email', PUBLIC_AUTH_REGISTRATION_DEMO.email, { shouldDirty: true });
                  setValue('phone', PUBLIC_AUTH_REGISTRATION_DEMO.phone, { shouldDirty: true });
                  setValue('password', PUBLIC_AUTH_REGISTRATION_DEMO.password, { shouldDirty: true });
                  setValue('confirmPassword', PUBLIC_AUTH_REGISTRATION_DEMO.confirmPassword, { shouldDirty: true });
                }}
                className="self-start rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {t('COMMON.demoFill')}
              </button>
            )}
          </header>

          <form data-testid="auth-signup-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Owner & Library Name Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="auth-signup-owner" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {t('SIGNUP.ownerName')}
                  <span aria-hidden="true" className="ml-1 text-indigo-400">*</span>
                  <span className="sr-only">{t('COMMON.required')}</span>
                </label>
                <div className="relative">
                  <input
                    id="auth-signup-owner"
                    data-testid="auth-signup-owner-name-input"
                    required
                    type="text"
                    autoComplete="name"
                    placeholder="Enter owner full name"
                    disabled={isBusy}
                    {...register('ownerName')}
                    aria-invalid={Boolean(errors.ownerName)}
                    aria-describedby={errors.ownerName ? 'auth-signup-owner-error' : undefined}
                    className={`input-field min-h-11 w-full rounded-xl px-4 py-2.5 text-sm ${errors.ownerName ? 'input-error' : ''}`}
                  />
                </div>
                {errors.ownerName && (
                  <p id="auth-signup-owner-error" data-testid="auth-signup-owner-validation-error" className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1" role="alert">
                    <span>⚠</span>{errors.ownerName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="auth-signup-library" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {t('SIGNUP.libraryName')}
                  <span aria-hidden="true" className="ml-1 text-indigo-400">*</span>
                  <span className="sr-only">{t('COMMON.required')}</span>
                </label>
                <div className="relative">
                  <input
                    id="auth-signup-library"
                    data-testid="auth-signup-library-name-input"
                    required
                    type="text"
                    autoComplete="organization"
                    placeholder="e.g. Apex Study Library"
                    disabled={isBusy}
                    {...register('libraryName')}
                    aria-invalid={Boolean(errors.libraryName)}
                    aria-describedby={errors.libraryName ? 'auth-signup-library-error' : undefined}
                    className={`input-field min-h-11 w-full rounded-xl px-4 py-2.5 text-sm ${errors.libraryName ? 'input-error' : ''}`}
                  />
                </div>
                {errors.libraryName && (
                  <p id="auth-signup-library-error" data-testid="auth-signup-library-validation-error" className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1" role="alert">
                    <span>⚠</span>{errors.libraryName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="auth-signup-email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {t('SIGNUP.email')}
                  <span aria-hidden="true" className="ml-1 text-indigo-400">*</span>
                  <span className="sr-only">{t('COMMON.required')}</span>
                </label>
                <div className="relative">
                  <input
                    id="auth-signup-email"
                    data-testid="auth-signup-email-input"
                    required
                    type="email"
                    autoComplete="email"
                    placeholder="admin@yourlibrary.com"
                    disabled={isBusy}
                    {...register('email')}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'auth-signup-email-error' : undefined}
                    className={`input-field min-h-11 w-full rounded-xl px-4 py-2.5 text-sm ${errors.email ? 'input-error' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p id="auth-signup-email-error" data-testid="auth-signup-email-validation-error" className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1" role="alert">
                    <span>⚠</span>{errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="auth-signup-phone" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {t('SIGNUP.phone')}
                  <span aria-hidden="true" className="ml-1 text-indigo-400">*</span>
                  <span className="sr-only">{t('COMMON.required')}</span>
                </label>
                <div className="relative">
                  <input
                    id="auth-signup-phone"
                    data-testid="auth-signup-phone-input"
                    required
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    disabled={isBusy}
                    {...register('phone')}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'auth-signup-phone-error' : 'auth-signup-phone-help'}
                    className={`input-field min-h-11 w-full rounded-xl px-4 py-2.5 text-sm ${errors.phone ? 'input-error' : ''}`}
                  />
                </div>
                {errors.phone ? (
                  <p id="auth-signup-phone-error" data-testid="auth-signup-phone-validation-error" className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1" role="alert">
                    <span>⚠</span>{errors.phone.message}
                  </p>
                ) : (
                  <p id="auth-signup-phone-help" className="text-[11px] text-slate-400">{t('SIGNUP.phoneHelp')}</p>
                )}
              </div>
            </div>

            {/* Passwords Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="auth-signup-password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {t('SIGNUP.password')}
                  <span aria-hidden="true" className="ml-1 text-indigo-400">*</span>
                  <span className="sr-only">{t('COMMON.required')}</span>
                </label>
                <div className="relative">
                  <input
                    id="auth-signup-password"
                    data-testid="auth-signup-password-input"
                    required
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Create password"
                    disabled={isBusy}
                    {...register('password')}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'auth-signup-password-error' : undefined}
                    className={`input-field min-h-11 w-full rounded-xl px-4 py-2.5 pr-12 text-sm ${errors.password ? 'input-error' : ''}`}
                  />
                  <button
                    data-testid="auth-signup-password-toggle"
                    type="button"
                    disabled={isBusy}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? t('PASSWORD.hide') : t('PASSWORD.show')}
                    aria-pressed={showPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p id="auth-signup-password-error" data-testid="auth-signup-password-validation-error" className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1" role="alert">
                    <span>⚠</span>{errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="auth-signup-confirm" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {t('SIGNUP.confirmPassword')}
                  <span aria-hidden="true" className="ml-1 text-indigo-400">*</span>
                  <span className="sr-only">{t('COMMON.required')}</span>
                </label>
                <div className="relative">
                  <input
                    id="auth-signup-confirm"
                    data-testid="auth-signup-confirm-password-input"
                    required
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    disabled={isBusy}
                    {...register('confirmPassword')}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={errors.confirmPassword ? 'auth-signup-confirm-error' : undefined}
                    className={`input-field min-h-11 w-full rounded-xl px-4 py-2.5 pr-12 text-sm ${confirmPassword && confirmPassword === password && !errors.confirmPassword ? 'border-emerald-500' : ''} ${errors.confirmPassword ? 'input-error' : ''}`}
                  />
                  <button
                    data-testid="auth-signup-confirm-password-toggle"
                    type="button"
                    disabled={isBusy}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? t('PASSWORD.hide') : t('PASSWORD.show')}
                    aria-pressed={showConfirmPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="auth-signup-confirm-error" data-testid="auth-signup-confirm-validation-error" className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1" role="alert">
                    <span>⚠</span>{errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password Strength Meter */}
            <div className="pt-1">
              <PublicAuthRegistrationPasswordStrengthMeter password={password} />
            </div>

            {/* Server Error Notification */}
            {errors.root?.server?.message && (
              <p data-testid="auth-signup-server-error-state" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs sm:text-sm text-rose-300 flex items-center gap-2" role="alert" aria-live="assertive">
                <span>⚠️</span>
                <span>{errors.root.server.message}</span>
              </p>
            )}

            {/* Submit Button */}
            <button
              id="auth-signup-submit"
              data-testid="auth-signup-submit"
              type="submit"
              disabled={isBusy}
              className="submit-btn shimmer-btn glow-indigo flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg mt-4"
            >
              {isBusy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" aria-hidden="true" />}
              {isBusy ? t('SIGNUP.submitting') : t('SIGNUP.submit')}
            </button>
          </form>

          {/* Already have an account */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs sm:text-sm text-slate-400">
              {t('SIGNUP.alreadyAccount')}{' '}
              <Link
                data-testid="auth-signup-back-to-login-link"
                href={PUBLIC_AUTH_REGISTRATION_URLS.LOGIN}
                className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {t('SIGNUP.login')}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
