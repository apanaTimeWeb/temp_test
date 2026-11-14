// RESPONSIBILITY: Define stable module-owned constants for users directory; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_users/users_directory/constants/SuperadminUsersDirectoryConstants.ts -> typed constants -> component/hook/config behavior.
import { Shield, ShieldCheck, Activity } from 'lucide-react';

/** Canonical role and status vocabulary for the Superadmin user-access feature. */
export const SUPERADMIN_USERS_ROLE_VALUES = ['SuperAdmin', 'Admin', 'Manager'] as const;
/**
 * Defines the public SuperadminUsersRole contract for users directory. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminUsersRole = (typeof SUPERADMIN_USERS_ROLE_VALUES)[number];

export const SUPERADMIN_USERS_ROLE_OPTIONS = [
  { value: 'SuperAdmin', labelKey: 'COPY.ROLE_SUPERADMIN_SYSTEM' },
  { value: 'Admin', labelKey: 'COPY.ROLE_ADMIN_TENANT_OWNER' },
  { value: 'Manager', labelKey: 'COPY.ROLE_MANAGER_STAFF' },
] as const satisfies ReadonlyArray<{ value: SuperadminUsersRole; labelKey: string }>;

export const SUPERADMIN_USERS_STATUS_VALUES = ['Active', 'Suspended'] as const;
/**
 * Defines the public SuperadminUsersStatus contract for users directory. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminUsersStatus = (typeof SUPERADMIN_USERS_STATUS_VALUES)[number];

export const SUPERADMIN_USERS_DEFAULT_FORM_VALUES = {
  name: '',
  username: '',
  email: '',
  role: 'Manager',
  branch: 'Global',
  twoFactor: false,
} as const;

/** Stable module-owned options/configuration; user-visible labels must be resolved through locale keys in the consumer. */
export const SUPERADMIN_USERS_TABS = [
    { name: 'All Users', labelKey: 'COPY.TAB_ALL_USERS', icon: Shield },
    { name: 'Roles & Permissions', labelKey: 'COPY.TAB_ROLES_PERMISSIONS', icon: ShieldCheck },
    { name: 'User Sessions', labelKey: 'COPY.TAB_USER_SESSIONS', icon: Activity },
  ];
