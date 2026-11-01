'use client';
import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, X } from 'lucide-react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import type { AdminAccountsExpensesRejectionModalProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';

export function AdminAccountsExpensesRejectionModal({
  expense,
  open,
  onConfirm,
  onCancel,
}: AdminAccountsExpensesRejectionModalProps) {
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSES');
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (expense) {
      setReason('');
      setError(null);
    }
  }, [expense]);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) onCancel();
  }, [onCancel]);

  if (!expense) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 5) {
      setError('Please provide a specific rejection reason (min 5 characters).');
      return;
    }
    onConfirm(expense.id, reason.trim());
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <DialogTitle>{t('REJECT_TITLE')}</DialogTitle>
            </div>
            <DialogDescription>{t('REJECT_DESCRIPTION')}</DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs space-y-1">
            <p className="font-semibold text-foreground">{expense.description}</p>
            <p className="text-muted-foreground">Branch: {expense.branchName ?? 'Main Branch'}</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="rejection-reason" className="block text-xs font-semibold text-foreground">
              {t('REJECTION_REASON')}
            </label>
            <textarea
              id="rejection-reason"
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError(null);
              }}
              required
              placeholder="e.g. Quotation too high / Item already covered under AMC / Unapproved personal item"
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            {error && <p className="text-xs text-destructive font-medium">{error}</p>}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {t('CANCEL')}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive motion-safe:transition-colors"
            >
              <X className="h-4 w-4" />
              <span>{t('REJECT')}</span>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminAccountsExpensesRejectionModal;

