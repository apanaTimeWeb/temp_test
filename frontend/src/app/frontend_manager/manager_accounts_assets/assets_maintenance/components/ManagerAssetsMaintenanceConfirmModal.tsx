'use client';

import { useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle2, Wrench, X } from 'lucide-react';
import type { MaintenanceLogItem } from './ManagerAssetsMaintenanceTable';

export interface ManagerAssetsMaintenanceConfirmModalProps {
  isOpen: boolean;
  logItem: MaintenanceLogItem | null;
  nextStatus: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ManagerAssetsMaintenanceConfirmModal({
  isOpen,
  logItem,
  nextStatus,
  onConfirm,
  onCancel,
}: ManagerAssetsMaintenanceConfirmModalProps) {
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

  if (!isOpen || !logItem || !nextStatus) return null;

  const isCompleting = nextStatus === 'completed';
  const actionTitle = isCompleting ? 'Complete Maintenance Order' : 'Start Maintenance Work';

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="maintenance-confirm-title"
      aria-describedby="maintenance-confirm-desc"
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
          <div
            className={`w-10 h-10 rounded-xl border border-border flex items-center justify-center shrink-0 ${
              isCompleting ? 'bg-success-bg text-success' : 'bg-primary-subtle text-primary'
            }`}
          >
            {isCompleting ? <CheckCircle2 size={20} /> : <Wrench size={20} />}
          </div>
          <div>
            <h2 id="maintenance-confirm-title" className="text-base font-bold text-primary">
              {actionTitle}
            </h2>
            <p className="text-xs text-secondary">
              Asset: <span className="font-semibold text-primary">{logItem.assetName}</span>
            </p>
          </div>
        </div>

        <div id="maintenance-confirm-desc" className="mt-4 text-xs text-secondary space-y-2 leading-relaxed">
          <p>
            Are you sure you want to transition this work order from{' '}
            <strong className="text-primary uppercase">{logItem.status}</strong> to{' '}
            <strong className="text-primary uppercase">{nextStatus}</strong>?
          </p>
          <div className="p-3 rounded-xl bg-muted border border-border text-[11px] space-y-1">
            <p><span className="text-secondary font-medium">Issue:</span> <span className="text-primary font-semibold">{logItem.issue}</span></p>
            <p><span className="text-secondary font-medium">Vendor:</span> <span className="text-primary font-semibold">{logItem.vendor}</span></p>
          </div>
          <p className="text-warning flex items-center gap-1 text-[11px]">
            <AlertCircle size={13} /> This status update records work progress for this branch session.
          </p>
        </div>

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
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold hover:opacity-90 shadow-sm transition-all cursor-pointer ${
              isCompleting ? 'bg-success' : 'bg-primary'
            }`}
          >
            {isCompleting ? <CheckCircle2 size={14} /> : <Wrench size={14} />}
            Confirm & Advance
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManagerAssetsMaintenanceConfirmModal;

