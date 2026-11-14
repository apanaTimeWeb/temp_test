'use client';
/** Responsibility: Superadmin System Branding Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminSettingsBrandingPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useTranslations } from 'next-intl';
import { useSuperadminSettingsBrandingValidationMessage } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/hooks/useSuperadminSettingsBrandingValidationMessage';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SuperadminSettingsBrandingSchema, type SuperadminSystemBrandingFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/schemas/SuperadminSettingsBrandingSchema';
import { SuperadminSettingsBrandingCard as Card } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/components/SuperadminSettingsBrandingCard';
import { SuperadminSettingsBrandingCardHeader as CardHeader } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/components/SuperadminSettingsBrandingCardHeader';
import { SuperadminSettingsBrandingCardTitle as CardTitle } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/components/SuperadminSettingsBrandingCardTitle';
import { SuperadminSettingsBrandingCardDescription as CardDescription } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/components/SuperadminSettingsBrandingCardDescription';
import { SuperadminSettingsBrandingCardContent as CardContent } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/components/SuperadminSettingsBrandingCardContent';
import { SuperadminSettingsBrandingCardFooter as CardFooter } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/components/SuperadminSettingsBrandingCardFooter';
import { SuperadminSettingsBrandingButton as Button } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/components/SuperadminSettingsBrandingButton';
import { SuperadminSettingsBrandingInput as Input } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/components/SuperadminSettingsBrandingInput';
import { SuperadminSettingsBrandingLabel as Label } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/components/SuperadminSettingsBrandingLabel';
import { Palette, ChevronRight, Upload, RotateCcw, Save } from 'lucide-react';
import { useSuperadminSettingsBrandingUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/hooks/useSuperadminSettingsBrandingUnsavedChangesGuard';
import { SUPERADMIN_SYSTEM_BRANDING_PAGE_CLIENT_BRANDING_DEFAULTS } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/constants/SuperadminSettingsBrandingStaticConstants';

function readToken(token: string) {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

/** Accept only six-digit hex colors before exposing user input as a CSS custom property. */
function normalizeHexColor(value: string): string | null {
  const normalized = value.trim();
  return /^#[0-9a-fA-F]{6}$/.test(normalized) ? normalized : null;
}



/**
 * Renders the `superadmin_system` view owned by `SuperadminSettingsBrandingPageClient`.
 * Owns local UI state for `validationMessage`.
 * Effect lifecycle boundaries are `[setValue]`, `[form.primaryColor, form.accentColor]`.
 * Dirty form state is guarded before destructive or route-leaving actions.
 */
export default function SuperadminSettingsBrandingPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  const translateValidationMessage = useSuperadminSettingsBrandingValidationMessage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [validationMessage, setValidationMessage] = useState('');
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors , isDirty},
  } = useForm<SuperadminSystemBrandingFormValues>({
    resolver: zodResolver(SuperadminSettingsBrandingSchema),
    defaultValues: { ...SUPERADMIN_SYSTEM_BRANDING_PAGE_CLIENT_BRANDING_DEFAULTS, primaryColor: '', accentColor: '' },
    mode: 'onBlur',
  });
  useSuperadminSettingsBrandingUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  const form = watch();

  // Effect contract: hydrate form color values from canonical theme tokens; dependency set [setValue] tracks the stable form setter.
  useEffect(() => {
    setValue('primaryColor', readToken('--branding-primary-default'), { shouldValidate: true });
    setValue('accentColor', readToken('--branding-accent-default'), { shouldValidate: true });
  }, [setValue]);

  // Effect contract: update only the isolated preview container after validated color changes; dependency set [form.primaryColor, form.accentColor] is the explicit preview synchronization boundary.
  useEffect(() => {
    if (!containerRef.current) return;
    const primaryColor = normalizeHexColor(form.primaryColor);
    const accentColor = normalizeHexColor(form.accentColor);
    if (!primaryColor || !accentColor) return;
    containerRef.current.style.setProperty('--preview-primary', primaryColor);
    containerRef.current.style.setProperty('--preview-accent', accentColor);
  }, [form.primaryColor, form.accentColor]);

  const handleReset = () => {
    reset({
      ...SUPERADMIN_SYSTEM_BRANDING_PAGE_CLIENT_BRANDING_DEFAULTS,
      primaryColor: readToken('--branding-primary-default'),
      accentColor: readToken('--branding-accent-default'),
    });
    setValidationMessage(tCopy("COPY.BRANDING_DEFAULTS_RESTORED_PREVIEW_ONLY"));
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-secondary text-xs font-medium tracking-wide mb-1">
          <span>{tCopy("COPY.SYSTEM")}</span><ChevronRight size={12} /><span>{tCopy("COPY.BRANDING")}</span>
        </div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <Palette size={28} className="text-primary" />
          {tCopy("COPY.BRANDING_AND_WHITE_LABEL")}</h1>
        <p className="text-secondary mt-1 text-sm">
          {tCopy("COPY.PREVIEW_LIBRARY_BRANDING_LOCALLY_CHANGES_DO_NOT_AFFECT_THE_HOST_AP_02467621")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left — Settings Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{tCopy("COPY.BRANDING_SETTINGS")}</CardTitle>
              <CardDescription>{tCopy("COPY.CONFIGURE_LOGO_NAME_COLORS_AND_TAGLINE")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form id="superadmin-system-branding-form" className="space-y-5" noValidate onSubmit={handleSubmit(() => setValidationMessage(tCopy("COPY.BRANDING_VALUES_PASSED_LOCAL_VALIDATION_NOT_SAVED")))} data-testid="superadmin-superadmin-system-branding-page-client-form-line-110">
              <div className="space-y-2">
                <Label>{tCopy("COPY.LIBRARY_LOGO")}</Label>
                <div
                  id="branding-logo-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6"
                >
                  <div className="h-16 w-16 rounded-xl flex items-center justify-center text-2xl font-bold mb-2 sys-preview-sidebar-bg">
                    📚
                  </div>
                  <button type="button" disabled title={tCopy("COPY.UNAVAILABLE_COPY_ACTION_IS_NOT_CONNECTED_TO_CONFIGURED_BRANDING_DATA")} className="text-xs text-secondary opacity-60 flex items-center gap-1 cursor-not-allowed" data-testid="superadmin-system-system-branding-unavailable-copy-action-is-not-connected-to-configured-branding-data-1">
                    <Upload size={12} /> {tCopy("COPY.UPLOAD_LOGO_200_200PX")}</button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branding-name">{tCopy("COPY.LIBRARY_NAME")}</Label>
                <Input id="branding-name" {...register('libraryName')} aria-invalid={Boolean(errors.libraryName)} aria-describedby={errors.libraryName ? 'branding-name-error' : undefined}  data-testid="superadmin_settings_branding-branding-name"/>
                {errors.libraryName && <p id="branding-name-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.libraryName.message)}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="branding-tagline">
                  {tCopy("COPY.APP_TAGLINE")}<span className="text-secondary text-xs">{tCopy("COPY.OPTIONAL")}</span>
                </Label>
                <Input id="branding-tagline" placeholder={tCopy("COPY.YOUR_TAGLINE_HERE")} {...register('tagline')} aria-invalid={Boolean(errors.tagline)} aria-describedby={errors.tagline ? 'branding-tagline-error' : undefined}  data-testid="superadmin_settings_branding-branding-tagline"/>
                {errors.tagline && <p id="branding-tagline-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.tagline.message)}</p>}
              </div>

              {/* Color pickers — native <input type="color"> requires value binding, swatch uses CSS class */}
              <div className="space-y-2">
                <Label htmlFor="branding-primary-color-value">{tCopy("COPY.PRIMARY_COLOR")}</Label>
                <div className="flex items-center gap-2">
                  {normalizeHexColor(form.primaryColor) && <input aria-label={tCopy("COPY.PRIMARY_COLOR_PICKER")} type="color" id="branding-primary-color" value={form.primaryColor}
                    onChange={e => setValue('primaryColor', e.target.value, { shouldValidate: true, shouldDirty: true })}
                    className="h-10 w-12 rounded-lg border border-border bg-transparent cursor-pointer"  data-testid="superadmin-system-system-branding-branding-primary-color-2"/>}
                  <Input id="branding-primary-color-value" {...register('primaryColor')} className="font-mono text-xs" aria-label={tCopy("COPY.PRIMARY_COLOR_HEX_VALUE")} aria-invalid={Boolean(errors.primaryColor)} aria-describedby={errors.primaryColor ? 'branding-primary-color-error' : undefined}  data-testid="superadmin_settings_branding-branding-primary-color-value"/>
                  {errors.primaryColor && <p id="branding-primary-color-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.primaryColor.message)}</p>}
                  {/* swatch reads --preview-primary from container ref */}
                  <div className="h-10 w-10 rounded-lg shrink-0 sys-preview-swatch-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branding-accent-color-value">{tCopy("COPY.SECONDARY_ACCENT_COLOR")}</Label>
                <div className="flex items-center gap-2">
                  {normalizeHexColor(form.accentColor) && <input aria-label={tCopy("COPY.ACCENT_COLOR_PICKER")} type="color" id="branding-accent-color" value={form.accentColor}
                    onChange={e => setValue('accentColor', e.target.value, { shouldValidate: true, shouldDirty: true })}
                    className="h-10 w-12 rounded-lg border border-border bg-transparent cursor-pointer"  data-testid="superadmin-system-system-branding-branding-accent-color-3"/>}
                  <Input id="branding-accent-color-value" {...register('accentColor')} className="font-mono text-xs" aria-label={tCopy("COPY.ACCENT_COLOR_HEX_VALUE")} aria-invalid={Boolean(errors.accentColor)} aria-describedby={errors.accentColor ? 'branding-accent-color-error' : undefined}  data-testid="superadmin_settings_branding-branding-accent-color-value"/>
                  {errors.accentColor && <p id="branding-accent-color-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.accentColor.message)}</p>}
                  <div className="h-10 w-10 rounded-lg shrink-0 sys-preview-swatch-accent" />
                </div>
              </div>
              </form>
              {validationMessage && <p className="rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{validationMessage}</p>}
            </CardContent>
            <CardFooter>
              <Button type="button" id="save-branding-page-btn" variant="primary" disabled title={tCopy("COPY.UNAVAILABLE_NO_BRANDING_PERSISTENCE_API_CONTRACT_IS_SUPPLIED")} data-testid="superadmin_settings_branding-save-branding-page-btn"><Save size={16} /> {tCopy("COPY.SAVE_BRANDING_UNAVAILABLE")}</Button>
              <Button type="button" id="reset-branding-btn" variant="ghost" onClick={handleReset} data-testid="superadmin_settings_branding-reset-branding-btn"><RotateCcw size={16} /> {tCopy("COPY.RESET_PREVIEW_TO_DEFAULTS")}</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right — Live Preview: CSS vars set via ref.style.setProperty, children use classes only */}
        <div ref={containerRef} className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{tCopy("COPY.LIVE_PREVIEW")}</CardTitle>
              <CardDescription>{tCopy("COPY.SEE_HOW_YOUR_BRANDING_LOOKS_ACROSS_DIFFERENT_PARTS_OF_THE_APP")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Mini Sidebar Preview */}
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider mb-2">{tCopy("COPY.SIDEBAR")}</p>
                <div className="sys-preview-sidebar-wrap sys-preview-sidebar-bg">
                  <div className="p-3 flex items-center gap-2 sys-preview-sidebar-bg">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-base font-bold sys-preview-icon">
                      📚
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary leading-tight">{form.libraryName || tCopy('COPY.BRANDING_DEFAULT_LIBRARY')}</p>
                      {form.tagline && <p className="text-xs text-secondary leading-tight truncate w-28">{form.tagline}</p>}
                    </div>
                  </div>
                  {['Dashboard', 'Students', 'Finance', 'Reports'].map((item, i) => (
                    <div key={item} className={`px-3 py-2 text-xs flex items-center gap-2 ${i === 0 ? 'sys-preview-nav-active font-semibold' : 'text-secondary'}`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'sys-preview-dot-active' : 'sys-preview-dot-inactive'}`} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Login Preview */}
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider mb-2">{tCopy("COPY.LOGIN_PAGE")}</p>
                <div className="rounded-xl border border-border p-5 max-w-xs sys-preview-card-bg">
                  <div className="flex flex-col items-center mb-3 gap-1">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl font-bold sys-preview-icon">
                      📚
                    </div>
                    <p className="text-sm font-bold text-primary">{form.libraryName || tCopy('COPY.BRANDING_DEFAULT_LIBRARY')}</p>
                    {form.tagline && <p className="text-xs text-secondary">{form.tagline}</p>}
                  </div>
                  <div className="space-y-2">
                    <div className="h-7 rounded-lg bg-card" />
                    <div className="h-7 rounded-lg bg-card" />
                    <div className="sys-preview-login-btn">{tCopy("COPY.LOGIN")}</div>
                  </div>
                </div>
              </div>

              {/* Mini ID Card Preview */}
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider mb-2">{tCopy("COPY.STUDENT_ID_CARD")}</p>
                <div className="rounded-xl border border-border overflow-hidden max-w-xs">
                  <div className="sys-preview-id-header p-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-surface-hover flex items-center justify-center text-lg">📚</div>
                    <div>
                      <p className="sys-preview-id-title">{form.libraryName || tCopy('COPY.BRANDING_DEFAULT_LIBRARY')}</p>
                      <p className="sys-preview-id-subtitle">{tCopy("COPY.STUDENT_IDENTITY_CARD")}</p>
                    </div>
                  </div>
                  <div className="p-3 flex items-center gap-3 sys-preview-card-bg">
                    <div className="h-12 w-12 rounded-lg bg-card flex items-center justify-center text-xl">👤</div>
                    <div>
                      <p className="text-xs font-bold text-primary">{tCopy("COPY.SAMPLE_STUDENT")}</p>
                      <p className="text-xs text-secondary">{tCopy("COPY.SAMPLE_ID_SAMPLE_0042_SAMPLE_SHIFT")}</p>
                      <p className="text-xs text-secondary">{tCopy("COPY.SAMPLE_VALIDITY_DATE_JUNE_2026")}</p>
                    </div>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
