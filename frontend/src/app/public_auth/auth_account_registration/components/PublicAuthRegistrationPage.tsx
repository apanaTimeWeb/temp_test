'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PublicAuthRegistrationApiError, getPublicAuthRegistrationApiErrorMessage } from '@/app/public_auth/auth_account_registration/api/PublicAuthRegistrationApi';
import { PUBLIC_AUTH_REGISTRATION_URLS } from '@/app/public_auth/auth_account_registration/config/public_auth_registration_url_config';
import PublicAuthRegistrationPasswordStrengthMeter from '@/app/public_auth/auth_account_registration/components/PublicAuthRegistrationPasswordStrengthMeter';
import { usePublicAuthRegistrationMutation } from '@/app/public_auth/auth_account_registration/hooks/usePublicAuthRegistrationMutation';
import { usePublicAuthRegistrationIdempotencyKey } from '@/app/public_auth/auth_account_registration/hooks/usePublicAuthRegistrationIdempotencyKey';
import { PUBLIC_AUTH_REGISTRATION_DEMO } from '@/app/public_auth/auth_account_registration/mocks/fixtures/PublicAuthRegistrationFixtures';
import { createPublicAuthRegistrationSchema, type PublicAuthRegistrationFormData } from '@/app/public_auth/auth_account_registration/schemas/PublicAuthRegistrationValidationSchemas';
import type { PublicAuthRegistrationRequest } from '@/app/public_auth/auth_account_registration/types/PublicAuthRegistrationApiTypes';

