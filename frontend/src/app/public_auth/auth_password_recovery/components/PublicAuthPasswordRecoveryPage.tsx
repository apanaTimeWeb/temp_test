'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, BookOpen, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PublicAuthPasswordRecoveryApiError, getPublicAuthPasswordRecoveryApiErrorMessage } from '@/app/public_auth/auth_password_recovery/api/PublicAuthPasswordRecoveryApi';
import { PUBLIC_AUTH_PASSWORD_RECOVERY_URLS } from '@/app/public_auth/auth_password_recovery/config/public_auth_password_recovery_url_config';
import { usePublicAuthPasswordRecoveryMutation } from '@/app/public_auth/auth_password_recovery/hooks/usePublicAuthPasswordRecoveryMutation';
import { usePublicAuthPasswordRecoveryIdempotencyKey } from '@/app/public_auth/auth_password_recovery/hooks/usePublicAuthPasswordRecoveryIdempotencyKey';
import { publicAuthPasswordRecoveryRequestFixture } from '@/app/public_auth/auth_password_recovery/mocks/fixtures/PublicAuthPasswordRecoveryFixtures';
import { createPublicAuthPasswordRecoverySchema, type PublicAuthPasswordRecoveryFormData } from '@/app/public_auth/auth_password_recovery/schemas/PublicAuthPasswordRecoveryValidationSchemas';

/**
 * Owns recovery-request input, mutation state, localized feedback, and the accepted-request next step.
 * Dependencies: host auth API configuration and the `AUTH` next-intl namespace.
 * Edge cases: configuration/network/server failures preserve the entered identity and do not show accepted state; the backend must apply anti-enumeration and rate-limit policy.
 */
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

  // Data-flow rationale: edits invalidate the reusable idempotency key; both subscription methods are dependencies and the observer is cleaned up on unmount.
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
          // Use localized module copy, not an unapproved server-supplied message.
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
    <main className="flex min-h-screen items-center justify-center bg-page p-4 text-primary sm:p-8">
      <div className="w-full max-w-md space-y-5">
        <Link data-testid="auth-forgot-back-to-login-link" href={PUBLIC_AUTH_PASSWORD_RECOVERY_URLS.LOGIN} className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" /> {t('COMMON.backToLogin')}
        </Link>
        <div className="flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-on-primary"><BookOpen size={18} strokeWidth={2} aria-hidden="true" /></span>
          <span className="text-xl font-bold">{t('BRAND')}</span>
        </div>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8" aria-labelledby="auth-forgot-title">
          {!requestAccepted ? (
            <>
              <header className="mb-6 space-y-2">
                <h1 id="auth-forgot-title" className="text-2xl font-bold">{t('FORGOT.title')}</h1>
                <p className="text-sm leading-relaxed text-secondary">{t('FORGOT.description')}</p>
              </header>
              <form data-testid="auth-forgot-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {demoFillEnabled && <button data-testid="auth-forgot-demo-fill" type="button" disabled={isBusy} onClick={() => setValue('identity', publicAuthPasswordRecoveryRequestFixture.identity, { shouldDirty: true, shouldValidate: true })} className="min-h-11 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('COMMON.demoFill')}</button>}
              
                <div className="space-y-1.5">
                  <label htmlFor="auth-forgot-identity" className="block text-sm font-medium text-secondary">{t('FORGOT.identityLabel')}<span aria-hidden="true" className="ml-1">*</span><span className="sr-only">{t('COMMON.required')}</span></label>
                  <input
                    id="auth-forgot-identity" data-testid="auth-forgot-identity-input" required
                    type="text"
                    autoComplete="username"
                    {...register('identity')}
                    aria-invalid={Boolean(errors.identity)}
                    aria-describedby={errors.identity ? 'auth-forgot-identity-error' : 'auth-forgot-identity-help'}
                    className="min-h-11 w-full rounded-lg border border-border bg-input px-3 text-primary placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled"
                   disabled={isBusy} />
                  {errors.identity
                    ? <p id="auth-forgot-identity-error" data-testid="auth-forgot-identity-validation-error" className="text-sm text-danger" role="alert">{errors.identity.message}</p>
                    : <p id="auth-forgot-identity-help" className="text-xs text-secondary">{t('FORGOT.helper')}</p>}
                </div>
                {errors.root?.server?.message && <p data-testid="auth-forgot-server-error-state" className="rounded-lg border border-danger bg-danger-bg p-3 text-sm text-danger" role="alert">{errors.root.server.message}</p>}
                <button data-testid="auth-forgot-submit" type="submit" disabled={isBusy} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-on-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  {(isBusy) && <span className="h-4 w-4 motion-safe:animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none" aria-hidden="true" />}
                  <Send size={18} strokeWidth={2} aria-hidden="true" /> {isBusy ? t('FORGOT.submitting') : t('FORGOT.submit')}
                </button>
              </form>
            </>
          ) : (
            <div data-testid="auth-forgot-accepted-state" className="space-y-4" role="status" aria-live="polite">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success-bg text-success" aria-hidden="true">✓</span>
              <h1 id="auth-forgot-title" className="text-2xl font-bold">{t('FORGOT.acceptedTitle')}</h1>
              <p className="text-sm leading-relaxed text-secondary">{confirmationMessage}</p>
              <p className="text-sm text-secondary">{t('FORGOT.securityNote')}</p>
              <Link data-testid="auth-forgot-continue-to-reset-link" href={PUBLIC_AUTH_PASSWORD_RECOVERY_URLS.RESET_PASSWORD} className="flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 py-3 font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('FORGOT.continueToReset')}</Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
