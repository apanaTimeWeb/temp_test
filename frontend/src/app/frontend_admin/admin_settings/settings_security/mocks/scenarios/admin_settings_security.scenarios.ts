import type { AdminSecurityEvent } from '@/app/frontend_admin/admin_settings/settings_security/types/AdminSettingsSecurityTypes';

/**
 * Canonical transport-level mock scenario registry for Admin Settings Security.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminSettingsSecurityScenarioCatalog = (activeRecords: unknown) => ({
  ACTIVE_RECORDS: {
    kind: 'http-response',
    status: 200,
    envelope: {
      success: true,
      message: 'Module-local populated fixture.',
      data: activeRecords,
      requestId: 'mock-active-records',
    },
  },
  EMPTY_DATA: {
    kind: 'http-response',
    status: 200,
    envelope: {
      success: true,
      message: 'No records returned by the empty-result scenario.',
      data: [],
      requestId: 'mock-empty-data',
    },
  },
  SERVER_500_ERROR: {
    kind: 'http-response',
    status: 500,
    envelope: {
      success: false,
      message: 'Simulated internal server error.',
      data: null,
      errorCode: 'ERR_INTERNAL_500',
      statusCode: 500,
      requestId: 'mock-server-500',
    },
  },
  NETWORK_TIMEOUT: {
    kind: 'delayed-http-response',
    delayMs: 15000,
    status: 504,
    envelope: {
      success: false,
      message: 'Simulated request timeout.',
      data: null,
      errorCode: 'ERR_TIMEOUT',
      statusCode: 504,
      requestId: 'mock-network-timeout',
    },
  },
  UNAUTHORIZED_401: {
    kind: 'http-response',
    status: 401,
    envelope: {
      success: false,
      message: 'Simulated unauthenticated request.',
      data: null,
      errorCode: 'ERR_UNAUTHORIZED',
      statusCode: 401,
      requestId: 'mock-unauthorized-401',
    },
  },
  FORBIDDEN_403: {
    kind: 'http-response',
    status: 403,
    envelope: {
      success: false,
      message: 'Simulated authenticated request without permission.',
      data: null,
      errorCode: 'ERR_FORBIDDEN',
      statusCode: 403,
      requestId: 'mock-forbidden-403',
    },
  },
  NETWORK_ERROR: {
    kind: 'transport-error',
    transport: 'fetch-rejection',
    message: 'Simulated network failure without an HTTP response.',
  },
  INVALID_RESPONSE: {
    kind: 'malformed-success-envelope',
    status: 200,
    envelope: {
      success: true,
      message: 'Deliberately malformed response: required data and requestId are absent.',
    },
  },
} as const);

/** Synthetic samples only. Values use reserved domains and documentation IPs, never real account data. */
export const ADMIN_SECURITY_DASHBOARD_METRICS = [
  { id: 'sessions', labelKey: 'METRIC_ACTIVE_SESSIONS', value: 12, tone: 'success' },
  { id: 'failed-logins', labelKey: 'METRIC_FAILED_LOGINS', value: 3, tone: 'danger' },
  { id: 'blocked-accounts', labelKey: 'METRIC_BLOCKED_ACCOUNTS', value: 1, tone: 'warning' },
] as const;

export const ADMIN_SECURITY_ACTIVE_SESSION_FIXTURES = [
  { id: 'session-demo-1', nameKey: 'DEMO_MANAGER_ONE', roleKey: 'ROLE_BRANCH_MANAGER', deviceKey: 'DEVICE_WINDOWS_CHROME', ip: '192.0.2.10', current: true },
  { id: 'session-demo-2', nameKey: 'DEMO_MANAGER_TWO', roleKey: 'ROLE_SHIFT_MANAGER', deviceKey: 'DEVICE_MAC_SAFARI', ip: '192.0.2.20', current: false },
] as const;

export const ADMIN_SECURITY_FAILED_LOGIN_FIXTURES = [
  { id: 'failed-demo-1', timeKey: 'TIME_TEN_MINUTES', account: 'manager.one@example.invalid', ip: '192.0.2.31', reasonKey: 'REASON_INVALID_PASSWORD' },
  { id: 'failed-demo-2', timeKey: 'TIME_ONE_HOUR', account: 'unknown-demo-account', ip: '192.0.2.32', reasonKey: 'REASON_USER_NOT_FOUND' },
  { id: 'failed-demo-3', timeKey: 'TIME_YESTERDAY', account: 'manager.two@example.invalid', ip: '192.0.2.33', reasonKey: 'REASON_TWO_FACTOR_FAILED' },
] as const;

export const ADMIN_SECURITY_BLOCKED_ACCOUNT_FIXTURES = [
  { id: 'account-demo-1', nameKey: 'DEMO_MANAGER_THREE', email: 'manager.three@example.invalid', status: 'locked', reasonKey: 'REASON_MULTIPLE_FAILED_LOGINS' },
  { id: 'account-demo-2', nameKey: 'DEMO_MANAGER_TWO', email: 'manager.two@example.invalid', status: 'active', reasonKey: 'REASON_NONE' },
] as const;

export const ADMIN_SECURITY_DEVICE_SESSION_FIXTURES = [
  { id: 'device-demo-1', managerKey: 'DEMO_MANAGER_ONE', deviceKey: 'DEVICE_WINDOWS_11_CHROME', locationKey: 'LOCATION_PUNE', ip: '192.0.2.10', dateKey: 'DATE_SEPTEMBER_10' },
  { id: 'device-demo-2', managerKey: 'DEMO_MANAGER_ONE', deviceKey: 'DEVICE_ANDROID_CHROME', locationKey: 'LOCATION_PUNE', ip: '192.0.2.11', dateKey: 'DATE_SEPTEMBER_12' },
  { id: 'device-demo-3', managerKey: 'DEMO_MANAGER_TWO', deviceKey: 'DEVICE_MAC_SAFARI', locationKey: 'LOCATION_MUMBAI', ip: '192.0.2.20', dateKey: 'DATE_SEPTEMBER_28' },
  { id: 'device-demo-4', managerKey: 'DEMO_MANAGER_FOUR', deviceKey: 'DEVICE_IPAD_SAFARI', locationKey: 'LOCATION_UNKNOWN', ip: '192.0.2.40', dateKey: 'DATE_SEPTEMBER_29' },
] as const;

export const ADMIN_SECURITY_EVENT_FIXTURES: readonly AdminSecurityEvent[] = [
  { id: 'event-demo-1', timeKey: 'TIME_TODAY_1045', actionKey: 'EVENT_PASSWORD_CHANGED', userKey: 'DEMO_MANAGER_ONE', category: 'password', tone: 'info' },
  { id: 'event-demo-2', timeKey: 'TIME_YESTERDAY_1630', actionKey: 'EVENT_ACCOUNT_LOCKED', userKey: 'DEMO_MANAGER_THREE', category: 'account', tone: 'danger' },
  { id: 'event-demo-3', timeKey: 'TIME_SEPTEMBER_28_0915', actionKey: 'EVENT_TWO_FACTOR_ENABLED', userKey: 'DEMO_MANAGER_TWO', category: '2fa', tone: 'success' },
  { id: 'event-demo-4', timeKey: 'TIME_SEPTEMBER_25_1400', actionKey: 'EVENT_FORCED_LOGOUT', userKey: 'DEMO_SYSTEM_ADMIN', category: 'session', tone: 'warning' },
] as const;

/** No handler is registered because no verified security API endpoint exists in the supplied contract. */
export const ADMIN_SECURITY_MSW_HANDLERS = [] as const;
