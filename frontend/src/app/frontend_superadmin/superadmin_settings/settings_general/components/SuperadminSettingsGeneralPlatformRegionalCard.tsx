'use client';
// RESPONSIBILITY: Renders the Platform Identity, Regional Defaults, and Localization configuration card.
// DATA FLOW: RHF context -> SuperadminSettingsGeneralPlatformRegionalCard -> user input -> form state
import type { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Globe, Building, DollarSign, Clock, Languages, Upload, Shield } from 'lucide-react';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';
import {
  AVAILABLE_TIMEZONES,
  AVAILABLE_LANGUAGES,
  AVAILABLE_CURRENCIES,
} from '@/app/frontend_superadmin/superadmin_settings/settings_general/constants/SuperadminSettingsGeneralConstants';

export const SuperadminSettingsGeneralPlatformRegionalCard: FC = () => {
  const { register, formState: { errors } } = useFormContext<SuperadminSettingsFormValues>();

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-subtle text-primary">
            <Globe size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">1. Platform Identity & Regional Defaults</h2>
            <p className="text-xs text-secondary">Platform branding name, logo, default timezone, language, and currency.</p>
          </div>
        </div>
        <span className="rounded-full bg-surface-highlight px-3 py-1 text-xs font-semibold text-primary">
          Core Engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Platform Name */}
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="settings-platform-name" className="text-xs font-bold uppercase tracking-wider text-secondary">
            Platform Name <span className="text-danger">*</span>
          </label>
          <input
            id="settings-platform-name"
            type="text"
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
            placeholder="e.g. Library OS"
            {...register('generalConfig.platformName')}
            data-testid="superadmin-settings-platform-name-input"
          />
          {errors.generalConfig?.platformName?.message && (
            <p className="text-xs text-danger" role="alert">{errors.generalConfig.platformName.message}</p>
          )}
        </div>

        {/* Support Email */}
        <div className="space-y-1.5">
          <label htmlFor="settings-support-email" className="text-xs font-bold uppercase tracking-wider text-secondary">
            Global Support Email <span className="text-danger">*</span>
          </label>
          <input
            id="settings-support-email"
            type="email"
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
            placeholder="support@example.com"
            {...register('generalConfig.supportEmail')}
            data-testid="superadmin-settings-support-email-input"
          />
          {errors.generalConfig?.supportEmail?.message && (
            <p className="text-xs text-danger" role="alert">{errors.generalConfig.supportEmail.message}</p>
          )}
        </div>

        {/* Support Hotline */}
        <div className="space-y-1.5">
          <label htmlFor="settings-support-phone" className="text-xs font-bold uppercase tracking-wider text-secondary">
            Platform Support Hotline
          </label>
          <input
            id="settings-support-phone"
            type="text"
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
            placeholder="+91 98765 43210"
            {...register('generalConfig.supportPhone')}
            data-testid="superadmin-settings-support-phone-input"
          />
        </div>

        {/* Default Timezone */}
        <div className="space-y-1.5">
          <label htmlFor="settings-default-timezone" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary">
            <Clock size={13} className="text-primary" />
            Default Timezone <span className="text-danger">*</span>
          </label>
          <select
            id="settings-default-timezone"
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
            {...register('generalConfig.timezone')}
            data-testid="superadmin-settings-timezone-select"
          >
            {AVAILABLE_TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* Default Language */}
        <div className="space-y-1.5">
          <label htmlFor="settings-default-language" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary">
            <Languages size={13} className="text-primary" />
            Default Language <span className="text-danger">*</span>
          </label>
          <select
            id="settings-default-language"
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
            {...register('generalConfig.defaultLanguage')}
            data-testid="superadmin-settings-language-select"
          >
            {AVAILABLE_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Default Currency */}
        <div className="space-y-1.5">
          <label htmlFor="settings-default-currency" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary">
            <DollarSign size={13} className="text-primary" />
            Default Currency <span className="text-danger">*</span>
          </label>
          <select
            id="settings-default-currency"
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
            {...register('generalConfig.currency')}
            data-testid="superadmin-settings-currency-select"
          >
            {AVAILABLE_CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code} — {curr.name}
              </option>
            ))}
          </select>
        </div>

        {/* Platform Logo & Favicon Assets */}
        <div className="space-y-2 md:col-span-2 rounded-xl border border-border bg-surface-zebra p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Upload size={14} className="text-primary" /> Platform Logo & App Favicon
            </span>
            <span className="text-[11px] text-secondary">SVG / PNG / WebP</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="settings-platform-logo-url" className="text-xs font-medium text-secondary">
                Logo Asset URL / SVG Path
              </label>
              <input
                id="settings-platform-logo-url"
                type="text"
                className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-xs text-foreground"
                placeholder="/images/library-os-logo.svg"
                {...register('generalConfig.platformLogoUrl')}
                data-testid="superadmin-settings-logo-url-input"
              />
            </div>
            <div>
              <label htmlFor="settings-favicon-url" className="text-xs font-medium text-secondary">
                Favicon Asset URL
              </label>
              <input
                id="settings-favicon-url"
                type="text"
                className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-xs text-foreground"
                placeholder="/favicon.ico"
                {...register('generalConfig.faviconUrl')}
                data-testid="superadmin-settings-favicon-url-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
