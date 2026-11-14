'use client';
/** Responsibility: Superadmin System Settings Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationSchema, type SuperadminSystemSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/schemas/SuperadminSettingsGeneralSettingsLibraryConfigurationSchema';
import { SUPERADMIN_SETTINGS_LIBRARY_CONFIGURATION_PREVIEW_DEFAULTS } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/mocks/fixtures/SuperadminSettingsLibraryConfigurationPreviewDefaults';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationCard as Card } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationCard';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationCardHeader as CardHeader } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationCardHeader';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationCardTitle as CardTitle } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationCardTitle';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationCardDescription as CardDescription } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationCardDescription';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationCardContent as CardContent } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationCardContent';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationCardFooter as CardFooter } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationCardFooter';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationButton as Button } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationButton';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationInput as Input } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationInput';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationLabel as Label } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationLabel';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationSwitch as Switch } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationSwitch';
import { Upload, Save } from 'lucide-react';
import SuperadminSystemSettingsNotificationsSettingsPanel from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationNotificationsSettingsPanel';
import SuperadminSystemSettingsNavigation from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationNavigation';
import { useSuperadminSettingsGeneralSettingsLibraryConfigurationUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationUnsavedChangesGuard';
function readToken(token: string) {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

/**
 * Renders the `superadmin_system` view owned by `SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient`.
 * Owns local UI state for `active` and the explicit preview-only `saveNotice`.
 * Effect lifecycle boundaries are `[setValue]`.
 * Dirty form state is guarded before destructive or route-leaving actions.
 */
