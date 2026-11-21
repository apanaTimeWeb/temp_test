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
import { SuperadminSettingsBrandingLogoUpload } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/components/SuperadminSettingsBrandingLogoUpload';
import { SuperadminSettingsBrandingHeaderBanner } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/components/SuperadminSettingsBrandingHeaderBanner';
import { SuperadminSettingsBrandingThemePresets } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/components/SuperadminSettingsBrandingThemePresets';
import { SuperadminSettingsBrandingLivePreviewCards } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/components/SuperadminSettingsBrandingLivePreviewCards';
import { RotateCcw, Lock, CheckCircle2 } from 'lucide-react';
import { useSuperadminSettingsBrandingUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/hooks/useSuperadminSettingsBrandingUnsavedChangesGuard';
import { SUPERADMIN_SYSTEM_BRANDING_PAGE_CLIENT_BRANDING_DEFAULTS } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/constants/SuperadminSettingsBrandingStaticConstants';

const readToken = (token: string) =>
  typeof window === 'undefined' ? '' : getComputedStyle(document.documentElement).getPropertyValue(token).trim();

const normalizeHexColor = (value: string): string | null =>
  /^#[0-9a-fA-F]{6}$/.test(value.trim()) ? value.trim() : null;

export default function SuperadminSettingsBrandingPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  const translateValidationMessage = useSuperadminSettingsBrandingValidationMessage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [activePreviewTab, setActivePreviewTab] = useState<'all' | 'sidebar' | 'login' | 'idcard'>('all');

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SuperadminSystemBrandingFormValues>({
    resolver: zodResolver(SuperadminSettingsBrandingSchema),
    defaultValues: { ...SUPERADMIN_SYSTEM_BRANDING_PAGE_CLIENT_BRANDING_DEFAULTS, primaryColor: '', accentColor: '' },
    mode: 'onBlur',
  });

  useSuperadminSettingsBrandingUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  const form = watch();

  useEffect(() => {
    setValue('primaryColor', readToken('--branding-primary-default'), { shouldValidate: true });
    setValue('accentColor', readToken('--branding-accent-default'), { shouldValidate: true });
  }, [setValue]);

  useEffect(() => {
    if (!containerRef.current) return;
    const primaryColor = normalizeHexColor(form.primaryColor);
    const accentColor = normalizeHexColor(form.accentColor);
    if (!primaryColor || !accentColor) return;
    containerRef.current.style.setProperty('--preview-primary', primaryColor);
    containerRef.current.style.setProperty('--preview-accent', accentColor);
  }, [form.primaryColor, form.accentColor]);

  const handleReset = () => {
    reset({ ...SUPERADMIN_SYSTEM_BRANDING_PAGE_CLIENT_BRANDING_DEFAULTS, primaryColor: readToken('--branding-primary-default'), accentColor: readToken('--branding-accent-default') });
    setValidationMessage(tCopy('COPY.BRANDING_DEFAULTS_RESTORED_PREVIEW_ONLY'));
  };

  const applyPreset = (p: string, a: string) => {
    setValue('primaryColor', p, { shouldValidate: true, shouldDirty: true });
    setValue('accentColor', a, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
      <SuperadminSettingsBrandingHeaderBanner
        title={tCopy('COPY.BRANDING_AND_WHITE_LABEL')}
        subtitle={tCopy('COPY.PREVIEW_LIBRARY_BRANDING_LOCALLY_CHANGES_DO_NOT_AFFECT_THE_HOST_AP_02467621')}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column — Settings Form */}
        <div className="xl:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{tCopy('COPY.BRANDING_SETTINGS')}</CardTitle>
              <CardDescription>{tCopy('COPY.CONFIGURE_LOGO_NAME_COLORS_AND_TAGLINE')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form
                id="superadmin-system-branding-form"
                className="space-y-5"
                noValidate
                onSubmit={handleSubmit(() => setValidationMessage(tCopy('COPY.BRANDING_VALUES_PASSED_LOCAL_VALIDATION_NOT_SAVED')))}
                data-testid="superadmin-superadmin-system-branding-page-client-form-line-110"
              >
                {/* Logo Upload Box */}
                <SuperadminSettingsBrandingLogoUpload
                  label={tCopy('COPY.LIBRARY_LOGO')}
                  buttonText={tCopy('COPY.UPLOAD_LOGO_200_200PX')}
                  tooltip={tCopy('COPY.UNAVAILABLE_COPY_ACTION_IS_NOT_CONNECTED_TO_CONFIGURED_BRANDING_DATA')}
                />

                {/* Library Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="branding-name">{tCopy('COPY.LIBRARY_NAME')}</Label>
                  <Input
                    id="branding-name"
                    {...register('libraryName')}
                    aria-invalid={Boolean(errors.libraryName)}
                    aria-describedby={errors.libraryName ? 'branding-name-error' : undefined}
                    data-testid="superadmin_settings_branding-branding-name"
                  />
                  {errors.libraryName && (
                    <p id="branding-name-error" className="text-xs text-rose-400 font-medium mt-1" role="alert">
                      {translateValidationMessage(errors.libraryName.message)}
                    </p>
                  )}
                </div>

                {/* Tagline */}
                <div className="space-y-1.5">
                  <Label htmlFor="branding-tagline">
                    {tCopy('COPY.APP_TAGLINE')}&nbsp;<span className="text-slate-400 lowercase font-normal">{tCopy('COPY.OPTIONAL')}</span>
                  </Label>
                  <Input
                    id="branding-tagline"
                    placeholder={tCopy('COPY.YOUR_TAGLINE_HERE')}
                    {...register('tagline')}
                    aria-invalid={Boolean(errors.tagline)}
                    aria-describedby={errors.tagline ? 'branding-tagline-error' : undefined}
                    data-testid="superadmin_settings_branding-branding-tagline"
                  />
                  {errors.tagline && (
                    <p id="branding-tagline-error" className="text-xs text-rose-400 font-medium mt-1" role="alert">
                      {translateValidationMessage(errors.tagline.message)}
                    </p>
                  )}
                </div>

                {/* Theme presets bar */}
                <SuperadminSettingsBrandingThemePresets activePrimary={form.primaryColor} onSelectPreset={applyPreset} />

                {/* Primary Color */}
                <div className="space-y-1.5">
                  <Label htmlFor="branding-primary-color-value">{tCopy('COPY.PRIMARY_COLOR')}</Label>
                  <div className="flex items-center gap-2.5">
                    {normalizeHexColor(form.primaryColor) && (
                      <input
                        aria-label={tCopy('COPY.PRIMARY_COLOR_PICKER')}
                        type="color"
                        id="branding-primary-color"
                        value={form.primaryColor}
                        onChange={(e) => setValue('primaryColor', e.target.value, { shouldValidate: true, shouldDirty: true })}
                        className="h-10 w-12 rounded-xl border border-indigo-500/30 bg-slate-950 cursor-pointer p-1 shrink-0"
                        data-testid="superadmin-system-system-branding-branding-primary-color-2"
                      />
                    )}
                    <Input
                      id="branding-primary-color-value"
                      {...register('primaryColor')}
                      className="font-mono text-xs uppercase"
                      aria-label={tCopy('COPY.PRIMARY_COLOR_HEX_VALUE')}
                      aria-invalid={Boolean(errors.primaryColor)}
                      aria-describedby={errors.primaryColor ? 'branding-primary-color-error' : undefined}
                      data-testid="superadmin_settings_branding-branding-primary-color-value"
                    />
                    <div className="h-10 w-10 shrink-0 sys-preview-swatch-primary" title="Primary Color Live Swatch" />
                  </div>
                  {errors.primaryColor && (
                    <p id="branding-primary-color-error" className="text-xs text-rose-400 font-medium mt-1" role="alert">
                      {translateValidationMessage(errors.primaryColor.message)}
                    </p>
                  )}
                </div>

                {/* Secondary Accent Color */}
                <div className="space-y-1.5">
                  <Label htmlFor="branding-accent-color-value">{tCopy('COPY.SECONDARY_ACCENT_COLOR')}</Label>
                  <div className="flex items-center gap-2.5">
                    {normalizeHexColor(form.accentColor) && (
                      <input
                        aria-label={tCopy('COPY.ACCENT_COLOR_PICKER')}
                        type="color"
                        id="branding-accent-color"
                        value={form.accentColor}
                        onChange={(e) => setValue('accentColor', e.target.value, { shouldValidate: true, shouldDirty: true })}
                        className="h-10 w-12 rounded-xl border border-indigo-500/30 bg-slate-950 cursor-pointer p-1 shrink-0"
                        data-testid="superadmin-system-system-branding-branding-accent-color-3"
                      />
                    )}
                    <Input
                      id="branding-accent-color-value"
                      {...register('accentColor')}
                      className="font-mono text-xs uppercase"
                      aria-label={tCopy('COPY.ACCENT_COLOR_HEX_VALUE')}
                      aria-invalid={Boolean(errors.accentColor)}
                      aria-describedby={errors.accentColor ? 'branding-accent-color-error' : undefined}
                      data-testid="superadmin_settings_branding-branding-accent-color-value"
                    />
                    <div className="h-10 w-10 shrink-0 sys-preview-swatch-accent" title="Accent Color Live Swatch" />
                  </div>
                  {errors.accentColor && (
                    <p id="branding-accent-color-error" className="text-xs text-rose-400 font-medium mt-1" role="alert">
                      {translateValidationMessage(errors.accentColor.message)}
                    </p>
                  )}
                </div>
              </form>

              {validationMessage && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300 flex items-start gap-2.5 shadow-sm" role="status">
                  <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>{validationMessage}</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="button"
                id="save-branding-page-btn"
                variant="primary"
                disabled
                title={tCopy('COPY.UNAVAILABLE_NO_BRANDING_PERSISTENCE_API_CONTRACT_IS_SUPPLIED')}
                data-testid="superadmin_settings_branding-save-branding-page-btn"
              >
                <Lock size={15} />
                <span>{tCopy('COPY.SAVE_BRANDING_UNAVAILABLE')}</span>
              </Button>
              <Button
                type="button"
                id="reset-branding-btn"
                variant="ghost"
                onClick={handleReset}
                data-testid="superadmin_settings_branding-reset-branding-btn"
              >
                <RotateCcw size={15} />
                <span>{tCopy('COPY.RESET_PREVIEW_TO_DEFAULTS')}</span>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column — Live Preview */}
        <div ref={containerRef} className="xl:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>{tCopy('COPY.LIVE_PREVIEW')}</CardTitle>
                  <CardDescription>{tCopy('COPY.SEE_HOW_YOUR_BRANDING_LOOKS_ACROSS_DIFFERENT_PARTS_OF_THE_APP')}</CardDescription>
                </div>
                {/* View switcher tabs */}
                <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-indigo-500/25 backdrop-blur-md shadow-lg self-start sm:self-auto shrink-0">
                  {(['all', 'sidebar', 'login', 'idcard'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActivePreviewTab(tab)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer capitalize ${
                        activePreviewTab === tab
                          ? 'bg-gradient-to-r from-purple-500/25 to-indigo-500/25 text-purple-200 border border-purple-500/40 shadow-sm font-bold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      {tab === 'all' ? 'All Views' : tab === 'idcard' ? 'Smart ID' : tab}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SuperadminSettingsBrandingLivePreviewCards
                libraryName={form.libraryName || ''}
                tagline={form.tagline || ''}
                activeTab={activePreviewTab}
                tCopy={tCopy}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
