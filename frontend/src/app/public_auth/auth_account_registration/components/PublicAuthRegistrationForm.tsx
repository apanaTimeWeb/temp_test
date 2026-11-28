'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import PublicAuthRegistrationPasswordStrengthMeter from '@/app/public_auth/auth_account_registration/components/PublicAuthRegistrationPasswordStrengthMeter';
import type { PublicAuthRegistrationFormData } from '@/app/public_auth/auth_account_registration/schemas/PublicAuthRegistrationValidationSchemas';

interface PublicAuthRegistrationFormProps {
  t: (key: string) => string;
  isBusy: boolean;
  password: string;
  confirmPassword: string;
  register: UseFormRegister<PublicAuthRegistrationFormData>;
  errors: FieldErrors<PublicAuthRegistrationFormData>;
  handleSubmit: UseFormHandleSubmit<PublicAuthRegistrationFormData>;
  onSubmit: (values: PublicAuthRegistrationFormData) => Promise<void>;
}

/** Accessible 6-field registration form with inline validation, password strength meter, and server error handling. */
export default function PublicAuthRegistrationForm({
  t,
  isBusy,
  password,
  confirmPassword,
  register,
  errors,
  handleSubmit,
  onSubmit,
}: PublicAuthRegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form data-testid="auth-signup-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="auth-signup-owner" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            {t('SIGNUP.ownerName')}
            <span aria-hidden="true" className="ml-1 text-indigo-400">*</span>
            <span className="sr-only">{t('COMMON.required')}</span>
          </label>
          <input
            maxLength={30}
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
            className={`reg-input-field min-h-11 w-full rounded-xl px-4 py-2.5 text-sm ${errors.ownerName ? 'reg-input-error' : ''}`}
          />
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
          <input
            maxLength={30}
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
            className={`reg-input-field min-h-11 w-full rounded-xl px-4 py-2.5 text-sm ${errors.libraryName ? 'reg-input-error' : ''}`}
          />
          {errors.libraryName && (
            <p id="auth-signup-library-error" data-testid="auth-signup-library-validation-error" className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1" role="alert">
              <span>⚠</span>{errors.libraryName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="auth-signup-email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            {t('SIGNUP.email')}
            <span aria-hidden="true" className="ml-1 text-indigo-400">*</span>
            <span className="sr-only">{t('COMMON.required')}</span>
          </label>
          <input
            maxLength={30}
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
            className={`reg-input-field min-h-11 w-full rounded-xl px-4 py-2.5 text-sm ${errors.email ? 'reg-input-error' : ''}`}
          />
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
          <input
            id="auth-signup-phone"
            data-testid="auth-signup-phone-input"
            required
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            maxLength={15}
            disabled={isBusy}
            {...register('phone')}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'auth-signup-phone-error' : 'auth-signup-phone-help'}
            className={`reg-input-field min-h-11 w-full rounded-xl px-4 py-2.5 text-sm ${errors.phone ? 'reg-input-error' : ''}`}
          />
          {errors.phone ? (
            <p id="auth-signup-phone-error" data-testid="auth-signup-phone-validation-error" className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1" role="alert">
              <span>⚠</span>{errors.phone.message}
            </p>
          ) : (
            <p id="auth-signup-phone-help" className="text-xs text-slate-400">{t('SIGNUP.phoneHelp')}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="auth-signup-password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            {t('SIGNUP.password')}
            <span aria-hidden="true" className="ml-1 text-indigo-400">*</span>
            <span className="sr-only">{t('COMMON.required')}</span>
          </label>
          <div className="relative">
            <input
              maxLength={30}
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
              className={`reg-input-field min-h-11 w-full rounded-xl px-4 py-2.5 pr-12 text-sm ${errors.password ? 'reg-input-error' : ''}`}
            />
            <button
              data-testid="auth-signup-password-toggle"
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
              maxLength={30}
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
              className={`reg-input-field min-h-11 w-full rounded-xl px-4 py-2.5 pr-12 text-sm ${confirmPassword && confirmPassword === password && !errors.confirmPassword ? 'border-emerald-500' : ''} ${errors.confirmPassword ? 'reg-input-error' : ''}`}
            />
            <button
              data-testid="auth-signup-confirm-password-toggle"
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
            <p id="auth-signup-confirm-error" data-testid="auth-signup-confirm-validation-error" className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1" role="alert">
              <span>⚠</span>{errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <div className="pt-1">
        <PublicAuthRegistrationPasswordStrengthMeter password={password} />
      </div>

      {errors.root?.server?.message && (
        <p data-testid="auth-signup-server-error-state" className="rounded-xl border border-rose-500/30 bg-rose-950/60 p-3 text-xs sm:text-sm text-rose-300 flex items-center gap-2" role="alert" aria-live="assertive">
          <span>⚠️</span>
          <span>{errors.root.server.message}</span>
        </p>
      )}

      <button
        id="auth-signup-submit"
        data-testid="auth-signup-submit"
        type="submit"
        disabled={isBusy}
        className="reg-shimmer-btn reg-glow-indigo flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white hover:opacity-95 motion-safe:active:scale-95 motion-safe:transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg mt-4"
      >
        {isBusy && <span className="h-4 w-4 motion-safe:animate-spin rounded-full border-2 border-white border-r-transparent" aria-hidden="true" />}
        {isBusy ? t('SIGNUP.submitting') : t('SIGNUP.submit')}
      </button>
    </form>
  );
}
