'use client';
import { useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ShieldCheck, ExternalLink, Check } from 'lucide-react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/utils/AdminAccountsExpensesFormatCurrency';
import type { AdminAccountsExpensesApprovalModalProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';

export function AdminAccountsExpensesApprovalModal({
  expense,
  open,
  onConfirm,
  onCancel,
}: AdminAccountsExpensesApprovalModalProps) {
  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSES');

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) onCancel();
  }, [onCancel]);

  if (!expense) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <div className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-success" />
              <DialogTitle>{t('APPROVE_TITLE')}</DialogTitle>
            </div>
            <DialogDescription>{t('APPROVE_DESCRIPTION')}</DialogDescription>
          </DialogHeader>

          {/* Request Details Box */}
          <div className="rounded-lg border border-border bg-muted/40 p-3.5 text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">{t('BRANCH')}:</span>
                <p className="font-semibold text-foreground">{expense.branchName ?? 'Main Branch'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t('REQUESTED_BY')}:</span>
                <p className="font-semibold text-foreground">{expense.requestedBy ?? expense.paidBy}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-border pt-2">
              <div>
                <span className="text-muted-foreground">{t('CATEGORY')}:</span>
                <p className="text-foreground font-medium">{expense.category}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t('AMOUNT')}:</span>
                <p className="font-mono text-base font-bold text-foreground">
                  {formatAdminAccountingCurrency(expense.amount, locale)}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-2">
              <span className="text-muted-foreground">{t('DESCRIPTION')}:</span>
              <p className="text-foreground">{expense.description}</p>
              {expense.notes && (
                <p className="text-xs text-muted-foreground mt-0.5 italic">{expense.notes}</p>
              )}
            </div>

            {expense.receiptUrl && (
              <div className="border-t border-border pt-2 flex items-center justify-between">
                <span className="text-muted-foreground">Attached Quotation / Bill:</span>
                <a
                  href={expense.receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  <span>{t('VIEW_QUOTATION')}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
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
              type="button"
              onClick={() => onConfirm(expense.id)}
              className="inline-flex items-center gap-1.5 rounded-md bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success motion-safe:transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>{t('APPROVE')}</span>
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AdminAccountsExpensesApprovalModal;

