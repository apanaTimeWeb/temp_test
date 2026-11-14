// FLOW: Feature consumers -> superadmin_settings/settings_profile_security/constants/SuperadminProfileSecurityTwoFactorConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Profile Constants; centralizes stable module-owned options and configuration. */
import type { SuperadminProfileEditFormValues, SuperadminProfileTab } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes';

export const SUPERADMIN_PROFILE_DEFAULT_VALUES: SuperadminProfileEditFormValues = {
  firstName: 'Sample',
  lastName: 'Administrator',
  email: 'admin@example.invalid',
  phone: '0000000000',
};

export const SUPERADMIN_PROFILE_TABS: readonly { name: SuperadminProfileTab; iconName: 'user' | 'user-cog' | 'key-round' | 'fingerprint' | 'history' | 'monitor-smartphone' | 'shield' }[] = [
  { name: 'Profile', iconName: 'user' },
  { name: 'Edit Profile', iconName: 'user-cog' },
  { name: 'Change Password', iconName: 'key-round' },
  { name: '2FA', iconName: 'fingerprint' },
  { name: 'Login History', iconName: 'history' },
  { name: 'Active Sessions', iconName: 'monitor-smartphone' },
  { name: 'Security Settings', iconName: 'shield' },
];
