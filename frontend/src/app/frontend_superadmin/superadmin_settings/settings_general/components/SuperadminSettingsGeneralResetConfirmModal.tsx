'use client';
/**
 * Responsibility: Modal dialog confirming destructive reset of all Global Settings to canonical platform defaults.
 * Flow: User clicks Reset -> Modal opens -> Double confirmation -> Calls onConfirm.
 */
import { useEffect, useRef } from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

interface SuperadminSettingsGeneralResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function SuperadminSettingsGeneralResetConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: SuperadminSettingsGeneralResetConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      confirmBtnRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
      aria-describedby="reset-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 motion-safe:animate-fade-in"
    >
      <div
        ref={modalRef}
        className="sa-card max-w-md w-full p-6 shadow-xl border border-border flex flex-col gap-5 bg-surface"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-danger-subtle text-danger">
              <AlertTriangle size={24} aria-hidden="true" />
            </div>
            <div>
              <h2 id="reset-modal-title" className="text-base font-bold text-primary">
                Reset Global Settings?
              </h2>
              <span className="text-xs text-secondary">
                Action cannot be undone automatically.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface-hover"
            aria-label="Close dialog"
            disabled={isPending}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <p id="reset-modal-desc" className="text-xs text-secondary leading-relaxed">
          This will revert all 11 global setting categories (including Platform info, Branch defaults, MFA policy, Upload caps, and Retention periods) back to factory system defaults.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="sa-btn-secondary text-xs px-4 py-2"
          >
            Cancel
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="sa-btn-danger text-xs px-4 py-2 inline-flex items-center gap-2"
            data-testid="settings-reset-modal-confirm-btn"
          >
            <RotateCcw size={14} className={isPending ? 'animate-spin' : ''} aria-hidden="true" />
            <span>{isPending ? 'Resetting...' : 'Yes, Reset All Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
