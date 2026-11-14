import { FolderOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

/** Responsibility: render the expense-category empty collection state without creating or mutating categories. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
/** Flow: category query/local state -> empty collection decision -> accessible localized empty-state presentation. */
export function SuperadminAccountingExpenseCategoriesEmptyState() {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  return (
    <div className="acct-card flex flex-col items-center gap-3 p-8 text-center" role="status" data-testid="superadmin-accounting-accounting-expense-categories-empty-state">
      <FolderOpen size={18} aria-hidden="true" className="acct-icon-muted" />
      <h2 className="acct-section-label">{tCopy('COPY.NO_EXPENSE_CATEGORIES_FOUND')}</h2>
      <p className="acct-cell-subtext">{tCopy('COPY.NO_EXPENSE_CATEGORIES_DESCRIPTION')}</p>
    </div>
  );
}
