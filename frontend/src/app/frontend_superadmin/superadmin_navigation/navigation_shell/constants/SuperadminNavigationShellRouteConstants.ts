// RESPONSIBILITY: Define stable module-owned constants for navigation shell; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellRouteConstants.ts -> typed constants -> component/hook/config behavior.
/** Stable module-owned route protection contract. This is a client-side UX guard, not server authorization. */
export const SUPERADMIN_NAVIGATION_PROTECTED_ROUTE_PREFIXES = ['/superadmin', '/frontend_superadmin'] as const;

/** Matches public aliases and direct filesystem-backed App Router paths without matching similarly prefixed routes. */
export function isSuperadminProtectedPath(pathname: string): boolean {
  return SUPERADMIN_NAVIGATION_PROTECTED_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
