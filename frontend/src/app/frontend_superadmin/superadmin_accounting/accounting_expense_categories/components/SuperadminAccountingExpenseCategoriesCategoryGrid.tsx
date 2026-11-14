'use client';
/** Responsibility: Render the expense-category collection as a responsive, leaf-owned card grid. */
/** Data-Flow: preview category records -> budget-use derivation and localized card rendering -> read-only preview; delete stays unavailable. */
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { formatSuperadminAccountingMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/utils/SuperadminAccountingExpenseCategoriesFormatters';
import { SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLOR_CLASSES } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/constants/superadmin_accounting_expense_categories.constants';
import type { SuperadminAccountingExpenseCategory } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/types/superadmin_accounting_expense_categories.types';
import { SuperadminAccountingExpenseCategoriesEmptyState } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/components/SuperadminAccountingExpenseCategoriesEmptyState';

type Props = {
  categories: readonly SuperadminAccountingExpenseCategory[];
  locale: string;
  onDelete: (category: SuperadminAccountingExpenseCategory) => void;
};

export default function SuperadminAccountingExpenseCategoriesCategoryGrid({ categories, locale, onDelete }: Props) {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  if (categories.length === 0) return <SuperadminAccountingExpenseCategoriesEmptyState />;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const pct = category.budget > 0 ? Math.min(Math.round((category.spent / category.budget) * 100), 100) : 0;
        const over = category.spent > category.budget;
        return (
          <article key={category.id} className="acct-card space-y-3 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className={`h-3 w-3 shrink-0 rounded-full ${SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLOR_CLASSES[category.color] || SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLOR_CLASSES.primary}`} aria-hidden="true" />
                <span className="acct-cell-name truncate">{category.name}</span>
              </div>
              <button type="button" disabled title={tCopy('COPY.WRITE_UNAVAILABLE_NO_APPROVED_API_CONTRACT')} className="acct-badge acct-badge--danger inline-flex min-h-11 min-w-11 items-center justify-center cursor-not-allowed opacity-50" aria-label={tCopy('COPY.REMOVE_CATEGORY_PREVIEW_ARIA_LABEL', { name: category.name })} onClick={() => onDelete(category)} data-testid={`superadmin-accounting-accounting-expense-categories-remove-category-preview-aria-label-2-${String(category.id)}`}>
                <Trash2 size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <span className="acct-cell-subtext">{tCopy('COPY.SPENT')} <span className={over ? 'acct-text-danger font-semibold' : 'acct-text-body'}>{formatSuperadminAccountingMajorPreviewCurrency(category.spent, 'INR', locale)}</span></span>
              <span className="acct-cell-subtext">{tCopy('COPY.BUDGET')} {formatSuperadminAccountingMajorPreviewCurrency(category.budget, 'INR', locale)}</span>
            </div>
            <progress className={`acct-semantic-progress ${over ? 'acct-semantic-progress--danger' : `acct-semantic-progress--${category.color}`}`} max={100} value={pct} aria-label={tCopy('COPY.CATEGORY_BUDGET_USE_ARIA_LABEL', { name: category.name })} />
            <div className="flex flex-wrap justify-between gap-2">
              <span className={`acct-badge ${over ? 'acct-badge--danger' : pct > 80 ? 'acct-badge--warning' : 'acct-badge--success'}`}>{pct}{tCopy('COPY.USED')}</span>
              {over && <span className="acct-badge acct-badge--danger">{tCopy('COPY.OVER_BUDGET_BY')} {formatSuperadminAccountingMajorPreviewCurrency(category.spent - category.budget, 'INR', locale)}</span>}
            </div>
          </article>
        );
      })}
    </div>
  );
}
