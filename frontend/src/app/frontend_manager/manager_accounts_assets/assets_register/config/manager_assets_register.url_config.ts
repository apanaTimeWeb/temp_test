/** Canonical route configuration owned by manager assets_register. */
const ROOT = '/frontend_manager/manager_accounts_assets/assets_register' as const;

export const MANAGER_ASSETS_REGISTER_ROUTES = { root: ROOT } as const;

export const MANAGER_ASSETS_REGISTER_API = {
  LIST: '/api/v1/manager/assets/register' as const,
  CREATE: '/api/v1/manager/assets/register' as const,
  UPDATE: (id: string) => `/api/v1/manager/assets/register/${encodeURIComponent(id)}` as const,
  DELETE: (id: string) => `/api/v1/manager/assets/register/${encodeURIComponent(id)}` as const,
  EXPORT_CSV: '/api/v1/manager/assets/register/export-csv' as const,
} as const;
