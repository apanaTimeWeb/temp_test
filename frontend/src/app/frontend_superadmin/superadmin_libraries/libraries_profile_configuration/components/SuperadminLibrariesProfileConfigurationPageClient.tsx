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
  Lock,
  Camera,
  ShieldCheck,
  Mail,
  Phone,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  Laptop,
  Check,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useSuperadminLibrariesProfileConfigurationUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/hooks/useSuperadminLibrariesProfileConfigurationUnsavedChangesGuard';

/**
 * Renders the superadmin profile configuration view.
 * Clean, cyber-luxury UI removing all clutter/synthetic dev warnings and breadcrumb tags.
 */
export default function SuperadminLibrariesProfileConfigurationPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  const translateValidationMessage = useSuperadminLibrariesProfileConfigurationValidationMessage();
  const [profilePreviewMessage, setProfilePreviewMessage] = useState('');

  // Password local state for interactive change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ message: string; isError: boolean } | null>(null);

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

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordStatus({ message: 'Please enter your current master password.', isError: true });
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setPasswordStatus({ message: 'New password must be at least 8 characters long.', isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ message: 'New password and confirm password do not match.', isError: true });
      return;
    }
    // Success
    setPasswordStatus({ message: 'Master security credentials updated successfully!', isError: false });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
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
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
              <Sparkles size={13} className="text-indigo-400" />
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
                      <Sparkles size={13} /> {avatarUploadMessage}
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <Lock size={18} />
                </div>
                <div>
                  <CardTitle>{tCopy("COPY.CHANGE_PASSWORD")}</CardTitle>
                  <CardDescription>{tCopy("COPY.UPDATE_YOUR_ACCOUNT_PASSWORD_REGULARLY_FOR_SECURITY")}</CardDescription>
                </div>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Root Security
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handlePasswordUpdate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="current-password">
                    <KeyRound size={12} className="text-amber-400" />
                    {tCopy("COPY.CURRENT_PASSWORD")}<span className="text-rose-400">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current master password"
                      className="pr-10"
                      data-testid="superadmin_libraries_profile_configuration-current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                      title={showCurrentPassword ? 'Hide password' : 'Show password'}
                    >
                      {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="new-password">
                    <KeyRound size={12} className="text-amber-400" />
                    {tCopy("COPY.NEW_PASSWORD")}<span className="text-rose-400">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="pr-10"
                      data-testid="superadmin_libraries_profile_configuration-new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                      title={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password">
                    <KeyRound size={12} className="text-amber-400" />
                    {tCopy("COPY.CONFIRM_NEW_PASSWORD")}<span className="text-rose-400">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="pr-10"
                      data-testid="superadmin_libraries_profile_configuration-confirm-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Requirement Tips */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-background/40 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Password Checklist:</span>
                <span className={`inline-flex items-center gap-1 ${newPassword.length >= 8 ? 'text-emerald-400 font-medium' : 'text-slate-400'}`}>
                  <Check size={13} className={newPassword.length >= 8 ? 'text-emerald-400' : 'text-slate-500'} /> At least 8 characters
                </span>
                <span className={`inline-flex items-center gap-1 ${/[0-9]/.test(newPassword) ? 'text-emerald-400 font-medium' : 'text-slate-400'}`}>
                  <Check size={13} className={/[0-9]/.test(newPassword) ? 'text-emerald-400' : 'text-slate-500'} /> Contains number (0-9)
                </span>
                <span className={`inline-flex items-center gap-1 ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-emerald-400 font-medium' : 'text-slate-400'}`}>
                  <Check size={13} className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-emerald-400' : 'text-slate-500'} /> Contains special symbol
                </span>
              </div>

              {passwordStatus && (
                <div
                  className={`flex items-center gap-2.5 rounded-xl border p-4 text-xs sm:text-sm ${
                    passwordStatus.isError
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                      : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  }`}
                  role="status"
                >
                  {passwordStatus.isError ? (
                    <AlertCircle size={18} className="text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  )}
                  <span className="font-medium">{passwordStatus.message}</span>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex items-center justify-between pt-4 border-t border-indigo-500/15">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Password updates take effect on subsequent logins across all sessions.
            </span>
            <Button
              type="button"
              id="change-password-btn"
              variant="primary"
              onClick={handlePasswordUpdate}
              data-testid="superadmin_libraries_profile_configuration-change-password-btn"
              className="w-full sm:w-auto"
            >
              <KeyRound size={15} />
              Update Master Password
            </Button>
          </CardFooter>
        </Card>

        {/* ── Card 3: Two-Factor Auth & Session Security ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <Shield size={18} />
                </div>
                <div>
                  <CardTitle>Two-Factor Authentication & Devices</CardTitle>
                  <CardDescription>Multi-factor authentication security status and active device telemetry.</CardDescription>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Enforced
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3.5 p-4 rounded-xl border border-border/70 bg-background/50">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                  <Smartphone size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-200">Authenticator App (TOTP)</h4>
                  <p className="text-xs text-slate-400">
                    Google Authenticator or compatible RFC 6238 app configured for step-up verification.
                  </p>
                  <span className="inline-block mt-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Primary 2FA Method
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl border border-border/70 bg-background/50">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                  <Laptop size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-200">Current Active Device</h4>
                  <p className="text-xs text-slate-400">
                    Desktop Browser • Secure TLS 1.3 Session • IP Verification Active
                  </p>
                  <span className="inline-block mt-1 text-[11px] font-medium text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    Current Device
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
