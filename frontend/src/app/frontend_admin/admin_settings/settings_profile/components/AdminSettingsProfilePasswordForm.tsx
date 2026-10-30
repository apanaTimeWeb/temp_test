'use client';
// RESPONSIBILITY: AdminProfilePasswordForm component owned by admin_profile; responsibility folder: admin_profile_forms.

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { AdminSettingsProfileFormProps } from '@/app/frontend_admin/admin_settings/settings_profile/types/AdminSettingsProfileTypes';
import { AdminProfilePasswordSchema, type AdminProfilePasswordFormValues } from '@/app/frontend_admin/admin_settings/settings_profile/schemas/AdminSettingsProfileSchema';
import { getAdminProfileValidationMessageKey } from '@/app/frontend_admin/admin_settings/settings_profile/schemas/AdminSettingsProfileSchema';

/** Validates the local password-change draft without invoking or implying an authentication mutation. */
export default function AdminProfilePasswordForm({ onDirtyChange }: AdminSettingsProfileFormProps) {
  const t = useTranslations('ADMIN_PROFILE');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<AdminProfilePasswordFormValues>({
    resolver: zodResolver(AdminProfilePasswordSchema),
    mode: 'onBlur',
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  useEffect(() => { onDirtyChange(isDirty); }, [isDirty, onDirtyChange]);

  const handleValidateDraft = handleSubmit(() => {
    toast.info(t('PASSWORD_DRAFT_VALIDATED_BLOCKED'), { id: 'admin_settings-settings_profile-components-AdminSettingsProfilePasswordForm-toast-21-1' });
  });

  return (
    <section className="admin-card p-6" aria-labelledby="admin-profile-password-title">
      <h2 id="admin-profile-password-title" className="text-section-title font-semibold text-text-primary">{t('PASSWORD_TITLE')}</h2>
      <p className="mt-1 text-sm text-text-secondary">{t('PASSWORD_DESCRIPTION')}</p>
      <form onSubmit={handleValidateDraft} noValidate className="mt-4 space-y-4">
        <div>
          <label htmlFor="admin-profile-current-password" className="mb-1 block text-sm font-medium text-text-secondary">{t('FIELD_CURRENT_PASSWORD')}</label>
          <div className="relative">
            <input id="admin-profile-current-password" type={showCurrentPassword ? 'text' : 'password'} autoComplete="current-password" className="admin-input w-full pr-12" {...register('currentPassword')} aria-invalid={Boolean(errors.currentPassword)} aria-describedby={errors.currentPassword ? 'admin-profile-current-password-error' : undefined} />
            <button type="button" className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors motion-safe:duration-fast" aria-label={showCurrentPassword ? t('ARIA_HIDE_CURRENT_PASSWORD') : t('ARIA_SHOW_CURRENT_PASSWORD')} aria-controls="admin-profile-current-password" onClick={() => setShowCurrentPassword((visible) => !visible)}>
              {showCurrentPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
          {errors.currentPassword && <p id="admin-profile-current-password-error" className="mt-1 text-sm text-danger-text" role="alert">{t(getAdminProfileValidationMessageKey('currentPassword', errors.currentPassword.type))}</p>}
        </div>
        <div>
          <label htmlFor="admin-profile-new-password" className="mb-1 block text-sm font-medium text-text-secondary">{t('FIELD_NEW_PASSWORD')}</label>
          <div className="relative">
            <input id="admin-profile-new-password" type={showNewPassword ? 'text' : 'password'} autoComplete="new-password" className="admin-input w-full pr-12" {...register('newPassword')} aria-invalid={Boolean(errors.newPassword)} aria-describedby={errors.newPassword ? 'admin-profile-new-password-error' : undefined} />
            <button type="button" className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors motion-safe:duration-fast" aria-label={showNewPassword ? t('ARIA_HIDE_NEW_PASSWORD') : t('ARIA_SHOW_NEW_PASSWORD')} aria-controls="admin-profile-new-password" onClick={() => setShowNewPassword((visible) => !visible)}>
              {showNewPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
          {errors.newPassword && <p id="admin-profile-new-password-error" className="mt-1 text-sm text-danger-text" role="alert">{t(getAdminProfileValidationMessageKey('newPassword', errors.newPassword.type))}</p>}
        </div>
        <div>
          <label htmlFor="admin-profile-confirm-password" className="mb-1 block text-sm font-medium text-text-secondary">{t('FIELD_CONFIRM_PASSWORD')}</label>
          <div className="relative">
            <input id="admin-profile-confirm-password" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" className="admin-input w-full pr-12" {...register('confirmPassword')} aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? 'admin-profile-confirm-password-error' : undefined} />
            <button type="button" className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors motion-safe:duration-fast" aria-label={showConfirmPassword ? t('ARIA_HIDE_CONFIRM_PASSWORD') : t('ARIA_SHOW_CONFIRM_PASSWORD')} aria-controls="admin-profile-confirm-password" onClick={() => setShowConfirmPassword((visible) => !visible)}>
              {showConfirmPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
          {errors.confirmPassword && <p id="admin-profile-confirm-password-error" className="mt-1 text-sm text-danger-text" role="alert">{t(getAdminProfileValidationMessageKey('confirmPassword', errors.confirmPassword.type))}</p>}
        </div>
        <button data-testid="admin_profile-AdminProfilePasswordForm-control-submit" type="submit" className="admin-btn-primary min-h-11" disabled={isSubmitting}>{t('VALIDATE_DEMO_DRAFT')}</button>
      </form>
    </section>
  );
}
