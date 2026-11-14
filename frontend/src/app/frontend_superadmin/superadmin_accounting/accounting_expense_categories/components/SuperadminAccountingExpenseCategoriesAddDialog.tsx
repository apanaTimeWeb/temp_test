'use client';
/** Responsibility: Render the expense-category sample form dialog without claiming a persistence action. */
/** Data-Flow: parent-owned RHF form and focus reference -> localized fields/validation -> preview-only unavailable write notice. */
import type { FormEvent, RefObject } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLORS as COLORS, SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLOR_CLASSES as CATEGORY_COLOR_CLASS } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/constants/superadmin_accounting_expense_categories.constants';
import type { SuperadminAccountingExpenseCategoryFormValues } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/schemas/superadmin_accounting_expense_categories.schemas';

type Props = {
  open: boolean;
  nameInputRef: RefObject<HTMLInputElement | null>;
  form: UseFormReturn<SuperadminAccountingExpenseCategoryFormValues>;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  translateValidationMessage: (message?: string) => string;
};

export default function SuperadminAccountingExpenseCategoriesAddDialog({ open, nameInputRef, form, onClose, onSubmit, translateValidationMessage }: Props) {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  if (!open) return null;
  return (
    <div className="acct-dialog-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div id="accounting-expense-category-dialog" role="dialog" aria-modal="true" aria-labelledby="accounting-expense-category-title" className="acct-dialog">
        <h2 id="accounting-expense-category-title" className="acct-dialog__title"><Plus size={18} aria-hidden="true" /> {tCopy('COPY.ADD_CATEGORY_SAMPLE_PREVIEW')}</h2>
        <button type="button" aria-label={tCopy('COPY.CLOSE_ADD_CATEGORY_DIALOG')} className="acct-dialog__close" onClick={onClose} data-testid="superadmin-accounting-accounting-expense-categories-close-add-category-dialog-3">✕</button>
        <form className="space-y-3" noValidate onSubmit={onSubmit} data-testid="superadmin-superadmin-accounting-expense-categories-page-client-form-line-130">
          <div>
            <label htmlFor="expense-category-name" className="acct-label">{tCopy('COPY.CATEGORY_NAME')} <span className="acct-text-danger">*</span></label>
            <input ref={nameInputRef} id="expense-category-name" name="name" autoComplete="off" className="acct-input" placeholder={tCopy('COPY.E_G_RENT')} aria-invalid={Boolean(form.formState.errors.name)} aria-describedby={form.formState.errors.name ? 'expense-category-name-error' : undefined} {...form.register('name')} data-testid="superadmin-accounting-accounting-expense-categories-expense-category-name-4" />
            {form.formState.errors.name && <p id="expense-category-name-error" role="alert" className="acct-text-danger text-xs">{translateValidationMessage(form.formState.errors.name.message)}</p>}
          </div>
          <div>
            <label htmlFor="expense-category-budget" className="acct-label">{tCopy('COPY.MONTHLY_BUDGET')} <span className="acct-text-danger">*</span></label>
            <input id="expense-category-budget" name="budget" type="number" min="0.01" step="0.01" inputMode="decimal" className="acct-input" placeholder="0" aria-invalid={Boolean(form.formState.errors.budget)} aria-describedby={form.formState.errors.budget ? 'expense-category-budget-error' : undefined} {...form.register('budget', { valueAsNumber: true })} data-testid="superadmin-accounting-accounting-expense-categories-expense-category-budget-5" />
            {form.formState.errors.budget && <p id="expense-category-budget-error" role="alert" className="acct-text-danger text-xs">{translateValidationMessage(form.formState.errors.budget.message)}</p>}
          </div>
          <fieldset>
            <legend className="acct-label">{tCopy('COPY.COLOR')}</legend>
            <div className="mt-1 flex flex-wrap gap-2">
              {COLORS.map((color) => <button type="button" key={color} aria-pressed={form.watch('color') === color} onClick={() => form.setValue('color', color, { shouldDirty: true, shouldValidate: true })} className={`h-7 w-7 rounded-full border-2 motion-safe:transition-all motion-reduce:transition-none ${CATEGORY_COLOR_CLASS[color] || CATEGORY_COLOR_CLASS.primary} ${form.watch('color') === color ? 'border-focus' : 'border-transparent'}`} aria-label={tCopy('COPY.CHOOSE_CATEGORY_COLOR_ARIA_LABEL', { color })} data-testid={`superadmin-accounting-accounting-expense-categories-choose-category-color-aria-label-6-${String(color)}`} />)}
            </div>
          </fieldset>
          <div className="acct-dialog__footer">
            <button type="button" className="acct-badge acct-badge--neutral cursor-pointer" onClick={onClose} data-testid="superadmin-accounting-accounting-expense-categories-cancel-7">{tCopy('COPY.CANCEL')}</button>
            <button type="submit" disabled={form.formState.isSubmitting} className="acct-badge acct-badge--success cursor-pointer disabled:opacity-50" data-testid="superadmin-accounting-accounting-expense-categories-add-sample-category-8">{tCopy('COPY.ADD_SAMPLE_CATEGORY')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
