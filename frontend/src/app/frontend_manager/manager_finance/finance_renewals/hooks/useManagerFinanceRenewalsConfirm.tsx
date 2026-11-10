'use client';

import { useCallback, useId, useRef, useState } from 'react';
import { useManagerRenewalsDialogFocus } from '@/app/frontend_manager/manager_finance/finance_renewals/hooks/ManagerFinanceRenewalsDialogFocus';

export interface RenewalsPendingConfirmation {
  message: string;
  cancelLabel: string;
  continueLabel: string;
  resolve: (value: boolean) => void;
}

/** Module-owned accessible confirmation dialog for renewals operations. */
export function useManagerFinanceRenewalsConfirm() {
  const [pending, setPending] = useState<RenewalsPendingConfirmation | null>(null);
  const pendingRef = useRef<RenewalsPendingConfirmation | null>(null);
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

  useManagerRenewalsDialogFocus(dialogRef, () => settle(false), Boolean(pending));

  const dialog = pending ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" data-testid="manager-finance-renewals-confirm-overlay">
      <div ref={dialogRef} tabIndex={-1} role="alertdialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-md rounded-xl border border-border bg-overlay p-6 shadow-dialog">
        <h2 id={titleId} className="text-lg font-semibold text-foreground">{pending.message}</h2>
        <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button type="button" className="mgr-btn-ghost" onClick={() => settle(false)} data-testid="manager-finance-renewals-confirm-cancel">{pending.cancelLabel}</button>
          <button type="button" className="mgr-btn-primary" onClick={() => settle(true)} data-testid="manager-finance-renewals-confirm-continue">{pending.continueLabel}</button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, dialog };
}