export default function SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  const [active, setActive] = useState('branding');
  const [saved, setSaved] = useState(false);
  const [saveNotice, setSaveNotice] = useState('');

  const { watch, setValue, handleSubmit, formState: { errors , isDirty} } = useForm<SuperadminSystemSettingsFormValues>({
    resolver: zodResolver(SuperadminSettingsGeneralSettingsLibraryConfigurationSchema),
    defaultValues: SUPERADMIN_SETTINGS_LIBRARY_CONFIGURATION_PREVIEW_DEFAULTS,
  });
  useSuperadminSettingsGeneralSettingsLibraryConfigurationUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  const form = watch();

  // Effect contract: initialize the editable color fields from canonical theme tokens after hydration; dependency set [setValue] follows the stable form setter.
  useEffect(() => {
    setValue('primaryColor', readToken('--branding-primary-default'), { shouldValidate: true });
    setValue('secondaryColor', readToken('--branding-accent-default'), { shouldValidate: true });
  }, []);

  const handleSave = handleSubmit(() => {
    setSaved(true);
    setSaveNotice(tCopy('COPY.SETTINGS_PREVIEW_ONLY_NOTICE'));
  });

  return (
    <div>
      {saveNotice && <p className="mb-4 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{saveNotice}</p>}
      {Object.keys(errors).length > 0 && <p className="mb-4 rounded-lg border border-border bg-danger-bg p-3 text-sm text-danger" role="alert">{tCopy("COPY.PLEASE_CORRECT_THE_INVALID_SETTINGS_BEFORE_SAVING_A_PREVIEW")}</p>}
      <div className="flex gap-6">
        <SuperadminSystemSettingsNavigation active={active} onActiveChange={setActive} />

        {/* Right panel */}
        <div className="flex-1">
          {active === 'branding' && (
            <Card>
              <CardHeader>
                <CardTitle>{tCopy("COPY.BRANDING")}</CardTitle>
                <CardDescription>{tCopy("COPY.CUSTOMIZE_HOW_YOUR_LIBRARY_APPEARS_TO_USERS")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="logo-upload">{tCopy("COPY.LOGO")}</Label>
                  <div
                    id="logo-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 group"
                  >
                    <Upload size={24} className="text-secondary group-hover:text-primary motion-safe:transition-colors motion-reduce:transition-none mb-2" />
                    <span className="text-sm text-secondary">{tCopy("COPY.LOGO_UPLOAD_UNAVAILABLE_IN_THIS_SOURCE_ONLY_PREVIEW")}</span>
                    <span className="text-xs text-secondary mt-1">{tCopy("COPY.A_HOST_UPLOAD_HANDLER_AND_STORAGE_CONTRACT_ARE_REQUIRED")}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-name">{tCopy("COPY.APP_NAME")}</Label>
                  <Input id="app-name" value={form.appName} onChange={e => setValue('appName', e.target.value, { shouldDirty: true, shouldValidate: true })} aria-invalid={Boolean(errors.appName)}  data-testid="superadmin_settings_library_configuration-app-name"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">{tCopy("COPY.PRIMARY_COLOR")}</Label>
                    <div className="flex items-center gap-2">
                      <input aria-label={tCopy("COPY.PRIMARY_COLOR_2")} type="color" id="primary-color" value={form.primaryColor} onChange={e => setValue('primaryColor', e.target.value, { shouldDirty: true, shouldValidate: true })} aria-invalid={Boolean(errors.primaryColor)} className="h-10 w-12 rounded-lg border border-border bg-transparent cursor-pointer"  data-testid="superadmin-system-system-settings-primary-color-1"/>
                      <Input aria-label={tCopy("COPY.PRIMARY_COLOR_TOKEN_VALUE")} value={form.primaryColor} onChange={e => setValue('primaryColor', e.target.value, { shouldDirty: true, shouldValidate: true })} aria-invalid={Boolean(errors.primaryColor)} className="font-mono text-xs"  data-testid="superadmin-system-system-settings-page-client-input-1"/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">{tCopy("COPY.SECONDARY_COLOR")}</Label>
                    <div className="flex items-center gap-2">
                      <input aria-label={tCopy("COPY.SECONDARY_COLOR_2")} type="color" id="secondary-color" value={form.secondaryColor} onChange={e => setValue('secondaryColor', e.target.value, { shouldDirty: true, shouldValidate: true })} aria-invalid={Boolean(errors.secondaryColor)} className="h-10 w-12 rounded-lg border border-border bg-transparent cursor-pointer"  data-testid="superadmin-system-system-settings-secondary-color-2"/>
                      <Input aria-label={tCopy("COPY.SECONDARY_COLOR_TOKEN_VALUE")} value={form.secondaryColor} onChange={e => setValue('secondaryColor', e.target.value, { shouldDirty: true, shouldValidate: true })} aria-invalid={Boolean(errors.secondaryColor)} className="font-mono text-xs"  data-testid="superadmin-system-system-settings-page-client-input-2"/>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button id="save-branding-btn" onClick={() => { void handleSave(); }} variant="primary" data-testid="superadmin_settings_library_configuration-save-branding-btn">
                  <Save size={16} /> {saved ? tCopy('COPY.PREVIEW_UPDATED') : tCopy('COPY.SAVE_SETTINGS')}
                </Button>
              </CardFooter>
            </Card>
          )}

          {active === 'late-fee' && (
            <Card>
              <CardHeader>
                <CardTitle>{tCopy("COPY.LATE_FEE_RULES")}</CardTitle>
                <CardDescription>{tCopy("COPY.DEFINE_PENALTY_RULES_FOR_OVERDUE_PAYMENTS")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                  <div>
                    <p id="enable-late-fees-label" className="text-sm font-medium text-primary">{tCopy("COPY.ENABLE_LATE_FEES")}</p>
                    <p className="text-xs text-secondary">{tCopy("COPY.AUTOMATICALLY_APPLY_PENALTIES_AFTER_DUE_DATE")}</p>
                  </div>
                  <Switch id="enable-late-fees" aria-labelledby="enable-late-fees-label" checked={form.enableLateFees} onCheckedChange={v => setValue('enableLateFees', v, { shouldDirty: true, shouldValidate: true })}  data-testid="superadmin-system-settings_library_configuration-switch-1"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grace-period">{tCopy("COPY.GRACE_PERIOD")}</Label>
                    <div className="flex items-center gap-2">
                      <Input id="grace-period" type="number" value={Number.isFinite(form.gracePeriod) ? form.gracePeriod : ''} min={0} max={365} step={1} inputMode="numeric" onChange={e => setValue('gracePeriod', e.target.value === '' ? Number.NaN : Number(e.target.value), { shouldDirty: true, shouldValidate: true })} aria-invalid={Boolean(errors.gracePeriod)}  data-testid="superadmin_settings_library_configuration-grace-period"/>
                      <span className="text-sm text-secondary whitespace-nowrap">{tCopy("COPY.DAYS")}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="penalty-per-day">{tCopy("COPY.PENALTY_PER_DAY")}</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-secondary">₹</span>
                      <Input id="penalty-per-day" type="number" value={Number.isFinite(form.penaltyPerDay) ? form.penaltyPerDay : ''} min={0} step="0.01" onChange={e => setValue('penaltyPerDay', e.target.value === '' ? Number.NaN : Number(e.target.value), { shouldDirty: true, shouldValidate: true })} aria-invalid={Boolean(errors.penaltyPerDay)}  data-testid="superadmin_settings_library_configuration-penalty-per-day"/>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button id="save-latefee-btn" onClick={() => { void handleSave(); }} variant="primary" data-testid="superadmin_settings_library_configuration-save-latefee-btn">
                  <Save size={16} /> {saved ? tCopy('COPY.PREVIEW_UPDATED') : tCopy('COPY.SAVE_SETTINGS')}
                </Button>
              </CardFooter>
            </Card>
          )}

          {active === 'auto-suspend' && (
            <Card>
              <CardHeader>
                <CardTitle>{tCopy("COPY.AUTO_SUSPEND_RULES")}</CardTitle>
                <CardDescription>{tCopy("COPY.CONFIGURE_AUTOMATIC_SEAT_SUSPENSION_FOR_DEFAULTERS")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                  <div>
                    <p id="enable-auto-suspend-label" className="text-sm font-medium text-primary">{tCopy("COPY.ENABLE_AUTO_SUSPEND")}</p>
                    <p className="text-xs text-secondary">{tCopy("COPY.SUSPEND_SEATS_AFTER_PAYMENT_OVERDUE")}</p>
                  </div>
                  <Switch id="enable-auto-suspend" aria-labelledby="enable-auto-suspend-label" checked={form.enableAutoSuspend} onCheckedChange={v => setValue('enableAutoSuspend', v, { shouldDirty: true, shouldValidate: true })}  data-testid="superadmin-system-settings_library_configuration-switch-2"/>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                  <div>
                    <p id="enable-auto-restore-label" className="text-sm font-medium text-primary">{tCopy("COPY.AUTO_RESTORE_ON_PAYMENT")}</p>
                    <p className="text-xs text-secondary">{tCopy("COPY.AUTOMATICALLY_RESTORE_WHEN_PAYMENT_IS_RECEIVED")}</p>
                  </div>
                  <Switch id="enable-auto-restore" aria-labelledby="enable-auto-restore-label" checked={form.enableAutoRestore} onCheckedChange={v => setValue('enableAutoRestore', v, { shouldDirty: true, shouldValidate: true })}  data-testid="superadmin-system-settings_library_configuration-switch-3"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="days-before-suspend">{tCopy("COPY.DAYS_BEFORE_SUSPEND")}</Label>
                  <div className="flex items-center gap-2">
                    <Input id="days-before-suspend" type="number" value={Number.isFinite(form.daysBefore) ? form.daysBefore : ''} min={0} max={365} step={1} inputMode="numeric" onChange={e => setValue('daysBefore', e.target.value === '' ? Number.NaN : Number(e.target.value), { shouldDirty: true, shouldValidate: true })} aria-invalid={Boolean(errors.daysBefore)} className="max-w-30"  data-testid="superadmin_settings_library_configuration-days-before-suspend"/>
                    <span className="text-sm text-secondary">{tCopy("COPY.DAYS_AFTER_DUE_DATE")}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button id="save-autosuspend-btn" onClick={() => { void handleSave(); }} variant="primary" data-testid="superadmin_settings_library_configuration-save-autosuspend-btn">
                  <Save size={16} /> {saved ? tCopy('COPY.PREVIEW_UPDATED') : tCopy('COPY.SAVE_SETTINGS')}
                </Button>
              </CardFooter>
            </Card>
          )}

          {active === 'upi' && (
            <Card>
              <CardHeader>
                <CardTitle>{tCopy("COPY.UPI_PAYMENT")}</CardTitle>
                <CardDescription>{tCopy("COPY.CONFIGURE_PAYMENT_METHODS_ACCEPTED_AT_YOUR_LIBRARY")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="upi-qr">{tCopy("COPY.UPI_QR_CODE")}</Label>
                  <div id="upi-qr" className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8">
                    <Upload size={24} className="text-secondary mb-2" />
                    <span className="text-sm text-secondary">{tCopy("COPY.QR_IMAGE_UPLOAD_UNAVAILABLE_IN_THIS_SOURCE_ONLY_PREVIEW")}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upi-id">{tCopy("COPY.UPI_ID")}</Label>
                  <Input id="upi-id" placeholder={tCopy("COPY.OWNER_UPI")} value={form.upiId} onChange={e => setValue('upiId', e.target.value, { shouldDirty: true, shouldValidate: true })} aria-invalid={Boolean(errors.upiId)}  data-testid="superadmin_settings_library_configuration-upi-id"/>
                </div>
                <div className="space-y-3">
                  <Label>{tCopy("COPY.ACCEPTED_PAYMENT_MODES")}</Label>
                  {[
                    { key: 'acceptCash', label: tCopy('COPY.CASH') },
                    { key: 'acceptUpi', label: tCopy('COPY.UPI') },
                    { key: 'acceptCard', label: tCopy('COPY.CARD') },
                    { key: 'acceptBank', label: tCopy('COPY.BANK_TRANSFER') },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox"
                        id={`payment-${key}`}
                        checked={Boolean(form[key as keyof SuperadminSystemSettingsFormValues])}
                        onChange={e => setValue(key as 'acceptCash' | 'acceptUpi' | 'acceptCard' | 'acceptBank', e.target.checked, { shouldDirty: true, shouldValidate: true })}
                        className="h-4 w-4 rounded border-border bg-card accent-primary"
                       data-testid={`superadmin-system-system-settings-field-3-${String(key)}`}/>
                      <span className="text-sm text-primary">{label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button id="save-upi-btn" onClick={() => { void handleSave(); }} variant="primary" data-testid="superadmin_settings_library_configuration-save-upi-btn">
                  <Save size={16} /> {saved ? tCopy('COPY.PREVIEW_UPDATED') : tCopy('COPY.SAVE_SETTINGS')}
                </Button>
              </CardFooter>
            </Card>
          )}

          {active === 'notifications' && (
            <SuperadminSystemSettingsNotificationsSettingsPanel saved={saved} onSavePreview={handleSave} />
          )}

          {active === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle>{tCopy("COPY.GENERAL")}</CardTitle>
                <CardDescription>{tCopy("COPY.BASIC_LIBRARY_CONFIGURATION")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="library-name">{tCopy("COPY.LIBRARY_NAME")}</Label>
                  <Input id="library-name" value={form.libraryName} onChange={e => setValue('libraryName', e.target.value, { shouldDirty: true, shouldValidate: true })} aria-invalid={Boolean(errors.libraryName)}  data-testid="superadmin_settings_library_configuration-library-name"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="library-timezone">{tCopy("COPY.TIMEZONE")}</Label>
                  <Input id="library-timezone" value={form.libraryTimezone} onChange={e => setValue('libraryTimezone', e.target.value, { shouldDirty: true, shouldValidate: true })} aria-invalid={Boolean(errors.libraryTimezone)}  data-testid="superadmin_settings_library_configuration-library-timezone"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="library-currency">{tCopy("COPY.CURRENCY")}</Label>
                  <Input id="library-currency" value={form.libraryCurrency} onChange={e => setValue('libraryCurrency', e.target.value, { shouldDirty: true, shouldValidate: true })} aria-invalid={Boolean(errors.libraryCurrency)}  data-testid="superadmin_settings_library_configuration-library-currency"/>
                </div>
              </CardContent>
              <CardFooter>
                <Button id="save-general-btn" onClick={() => { void handleSave(); }} variant="primary" data-testid="superadmin_settings_library_configuration-save-general-btn">
                  <Save size={16} /> {saved ? tCopy('COPY.PREVIEW_UPDATED') : tCopy('COPY.SAVE_SETTINGS')}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
