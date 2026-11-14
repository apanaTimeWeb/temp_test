'use client';
/** Responsibility: renders only the Appearance preview workflow; no global settings form or persistence behavior is implied. */
/** Data-Flow: canonical route -> local preview defaults + two controlled selections -> illustrative preview; no host settings are read or saved. */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_settings/settings_appearance/config/superadmin_settings_appearance.url_config.ts';
import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_SETTINGS_APPEARANCE_PREVIEW_SCHEMA } from '@/app/frontend_superadmin/superadmin_settings/settings_appearance/schemas/SuperadminSettingsAppearanceSchema';
import type { SuperadminSettingsAppearancePreviewValues } from '@/app/frontend_superadmin/superadmin_settings/settings_appearance/types/SuperadminSettingsAppearanceTypes';
import { SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS } from '@/app/frontend_superadmin/superadmin_settings/settings_appearance/mocks/fixtures/SuperadminSettingsAppearancePreviewDefaults';
import { SUPERADMIN_SETTINGS_TABS } from '@/app/frontend_superadmin/superadmin_settings/settings_appearance/constants/SuperadminSettingsAppearanceConstants';

export default function SuperadminSettingsAppearancePageClient() {
  const tCopy = useTranslations('SUPERADMIN_SETTINGS');
  const [activeTab] = useState('Appearance');
  const [previewDensity, setPreviewDensity] = useState<SuperadminSettingsAppearancePreviewValues['previewDensity']>(SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS.previewDensity);
  const [previewAccent, setPreviewAccent] = useState<SuperadminSettingsAppearancePreviewValues['previewAccent']>(SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS.previewAccent);

  const navigateToWorkflow = (key: string) => {
    const routes: Record<string, string> = {
      General: SUPERADMIN_NAVIGATION_ROUTES.settings_general,
      Appearance: SUPERADMIN_NAVIGATION_ROUTES.settings_appearance,
      'APIs & Integrations': SUPERADMIN_NAVIGATION_ROUTES.settings_integrations,
      Storage: SUPERADMIN_NAVIGATION_ROUTES.settings_storage,
      'Maintenance Mode': SUPERADMIN_NAVIGATION_ROUTES.settings_maintenance_mode,
    };
    const route = routes[key];
    if (route) {
      const target = new URL(route, window.location.origin);
      const query = new URLSearchParams(window.location.search);
      query.delete('view');
      query.forEach((value, queryKey) => { if (!target.searchParams.has(queryKey)) target.searchParams.append(queryKey, value); });
      window.location.assign(target.pathname + target.search + target.hash);
    }
  };

  const updatePreview = (next: Partial<SuperadminSettingsAppearancePreviewValues>) => {
    const candidate = { previewDensity, previewAccent, ...next };
    const parsed = SUPERADMIN_SETTINGS_APPEARANCE_PREVIEW_SCHEMA.safeParse(candidate);
    if (!parsed.success) return;
    setPreviewDensity(parsed.data.previewDensity);
    setPreviewAccent(parsed.data.previewAccent);
  };

  return (
    <div className="sa-page-animate">
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb"><span>{tCopy('COPY.LIBRARY_OS')}</span><span>/</span><span>{tCopy('COPY.SUPER_ADMIN')}</span><span>/</span><span>{tCopy('COPY.SYSTEM_SETTINGS')}</span></div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title flex items-center gap-3"><Settings className="text-primary" size={28} /> {tCopy('COPY.SYSTEM_SETTINGS')}</h1>
        </div>
      </div>

      <div className="mb-5 rounded-lg border border-info/30 bg-info-bg p-3 text-sm text-primary" role="status" data-testid="superadmin-settings-appearance-preview-only-disclosure">
        {tCopy('COPY.PREVIEW_ONLY_THESE_SETTINGS_REMAIN_IN_THIS_PAGE_S_LOCAL_STATE_NO_GLOBAL_CONFIGURATION_WAS_SAVED_BECAUSE_NO_SETTINGS_API_CONTRACT_IS_SUPPLIED')}
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-border pb-2 overflow-x-auto hide-scrollbar" role="navigation" aria-label={tCopy('COPY.SYSTEM_SETTINGS_SECTIONS')}>
        {SUPERADMIN_SETTINGS_TABS.map((tab) => (
          <button type="button" key={tab.name} id={`settings-tab-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} aria-controls={`settings-panel-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} aria-current={activeTab === tab.name ? 'page' : undefined} onClick={() => navigateToWorkflow(tab.name)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold motion-safe:transition-all motion-reduce:transition-none whitespace-nowrap ${activeTab === tab.name ? 'bg-primary-subtle text-primary border border-focus shadow-card' : 'text-secondary hover:bg-surface-hover hover:text-primary'}`} data-testid={`superadmin-settings-settings-appearance-set-active-tab-${String(tab.name)}`}>
            <tab.icon size={16} aria-hidden="true" /> {tCopy(tab.labelKey)}
          </button>
        ))}
      </div>

      {SUPERADMIN_SETTINGS_TABS.filter((tab) => tab.name !== activeTab).map((tab) => {
        const tabId = tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return <div key={tab.name} id={`settings-panel-${tabId}`} aria-labelledby={`settings-tab-${tabId}`} hidden />;
      })}

      <div id="settings-panel-appearance" className="sa-card p-6 overflow-y-auto" aria-labelledby="settings-tab-appearance" aria-label={tCopy('COPY.APPEARANCE_PREVIEW_ONLY')} tabIndex={0}>
        <div className="max-w-3xl space-y-8 motion-safe:animate-fade-in motion-reduce:animate-none">
          <div>
            <h2 className="text-lg font-bold text-primary mb-2">{tCopy('COPY.APPEARANCE_PREVIEW_ONLY')}</h2>
            <p className="text-sm text-secondary mb-6">{tCopy('COPY.APPEARANCE_PREVIEW_EXPLANATION')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="settings-appearance-density" className="text-sm font-semibold text-primary">{tCopy('COPY.DISPLAY_DENSITY')}</label>
                <select id="settings-appearance-density" className="sa-input" value={previewDensity} onChange={(event) => updatePreview({ previewDensity: event.currentTarget.value as SuperadminSettingsAppearancePreviewValues['previewDensity'] })} data-testid="superadmin-settings-appearance-density-select">
                  <option value="comfortable">{tCopy('COPY.DENSITY_COMFORTABLE')}</option>
                  <option value="compact">{tCopy('COPY.DENSITY_COMPACT')}</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="settings-appearance-accent" className="text-sm font-semibold text-primary">{tCopy('COPY.PREVIEW_ACCENT')}</label>
                <select id="settings-appearance-accent" className="sa-input" value={previewAccent} onChange={(event) => updatePreview({ previewAccent: event.currentTarget.value as SuperadminSettingsAppearancePreviewValues['previewAccent'] })} data-testid="superadmin-settings-appearance-accent-select">
                  <option value="neutral">{tCopy('COPY.ACCENT_NEUTRAL')}</option>
                  <option value="highlighted">{tCopy('COPY.ACCENT_HIGHLIGHTED')}</option>
                </select>
              </div>
            </div>
          </div>

          <section data-density={previewDensity} aria-labelledby="settings-appearance-preview-title" className={`rounded-xl border p-5 ${previewAccent === 'highlighted' ? 'border-border bg-info-bg' : 'border-border bg-card'}`}>
            <h3 id="settings-appearance-preview-title" className="text-base font-bold text-primary mb-3">{tCopy('COPY.APPEARANCE_SAMPLE_PREVIEW')}</h3>
            <div className="flex items-center justify-between gap-3 mb-4"><span className="text-sm text-secondary">{tCopy('COPY.PREVIEW_SAMPLE_RECORD')}</span><span className="sa-badge bg-success-bg text-success">{tCopy('COPY.PREVIEW_STATUS_ACTIVE')}</span></div>
            <table className="w-full text-sm text-left"><thead><tr><th scope="col" className="px-3 py-2 border-b border-border">{tCopy('COPY.PREVIEW_COLUMN_NAME')}</th><th scope="col" className="px-3 py-2 border-b border-border">{tCopy('COPY.PREVIEW_COLUMN_STATUS')}</th></tr></thead><tbody><tr><td className="px-3 py-2 border-b border-border">{tCopy('COPY.PREVIEW_SAMPLE_RECORD')}</td><td className="px-3 py-2 border-b border-border">{tCopy('COPY.PREVIEW_STATUS_ACTIVE')}</td></tr><tr><td className="px-3 py-2 border-b border-border">{tCopy('COPY.PREVIEW_SECOND_SAMPLE_RECORD')}</td><td className="px-3 py-2 border-b border-border">{tCopy('COPY.PREVIEW_STATUS_PENDING')}</td></tr></tbody></table>
          </section>
        </div>
      </div>
    </div>
  );
}
