// RESPONSIBILITY: Define stable module-owned constants for settings library configuration; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_settings/settings_library_configuration/constants/SuperadminSettingsGeneralSettingsLibraryConfigurationStaticConstants.ts -> typed constants -> component/hook/config behavior.


import { Palette, AlertCircle, Zap, CreditCard, Bell, Globe } from 'lucide-react';
/** Static module-owned options/status mapping extracted from SuperadminSettingsGeneralSettingsLibraryConfigurationNavigation.tsx. */
export const SUPERADMIN_SYSTEM_SETTINGS_CATEGORIES = [
  { id: 'branding',     labelKey: 'COPY.BRANDING',         icon: Palette     },
  { id: 'late-fee',     labelKey: 'COPY.LATE_FEE_RULES',    icon: AlertCircle },
  { id: 'auto-suspend', labelKey: 'COPY.AUTO_SUSPEND_RULES',icon: Zap         },
  { id: 'upi',          labelKey: 'COPY.UPI_PAYMENT',     icon: CreditCard  },
  { id: 'notifications',labelKey: 'COPY.NOTIFICATIONS',     icon: Bell        },
  { id: 'general',      labelKey: 'COPY.GENERAL',           icon: Globe       },
];


/** Static module-owned options/status mapping extracted from SuperadminSettingsGeneralSettingsLibraryConfigurationButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_SIZE = { sm: 'sys-btn--sm', md: '', lg: 'sys-btn--lg', icon: 'sys-btn--icon' };


/** Static module-owned options/status mapping extracted from SuperadminSettingsGeneralSettingsLibraryConfigurationButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_VARIANT = {
  primary: 'sys-btn-primary', ghost: 'sys-btn-ghost', destructive: 'sys-btn-danger',
  secondary: 'sys-btn-ghost', link: 'sys-btn-link',
};
