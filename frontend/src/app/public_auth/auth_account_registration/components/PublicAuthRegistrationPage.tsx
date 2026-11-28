'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  PublicAuthRegistrationApiError,
  getPublicAuthRegistrationApiErrorMessage,
} from '@/app/public_auth/auth_account_registration/api/PublicAuthRegistrationApi';
import { PUBLIC_AUTH_REGISTRATION_URLS } from '@/app/public_auth/auth_account_registration/config/public_auth_registration_url_config';
import PublicAuthRegistrationForm from '@/app/public_auth/auth_account_registration/components/PublicAuthRegistrationForm';
import PublicAuthRegistrationHeader, {
  PublicAuthRegistrationBrandBanner,
} from '@/app/public_auth/auth_account_registration/components/PublicAuthRegistrationHeader';
import '@/app/public_auth/auth_account_registration/components/PublicAuthRegistrationStyles.css';
import { usePublicAuthRegistrationMutation } from '@/app/public_auth/auth_account_registration/hooks/usePublicAuthRegistrationMutation';
import { usePublicAuthRegistrationIdempotencyKey } from '@/app/public_auth/auth_account_registration/hooks/usePublicAuthRegistrationIdempotencyKey';
import { PUBLIC_AUTH_REGISTRATION_DEMO } from '@/app/public_auth/auth_account_registration/mocks/fixtures/PublicAuthRegistrationFixtures';
import {
  createPublicAuthRegistrationSchema,
  type PublicAuthRegistrationFormData,
} from '@/app/public_auth/auth_account_registration/schemas/PublicAuthRegistrationValidationSchemas';
import type { PublicAuthRegistrationRequest } from '@/app/public_auth/auth_account_registration/types/PublicAuthRegistrationApiTypes';

/** Library owner account registration screen wired to RHF + Zod validation and idempotent signup API. */
export default function PublicAuthRegistrationPage() {
  const t = useTranslations('AUTH');
  const router = useRouter();
  const demoFillEnabled =
    process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED === 'true';
  const { getKey, clearKey } = usePublicAuthRegistrationIdempotencyKey();
  const signupMutation = usePublicAuthRegistrationMutation();
  const validationSchema = useMemo(
    () =>
      createPublicAuthRegistrationSchema({
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

  const handleDemoFill = () => {
    setValue('ownerName', PUBLIC_AUTH_REGISTRATION_DEMO.ownerName, { shouldDirty: true });
    setValue('libraryName', PUBLIC_AUTH_REGISTRATION_DEMO.libraryName, { shouldDirty: true });
    setValue('email', PUBLIC_AUTH_REGISTRATION_DEMO.email, { shouldDirty: true });
    setValue('phone', PUBLIC_AUTH_REGISTRATION_DEMO.phone, { shouldDirty: true });
    setValue('password', PUBLIC_AUTH_REGISTRATION_DEMO.password, { shouldDirty: true });
    setValue('confirmPassword', PUBLIC_AUTH_REGISTRATION_DEMO.confirmPassword, { shouldDirty: true });
  };

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
      const fieldMap: Record<string, keyof PublicAuthRegistrationFormData> = {
        ownerName: 'ownerName',
        libraryName: 'libraryName',
        email: 'email',
        phone: 'phone',
        password: 'password',
      };
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
      <div className="absolute inset-0 reg-dot-grid opacity-50" />
      <div className="reg-aurora-orb-1" />
      <div className="reg-aurora-orb-2" />

      <div className="w-full max-w-2xl relative z-10 space-y-6 my-8">
        <PublicAuthRegistrationBrandBanner />

        <section className="reg-glass-card rounded-3xl p-6 sm:p-10" aria-labelledby="auth-signup-title">
          <PublicAuthRegistrationHeader
            title={t('SIGNUP.title')}
            description={t('SIGNUP.description')}
            demoFillLabel={t('COMMON.demoFill')}
            demoFillEnabled={demoFillEnabled}
            isBusy={isBusy}
            onDemoFill={handleDemoFill}
          />

          <PublicAuthRegistrationForm
            t={t}
            isBusy={isBusy}
            password={password}
            confirmPassword={confirmPassword}
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs sm:text-sm text-slate-400">
              {t('SIGNUP.alreadyAccount')}{' '}
              <Link data-testid="auth-signup-back-to-login-link" href={PUBLIC_AUTH_REGISTRATION_URLS.LOGIN} className="font-bold text-indigo-400 hover:text-indigo-300 motion-safe:transition-colors">
                {t('SIGNUP.login')}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
