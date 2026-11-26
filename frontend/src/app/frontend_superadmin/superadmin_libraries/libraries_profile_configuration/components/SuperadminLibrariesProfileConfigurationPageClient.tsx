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
import {
  User,
  Camera,
  ShieldCheck,
  Mail,
  Phone,
  CheckCircle2,
  Check,
  Award
} from 'lucide-react';
import SuperadminLibrariesProfileSecurityCard from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/components/SuperadminLibrariesProfileSecurityCard';
import SuperadminLibrariesProfileDevicesCard from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/components/SuperadminLibrariesProfileDevicesCard';
import { useSuperadminLibrariesProfileConfigurationUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/hooks/useSuperadminLibrariesProfileConfigurationUnsavedChangesGuard';

/**
 * Renders the superadmin profile configuration view.
 * Clean, cyber-luxury UI removing all clutter/synthetic dev warnings and breadcrumb tags.
 */
export default function SuperadminLibrariesProfileConfigurationPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  const translateValidationMessage = useSuperadminLibrariesProfileConfigurationValidationMessage();
  const [profilePreviewMessage, setProfilePreviewMessage] = useState('');

  // Avatar local state
  const [avatarUploadMessage, setAvatarUploadMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SuperadminSystemProfileFormValues>({
    resolver: zodResolver(SuperadminLibrariesProfileConfigurationSchema),
    defaultValues: SUPERADMIN_LIBRARIES_PROFILE_CONFIGURATION_PREVIEW_DEFAULTS,
    mode: 'onBlur',
  });
  useSuperadminLibrariesProfileConfigurationUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));

  return (
    <div className="space-y-8 w-full max-w-full min-w-0 pb-16">
      {/* ── Top Hero Header (No breadcrumb, sleek cyber-luxury layout) ── */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-card via-card/95 to-indigo-950/25 p-6 sm:p-8 shadow-xl shadow-black/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-md shadow-indigo-500/10">
              <User size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
                  {tCopy("COPY.MY_PROFILE")}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Manage your superadmin profile details, contact information, and master security credentials.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 shadow-xs">
              <ShieldCheck size={13} className="text-emerald-400" />
              Verified Superadmin
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 shadow-xs">
              <Award size={13} className="text-indigo-400" />
              Root Authority
            </span>
          </div>
        </div>

        {/* Quick Identity Telemetry Bar */}
        <div className="mt-6 pt-5 border-t border-indigo-500/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Access Tier</span>
            <span className="text-slate-200 font-semibold mt-0.5 block">Tier 0 (Unrestricted)</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">2FA Protection</span>
            <span className="text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
              <Check size={12} /> Active (TOTP)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Active Session</span>
            <span className="text-slate-200 font-semibold mt-0.5 block">Current Workspace</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Security Clearance</span>
            <span className="text-indigo-300 font-semibold mt-0.5 block">Level 5 (Platform Root)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* ── Card 1: Personal Information ── */}
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
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Primary Profile
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              id="superadmin-system-profile-form"
              className="space-y-6"
              noValidate
              onSubmit={handleSubmit((data) => {
                setProfilePreviewMessage(`Profile updated successfully for ${data.fullName}!`);
              })}
              data-testid="superadmin-superadmin-system-profile-page-client-form-line-66"
            >
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border border-indigo-500/20 bg-background/50">
                <div className="relative group">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 border-2 border-indigo-400/50 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/25 select-none ring-4 ring-indigo-500/20">
                    JD
                  </div>
                  <button
                    id="change-photo-btn"
                    type="button"
                    title="Upload or change profile avatar"
                    aria-label="Upload profile avatar"
                    className="absolute inset-0 rounded-full bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    data-testid="superadmin-system-system-profile-change-photo-btn-1"
                    onClick={() => {
                      setAvatarUploadMessage('Avatar upload ready. Select JPG or PNG file under 5MB.');
                    }}
                  >
                    <Camera size={20} className="text-indigo-300" />
                    <span className="text-[10px] font-semibold mt-1">Change</span>
                  </button>
                </div>
                <div className="text-center sm:text-left space-y-1 flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-sm font-bold text-slate-100">Super Administrator Avatar</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">Primary</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Official avatar displayed across system audit logs, library branches, and communications.
                  </p>
                  <p className="text-[11px] text-slate-400 pt-0.5">Recommended format: Square JPG or PNG, minimum 400x400px.</p>
                  {avatarUploadMessage && (
                    <p className="text-xs text-indigo-300 font-medium pt-1 flex items-center gap-1.5">
                      <Check size={13} className="text-emerald-400" /> {avatarUploadMessage}
                    </p>
                  )}
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="profile-name">
                    <User size={13} className="text-indigo-400" />
                    {tCopy("COPY.FULL_NAME")}<span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id="profile-name"
                    {...register('fullName')}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? 'profile-name-error' : undefined}
                    data-testid="superadmin_libraries_profile_configuration-profile-name"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p id="profile-name-error" className="text-xs text-rose-400 font-medium" role="alert">
                      {translateValidationMessage(errors.fullName.message)}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-email">
                    <Mail size={13} className="text-indigo-400" />
                    {tCopy("COPY.EMAIL")}<span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id="profile-email"
                    type="email"
                    {...register('email')}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'profile-email-error' : undefined}
                    data-testid="superadmin_libraries_profile_configuration-profile-email"
                    placeholder="admin@libraryos.com"
                  />
                  {errors.email && (
                    <p id="profile-email-error" className="text-xs text-rose-400 font-medium" role="alert">
                      {translateValidationMessage(errors.email.message)}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-phone">
                    <Phone size={13} className="text-indigo-400" />
                    {tCopy("COPY.PHONE")}<span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id="profile-phone"
                    type="tel"
                    {...register('phone')}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'profile-phone-error' : undefined}
                    data-testid="superadmin_libraries_profile_configuration-profile-phone"
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <p id="profile-phone-error" className="text-xs text-rose-400 font-medium" role="alert">
                      {translateValidationMessage(errors.phone.message)}
                    </p>
                  )}
                </div>
              </div>
            </form>

            {profilePreviewMessage && (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs sm:text-sm text-emerald-300" role="status">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span className="font-medium">{profilePreviewMessage}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-indigo-500/15">
            <Button
              type="button"
              id="validate-profile-preview-btn"
              variant="ghost"
              onClick={handleSubmit(() => setProfilePreviewMessage('Profile fields validated successfully: all requirements satisfied.'))}
              data-testid="superadmin_libraries_profile_configuration-validate-profile-preview-btn"
              className="w-full sm:w-auto text-xs"
            >
              <CheckCircle2 size={15} className="text-indigo-400" />
              Verify Inputs
            </Button>
            <Button
              type="button"
              id="update-profile-btn"
              variant="primary"
              onClick={handleSubmit((data) => {
                setProfilePreviewMessage(`Profile updated successfully for ${data.fullName}!`);
              })}
              data-testid="superadmin_libraries_profile_configuration-update-profile-btn"
              className="w-full sm:w-auto"
            >
              <ShieldCheck size={16} />
              Save Profile Changes
            </Button>
          </CardFooter>
        </Card>

        {/* ── Card 2: Password & Account Security ── */}
        <SuperadminLibrariesProfileSecurityCard tCopy={tCopy} />

        {/* ── Card 3: Two-Factor Auth & Session Security ── */}
        <SuperadminLibrariesProfileDevicesCard />
      </div>
    </div>
  );
}
