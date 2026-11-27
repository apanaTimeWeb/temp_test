'use client';

import type { AdminAccountsExpensesHeaderSectionProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';
import { FileSpreadsheet, Plus, Receipt } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function AdminAccountsExpensesHeaderSection({
  onAddExpense,
  canMutate,
  onExportCsv,
  onExportExcel,
}: AdminAccountsExpensesHeaderSectionProps) {
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSES');

  return (
    <header className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-danger bg-danger-bg px-3 py-1 text-xs font-semibold text-danger-text">
          <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
          Operational Expense Ledger
        </span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">Library Operational Expenses</h1>
          <p className="mt-1 text-xs sm:text-sm text-text-secondary">
            Track utility bills, facility maintenance, housekeeping purchases, and branch petty cash approvals
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onExportCsv && (
            <button
              type="button"
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card"
              title="Export Expenses CSV"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-success-text" aria-hidden="true" />
              CSV
            </button>
          )}
          {onExportExcel && (
            <button
              type="button"
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card"
              title="Export Formatted Excel Sheet (.xls)"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-success-text" aria-hidden="true" />
              Excel
            </button>
          )}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canMutate}
            title={!canMutate ? t('CREATE_BLOCKED') : undefined}
            onClick={onAddExpense}
          >
            <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
            {t('ADD_EXPENSE')}
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminAccountsExpensesHeaderSection;
