// Responsibility: useAdminMembersBlacklistUnsavedChangesGuard; module-local guard for dirty blacklist drafts.
'use client';

import { useEffect } from 'react';

/** Blocks browser exits and delegates same-origin links to the blacklist dialog's confirmation UI. */
export default function useAdminMembersBlacklistUnsavedChangesGuard(
  isDirty: boolean,
  isSubmitting = false,
  onBlockedNavigation?: (href: string) => void,
): void {
  useEffect(() => {
    if (!isDirty || isSubmitting) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.href === window.location.href) return;
      event.preventDefault();
      event.stopPropagation();
      onBlockedNavigation?.(`${destination.pathname}${destination.search}${destination.hash}`);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClick, true);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isDirty, isSubmitting, onBlockedNavigation]);
}
