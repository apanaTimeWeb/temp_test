// RESPONSIBILITY: AdminAccountsExpenseCategoriesPage component owned by admin_accounting; responsibility folder: admin_accounting_components_views.
'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, X } from 'lucide-react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import AdminAccountingDeleteConfirmationDialog from '@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/components/AdminAccountsExpenseCategoriesDeleteConfirmationDialog';
import toast from 'sonner';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLORS } from '@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/config/admin_accounts_expense_categories.url_config';
import { createAdminAccountingExpenseCategoryFormSchema, type AdminAccountingExpenseCategoryFormValues, type AdminAccountingExpenseCategoryValidationKey } from '@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/schemas/AdminAccountsExpenseCategoriesFormSchemas';
import { ADMIN_ACCOUNTING_EXPENSE_CATEGORY_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/mocks/AdminAccountsExpenseCategoriesExpenseCategoryFixtures';
import type { AdminAccountingExpenseCategory } from '@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/types/AdminAccountsExpenseCategoriesTypes';
import { formatAdminAccountingCurrency, toAdminAccountingMinorUnits } from '@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/utils/AdminAccountsExpenseCategoriesFormatCurrency';
import AdminAccountingExpenseCategoryGridSection from '@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/components/AdminAccountsExpenseCategoriesExpenseCategoryGridSection';
import useAdminAccountsExpenseCategoriesUnsavedChangesGuard from '@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/hooks/useAdminAccountsExpenseCategoriesUnsavedChangesGuard';

const zodColorSchema = () => z.enum(ADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLORS);

/**
 * Displays and validates accounting expense-category configuration. Dependencies: the module-owned category schema and color registry. Edge cases: invalid category/color values must be rejected before any mutation is attempted.
 */
export function AdminAccountsExpenseCategoriesPage() {
  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSE_CATEGORIES');
  const isDemoMode = isFrontendDemoModeEnabled();
  const router = useRouter();
  const [categories, setCategories] = useState<AdminAccountingExpenseCategory[]>(isDemoMode ? [...ADMIN_ACCOUNTING_EXPENSE_CATEGORY_FIXTURES] : []);
  const [showAdd, setShowAdd] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminAccountingExpenseCategory | null>(null);
  const schema = useMemo(() => createAdminAccountingExpenseCategoryFormSchema((key: AdminAccountingExpenseCategoryValidationKey) => t(key)).extend({ color: zodColorSchema() }), [t]);
  const form = useForm<AdminAccountingExpenseCategoryFormValues & { color: (typeof ADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLORS)[number] }>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', budget: 0, color: ADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLORS[0] },
  });

  const handleBlockedNavigation = useCallback((href: string) => { setPendingHref(href); setShowDiscardDialog(true); }, []);
  useAdminAccountsExpenseCategoriesUnsavedChangesGuard(showAdd && form.formState.isDirty, handleBlockedNavigation, form.formState.isSubmitting);
  const requestClose = () => {
    if (form.formState.isDirty) { setPendingHref(null); setShowDiscardDialog(true); return; }
    form.reset();
    setShowAdd(false);
  };
  const discardDraft = () => {
    const destination = pendingHref;
    form.reset();
    setPendingHref(null);
    setShowDiscardDialog(false);
    setShowAdd(false);
    if (destination) router.push(destination);
  };

  const handleAdd = form.handleSubmit((values) => {
    if (!isDemoMode) { toast.error(t('CREATE_BLOCKED'), { id: 'admin_accounts_assets-accounts_expense_categories-components-AdminAccountsExpenseCategoriesPage-toast-43-1' }); return; }
    setCategories((current) => [...current, { id: Date.now(), name: values.name, budget: toAdminAccountingMinorUnits(values.budget), spent: 0, color: values.color }]);
    toast.info(t('DEMO_CREATED'), { id: 'admin_accounts_assets-accounts_expense_categories-components-AdminAccountsExpenseCategoriesPage-toast-45-2' });
    form.reset();
    setShowAdd(false);
  });

  const handleDelete = (id: number) => {
    if (!isDemoMode) { toast.error(t('DELETE_BLOCKED'), { id: 'admin_accounts_assets-accounts_expense_categories-components-AdminAccountsExpenseCategoriesPage-toast-51-3' }); return; }
    setCategories((current) => current.filter((category) => category.id !== id));
    toast.info(t('DEMO_DELETED'), { id: 'admin_accounts_assets-accounts_expense_categories-components-AdminAccountsExpenseCategoriesPage-toast-53-4' });
  };

  return <div className="space-y-6">
    {!isDemoMode && <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('LIVE_UNAVAILABLE')}</p>}
    <div className="flex items-center justify-between gap-4">
