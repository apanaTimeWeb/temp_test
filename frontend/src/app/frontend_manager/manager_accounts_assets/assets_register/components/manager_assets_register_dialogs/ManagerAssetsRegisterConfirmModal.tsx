'use client';

import { useEffect, useRef } from 'react';
import { CheckCircle2, ShieldCheck, X } from 'lucide-react';
import type { ManagerAssetsRegisterAsset } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterDemoRepository';

export interface ManagerAssetsRegisterConfirmModalProps {
  isOpen: boolean;
  assetData: ManagerAssetsRegisterAsset | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ManagerAssetsRegisterConfirmModal({
  isOpen,
  assetData,
  onConfirm,
  onCancel,
}: ManagerAssetsRegisterConfirmModalProps) {
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

  if (!isOpen || !assetData) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="asset-register-confirm-title"
      aria-describedby="asset-register-confirm-desc"
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
          <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary border border-border flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 id="asset-register-confirm-title" className="text-base font-bold text-primary">
              Confirm Asset Registration
            </h2>
            <p className="text-xs text-secondary">
              Category: <span className="font-semibold text-primary">{assetData.category}</span>
            </p>
          </div>
        </div>

        <div id="asset-register-confirm-desc" className="mt-4 text-xs text-secondary space-y-2 leading-relaxed">
          <p>
            Are you sure you want to register{' '}
            <strong className="text-primary font-semibold">{assetData.name}</strong> into the branch asset register?
          </p>
          <div className="p-3 rounded-xl bg-muted border border-border text-[11px] space-y-1">
            <p><span className="text-secondary font-medium">Location:</span> <span className="text-primary font-semibold">{assetData.location}</span></p>
            <p><span className="text-secondary font-medium">Initial Status:</span> <span className="text-primary font-semibold uppercase">{assetData.status}</span></p>
          </div>
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 shadow-sm transition-all cursor-pointer"
          >
            <CheckCircle2 size={14} />
            Confirm & Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManagerAssetsRegisterConfirmModal;

