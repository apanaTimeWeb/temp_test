'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { PendingConfirmation } from '@/app/frontend_manager/manager_settings/settings_help_support/types/ManagerSettingsHelpSupportComponentTypes';



/** Settings Help & Support-owned confirmation dialog for unsaved ticket drafts. */
export function useManagerSettingsHelpSupportConfirm() {
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

  // Dependency rationale: while a confirmation is pending, move focus into the dialog, trap keyboard navigation, and restore focus when it closes; settle/dialog state controls the listeners.
  useEffect(() => {
    if (!pending) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const getFocusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    (getFocusable()[0] ?? dialog).focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); settle(false); return; }
      if (event.key !== 'Tab') return;
      const items = getFocusable();
      if (!items.length) { event.preventDefault(); dialog.focus(); return; }
      const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [pending, settle]);

  const dialog = pending ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="manager-help-support-unsaved-confirm-overlay">
      <div ref={dialogRef} tabIndex={-1} role="alertdialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-md rounded-xl border border-border bg-overlay p-6 shadow-dialog">
        <h2 id={titleId} className="text-lg font-semibold text-foreground">{pending.message}</h2>
        <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button type="button" className="mgr-btn-secondary" onClick={() => settle(false)} data-testid="manager-help-support-unsaved-confirm-cancel">{pending.cancelLabel}</button>
          <button type="button" className="mgr-btn-primary" onClick={() => settle(true)} data-testid="manager-help-support-unsaved-confirm-continue">{pending.continueLabel}</button>
        </div>
      </div>
    </div>
  ) : null;
  return { confirm, dialog };
}
