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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 motion-safe:animate-fade-in"
    >
      <div
        ref={modalRef}
        className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-[#1c0810] via-[#0e0716] to-[#060810] max-w-md w-full p-6 shadow-2xl shadow-black/80 flex flex-col gap-5 text-slate-100"
      >
        <div className="flex items-start justify-between border-b border-rose-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <AlertTriangle size={24} aria-hidden="true" />
            </div>
            <div>
              <h2 id="reset-modal-title" className="text-base font-bold text-slate-100">
                Reset Global Settings?
              </h2>
              <span className="text-xs text-rose-300 font-medium">
                Action cannot be undone automatically.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-all cursor-pointer"
            aria-label="Close dialog"
            disabled={isPending}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <p id="reset-modal-desc" className="text-xs text-slate-300 leading-relaxed">
          This will revert all global setting categories (including Platform info, Branch defaults, MFA policy, Upload caps, and Retention periods) back to system factory defaults.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-rose-500/20">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-xs font-bold text-white shadow-lg shadow-rose-950/50 inline-flex items-center gap-2 transition-all cursor-pointer"
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
