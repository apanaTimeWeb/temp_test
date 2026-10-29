'use client';
// RESPONSIBILITY: Render the accounts expenses expense ledger component within the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the accounts expenses expense ledger component within the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import ManagerAccountsExpensesNativeTable from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_table_parts/ManagerAccountsExpensesNativeTable';
import type { ManagerAccountsExpensesExpenseLedgerProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';





export default function ManagerAccountsExpensesExpenseLedger({ rows, columnDefs, emptyMessage }: ManagerAccountsExpensesExpenseLedgerProps) {
  const tManagerUi = useTranslations('manager.manager_expenses.ui');
  return (
    <div className="fin-card p-4">
      {rows.length === 0 ? (
        <div className="fin-empty-state py-12">
          <div className="fin-empty-state__icon" aria-hidden="true">💸</div>
          <p className="fin-empty-state__title">{emptyMessage}</p>
        </div>
      ) : (
        <div className="mgr-table-wrapper h-112">
          <ManagerAccountsExpensesNativeTable getRowKey={(row) => String(row.id)} rows={[...rows]} columns={columnDefs} labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }} />
        </div>
      )}
    </div>
  );
}
