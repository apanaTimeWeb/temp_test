'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PublicAuthPasswordResetApiError, getPublicAuthPasswordResetApiErrorMessage } from '@/app/public_auth/auth_password_reset/api/PublicAuthPasswordResetApi';
import { PUBLIC_AUTH_PASSWORD_RESET_URLS } from '@/app/public_auth/auth_password_reset/config/public_auth_password_reset_url_config';
import PublicAuthPasswordResetOtpInput from '@/app/public_auth/auth_password_reset/components/PublicAuthPasswordResetOtpInput';
import PublicAuthPasswordStrengthMeter from '@/app/public_auth/auth_password_reset/components/PublicAuthPasswordStrengthMeter';
import { usePublicAuthPasswordResetMutation } from '@/app/public_auth/auth_password_reset/hooks/usePublicAuthPasswordResetMutation';
import { usePublicAuthPasswordResetIdempotencyKey } from '@/app/public_auth/auth_password_reset/hooks/usePublicAuthPasswordResetIdempotencyKey';
import { PUBLIC_AUTH_PASSWORD_RESET_DEMO } from '@/app/public_auth/auth_password_reset/mocks/fixtures/PublicAuthPasswordResetFixtures';
import { createPublicAuthResetPasswordSchema, type PublicAuthResetPasswordFormData } from '@/app/public_auth/auth_password_reset/schemas/PublicAuthPasswordResetValidationSchemas';

