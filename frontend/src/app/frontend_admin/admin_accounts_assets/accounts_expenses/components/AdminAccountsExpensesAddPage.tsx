'use client';
// RESPONSIBILITY: Owns the add-expense form and protects unsubmitted changes.

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { ADMIN_ACCOUNTS_EXPENSES_ROUTES } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/config/admin_accounts_expenses.url_config';
import { ADMIN_ACCOUNTING_EXPENSE_CATEGORIES } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/config/admin_accounts_expenses.url_config';
import { createAdminAccountingExpenseFormSchema, type AdminAccountingExpense, type AdminAccountingExpenseFormValues, type AdminAccountingExpenseValidationKey } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/schemas/AdminAccountsExpensesSchemas';
import { toAdminAccountingMinorUnits } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/utils/AdminAccountsExpensesFormatCurrency';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useAdminAccountsExpensesUnsavedChangesGuard } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/hooks/useAdminAccountsExpensesUnsavedChangesGuard';
import type { AdminAccountsExpensesAddPageProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';


export default function AdminAccountsExpensesAddPage({ onSaveExpense, onCancel }: AdminAccountsExpensesAddPageProps) {
  const router = useRouter();
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSE_ADD');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const schema = useMemo(() => createAdminAccountingExpenseFormSchema((key: AdminAccountingExpenseValidationKey) => t(key)), [t]);
  const form = useForm<AdminAccountingExpenseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { date: '', category: ADMIN_ACCOUNTING_EXPENSE_CATEGORIES[0], description: '', amount: 0, paidBy: '', mode: 'cash', notes: '' },
    mode: 'onBlur',
  });
  const handleBlockedNavigation = useCallback((href: string) => {
    setPendingHref(href);
    setShowDiscardDialog(true);
  }, []);
  useAdminAccountsExpensesUnsavedChangesGuard(form.formState.isDirty, handleBlockedNavigation);

  const requestCancel = () => {
    if (form.formState.isDirty) {
      setPendingHref(ADMIN_ACCOUNTS_EXPENSES_ROUTES.route);
      setShowDiscardDialog(true);
      return;
    }
    onCancel();
  };

  const handleSave = form.handleSubmit((values) => {
    if (!isDemoMode) {
      toast.error(t('CREATE_BLOCKED'), { id: 'admin-accounts-expenses-create-blocked' });
      return;
    }
    const newExpense: AdminAccountingExpense = {
      id: Date.now(), date: values.date, category: values.category, description: values.description,
      amount: toAdminAccountingMinorUnits(values.amount), paidBy: values.paidBy, mode: values.mode, notes: values.notes,
    };
    onSaveExpense(newExpense);
    form.reset(values);
    toast.info(t('DEMO_SAVED'), { id: 'admin-accounts-expenses-demo-saved' });
    router.push(ADMIN_ACCOUNTS_EXPENSES_ROUTES.route);
  });

  const discardAndNavigate = () => {
    form.reset();
    setShowDiscardDialog(false);
    const nextHref = pendingHref;
    setPendingHref(null);
    if (nextHref) router.push(nextHref);
    else onCancel();
  };

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      {!isDemoMode && <p role="status" className="rounded-lg border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('LIVE_UNAVAILABLE')}</p>}
      <div><h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1><p className="mt-2 text-sm text-text-secondary">{t('SUBTITLE')}</p></div>
      <form className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card" onSubmit={handleSave} noValidate>
        <div>
          <label className="block text-sm font-medium text-text-secondary" htmlFor="expense-date">{t('DATE')}</label>
          <input id="expense-date" type="date" required aria-invalid={Boolean(form.formState.errors.date)} aria-describedby={form.formState.errors.date ? 'expense-date-error' : undefined} className="mt-1 min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...form.register('date')} />
          {form.formState.errors.date && <p id="expense-date-error" role="alert" className="mt-1 text-caption text-danger-text">{form.formState.errors.date.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary" htmlFor="expense-category">{t('CATEGORY')}</label>
          <select id="expense-category" required aria-invalid={Boolean(form.formState.errors.category)} aria-describedby={form.formState.errors.category ? 'expense-category-error' : undefined} className="mt-1 min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...form.register('category')}>
            {ADMIN_ACCOUNTING_EXPENSE_CATEGORIES.map((category) => <option key={category} value={category}>{t(({ Electricity: 'CATEGORY_ELECTRICITY', Maintenance: 'CATEGORY_MAINTENANCE', Stationery: 'CATEGORY_STATIONERY', Internet: 'CATEGORY_INTERNET', Cleaning: 'CATEGORY_CLEANING', Miscellaneous: 'CATEGORY_MISCELLANEOUS', Rent: 'CATEGORY_RENT', Salary: 'CATEGORY_SALARY' } as const)[category])}</option>)}
          </select>
          {form.formState.errors.category && <p id="expense-category-error" role="alert" className="mt-1 text-caption text-danger-text">{form.formState.errors.category.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary" htmlFor="expense-description">{t('DESCRIPTION')}</label>
          <input id="expense-description" required aria-invalid={Boolean(form.formState.errors.description)} aria-describedby={form.formState.errors.description ? 'expense-description-error' : undefined} className="mt-1 min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...form.register('description')} />
          {form.formState.errors.description && <p id="expense-description-error" role="alert" className="mt-1 text-caption text-danger-text">{form.formState.errors.description.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary" htmlFor="expense-amount">{t('AMOUNT_INR')}</label>
          <input id="expense-amount" type="number" min="0.01" step="0.01" required aria-invalid={Boolean(form.formState.errors.amount)} aria-describedby={form.formState.errors.amount ? 'expense-amount-error' : undefined} className="mt-1 min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...form.register('amount', { valueAsNumber: true })} />
          {form.formState.errors.amount && <p id="expense-amount-error" role="alert" className="mt-1 text-caption text-danger-text">{form.formState.errors.amount.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary" htmlFor="expense-paid-by">{t('PAID_BY')}</label>
          <input id="expense-paid-by" required aria-invalid={Boolean(form.formState.errors.paidBy)} aria-describedby={form.formState.errors.paidBy ? 'expense-paid-by-error' : undefined} className="mt-1 min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...form.register('paidBy')} />
          {form.formState.errors.paidBy && <p id="expense-paid-by-error" role="alert" className="mt-1 text-caption text-danger-text">{form.formState.errors.paidBy.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary" htmlFor="expense-mode">{t('PAYMENT_MODE')}</label>
          <select id="expense-mode" className="mt-1 min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...form.register('mode')}>
            <option value="cash">{t('MODE_CASH')}</option><option value="upi">{t('MODE_UPI')}</option><option value="card">{t('MODE_CARD')}</option><option value="bank">{t('MODE_BANK')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary" htmlFor="expense-notes">{t('NOTES')}</label>
          <textarea id="expense-notes" rows={2} className="mt-1 min-h-20 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...form.register('notes')} />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" className="min-h-11 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={requestCancel}>{t('CANCEL')}</button>
          <button type="submit" className="min-h-11 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" disabled={!isDemoMode || form.formState.isSubmitting}>{form.formState.isSubmitting ? t('SAVING') : t('SAVE_EXPENSE')}</button>
        </div>
      </form>
      <Dialog open={showDiscardDialog} onOpenChange={(open) => { setShowDiscardDialog(open); if (!open) setPendingHref(null); }}>
        <DialogContent className="space-y-4">
          <DialogTitle>{t('UNSAVED_CHANGES_TITLE')}</DialogTitle>
          <DialogDescription>{t('UNSAVED_CHANGES_DESCRIPTION')}</DialogDescription>
          <DialogFooter>
            <button type="button" className="min-h-11 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => { setShowDiscardDialog(false); setPendingHref(null); }}>{t('KEEP_EDITING')}</button>
            <button type="button" className="min-h-11 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={discardAndNavigate}>{t('DISCARD_CHANGES')}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
