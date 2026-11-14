// RESPONSIBILITY: Define stable module-owned constants for settings profile security; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_settings/settings_profile_security/constants/SuperadminProfileSecurityTwoFactorStaticConstants.ts -> typed constants -> component/hook/config behavior.

import { User, UserCog, KeyRound, Fingerprint, History, MonitorSmartphone, Shield } from 'lucide-react';
/** Static module-owned options/status mapping extracted from SuperadminProfileSecurityTwoFactorPageClient.tsx. */
export const SUPERADMIN_PROFILE_OVERVIEW_PAGE_CLIENT_TAB_ICONS = { User, UserCog, KeyRound, Fingerprint, History, MonitorSmartphone, Shield } as const;