/**
 * Owns the six-digit reset challenge UI, matching-password validation, and accepted-response completion state.
 * Dependencies: the approved reset API contract, localized AUTH strings, and the shared mutation-key hook.
 * Edge cases: paste/arrow/backspace OTP entry, missing endpoints, invalid challenges, request failure, and malformed responses; no OTP is created or validated client-side.
 */
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
  // Data-flow rationale: edits invalidate the reusable idempotency key; both subscription methods are dependencies and the observer is cleaned up on unmount.
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
          // Use localized module copy, not an unapproved server-supplied message.
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
    <main className="flex min-h-screen items-center justify-center bg-page p-2 text-primary sm:p-8">
      <div className="w-full max-w-lg space-y-5">
        <div className="flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-on-primary"><BookOpen size={18} strokeWidth={2} aria-hidden="true" /></span>
          <span className="text-xl font-bold">{t('BRAND')}</span>
        </div>
        <section className="rounded-2xl border border-border bg-card p-2 shadow-card sm:p-8" aria-labelledby="auth-reset-title">
          {!completed ? (
            <>
              <header className="mb-6 space-y-2">
                <h1 id="auth-reset-title" className="text-2xl font-bold">{t('RESET.title')}</h1>
                <p className="text-sm leading-relaxed text-secondary">{t('RESET.description')}</p>
              </header>
              <form data-testid="auth-reset-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {demoFillEnabled && <button data-testid="auth-reset-demo-fill" type="button" disabled={isBusy} onClick={() => { setValue('otp', PUBLIC_AUTH_PASSWORD_RESET_DEMO.otp, { shouldDirty: true, shouldValidate: true }); setValue('newPassword', PUBLIC_AUTH_PASSWORD_RESET_DEMO.newPassword, { shouldDirty: true }); setValue('confirmPassword', PUBLIC_AUTH_PASSWORD_RESET_DEMO.confirmPassword, { shouldDirty: true }); }} className="min-h-11 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('COMMON.demoFill')}</button>}
              
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
                  {errors.otp && <p id="auth-reset-otp-error" data-testid="auth-reset-otp-validation-error" className="text-center text-sm text-danger" role="alert">{errors.otp.message}</p>}
                  <p className="text-xs text-secondary">{t('RESET.otpHelp')}</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="auth-reset-password" className="block text-sm font-medium text-secondary">{t('RESET.newPasswordLabel')}<span aria-hidden="true" className="ml-1">*</span><span className="sr-only">{t('COMMON.required')}</span></label>
                  <div className="relative">
                    <input
                      id="auth-reset-password"
                      data-testid="auth-reset-password-input" required
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      {...register('newPassword')}
                      aria-invalid={Boolean(errors.newPassword)}
                      aria-describedby={errors.newPassword ? 'auth-reset-password-error' : undefined}
                      className="min-h-11 w-full rounded-lg border border-border bg-input px-3 pr-14 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled"
                     disabled={isBusy} />
                    <button data-testid="auth-reset-password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? t('PASSWORD.hide') : t('PASSWORD.show')} aria-pressed={showPassword} className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-md text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled" disabled={isBusy}>
                      {showPassword ? <EyeOff size={18} strokeWidth={2} aria-hidden="true" /> : <Eye size={18} strokeWidth={2} aria-hidden="true" />}
                    </button>
                  </div>
                  {errors.newPassword && <p id="auth-reset-password-error" data-testid="auth-reset-password-validation-error" className="text-sm text-danger" role="alert">{errors.newPassword.message}</p>}
                  <PublicAuthPasswordStrengthMeter password={newPassword} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="auth-reset-confirm" className="block text-sm font-medium text-secondary">{t('RESET.confirmPasswordLabel')}<span aria-hidden="true" className="ml-1">*</span><span className="sr-only">{t('COMMON.required')}</span></label>
                  <div className="relative">
                    <input
                      id="auth-reset-confirm"
                      data-testid="auth-reset-confirm-password-input" required
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      {...register('confirmPassword')}
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={errors.confirmPassword ? 'auth-reset-confirm-error' : undefined}
                      className={`min-h-11 w-full rounded-lg border bg-input px-3 pr-14 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${confirmPassword && confirmPassword === newPassword && !errors.confirmPassword ? 'border-success' : 'border-border'} disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled`}
                     disabled={isBusy} />
                    <button data-testid="auth-reset-confirm-password-toggle" type="button" onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? t('PASSWORD.hide') : t('PASSWORD.show')} aria-pressed={showConfirmPassword} className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-md text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled" disabled={isBusy}>
                      {showConfirmPassword ? <EyeOff size={18} strokeWidth={2} aria-hidden="true" /> : <Eye size={18} strokeWidth={2} aria-hidden="true" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p id="auth-reset-confirm-error" data-testid="auth-reset-confirm-validation-error" className="text-sm text-danger" role="alert">{errors.confirmPassword.message}</p>}
                </div>

                {errors.root?.server?.message && <p data-testid="auth-reset-server-error-state" className="rounded-lg border border-danger bg-danger-bg p-3 text-sm text-danger" role="alert" aria-live="assertive">{errors.root.server.message}</p>}
                <button data-testid="auth-reset-submit" type="submit" disabled={isBusy} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-on-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  {(isBusy) && <span className="h-4 w-4 motion-safe:animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none" aria-hidden="true" />}
                  {isBusy ? t('RESET.submitting') : t('RESET.submit')}
                </button>
              </form>
              <p className="mt-5 text-center text-sm text-secondary"><Link data-testid="auth-reset-request-new-code-link" href={PUBLIC_AUTH_PASSWORD_RESET_URLS.FORGOT_PASSWORD} className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('RESET.requestNewCode')}</Link></p>
            </>
          ) : (
            <div data-testid="auth-reset-completed-state" className="space-y-4" role="status" aria-live="polite">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success-bg text-success" aria-hidden="true">✓</span>
              <h1 id="auth-reset-title" className="text-2xl font-bold">{t('RESET.successTitle')}</h1>
              <p className="text-sm leading-relaxed text-secondary">{t('RESET.successDescription')}</p>
              <Link data-testid="auth-reset-back-to-login-link" href={PUBLIC_AUTH_PASSWORD_RESET_URLS.LOGIN} className="flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 py-3 font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('RESET.backToLogin')}</Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
