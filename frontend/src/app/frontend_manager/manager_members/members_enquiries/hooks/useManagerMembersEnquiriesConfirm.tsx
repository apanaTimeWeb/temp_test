'use client';

import { useCallback, useId, useRef, useState } from 'react';
import { useManagerEnquiriesDialogFocus } from '@/app/frontend_manager/manager_members/members_enquiries/hooks/ManagerMembersEnquiriesDialogFocus.ts';
import type { PendingConfirmation } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';



/** Feature-owned accessible confirmation UI; does not depend on host/global dialog state. */
export function useManagerMembersEnquiriesConfirm() {
  const [pending, setPending] = useState<PendingConfirmation | null>(null);
  const pendingRef = useRef<PendingConfirmation | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const settle = useCallback((confirmed: boolean) => {
    const current = pendingRef.current;
    if (!current) return;
    pendingRef.current = null;
    setPending(null);
    current.resolve(confirmed);
  }, []);

  const confirm = useCallback((message: string, cancelLabel: string, continueLabel: string): Promise<boolean> => {
    if (pendingRef.current) return Promise.resolve(false);
    return new Promise<boolean>((resolve) => {
      const next = { message, cancelLabel, continueLabel, resolve };
      pendingRef.current = next;
      setPending(next);
    });
  }, []);

  useManagerEnquiriesDialogFocus(dialogRef, () => settle(false), Boolean(pending));

  const dialog = pending ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="managermembersenquiries-unsaved-confirm-overlay">
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-xl border border-border bg-overlay p-6 shadow-dialog"
      >
        <h2 id={titleId} className="text-lg font-semibold text-foreground">{pending.message}</h2>
        <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button type="button" className="mgr-btn-ghost" onClick={() => settle(false)} data-testid="managermembersenquiries-unsaved-confirm-cancel">{pending.cancelLabel}</button>
          <button type="button" className="mgr-btn-primary" onClick={() => settle(true)} data-testid="managermembersenquiries-unsaved-confirm-continue">{pending.continueLabel}</button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, dialog };
}
