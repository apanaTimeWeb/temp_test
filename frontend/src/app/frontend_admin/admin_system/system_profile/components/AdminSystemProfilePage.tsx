// Responsibility: AdminSystemProfilePage component owned by admin_system; responsibility folder: admin_system_components_views.
'use client';

import { useTranslations } from 'next-intl';
// RESPONSIBILITY: Entry page for the admin_system module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import CardFooter from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardFooter';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { Input } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveInput';
import { Label } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveLabel';
import { AdminSystemProgress } from '@/app/frontend_admin/admin_system/system_profile/components/AdminSystemProfileProgress';
import { User, Lock, Camera, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import useAdminSystemProfileUnsavedChangesGuard from '@/app/frontend_admin/admin_system/system_profile/hooks/useAdminSystemProfileUnsavedChangesGuard';
import { createAdminSystemProfileSchema, createAdminSystemChangePasswordSchema, type AdminSystemProfileFormValues, type AdminSystemChangePasswordFormValues } from '@/app/frontend_admin/admin_system/system_profile/schemas/AdminSystemProfileSchema';
import { ADMIN_SYSTEM_PROFILE_PREVIEW_DEFAULTS as PROFILE_DEFAULTS } from '@/app/frontend_admin/admin_system/system_profile/mocks/AdminSystemProfilePreviewFixtures';
import type { AdminSystemProfilePageLabelKey, AdminSystemProfilePageLabelKey2 } from '@/app/frontend_admin/admin_system/system_profile/types/AdminSystemProfileComponentTypes';


function getStrength(pw: string): { score: number; labelKey: AdminSystemProfilePageLabelKey; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map: Record<number, { labelKey: AdminSystemProfilePageLabelKey2; color: string }> = {
    0: { labelKey: 'STRENGTH_VERY_WEAK', color: 'bg-danger' },
    1: { labelKey: 'STRENGTH_WEAK', color: 'bg-danger' },
    2: { labelKey: 'STRENGTH_FAIR', color: 'bg-surface-highlight' },
    3: { labelKey: 'STRENGTH_GOOD', color: 'bg-success-bg' },
    4: { labelKey: 'STRENGTH_STRONG', color: 'bg-success-bg' },
  };
  const strength = map[score];
  if (!strength) throw new Error(`Unsupported password strength score: ${score}`);
  return { score, ...strength };
}

export function AdminSystemProfilePage() {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const router = useRouter();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const isDemoMode = isFrontendDemoModeEnabled();
  const validationMessages = useMemo(() => ({
    nameRequired: t('VALIDATION_PROFILE_NAME_REQUIRED'),
    nameTooLong: t('VALIDATION_PROFILE_NAME_TOO_LONG'),
    emailInvalid: t('VALIDATION_PROFILE_EMAIL_INVALID'),
    phoneRequired: t('VALIDATION_PROFILE_PHONE_REQUIRED'),
    phoneTooLong: t('VALIDATION_PROFILE_PHONE_TOO_LONG'),
    currentPasswordRequired: t('VALIDATION_CURRENT_PASSWORD_REQUIRED'),
    newPasswordTooShort: t('VALIDATION_NEW_PASSWORD_TOO_SHORT'),
    confirmPasswordRequired: t('VALIDATION_CONFIRM_PASSWORD_REQUIRED'),
    passwordMismatch: t('VALIDATION_PASSWORD_MISMATCH'),
  }), [t]);
  const profileSchema = useMemo(() => createAdminSystemProfileSchema(validationMessages), [validationMessages]);
  const passwordSchema = useMemo(() => createAdminSystemChangePasswordSchema(validationMessages), [validationMessages]);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const profileForm = useForm<AdminSystemProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onBlur',
    defaultValues: { fullName: PROFILE_DEFAULTS.fullName, email: PROFILE_DEFAULTS.email, phone: PROFILE_DEFAULTS.phone },
  });
  const passwordForm = useForm<AdminSystemChangePasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: 'onBlur',
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  const profileDraftDirty = profileForm.formState.isDirty || passwordForm.formState.isDirty;
  const handleBlockedNavigation = useCallback((href: string) => { setPendingHref(href); setShowDiscardDialog(true); }, []);
  useAdminSystemProfileUnsavedChangesGuard(profileDraftDirty, handleBlockedNavigation, profileForm.formState.isSubmitting || passwordForm.formState.isSubmitting);
  const discardDrafts = () => { const destination = pendingHref; profileForm.reset(); passwordForm.reset(); setPendingHref(null); setShowDiscardDialog(false); if (destination) router.push(destination); };
  const newPw = passwordForm.watch('newPassword') || '';
  const strength = getStrength(newPw);
  if (!isDemoMode) return <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6"><h1 className="text-page-title font-bold text-text-primary">{t('MY_PROFILE')}</h1><p role="status" className="text-warning-text">{t('PROFILE_LIVE_UNAVAILABLE')}</p></section>;

  return (
    <div>
      <p className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text" role="status">{t('PROFILE_DEMO_NOTICE')}</p>
      <p className="mb-4 text-sm text-text-secondary" role="status">{t('PROFILE_SAVE_UNAVAILABLE')}</p>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-text-secondary text-xs font-medium tracking-wide mb-1">
          <span>{t('BREADCRUMB_SYSTEM')}</span>
          <ChevronRight size={18} strokeWidth={2} />
          <span>{t('PROFILE')}</span>
        </div>
        <h1 className="text-page-title font-bold text-text-primary flex items-center gap-3">
          <User size={18} strokeWidth={2} className="text-primary" />
          {t('MY_PROFILE')}
        </h1>
        <p className="text-text-secondary mt-1 text-sm">{t('PROFILE_SUBTITLE')}</p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>{t('PERSONAL_INFORMATION')}</CardTitle>
            <CardDescription>{t('PERSONAL_INFORMATION_DESCRIPTION')}</CardDescription>
          </CardHeader>
          <form onSubmit={(event) => event.preventDefault()}>
          <CardContent className="space-y-5">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="h-20 w-20 rounded-full bg-primary-subtle border-2 border-border flex items-center justify-center text-primary text-3xl font-bold select-none">
                  {PROFILE_DEFAULTS.avatarInitial}
                </div>
                <button type="button" aria-label={t('PROFILE_PHOTO_ARIA')} disabled title={t('PROFILE_PHOTO_BLOCKED')} data-testid="admin_system-page-control-001"
                  id="change-photo-btn"
                  className="absolute inset-0 rounded-full bg-overlay flex items-center justify-center text-primary opacity-100 motion-safe:transition-opacity motion-safe:duration-fast"
                >
                  <Camera size={18} strokeWidth={2} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-name">{t('FULL_NAME')} <span data-testid="admin_system-page-state-002" className="text-danger-text">*</span></Label>
              <Input id="profile-name" aria-invalid={Boolean(profileForm.formState.errors.fullName)} {...profileForm.register('fullName')} />
              {profileForm.formState.errors.fullName && <p role="alert" className="text-caption text-danger-text">{profileForm.formState.errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">{t('EMAIL')}</Label>
              <Input id="profile-email" type="email" aria-invalid={Boolean(profileForm.formState.errors.email)} {...profileForm.register('email')} />
              {profileForm.formState.errors.email && <p role="alert" className="text-caption text-danger-text">{profileForm.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-phone">{t('PHONE')} <span data-testid="admin_system-page-state-003" className="text-danger-text">*</span></Label>
              <Input id="profile-phone" type="tel" aria-invalid={Boolean(profileForm.formState.errors.phone)} {...profileForm.register('phone')} />
              {profileForm.formState.errors.phone && <p role="alert" className="text-caption text-danger-text">{profileForm.formState.errors.phone.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button id="update-profile-btn" variant="primary" disabled title={t('PROFILE_SAVE_UNAVAILABLE')}>{t('UPDATE_PROFILE_DEMO')}</Button>
          </CardFooter>
          </form>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={18} strokeWidth={2} className="text-primary" />
              {t('CHANGE_PASSWORD')}
            </CardTitle>
            <CardDescription>{t('CHANGE_PASSWORD_DESCRIPTION')}</CardDescription>
          </CardHeader>
          <form onSubmit={(event) => event.preventDefault()}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="current-password">{t('CURRENT_PASSWORD')}</Label>
              <div className="relative">
                <Input id="current-password" type={showCurrent ? 'text' : 'password'} placeholder={t('CURRENT_PASSWORD_PLACEHOLDER')} aria-invalid={Boolean(passwordForm.formState.errors.currentPassword)} className="pr-12" {...passwordForm.register('currentPassword')} />
                {passwordForm.formState.errors.currentPassword && <p role="alert" className="text-caption text-danger-text">{passwordForm.formState.errors.currentPassword.message}</p>}
                <button aria-label={showCurrent ? t('ARIA_HIDE_CURRENT_PASSWORD') : t('ARIA_SHOW_CURRENT_PASSWORD')} data-testid="admin_system-page-control-004" type="button" onClick={() => setShowCurrent(s => !s)} className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-text-secondary hover:text-primary motion-safe:transition-colors motion-safe:duration-fast">
                  {showCurrent ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">{t('NEW_PASSWORD')}</Label>
              <div className="relative">
                <Input id="new-password" type={showNew ? 'text' : 'password'} placeholder={t('NEW_PASSWORD_PLACEHOLDER')} aria-invalid={Boolean(passwordForm.formState.errors.newPassword)} className="pr-12" {...passwordForm.register('newPassword')} />
                {passwordForm.formState.errors.newPassword && <p role="alert" className="text-caption text-danger-text">{passwordForm.formState.errors.newPassword.message}</p>}
                <button aria-label={showNew ? t('ARIA_HIDE_NEW_PASSWORD') : t('ARIA_SHOW_NEW_PASSWORD')} data-testid="admin_system-page-control-005" type="button" onClick={() => setShowNew(s => !s)} className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-text-secondary hover:text-primary motion-safe:transition-colors motion-safe:duration-fast">
                  {showNew ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                </button>
              </div>
              {newPw && (
                <div className="space-y-1.5 mt-2">
                  <AdminSystemProgress value={strength.score} max={4} barClassName={strength.color} />
                  <p data-testid="admin_system-page-state-006" className={`text-xs font-medium ${strength.score >= 3 ? 'text-success-text' : strength.score === 2 ? 'text-text-secondary' : 'text-danger-text'}`}>
                    {t('PASSWORD_STRENGTH')} {t(strength.labelKey)}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t('CONFIRM_NEW_PASSWORD')}</Label>
              <div className="relative">
                <Input id="confirm-password" type={showConfirm ? 'text' : 'password'} placeholder={t('CONFIRM_PASSWORD_PLACEHOLDER')} aria-invalid={Boolean(passwordForm.formState.errors.confirmPassword)} className="pr-12" {...passwordForm.register('confirmPassword')} />
                {passwordForm.formState.errors.confirmPassword && <p role="alert" className="text-caption text-danger-text">{passwordForm.formState.errors.confirmPassword.message}</p>}
                <button aria-label={showConfirm ? t('ARIA_HIDE_CONFIRM_PASSWORD') : t('ARIA_SHOW_CONFIRM_PASSWORD')} data-testid="admin_system-page-control-007" type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-text-secondary hover:text-primary motion-safe:transition-colors motion-safe:duration-fast">
                  {showConfirm ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button id="change-password-btn" variant="primary" disabled title={t('PASSWORD_CHANGE_BLOCKED')}>{t('CHANGE_PASSWORD_DEMO')}</Button>
          </CardFooter>
          </form>
        </Card>
      </div>
      <Dialog open={showDiscardDialog} onOpenChange={(open) => { if (!open) { setShowDiscardDialog(false); setPendingHref(null); } }}>
        <DialogContent className="space-y-4">
          <DialogTitle>{t('UNSAVED_CHANGES_TITLE')}</DialogTitle>
          <DialogDescription>{t('UNSAVED_CHANGES_DESCRIPTION')}</DialogDescription>
          <DialogFooter>
            <button type="button" className="min-h-11 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => { setShowDiscardDialog(false); setPendingHref(null); }}>{t('UNSAVED_CHANGES_STAY')}</button>
            <button type="button" className="min-h-11 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={discardDrafts}>{t('UNSAVED_CHANGES_LEAVE')}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
