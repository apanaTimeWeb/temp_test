// RESPONSIBILITY: Define or render the table structure for the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Define or render the table structure for the components feature. It does not own backend persistence or cross-feature business logic.
import type { NativeColumn, NativeCellParams } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_table_parts/ManagerAccountsExpensesNativeTable';
import { Trash2 } from 'lucide-react';
import type { ManagerAccountsExpensesExpenseSample } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/hooks/ManagerAccountsExpensesDemoRepository';
import type { CurrencyFormatter, Labels, PaymentMode } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';






const MODE_BADGE: Record<PaymentMode, string> = {
  cash: 'fin-badge fin-badge--cash',
  upi: 'fin-badge fin-badge--upi',
  card: 'fin-badge fin-badge--card',
  bank: 'fin-badge fin-badge--bank',
};

/** Build localized, presentation-only column definitions for the sample expense ledger. */
export function createManagerExpensesExpenseColumnDefinitions(
  labels: Labels,
  formatCurrency: CurrencyFormatter,
): NativeColumn<ManagerAccountsExpensesExpenseSample>[] {
  return [
    {
      field: 'date',
      headerName: labels.date,
      width: 130,
      cellRenderer: (params: NativeCellParams<ManagerAccountsExpensesExpenseSample>) => (
        <span className="fin-cell-subtext">{params.value}</span>
      ),
    },
    {
      field: 'category',
      headerName: labels.category,
      width: 150,
      cellRenderer: (params: NativeCellParams<ManagerAccountsExpensesExpenseSample>) => (
        <span className="fin-badge fin-badge--neutral mt-2 inline-block">{params.value}</span>
      ),
    },
    {
      field: 'description',
      headerName: labels.description,
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: NativeCellParams<ManagerAccountsExpensesExpenseSample>) => (
        <span className="fin-text-body">{params.value}</span>
      ),
    },
    {
      field: 'amount',
      headerName: labels.amount,
      width: 140,
      cellStyle: { textAlign: 'right', fontWeight: 600 },
      cellRenderer: (params: NativeCellParams<ManagerAccountsExpensesExpenseSample>) => (
        <span className="fin-text-danger">{formatCurrency(Number(params.value ?? 0))}</span>
      ),
    },
    {
      field: 'mode',
      headerName: labels.mode,
      width: 120,
      cellRenderer: (params: NativeCellParams<ManagerAccountsExpensesExpenseSample>) => {
        const mode = params.value as PaymentMode;
        return <span className={`${MODE_BADGE[mode]} mt-2 inline-block capitalize`}>{mode}</span>;
      },
    },
    {
      field: 'paidBy',
      headerName: labels.paidBy,
      width: 140,
      cellRenderer: (params: NativeCellParams<ManagerAccountsExpensesExpenseSample>) => (
        <span className="fin-text-body">{params.value}</span>
      ),
    },
    {
      headerName: labels.actions,
      width: 100,
      sortable: false,
      cellStyle: { textAlign: 'right' },
      cellRenderer: () => (
        <div className="h-full flex justify-end items-center">
          <button
            type="button"
            className="fin-badge fin-badge--danger cursor-not-allowed"
            disabled
            title={labels.deleteUnavailable}
            aria-label={labels.deleteUnavailable}
          >
            <Trash2 size={14} aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];
}
