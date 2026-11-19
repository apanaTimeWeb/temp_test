'use client';
/** Responsibility: renders the superadmin_settings overview route UI; the module Main remains a thin composition boundary.
 * Global settings schema fields referenced across settings workflows:
 * - apiConfig.emailProvider
 * - apiConfig.smsProvider
 * - generalConfig.currency
 * - generalConfig.platformName
 * - generalConfig.supportEmail
 * - generalConfig.timezone
 * - maintenance.message
 */
/** Data-Flow: canonical route -> SuperadminSettingsOverviewPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/config/superadmin_settings_overview.url_config.ts';
import { useSuperadminSettingsOverviewValidationMessage } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/hooks/useSuperadminSettingsOverviewValidationMessage';
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SUPERADMIN_SETTINGS_SCHEMA } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/schemas/SuperadminSettingsOverviewSchema';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/types/SuperadminSettingsOverviewTypes';
import { SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/mocks/fixtures/SuperadminSettingsOverviewPreviewDefaults';
import { Settings, Palette, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSuperadminSettingsOverviewUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/hooks/useSuperadminSettingsOverviewUnsavedChangesGuard';
import { SUPERADMIN_SETTINGS_TABS } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/constants/SuperadminSettingsOverviewConstants';
/**
 * Renders the `superadmin_settings` view owned by `SuperadminSettingsOverviewPageClient`.
 * Owns local UI state for `activeTab`, `saved`.
 * Dirty form state is guarded before destructive or route-leaving actions.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminSettingsOverviewPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SETTINGS');
  
  const navigateToWorkflow = (key: string) => {
    const routes: Record<string, string> = {
    "General": SUPERADMIN_NAVIGATION_ROUTES.settings_general,
    "Appearance": SUPERADMIN_NAVIGATION_ROUTES.settings_appearance,
    "APIs & Integrations": SUPERADMIN_NAVIGATION_ROUTES.settings_integrations,
    "Storage": SUPERADMIN_NAVIGATION_ROUTES.settings_storage,
    "Maintenance Mode": SUPERADMIN_NAVIGATION_ROUTES.settings_maintenance_mode
    };
    const route = routes[key];
    if (route) { const target = new URL(route, window.location.origin); const query = new URLSearchParams(window.location.search); query.delete('view'); query.forEach((value, key) => { if (!target.searchParams.has(key)) target.searchParams.append(key, value); }); window.location.assign(target.pathname + target.search + target.hash); }
  };
const translateValidationMessage = useSuperadminSettingsOverviewValidationMessage();
  const [activeTab] = useState('General');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting , isDirty},
  } = useForm<SuperadminSettingsFormValues>({
    resolver: zodResolver(SUPERADMIN_SETTINGS_SCHEMA),
    defaultValues: SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS,
    mode: 'onChange',
    shouldUnregister: false,
  });
  useSuperadminSettingsOverviewUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));

  

  const handleSave = (_values: SuperadminSettingsFormValues) => {
    toast.message(tCopy('COPY.PREVIEW_ONLY_THESE_SETTINGS_REMAIN_IN_THIS_PAGE_S_LOCAL_STATE_NO_GLOBAL_CONFIGURATION_WAS_SAVED_BECAUSE_NO_SETTINGS_API_CONTRACT_IS_SUPPLIED'), { id: 'superadmin:settings:preview-save' });
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12">
      <form onSubmit={handleSubmit(handleSave)} noValidate data-testid="superadmin-superadmin-settings-overview-page-client-form-line-50">

      {/* Hero Header */}
      <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/80 via-[#0a0d22] to-[#060810] p-5 sm:p-6 shadow-lg mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>{tCopy("COPY.LIBRARY_OS")}</span><span>/</span><span>{tCopy("COPY.SUPER_ADMIN")}</span><span>/</span>
              <span className="text-indigo-300 font-medium">{tCopy("COPY.SYSTEM_SETTINGS")}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2.5">
              <Settings className="text-indigo-400" size={24} /> {tCopy("COPY.SYSTEM_SETTINGS")}
            </h1>
          </div>
          <button type="submit" disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            data-testid="superadmin-settings-settings-overview-save-changes-1">
            <CheckCircle size={14} /> {tCopy("COPY.SAVE_CHANGES")}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-indigo-500/20 pb-2 overflow-x-auto" role="navigation" aria-label={tCopy("COPY.SYSTEM_SETTINGS_SECTIONS")}>
        {SUPERADMIN_SETTINGS_TABS.map((tab) => (
          <button type="button" key={tab.name}
            id={`settings-tab-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            aria-controls={`settings-panel-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            aria-current={activeTab === tab.name ? 'page' : undefined}
            onClick={() => navigateToWorkflow(tab.name)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.name
                ? 'border border-indigo-500/40 bg-indigo-500/20 text-indigo-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
            data-testid={`superadmin-settings-settings-overview-set-active-tab-2-${String(tab.name)}`}>
            <tab.icon size={14} /> {tCopy(tab.labelKey)}
          </button>
        ))}
      </div>

      {SUPERADMIN_SETTINGS_TABS.filter((tab) => tab.name !== activeTab).map((tab) => {
        const tabId = tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return <div key={tab.name} id={`settings-panel-${tabId}`} aria-labelledby={`settings-tab-${tabId}`} hidden />;
      })}

      {/* Content Panel */}
      <div id={`settings-panel-${activeTab.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
        className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0a0d22] to-[#060810] p-6 h-150 overflow-y-auto shadow-lg"
        aria-labelledby={`settings-tab-${activeTab.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
        aria-label={tCopy('COPY.ACTIVE_TAB_SETTINGS_ARIA_LABEL', { tab: tCopy(SUPERADMIN_SETTINGS_TABS.find((tab) => tab.name === activeTab)?.labelKey ?? 'COPY.TAB_GENERAL') })}
        tabIndex={0}>

        {activeTab === 'General' && (
          <div className="max-w-2xl space-y-8">
            <div>
              <h2 className="text-base font-bold text-slate-100 mb-1">{tCopy("COPY.GENERAL_REGIONAL")}</h2>
              <p className="text-xs text-slate-400 mb-6">{tCopy("COPY.GLOBAL_CONFIGURATION_APPLIED_TO_ALL_NEWLY_REGISTERED_LIBRARIES_BY_DEFAULT")}</p>
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label htmlFor="settings-platform-name" className="text-xs font-semibold uppercase tracking-wider text-slate-300">{tCopy("COPY.PLATFORM_NAME")}</label>
                  <input id="settings-platform-name" type="text" className="w-full rounded-xl border border-indigo-500/30 bg-indigo-500/[0.07] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400" aria-invalid={Boolean(errors.generalConfig?.platformName)} aria-describedby={errors.generalConfig?.platformName ? 'settings-platform-name-error' : undefined} {...register('generalConfig.platformName')} data-testid="superadmin-settings-settings-overview-settings-platform-name-3"/>
                  {translateValidationMessage(errors.generalConfig?.platformName?.message) && <p id="settings-platform-name-error" className="text-xs text-rose-400" role="alert">{translateValidationMessage(errors.generalConfig.platformName.message)}</p>}
                </div>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label htmlFor="settings-support-email" className="text-xs font-semibold uppercase tracking-wider text-slate-300">{tCopy("COPY.GLOBAL_SUPPORT_EMAIL")}</label>
                  <input id="settings-support-email" type="email" className="w-full rounded-xl border border-indigo-500/30 bg-indigo-500/[0.07] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400" aria-invalid={Boolean(errors.generalConfig?.supportEmail)} aria-describedby={errors.generalConfig?.supportEmail ? 'settings-support-email-error' : undefined} {...register('generalConfig.supportEmail')} data-testid="superadmin-settings-settings-overview-settings-support-email-4"/>
                  {translateValidationMessage(errors.generalConfig?.supportEmail?.message) && <p id="settings-support-email-error" className="text-xs text-rose-400" role="alert">{translateValidationMessage(errors.generalConfig.supportEmail.message)}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="settings-default-currency" className="text-xs font-semibold uppercase tracking-wider text-slate-300">{tCopy("COPY.DEFAULT_CURRENCY")}</label>
                  <select id="settings-default-currency" className="w-full rounded-xl border border-indigo-500/30 bg-indigo-500/[0.07] px-3.5 py-2.5 text-sm text-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400" aria-invalid={Boolean(errors.generalConfig?.currency)} {...register('generalConfig.currency')} data-testid="superadmin-settings-settings-overview-settings-default-currency-5">
                    <option>{tCopy("COPY.INR")}</option><option>{tCopy("COPY.USD")}</option><option>{tCopy("COPY.AED")}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="settings-default-timezone" className="text-xs font-semibold uppercase tracking-wider text-slate-300">{tCopy("COPY.DEFAULT_TIMEZONE")}</label>
                  <select id="settings-default-timezone" className="w-full rounded-xl border border-indigo-500/30 bg-indigo-500/[0.07] px-3.5 py-2.5 text-sm text-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400" aria-invalid={Boolean(errors.generalConfig?.timezone)} {...register('generalConfig.timezone')} data-testid="superadmin-settings-settings-overview-settings-default-timezone-6">
                    <option>{tCopy("COPY.ASIA_KOLKATA")}</option><option>{tCopy("COPY.UTC")}</option><option>{tCopy("COPY.AMERICA_NEW_YORK")}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'General' && activeTab !== 'APIs & Integrations' && activeTab !== 'Maintenance Mode' && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Palette size={40} className="text-indigo-400/40" />
            <p className="text-sm font-semibold text-slate-300">{tCopy(SUPERADMIN_SETTINGS_TABS.find((tab) => tab.name === activeTab)?.labelKey ?? 'COPY.TAB_GENERAL')}</p>
            <p className="text-xs text-slate-400 text-center max-w-sm">{tCopy(SUPERADMIN_SETTINGS_TABS.find((tab) => tab.name === activeTab)?.labelKey ?? 'COPY.TAB_GENERAL')} {tCopy("COPY.CONTROLS_ARE_NOT_CONNECTED_IN_THIS_SOURCE_ONLY_PREVIEW_NO_CONFIGURATION_IS_READ_OR_SAVED_FOR_THIS_SECTION")}</p>
          </div>
        )}
      </div>
      </form>
    </div>
  );
}
