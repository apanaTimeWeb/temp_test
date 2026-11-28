'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, BookOpen, Send, KeyRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  PublicAuthPasswordRecoveryApiError,
  getPublicAuthPasswordRecoveryApiErrorMessage,
} from '@/app/public_auth/auth_password_recovery/api/PublicAuthPasswordRecoveryApi';
import { PUBLIC_AUTH_PASSWORD_RECOVERY_URLS } from '@/app/public_auth/auth_password_recovery/config/public_auth_password_recovery_url_config';
import '@/app/public_auth/auth_password_recovery/components/PublicAuthPasswordRecoveryStyles.css';
import { usePublicAuthPasswordRecoveryMutation } from '@/app/public_auth/auth_password_recovery/hooks/usePublicAuthPasswordRecoveryMutation';
import { usePublicAuthPasswordRecoveryIdempotencyKey } from '@/app/public_auth/auth_password_recovery/hooks/usePublicAuthPasswordRecoveryIdempotencyKey';
import { publicAuthPasswordRecoveryRequestFixture } from '@/app/public_auth/auth_password_recovery/mocks/fixtures/PublicAuthPasswordRecoveryFixtures';
import {
  createPublicAuthPasswordRecoverySchema,
  type PublicAuthPasswordRecoveryFormData,
} from '@/app/public_auth/auth_password_recovery/schemas/PublicAuthPasswordRecoveryValidationSchemas';

/** Password recovery identity request screen returning generic enumeration-safe confirmation. */
export default function PublicAuthPasswordRecoveryPage() {
  const t = useTranslations('AUTH');
  const demoFillEnabled =
    process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED === 'true';
  const [requestAccepted, setRequestAccepted] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const { getKey, clearKey } = usePublicAuthPasswordRecoveryIdempotencyKey();
  const recoveryMutation = usePublicAuthPasswordRecoveryMutation();
  const validationSchema = useMemo(
    () =>
      createPublicAuthPasswordRecoverySchema({
        identityRequired: t('VALIDATION.identityRequired'),
      }),
    [t]
  );
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
      <div className="absolute inset-0 rec-dot-grid opacity-50" />
      <div className="rec-aurora-orb-1" />
      <div className="rec-aurora-orb-2" />

      <div className="w-full max-w-md relative z-10 space-y-5 my-8">
        <Link
          data-testid="auth-forgot-back-to-login-link"
          href={PUBLIC_AUTH_PASSWORD_RECOVERY_URLS.LOGIN}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-950/60 px-4 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-900/60 motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" /> {t('COMMON.backToLogin')}
        </Link>

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl blur-md opacity-80" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Library<span className="rec-gradient-text">OS</span>
            </span>
          </div>
        </div>

        <section className="rec-glass-card rounded-3xl p-6 sm:p-8" aria-labelledby="auth-forgot-title">
          {!requestAccepted ? (
            <>
              <header className="mb-6 space-y-3 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-950/70 to-violet-950/70 border border-indigo-500/30 mx-auto shadow-lg">
                  <KeyRound size={22} className="text-indigo-400" />
                </div>
                <h1 id="auth-forgot-title" className="text-2xl font-black tracking-tight text-white">
                  {t('FORGOT.title')}
                </h1>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-400">{t('FORGOT.description')}</p>
              </header>

              <form data-testid="auth-forgot-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {demoFillEnabled && (
                  <div className="flex justify-end">
                    <button
                      data-testid="auth-forgot-demo-fill"
                      type="button"
                      disabled={isBusy}
                      onClick={() =>
                        setValue('identity', publicAuthPasswordRecoveryRequestFixture.identity, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      className="rounded-lg border border-indigo-500/30 bg-indigo-950/60 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/60 motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
                    maxLength={30}
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
                    className={`rec-input-field min-h-11 w-full rounded-xl px-4 py-3 text-sm ${errors.identity ? 'rec-input-error' : ''}`}
                  />
                  {errors.identity ? (
                    <p id="auth-forgot-identity-error" data-testid="auth-forgot-identity-validation-error" className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1" role="alert">
                      <span>⚠</span>{errors.identity.message}
                    </p>
                  ) : (
                    <p id="auth-forgot-identity-help" className="text-xs text-slate-400">{t('FORGOT.helper')}</p>
                  )}
                </div>

                {errors.root?.server?.message && (
                  <p data-testid="auth-forgot-server-error-state" className="rounded-xl border border-rose-500/30 bg-rose-950/60 p-3 text-xs sm:text-sm text-rose-300 flex items-center gap-2" role="alert">
                    <span>⚠️</span>
                    <span>{errors.root.server.message}</span>
                  </p>
                )}

                <button
                  data-testid="auth-forgot-submit"
                  type="submit"
                  disabled={isBusy}
                  className="rec-shimmer-btn rec-glow-indigo flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white hover:opacity-95 motion-safe:active:scale-95 motion-safe:transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg mt-2"
                >
                  {isBusy && <span className="h-4 w-4 motion-safe:animate-spin rounded-full border-2 border-white border-r-transparent" aria-hidden="true" />}
                  <Send size={16} strokeWidth={2} aria-hidden="true" />
                  <span>{isBusy ? t('FORGOT.submitting') : t('FORGOT.submit')}</span>
                </button>
              </form>
            </>
          ) : (
            <div data-testid="auth-forgot-accepted-state" className="space-y-4 text-center py-2" role="status" aria-live="polite">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 mx-auto text-xl font-black" aria-hidden="true">
                ✓
              </span>
              <h1 id="auth-forgot-title" className="text-2xl font-black text-white tracking-tight">
                {t('FORGOT.acceptedTitle')}
              </h1>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300">{confirmationMessage}</p>
              <p className="text-xs text-slate-400">{t('FORGOT.securityNote')}</p>
              <div className="pt-2">
                <Link
                  data-testid="auth-forgot-continue-to-reset-link"
                  href={PUBLIC_AUTH_PASSWORD_RECOVERY_URLS.RESET_PASSWORD}
                  className="rec-shimmer-btn rec-glow-indigo flex min-h-11 items-center justify-center rounded-xl px-4 py-3 font-bold text-sm text-white hover:opacity-95 motion-safe:transition-all"
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
