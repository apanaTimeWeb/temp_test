'use client';

import '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceStyles.css';
import type { MaintenanceLogItem } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceTable';
import { Trash2 } from 'lucide-react';

interface ManagerAssetsMaintenanceDeleteDialogProps {
  pendingDeleteItem: MaintenanceLogItem | null;
  onCancel: () => void;
  onConfirmDelete: (id: number) => void;
}

export function ManagerAssetsMaintenanceDeleteDialog({
  pendingDeleteItem,
  onCancel,
  onConfirmDelete,
}: ManagerAssetsMaintenanceDeleteDialogProps) {
  if (!pendingDeleteItem) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs motion-safe:animate-in fade-in motion-safe:duration-fast"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 border border-rose-500/30 flex items-center justify-center shrink-0">
            <Trash2 size={20} />
          </div>
          <div>
            <h3 id="delete-confirm-title" className="text-sm font-bold text-primary">Delete Maintenance Ticket</h3>
            <p className="text-xs text-secondary mt-0.5 truncate max-w-[200px]">
              #{pendingDeleteItem.id} — {pendingDeleteItem.assetName}
            </p>
          </div>
        </div>
        <p className="text-xs text-secondary leading-relaxed">
          Are you sure you want to remove this maintenance ticket? This action will remove it from the active service register.
        </p>
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirmDelete(pendingDeleteItem.id)}
            className="mm-btn-glow-danger px-4 py-1.5 rounded-xl text-white text-xs font-semibold border hover:opacity-95 motion-safe:transition-all cursor-pointer"
          >
            Delete Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
