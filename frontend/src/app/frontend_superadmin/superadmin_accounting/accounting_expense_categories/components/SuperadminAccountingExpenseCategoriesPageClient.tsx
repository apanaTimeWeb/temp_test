'use client';
/** Responsibility: Coordinate the expense-category preview state and its focused page sections. */
/** Data-Flow: canonical route -> parent-owned sample state/form -> leaf-local header, grid and dialog -> preview-only UI; no persistence is claimed. */
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';
import { useSuperadminAccountingExpenseCategoriesValidationMessage } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/hooks/useSuperadminAccountingExpenseCategoriesValidationMessage';
import { useSuperadminAccountingExpenseCategoriesUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/hooks/useSuperadminAccountingExpenseCategoriesUnsavedChangesGuard';
import { SUPERADMIN_ACCOUNTING_SAMPLE_EXPENSE_CATEGORIES } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/mocks/fixtures/SuperadminAccountingExpenseCategoriesExpenseCategoryMockFixtures';
import type { SuperadminAccountingExpenseCategory } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/types/superadmin_accounting_expense_categories.types';
import { SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLORS as COLORS } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/constants/superadmin_accounting_expense_categories.constants';
import { SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORY_SCHEMA, type SuperadminAccountingExpenseCategoryFormValues } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/schemas/superadmin_accounting_expense_categories.schemas';
import SuperadminAccountingExpenseCategoriesPageHeader from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/components/SuperadminAccountingExpenseCategoriesPageHeader';
import SuperadminAccountingExpenseCategoriesCategoryGrid from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/components/SuperadminAccountingExpenseCategoriesCategoryGrid';
import SuperadminAccountingExpenseCategoriesAddDialog from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/components/SuperadminAccountingExpenseCategoriesAddDialog';

export default function SuperadminAccountingExpenseCategoriesPageClient() {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  const locale = useLocale();
  const translateValidationMessage = useSuperadminAccountingExpenseCategoriesValidationMessage();
  const [categories] = useState<SuperadminAccountingExpenseCategory[]>(() => SUPERADMIN_ACCOUNTING_SAMPLE_EXPENSE_CATEGORIES.map((category) => ({ ...category })));
  const [showAdd, setShowAdd] = useState(false);
  const addTriggerRef = useRef<HTMLButtonElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<SuperadminAccountingExpenseCategoryFormValues>({
    resolver: zodResolver(SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORY_SCHEMA),
    defaultValues: { name: '', budget: 0, color: COLORS[0] },
    mode: 'onBlur',
  });
  const { confirmLeave } = useSuperadminAccountingExpenseCategoriesUnsavedChangesGuard(form.formState.isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));

  const closeAddDialog = async () => {
    if (!(await confirmLeave())) return;
    setShowAdd(false);
    form.reset({ name: '', budget: 0, color: COLORS[0] });
    addTriggerRef.current?.focus();
  };

  useEffect(() => {
    if (!showAdd) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        void closeAddDialog();
        return;
      }
      if (event.key !== 'Tab') return;
      const dialog = document.getElementById('accounting-expense-category-dialog');
      const focusable = dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    nameInputRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      addTriggerRef.current?.focus();
    };
  }, [showAdd, form, form.formState.isDirty]);

  const handleAdd = form.handleSubmit(() => {
    toast.error(tCopy('COPY.WRITE_UNAVAILABLE_NO_APPROVED_API_CONTRACT'), { id: 'superadmin_accounting:SuperadminAccountingExpenseCategoriesPageClient:unavailable:1' });
  });
  const handleDelete = (_category: SuperadminAccountingExpenseCategory) => {
    toast.error(tCopy('COPY.WRITE_UNAVAILABLE_NO_APPROVED_API_CONTRACT'), { id: 'superadmin_accounting:SuperadminAccountingExpenseCategoriesPageClient:unavailable:1' });
  };

  return (
    <div className="space-y-6">
      <p className="rounded-md border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy('COPY.SAMPLE_PREVIEW_ONLY_CATEGORY_CHANGES_ARE_TEMPORARY_BROWSER_STATE_THE_SUPPLIED_ARCHIVE_CONTAINS_NO_APPROVED_EXPENSE_CATEGORY_WRITE_CONTRACT')}</p>
      <SuperadminAccountingExpenseCategoriesPageHeader addTriggerRef={addTriggerRef} onAdd={() => setShowAdd(true)} />
      <SuperadminAccountingExpenseCategoriesCategoryGrid categories={categories} locale={locale} onDelete={handleDelete} />
      <SuperadminAccountingExpenseCategoriesAddDialog open={showAdd} nameInputRef={nameInputRef} form={form} onClose={() => { void closeAddDialog(); }} onSubmit={handleAdd} translateValidationMessage={translateValidationMessage} />
    </div>
  );
}
