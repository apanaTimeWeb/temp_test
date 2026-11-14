'use client';
/** Responsibility: Superadmin Profile Basic Panels; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminProfileSecuritySettingsBasicPanels formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { useSuperadminProfileSecuritySettingsValidationMessage } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_security/hooks/useSuperadminProfileSecuritySettingsValidationMessage';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, KeyRound, User, UserCog } from 'lucide-react';
import {
  SUPERADMIN_PROFILE_EDIT_SCHEMA,
} from '@/app/frontend_superadmin/superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecuritySettingsSchema';
import type { SuperadminProfileBasicPanelsProps, SuperadminProfileEditFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes';
import { SUPERADMIN_PROFILE_DEFAULT_VALUES } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_security/constants/SuperadminProfileSecuritySettingsConstants';
import { useTranslations } from 'next-intl';
import { useSuperadminProfileSecuritySettingsUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_security/hooks/useSuperadminProfileSecuritySettingsUnsavedChangesGuard';

/** Feature-owned profile editor. Validates local preview input but never claims persistence. */
export default function SuperadminProfileSecuritySettingsBasicPanels({ activeTab, onDirtyChange }: SuperadminProfileBasicPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_PROFILE');
  const translateValidationMessage = useSuperadminProfileSecuritySettingsValidationMessage();
  const editForm = useForm<SuperadminProfileEditFormValues>({
    resolver: zodResolver(SUPERADMIN_PROFILE_EDIT_SCHEMA),
    defaultValues: SUPERADMIN_PROFILE_DEFAULT_VALUES,
    mode: 'onBlur',
  });
  useSuperadminProfileSecuritySettingsUnsavedChangesGuard(editForm.formState.isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  // Effect contract: report the current form dirty flag to the owning route; [editForm.formState.isDirty, onDirtyChange] keeps the navigation guard synchronized.
  useEffect(() => { onDirtyChange?.(editForm.formState.isDirty); }, [editForm.formState.isDirty, onDirtyChange]);
  const submitProfilePreview = editForm.handleSubmit(() => undefined);
  return (
    <>
      {activeTab === 'Profile' && (
        <section className="motion-safe:animate-fade-in motion-reduce:animate-none space-y-8" aria-labelledby="superadmin-profile-information-title">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="p-3 rounded-lg bg-info-bg text-info"><User size={24} aria-hidden="true" /></div>
            <div>
              <h2 id="superadmin-profile-information-title" className="text-xl font-bold text-primary">{tCopy("COPY.PERSONAL_INFORMATION")}</h2>
              <p className="text-sm text-secondary">{tCopy("COPY.SAMPLE_ACCOUNT_DETAILS_LIVE_PROFILE_DATA_IS_UNAVAILABLE_IN_THIS_SOURCE_PACKAGE")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div><p className="text-xs text-secondary block mb-1">{tCopy("COPY.FULL_NAME")}</p><p className="text-base text-primary font-medium">{tCopy("COPY.SAMPLE_ADMINISTRATOR")}</p></div>
            <div><p className="text-xs text-secondary block mb-1">{tCopy("COPY.EMAIL")}</p><p className="text-base text-primary font-medium">{tCopy("COPY.ADMIN_EXAMPLE_INVALID")}</p></div>
            <div><p className="text-xs text-secondary block mb-1">{tCopy("COPY.PHONE")}</p><p className="text-base text-primary font-medium">+91 0000000000</p></div>
            <div><p className="text-xs text-secondary block mb-1">{tCopy("COPY.ROLE")}</p><p className="text-base text-primary font-medium">{tCopy("COPY.PLATFORM_OWNER_SAMPLE")}</p></div>
            <div><p className="text-xs text-secondary block mb-1">{tCopy("COPY.JOINED_DATE")}</p><p className="text-base text-primary font-medium">{tCopy("COPY.NOT_CONNECTED")}</p></div>
            <div><p className="text-xs text-secondary block mb-1">{tCopy("COPY.TIMEZONE")}</p><p className="text-base text-primary font-medium">{tCopy("COPY.ASIA_KOLKATA_SAMPLE")}</p></div>
          </div>
        </section>
      )}

      {activeTab === 'Edit Profile' && (
        <section className="max-w-2xl space-y-6 motion-safe:animate-fade-in motion-reduce:animate-none" aria-labelledby="superadmin-profile-edit-title">
          <div className="flex items-center gap-4 border-b border-border pb-4 mb-6">
            <div className="p-3 rounded-lg bg-success-bg text-success"><UserCog size={24} aria-hidden="true" /></div>
            <div><h2 id="superadmin-profile-edit-title" className="text-xl font-bold text-primary">{tCopy("COPY.EDIT_PERSONAL_DETAILS")}</h2><p className="text-sm text-secondary">{tCopy("COPY.VALIDATE_A_LOCAL_DRAFT_THE_HOST_PROFILE_UPDATE_API_IS_NOT_SUPPLIED")}</p></div>
          </div>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-primary-subtle flex items-center justify-center text-primary text-2xl font-bold border border-focus" aria-label={tCopy("COPY.SAMPLE_PROFILE_AVATAR")}>{tCopy("COPY.SA")}</div>
            <div><button type="button" disabled title={tCopy("COPY.UNAVAILABLE_PHOTO_UPLOAD_IS_NOT_IMPLEMENTED_IN_THE_SUPPLIED_SOURCE_PACKAGE")} className="sa-btn-secondary text-sm mb-2 opacity-60 cursor-not-allowed" data-testid="superadmin-profile-profile-basic-panels-unavailable-photo-upload-is-not-implemented-in-the-supplied-source-package-1"><Camera size={14} aria-hidden="true" className="inline mr-1" /> {tCopy("COPY.PHOTO_UPLOAD_UNAVAILABLE")}</button><p className="text-xs text-secondary">{tCopy("COPY.PHOTO_UPLOAD_REQUIRES_AN_APPROVED_UPLOAD_CONTRACT")}</p></div>
          </div>
          <form onSubmit={submitProfilePreview} noValidate className="space-y-4" data-testid="superadmin-superadmin-profile-overview-basic-panels-form-line-61">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="superadmin-profile-first-name" className="text-sm font-semibold text-primary">{tCopy("COPY.FIRST_NAME")}</label>
                <input id="superadmin-profile-first-name" autoComplete="given-name" className="sa-input" aria-invalid={Boolean(editForm.formState.errors.firstName)} aria-describedby={editForm.formState.errors.firstName ? 'superadmin-profile-first-name-error' : undefined} {...editForm.register('firstName')}  data-testid="superadmin-profile-profile-basic-panels-superadmin-profile-first-name-2"/>
                {translateValidationMessage(editForm.formState.errors.firstName?.message) && <p id="superadmin-profile-first-name-error" role="alert" className="text-xs text-danger">{translateValidationMessage(editForm.formState.errors.firstName.message)}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="superadmin-profile-last-name" className="text-sm font-semibold text-primary">{tCopy("COPY.LAST_NAME")}</label>
                <input id="superadmin-profile-last-name" autoComplete="family-name" className="sa-input" aria-invalid={Boolean(editForm.formState.errors.lastName)} aria-describedby={editForm.formState.errors.lastName ? 'superadmin-profile-last-name-error' : undefined} {...editForm.register('lastName')}  data-testid="superadmin-profile-profile-basic-panels-superadmin-profile-last-name-3"/>
                {translateValidationMessage(editForm.formState.errors.lastName?.message) && <p id="superadmin-profile-last-name-error" role="alert" className="text-xs text-danger">{translateValidationMessage(editForm.formState.errors.lastName.message)}</p>}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="superadmin-profile-email" className="text-sm font-semibold text-primary">{tCopy("COPY.EMAIL_ADDRESS")}</label>
                <input id="superadmin-profile-email" type="email" autoComplete="email" className="sa-input" aria-invalid={Boolean(editForm.formState.errors.email)} aria-describedby={editForm.formState.errors.email ? 'superadmin-profile-email-error' : undefined} {...editForm.register('email')}  data-testid="superadmin-profile-profile-basic-panels-superadmin-profile-email-4"/>
                {translateValidationMessage(editForm.formState.errors.email?.message) && <p id="superadmin-profile-email-error" role="alert" className="text-xs text-danger">{translateValidationMessage(editForm.formState.errors.email.message)}</p>}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="superadmin-profile-phone" className="text-sm font-semibold text-primary">{tCopy("COPY.PHONE_NUMBER")}</label>
                <input id="superadmin-profile-phone" type="tel" autoComplete="tel" className="sa-input" aria-invalid={Boolean(editForm.formState.errors.phone)} aria-describedby={editForm.formState.errors.phone ? 'superadmin-profile-phone-error' : undefined} {...editForm.register('phone')}  data-testid="superadmin-profile-profile-basic-panels-superadmin-profile-phone-5"/>
                {translateValidationMessage(editForm.formState.errors.phone?.message) && <p id="superadmin-profile-phone-error" role="alert" className="text-xs text-danger">{translateValidationMessage(editForm.formState.errors.phone.message)}</p>}
              </div>
            </div>
            <p className="rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.THIS_FORM_VALIDATES_A_LOCAL_PREVIEW_ONLY_SUBMIT_DOES_NOT_SAVE_ACCOUNT_DETAILS_TO_A_SERVER")}</p>
            <div className="pt-4 border-t border-border flex flex-wrap gap-3">
              <button type="submit" className="sa-btn-primary px-8" disabled data-disabled-reason="No approved profile write API contract is supplied" title={tCopy("COPY.VALIDATE_DRAFT_SAVE_UNAVAILABLE")} data-testid="superadmin-profile-profile-basic-panels-validate-draft-save-unavailable-6">{tCopy("COPY.VALIDATE_DRAFT_SAVE_UNAVAILABLE")}</button>
              <button type="button" onClick={() => editForm.reset(SUPERADMIN_PROFILE_DEFAULT_VALUES)} className="sa-btn-ghost" data-testid="superadmin-profile-profile-basic-panels-reset-draft-7">{tCopy("COPY.RESET_DRAFT")}</button>
            </div>
          </form>
        </section>
      )}

      {activeTab === 'Change Password' && (
        <section className="max-w-xl space-y-6 motion-safe:animate-fade-in motion-reduce:animate-none" aria-labelledby="superadmin-profile-password-title">
          <div className="flex items-center gap-4 border-b border-border pb-4 mb-6">
            <div className="p-3 rounded-lg bg-warning-bg text-warning"><KeyRound size={24} aria-hidden="true" /></div>
            <div><h2 id="superadmin-profile-password-title" className="text-xl font-bold text-primary">{tCopy("COPY.CHANGE_PASSWORD")}</h2><p className="text-sm text-secondary">{tCopy("COPY.CREDENTIAL_ENTRY_IS_DISABLED_BECAUSE_NO_VERIFIED_PASSWORD_CHANGE_ENDPOINT_IS_SUPPLIED")}</p></div>
          </div>
          <div className="space-y-5" aria-describedby="superadmin-profile-password-unavailable">
            {[
              { id: 'superadmin-profile-current-password', label: tCopy('COPY.CURRENT_PASSWORD') },
              { id: 'superadmin-profile-new-password', label: tCopy('COPY.NEW_PASSWORD') },
              { id: 'superadmin-profile-confirm-password', label: tCopy('COPY.CONFIRM_NEW_PASSWORD') },
            ].map((field) => (
              <div key={field.id} className="flex flex-col gap-2">
                <label htmlFor={field.id} className="text-sm font-semibold text-primary">{field.label}</label>
                <input id={field.id} type="password" autoComplete="off" className="sa-input w-full" disabled aria-describedby="superadmin-profile-password-unavailable"  data-testid={`superadmin-profile-profile-basic-panels-field-8-${String(field.id)}`}/>
              </div>
            ))}
            <p id="superadmin-profile-password-unavailable" className="rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.PASSWORD_CHANGES_ARE_UNAVAILABLE_BECAUSE_NO_VERIFIED_HOST_ENDPOINT_IS_SUPPLIED_CREDENTIAL_ENTRY_REMAINS_DISABLED_DO_NOT_ENTER_REAL_CREDENTIALS_INTO_THIS_SOURCE_ONLY_PREVIEW")}</p>
            <div className="pt-4 border-t border-border flex gap-3"><button type="button" className="sa-btn-primary" disabled aria-describedby="superadmin-profile-password-unavailable" data-testid="superadmin-profile-profile-basic-panels-password-change-unavailable-9">{tCopy("COPY.PASSWORD_CHANGE_UNAVAILABLE")}</button></div>
          </div>
        </section>
      )}
    </>
  );
}
