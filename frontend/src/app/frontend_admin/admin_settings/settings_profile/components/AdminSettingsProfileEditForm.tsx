'use client';
// RESPONSIBILITY: AdminProfileEditForm component owned by admin_profile; responsibility folder: admin_profile_forms.

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import type { AdminSettingsProfileFormProps } from '@/app/frontend_admin/admin_settings/settings_profile/types/AdminSettingsProfileTypes';
import { AdminProfileEditSchema, type AdminProfileEditFormValues } from '@/app/frontend_admin/admin_settings/settings_profile/schemas/AdminSettingsProfileSchema';
import { ADMIN_PROFILE_DEMO_ACCOUNT } from '@/app/frontend_admin/admin_settings/settings_profile/mocks/AdminSettingsProfileFixtures';
import { getAdminProfileValidationMessageKey } from '@/app/frontend_admin/admin_settings/settings_profile/schemas/AdminSettingsProfileSchema';

/** Owns edit-profile draft validation; it never claims to persist without an approved profile API. */
export default function AdminProfileEditForm({ onDirtyChange }: AdminSettingsProfileFormProps) {
  const t = useTranslations('ADMIN_PROFILE');
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<AdminProfileEditFormValues>({
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
    <section className="admin-card p-6" aria-labelledby="admin-profile-edit-title">
      <h2 id="admin-profile-edit-title" className="text-section-title font-semibold text-text-primary">{t('EDIT_TITLE')}</h2>
      <p className="mt-1 text-sm text-text-secondary">{t('EDIT_DESCRIPTION')}</p>
      <form onSubmit={handleValidateDraft} noValidate className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="admin-profile-edit-name" className="mb-1 block text-sm font-medium text-text-secondary">{t('FIELD_FULL_NAME')}</label>
            <input id="admin-profile-edit-name" type="text" autoComplete="name" className="admin-input w-full" {...register('fullName')} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'admin-profile-edit-name-error' : undefined} />
            {errors.fullName && <p id="admin-profile-edit-name-error" className="mt-1 text-sm text-danger-text" role="alert">{t(getAdminProfileValidationMessageKey('fullName', errors.fullName.type))}</p>}
          </div>
          <div>
            <label htmlFor="admin-profile-edit-phone" className="mb-1 block text-sm font-medium text-text-secondary">{t('FIELD_PHONE')}</label>
            <input id="admin-profile-edit-phone" type="tel" autoComplete="tel" className="admin-input w-full" {...register('phone')} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'admin-profile-edit-phone-error' : undefined} />
            {errors.phone && <p id="admin-profile-edit-phone-error" className="mt-1 text-sm text-danger-text" role="alert">{t(getAdminProfileValidationMessageKey('phone', errors.phone.type))}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="admin-profile-edit-email" className="mb-1 block text-sm font-medium text-text-secondary">{t('FIELD_EMAIL')}</label>
          <input id="admin-profile-edit-email" type="email" autoComplete="email" className="admin-input w-full" {...register('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'admin-profile-edit-email-error' : undefined} />
          {errors.email && <p id="admin-profile-edit-email-error" className="mt-1 text-sm text-danger-text" role="alert">{t(getAdminProfileValidationMessageKey('email', errors.email.type))}</p>}
        </div>
        <div>
          <label htmlFor="admin-profile-edit-bio" className="mb-1 block text-sm font-medium text-text-secondary">{t('FIELD_BIO')}</label>
          <textarea id="admin-profile-edit-bio" rows={4} className="admin-input w-full" {...register('bio')} aria-invalid={Boolean(errors.bio)} aria-describedby={errors.bio ? 'admin-profile-edit-bio-error' : undefined} />
          {errors.bio && <p id="admin-profile-edit-bio-error" className="mt-1 text-sm text-danger-text" role="alert">{t(getAdminProfileValidationMessageKey('bio', errors.bio.type))}</p>}
        </div>
        <button data-testid="admin_profile-AdminProfileEditForm-control-submit" type="submit" className="admin-btn-primary min-h-11" disabled={isSubmitting}>{t('VALIDATE_DEMO_DRAFT')}</button>
      </form>
    </section>
  );
}
