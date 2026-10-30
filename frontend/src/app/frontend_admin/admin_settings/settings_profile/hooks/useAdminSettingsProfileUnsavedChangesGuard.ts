'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * RESPONSIBILITY: Protect dirty profile drafts from browser exits, eligible links, and history back/forward.
 * DATA FLOW: RHF dirty state -> guard -> localized confirmation callback -> explicit router navigation.
 *
 * Next.js App Router does not expose a public route-blocker event. For browser history traversal, the
 * guard stops the first popstate before the router's bubble listener, restores the current entry by
 * advancing to the known stable URL, then asks the owning page to confirm the captured destination.
 * Confirmed navigation is performed by the owning page after it clears dirty state.
 */
export default function useAdminSettingsProfileUnsavedChangesGuard(
  isDirty: boolean,
  onBlockedNavigation: (href: string) => void,
): void {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastStableHrefRef = useRef<string | null>(null);
  const pendingPopDestinationRef = useRef<string | null>(null);

  useEffect(() => {
    const getCurrentHref = () => `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const currentRouteHref = getCurrentHref();

    if (!isDirty) {
      lastStableHrefRef.current = currentRouteHref;
      pendingPopDestinationRef.current = null;
      return;
    }

    if (lastStableHrefRef.current === null) lastStableHrefRef.current = currentRouteHref;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download') || anchor.getAttribute('aria-disabled') === 'true') return;

      let destination: URL;
      try { destination = new URL(anchor.href, window.location.href); } catch { return; }
      if (destination.origin !== window.location.origin) return;
      const current = getCurrentHref();
      const next = `${destination.pathname}${destination.search}${destination.hash}`;
      if (next === current) return;

      event.preventDefault();
      event.stopPropagation();
      onBlockedNavigation(next);
    };

    const handlePopState = (event: PopStateEvent) => {
      const destination = getCurrentHref();
      const stableHref = lastStableHrefRef.current;

      // The browser has returned to the previously active entry. Keep that entry active and surface
      // the originally requested destination only after the current URL has been restored.
      if (pendingPopDestinationRef.current !== null) {
        if (stableHref !== null && destination === stableHref) {
          const blockedDestination = pendingPopDestinationRef.current;
          pendingPopDestinationRef.current = null;
          onBlockedNavigation(blockedDestination);
          return;
        }
        event.stopImmediatePropagation();
        return;
      }

      if (stableHref === null || destination === stableHref) return;
      event.stopImmediatePropagation();
      pendingPopDestinationRef.current = destination;
      window.history.forward();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleDocumentClick, true);
    // Capture phase is intentional: prevent Next.js' bubble-phase popstate handler from leaving
    // the dirty page before the confirmation dialog has been shown.
    window.addEventListener('popstate', handlePopState, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleDocumentClick, true);
      window.removeEventListener('popstate', handlePopState, true);
    };
  }, [isDirty, onBlockedNavigation, pathname, searchParams]);
}
