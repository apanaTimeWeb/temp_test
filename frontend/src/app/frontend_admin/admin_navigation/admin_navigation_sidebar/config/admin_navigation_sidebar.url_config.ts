import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

/** Canonical route contract for the admin navigation sidebar. Existing nine domain destinations are unchanged. */
export const ADMIN_ADMIN_NAVIGATION_SIDEBAR_ROUTES = {
  DASHBOARD: ADMIN_ROUTES.DASHBOARD,
  MEMBERS: ADMIN_ROUTES.MEMBERS,
  SEATS_SHIFTS_LOCKERS: ADMIN_ROUTES.SEATS_SHIFTS_LOCKERS,
  FINANCE: ADMIN_ROUTES.FINANCE,
  ACCOUNTS_ASSETS: ADMIN_ROUTES.ACCOUNTS_ASSETS,
  STAFF: ADMIN_ROUTES.STAFF,
  SYSTEM: ADMIN_ROUTES.SYSTEM,
  COMMUNICATION: ADMIN_ROUTES.COMMUNICATION,
  SETTINGS: ADMIN_ROUTES.SETTINGS,
} as const;

/** Compatibility name retained for current navigation consumers; values remain owned here. */
export const ADMIN_NAVIGATION_URLS = ADMIN_ADMIN_NAVIGATION_SIDEBAR_ROUTES;

/** Canonical role/submodule API contract; this navigation-only module has no verified API operation. */
export const ADMIN_ADMIN_NAVIGATION_SIDEBAR_API = {
  CONTRACT_MISSING: null as string | null,
} as const;

export const MODULE_URLS = ADMIN_ADMIN_NAVIGATION_SIDEBAR_ROUTES;
