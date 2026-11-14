'use client';
/** Responsibility: renders the superadmin_settings overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminSettingsStoragePageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_settings/settings_storage/config/superadmin_settings_storage.url_config.ts';

import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SUPERADMIN_SETTINGS_SCHEMA } from '@/app/frontend_superadmin/superadmin_settings/settings_storage/schemas/SuperadminSettingsStorageSchema';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_storage/types/SuperadminSettingsStorageTypes';
import { SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS } from '@/app/frontend_superadmin/superadmin_settings/settings_storage/mocks/fixtures/SuperadminSettingsStoragePreviewDefaults';
import { Settings, Palette, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSuperadminSettingsStorageUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_settings/settings_storage/hooks/useSuperadminSettingsStorageUnsavedChangesGuard';
import { SUPERADMIN_SETTINGS_TABS } from '@/app/frontend_superadmin/superadmin_settings/settings_storage/constants/SuperadminSettingsStorageConstants';
/**
 * Renders the `superadmin_settings` view owned by `SuperadminSettingsStoragePageClient`.
 * Owns local UI state for `activeTab`, `saved`.
 * Dirty form state is guarded before destructive or route-leaving actions.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminSettingsStoragePageClient() {
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
  const [activeTab] = useState("Storage");

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
  useSuperadminSettingsStorageUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));

  

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
        
        

        

        

        {activeTab !== 'General' && activeTab !== 'APIs & Integrations' && activeTab !== 'Maintenance Mode' && (
          <div className="flex flex-col items-center justify-center h-full text-secondary motion-safe:animate-fade-in motion-reduce:animate-none">
            <Palette size={48} className="mb-4 opacity-30 text-primary" />
            <p className="text-lg font-medium">{tCopy(SUPERADMIN_SETTINGS_TABS.find((tab) => tab.name === activeTab)?.labelKey ?? 'COPY.TAB_GENERAL')}</p>
            <p className="text-sm mt-1 text-center max-w-sm">{tCopy(SUPERADMIN_SETTINGS_TABS.find((tab) => tab.name === activeTab)?.labelKey ?? 'COPY.TAB_GENERAL')} {tCopy("COPY.CONTROLS_ARE_NOT_CONNECTED_IN_THIS_SOURCE_ONLY_PREVIEW_NO_CONFIGURATION_IS_READ_OR_SAVED_FOR_THIS_SECTION")}</p>
          </div>
        )}

      </div>
      </form>
    </div>
  );
}
