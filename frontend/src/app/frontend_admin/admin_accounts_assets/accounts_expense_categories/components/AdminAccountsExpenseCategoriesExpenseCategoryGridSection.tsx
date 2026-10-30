'use client';
// RESPONSIBILITY: AdminAccountingExpenseCategoryGridSection component owned by admin_accounting; responsibility folder: admin_accounting_components_tables.
import { Trash2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import type { AdminAccountingExpenseCategory } from '@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/types/AdminAccountsExpenseCategoriesTypes';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/utils/AdminAccountsExpenseCategoriesFormatCurrency';

export default function AdminAccountingExpenseCategoryGridSection({ categories, onDelete, labels, canMutate }: {
  categories: readonly AdminAccountingExpenseCategory[];
  onDelete: (category: AdminAccountingExpenseCategory) => void;
  canMutate: boolean;
  labels: { spent: string; budget: string; percentUsed: (pct: number) => string; overBudget: (amount: string) => string; deleteCategory: (name: string) => string };
}) {
  const locale = useLocale();
  return (
    <section aria-label={labels.budget} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const pct = category.budget === 0 ? 0 : Math.min(Math.round((category.spent / category.budget) * 100), 100);
        const over = category.spent > category.budget;
        return (
          <article key={category.id} className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card space-y-3 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full" data-admin-bg={category.color} /><span className="text-body font-semibold text-text-primary">{category.name}</span></div>
              <button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-danger-text hover:bg-danger-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={!canMutate} title={!canMutate ? labels.deleteCategory(category.name) : undefined} aria-label={labels.deleteCategory(category.name)} onClick={() => onDelete(category)}><Trash2 size={18} strokeWidth={2} aria-hidden="true" /></button>
            </div>
            <div className="flex flex-wrap justify-between gap-3"><span className="text-caption text-text-secondary">{labels.spent} <span className={over ? 'text-danger-text font-semibold' : 'text-body text-text-primary'}>{formatAdminAccountingCurrency(category.spent, locale)}</span></span><span className="text-caption text-text-secondary">{labels.budget} {formatAdminAccountingCurrency(category.budget, locale)}</span></div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-highlight"><progress className={`h-2 w-full rounded-full ${over ? 'accent-danger' : 'accent-primary'}`} max={100} value={Math.min(100, Math.max(0, Math.round(pct)))} aria-label={labels.percentUsed(pct)} /></div>
            <div className="flex flex-wrap justify-between gap-2"><span className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap ${over ? 'bg-danger-bg text-danger-text border-danger-bg' : pct > 80 ? 'bg-warning-bg text-warning-text border-warning-bg' : 'bg-success-bg text-success-text border-success-bg'}`}>{labels.percentUsed(pct)}</span>{over ? <span className="inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-danger-bg text-danger-text border-danger-bg">{labels.overBudget(formatAdminAccountingCurrency(category.spent - category.budget, locale))}</span> : null}</div>
          </article>
        );
      })}
    </section>
  );
}
