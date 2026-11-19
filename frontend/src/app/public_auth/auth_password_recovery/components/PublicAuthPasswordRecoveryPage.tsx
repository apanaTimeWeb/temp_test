'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, BookOpen, Send, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PublicAuthPasswordRecoveryApiError, getPublicAuthPasswordRecoveryApiErrorMessage } from '@/app/public_auth/auth_password_recovery/api/PublicAuthPasswordRecoveryApi';
import { PUBLIC_AUTH_PASSWORD_RECOVERY_URLS } from '@/app/public_auth/auth_password_recovery/config/public_auth_password_recovery_url_config';
import { usePublicAuthPasswordRecoveryMutation } from '@/app/public_auth/auth_password_recovery/hooks/usePublicAuthPasswordRecoveryMutation';
import { usePublicAuthPasswordRecoveryIdempotencyKey } from '@/app/public_auth/auth_password_recovery/hooks/usePublicAuthPasswordRecoveryIdempotencyKey';
import { publicAuthPasswordRecoveryRequestFixture } from '@/app/public_auth/auth_password_recovery/mocks/fixtures/PublicAuthPasswordRecoveryFixtures';
import { createPublicAuthPasswordRecoverySchema, type PublicAuthPasswordRecoveryFormData } from '@/app/public_auth/auth_password_recovery/schemas/PublicAuthPasswordRecoveryValidationSchemas';

const RECOVERY_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; }

  .rec-bg {
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
    background: radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 65%);
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

export default function PublicAuthPasswordRecoveryPage() {
  const t = useTranslations('AUTH');
  const demoFillEnabled = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED === 'true';
  const [requestAccepted, setRequestAccepted] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const { getKey, clearKey } = usePublicAuthPasswordRecoveryIdempotencyKey();
  const recoveryMutation = usePublicAuthPasswordRecoveryMutation();
  const validationSchema = useMemo(() => createPublicAuthPasswordRecoverySchema({
    identityRequired: t('VALIDATION.identityRequired'),
  }), [t]);
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PublicAuthPasswordRecoveryFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: { identity: '' },
  });

  useEffect(() => {
    const subscription = watch(() => clearKey());
    return () => subscription.unsubscribe();
  }, [watch, clearKey]);

  const isBusy = recoveryMutation.isPending || isSubmitting;

  const onSubmit = async (values: PublicAuthPasswordRecoveryFormData) => {
    try {
      await recoveryMutation.mutateAsync({ payload: values, idempotencyKey: await getKey() });
      clearKey();
      setConfirmationMessage(t('FORGOT.accepted'));
      setRequestAccepted(true);
    } catch (error) {
      const fieldMap: Record<string, keyof PublicAuthPasswordRecoveryFormData> = { identity: 'identity' };
      const validationErrors = error instanceof PublicAuthPasswordRecoveryApiError ? error.validationErrors : [];
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
          message: getPublicAuthPasswordRecoveryApiErrorMessage(error, {
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
    <main className="rec-bg relative min-h-screen flex items-center justify-center p-4 sm:p-8 text-white overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: RECOVERY_CSS }} />

      <div className="absolute inset-0 dot-grid opacity-50" />
      <div className="aurora-orb-1" style={{ top: '-15%', left: '-15%' }} />
      <div className="aurora-orb-2" style={{ bottom: '-15%', right: '-15%' }} />

      <div className="w-full max-w-md relative z-10 space-y-5 my-8">
        <Link
          data-testid="auth-forgot-back-to-login-link"
          href={PUBLIC_AUTH_PASSWORD_RECOVERY_URLS.LOGIN}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" /> {t('COMMON.backToLogin')}
        </Link>

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

        {/* Recovery Glass Card */}
        <section className="glass-card rounded-3xl p-6 sm:p-8" aria-labelledby="auth-forgot-title">
          {!requestAccepted ? (
            <>
              <header className="mb-6 space-y-3 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 mx-auto shadow-lg shadow-indigo-500/10">
                  <KeyRound size={22} className="text-indigo-400" />
                </div>
                <h1 id="auth-forgot-title" className="text-2xl font-black tracking-tight text-white">
                  {t('FORGOT.title')}
                </h1>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                  {t('FORGOT.description')}
                </p>
              </header>

              <form data-testid="auth-forgot-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {demoFillEnabled && (
                  <div className="flex justify-end">
                    <button
                      data-testid="auth-forgot-demo-fill"
                      type="button"
                      disabled={isBusy}
                      onClick={() => setValue('identity', publicAuthPasswordRecoveryRequestFixture.identity, { shouldDirty: true, shouldValidate: true })}
                      className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {t('COMMON.demoFill')}
                    </button>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="auth-forgot-identity" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {t('FORGOT.identityLabel')}
                    <span aria-hidden="true" className="ml-1 text-indigo-400">*</span>
                    <span className="sr-only">{t('COMMON.required')}</span>
                  </label>
                  <input
                    id="auth-forgot-identity"
                    data-testid="auth-forgot-identity-input"
                    required
                    type="text"
                    autoComplete="username"
                    placeholder="Enter registered email or phone"
                    {...register('identity')}
                    aria-invalid={Boolean(errors.identity)}
                    aria-describedby={errors.identity ? 'auth-forgot-identity-error' : 'auth-forgot-identity-help'}
                    disabled={isBusy}
                    className={`input-field min-h-11 w-full rounded-xl px-4 py-3 text-sm ${errors.identity ? 'input-error' : ''}`}
                  />
                  {errors.identity ? (
                    <p id="auth-forgot-identity-error" data-testid="auth-forgot-identity-validation-error" className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1" role="alert">
                      <span>⚠</span>{errors.identity.message}
                    </p>
                  ) : (
                    <p id="auth-forgot-identity-help" className="text-[11px] text-slate-400">{t('FORGOT.helper')}</p>
                  )}
                </div>

                {errors.root?.server?.message && (
                  <p data-testid="auth-forgot-server-error-state" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs sm:text-sm text-rose-300 flex items-center gap-2" role="alert">
                    <span>⚠️</span>
                    <span>{errors.root.server.message}</span>
                  </p>
                )}

                <button
                  data-testid="auth-forgot-submit"
                  type="submit"
                  disabled={isBusy}
                  className="submit-btn shimmer-btn glow-indigo flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg mt-2"
                >
                  {isBusy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" aria-hidden="true" />}
                  <Send size={16} strokeWidth={2} aria-hidden="true" />
                  <span>{isBusy ? t('FORGOT.submitting') : t('FORGOT.submit')}</span>
                </button>
              </form>
            </>
          ) : (
            <div data-testid="auth-forgot-accepted-state" className="space-y-4 text-center py-2" role="status" aria-live="polite">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto text-xl font-black" aria-hidden="true">
                ✓
              </span>
              <h1 id="auth-forgot-title" className="text-2xl font-black text-white tracking-tight">
                {t('FORGOT.acceptedTitle')}
              </h1>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                {confirmationMessage}
              </p>
              <p className="text-xs text-slate-400">
                {t('FORGOT.securityNote')}
              </p>
              <div className="pt-2">
                <Link
                  data-testid="auth-forgot-continue-to-reset-link"
                  href={PUBLIC_AUTH_PASSWORD_RECOVERY_URLS.RESET_PASSWORD}
                  className="submit-btn shimmer-btn glow-indigo flex min-h-11 items-center justify-center rounded-xl px-4 py-3 font-bold text-sm text-white hover:opacity-95 transition-all"
                >
                  {t('FORGOT.continueToReset')}
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
