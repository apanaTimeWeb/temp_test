// RESPONSIBILITY: AdminAccountsExpensesHeaderSection component owned by admin_accounting; responsibility folder: admin_accounts_expenses_sections.
'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { AdminAccountsExpensesHeaderSectionProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';


/** Owns the Expense Ledger heading and its navigation CTA; does not read or mutate expense records. */
export function AdminAccountsExpensesHeaderSection({ onAddExpense, canMutate }: AdminAccountsExpensesHeaderSectionProps) {
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSES');

  return (
    <header className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
        <p className="mt-2 text-sm text-text-secondary">{t('SUBTITLE')}</p>
      </div>
      <button type="button" className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm font-medium bg-info-bg text-info-text flex min-h-11 cursor-pointer gap-1 disabled:cursor-not-allowed disabled:opacity-50" disabled={!canMutate} title={!canMutate ? t('CREATE_BLOCKED') : undefined} onClick={onAddExpense}>
        <Plus size={18} strokeWidth={2} aria-hidden="true" /> {t('ADD_EXPENSE')}
      </button>
    </header>
  );
}

export default AdminAccountsExpensesHeaderSection;


export type { AdminAccountsExpensesHeaderSectionProps };