/**
 * Owns public account-creation fields, client validation, loading/error feedback, and post-acceptance setup navigation.
 * Dependencies: the approved host signup endpoint, RHF/Zod, next-intl, and the existing setup-wizard route.
 * Edge cases: editable fields and repeated submit are disabled while pending; failures retain fields and unlock retry; password confirmation is client-only and is never sent.
 */
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
  // Data-flow rationale: edits invalidate the reusable idempotency key; both subscription methods are dependencies and the observer is cleaned up on unmount.
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
          // Use localized module copy, not an unapproved server-supplied message.
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
    <main className="flex min-h-screen items-center justify-center bg-page p-4 text-primary sm:p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-on-primary"><BookOpen size={18} strokeWidth={2} aria-hidden="true" /></span>
          <span className="text-xl font-bold">{t('BRAND')}</span>
        </div>
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8" aria-labelledby="auth-signup-title">
          <header className="mb-6 space-y-2">
            <h1 id="auth-signup-title" className="text-2xl font-bold">{t('SIGNUP.title')}</h1>
            <p className="text-sm text-secondary">{t('SIGNUP.description')}</p>
          </header>

          <form data-testid="auth-signup-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {demoFillEnabled && <button data-testid="auth-signup-demo-fill" type="button" disabled={isBusy} onClick={() => { setValue('ownerName', PUBLIC_AUTH_REGISTRATION_DEMO.ownerName, { shouldDirty: true }); setValue('libraryName', PUBLIC_AUTH_REGISTRATION_DEMO.libraryName, { shouldDirty: true }); setValue('email', PUBLIC_AUTH_REGISTRATION_DEMO.email, { shouldDirty: true }); setValue('phone', PUBLIC_AUTH_REGISTRATION_DEMO.phone, { shouldDirty: true }); setValue('password', PUBLIC_AUTH_REGISTRATION_DEMO.password, { shouldDirty: true }); setValue('confirmPassword', PUBLIC_AUTH_REGISTRATION_DEMO.confirmPassword, { shouldDirty: true }); }} className="min-h-11 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('COMMON.demoFill')}</button>}
            <div className="space-y-1.5">
              <label htmlFor="auth-signup-owner" className="block text-sm font-medium text-secondary">{t('SIGNUP.ownerName')}<span aria-hidden="true" className="ml-1">*</span><span className="sr-only">{t('COMMON.required')}</span></label>
              <input id="auth-signup-owner" data-testid="auth-signup-owner-name-input" required type="text" autoComplete="name" {...register('ownerName')} aria-invalid={Boolean(errors.ownerName)} aria-describedby={errors.ownerName ? 'auth-signup-owner-error' : undefined} className="min-h-11 w-full rounded-lg border border-border bg-input px-3 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled" disabled={isBusy} />
              {errors.ownerName && <p id="auth-signup-owner-error" data-testid="auth-signup-owner-validation-error" className="text-sm text-danger" role="alert">{errors.ownerName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="auth-signup-library" className="block text-sm font-medium text-secondary">{t('SIGNUP.libraryName')}<span aria-hidden="true" className="ml-1">*</span><span className="sr-only">{t('COMMON.required')}</span></label>
              <input id="auth-signup-library" data-testid="auth-signup-library-name-input" required type="text" autoComplete="organization" {...register('libraryName')} aria-invalid={Boolean(errors.libraryName)} aria-describedby={errors.libraryName ? 'auth-signup-library-error' : undefined} className="min-h-11 w-full rounded-lg border border-border bg-input px-3 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled" disabled={isBusy} />
              {errors.libraryName && <p id="auth-signup-library-error" data-testid="auth-signup-library-validation-error" className="text-sm text-danger" role="alert">{errors.libraryName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="auth-signup-email" className="block text-sm font-medium text-secondary">{t('SIGNUP.email')}<span aria-hidden="true" className="ml-1">*</span><span className="sr-only">{t('COMMON.required')}</span></label>
              <input id="auth-signup-email" data-testid="auth-signup-email-input" required type="email" autoComplete="email" {...register('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'auth-signup-email-error' : undefined} className="min-h-11 w-full rounded-lg border border-border bg-input px-3 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled" disabled={isBusy} />
              {errors.email && <p id="auth-signup-email-error" data-testid="auth-signup-email-validation-error" className="text-sm text-danger" role="alert">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="auth-signup-phone" className="block text-sm font-medium text-secondary">{t('SIGNUP.phone')}<span aria-hidden="true" className="ml-1">*</span><span className="sr-only">{t('COMMON.required')}</span></label>
              <input id="auth-signup-phone" data-testid="auth-signup-phone-input" required type="tel" autoComplete="tel" {...register('phone')} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'auth-signup-phone-error' : 'auth-signup-phone-help'} className="min-h-11 w-full rounded-lg border border-border bg-input px-3 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled" disabled={isBusy} />
              {errors.phone ? <p id="auth-signup-phone-error" data-testid="auth-signup-phone-validation-error" className="text-sm text-danger" role="alert">{errors.phone.message}</p> : <p id="auth-signup-phone-help" className="text-xs text-secondary">{t('SIGNUP.phoneHelp')}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="auth-signup-password" className="block text-sm font-medium text-secondary">{t('SIGNUP.password')}<span aria-hidden="true" className="ml-1">*</span><span className="sr-only">{t('COMMON.required')}</span></label>
              <div className="relative">
                <input id="auth-signup-password" data-testid="auth-signup-password-input" required type={showPassword ? 'text' : 'password'} autoComplete="new-password" {...register('password')} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'auth-signup-password-error' : undefined} className="min-h-11 w-full rounded-lg border border-border bg-input px-3 pr-14 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled" disabled={isBusy} />
                <button data-testid="auth-signup-password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? t('PASSWORD.hide') : t('PASSWORD.show')} aria-pressed={showPassword} className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-md text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled" disabled={isBusy}>{showPassword ? <EyeOff size={18} strokeWidth={2} aria-hidden="true" /> : <Eye size={18} strokeWidth={2} aria-hidden="true" />}</button>
              </div>
              {errors.password && <p id="auth-signup-password-error" data-testid="auth-signup-password-validation-error" className="text-sm text-danger" role="alert">{errors.password.message}</p>}
              <PublicAuthRegistrationPasswordStrengthMeter password={password} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="auth-signup-confirm" className="block text-sm font-medium text-secondary">{t('SIGNUP.confirmPassword')}<span aria-hidden="true" className="ml-1">*</span><span className="sr-only">{t('COMMON.required')}</span></label>
              <div className="relative">
                <input id="auth-signup-confirm" data-testid="auth-signup-confirm-password-input" required type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" {...register('confirmPassword')} aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? 'auth-signup-confirm-error' : undefined} className={`min-h-11 w-full rounded-lg border bg-input px-3 pr-14 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${confirmPassword && confirmPassword === password && !errors.confirmPassword ? 'border-success' : 'border-border'} disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled`}  disabled={isBusy} />
                <button data-testid="auth-signup-confirm-password-toggle" type="button" onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? t('PASSWORD.hide') : t('PASSWORD.show')} aria-pressed={showConfirmPassword} className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-md text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled" disabled={isBusy}>{showConfirmPassword ? <EyeOff size={18} strokeWidth={2} aria-hidden="true" /> : <Eye size={18} strokeWidth={2} aria-hidden="true" />}</button>
              </div>
              {errors.confirmPassword && <p id="auth-signup-confirm-error" data-testid="auth-signup-confirm-validation-error" className="text-sm text-danger" role="alert">{errors.confirmPassword.message}</p>}
            </div>

            {errors.root?.server?.message && <p data-testid="auth-signup-server-error-state" className="rounded-lg border border-danger bg-danger-bg p-3 text-sm text-danger" role="alert" aria-live="assertive">{errors.root.server.message}</p>}
            <button id="auth-signup-submit" data-testid="auth-signup-submit" type="submit" disabled={isBusy} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-on-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              {(isBusy) && <span className="h-4 w-4 motion-safe:animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none" aria-hidden="true" />}
              {isBusy ? t('SIGNUP.submitting') : t('SIGNUP.submit')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-secondary">{t('SIGNUP.alreadyAccount')}{' '}<Link data-testid="auth-signup-back-to-login-link" href={PUBLIC_AUTH_REGISTRATION_URLS.LOGIN} className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('SIGNUP.login')}</Link></p>
        </section>
      </div>
    </main>
  );
}
