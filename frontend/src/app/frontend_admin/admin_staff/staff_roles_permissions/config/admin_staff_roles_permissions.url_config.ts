

/** Canonical UI route. No verified backend API endpoint was supplied for live permission data/mutations. */
export const ADMIN_STAFF_ROLES_PERMISSIONS_ROUTES = { ROOT: '/admin/admin_staff/staff_roles_permissions' } as const;
export const ADMIN_STAFF_ROLES_PERMISSIONS_API = {} as const;
export const ADMIN_STAFF_ROLES_PERMISSIONS_CANONICAL_ROUTE = ADMIN_STAFF_ROLES_PERMISSIONS_ROUTES.ROOT;
export const ADMIN_STAFF_ROLES_PERMISSIONS_ROOT = ADMIN_STAFF_ROLES_PERMISSIONS_ROUTES.ROOT;
export const ADMIN_STAFF_ROLES_PERMISSIONS_URL_CONFIG = { route: ADMIN_STAFF_ROLES_PERMISSIONS_CANONICAL_ROUTE, routes: ADMIN_STAFF_ROLES_PERMISSIONS_ROUTES, api: ADMIN_STAFF_ROLES_PERMISSIONS_API } as const;

/** Permission role identifiers and display configuration used by this feature only. */
export const ADMIN_STAFF_ROLES_PERMISSIONS_ROLES = ['manager'] as const;
export type AdminStaffRolesPermissionsRole = (typeof ADMIN_STAFF_ROLES_PERMISSIONS_ROLES)[number];
