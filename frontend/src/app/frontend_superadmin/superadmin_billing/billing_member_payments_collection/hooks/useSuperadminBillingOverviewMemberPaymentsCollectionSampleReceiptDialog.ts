// RESPONSIBILITY: Own module-local state or interaction logic for billing member payments collection; it does not imply persistence beyond verified contracts.
// FLOW: Feature component -> superadmin_billing/billing_member_payments_collection/hooks/useSuperadminBillingOverviewMemberPaymentsCollectionSampleReceiptDialog.ts -> local state/typed dependencies -> returned state and actions.
'use client';
import { useEffect, useRef } from 'react';

/**
 * Owns keyboard dismissal, focus containment, and focus restoration for the sample receipt dialog.
 * The dialog component mounts only while open, so mount/unmount is the lifecycle boundary.
 
 * @param onClose - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminBillingOverviewMemberPaymentsCollectionSampleReceiptDialog(onClose: () => void) {
  const dialogRef = useRef<HTMLSectionElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Effect contract: move focus into the modal, contain Tab navigation, dismiss on Escape, and restore focus on unmount.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const selector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusable = () => Array.from<HTMLElement>(dialog.querySelectorAll<HTMLElement>(selector))
      .filter((element) => element.offsetParent !== null);

    (getFocusable()[0] ?? dialog).focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  return dialogRef;
}
