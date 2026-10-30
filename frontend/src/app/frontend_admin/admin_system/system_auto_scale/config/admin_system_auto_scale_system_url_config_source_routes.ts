/** Canonical route and API URL registry for admin_system. */
export const ADMIN_SYSTEM_ROOT = '/admin/admin_system' as const;
const adminSystemRoute = (view: string): string => { const routes: Record<string, string> = {
    "auto_scale": "/admin/admin_system/system_auto_scale",
    "backups": "/admin/admin_system/system_backups",
    "branding": "/admin/admin_system/system_branding",
    "bulk_import": "/admin/admin_system/system_bulk_import",
    "data_export": "/admin/admin_system/system_data_export",
    "gap_filling": "/admin/admin_system/system_gap_filling",
    "maintenance": "/admin/admin_system/system_maintenance",
    "offline": "/admin/admin_system/system_offline",
    "power_saving": "/admin/admin_system/system_power_saving",
    "profile": "/admin/admin_system/system_profile",
    "settings": "/admin/admin_system/system_settings",
    "smart_id": "/admin/admin_system/system_smart_id",
    "waitlist_automation": "/admin/admin_system/system_waitlist_automation",
    "whatsapp_integration": "/admin/admin_system/system_whatsapp_integration"
  }; return routes[view] ?? "/admin/admin_system/system_settings"; };
/** Host-owned auth destinations referenced by this feature; public feature-route rewrite remains unresolved. */
export const ADMIN_SYSTEM_AUTH_LOGIN_URL = '/auth/login' as const;
export const ADMIN_SYSTEM_ACCESS_DENIED_URL = '/403' as const;
export const ADMIN_SYSTEM_ROUTE_AUTO_SCALE = adminSystemRoute('auto_scale');
export const ADMIN_SYSTEM_ROUTE_BACKUPS = adminSystemRoute('backups');
export const ADMIN_SYSTEM_ROUTE_BRANDING = adminSystemRoute('branding');
export const ADMIN_SYSTEM_ROUTE_BULK_IMPORT = adminSystemRoute('bulk_import');
export const ADMIN_SYSTEM_ROUTE_DATA_EXPORT = adminSystemRoute('data_export');
export const ADMIN_SYSTEM_ROUTE_GAP_FILLING = adminSystemRoute('gap_filling');
export const ADMIN_SYSTEM_ROUTE_MAINTENANCE = adminSystemRoute('maintenance');
export const ADMIN_SYSTEM_ROUTE_OFFLINE = adminSystemRoute('offline');
/** Existing host dashboard destination used by the offline fallback; host resolution is verified in Batch 20. */
export const ADMIN_SYSTEM_ROUTE_DASHBOARD = '/dashboard' as const;
export const ADMIN_SYSTEM_ROUTE_POWER_SAVING = adminSystemRoute('power_saving');
/** Existing host destinations referenced by Auto Scale; host registration is not verified in this package. */
export const ADMIN_SYSTEM_ROUTE_SEAT_MANAGEMENT = '/admin/admin_seats_shifts_lockers/seats_management' as const;
export const ADMIN_SYSTEM_ROUTE_LOCKER_MATRIX = '/admin/admin_seats_shifts_lockers/lockers_matrix' as const;
export const ADMIN_SYSTEM_ROUTE_PROFILE = adminSystemRoute('profile');
export const ADMIN_SYSTEM_ROUTE_SETTINGS = adminSystemRoute('settings');
export const ADMIN_SYSTEM_ROUTE_SMART_ID = adminSystemRoute('smart_id');
export const ADMIN_SYSTEM_ROUTE_WAITLIST_AUTOMATION = adminSystemRoute('waitlist_automation');
export const ADMIN_SYSTEM_ROUTE_WHATSAPP_INTEGRATION = adminSystemRoute('whatsapp_integration');

export const ADMIN_SYSTEM_DETAIL = (id: string) => `${ ADMIN_SYSTEM_ROOT}/${id}` as const;
export const ADMIN_SYSTEM_API_LIST = '/api/v1/admin/system' as const;
export const ADMIN_SYSTEM_API_DETAIL = (id: string) => `${ ADMIN_SYSTEM_API_LIST}/${id}` as const;

export const ADMIN_SYSTEM_URLS = {
  ROOT: ADMIN_SYSTEM_ROOT,
  AUTH_LOGIN: ADMIN_SYSTEM_AUTH_LOGIN_URL,
  ACCESS_DENIED: ADMIN_SYSTEM_ACCESS_DENIED_URL,
  DETAIL: ADMIN_SYSTEM_DETAIL,
  LIST: ADMIN_SYSTEM_API_LIST,
  API_DETAIL: ADMIN_SYSTEM_API_DETAIL,
  ROUTE_AUTO_SCALE: ADMIN_SYSTEM_ROUTE_AUTO_SCALE,
  ROUTE_BACKUPS: ADMIN_SYSTEM_ROUTE_BACKUPS,
  ROUTE_BRANDING: ADMIN_SYSTEM_ROUTE_BRANDING,
  ROUTE_BULK_IMPORT: ADMIN_SYSTEM_ROUTE_BULK_IMPORT,
  ROUTE_DATA_EXPORT: ADMIN_SYSTEM_ROUTE_DATA_EXPORT,
  ROUTE_GAP_FILLING: ADMIN_SYSTEM_ROUTE_GAP_FILLING,
  ROUTE_MAINTENANCE: ADMIN_SYSTEM_ROUTE_MAINTENANCE,
  ROUTE_OFFLINE: ADMIN_SYSTEM_ROUTE_OFFLINE,
  ROUTE_DASHBOARD: ADMIN_SYSTEM_ROUTE_DASHBOARD,
  ROUTE_POWER_SAVING: ADMIN_SYSTEM_ROUTE_POWER_SAVING,
  ROUTE_SEAT_MANAGEMENT: ADMIN_SYSTEM_ROUTE_SEAT_MANAGEMENT,
  ROUTE_LOCKER_MATRIX: ADMIN_SYSTEM_ROUTE_LOCKER_MATRIX,
  ROUTE_PROFILE: ADMIN_SYSTEM_ROUTE_PROFILE,
  ROUTE_SETTINGS: ADMIN_SYSTEM_ROUTE_SETTINGS,
  ROUTE_SMART_ID: ADMIN_SYSTEM_ROUTE_SMART_ID,
  ROUTE_WAITLIST_AUTOMATION: ADMIN_SYSTEM_ROUTE_WAITLIST_AUTOMATION,
  ROUTE_WHATSAPP_INTEGRATION: ADMIN_SYSTEM_ROUTE_WHATSAPP_INTEGRATION,

} as const;

export const MODULE_URLS = ADMIN_SYSTEM_URLS;
