// RESPONSIBILITY: Define stable module-owned constants for users roles permissions; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_users/users_roles_permissions/constants/SuperadminUsersRolesPermissionsConstants.ts -> typed constants -> component/hook/config behavior.
import { Shield, ShieldCheck, Activity } from 'lucide-react';

/** Stable navigation options for the Superadmin Users domain; sibling routes own their data and behavior. */
export const SUPERADMIN_USERS_TABS = [
  { name: 'All Users', labelKey: 'COPY.TAB_ALL_USERS', icon: Shield },
  { name: 'Roles & Permissions', labelKey: 'COPY.TAB_ROLES_PERMISSIONS', icon: ShieldCheck },
  { name: 'User Sessions', labelKey: 'COPY.TAB_USER_SESSIONS', icon: Activity },
] as const;
