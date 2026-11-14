'use client';
/** Responsibility: Superadmin System Settings Navigation; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSettingsGeneralSettingsLibraryConfigurationNavigation formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { useTranslations } from 'next-intl';
import { Settings, ChevronRight } from 'lucide-react';
import { SUPERADMIN_SYSTEM_SETTINGS_CATEGORIES } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/constants/SuperadminSettingsGeneralSettingsLibraryConfigurationStaticConstants';
import type { SuperadminSettingsGeneralSettingsLibraryConfigurationNavigationProps } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/types/SuperadminSettingsGeneralSettingsLibraryConfigurationNavigationComponentTypes';

/**
 * Performs the superadmin settings general settings library configuration navigation operation within settings general; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSettingsGeneralSettingsLibraryConfigurationNavigationProps.
 */
export default function SuperadminSettingsGeneralSettingsLibraryConfigurationNavigation({ active, onActiveChange }: SuperadminSettingsGeneralSettingsLibraryConfigurationNavigationProps) {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-secondary text-xs font-medium tracking-wide mb-1"><span>{tCopy("COPY.SYSTEM")}</span><ChevronRight size={12}/><span>{tCopy("COPY.SETTINGS")}</span></div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3"><Settings size={28} className="text-primary"/>{tCopy("COPY.SETTINGS")}</h1>
        <p className="text-secondary mt-1 text-sm">{tCopy("COPY.MANAGE_YOUR_LIBRARY_CONFIGURATION_AND_PREFERENCES")}</p>
      </div>
      <aside className="w-52 shrink-0"><nav aria-label={tCopy("COPY.SETTINGS_CATEGORIES")} className="flex flex-col gap-1">{SUPERADMIN_SYSTEM_SETTINGS_CATEGORIES.map(({ id, labelKey, icon: Icon }) => <button key={id} id={`settings-nav-${id}`} type="button" aria-current={active === id ? 'page' : undefined} onClick={() => onActiveChange(id)} className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium motion-safe:transition-all motion-reduce:transition-none motion-safe:duration-150 text-left ${active === id ? 'bg-primary-subtle text-primary border border-focus' : 'text-secondary hover:bg-floating hover:text-primary'}`} data-testid={`superadmin-system-system-settings-navigation-on-active-change-1-${String(id)}`}><Icon size={16}/>{tCopy(labelKey)}</button>)}</nav></aside>
    </>
  );
}
