'use client';

import { AlertCircle,CheckCircle2,Wrench,X } from 'lucide-react';
import { useEffect,useRef } from 'react';
import type { MaintenanceLogItem } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceTable';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
              isCompleting
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-sky-500/15 text-sky-400 border-sky-500/30'
            }`}
          >
            {isCompleting ? <CheckCircle2 size={22} /> : <Wrench size={22} />}
          </div>
          <div>
            <h2 id="maintenance-confirm-title" className="text-base font-bold text-primary">
              {actionTitle}
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              Asset: <span className="font-semibold text-primary">{logItem.assetName}</span>
            </p>
          </div>
        </div>

        <div id="maintenance-confirm-desc" className="mt-3 text-xs text-secondary space-y-2.5 leading-relaxed">
          <p>
            Are you sure you want to transition this work order from{' '}
            <strong className="text-primary uppercase">{logItem.status}</strong> to{' '}
            <strong className="text-primary uppercase">{nextStatus}</strong>?
          </p>
          <div className="p-3 rounded-xl bg-surface-highlight/70 border border-border text-[11px] space-y-1">
            <p>
              <span className="text-secondary font-medium">Issue:</span>{' '}
              <span className="text-primary font-semibold">{logItem.issue}</span>
            </p>
            <p>
              <span className="text-secondary font-medium">Vendor:</span>{' '}
              <span className="text-primary font-semibold">{logItem.vendor}</span>
            </p>
          </div>
          <p className="text-amber-400 flex items-center gap-1.5 text-[11px] font-medium">
            <AlertCircle size={14} className="shrink-0" /> Status update will be recorded and updated across the maintenance ledger.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            style={{
              boxShadow: isCompleting
                ? '0 0 16px rgba(16, 185, 129, 0.45)'
                : '0 0 16px rgba(14, 165, 233, 0.45)',
              backgroundColor: isCompleting ? '#10b981' : '#0ea5e9',
              borderColor: isCompleting ? '#34d399' : '#38bdf8',
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold hover:opacity-95 transition-all cursor-pointer border"
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
