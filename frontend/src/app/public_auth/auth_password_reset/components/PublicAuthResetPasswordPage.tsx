'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PublicAuthPasswordResetApiError, getPublicAuthPasswordResetApiErrorMessage } from '@/app/public_auth/auth_password_reset/api/PublicAuthPasswordResetApi';
import { PUBLIC_AUTH_PASSWORD_RESET_URLS } from '@/app/public_auth/auth_password_reset/config/public_auth_password_reset_url_config';
import PublicAuthPasswordResetOtpInput from '@/app/public_auth/auth_password_reset/components/PublicAuthPasswordResetOtpInput';
import PublicAuthPasswordStrengthMeter from '@/app/public_auth/auth_password_reset/components/PublicAuthPasswordStrengthMeter';
import { usePublicAuthPasswordResetMutation } from '@/app/public_auth/auth_password_reset/hooks/usePublicAuthPasswordResetMutation';
import { usePublicAuthPasswordResetIdempotencyKey } from '@/app/public_auth/auth_password_reset/hooks/usePublicAuthPasswordResetIdempotencyKey';
import { PUBLIC_AUTH_PASSWORD_RESET_DEMO } from '@/app/public_auth/auth_password_reset/mocks/fixtures/PublicAuthPasswordResetFixtures';
import { createPublicAuthResetPasswordSchema, type PublicAuthResetPasswordFormData } from '@/app/public_auth/auth_password_reset/schemas/PublicAuthPasswordResetValidationSchemas';

