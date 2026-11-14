// RESPONSIBILITY: Own module-local state or interaction logic for support complaints; it does not imply persistence beyond verified contracts.
// FLOW: Feature component -> superadmin_support/support_complaints/hooks/useSuperadminSupportComplaintsDialog.ts -> local state/typed dependencies -> returned state and actions.
'use client';
import { useEffect, useRef } from 'react';

/** Keyboard dismissal, focus trap and focus restoration for Communication dialogs. 
 * @param isOpen - Input supplied by the caller under the declared TypeScript contract.
 * @param onClose - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminSupportComplaintsDialog(isOpen: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Effect contract: manage keyboard focus, Escape/Tab behavior, and focus restoration for the active dialog or drawer; dependency set [isOpen] is the deliberate re-run boundary.
  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const selector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusable = () => Array.from<HTMLElement>(dialog?.querySelectorAll<HTMLElement>(selector) ?? []).filter((element) => element.offsetParent !== null);
    (getFocusable()[0] ?? dialog)?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onCloseRef.current(); return; }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (!focusable.length) { event.preventDefault(); dialog?.focus(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen]);

  return dialogRef;
}
