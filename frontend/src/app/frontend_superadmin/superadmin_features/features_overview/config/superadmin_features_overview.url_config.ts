// RESPONSIBILITY: URL configurations and endpoint paths for SuperAdmin Feature & Module Control.

export const SUPERADMIN_FEATURES_URL_CONFIG = Object.freeze({
  PAGE_ROUTE: '/superadmin/superadmin_features/features_overview',
  API_ROUTES: {
    PLATFORM_MODULES: '/api/v1/superadmin/features/platform-defaults',
    TENANT_OVERRIDES: '/api/v1/superadmin/features/tenant-overrides',
    SIMULATE_API_GUARD: '/api/v1/superadmin/features/simulate-api-guard',
  },
  TENANTS_API: '/api/v1/superadmin/tenants',
});
