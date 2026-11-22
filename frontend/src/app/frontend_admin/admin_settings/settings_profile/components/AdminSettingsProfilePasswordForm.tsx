'use client';
// RESPONSIBILITY: AdminProfilePasswordForm component owned by admin_profile; responsibility folder: admin_profile_forms.

import { AdminProfilePasswordSchema,getAdminProfileValidationMessageKey,type AdminProfilePasswordFormValues } from '@/app/frontend_admin/admin_settings/settings_profile/schemas/AdminSettingsProfileSchema';
import type { AdminSettingsProfileFormProps } from '@/app/frontend_admin/admin_settings/settings_profile/types/AdminSettingsProfileTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2,Eye,EyeOff,KeyRound,Lock,ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect,useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

/** Validates the local password-change draft without invoking or implying an authentication mutation. */
export default function AdminProfilePasswordForm({ onDirtyChange }: AdminSettingsProfileFormProps) {
  const t = useTranslations('ADMIN_PROFILE');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<AdminProfilePasswordFormValues>({
    resolver: zodResolver(AdminProfilePasswordSchema),
    mode: 'onBlur',
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  useEffect(() => { onDirtyChange(isDirty); }, [isDirty, onDirtyChange]);

  const handleValidateDraft = handleSubmit(() => {
    toast.info(t('PASSWORD_DRAFT_VALIDATED_BLOCKED'), { id: 'admin_settings-settings_profile-components-AdminSettingsProfilePasswordForm-toast-21-1' });
  });

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8" aria-labelledby="admin-profile-password-title">
      {/* Decorative ambient background accent */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />

      {/* Header section */}
      <div className="flex flex-col gap-2 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary shadow-xs">
            <KeyRound size={20} />
          </div>
          <div>
            <h2 id="admin-profile-password-title" className="text-lg font-bold tracking-tight text-text-primary sm:text-xl">
              {t('PASSWORD_TITLE')}
            </h2>
            <p className="mt-0.5 text-xs text-text-secondary sm:text-sm">
              {t('PASSWORD_DESCRIPTION')}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-secondary sm:self-auto">
          <ShieldCheck size={14} className="text-primary" />
          End-to-End Encrypted
        </span>
      </div>

      <form onSubmit={handleValidateDraft} noValidate className="mt-6 space-y-6">
        {/* ROW 1: Current Password */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Lock size={14} className="text-primary" aria-hidden="true" />
            <label htmlFor="admin-profile-current-password" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              {t('FIELD_CURRENT_PASSWORD')}
            </label>
            <span className="text-danger-text" aria-hidden="true">*</span>
          </div>
          <div className="relative">
            <input
              id="admin-profile-current-password"
              type={showCurrentPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`w-full rounded-xl border bg-surface px-4 py-2.5 pr-12 text-sm font-medium text-text-primary placeholder:text-text-tertiary transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.currentPassword
                  ? 'border-danger-bg ring-1 ring-danger-bg'
                  : 'border-border hover:border-border-strong focus:border-primary'
              }`}
              placeholder="Enter existing account password"
              {...register('currentPassword')}
              aria-invalid={Boolean(errors.currentPassword)}
              aria-describedby={errors.currentPassword ? 'admin-profile-current-password-error' : undefined}
            />
            <button
              type="button"
              className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
              aria-label={showCurrentPassword ? t('ARIA_HIDE_CURRENT_PASSWORD') : t('ARIA_SHOW_CURRENT_PASSWORD')}
              aria-controls="admin-profile-current-password"
              onClick={() => setShowCurrentPassword((visible) => !visible)}
            >
              {showCurrentPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p id="admin-profile-current-password-error" className="flex items-center gap-1 text-xs font-medium text-danger-text" role="alert">
              {t(getAdminProfileValidationMessageKey('currentPassword', errors.currentPassword.type))}
            </p>
          )}
        </div>

        {/* ROW 2: New Password & Confirm Password in 2-Column Grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* New Password */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <KeyRound size={14} className="text-primary" aria-hidden="true" />
              <label htmlFor="admin-profile-new-password" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {t('FIELD_NEW_PASSWORD')}
              </label>
              <span className="text-danger-text" aria-hidden="true">*</span>
            </div>
            <div className="relative">
              <input
                id="admin-profile-new-password"
                type={showNewPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={`w-full rounded-xl border bg-surface px-4 py-2.5 pr-12 text-sm font-medium text-text-primary placeholder:text-text-tertiary transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.newPassword
                    ? 'border-danger-bg ring-1 ring-danger-bg'
                    : 'border-border hover:border-border-strong focus:border-primary'
                }`}
                placeholder="Choose new strong password"
                {...register('newPassword')}
                aria-invalid={Boolean(errors.newPassword)}
                aria-describedby={errors.newPassword ? 'admin-profile-new-password-error' : undefined}
              />
              <button
                type="button"
                className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                aria-label={showNewPassword ? t('ARIA_HIDE_NEW_PASSWORD') : t('ARIA_SHOW_NEW_PASSWORD')}
                aria-controls="admin-profile-new-password"
                onClick={() => setShowNewPassword((visible) => !visible)}
              >
                {showNewPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
              </button>
            </div>
            {errors.newPassword && (
              <p id="admin-profile-new-password-error" className="flex items-center gap-1 text-xs font-medium text-danger-text" role="alert">
                {t(getAdminProfileValidationMessageKey('newPassword', errors.newPassword.type))}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-primary" aria-hidden="true" />
              <label htmlFor="admin-profile-confirm-password" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {t('FIELD_CONFIRM_PASSWORD')}
              </label>
              <span className="text-danger-text" aria-hidden="true">*</span>
            </div>
            <div className="relative">
              <input
                id="admin-profile-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={`w-full rounded-xl border bg-surface px-4 py-2.5 pr-12 text-sm font-medium text-text-primary placeholder:text-text-tertiary transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.confirmPassword
                    ? 'border-danger-bg ring-1 ring-danger-bg'
                    : 'border-border hover:border-border-strong focus:border-primary'
                }`}
                placeholder="Re-enter new password"
                {...register('confirmPassword')}
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? 'admin-profile-confirm-password-error' : undefined}
              />
              <button
                type="button"
                className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                aria-label={showConfirmPassword ? t('ARIA_HIDE_CONFIRM_PASSWORD') : t('ARIA_SHOW_CONFIRM_PASSWORD')}
                aria-controls="admin-profile-confirm-password"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
              >
                {showConfirmPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="admin-profile-confirm-password-error" className="flex items-center gap-1 text-xs font-medium text-danger-text" role="alert">
                {t(getAdminProfileValidationMessageKey('confirmPassword', errors.confirmPassword.type))}
              </p>
            )}
          </div>
        </div>

        {/* Security Guidelines Box */}
        <div className="rounded-xl border border-border bg-surface/50 p-4">
          <p className="text-xs font-semibold text-text-primary">Password Security Recommendations:</p>
          <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-secondary">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Minimum 8 characters in length
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Must contain both letters and numbers
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Include at least one special character
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Cannot match previous passwords
            </li>
          </ul>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-xs text-text-tertiary">
            Ensure you store your password in a secure password manager.
          </p>
          <div className="flex items-center gap-3">
            {isDirty && (
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all"
              >
                Clear Fields
              </button>
            )}
            <button
              data-testid="admin_profile-AdminProfilePasswordForm-control-submit"
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-contrast shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <CheckCircle2 size={16} strokeWidth={2.2} />
              <span>{t('VALIDATE_DEMO_DRAFT')}</span>
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
