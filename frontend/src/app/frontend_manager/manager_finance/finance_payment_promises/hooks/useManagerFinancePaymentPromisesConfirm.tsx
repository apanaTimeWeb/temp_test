'use client';

import { useCallback, useId, useRef, useState } from 'react';
import { useManagerPaymentPromisesDialogFocus } from '@/app/frontend_manager/manager_finance/finance_payment_promises/hooks/ManagerFinancePaymentPromisesDialogFocus';

export interface PaymentPromisesPendingConfirmation {
  message: string;
  cancelLabel: string;
  continueLabel: string;
  resolve: (value: boolean) => void;
}

/** Module-owned accessible confirmation dialog for payment promise operations. */
export function useManagerFinancePaymentPromisesConfirm() {
  const [pending, setPending] = useState<PaymentPromisesPendingConfirmation | null>(null);
  const pendingRef = useRef<PaymentPromisesPendingConfirmation | null>(null);
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

  useManagerPaymentPromisesDialogFocus(dialogRef, () => settle(false), Boolean(pending));

  const dialog = pending ? (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"
      data-testid="manager-finance-payment-promises-confirm-overlay"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-xl border border-border bg-overlay p-6 shadow-dialog space-y-4"
      >
        <h2 id={titleId} className="text-base font-bold text-foreground">
          {pending.message}
        </h2>
        <p className="text-xs text-secondary">
          This will update the financial commitment record to fulfilled in your active session.
        </p>
        <div className="flex flex-col-reverse justify-end gap-2.5 sm:flex-row pt-2">
          <button
            type="button"
            className="mgr-btn-ghost text-xs"
            onClick={() => settle(false)}
            data-testid="manager-finance-payment-promises-confirm-cancel"
          >
            {pending.cancelLabel}
          </button>
          <button
            type="button"
            className="mgr-btn-primary text-xs"
            onClick={() => settle(true)}
            data-testid="manager-finance-payment-promises-confirm-continue"
          >
            {pending.continueLabel}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, dialog };
}
