'use client';
// RESPONSIBILITY: AdminAccountsExpensesHeaderSection component owned by admin_accounting; responsibility folder: admin_accounts_expenses_sections.

import { Plus, Receipt } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { AdminAccountsExpensesHeaderSectionProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';


/** Owns the Expense Ledger heading and its navigation CTA; does not read or mutate expense records. */
export function AdminAccountsExpensesHeaderSection({ onAddExpense, canMutate }: AdminAccountsExpensesHeaderSectionProps) {
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSES');

  return (
    <header className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-warning-bg px-2.5 py-0.5 text-xs font-semibold text-warning-text">
          <Receipt className="h-3.5 w-3.5" />
          Accounts / Expenses
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('TITLE')}</h1>
          <p className="mt-1 text-sm text-text-secondary">{t('SUBTITLE')}</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-primary px-3.5 py-2 text-sm font-semibold text-primary-contrast shadow-sm hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canMutate}
          title={!canMutate ? t('CREATE_BLOCKED') : undefined}
          onClick={onAddExpense}
        >
          <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
          {t('ADD_EXPENSE')}
        </button>
      </div>
    </header>
  );
}

export default AdminAccountsExpensesHeaderSection;


export type { AdminAccountsExpensesHeaderSectionProps };
