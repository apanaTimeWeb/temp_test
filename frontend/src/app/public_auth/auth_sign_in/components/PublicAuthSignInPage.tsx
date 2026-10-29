'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen, Eye, EyeOff, LockKeyhole, Shield, Users, Zap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PublicAuthApiError, getPublicAuthApiErrorMessage } from '@/app/public_auth/auth_sign_in/api/PublicAuthSignInApi';
import { PUBLIC_AUTH_INTERNAL_URLS, PUBLIC_AUTH_ROLE_REDIRECTS } from '@/app/public_auth/auth_sign_in/config/public_auth_sign_in_url_config';
import PublicAuthSignInHero from '@/app/public_auth/auth_sign_in/components/PublicAuthSignInHero';
import PublicAuthSignInRoleSelector from '@/app/public_auth/auth_sign_in/components/PublicAuthSignInRoleSelector';
import { ThemeToggle } from '@/components/ThemeToggle';
import { usePublicAuthLoginMutation } from '@/app/public_auth/auth_sign_in/hooks/usePublicAuthSignInMutation';
import { usePublicAuthIdempotencyKey } from '@/app/public_auth/auth_sign_in/hooks/usePublicAuthSignInIdempotencyKey';
import { PUBLIC_AUTH_SIGN_IN_DEMO } from '@/app/public_auth/auth_sign_in/mocks/fixtures/PublicAuthSignInFixtures';
import { createPublicAuthLoginSchema, type PublicAuthLoginFormData } from '@/app/public_auth/auth_sign_in/schemas/PublicAuthSignInValidationSchemas';
import { PUBLIC_AUTH_ROLE_IDS, type PublicAuthRole } from '@/app/public_auth/auth_sign_in/utils/PublicAuthSignInConstants';
import type { PublicAuthLoginRequest } from '@/app/public_auth/auth_sign_in/types/PublicAuthSignInApiTypes';

/**
 * Owns the public login interaction: role selection, schema-backed credentials, pending control lock, mutation feedback, and post-acceptance navigation.
 * Dependencies: the host `apiFetch` auth contract, localized `AUTH` messages, and the preserved role destination map.
 * Edge cases: an absent endpoint, unavailable secure request-key API, malformed/rejected responses, and network failure keep the user on this form; the selected role is not an authorization boundary.
 */

