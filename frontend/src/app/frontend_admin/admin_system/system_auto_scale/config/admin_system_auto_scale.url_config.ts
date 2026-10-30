/** Canonical route contract. The supplied source does not establish a verified auto-scale API endpoint. */
export const ADMIN_SYSTEM_AUTO_SCALE_ROUTES = { ROOT: '/admin/admin_system/system_auto_scale' } as const;
export const ADMIN_SYSTEM_AUTO_SCALE_API = {} as const;
export const ADMIN_SYSTEM_AUTO_SCALE_CANONICAL_ROUTE = ADMIN_SYSTEM_AUTO_SCALE_ROUTES.ROOT;
export { MODULE_URLS } from '@/app/frontend_admin/admin_system/system_auto_scale/config/admin_system_auto_scale_system_url_config_source_routes';
