'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  PublicAuthPasswordResetApiError,
  getPublicAuthPasswordResetApiErrorMessage,
} from '@/app/public_auth/auth_password_reset/api/PublicAuthPasswordResetApi';
import { PUBLIC_AUTH_PASSWORD_RESET_URLS } from '@/app/public_auth/auth_password_reset/config/public_auth_password_reset_url_config';
import PublicAuthPasswordResetOtpInput from '@/app/public_auth/auth_password_reset/components/PublicAuthPasswordResetOtpInput';
import '@/app/public_auth/auth_password_reset/components/PublicAuthPasswordResetStyles.css';
import PublicAuthPasswordResetSuccessView, {
  PublicAuthPasswordResetBrandBanner,
} from '@/app/public_auth/auth_password_reset/components/PublicAuthPasswordResetSuccessView';
import PublicAuthPasswordStrengthMeter from '@/app/public_auth/auth_password_reset/components/PublicAuthPasswordStrengthMeter';
import { usePublicAuthPasswordResetMutation } from '@/app/public_auth/auth_password_reset/hooks/usePublicAuthPasswordResetMutation';
import { usePublicAuthPasswordResetIdempotencyKey } from '@/app/public_auth/auth_password_reset/hooks/usePublicAuthPasswordResetIdempotencyKey';
import { PUBLIC_AUTH_PASSWORD_RESET_DEMO } from '@/app/public_auth/auth_password_reset/mocks/fixtures/PublicAuthPasswordResetFixtures';
import {
  createPublicAuthResetPasswordSchema,
  type PublicAuthResetPasswordFormData,
} from '@/app/public_auth/auth_password_reset/schemas/PublicAuthPasswordResetValidationSchemas';

/** Six-digit OTP verification and password reset form with password strength hint and retry support. */
export default function PublicAuthResetPasswordPage() {
  const t = useTranslations('AUTH');
  const demoFillEnabled =
    process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED === 'true';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { getKey, clearKey } = usePublicAuthPasswordResetIdempotencyKey();
  const resetMutation = usePublicAuthPasswordResetMutation();
  const validationSchema = useMemo(
    () =>
      createPublicAuthResetPasswordSchema({
        otpLength: t('VALIDATION.otpLength'),
        otpDigits: t('VALIDATION.otpDigits'),
        passwordMin: t('VALIDATION.passwordMin'),
        passwordUppercase: t('VALIDATION.passwordUppercase'),
        passwordNumber: t('VALIDATION.passwordNumber'),
        confirmPasswordRequired: t('VALIDATION.confirmPasswordRequired'),
        passwordMismatch: t('VALIDATION.passwordMismatch'),
      }),
    [t]
  );
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
      const fieldMap: Record<string, keyof PublicAuthResetPasswordFormData> = {
        otp: 'otp',
        newPassword: 'newPassword',
      };
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
      <div className="absolute inset-0 reset-dot-grid opacity-50" />
      <div className="reset-aurora-orb-1" />
      <div className="reset-aurora-orb-2" />

      <div className="w-full max-w-lg relative z-10 space-y-5 my-8">
        <PublicAuthPasswordResetBrandBanner />

        <section className="reset-glass-card rounded-3xl p-6 sm:p-8" aria-labelledby="auth-reset-title">
          {!completed ? (
            <>
              <header className="mb-6 space-y-3 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-950/70 to-violet-950/70 border border-indigo-500/30 mx-auto shadow-lg">
                  <ShieldCheck size={24} className="text-indigo-400" />
                </div>
                <h1 id="auth-reset-title" className="text-2xl font-black tracking-tight text-white">
                  {t('RESET.title')}
                </h1>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-400">{t('RESET.description')}</p>
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
                      className="rounded-lg border border-indigo-500/30 bg-indigo-950/60 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/60 motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {t('COMMON.demoFill')}
                    </button>
                  </div>
                )}

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
                  <p className="text-center text-xs text-slate-400">{t('RESET.otpHelp')}</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="auth-reset-password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {t('RESET.newPasswordLabel')}
                    <span aria-hidden="true" className="ml-1 text-indigo-400">*</span>
                    <span className="sr-only">{t('COMMON.required')}</span>
                  </label>
                  <div className="relative">
                    <input
                      maxLength={30}
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
                      className={`reset-input-field min-h-11 w-full rounded-xl px-4 py-2.5 pr-12 text-sm ${errors.newPassword ? 'reset-input-error' : ''}`}
                    />
                    <button
                      data-testid="auth-reset-password-toggle"
                      type="button"
                      disabled={isBusy}
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? t('PASSWORD.hide') : t('PASSWORD.show')}
                      aria-pressed={showPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white motion-safe:transition-colors"
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

                <div className="space-y-1.5">
                  <label htmlFor="auth-reset-confirm" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {t('RESET.confirmPasswordLabel')}
                    <span aria-hidden="true" className="ml-1 text-indigo-400">*</span>
                    <span className="sr-only">{t('COMMON.required')}</span>
                  </label>
                  <div className="relative">
                    <input
                      maxLength={30}
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
                      className={`reset-input-field min-h-11 w-full rounded-xl px-4 py-2.5 pr-12 text-sm ${confirmPassword && confirmPassword === newPassword && !errors.confirmPassword ? 'border-emerald-500' : ''} ${errors.confirmPassword ? 'reset-input-error' : ''}`}
                    />
                    <button
                      data-testid="auth-reset-confirm-password-toggle"
                      type="button"
                      disabled={isBusy}
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? t('PASSWORD.hide') : t('PASSWORD.show')}
                      aria-pressed={showConfirmPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white motion-safe:transition-colors"
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
                  <p data-testid="auth-reset-server-error-state" className="rounded-xl border border-rose-500/30 bg-rose-950/60 p-3 text-xs sm:text-sm text-rose-300 flex items-center gap-2" role="alert" aria-live="assertive">
                    <span>⚠️</span>
                    <span>{errors.root.server.message}</span>
                  </p>
                )}

                <button
                  data-testid="auth-reset-submit"
                  type="submit"
                  disabled={isBusy}
                  className="reset-shimmer-btn reset-glow-indigo flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white hover:opacity-95 motion-safe:active:scale-95 motion-safe:transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg mt-2"
                >
                  {isBusy && <span className="h-4 w-4 motion-safe:animate-spin rounded-full border-2 border-white border-r-transparent" aria-hidden="true" />}
                  <span>{isBusy ? t('RESET.submitting') : t('RESET.submit')}</span>
                </button>
              </form>

              <p className="mt-5 text-center text-xs sm:text-sm text-slate-400">
                <Link
                  data-testid="auth-reset-request-new-code-link"
                  href={PUBLIC_AUTH_PASSWORD_RESET_URLS.FORGOT_PASSWORD}
                  className="font-bold text-indigo-400 hover:text-indigo-300 motion-safe:transition-colors"
                >
                  {t('RESET.requestNewCode')}
                </Link>
              </p>
            </>
          ) : (
            <PublicAuthPasswordResetSuccessView
              title={t('RESET.successTitle')}
              description={t('RESET.successDescription')}
              backToLoginLabel={t('RESET.backToLogin')}
              loginHref={PUBLIC_AUTH_PASSWORD_RESET_URLS.LOGIN}
            />
          )}
        </section>
      </div>
    </main>
  );
}
