// RESPONSIBILITY: Safe non-blocking modal dialog replacing raw browser dialogs (window.confirm).
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { ConfirmDialogState } from '@/app/frontend_superadmin/superadmin_features/features_overview/hooks/useSuperadminFeaturesOverviewConfirm';

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
  if (!dialogState.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-start gap-3">
          <span
            className={`p-2.5 rounded-xl shrink-0 ${
              dialogState.isDestructive
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
            }`}
          >
            <AlertTriangle size={20} />
          </span>
          <div className="flex-1">
            <h3 className="text-base font-bold text-white">{dialogState.title}</h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              {dialogState.message}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-neutral-400 hover:text-white p-1 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-lg border border-border bg-input text-neutral-300 text-xs font-medium hover:bg-neutral-800 transition-colors"
          >
            {dialogState.cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors ${
              dialogState.isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-teal-500 hover:bg-teal-600'
            }`}
          >
            {dialogState.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
