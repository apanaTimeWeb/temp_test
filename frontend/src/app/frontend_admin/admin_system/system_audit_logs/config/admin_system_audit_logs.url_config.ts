

/** Canonical route/API contracts retain the exact paths already used by the supplied source. */
export const ADMIN_SYSTEM_AUDIT_LOGS_ROUTES = {
  ROOT: '/admin/admin_system/system_audit_logs',
  DETAIL: (id: string) => `/admin/admin_system/system_audit_logs/${id}`,
} as const;
export const ADMIN_SYSTEM_AUDIT_LOGS_API = {
  LIST: '/admin/admin_system/system_audit_logs',
  DETAIL: (id: string) => `/admin/admin_system/system_audit_logs/${id}`,
} as const;
export const ADMIN_SYSTEM_AUDIT_LOGS_CANONICAL_ROUTE = ADMIN_SYSTEM_AUDIT_LOGS_ROUTES.ROOT;
export const ADMIN_AUDIT_LOGS_ROOT = ADMIN_SYSTEM_AUDIT_LOGS_ROUTES.ROOT;
export const ADMIN_AUDIT_LOGS_DETAIL = ADMIN_SYSTEM_AUDIT_LOGS_ROUTES.DETAIL;
export const ADMIN_AUDIT_LOGS_API_LIST = ADMIN_SYSTEM_AUDIT_LOGS_API.LIST;
export const ADMIN_AUDIT_LOGS_API_DETAIL = ADMIN_SYSTEM_AUDIT_LOGS_API.DETAIL;
export const ADMIN_AUDIT_LOGS_URLS = { ROOT: ADMIN_AUDIT_LOGS_ROOT, DETAIL: ADMIN_AUDIT_LOGS_DETAIL, LIST: ADMIN_AUDIT_LOGS_API_LIST, API_DETAIL: ADMIN_AUDIT_LOGS_API_DETAIL } as const;
export const MODULE_URLS = ADMIN_AUDIT_LOGS_URLS;

/** Canonical domain severity values from the current frontend response contract. */
export const ADMIN_AUDIT_LOGS_SEVERITY_VALUES = ['danger', 'warning', 'info', 'success'] as const;
export const ADMIN_AUDIT_LOGS_FILTERS = ['all', ...ADMIN_AUDIT_LOGS_SEVERITY_VALUES, 'unknown'] as const;
