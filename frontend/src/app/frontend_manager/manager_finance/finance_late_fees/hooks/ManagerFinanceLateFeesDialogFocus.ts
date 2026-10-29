'use client';

import { useEffect, useRef, type RefObject } from 'react';

/** Feature-owned modal keyboard and focus lifecycle. Runtime behavior still needs browser verification. */
export function useManagerLateFeesDialogFocus(dialogRef: RefObject<HTMLElement | null>, onClose: () => void, active: boolean | string = true) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

// Dependency rationale: focus trap exists only while the dialog is active; callback freshness is provided by onCloseRef.
  useEffect(() => {
    if (!active) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const getFocusable = (): HTMLElement[] => (Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )) as HTMLElement[]).filter((element) => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true');
    const focusables = getFocusable();
    (focusables[0] ?? dialog).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const current = getFocusable();
      if (current.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = current[0];
      const last = current[current.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  // Mount/unmount tracks the dialog lifecycle; callback is kept current via ref.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
