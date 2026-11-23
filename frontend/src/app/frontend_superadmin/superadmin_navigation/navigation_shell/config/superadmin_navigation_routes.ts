// RESPONSIBILITY: Provide the navigation shell with a local, stable registry of verified public route literals.
// FLOW: Navigation registry -> route links/redirects; values were verified against owning URL config constants to avoid cross-leaf imports.

import { SUPERADMIN_NAVIGATION_CORE_ROUTES } from './superadmin_navigation_core_routes';
import { SUPERADMIN_NAVIGATION_EXTENDED_ROUTES } from './superadmin_navigation_extended_routes';

export const SUPERADMIN_NAVIGATION_ROUTES = {
  ...SUPERADMIN_NAVIGATION_CORE_ROUTES,
  ...SUPERADMIN_NAVIGATION_EXTENDED_ROUTES,
} as const;

/**
 * Defines the public SuperadminNavigationRouteKey contract for the Superadmin navigation shell. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminNavigationRouteKey = keyof typeof SUPERADMIN_NAVIGATION_ROUTES;
