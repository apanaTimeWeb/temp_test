/** Canonical module routes/API endpoints and cohesive module-owned configuration constants. */
import type { AdminSecurityEventFilter } from '@/app/frontend_admin/admin_settings/settings_security/types/AdminSettingsSecurityTypes';
import { Activity, Ban, BellRing, KeyRound, Laptop, MonitorSmartphone, Shield, XOctagon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AdminSecurityTab } from '@/app/frontend_admin/admin_settings/settings_security/types/AdminSettingsSecurityTypes';
import type { AdminSecurityEventFilterOptionLabelKey, AdminSecurityNavigationItemLabelKey } from '@/app/frontend_admin/admin_settings/settings_security/types/AdminSettingsSecurityTypes';


/** Canonical route and API contract for admin_settings_security; API entries are source-observed only. */
export const ADMIN_SETTINGS_SECURITY_ROUTES = {
  ROOT: "/admin/admin_settings/settings_security",
} as const;

export const ADMIN_SETTINGS_SECURITY_API = {
  // No verified API endpoint was supplied; do not infer one.
  CONTRACT_MISSING: null as string | null,
} as const;

/** Backward-compatible route constant for existing consumers. */
export const ADMIN_SETTINGS_SECURITY_CANONICAL_ROUTE = ADMIN_SETTINGS_SECURITY_ROUTES.ROOT;

export const ADMIN_SECURITY_ROOT = ADMIN_SETTINGS_SECURITY_ROUTES.ROOT;

export const ADMIN_SECURITY_URLS = { ROOT: ADMIN_SECURITY_ROOT } as const;

export const MODULE_URLS = ADMIN_SECURITY_URLS;

export interface AdminSecurityEventFilterOption {
  value: AdminSecurityEventFilter;
  labelKey: AdminSecurityEventFilterOptionLabelKey;
}

export const ADMIN_SECURITY_EVENT_FILTERS: readonly AdminSecurityEventFilterOption[] = [
  { value: 'all', labelKey: 'FILTER_ALL_EVENTS' },
  { value: 'password', labelKey: 'FILTER_PASSWORD_CHANGES' },
  { value: 'account', labelKey: 'FILTER_ACCOUNT_ACTIONS' },
  { value: '2fa', labelKey: 'FILTER_TWO_FACTOR' },
  { value: 'session', labelKey: 'FILTER_SESSION_ACTIONS' },
] as const;

export interface AdminSecurityNavigationItem {
  id: AdminSecurityTab;
  labelKey: AdminSecurityNavigationItemLabelKey;
  icon: LucideIcon;
}

/** Navigation is owned by this feature; labels resolve in the ADMIN_SECURITY catalog. */
export const ADMIN_SECURITY_NAV_ITEMS: readonly AdminSecurityNavigationItem[] = [
  { id: 'dashboard', labelKey: 'NAV_DASHBOARD', icon: Shield },
  { id: 'login-security', labelKey: 'NAV_LOGIN_SECURITY', icon: KeyRound },
  { id: 'active-sessions', labelKey: 'NAV_ACTIVE_SESSIONS', icon: MonitorSmartphone },
  { id: 'failed-logins', labelKey: 'NAV_FAILED_LOGINS', icon: XOctagon },
  { id: 'blocked-users', labelKey: 'NAV_BLOCKED_USERS', icon: Ban },
  { id: 'device-sessions', labelKey: 'NAV_DEVICE_SESSIONS', icon: Laptop },
  { id: 'events', labelKey: 'NAV_EVENTS', icon: BellRing },
] as const;
