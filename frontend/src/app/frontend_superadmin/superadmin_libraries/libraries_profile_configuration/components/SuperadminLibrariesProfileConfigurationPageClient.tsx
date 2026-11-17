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
import { User, Lock, Camera, ChevronRight, ShieldCheck, AlertTriangle, Mail, Phone, CheckCircle2, KeyRound } from 'lucide-react';
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
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* ── Top Hero Header ── */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-card via-card/95 to-indigo-950/20 p-5 sm:p-7 shadow-xl shadow-black/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="hover:text-slate-200 transition-colors">{tCopy("COPY.SYSTEM")}</span>
              <ChevronRight size={12} className="text-slate-600" />
              <span className="text-indigo-400">{tCopy("COPY.PROFILE")}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-md shadow-indigo-500/10">
                <User size={24} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
                  {tCopy("COPY.MY_PROFILE")}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {tCopy("COPY.PREVIEW_PROFILE_INFORMATION_AND_ACCOUNT_SECURITY_SETTINGS")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verified Superadmin
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 shadow-xs">
              Root Authority
            </span>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs sm:text-sm text-amber-200" role="status">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{tCopy("COPY.PREVIEW_ONLY_PROFILE_VALUES_ARE_SYNTHETIC_AND_ARE_NOT_CONNECTED_TO_47BEBAB1")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <CardTitle>{tCopy("COPY.PERSONAL_INFORMATION")}</CardTitle>
                  <CardDescription>{tCopy("COPY.UPDATE_YOUR_DISPLAY_NAME_EMAIL_AND_PHONE")}</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form id="superadmin-system-profile-form" className="space-y-6" noValidate onSubmit={handleSubmit(() => setProfilePreviewMessage(tCopy("COPY.SAMPLE_PROFILE_PASSED_LOCAL_VALIDATION_NOT_SAVED")))} data-testid="superadmin-superadmin-system-profile-page-client-form-line-66">
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border border-border/70 bg-background/50">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 border-2 border-indigo-400/50 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-indigo-500/25 select-none ring-4 ring-indigo-500/20">
                    {tCopy("COPY.A")}
                  </div>
                  <button
                    id="change-photo-btn"
                    type="button"
                    disabled
                    title={tCopy("COPY.UNAVAILABLE_NO_PHOTO_INPUT_OR_UPLOAD_API_IS_SUPPLIED")}
                    aria-label={tCopy("COPY.PROFILE_PHOTO_UPLOAD_UNAVAILABLE")}
                    className="absolute inset-0 rounded-full bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed"
                    data-testid="superadmin-system-system-profile-change-photo-btn-1"
                  >
                    <Camera size={22} className="text-indigo-300" />
                    <span className="text-[10px] font-semibold mt-1">Upload</span>
                  </button>
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h4 className="text-sm font-bold text-slate-100">Super Administrator Avatar</h4>
                  <p className="text-xs text-slate-400">Default avatar generated from system credentials. Custom image upload is preview gated.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="profile-name">
                    <User size={13} className="text-indigo-400" />
                    {tCopy("COPY.FULL_NAME")}<span className="text-rose-400">*</span>
                  </Label>
                  <Input id="profile-name" {...register('fullName')} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'profile-name-error' : undefined} data-testid="superadmin_libraries_profile_configuration-profile-name" />
                  {errors.fullName && <p id="profile-name-error" className="text-xs text-rose-400 font-medium" role="alert">{translateValidationMessage(errors.fullName.message)}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-email">
                    <Mail size={13} className="text-indigo-400" />
                    {tCopy("COPY.EMAIL")}
                  </Label>
                  <Input id="profile-email" type="email" {...register('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'profile-email-error' : undefined} data-testid="superadmin_libraries_profile_configuration-profile-email" />
                  {errors.email && <p id="profile-email-error" className="text-xs text-rose-400 font-medium" role="alert">{translateValidationMessage(errors.email.message)}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-phone">
                    <Phone size={13} className="text-indigo-400" />
                    {tCopy("COPY.PHONE")}<span className="text-rose-400">*</span>
                  </Label>
                  <Input id="profile-phone" type="tel" {...register('phone')} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'profile-phone-error' : undefined} data-testid="superadmin_libraries_profile_configuration-profile-phone" />
                  {errors.phone && <p id="profile-phone-error" className="text-xs text-rose-400 font-medium" role="alert">{translateValidationMessage(errors.phone.message)}</p>}
                </div>
              </div>
            </form>

            {profilePreviewMessage && (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs sm:text-sm text-emerald-300" role="status">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{profilePreviewMessage}</span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              id="validate-profile-preview-btn"
              variant="ghost"
              onClick={handleSubmit(() => setProfilePreviewMessage(tCopy("COPY.SAMPLE_PROFILE_PASSED_LOCAL_VALIDATION_NOT_SAVED")))}
              data-testid="superadmin_libraries_profile_configuration-validate-profile-preview-btn"
            >
              <CheckCircle2 size={15} className="text-indigo-400" />
              {tCopy("COPY.VALIDATE_PROFILE_PREVIEW")}
            </Button>
            <Button
              type="button"
              id="update-profile-btn"
              variant="primary"
              disabled
              title={tCopy("COPY.UNAVAILABLE_NO_PROFILE_UPDATE_API_CONTRACT_IS_SUPPLIED")}
              data-testid="superadmin_libraries_profile_configuration-update-profile-btn"
            >
              <ShieldCheck size={16} />
              {tCopy("COPY.UPDATE_PROFILE_UNAVAILABLE")}
            </Button>
          </CardFooter>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Lock size={18} />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {tCopy("COPY.CHANGE_PASSWORD")}
                </CardTitle>
                <CardDescription>{tCopy("COPY.UPDATE_YOUR_ACCOUNT_PASSWORD_REGULARLY_FOR_SECURITY")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300">
              <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
              <p>{tCopy("COPY.PASSWORD_CONTROLS_ARE_UNAVAILABLE_IN_THIS_SOURCE_ONLY_PACKAGE_INPU_A27484D6")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="current-password">
                  <KeyRound size={12} className="text-amber-400" />
                  {tCopy("COPY.CURRENT_PASSWORD")}
                </Label>
                <Input id="current-password" type="password" disabled placeholder={tCopy("COPY.UNAVAILABLE_SECURE_HOST_INTEGRATION_REQUIRED")} aria-describedby="password-contract-note" data-testid="superadmin_libraries_profile_configuration-current-password" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-password">
                  <KeyRound size={12} className="text-amber-400" />
                  {tCopy("COPY.NEW_PASSWORD")}
                </Label>
                <Input id="new-password" type="password" disabled placeholder={tCopy("COPY.UNAVAILABLE_SECURE_HOST_INTEGRATION_REQUIRED")} aria-describedby="password-contract-note" data-testid="superadmin_libraries_profile_configuration-new-password" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">
                  <KeyRound size={12} className="text-amber-400" />
                  {tCopy("COPY.CONFIRM_NEW_PASSWORD")}
                </Label>
                <Input id="confirm-password" type="password" disabled placeholder={tCopy("COPY.UNAVAILABLE_SECURE_HOST_INTEGRATION_REQUIRED")} aria-describedby="password-contract-note" data-testid="superadmin_libraries_profile_configuration-confirm-password" />
              </div>
            </div>
            <p id="password-contract-note" className="text-xs text-slate-500">{tCopy("COPY.NO_PASSWORDS_ARE_READ_STORED_OR_TRANSMITTED_BY_THIS_PREVIEW")}</p>
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              id="change-password-btn"
              variant="primary"
              disabled
              title={tCopy("COPY.UNAVAILABLE_NO_PASSWORD_CHANGE_API_CONTRACT_IS_SUPPLIED")}
              data-testid="superadmin_libraries_profile_configuration-change-password-btn"
            >
              <Lock size={15} />
              {tCopy("COPY.CHANGE_PASSWORD_UNAVAILABLE")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
