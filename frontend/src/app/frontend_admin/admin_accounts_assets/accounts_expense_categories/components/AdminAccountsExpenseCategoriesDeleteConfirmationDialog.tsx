// RESPONSIBILITY: AdminAccountingDeleteConfirmationDialog component owned by admin_accounting; responsibility folder: admin_accounting_delete_confirmation_dialog.
'use client';

import { useCallback } from 'react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import type { AdminAccountingDeleteConfirmationDialogProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/types/AdminAccountsExpenseCategoriesTypes';


/**
 * Confirmation surface for destructive actions within the Accounting feature.
 * Uses the global zero-business dialog primitive, while copy and mutation
 * intent remain owned by the caller. Escape/cancel closes without mutation.
 */
export default function AdminAccountingDeleteConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: AdminAccountingDeleteConfirmationDialogProps) {
  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) onCancel();
  }, [onCancel]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="space-y-4">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter>
          <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-transparent bg-danger px-4 py-2 text-body font-semibold text-on-danger hover:bg-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export type { AdminAccountingDeleteConfirmationDialogProps };
