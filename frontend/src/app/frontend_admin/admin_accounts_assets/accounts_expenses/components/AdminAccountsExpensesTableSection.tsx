'use client';
// RESPONSIBILITY: AdminAccountsExpensesTableSection component owned by admin_accounting; responsibility folder: admin_accounts_expenses_sections.

import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Trash2 } from 'lucide-react';
import { DataGrid, type DataGridCellParams, type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminAccountingExpense } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/schemas/AdminAccountsExpensesSchemas';
import { ADMIN_ACCOUNTING_EXPENSE_MODE_BADGE } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/config/admin_accounts_expenses.url_config';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/utils/AdminAccountsExpensesFormatCurrency';
import type { AdminAccountsExpensesTableSectionProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';


const CATEGORY_TRANSLATION_KEY = {
  Electricity: 'CATEGORY_ELECTRICITY',
  Maintenance: 'CATEGORY_MAINTENANCE',
  Stationery: 'CATEGORY_STATIONERY',
  Internet: 'CATEGORY_INTERNET',
  Cleaning: 'CATEGORY_CLEANING',
  Salary: 'CATEGORY_SALARY',
  Rent: 'CATEGORY_RENT',
  Miscellaneous: 'CATEGORY_MISCELLANEOUS',
} as const;

/** Owns expense table columns, localized value labels, empty state, and row-level delete initiation. */
export function AdminAccountsExpensesTableSection({ expenses, onRequestDelete, canMutate }: AdminAccountsExpensesTableSectionProps) {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-accounting-admin-accounting-expenses-table-section-1-page', 0);

  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSES');
  const columnDefs = useMemo<DataGridColumn<AdminAccountingExpense>[]>(() => [
    { field: 'date', headerName: t('DATE'), width: 130, sortable: true },
    {
      field: 'category', headerName: t('CATEGORY'), width: 150, sortable: true,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => {
        const value = String(params.value ?? '—');
        const key = CATEGORY_TRANSLATION_KEY[value as keyof typeof CATEGORY_TRANSLATION_KEY];
        return <span className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm font-medium bg-card text-text-secondary">{key ? t(key) : value}</span>;
      },
    },
    { field: 'description', headerName: t('DESCRIPTION'), minWidth: 220, flex: 1, sortable: true },
    { field: 'amount', headerName: t('AMOUNT'), width: 150, sortable: true, cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => <span className="text-danger-text">{formatAdminAccountingCurrency(Number(params.value ?? 0), locale)}</span> },
    {
      field: 'mode', headerName: t('MODE'), width: 120, sortable: true,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => {
        const mode: AdminAccountingExpense['mode'] = params.data.mode;
        const modeKey = ({ cash: 'MODE_CASH', upi: 'MODE_UPI', card: 'MODE_CARD', bank: 'MODE_BANK' } as const)[mode];
        return <span className={ADMIN_ACCOUNTING_EXPENSE_MODE_BADGE[mode] ?? 'inline-flex items-center rounded-md border border-border px-3 py-2 text-sm font-medium border border-border bg-card text-text-secondary'}>{modeKey ? t(modeKey) : String(mode ?? '—')}</span>;
      },
    },
    { field: 'paidBy', headerName: t('PAID_BY'), width: 140, sortable: true },
    {
      headerName: t('ACTIONS'), width: 110, sortable: false,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => <button type="button" data-testid={`admin_accounting-expenses-delete-${params.data.id}`} aria-label={t('DELETE_EXPENSE', { description: params.data.description })} className="inline-flex items-center rounded-md border border-border px-3 py-2 text-sm font-medium bg-danger-bg text-danger-text min-h-11 min-w-11 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" disabled={!canMutate} title={!canMutate ? t('DELETE_BLOCKED') : undefined} onClick={(event) => { event.stopPropagation(); onRequestDelete(params.data); }}><Trash2 size={18} strokeWidth={2} aria-hidden="true" /></button>,
    },
  ], [locale, onRequestDelete, t]);

  return (
    <section aria-label={t('TABLE_ARIA')} className="rounded-xl border border-border bg-card shadow-card p-4">
      {expenses.length === 0
        ? <div role="status" aria-live="polite" className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center"><p className="font-medium text-text-primary">{t('NO_EXPENSES')}</p><p className="mt-1 text-sm text-text-secondary">{t('EMPTY_DESCRIPTION')}</p></div>
        : <div className="overflow-x-auto"><DataGrid rowData={[...expenses]} columnDefs={columnDefs} rowHeight={56} pagination pageSize={10}  page={urlTablePage0} onPageChange={setUrlTablePage0}/></div>}
    </section>
  );
}

export default AdminAccountsExpensesTableSection;


export type { AdminAccountsExpensesTableSectionProps };
