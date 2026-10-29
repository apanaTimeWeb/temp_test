'use client';
import { useEffect, useRef } from 'react';
type ManagerUnsavedConfirm = (message: string, cancelLabel: string, continueLabel: string) => Promise<boolean>;
type ManagerUnsavedRouter = { push: (href: string) => void };
type ManagerUnsavedTranslator = (key: 'confirm_leave_with_unsaved_changes' | 'cancel' | 'continue') => string;
interface ManagerMembersEnquiriesUnsavedChangesGuardOptions { isDirty: boolean; confirm: ManagerUnsavedConfirm; router: ManagerUnsavedRouter; tManagerUi: ManagerUnsavedTranslator; }
/** Protects dirty drafts from browser exits and same-origin anchor navigation. */
export function useManagerMembersEnquiriesUnsavedChangesGuard({ isDirty, confirm, router, tManagerUi }: ManagerMembersEnquiriesUnsavedChangesGuardOptions): void {
  const bypassAnchorRef = useRef<HTMLAnchorElement | null>(null);
  // Dependency rationale: attach listeners only for dirty drafts; the confirmation callback, router, and translator determine navigation behavior and must be current.
  useEffect(() => {
    if (!isDirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    const guardLinks = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === '_blank' || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.href === window.location.href) return;
      event.preventDefault(); event.stopPropagation();
      void confirm(tManagerUi('confirm_leave_with_unsaved_changes'), tManagerUi('cancel'), tManagerUi('continue')).then((confirmed) => {
        if (confirmed) router.push(`${destination.pathname}${destination.search}${destination.hash}`);
      });
    };
    window.addEventListener('beforeunload', beforeUnload);
    document.addEventListener('click', guardLinks, true);
    return () => { window.removeEventListener('beforeunload', beforeUnload); document.removeEventListener('click', guardLinks, true); bypassAnchorRef.current = null; };
  }, [isDirty, confirm, router, tManagerUi]);
}
