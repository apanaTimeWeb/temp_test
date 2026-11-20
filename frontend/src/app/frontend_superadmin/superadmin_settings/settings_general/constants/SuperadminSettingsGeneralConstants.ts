// FLOW: Feature consumers -> superadmin_settings/settings_general/constants/SuperadminSettingsGeneralConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Settings Constants; centralizes stable module-owned options and configuration. */
import { Globe, ShieldCheck, ShieldAlert } from 'lucide-react';
export const SUPERADMIN_SETTINGS_TABS = [
    { name: 'General', labelKey: 'COPY.TAB_GENERAL', icon: Globe },
    { name: 'Permissions', labelKey: 'COPY.TAB_PERMISSIONS', icon: ShieldCheck },
    { name: 'Maintenance Mode', labelKey: 'COPY.TAB_MAINTENANCE_MODE', icon: ShieldAlert },
  ];

