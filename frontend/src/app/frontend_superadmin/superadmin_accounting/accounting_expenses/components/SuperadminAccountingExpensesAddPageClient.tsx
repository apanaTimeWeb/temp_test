'use client';
/** Responsibility: Superadmin Accounting Expenses Add Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminAccountingExpensesAddPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useSuperadminAccountingExpensesAddValidationMessage } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/hooks/useSuperadminAccountingExpensesAddValidationMessage';
import { SUPERADMIN_ACCOUNTING_EXPENSES_ROUTES as __SUPERADMIN_ACCOUNTING_EXPENSES_ROUTES } from "@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/config/superadmin_accounting_expenses.url_config";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  SUPERADMIN_ACCOUNTING_EXPENSE_CREATE_CATEGORIES as CATEGORIES,
  SUPERADMIN_ACCOUNTING_EXPENSE_CREATE_SCHEMA,
  type SuperadminAccountingExpenseCreateFormValues,
} from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/schemas/SuperadminAccountingExpensesAddExpenseCreateSchema';
import { useTranslations } from 'next-intl';
import { useSuperadminAccountingExpensesAddUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/hooks/useSuperadminAccountingExpensesAddUnsavedChangesGuard';

/**
 * Renders the accounting expenses page content and coordinates its local interaction state, validation, and accessible controls.
 */
