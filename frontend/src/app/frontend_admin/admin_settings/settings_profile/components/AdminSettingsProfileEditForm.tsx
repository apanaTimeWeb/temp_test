'use client';
// RESPONSIBILITY: AdminProfileEditForm component owned by admin_profile; responsibility folder: admin_profile_forms.

import { ADMIN_PROFILE_DEMO_ACCOUNT } from '@/app/frontend_admin/admin_settings/settings_profile/config/admin_settings_profile.demo_data';
import { AdminProfileEditSchema,getAdminProfileValidationMessageKey,type AdminProfileEditFormValues } from '@/app/frontend_admin/admin_settings/settings_profile/schemas/AdminSettingsProfileSchema';
import type { AdminSettingsProfileFormProps } from '@/app/frontend_admin/admin_settings/settings_profile/types/AdminSettingsProfileTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2,FileText,Mail,Phone,User,UserCog } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

/** Owns edit-profile draft validation; it never claims to persist without an approved profile API. */
export default function AdminProfileEditForm({ onDirtyChange }: AdminSettingsProfileFormProps) {
  const t = useTranslations('ADMIN_PROFILE');
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<AdminProfileEditFormValues>({
    resolver: zodResolver(AdminProfileEditSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: t(ADMIN_PROFILE_DEMO_ACCOUNT.nameKey),
      phone: ADMIN_PROFILE_DEMO_ACCOUNT.phone,
      email: ADMIN_PROFILE_DEMO_ACCOUNT.email,
      bio: t(ADMIN_PROFILE_DEMO_ACCOUNT.bio),
    },
  });
  useEffect(() => { onDirtyChange(isDirty); }, [isDirty, onDirtyChange]);

  const handleValidateDraft = handleSubmit(() => {
    toast.info(t('EDIT_DRAFT_VALIDATED_BLOCKED'), { id: 'admin_settings-settings_profile-components-AdminSettingsProfileEditForm-toast-27-1' });
  });

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8" aria-labelledby="admin-profile-edit-title">
      {/* Decorative ambient background accent */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-subtle blur-3xl" aria-hidden="true" />

      {/* Header section */}
      <div className="flex flex-col gap-2 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-focus bg-primary-subtle text-primary shadow-card">
            <UserCog size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 id="admin-profile-edit-title" className="text-lg font-bold tracking-tight text-text-primary sm:text-xl">
              {t('EDIT_TITLE')}
            </h2>
            <p className="mt-0.5 text-xs text-text-secondary sm:text-sm">
              {t('EDIT_DESCRIPTION')}
            </p>
          </div>
        </div>
        {isDirty && (
          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-warning bg-warning-bg px-3 py-1 text-xs font-semibold text-warning-text sm:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-warning motion-safe:animate-pulse" />
            Unsaved Changes
          </span>
        )}
      </div>

      <form onSubmit={handleValidateDraft} noValidate className="mt-6 space-y-6">
        {/* ROW 1: Full Name & Phone Number */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Full Name Field */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-primary" aria-hidden="true" />
              <label htmlFor="admin-profile-edit-name" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {t('FIELD_FULL_NAME')}
              </label>
              <span className="text-danger-text" aria-hidden="true">*</span>
            </div>
            <div className="relative">
              <input maxLength={30}
                id="admin-profile-edit-name"
                type="text"
                autoComplete="name"
                className={`w-full rounded-xl border bg-input px-4 py-2.5 text-sm font-medium text-text-primary placeholder:text-text-secondary motion-safe:transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring ${
                  errors.fullName
                    ? 'border-danger ring-1 ring-danger'
                    : 'border-border hover:border-border-focus focus:border-primary'
                }`}
                placeholder="Enter full name"
                {...register('fullName')}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? 'admin-profile-edit-name-error' : undefined}
              />
            </div>
            {errors.fullName && (
              <p id="admin-profile-edit-name-error" className="flex items-center gap-1 text-xs font-medium text-danger-text" role="alert">
                {t(getAdminProfileValidationMessageKey('fullName', errors.fullName.type))}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Phone size={14} className="text-primary" aria-hidden="true" />
              <label htmlFor="admin-profile-edit-phone" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {t('FIELD_PHONE')}
              </label>
              <span className="text-danger-text" aria-hidden="true">*</span>
            </div>
            <div className="relative">
              <input maxLength={15}
                id="admin-profile-edit-phone"
                type="tel"
                autoComplete="tel"
                placeholder="Enter contact phone number"
                className={`w-full rounded-xl border bg-input px-4 py-2.5 text-sm font-mono text-text-primary placeholder:text-text-secondary motion-safe:transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring ${
                  errors.phone
                    ? 'border-danger ring-1 ring-danger'
                    : 'border-border hover:border-border-focus focus:border-primary'
                }`}
                {...register('phone')}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'admin-profile-edit-phone-error' : undefined}
              />
            </div>
            {errors.phone && (
              <p id="admin-profile-edit-phone-error" className="flex items-center gap-1 text-xs font-medium text-danger-text" role="alert">
                {t(getAdminProfileValidationMessageKey('phone', errors.phone.type))}
              </p>
            )}
          </div>
        </div>

        {/* ROW 2: Email Address */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Mail size={14} className="text-primary" aria-hidden="true" />
              <label htmlFor="admin-profile-edit-email" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {t('FIELD_EMAIL')}
              </label>
              <span className="text-danger-text" aria-hidden="true">*</span>
            </div>
            <span className="inline-flex items-center gap-1 text-micro font-semibold text-success-text bg-success-bg border border-success px-2 py-0.5 rounded-full">
              Primary System Email
            </span>
          </div>
          <div className="relative">
            <input maxLength={30}
              id="admin-profile-edit-email"
              type="email"
              autoComplete="email"
              className={`w-full rounded-xl border bg-input px-4 py-2.5 text-sm font-medium text-text-primary placeholder:text-text-secondary motion-safe:transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring ${
                errors.email
                  ? 'border-danger ring-1 ring-danger'
                  : 'border-border hover:border-border-focus focus:border-primary'
              }`}
              placeholder="admin@example.com"
              {...register('email')}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'admin-profile-edit-email-error' : undefined}
            />
          </div>
          {errors.email && (
            <p id="admin-profile-edit-email-error" className="flex items-center gap-1 text-xs font-medium text-danger-text" role="alert">
              {t(getAdminProfileValidationMessageKey('email', errors.email.type))}
            </p>
          )}
        </div>

        {/* ROW 3: Bio */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FileText size={14} className="text-primary" aria-hidden="true" />
              <label htmlFor="admin-profile-edit-bio" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {t('FIELD_BIO')}
              </label>
            </div>
            <span className="text-xs text-text-secondary">Optional</span>
          </div>
          <textarea maxLength={1000}
            id="admin-profile-edit-bio"
            rows={4}
            className={`w-full rounded-xl border bg-input p-4 text-sm font-medium text-text-primary placeholder:text-text-secondary motion-safe:transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring ${
              errors.bio
                ? 'border-danger ring-1 ring-danger'
                : 'border-border hover:border-border-focus focus:border-primary'
            }`}
            placeholder="Tell us a little about your role and responsibilities..."
            {...register('bio')}
            aria-invalid={Boolean(errors.bio)}
            aria-describedby={errors.bio ? 'admin-profile-edit-bio-error' : undefined}
          />
          {errors.bio && (
            <p id="admin-profile-edit-bio-error" className="flex items-center gap-1 text-xs font-medium text-danger-text" role="alert">
              {t(getAdminProfileValidationMessageKey('bio', errors.bio.type))}
            </p>
          )}
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-xs text-text-secondary">
            Changes will update your system display and operational notification preferences.
          </p>
          <div className="flex items-center gap-3">
            {isDirty && (
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
              >
                Reset Draft
              </button>
            )}
            <button
              data-testid="admin_profile-AdminProfileEditForm-control-submit"
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
