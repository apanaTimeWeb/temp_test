'use client';
/** Responsibility: Superadmin System Profile Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminLibrariesProfileConfigurationPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useTranslations } from 'next-intl';
import { useSuperadminLibrariesProfileConfigurationValidationMessage } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/hooks/useSuperadminLibrariesProfileConfigurationValidationMessage';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SuperadminLibrariesProfileConfigurationSchema, type SuperadminSystemProfileFormValues } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/schemas/SuperadminLibrariesProfileConfigurationSchema';
import { SUPERADMIN_LIBRARIES_PROFILE_CONFIGURATION_PREVIEW_DEFAULTS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/mocks/fixtures/SuperadminLibrariesProfileConfigurationPreviewDefaults';
import { SuperadminLibrariesProfileConfigurationCard as Card } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/components/SuperadminLibrariesProfileConfigurationCard';
import { SuperadminLibrariesProfileConfigurationCardHeader as CardHeader } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/components/SuperadminLibrariesProfileConfigurationCardHeader';
import { SuperadminLibrariesProfileConfigurationCardTitle as CardTitle } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/components/SuperadminLibrariesProfileConfigurationCardTitle';
import { SuperadminLibrariesProfileConfigurationCardDescription as CardDescription } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/components/SuperadminLibrariesProfileConfigurationCardDescription';
import { SuperadminLibrariesProfileConfigurationCardContent as CardContent } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/components/SuperadminLibrariesProfileConfigurationCardContent';
import { SuperadminLibrariesProfileConfigurationCardFooter as CardFooter } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/components/SuperadminLibrariesProfileConfigurationCardFooter';
import { SuperadminLibrariesProfileConfigurationButton as Button } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/components/SuperadminLibrariesProfileConfigurationButton';
import { SuperadminLibrariesProfileConfigurationInput as Input } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/components/SuperadminLibrariesProfileConfigurationInput';
import { SuperadminLibrariesProfileConfigurationLabel as Label } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/components/SuperadminLibrariesProfileConfigurationLabel';
import { User, Lock, Camera, ChevronRight } from 'lucide-react';
import { useSuperadminLibrariesProfileConfigurationUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/hooks/useSuperadminLibrariesProfileConfigurationUnsavedChangesGuard';

/**
 * Renders the `superadmin_system` view owned by `SuperadminLibrariesProfileConfigurationPageClient`.
 * Owns local UI state for `profilePreviewMessage`.
 * Dirty form state is guarded before destructive or route-leaving actions.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminLibrariesProfileConfigurationPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  const translateValidationMessage = useSuperadminLibrariesProfileConfigurationValidationMessage();
  const [profilePreviewMessage, setProfilePreviewMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors , isDirty},
  } = useForm<SuperadminSystemProfileFormValues>({
    resolver: zodResolver(SuperadminLibrariesProfileConfigurationSchema),
    defaultValues: SUPERADMIN_LIBRARIES_PROFILE_CONFIGURATION_PREVIEW_DEFAULTS,
    mode: 'onBlur',
  });
  useSuperadminLibrariesProfileConfigurationUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-secondary text-xs font-medium tracking-wide mb-1">
          <span>{tCopy("COPY.SYSTEM")}</span>
          <ChevronRight size={12} />
          <span>{tCopy("COPY.PROFILE")}</span>
        </div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <User size={28} className="text-primary" />
          {tCopy("COPY.MY_PROFILE")}</h1>
        <p className="text-secondary mt-1 text-sm">{tCopy("COPY.PREVIEW_PROFILE_INFORMATION_AND_ACCOUNT_SECURITY_SETTINGS")}</p>
        <p className="mt-3 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.PREVIEW_ONLY_PROFILE_VALUES_ARE_SYNTHETIC_AND_ARE_NOT_CONNECTED_TO_47BEBAB1")}</p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>{tCopy("COPY.PERSONAL_INFORMATION")}</CardTitle>
            <CardDescription>{tCopy("COPY.UPDATE_YOUR_DISPLAY_NAME_EMAIL_AND_PHONE")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form id="superadmin-system-profile-form" className="space-y-5" noValidate onSubmit={handleSubmit(() => setProfilePreviewMessage(tCopy("COPY.SAMPLE_PROFILE_PASSED_LOCAL_VALIDATION_NOT_SAVED")))} data-testid="superadmin-superadmin-system-profile-page-client-form-line-66">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="h-20 w-20 rounded-full bg-primary-subtle border-2 border-focus flex items-center justify-center text-primary text-3xl font-bold select-none">
                  {tCopy("COPY.A")}</div>
                <button
                  id="change-photo-btn"
                  type="button"
                  disabled
                  title={tCopy("COPY.UNAVAILABLE_NO_PHOTO_INPUT_OR_UPLOAD_API_IS_SUPPLIED")}
                  aria-label={tCopy("COPY.PROFILE_PHOTO_UPLOAD_UNAVAILABLE")}
                  className="absolute inset-0 rounded-full bg-overlay flex items-center justify-center text-secondary opacity-60 cursor-not-allowed"
                 data-testid="superadmin-system-system-profile-change-photo-btn-1">
                  <Camera size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-name">{tCopy("COPY.FULL_NAME")}<span className="text-danger">*</span></Label>
              <Input id="profile-name" {...register('fullName')} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'profile-name-error' : undefined}  data-testid="superadmin_libraries_profile_configuration-profile-name"/>
              {errors.fullName && <p id="profile-name-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.fullName.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">{tCopy("COPY.EMAIL")}</Label>
              <Input id="profile-email" type="email" {...register('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'profile-email-error' : undefined}  data-testid="superadmin_libraries_profile_configuration-profile-email"/>
              {errors.email && <p id="profile-email-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.email.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-phone">{tCopy("COPY.PHONE")}<span className="text-danger">*</span></Label>
              <Input id="profile-phone" type="tel" {...register('phone')} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'profile-phone-error' : undefined}  data-testid="superadmin_libraries_profile_configuration-profile-phone"/>
              {errors.phone && <p id="profile-phone-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.phone.message)}</p>}
            </div>
            </form>
            {profilePreviewMessage && <p className="rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{profilePreviewMessage}</p>}
          </CardContent>
          <CardFooter>
            <Button type="button" id="validate-profile-preview-btn" variant="ghost" onClick={handleSubmit(() => setProfilePreviewMessage(tCopy("COPY.SAMPLE_PROFILE_PASSED_LOCAL_VALIDATION_NOT_SAVED")))} data-testid="superadmin_libraries_profile_configuration-validate-profile-preview-btn">{tCopy("COPY.VALIDATE_PROFILE_PREVIEW")}</Button>
            <Button type="button" id="update-profile-btn" variant="primary" disabled title={tCopy("COPY.UNAVAILABLE_NO_PROFILE_UPDATE_API_CONTRACT_IS_SUPPLIED")} data-testid="superadmin_libraries_profile_configuration-update-profile-btn">{tCopy("COPY.UPDATE_PROFILE_UNAVAILABLE")}</Button>
          </CardFooter>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={18} className="text-primary" />
              {tCopy("COPY.CHANGE_PASSWORD")}</CardTitle>
            <CardDescription>{tCopy("COPY.UPDATE_YOUR_ACCOUNT_PASSWORD_REGULARLY_FOR_SECURITY")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-warning">{tCopy("COPY.PASSWORD_CONTROLS_ARE_UNAVAILABLE_IN_THIS_SOURCE_ONLY_PACKAGE_INPU_A27484D6")}</p>
            <div className="space-y-2">
              <Label htmlFor="current-password">{tCopy("COPY.CURRENT_PASSWORD")}</Label>
              <Input id="current-password" type="password" disabled placeholder={tCopy("COPY.UNAVAILABLE_SECURE_HOST_INTEGRATION_REQUIRED")} aria-describedby="password-contract-note"  data-testid="superadmin_libraries_profile_configuration-current-password"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">{tCopy("COPY.NEW_PASSWORD")}</Label>
              <Input id="new-password" type="password" disabled placeholder={tCopy("COPY.UNAVAILABLE_SECURE_HOST_INTEGRATION_REQUIRED")} aria-describedby="password-contract-note"  data-testid="superadmin_libraries_profile_configuration-new-password"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{tCopy("COPY.CONFIRM_NEW_PASSWORD")}</Label>
              <Input id="confirm-password" type="password" disabled placeholder={tCopy("COPY.UNAVAILABLE_SECURE_HOST_INTEGRATION_REQUIRED")} aria-describedby="password-contract-note"  data-testid="superadmin_libraries_profile_configuration-confirm-password"/>
            </div>
            <p id="password-contract-note" className="text-xs text-secondary">{tCopy("COPY.NO_PASSWORDS_ARE_READ_STORED_OR_TRANSMITTED_BY_THIS_PREVIEW")}</p>
          </CardContent>
          <CardFooter>
            <Button type="button" id="change-password-btn" variant="primary" disabled title={tCopy("COPY.UNAVAILABLE_NO_PASSWORD_CHANGE_API_CONTRACT_IS_SUPPLIED")} data-testid="superadmin_libraries_profile_configuration-change-password-btn">{tCopy("COPY.CHANGE_PASSWORD_UNAVAILABLE")}</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