const RESET_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; }

  .reset-bg {
    background: #030712;
    font-family: 'Inter', sans-serif;
  }

  .dot-grid {
    background-image: radial-gradient(rgba(99,102,241,0.12) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  .aurora-orb-1 {
    position: absolute;
    width: 600px; height: 600px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.16) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
  }
  .aurora-orb-2 {
    position: absolute;
    width: 500px; height: 500px;
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

export default function PublicAuthResetPasswordPage() {
  const t = useTranslations('AUTH');
  const demoFillEnabled = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED === 'true';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { getKey, clearKey } = usePublicAuthPasswordResetIdempotencyKey();
  const resetMutation = usePublicAuthPasswordResetMutation();
  const validationSchema = useMemo(() => createPublicAuthResetPasswordSchema({
    otpLength: t('VALIDATION.otpLength'),
    otpDigits: t('VALIDATION.otpDigits'),
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
  } = useForm<PublicAuthResetPasswordFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: { otp: '', newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    const subscription = watch(() => clearKey());
    return () => subscription.unsubscribe();
  }, [watch, clearKey]);

  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');
  const otpValue = watch('otp');

  const isBusy = resetMutation.isPending || isSubmitting;

  const onSubmit = async (values: PublicAuthResetPasswordFormData) => {
    const payload = { otp: values.otp, newPassword: values.newPassword };
    try {
      await resetMutation.mutateAsync({ payload, idempotencyKey: await getKey() });
      clearKey();
      setCompleted(true);
    } catch (error) {
      const fieldMap: Record<string, keyof PublicAuthResetPasswordFormData> = { otp: 'otp', newPassword: 'newPassword' };
      const validationErrors = error instanceof PublicAuthPasswordResetApiError ? error.validationErrors : [];
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
          message: getPublicAuthPasswordResetApiErrorMessage(error, {
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
    <main className="reset-bg relative min-h-screen flex items-center justify-center p-4 sm:p-8 text-white overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: RESET_CSS }} />

      <div className="absolute inset-0 dot-grid opacity-50" />
      <div className="aurora-orb-1" style={{ top: '-15%', left: '-15%' }} />
      <div className="aurora-orb-2" style={{ bottom: '-15%', right: '-15%' }} />

      <div className="w-full max-w-lg relative z-10 space-y-5 my-8">
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
        </div>

        {/* Reset Glass Card */}
        <section className="glass-card rounded-3xl p-6 sm:p-8" aria-labelledby="auth-reset-title">
          {!completed ? (
            <>
              <header className="mb-6 space-y-3 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 mx-auto shadow-lg shadow-indigo-500/10">
                  <ShieldCheck size={24} className="text-indigo-400" />
                </div>
                <h1 id="auth-reset-title" className="text-2xl font-black tracking-tight text-white">
                  {t('RESET.title')}
                </h1>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                  {t('RESET.description')}
                </p>
              </header>

              <form data-testid="auth-reset-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {demoFillEnabled && (
                  <div className="flex justify-end">
                    <button
                      data-testid="auth-reset-demo-fill"
                      type="button"
                      disabled={isBusy}
                      onClick={() => {
                        setValue('otp', PUBLIC_AUTH_PASSWORD_RESET_DEMO.otp, { shouldDirty: true, shouldValidate: true });
                        setValue('newPassword', PUBLIC_AUTH_PASSWORD_RESET_DEMO.newPassword, { shouldDirty: true });
                        setValue('confirmPassword', PUBLIC_AUTH_PASSWORD_RESET_DEMO.confirmPassword, { shouldDirty: true });
                      }}
                      className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {t('COMMON.demoFill')}
                    </button>
                  </div>
                )}

                {/* 6-Digit OTP */}
                <div className="space-y-2">
                  <PublicAuthPasswordResetOtpInput
                    value={otpValue}
                    disabled={isBusy}
                    invalid={Boolean(errors.otp)}
                    errorId={errors.otp ? 'auth-reset-otp-error' : undefined}
                    label={t('RESET.otpLabel')}
                    digitLabel={t('RESET.otpDigit')}
                    requiredLabel={t('COMMON.required')}
                    onChange={(otp) => setValue('otp', otp, { shouldValidate: true, shouldDirty: true })}
                  />
                  <input data-testid="auth-reset-otp-value" type="hidden" {...register('otp')} />
                  {errors.otp && (
                    <p id="auth-reset-otp-error" data-testid="auth-reset-otp-validation-error" className="text-center text-xs text-rose-400 font-medium mt-1" role="alert">
                      {errors.otp.message}
                    </p>
                  )}
                  <p className="text-center text-[11px] text-slate-400">{t('RESET.otpHelp')}</p>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label htmlFor="auth-reset-password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {t('RESET.newPasswordLabel')}
                    <span aria-hidden="true" className="ml-1 text-indigo-400">*</span>
                    <span className="sr-only">{t('COMMON.required')}</span>
                  </label>
                  <div className="relative">
                    <input
                      id="auth-reset-password"
                      data-testid="auth-reset-password-input"
                      required
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Enter new password"
                      disabled={isBusy}
                      {...register('newPassword')}
                      aria-invalid={Boolean(errors.newPassword)}
                      aria-describedby={errors.newPassword ? 'auth-reset-password-error' : undefined}
                      className={`input-field min-h-11 w-full rounded-xl px-4 py-2.5 pr-12 text-sm ${errors.newPassword ? 'input-error' : ''}`}
                    />
                    <button
                      data-testid="auth-reset-password-toggle"
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
                  {errors.newPassword && (
                    <p id="auth-reset-password-error" data-testid="auth-reset-password-validation-error" className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1" role="alert">
                      <span>⚠</span>{errors.newPassword.message}
                    </p>
                  )}
                  <PublicAuthPasswordStrengthMeter password={newPassword} />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label htmlFor="auth-reset-confirm" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {t('RESET.confirmPasswordLabel')}
                    <span aria-hidden="true" className="ml-1 text-indigo-400">*</span>
                    <span className="sr-only">{t('COMMON.required')}</span>
                  </label>
                  <div className="relative">
                    <input
                      id="auth-reset-confirm"
                      data-testid="auth-reset-confirm-password-input"
                      required
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Confirm new password"
                      disabled={isBusy}
                      {...register('confirmPassword')}
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={errors.confirmPassword ? 'auth-reset-confirm-error' : undefined}
                      className={`input-field min-h-11 w-full rounded-xl px-4 py-2.5 pr-12 text-sm ${confirmPassword && confirmPassword === newPassword && !errors.confirmPassword ? 'border-emerald-500' : ''} ${errors.confirmPassword ? 'input-error' : ''}`}
                    />
                    <button
                      data-testid="auth-reset-confirm-password-toggle"
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
                    <p id="auth-reset-confirm-error" data-testid="auth-reset-confirm-validation-error" className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1" role="alert">
                      <span>⚠</span>{errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {errors.root?.server?.message && (
                  <p data-testid="auth-reset-server-error-state" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs sm:text-sm text-rose-300 flex items-center gap-2" role="alert" aria-live="assertive">
                    <span>⚠️</span>
                    <span>{errors.root.server.message}</span>
                  </p>
                )}

                <button
                  data-testid="auth-reset-submit"
                  type="submit"
                  disabled={isBusy}
                  className="submit-btn shimmer-btn glow-indigo flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg mt-2"
                >
                  {isBusy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" aria-hidden="true" />}
                  <span>{isBusy ? t('RESET.submitting') : t('RESET.submit')}</span>
                </button>
              </form>

              <p className="mt-5 text-center text-xs sm:text-sm text-slate-400">
                <Link
                  data-testid="auth-reset-request-new-code-link"
                  href={PUBLIC_AUTH_PASSWORD_RESET_URLS.FORGOT_PASSWORD}
                  className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {t('RESET.requestNewCode')}
                </Link>
              </p>
            </>
          ) : (
            <div data-testid="auth-reset-completed-state" className="space-y-4 text-center py-2" role="status" aria-live="polite">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto text-xl font-black" aria-hidden="true">
                ✓
              </span>
              <h1 id="auth-reset-title" className="text-2xl font-black text-white tracking-tight">
                {t('RESET.successTitle')}
              </h1>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                {t('RESET.successDescription')}
              </p>
              <div className="pt-2">
                <Link
                  data-testid="auth-reset-back-to-login-link"
                  href={PUBLIC_AUTH_PASSWORD_RESET_URLS.LOGIN}
                  className="submit-btn shimmer-btn glow-indigo flex min-h-11 items-center justify-center rounded-xl px-4 py-3 font-bold text-sm text-white hover:opacity-95 transition-all"
                >
                  {t('RESET.backToLogin')}
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
