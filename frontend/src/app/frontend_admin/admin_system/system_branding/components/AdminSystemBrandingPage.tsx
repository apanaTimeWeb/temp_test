// Responsibility: AdminSystemBrandingPage component owned by admin_system; responsibility folder: admin_system_components_views.
'use client';

import { useTranslations } from 'next-intl';
// RESPONSIBILITY: Entry page for the admin_system module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import toast from 'sonner';
import { createAdminSystemBrandingPreviewSchema, type AdminSystemBrandingPreviewFormValues } from '@/app/frontend_admin/admin_system/system_branding/schemas/AdminSystemBrandingPreviewSchema';
import { ADMIN_SYSTEM_BRANDING_PREVIEW_DEFAULTS as BRANDING_DEFAULTS } from '@/app/frontend_admin/admin_system/system_branding/config/admin_system_branding_preview_constants';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import CardFooter from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardFooter';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { Input } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveInput';
import { Label } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveLabel';
import { Palette, ChevronRight, Upload, RotateCcw, Save } from 'lucide-react';
import useAdminSystemBrandingUnsavedChangesGuard from '@/app/frontend_admin/admin_system/system_branding/hooks/useAdminSystemBrandingUnsavedChangesGuard';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';

function readThemeColor(token: string, fallbackToken: string): string {
  if (typeof window === 'undefined') return '';
  const themeRoot = document.querySelector('.system-theme');
  if (!themeRoot) return '';
  const styles = getComputedStyle(themeRoot);
  const configuredValue = styles.getPropertyValue(token).trim();
  const value = configuredValue && !configuredValue.startsWith('var(')
    ? configuredValue
    : styles.getPropertyValue(fallbackToken).trim();
  return /^#[\da-f]{6}$/i.test(value) ? value : '';
}

