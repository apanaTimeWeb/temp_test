'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

export interface ManagerAccountsDailySettlementConfirmModalProps {
  isOpen: boolean;
  shiftName: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ManagerAccountsDailySettlementConfirmModal({
  isOpen,
  shiftName,
  onConfirm,
  onCancel,
}: ManagerAccountsDailySettlementConfirmModalProps) {
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    confirmBtnRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen || !shiftName) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="settlement-confirm-title"
      aria-describedby="settlement-confirm-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 p-1 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning-bg text-warning border border-border flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 id="settlement-confirm-title" className="text-base font-bold text-primary">
              Confirm Shift Settlement
            </h2>
            <p className="text-xs text-secondary">
              Shift: <span className="font-semibold text-primary">{shiftName}</span>
            </p>
          </div>
        </div>

        <p id="settlement-confirm-desc" className="mt-4 text-xs text-secondary leading-relaxed">
          Are you sure you want to finalize and settle <strong className="text-primary font-semibold">{shiftName}</strong>?
          This marks physical cash drawer verification as completed and closes register discrepancies for this shift. This session action cannot be undone.
        </p>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-success text-white text-xs font-semibold hover:opacity-90 shadow-sm transition-all cursor-pointer"
          >
            <CheckCircle2 size={14} />
            Confirm Settlement
          </button>
        </div>
      </div>
    </div>
  );
}
export default ManagerAccountsDailySettlementConfirmModal;

