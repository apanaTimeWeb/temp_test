'use client';
// RESPONSIBILITY: Renders the Platform Identity, Regional Defaults, and Localization configuration card.
// DATA FLOW: RHF context -> SuperadminSettingsGeneralPlatformRegionalCard -> user input -> form state
import type { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Globe, DollarSign, Clock, Languages, Upload } from 'lucide-react';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';
import {
  AVAILABLE_TIMEZONES,
  AVAILABLE_LANGUAGES,
  AVAILABLE_CURRENCIES,
} from '@/app/frontend_superadmin/superadmin_settings/settings_general/constants/SuperadminSettingsGeneralConstants';

export const SuperadminSettingsGeneralPlatformRegionalCard: FC = () => {
  const { register, formState: { errors } } = useFormContext<SuperadminSettingsFormValues>();

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/95 via-[#090d24]/95 to-[#050714]/95 backdrop-blur-md shadow-xl shadow-black/40 p-6 space-y-6 hover:border-indigo-500/35 motion-safe:transition-all">
      <div className="flex items-center justify-between border-b border-indigo-500/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Globe size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">1. Platform Identity & Regional Defaults</h2>
            <p className="text-xs text-slate-400">Platform branding name, logo, default timezone, language, and currency.</p>
          </div>
        </div>
        <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-300">
          Core Engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Platform Name */}
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="settings-platform-name" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Platform Name <span className="text-rose-400">*</span>
          </label>
          <input maxLength={30}
            id="settings-platform-name"
            type="text"
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 motion-safe:transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="e.g. Library OS"
            {...register('generalConfig.platformName')}
            data-testid="superadmin-settings-platform-name-input"
          />
          {errors.generalConfig?.platformName?.message && (
            <p className="text-xs text-rose-400" role="alert">{errors.generalConfig.platformName.message}</p>
          )}
        </div>

        {/* Support Email */}
        <div className="space-y-1.5">
          <label htmlFor="settings-support-email" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Global Support Email <span className="text-rose-400">*</span>
          </label>
          <input maxLength={30}
            id="settings-support-email"
            type="email"
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 motion-safe:transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="support@example.com"
            {...register('generalConfig.supportEmail')}
            data-testid="superadmin-settings-support-email-input"
          />
          {errors.generalConfig?.supportEmail?.message && (
            <p className="text-xs text-rose-400" role="alert">{errors.generalConfig.supportEmail.message}</p>
          )}
        </div>

        {/* Support Hotline */}
        <div className="space-y-1.5">
          <label htmlFor="settings-support-phone" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Platform Support Hotline
          </label>
          <input
            id="settings-support-phone" type="tel" maxLength={15} inputMode="tel"
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 motion-safe:transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="+91 98765 43210"
            {...register('generalConfig.supportPhone')}
            data-testid="superadmin-settings-support-phone-input"
          />
        </div>

        {/* Default Timezone */}
        <div className="space-y-1.5">
          <label htmlFor="settings-default-timezone" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Clock size={13} className="text-indigo-400" />
            Default Timezone <span className="text-rose-400">*</span>
          </label>
          <select
            id="settings-default-timezone"
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 motion-safe:transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            {...register('generalConfig.timezone')}
            data-testid="superadmin-settings-timezone-select"
          >
            {AVAILABLE_TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value} className="bg-slate-950 text-slate-100">
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* Default Language */}
        <div className="space-y-1.5">
          <label htmlFor="settings-default-language" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Languages size={13} className="text-indigo-400" />
            Default Language <span className="text-rose-400">*</span>
          </label>
          <select
            id="settings-default-language"
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 motion-safe:transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            {...register('generalConfig.defaultLanguage')}
            data-testid="superadmin-settings-language-select"
          >
            {AVAILABLE_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-slate-950 text-slate-100">
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Default Currency */}
        <div className="space-y-1.5">
          <label htmlFor="settings-default-currency" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
            <DollarSign size={13} className="text-amber-400" />
            Default Currency <span className="text-rose-400">*</span>
          </label>
          <select
            id="settings-default-currency"
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 motion-safe:transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            {...register('generalConfig.currency')}
            data-testid="superadmin-settings-currency-select"
          >
            {AVAILABLE_CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code} className="bg-slate-950 text-slate-100">
                {curr.code} — {curr.name}
              </option>
            ))}
          </select>
        </div>

        {/* Platform Logo & Favicon Assets */}
        <div className="space-y-2 md:col-span-2 rounded-xl border border-indigo-500/20 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Upload size={14} className="text-indigo-400" /> Platform Logo & App Favicon
            </span>
            <span className="text-[11px] text-slate-400 font-medium">SVG / PNG / WebP</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="settings-platform-logo-url" className="text-xs font-medium text-slate-400">
                Logo Asset URL / SVG Path
              </label>
              <input maxLength={30}
                id="settings-platform-logo-url"
                type="text"
                className="mt-1 w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 motion-safe:transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="/images/library-os-logo.svg"
                {...register('generalConfig.platformLogoUrl')}
                data-testid="superadmin-settings-logo-url-input"
              />
            </div>
            <div>
              <label htmlFor="settings-favicon-url" className="text-xs font-medium text-slate-400">
                Favicon Asset URL
              </label>
              <input maxLength={30}
                id="settings-favicon-url"
                type="text"
                className="mt-1 w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 motion-safe:transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
