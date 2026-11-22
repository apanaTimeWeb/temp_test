// RESPONSIBILITY: Define stable module-owned constants for security user sessions; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_security/security_user_sessions/constants/SuperadminSecurityUserSessionsConstants.ts -> typed constants -> component/hook/config behavior.
import { Shield, ShieldCheck, Activity } from 'lucide-react';

/** Secondary navigation for the related user-access workflows. */
export const SUPERADMIN_USERS_TABS = [
  { name: 'All Users', labelKey: 'COPY.TAB_ALL_USERS', icon: Shield },
  { name: 'Roles & Permissions', labelKey: 'COPY.TAB_ROLES_PERMISSIONS', icon: ShieldCheck },
  { name: 'User Sessions', labelKey: 'COPY.TAB_USER_SESSIONS', icon: Activity },
] as const;
