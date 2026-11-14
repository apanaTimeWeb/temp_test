// FLOW: Feature consumers -> superadmin_settings/settings_general/constants/SuperadminSettingsGeneralConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Settings Constants; centralizes stable module-owned options and configuration. */
import { Globe, Palette, Mail, Database, ShieldAlert } from 'lucide-react';
export const SUPERADMIN_SETTINGS_TABS = [
    { name: 'General', labelKey: 'COPY.TAB_GENERAL', icon: Globe },
    { name: 'Appearance', labelKey: 'COPY.TAB_APPEARANCE', icon: Palette },
    { name: 'APIs & Integrations', labelKey: 'COPY.TAB_APIS_INTEGRATIONS', icon: Mail },
    { name: 'Storage', labelKey: 'COPY.TAB_STORAGE', icon: Database },
    { name: 'Maintenance Mode', labelKey: 'COPY.TAB_MAINTENANCE_MODE', icon: ShieldAlert },
  ];
