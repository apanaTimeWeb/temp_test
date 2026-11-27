'use client';
import type { AdminAccountsExpensesRejectionModalProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const RejectionReasonSchema = z.object({
  reason: z.string().trim().min(5, 'Please provide a specific rejection reason (min 5 characters).').max(1000),
});

type RejectionReasonValues = z.infer<typeof RejectionReasonSchema>;

export function AdminAccountsExpensesRejectionModal({
  expense,
  open,
  onConfirm,
  onCancel,
}: AdminAccountsExpensesRejectionModalProps) {
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSES');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<RejectionReasonValues>({
    resolver: zodResolver(RejectionReasonSchema),
    defaultValues: { reason: '' },
  });

  useEffect(() => {
    if (expense) {
      reset({ reason: '' });
    }
  }, [expense, reset]);

  useEffect(() => {
    if (!open || !isDirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, open]);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) onCancel();
  }, [onCancel]);

  if (!expense) return null;

  const submitForm = handleSubmit((values) => {
    onConfirm(expense.id, values.reason.trim());
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={submitForm} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <DialogTitle>{t('REJECT_TITLE')}</DialogTitle>
            </div>
            <DialogDescription>{t('REJECT_DESCRIPTION')}</DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-border bg-muted p-3 text-xs space-y-1">
            <p className="font-semibold text-foreground">{expense.description}</p>
            <p className="text-muted-foreground">Branch: {expense.branchName ?? 'Downtown Central'}</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="rejection-reason" className="block text-xs font-semibold text-foreground">
              {t('REJECTION_REASON')}
            </label>
            <textarea
              maxLength={1000}
              id="rejection-reason"
              rows={3}
              required
              {...register('reason')}
              placeholder="e.g. Quotation too high / Item already covered under AMC / Unapproved personal item"
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            {errors.reason?.message && <p className="text-xs text-destructive font-medium">{errors.reason.message}</p>}
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
              className="inline-flex items-center gap-1.5 rounded-md bg-danger px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger motion-safe:transition-opacity"
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

