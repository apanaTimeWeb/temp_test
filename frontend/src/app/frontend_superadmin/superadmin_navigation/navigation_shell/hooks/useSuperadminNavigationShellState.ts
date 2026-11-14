// RESPONSIBILITY: Own module-local state or interaction logic for navigation shell; it does not imply persistence beyond verified contracts.
// FLOW: Feature component -> superadmin_navigation/navigation_shell/hooks/useSuperadminNavigationShellState.ts -> local state/typed dependencies -> returned state and actions.
'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { SUPERADMIN_NAVIGATION_SHELL_ROUTES as __SUPERADMIN_NAVIGATION_SHELL_ROUTES } from "@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_shell.url_config";
import { isSuperadminProtectedPath } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellRouteConstants';
import { readSuperadminNavigationDensity, writeSuperadminNavigationDensity, type SuperadminNavigationDensity } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/utils/SuperadminNavigationShellDensityStorage';

/** Owns route verification, density preference hydration, and accessible mobile-navigation lifecycle for the shell. 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminNavigationShellState() {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [verifiedPath, setVerifiedPath] = useState<string | null>(null);
  const [density, setDensity] = useState<SuperadminNavigationDensity>('comfortable');
  const [densityHydrated, setDensityHydrated] = useState(false);
  const isSuperadminRoute = isSuperadminProtectedPath(pathname);

  // Keep the off-canvas sidebar out of the accessibility tree only on viewport sizes where it is visually hidden.
  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const updateViewport = () => setIsMobileViewport(media.matches);
    updateViewport();
    media.addEventListener('change', updateViewport);
    return () => media.removeEventListener('change', updateViewport);
  }, []);

  // Effect contract: hydrate the versioned, non-sensitive density preference after mount to avoid server/client storage mismatches.
  useEffect(() => {
    setDensity(readSuperadminNavigationDensity());
    setDensityHydrated(true);
  }, []);

  // Effect contract: persist density only after the stored preference has been read, preventing the initial default from overwriting saved state.
  useEffect(() => {
    if (!densityHydrated) return;
    writeSuperadminNavigationDensity(density);
  }, [density, densityHydrated]);

  // Effect contract: verify the current client session/role for the route and redirect to the existing login/forbidden routes on failure.
  useEffect(() => {
    if (!isSuperadminRoute) return;
    setVerifiedPath(null);
    const user = getCurrentUser();
    if (!user) {
      router.replace(`${__SUPERADMIN_NAVIGATION_SHELL_ROUTES.SUPERADMIN_NAVIGATION_URLS.AUTH_LOGIN}?returnTo=${encodeURIComponent(pathname)}&reason=unauthenticated`);
      return;
    }
    if (user.role !== 'superadmin') {
      router.replace(__SUPERADMIN_NAVIGATION_SHELL_ROUTES.SUPERADMIN_NAVIGATION_URLS.FORBIDDEN);
      return;
    }
    setVerifiedPath(pathname);
  }, [pathname, isSuperadminRoute, router]);

  // Effect contract: trap keyboard focus in the open mobile navigation and restore the previously focused element on close.
  useEffect(() => {
    if (!sidebarOpen || !isMobileViewport) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const getFocusableNavigationControls = () => Array.from<HTMLElement>(
      document.querySelectorAll<HTMLElement>('#superadmin-navigation-sidebar a[href], #superadmin-navigation-sidebar button:not([disabled]), #superadmin-navigation-sidebar [tabindex]:not([tabindex="-1"])'),
    ).filter((element) => element.getAttribute('aria-hidden') !== 'true');
    getFocusableNavigationControls()[0]?.focus();
    const handleSidebarKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setSidebarOpen(false); return; }
      if (event.key !== 'Tab') return;
      const controls = getFocusableNavigationControls();
      const first = controls[0]; const last = controls[controls.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleSidebarKeyDown);
    return () => { document.removeEventListener('keydown', handleSidebarKeyDown); if (previouslyFocused?.isConnected) previouslyFocused.focus(); };
  }, [sidebarOpen, isMobileViewport]);

  return { pathname, router, sidebarOpen, setSidebarOpen, isMobileViewport, verifiedPath, density, setDensity, isSuperadminRoute };
}