export default function SuperadminAccountingExpensesAddPageClient() {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  const translateValidationMessage = useSuperadminAccountingExpensesAddValidationMessage();
  const router = useRouter();
  const form = useForm<SuperadminAccountingExpenseCreateFormValues>({
    resolver: zodResolver(SUPERADMIN_ACCOUNTING_EXPENSE_CREATE_SCHEMA),
    defaultValues: { date: '', category: CATEGORIES[0], description: '', amount: '', paidBy: '', mode: 'cash', notes: '' },
    mode: 'onBlur',
  });
  const { confirmLeave } = useSuperadminAccountingExpensesAddUnsavedChangesGuard(form.formState.isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));

  const handleSave = form.handleSubmit((_values) => {
    toast.message(tCopy("COPY.PREVIEW_ONLY_THIS_EXPENSE_WAS_VALIDATED_IN_THE_BROWSER_BUT_WAS_NOT_SUB_8E95B7AB"), { id: "superadmin_accounting:SuperadminAccountingExpensesAddPageClient:message:1" });
  });

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="acct-page-title">{tCopy("COPY.ADD_EXPENSE_SAMPLE_PREVIEW")}</h1>
        <p className="acct-page-subtitle">{tCopy("COPY.VALIDATE_A_SAMPLE_OPERATIONAL_EXPENSE_THIS_ARCHIVE_DOES_NOT_PROVIDE_A_VERIFIED_WRITE_API_CONTRACT")}</p>
      </div>

      <form noValidate onSubmit={handleSave} className="acct-card p-6 space-y-4" data-testid="superadmin-superadmin-accounting-expenses-add-page-client-form-line-40">
        <p role="status" className="rounded-md border border-border bg-warning-bg p-3 text-sm text-warning">{tCopy("COPY.SAMPLE_PREVIEW_ONLY_SUBMITTING_THIS_FORM_DOES_NOT_CREATE_AN_ACCOUNTING_RECORD")}</p>
        <div>
          <label htmlFor="expense-create-date" className="acct-label">{tCopy("COPY.DATE")} <span className="acct-text-danger">*</span></label>
          <input id="expense-create-date" type="date" className="acct-input" aria-invalid={Boolean(form.formState.errors.date)} aria-describedby={form.formState.errors.date ? 'expense-create-date-error' : undefined} {...form.register('date')}  data-testid="superadmin-accounting-accounting-expenses-add-expense-create-date-1"/>
          {form.formState.errors.date && <p id="expense-create-date-error" role="alert" className="acct-text-danger text-xs">{translateValidationMessage(form.formState.errors.date.message)}</p>}
        </div>
        <div>
          <label htmlFor="expense-create-category" className="acct-label">{tCopy("COPY.CATEGORY")}</label>
          <select id="expense-create-category" className="acct-select" {...form.register('category')} data-testid="superadmin-accounting-accounting-expenses-add-expense-create-category-2">{CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select>
        </div>
        <div>
          <label htmlFor="expense-create-description" className="acct-label">{tCopy("COPY.DESCRIPTION")} <span className="acct-text-danger">*</span></label>
          <input id="expense-create-description" className="acct-input" placeholder={tCopy("COPY.ENTER_DESCRIPTION")} aria-invalid={Boolean(form.formState.errors.description)} aria-describedby={form.formState.errors.description ? 'expense-create-description-error' : undefined} {...form.register('description')}  data-testid="superadmin-accounting-accounting-expenses-add-expense-create-description-3"/>
          {form.formState.errors.description && <p id="expense-create-description-error" role="alert" className="acct-text-danger text-xs">{translateValidationMessage(form.formState.errors.description.message)}</p>}
        </div>
        <div>
          <label htmlFor="expense-create-amount" className="acct-label">{tCopy("COPY.AMOUNT")} <span className="acct-text-danger">*</span></label>
          <input id="expense-create-amount" type="number" min="0.01" step="0.01" inputMode="decimal" className="acct-input" placeholder="0" aria-invalid={Boolean(form.formState.errors.amount)} aria-describedby={form.formState.errors.amount ? 'expense-create-amount-error' : undefined} {...form.register('amount')}  data-testid="superadmin-accounting-accounting-expenses-add-expense-create-amount-4"/>
          {form.formState.errors.amount && <p id="expense-create-amount-error" role="alert" className="acct-text-danger text-xs">{translateValidationMessage(form.formState.errors.amount.message)}</p>}
        </div>
        <div>
          <label htmlFor="expense-create-paid-by" className="acct-label">{tCopy("COPY.PAID_BY")} <span className="acct-text-danger">*</span></label>
          <input id="expense-create-paid-by" className="acct-input" placeholder={tCopy("COPY.NAME")} aria-invalid={Boolean(form.formState.errors.paidBy)} aria-describedby={form.formState.errors.paidBy ? 'expense-create-paid-by-error' : undefined} {...form.register('paidBy')}  data-testid="superadmin-accounting-accounting-expenses-add-expense-create-paid-by-5"/>
          {form.formState.errors.paidBy && <p id="expense-create-paid-by-error" role="alert" className="acct-text-danger text-xs">{translateValidationMessage(form.formState.errors.paidBy.message)}</p>}
        </div>
        <div>
          <label htmlFor="expense-create-mode" className="acct-label">{tCopy("COPY.PAYMENT_MODE")}</label>
          <select id="expense-create-mode" className="acct-select" {...form.register('mode')} data-testid="superadmin-accounting-accounting-expenses-add-expense-create-mode-6">
            <option value="cash">{tCopy("COPY.CASH")}</option><option value="upi">{tCopy("COPY.UPI")}</option><option value="card">{tCopy("COPY.CARD")}</option><option value="bank">{tCopy("COPY.BANK_TRANSFER")}</option>
          </select>
        </div>
        <div>
          <label htmlFor="expense-create-notes" className="acct-label">{tCopy("COPY.NOTES")}</label>
          <textarea id="expense-create-notes" className="acct-textarea" rows={2} placeholder={tCopy("COPY.OPTIONAL_NOTES")} aria-invalid={Boolean(form.formState.errors.notes)} aria-describedby={form.formState.errors.notes ? 'expense-create-notes-error' : undefined} {...form.register('notes')}  data-testid="superadmin-accounting-accounting-expenses-add-expense-create-notes-7"/>
          {form.formState.errors.notes && <p id="expense-create-notes-error" role="alert" className="acct-text-danger text-xs">{translateValidationMessage(form.formState.errors.notes.message)}</p>}
        </div>
        <div className="flex gap-3">
          <button type="button" className="acct-badge acct-badge--neutral cursor-pointer" onClick={async () => { if (await confirmLeave()) router.push(__SUPERADMIN_ACCOUNTING_EXPENSES_ROUTES.MODULE_URLS.EXPENSES); }} data-testid="superadmin-accounting-accounting-expenses-add-cancel-8">{tCopy("COPY.CANCEL")}</button>
          <button type="submit" disabled={form.formState.isSubmitting} className="acct-badge acct-badge--success cursor-pointer disabled:opacity-50" data-testid="superadmin-accounting-accounting-expenses-add-validate-preview-9">{tCopy("COPY.VALIDATE_PREVIEW")}</button>
        </div>
      </form>
    </div>
  );
}
