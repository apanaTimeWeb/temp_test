import type { AdminSettingsSecurityScenario } from '@/app/frontend_admin/admin_settings/settings_security/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export type AdminSecurityTab =
  | 'dashboard'
  | 'login-security'
  | 'active-sessions'
  | 'failed-logins'
  | 'blocked-users'
  | 'device-sessions'
  | 'events';

export type AdminSecurityEventFilter = 'all' | 'password' | 'account' | '2fa' | 'session';
export type AdminSecurityEventCategory = Exclude<AdminSecurityEventFilter, 'all'>;
export type AdminSecuritySemanticTone = 'info' | 'danger' | 'success' | 'warning';

export interface AdminSecurityEvent {
  id: string;
  timeKey: string;
  actionKey: string;
  userKey: string;
  category: AdminSecurityEventCategory;
  tone: AdminSecuritySemanticTone;
}

export interface AdminSettingsSecurityHarnessProps {
  children: ReactNode;
  scenario?: AdminSettingsSecurityScenario;
}

export type AdminSecurityEventFilterOptionLabelKey = 'FILTER_ALL_EVENTS' | 'FILTER_PASSWORD_CHANGES' | 'FILTER_ACCOUNT_ACTIONS' | 'FILTER_TWO_FACTOR' | 'FILTER_SESSION_ACTIONS';
export type AdminSecurityNavigationItemLabelKey = 'NAV_DASHBOARD' | 'NAV_LOGIN_SECURITY' | 'NAV_ACTIVE_SESSIONS' | 'NAV_FAILED_LOGINS' | 'NAV_BLOCKED_USERS' | 'NAV_DEVICE_SESSIONS' | 'NAV_EVENTS';
