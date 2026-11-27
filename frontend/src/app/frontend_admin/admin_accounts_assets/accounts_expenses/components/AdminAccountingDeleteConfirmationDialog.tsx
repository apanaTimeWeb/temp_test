'use client';

import type { AdminAccountingDeleteConfirmationDialogProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { useCallback } from 'react';

export function AdminAccountingDeleteConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: AdminAccountingDeleteConfirmationDialogProps) {
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) onCancel();
    },
    [onCancel]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm font-medium bg-card text-text-secondary cursor-pointer hover:bg-surface-hover motion-safe:transition-colors"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-danger px-3 py-2 text-sm font-medium bg-danger-bg text-danger-text cursor-pointer hover:opacity-90 motion-safe:transition-opacity"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default AdminAccountingDeleteConfirmationDialog;