<div>
<h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
<p className="mt-1 text-body text-text-secondary">{t('SUBTITLE')}</p>
</div>
<button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-transparent bg-primary px-4 py-2 text-body font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={!isDemoMode} title={!isDemoMode ? t('CREATE_BLOCKED') : undefined} onClick={() => setShowAdd(true)}>
<Plus size={18} strokeWidth={2} /> {t('ADD_CATEGORY')}</button>
</div>
    <AdminAccountingExpenseCategoryGridSection
      categories={categories}
      onDelete={setPendingDelete}
      canMutate={isDemoMode}
      labels={{
        spent: t('SPENT'),
        budget: t('BUDGET'),
        percentUsed: (pct) => t('PERCENT_USED', { pct }),
        overBudget: (amount) => t('OVER_BUDGET', { amount }),
        deleteCategory: (name) => `${t('DELETE')} ${name}`,
      }}
    />
    {showAdd && <Dialog open={showAdd} onOpenChange={(open) => { if (open) setShowAdd(true); else if (showDiscardDialog) { setShowDiscardDialog(false); setPendingHref(null); } else requestClose(); }}>
<DialogContent className="space-y-3">
{showDiscardDialog ? (<>
<DialogTitle>{t('UNSAVED_CHANGES_TITLE')}</DialogTitle>
<DialogDescription>{t('UNSAVED_CHANGES_DESCRIPTION')}</DialogDescription>
<DialogFooter>
<button type="button" className="min-h-11 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => { setShowDiscardDialog(false); setPendingHref(null); }}>{t('UNSAVED_CHANGES_STAY')}</button>
<button type="button" className="min-h-11 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={discardDraft}>{t('UNSAVED_CHANGES_LEAVE')}</button>
</DialogFooter>
</>) : <>
<div className="flex items-center justify-between">
<DialogTitle className="text-section-title font-bold text-text-primary">{t('ADD_TITLE')}</DialogTitle>
<button type="button" className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('CLOSE_DIALOG')} onClick={requestClose}>
<X size={18} strokeWidth={2} />
</button>
</div>
<DialogDescription>{t('DIALOG_DESCRIPTION')}</DialogDescription>
<form className="space-y-3" onSubmit={handleAdd}>
<div>
<label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="category-name">{t('CATEGORY_NAME')}</label>
<input id="category-name" required aria-invalid={Boolean(form.formState.errors.name)} aria-describedby={form.formState.errors.name ? "category-name-error" : undefined} className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...form.register('name')} />{form.formState.errors.name && <p id="category-name-error" className="text-danger-text text-caption" role="alert">{form.formState.errors.name.message}</p>}</div>
<div>
<label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="category-budget">{t('MONTHLY_BUDGET')}</label>
<input id="category-budget" type="number" min="0" step="0.01" required aria-invalid={Boolean(form.formState.errors.budget)} aria-describedby={form.formState.errors.budget ? "category-budget-error" : undefined} className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...form.register('budget', { valueAsNumber: true })} />{form.formState.errors.budget && <p id="category-budget-error" className="text-danger-text text-caption" role="alert">{form.formState.errors.budget.message}</p>}</div>
<fieldset>
<legend className="mb-1.5 block text-body font-medium text-text-primary">{t('COLOR')}</legend>
<div className="mt-1 flex flex-wrap gap-2">{ADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLORS.map((color) => <button key={color} type="button" aria-label={t('USE_COLOR', { color })} aria-pressed={form.watch('color') === color} onClick={() => form.setValue('color', color, { shouldValidate: true })} className={`min-h-11 min-w-11 rounded-full border-2 motion-safe:transition-colors motion-safe:duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${form.watch('color') === color ? 'border-primary' : 'border-transparent'}`} data-admin-bg={color} />)}</div>
</fieldset>
<div className="flex flex-wrap justify-end gap-2 border-t border-border pt-3">
<button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={requestClose}>{t('CANCEL')}</button>
<button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-transparent bg-primary px-4 py-2 text-body font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={!isDemoMode || form.formState.isSubmitting}>{t('SAVE')}</button>
</div>
</form>
</>}
</DialogContent>
</Dialog>}
    <AdminAccountingDeleteConfirmationDialog open={pendingDelete !== null} title={t('DELETE_CATEGORY_TITLE')} description={pendingDelete ? t('DELETE_CATEGORY_DESCRIPTION', { name: pendingDelete.name }) : ''} confirmLabel={t('DELETE')} cancelLabel={t('CANCEL')} onCancel={() => setPendingDelete(null)} onConfirm={() => { if (pendingDelete) handleDelete(pendingDelete.id); setPendingDelete(null); }} />
  </div>;
}

