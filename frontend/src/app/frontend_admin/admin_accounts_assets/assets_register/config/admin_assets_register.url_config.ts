// config/admin_assets_register.url_config.ts
// Owned by: admin/admin_accounts_assets/assets_register autonomous sub-module

export const ADMIN_ASSETS_REGISTER_ROUTES = {
  root: '/admin/admin_accounts_assets/assets_register' as const,
  detail: (id: string) => `/admin/admin_accounts_assets/assets_register?view=detail&id=${encodeURIComponent(id)}` as const,
} as const;

export const ADMIN_ASSETS_REGISTER_API = {
  list: '/api/v1/admin/assets' as const,
  detail: (id: string) => `/api/v1/admin/assets/${encodeURIComponent(id)}` as const,
  create: '/api/v1/admin/assets' as const,
  updateAmc: (id: string) => `/api/v1/admin/assets/${encodeURIComponent(id)}/amc` as const,
  kpis: '/api/v1/admin/assets/kpis' as const,
} as const;

export const ADMIN_ASSET_CATEGORIES = [
  'AC_HVAC',
  'INVERTER_POWER',
  'FURNITURE',
  'WATER_PURIFIER',
  'CCTV_SECURITY',
  'NETWORK_HARDWARE',
  'ELECTRONICS',
  'OTHER',
] as const;

export const ADMIN_ASSET_STATUSES = [
  'OPERATIONAL',
  'MAINTENANCE_REQUIRED',
  'UNDER_REPAIR',
  'DISPOSED',
] as const;

export const ADMIN_ASSET_AMC_STATUSES = [
  'ACTIVE_AMC',
  'UNDER_WARRANTY',
  'EXPIRED_NO_AMC',
  'NOT_APPLICABLE',
] as const;

