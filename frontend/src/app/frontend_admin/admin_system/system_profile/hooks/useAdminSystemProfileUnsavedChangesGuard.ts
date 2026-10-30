'use client';
import { useEffect } from 'react';

/** Intercepts browser exits and same-origin link navigation while this submodule's form draft is dirty. */
export default function useAdminSystemProfileUnsavedChangesGuard(isDirty: boolean, onBlockedNavigation: (href: string) => void, isSubmitting = false): void {
  useEffect(() => {
    if (!isDirty || isSubmitting) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download') || anchor.getAttribute('aria-disabled') === 'true') return;
      let destination: URL;
      try { destination = new URL(anchor.href, window.location.href); } catch { return; }
      if (destination.origin !== window.location.origin) return;
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const next = `${destination.pathname}${destination.search}${destination.hash}`;
      if (next === current) return;
      event.preventDefault(); event.stopPropagation(); onBlockedNavigation(next);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleDocumentClick, true);
    return () => { window.removeEventListener('beforeunload', handleBeforeUnload); document.removeEventListener('click', handleDocumentClick, true); };
  }, [isDirty, isSubmitting, onBlockedNavigation]);
}
