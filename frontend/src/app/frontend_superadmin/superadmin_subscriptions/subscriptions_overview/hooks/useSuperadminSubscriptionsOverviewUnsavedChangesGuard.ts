// FLOW: Feature component -> superadmin_subscriptions/subscriptions_overview/hooks/useSuperadminSubscriptionsOverviewUnsavedChangesGuard.ts -> local state/typed dependencies -> returned state and actions.
'use client';

import { useSuperadminSubscriptionsOverviewConfirm } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/hooks/useSuperadminSubscriptionsOverviewConfirm';
/** Responsibility: use Superadmin Subscriptions Unsaved Changes Guard; owns the named module state/data-flow behavior and its cleanup/recovery contract. */

import { useCallback, useEffect, useRef } from 'react';


/** Protects dirty superadmin_subscriptions forms from browser exits, same-origin Next.js Link clicks, and browser back/forward navigation. 
 * @param isDirty - Input supplied by the caller under the declared TypeScript contract.
 * @param warningMessage - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminSubscriptionsOverviewUnsavedChangesGuard(isDirty: boolean, warningMessage: string): { confirmLeave: () => Promise<boolean>; allowNavigationOnce: () => void } {
  const confirm = useSuperadminSubscriptionsOverviewConfirm();
  const navigationApprovedOnceRef = useRef(false);
  const resetApprovalTimerRef = useRef<number | undefined>(undefined);
  const currentHrefRef = useRef<string | null>(null);
  const protectedHistoryStateRef = useRef<unknown>(null);
  const protectedHistoryIndexRef = useRef<number | null>(null);
  const approveOnce = useCallback(() => {
    navigationApprovedOnceRef.current = true;
    if (resetApprovalTimerRef.current !== undefined) window.clearTimeout(resetApprovalTimerRef.current);
    resetApprovalTimerRef.current = window.setTimeout(() => {
      navigationApprovedOnceRef.current = false;
      resetApprovalTimerRef.current = undefined;
    }, 1000);
  }, []);
  const confirmLeave = useCallback(async () => {
    if (!isDirty) return true;
    if (!(await confirm(warningMessage))) return false;
    approveOnce();
    return true;
  }, [approveOnce, confirm, isDirty, warningMessage]);
  const allowNavigationOnce = approveOnce;

  // Effect contract: install browser-exit and internal-link protection only while form edits are dirty; dependency set [approveOnce, confirmLeave, isDirty] is the deliberate re-run boundary.
  useEffect(() => {
    if (!isDirty) return;
    currentHrefRef.current = window.location.href;
    protectedHistoryStateRef.current = window.history.state;
    const currentHistoryIndex = (window.history.state as { idx?: unknown } | null)?.idx;
    protectedHistoryIndexRef.current = typeof currentHistoryIndex === 'number' && Number.isSafeInteger(currentHistoryIndex) ? currentHistoryIndex : null;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (navigationApprovedOnceRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };

    const handlePopState = () => {
      const protectedHref = currentHrefRef.current;
      const attemptedHref = window.location.href;
      if (!protectedHref || attemptedHref === protectedHref) return;
      // Immediately return to the protected route while the accessible dialog is open.
      const attemptedHistoryIndex = (window.history.state as { idx?: unknown } | null)?.idx;
      const protectedHistoryIndex = protectedHistoryIndexRef.current;
      if (typeof attemptedHistoryIndex === 'number' && Number.isSafeInteger(attemptedHistoryIndex) && protectedHistoryIndex !== null && attemptedHistoryIndex !== protectedHistoryIndex) {
        // Next.js history entries with numeric indexes can be restored in either direction.
        window.history.go(protectedHistoryIndex - attemptedHistoryIndex);
      } else {
        // Unknown host history state: restore the protected URL without assuming back or forward direction.
        window.history.replaceState(protectedHistoryStateRef.current, '', protectedHref);
      }
      void confirm(warningMessage).then((approved) => {
        if (approved) {
          approveOnce();
          window.location.assign(attemptedHref);
        }
      });
    };

    const handleAnchorNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname && destination.search === window.location.search && destination.hash === window.location.hash) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      void confirm(warningMessage).then((approved) => {
        if (!approved) return;
        approveOnce();
        window.location.assign(destination.href);
      });
      return;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleAnchorNavigation, true);
    window.addEventListener('popstate', handlePopState, true);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleAnchorNavigation, true);
      window.removeEventListener('popstate', handlePopState, true);
      if (resetApprovalTimerRef.current !== undefined) {
        window.clearTimeout(resetApprovalTimerRef.current);
        resetApprovalTimerRef.current = undefined;
      }
      navigationApprovedOnceRef.current = false;
    };
  }, [approveOnce, confirm, confirmLeave, isDirty, warningMessage]);

  return { confirmLeave, allowNavigationOnce };
}
