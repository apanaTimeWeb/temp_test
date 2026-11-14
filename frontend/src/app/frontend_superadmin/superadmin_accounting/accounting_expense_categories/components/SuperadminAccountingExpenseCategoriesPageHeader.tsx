'use client';
/** Responsibility: Render the expense-categories page heading and its unavailable add affordance. */
/** Data-Flow: page-owned visibility state and trigger ref -> localized heading/action -> parent-owned dialog state. */
import type { RefObject } from 'react';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
  addTriggerRef: RefObject<HTMLButtonElement | null>;
  onAdd: () => void;
};

export default function SuperadminAccountingExpenseCategoriesPageHeader({ addTriggerRef, onAdd }: Props) {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="acct-page-title">{tCopy('COPY.EXPENSE_CATEGORIES')}</h1>
        <p className="acct-page-subtitle">{tCopy('COPY.MANAGE_BUDGET_ALLOCATION_PER_EXPENSE_CATEGORY')}</p>
      </div>
      <button ref={addTriggerRef} type="button" disabled title={tCopy('COPY.WRITE_UNAVAILABLE_NO_APPROVED_API_CONTRACT')} className="acct-badge acct-badge--info inline-flex min-h-11 min-w-11 items-center justify-center gap-2 cursor-not-allowed opacity-50" onClick={onAdd} data-testid="superadmin-accounting-accounting-expense-categories-add-category-1">
        <Plus size={18} aria-hidden="true" /> {tCopy('COPY.ADD_CATEGORY')}
      </button>
    </div>
  );
}
