/** Canonical route configuration owned by manager assets_maintenance. */
const ROOT = '/frontend_manager/manager_accounts_assets/assets_maintenance' as const;

export const MANAGER_ASSETS_MAINTENANCE_ROUTES = { root: ROOT } as const;

export const MANAGER_ASSETS_MAINTENANCE_API = {
  LIST: '/api/v1/manager/assets/maintenance' as const,
  CREATE: '/api/v1/manager/assets/maintenance' as const,
  UPDATE_STATUS: (id: string) => `/api/v1/manager/assets/maintenance/${encodeURIComponent(id)}/status` as const,
  EXPORT_CSV: '/api/v1/manager/assets/maintenance/export-csv' as const,
} as const;