export default function PublicAuthSignInPage() {
  const t = useTranslations('AUTH');
  const router = useRouter();
  const demoFillEnabled = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED === 'true';
  const [showPassword, setShowPassword] = useState(false);
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
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PublicAuthLoginFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: { email: '', password: '', role: PUBLIC_AUTH_ROLE_IDS[0] },
  });
  // Data-flow rationale: edits invalidate the reusable idempotency key; both subscription methods are dependencies and the observer is cleaned up on unmount.
  useEffect(() => {
    const subscription = watch(() => clearKey());
  
  return () => subscription.unsubscribe();
  }, [watch, clearKey]);
  const roleText: Record<PublicAuthRole, { label: string; description: string }> = {
    superadmin: { label: t('ROLES.superadmin.label'), description: t('ROLES.superadmin.description') },
    admin: { label: t('ROLES.admin.label'), description: t('ROLES.admin.description') },
    manager: { label: t('ROLES.manager.label'), description: t('ROLES.manager.description') },
  };
  const selectedRole = watch('role');

  const roleIcon = {
    superadmin: <Shield size={18} strokeWidth={2} aria-hidden="true" />,
    admin: <Zap size={18} strokeWidth={2} aria-hidden="true" />,
    manager: <Users size={18} strokeWidth={2} aria-hidden="true" />,
  } satisfies Record<PublicAuthRole, ReactNode>;
  const isBusy = loginMutation.isPending || isSubmitting;

  const onSubmit = async (values: PublicAuthLoginFormData) => {
    const payload: PublicAuthLoginRequest = values;
    try {
      await loginMutation.mutateAsync({ payload, idempotencyKey: await getKey() });
      clearKey();
      router.replace(PUBLIC_AUTH_ROLE_REDIRECTS[values.role]);
    } catch (error) {
      const fieldMap: Record<string, keyof PublicAuthLoginFormData> = { email: 'email', password: 'password', role: 'role' };
      const validationErrors = error instanceof PublicAuthApiError ? error.validationErrors : [];
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
    <main className="grid min-h-screen bg-page text-primary lg:grid-cols-[1fr_0.85fr]">
      <PublicAuthSignInHero brand={t('BRAND')} eyebrow={t('LOGIN.eyebrow')} heading={t('LOGIN.heading')} description={t('LOGIN.description')} footer={t('LOGIN.footer')} />
      <section className="relative flex min-h-screen items-center justify-center p-4 sm:p-8 lg:p-10">
        <div className="absolute right-4 top-4 z-10">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center justify-center gap-3 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-on-primary">
              <BookOpen size={18} strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="text-xl font-bold">{t('BRAND')}</span>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8">
            <header className="mb-7 space-y-2 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-subtle text-primary">
                <LockKeyhole size={18} strokeWidth={2} aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-bold">{t('LOGIN.formTitle')}</h2>
              <p className="text-sm text-secondary">{t('LOGIN.intro')}</p>
            </header>
            <PublicAuthSignInRoleSelector
              label={t('LOGIN.roleLabel')}
              selectedRole={selectedRole}
              roleText={roleText}
              roleIcon={roleIcon}
              disabled={isBusy}
              onSelect={(role) => {
                setValue('role', role, { shouldValidate: true, shouldDirty: true });
                if (role === 'manager') {
                  setValue('email', 'manager@library.com', { shouldValidate: true, shouldDirty: true });
                  setValue('password', 'Password@123', { shouldValidate: true, shouldDirty: true });
                }
              }}
            />

            <form data-testid="auth-login-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {demoFillEnabled && <button data-testid="auth-login-demo-fill" type="button" disabled={isBusy} onClick={() => { setValue('email', PUBLIC_AUTH_SIGN_IN_DEMO.email, { shouldDirty: true }); setValue('password', PUBLIC_AUTH_SIGN_IN_DEMO.password, { shouldDirty: true }); setValue('role', PUBLIC_AUTH_SIGN_IN_DEMO.role, { shouldDirty: true, shouldValidate: true }); }} className="min-h-11 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('COMMON.demoFill')}</button>}
              <input data-testid="auth-login-role-value" type="hidden" {...register('role')} />
              <div className="space-y-1.5">
                <label htmlFor="auth-login-email" className="block text-sm font-medium text-secondary">{t('LOGIN.emailLabel')}<span aria-hidden="true" className="ml-1">*</span><span className="sr-only">{t('COMMON.required')}</span></label>
                <input
                  id="auth-login-email"
                  data-testid="auth-login-email-input" required
                  type="text"
                  autoComplete="username"
                  {...register('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'auth-login-email-error' : undefined}
                  className="min-h-11 w-full rounded-lg border border-border bg-input px-3 text-primary placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled"
                 disabled={isBusy} />
                {errors.email && <p id="auth-login-email-error" data-testid="auth-login-email-validation-error" className="text-sm text-danger" role="alert">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="auth-login-password" className="block text-sm font-medium text-secondary">{t('LOGIN.passwordLabel')}<span aria-hidden="true" className="ml-1">*</span><span className="sr-only">{t('COMMON.required')}</span></label>
                  <Link data-testid="auth-login-forgot-password-link" href={PUBLIC_AUTH_INTERNAL_URLS.FORGOT_PASSWORD} className="text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('LOGIN.forgotPassword')}</Link>
                </div>
                <div className="relative">
                  <input
                    id="auth-login-password"
                    data-testid="auth-login-password-input" required
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password')}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'auth-login-password-error' : undefined}
                    className="min-h-11 w-full rounded-lg border border-border bg-input px-3 pr-14 text-primary placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled"
                   disabled={isBusy} />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    data-testid="auth-login-password-toggle"
                    aria-label={showPassword ? t('PASSWORD.hide') : t('PASSWORD.show')}
                    aria-pressed={showPassword}
                    className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-md text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:text-disabled"
                   disabled={isBusy}>
                    {showPassword ? <EyeOff size={18} strokeWidth={2} aria-hidden="true" /> : <Eye size={18} strokeWidth={2} aria-hidden="true" />}
                  </button>
                </div>
                {errors.password && <p id="auth-login-password-error" data-testid="auth-login-password-validation-error" className="text-sm text-danger" role="alert">{errors.password.message}</p>}
              </div>
              {errors.root?.server?.message && (
                <p data-testid="auth-login-server-error-state" className="rounded-lg border border-danger bg-danger-bg p-3 text-sm text-danger" role="alert" aria-live="assertive">{errors.root.server.message}</p>
              )}
              <button
                id="auth-login-submit"
                data-testid="auth-login-submit"
                type="submit"
                disabled={isBusy}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-on-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-surface-highlight disabled:text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {(isBusy) && <span className="h-4 w-4 motion-safe:animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none" aria-hidden="true" />}
                {isBusy ? t('LOGIN.submitting') : t('LOGIN.submit')}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-secondary">
              {t('LOGIN.noAccount')}{' '}
              <Link data-testid="auth-login-signup-link" href={PUBLIC_AUTH_INTERNAL_URLS.SIGNUP} className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('LOGIN.createAccount')}</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
