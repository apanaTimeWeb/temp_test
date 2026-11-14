'use client';
/** Responsibility: renders the superadmin_settings overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminSettingsMaintenanceModePageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_settings/settings_maintenance_mode/config/superadmin_settings_maintenance_mode.url_config.ts';
import { useSuperadminSettingsMaintenanceModeValidationMessage } from '@/app/frontend_superadmin/superadmin_settings/settings_maintenance_mode/hooks/useSuperadminSettingsMaintenanceModeValidationMessage';
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SUPERADMIN_SETTINGS_SCHEMA } from '@/app/frontend_superadmin/superadmin_settings/settings_maintenance_mode/schemas/SuperadminSettingsMaintenanceModeSchema';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_maintenance_mode/types/SuperadminSettingsMaintenanceModeTypes';
import { SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS } from '@/app/frontend_superadmin/superadmin_settings/settings_maintenance_mode/mocks/fixtures/SuperadminSettingsMaintenanceModePreviewDefaults';
import { Settings, Palette, Mail, MessageSquare, ShieldAlert, CheckCircle, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSuperadminSettingsMaintenanceModeUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_settings/settings_maintenance_mode/hooks/useSuperadminSettingsMaintenanceModeUnsavedChangesGuard';
import { SUPERADMIN_SETTINGS_TABS } from '@/app/frontend_superadmin/superadmin_settings/settings_maintenance_mode/constants/SuperadminSettingsMaintenanceModeConstants';
/**
 * Renders the `superadmin_settings` view owned by `SuperadminSettingsMaintenanceModePageClient`.
 * Owns local UI state for `activeTab`, `saved`.
 * Dirty form state is guarded before destructive or route-leaving actions.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminSettingsMaintenanceModePageClient() {
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
const translateValidationMessage = useSuperadminSettingsMaintenanceModeValidationMessage();
  const [activeTab] = useState("Maintenance Mode");

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
  useSuperadminSettingsMaintenanceModeUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  const maintenanceEnabled = Boolean(watch('maintenance.enabled'));

  

  const handleSave = (_values: SuperadminSettingsFormValues) => {
    toast.message(tCopy('COPY.PREVIEW_ONLY_THESE_SETTINGS_REMAIN_IN_THIS_PAGE_S_LOCAL_STATE_NO_GLOBAL_CONFIGURATION_WAS_SAVED_BECAUSE_NO_SETTINGS_API_CONTRACT_IS_SUPPLIED'), { id: 'superadmin:settings:preview-save' });
  };

  return (
    <div className="sa-page-animate">
      <form onSubmit={handleSubmit(handleSave)} noValidate data-testid="superadmin-superadmin-settings-overview-page-client-form-line-50">
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>{tCopy("COPY.LIBRARY_OS")}</span><span>/</span><span>{tCopy("COPY.SUPER_ADMIN")}</span><span>/</span><span>{tCopy("COPY.SYSTEM_SETTINGS")}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title flex items-center gap-3">
            <Settings className="text-primary" size={28} /> {tCopy("COPY.SYSTEM_SETTINGS")}
          </h1>
          <button type="submit" disabled={isSubmitting} className="sa-btn-primary" data-testid="superadmin-settings-settings-overview-save-changes-1">
            <CheckCircle size={16} /> {tCopy("COPY.SAVE_CHANGES")}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-border pb-2 overflow-x-auto hide-scrollbar" role="navigation" aria-label={tCopy("COPY.SYSTEM_SETTINGS_SECTIONS")}>
        {SUPERADMIN_SETTINGS_TABS.map((tab) => (
          <button type="button"
            key={tab.name}
            id={`settings-tab-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            aria-controls={`settings-panel-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            aria-current={activeTab === tab.name ? 'page' : undefined}
            onClick={() => navigateToWorkflow(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold motion-safe:transition-all motion-reduce:transition-none whitespace-nowrap ${
              activeTab === tab.name 
                ? 'bg-primary-subtle text-primary border border-focus shadow-card' 
                : 'text-secondary hover:bg-surface-hover hover:text-primary'
            }`}
           data-testid={`superadmin-settings-settings-overview-set-active-tab-2-${String(tab.name)}`}>
            <tab.icon size={16} /> {tCopy(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Keep every tab-to-panel relationship resolvable, including inactive preview panels. */}
      {SUPERADMIN_SETTINGS_TABS.filter((tab) => tab.name !== activeTab).map((tab) => {
        const tabId = tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return <div key={tab.name} id={`settings-panel-${tabId}`}  aria-labelledby={`settings-tab-${tabId}`} hidden />;
      })}

      {/* Content */}
      <div id={`settings-panel-${activeTab.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="sa-card p-6 h-150 overflow-y-auto"  aria-labelledby={`settings-tab-${activeTab.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} aria-label={tCopy('COPY.ACTIVE_TAB_SETTINGS_ARIA_LABEL', { tab: tCopy(SUPERADMIN_SETTINGS_TABS.find((tab) => tab.name === activeTab)?.labelKey ?? 'COPY.TAB_GENERAL') })} tabIndex={0}>
        
        

        

        {activeTab === 'Maintenance Mode' && (
          <div className="max-w-2xl space-y-8 motion-safe:animate-fade-in motion-reduce:animate-none">
            <div className="p-6 bg-danger-bg border border-border rounded-xl">
              <div className="flex items-center gap-3 text-danger mb-2">
                <ShieldAlert size={24} />
                <h3 className="font-bold text-lg">{tCopy("COPY.SYSTEM_MAINTENANCE_MODE")}</h3>
              </div>
              <p className="text-sm text-danger mb-6">
                {tCopy("COPY.ENABLING_THIS_WILL_BLOCK_ALL_LIBRARY_ADMINS_AND_STUDENTS_FROM_LOGGING_IN_ONLY_SUPERADMINS_WILL_HAVE_ACCESS_TO_THE_PLATFORM")}
              </p>
              
              <div className="flex items-center justify-between p-4 bg-floating rounded-lg mb-6">
                <div>
                  <h4 className="text-sm font-bold text-primary">{tCopy("COPY.ENABLE_MAINTENANCE")}</h4>
                  <p className="text-xs text-secondary mt-1">{tCopy("COPY.PREVIEW_ONLY_WOULD_DISPLAY")} {maintenanceEnabled ? tCopy('COPY.MAINTENANCE_OFFLINE') : tCopy('COPY.MAINTENANCE_ONLINE')} {tCopy("COPY.IF_SAVED_BY_A_VERIFIED_SETTINGS_API")}</p>
                </div>
                <button type="button" role="switch" aria-label={tCopy("COPY.ENABLE_MAINTENANCE_MODE_IN_LOCAL_PREVIEW")} aria-checked={maintenanceEnabled}
                  onClick={() => setValue('maintenance.enabled', !maintenanceEnabled, { shouldDirty: true, shouldValidate: true })}
                  className={`w-14 h-7 rounded-full motion-safe:transition-colors motion-reduce:transition-none relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${maintenanceEnabled ? 'bg-danger text-on-danger' : 'bg-surface-hover'}`}
                 data-testid="superadmin-settings-settings-overview-enable-maintenance-mode-in-local-preview-11">
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-surface-highlight rounded-full motion-safe:transition-transform motion-reduce:transition-none ${maintenanceEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>

              {maintenanceEnabled && (
                <div className="flex flex-col gap-2 motion-safe:animate-fade-in motion-reduce:animate-none">
                  <label htmlFor="settings-maintenance-message" className="text-sm font-semibold text-primary">{tCopy("COPY.MESSAGE_SHOWN_TO_USERS")}</label>
                  <textarea
                    id="settings-maintenance-message"
                    className="sa-input h-24 py-2 resize-none border-border"
                    aria-invalid={Boolean(errors.maintenance?.message)} aria-describedby={errors.maintenance?.message ? 'settings-maintenance-message-error' : undefined}
                    {...register('maintenance.message')}
                   data-testid="superadmin-settings-settings-overview-settings-maintenance-message-12"/>
                  {translateValidationMessage(errors.maintenance?.message?.message) && <p id="settings-maintenance-message-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.maintenance.message.message)}</p>}
                </div>
              )}
            </div>
          </div>
        )}

        

      </div>
      </form>
    </div>
  );
}