export function AdminSystemBrandingPage() {
  const t = useTranslations('ADMIN_SYSTEM_BRANDING');
  const router = useRouter();
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [resetRequested, setResetRequested] = useState(false);
  const isDemoMode = isFrontendDemoModeEnabled();
  const previewSchema = useMemo(() => createAdminSystemBrandingPreviewSchema({
    libraryNameRequired: t('VALIDATION_LIBRARY_NAME_REQUIRED'),
    libraryNameTooLong: t('VALIDATION_LIBRARY_NAME_TOO_LONG'),
    taglineTooLong: t('VALIDATION_TAGLINE_TOO_LONG'),
    colorInvalid: t('VALIDATION_COLOR_INVALID'),
  }), [t]);
  const form = useForm<AdminSystemBrandingPreviewFormValues>({
    resolver: zodResolver(previewSchema),
    mode: 'onBlur',
    defaultValues: { ...BRANDING_DEFAULTS, primaryColor: '', accentColor: '' },
  });
  const values = form.watch();
  const handleBlockedNavigation = useCallback((href: string) => { setPendingNavigation(href); setResetRequested(false); setConfirmDiscard(true); }, []);
  useAdminSystemBrandingUnsavedChangesGuard(form.formState.isDirty, form.formState.isSubmitting, handleBlockedNavigation);

  /* Resolve CSS theme tokens after hydration; no color values are hardcoded into the UI. */
  useEffect(() => {
    form.setValue('primaryColor', readThemeColor('--branding-primary-default', '--primary'), { shouldValidate: true });
    form.setValue('accentColor', readThemeColor('--branding-accent-default', '--primary-hover'), { shouldValidate: true });
  }, [form]);

  const resetDraft = () => {
    form.reset({
      ...BRANDING_DEFAULTS,
      primaryColor: readThemeColor('--branding-primary-default', '--primary'),
      accentColor: readThemeColor('--branding-accent-default', '--primary-hover'),
    });
    toast.info(t('RESET_TOAST'), { id: 'admin-system-branding-reset' });
  };
  const requestReset = () => {
    if (form.formState.isDirty) { setPendingNavigation(null); setResetRequested(true); setConfirmDiscard(true); return; }
    resetDraft();
  };
  const confirmDiscardDraft = () => {
    const destination = pendingNavigation;
    const shouldReset = resetRequested;
    setConfirmDiscard(false); setPendingNavigation(null); setResetRequested(false);
    if (destination) { form.reset(form.getValues()); router.push(destination); return; }
    if (shouldReset) resetDraft();
  };
  const cancelDiscard = () => { setConfirmDiscard(false); setPendingNavigation(null); setResetRequested(false); };

  return (
    <div>
      <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{isDemoMode ? t('DEMO_PREVIEW_NOTICE') : t('PERSISTENCE_UNAVAILABLE_NOTICE')}</p>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-text-secondary text-xs font-medium tracking-wide mb-1">
          <span>{t('BREADCRUMB_SYSTEM')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('BREADCRUMB_BRANDING')}</span>
        </div>
        <h1 className="text-page-title font-bold text-text-primary flex items-center gap-3">
          <Palette size={18} strokeWidth={2} className="text-primary" />
          {t('TITLE')}
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          {t('SUBTITLE')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left — Settings Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('SETTINGS_TITLE')}</CardTitle>
              <CardDescription>{t('SETTINGS_DESCRIPTION')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>{t('LIBRARY_LOGO')}</Label>
                <div
                  id="branding-logo-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6"
                >
                  <div className="h-16 w-16 rounded-xl flex items-center justify-center text-2xl font-bold mb-2 bg-sidebar">
                    {t('LIBRARY_ICON')}
                  </div>
                  <button data-testid="admin_system-page-control-001" type="button" aria-label={t('UPLOAD_LOGO_ARIA')} disabled title={t('LOGO_UPLOAD_BLOCKED')} className="min-h-11 text-xs text-text-secondary flex items-center gap-1">
                    <Upload size={18} strokeWidth={2} /> {t('LOGO_UPLOAD_UNAVAILABLE')}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branding-name">{t('LIBRARY_NAME')}</Label>
                <Input id="branding-name" aria-invalid={Boolean(form.formState.errors.libraryName)} {...form.register('libraryName')} />
                {form.formState.errors.libraryName && <p role="alert" className="text-caption text-danger-text">{form.formState.errors.libraryName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="branding-tagline">
                  {t('APP_TAGLINE')} <span className="text-text-secondary text-xs">{t('OPTIONAL')}</span>
                </Label>
                <Input id="branding-tagline" placeholder={t('TAGLINE_PLACEHOLDER')} aria-invalid={Boolean(form.formState.errors.tagline)} {...form.register('tagline')} />
                {form.formState.errors.tagline && <p role="alert" className="text-caption text-danger-text">{form.formState.errors.tagline.message}</p>}
              </div>

              {/* Color pickers — native <input type="color"> requires value binding, swatch uses CSS class */}
              <div className="space-y-2">
                <Label htmlFor="branding-primary-color">{t('PRIMARY_COLOR')}</Label>
                <div className="flex items-center gap-2">
                  {values.primaryColor && <input type="color" id="branding-primary-color" aria-label={t('PRIMARY_COLOR_ARIA')} value={values.primaryColor} onChange={e => form.setValue('primaryColor', e.target.value, { shouldDirty: true, shouldValidate: true })} className="h-11 w-12 rounded-lg border border-border bg-input cursor-pointer" />}
                  <Input id="branding-primary-color-text" aria-label={t('PRIMARY_COLOR_ARIA')} aria-invalid={Boolean(form.formState.errors.primaryColor)} {...form.register('primaryColor')} className="font-mono text-xs" />
                  {form.formState.errors.primaryColor && <p role="alert" className="text-caption text-danger-text">{form.formState.errors.primaryColor.message}</p>}
                  {/* Native SVG fill reflects the validated user-selected brand color without inline CSS. */}
                  <svg aria-hidden="true" viewBox="0 0 40 40" className="h-10 w-10 shrink-0 rounded-lg border border-border"><rect width="40" height="40" rx="8" fill={values.primaryColor || 'var(--primary)'} /></svg>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branding-accent-color">{t('SECONDARY_COLOR')}</Label>
                <div className="flex items-center gap-2">
                  {values.accentColor && <input type="color" id="branding-accent-color" aria-label={t('SECONDARY_COLOR_ARIA')} value={values.accentColor} onChange={e => form.setValue('accentColor', e.target.value, { shouldDirty: true, shouldValidate: true })} className="h-11 w-12 rounded-lg border border-border bg-input cursor-pointer" />}
                  <Input id="branding-accent-color-text" aria-label={t('SECONDARY_COLOR_ARIA')} aria-invalid={Boolean(form.formState.errors.accentColor)} {...form.register('accentColor')} className="font-mono text-xs" />
                  {form.formState.errors.accentColor && <p role="alert" className="text-caption text-danger-text">{form.formState.errors.accentColor.message}</p>}
                  <svg aria-hidden="true" viewBox="0 0 40 40" className="h-10 w-10 shrink-0 rounded-lg border border-border"><rect width="40" height="40" rx="8" fill={values.accentColor || 'var(--primary-hover)'} /></svg>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button id="save-branding-page-btn" variant="primary" disabled title={t('PREVIEW_SAVE_UNAVAILABLE')}><Save size={18} strokeWidth={2} /> {t('SAVE_PREVIEW')}</Button>
              <Button data-testid="admin_system-page-control-002" id="reset-branding-btn" variant="ghost" onClick={requestReset}><RotateCcw size={18} strokeWidth={2} /> {t('RESET_DEFAULT')}</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right — Live Preview: semantic surfaces and validated SVG color swatches render without inline CSS. */}
        <div className="lg:col-span-3 space-y-4" data-preview-primary={values.primaryColor} data-preview-accent={values.accentColor}>
          <Card>
            <CardHeader>
              <CardTitle>{t('LIVE_PREVIEW')}</CardTitle>
              <CardDescription>{t('LIVE_PREVIEW_DESCRIPTION')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Mini Sidebar Preview */}
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">{t('SIDEBAR')}</p>
                <div className="overflow-hidden rounded-xl border border-border bg-sidebar">
                  <div className="p-3 flex items-center gap-2 bg-sidebar">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-base font-bold bg-primary text-on-primary">
                      {t('LIBRARY_ICON')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary leading-tight">{values.libraryName || BRANDING_DEFAULTS.libraryName}</p>
                      {values.tagline && <p className="text-micro text-text-secondary leading-tight truncate w-28">{values.tagline}</p>}
                    </div>
                  </div>
                  {([t('PREVIEW_DASHBOARD'), t('PREVIEW_STUDENTS'), t('PREVIEW_FINANCE'), t('PREVIEW_REPORTS')]).map((item, i) => (
                    <div key={item} className={`px-3 py-2 text-xs flex items-center gap-2 ${i === 0 ? 'rounded-md bg-primary-subtle text-primary font-semibold' : 'text-text-secondary'}`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-primary' : 'bg-surface-highlight'}`} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Login Preview */}
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">{t('LOGIN_PAGE')}</p>
                <div className="rounded-xl border border-border p-5 max-w-xs bg-card">
                  <div className="flex flex-col items-center mb-3 gap-1">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl font-bold rounded-lg bg-primary text-on-primary">
                      {t('LIBRARY_ICON')}
                    </div>
                    <p className="text-sm font-bold text-text-primary">{values.libraryName || BRANDING_DEFAULTS.libraryName}</p>
                    {values.tagline && <p className="text-micro text-text-secondary">{values.tagline}</p>}
                  </div>
                  <div className="space-y-2">
                    <div className="h-7 rounded-lg bg-card" />
                    <div className="h-7 rounded-lg bg-card" />
                    <div className="flex min-h-9 items-center justify-center rounded-md bg-primary px-3 py-2 text-xs font-semibold text-on-primary">{t('LOGIN')}</div>
                  </div>
                </div>
              </div>

              {/* Mini ID Card Preview */}
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">{t('STUDENT_ID_CARD')}</p>
                <div className="rounded-xl border border-border overflow-hidden max-w-xs">
                  <div className="border-b border-border bg-primary-subtle p-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary-subtle flex items-center justify-center text-lg">{t('LIBRARY_ICON')}</div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{values.libraryName || BRANDING_DEFAULTS.libraryName}</p>
                      <p className="text-xs text-text-secondary">{t('STUDENT_ID_CARD_TITLE')}</p>
                    </div>
                  </div>
                  <div className="p-3 flex items-center gap-3 rounded-xl border border-border bg-card">
                    <div className="h-12 w-12 rounded-lg bg-card flex items-center justify-center text-xl">{t('USER_ICON')}</div>
                    <div>
                      <p className="text-xs font-bold text-text-primary">{t('PREVIEW_STUDENT_NAME')}</p>
                      <p className="text-micro text-text-secondary">{t('PREVIEW_STUDENT_ID')}</p>
                      <p className="text-micro text-text-secondary">{t('PREVIEW_VALID_TILL')}</p>
                    </div>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={confirmDiscard} onOpenChange={(nextOpen) => { if (!nextOpen) cancelDiscard(); }}>
        <DialogContent className="max-w-lg">
          <DialogTitle>{t('UNSAVED_CHANGES_TITLE')}</DialogTitle>
          <DialogDescription className="mt-2">{resetRequested ? t('UNSAVED_RESET_DESCRIPTION') : t('UNSAVED_CHANGES_DESCRIPTION')}</DialogDescription>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button type="button" className="admin-btn-ghost min-h-11" onClick={cancelDiscard}>{t('KEEP_EDITING')}</button>
            <button type="button" className="admin-btn-danger min-h-11" onClick={confirmDiscardDraft}>{t('DISCARD_CHANGES')}</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
