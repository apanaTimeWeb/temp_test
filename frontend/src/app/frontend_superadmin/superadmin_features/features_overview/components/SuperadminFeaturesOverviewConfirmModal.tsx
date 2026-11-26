// RESPONSIBILITY: Safe non-blocking modal dialog replacing raw browser dialogs (window.confirm).
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { ConfirmDialogState } from '@/app/frontend_superadmin/superadmin_features/features_overview/hooks/useSuperadminFeaturesOverviewConfirm';
import { useModalScrollLock } from '@/lib/useModalScrollLock';

interface ConfirmModalProps {
  dialogState: ConfirmDialogState;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SuperadminFeaturesOverviewConfirmModal({
  dialogState,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useModalScrollLock(dialogState.isOpen);

  if (!dialogState.isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-hidden animate-in fade-in motion-safe:duration-150"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-indigo-500/30 bg-[#0a0d24] text-white shadow-2xl shadow-indigo-950/80 p-6 space-y-4 animate-in zoom-in-95 motion-safe:duration-150"
      >
        <div className="flex items-start gap-3.5">
          <span
            className={`p-3 rounded-2xl shrink-0 ${
              dialogState.isDestructive
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-xs'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-xs'
            }`}
          >
            <AlertTriangle size={22} />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white tracking-tight">{dialogState.title}</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {dialogState.message}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close confirmation dialog"
            className="text-slate-400 hover:text-white p-1 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-indigo-500/20">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {dialogState.cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white motion-safe:transition-all shadow-md cursor-pointer active:scale-95 ${
              dialogState.isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/25'
                : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/25'
            }`}
          >
            {dialogState.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}