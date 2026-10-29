'use client';
import type { ManagerAccountsDailySettlementMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/types/ManagerAccountsDailySettlementMainTypes';
import type { Entry } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';
import { MANAGER_ACCOUNTING_SAMPLE_DAILY_SETTLEMENTS } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';
import { useTranslations } from 'next-intl';
import ManagerAccountsDailySettlementNativeTable, { NativeColumn, NativeCellParams } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_table_parts/ManagerAccountsDailySettlementNativeTable';

import { useManagerDailySettlementCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementFormattingHook';


// RESPONSIBILITY: Entry page for the manager_daily_settlement module.
// DATA FLOW: Next.js Router -> Page -> Components





function toLocalDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const MOCK = MANAGER_ACCOUNTING_SAMPLE_DAILY_SETTLEMENTS;

export default function ManagerAccountsDailySettlementPage({ view, id }: ManagerAccountsDailySettlementMainProps) {
  const tManagerUi = useTranslations('manager.manager_daily_settlement.ui');
  const formatManagerDailySettlementCurrency = useManagerDailySettlementCurrencyFormatter();
  const date = toLocalDateInputValue(new Date());
  const entries = MOCK;

  const totalCash = entries.reduce((s, e) => s + e.cashCollected, 0);
  const totalUpi  = entries.reduce((s, e) => s + e.upiCollected, 0);
  const totalExp  = entries.reduce((s, e) => s + e.expenses, 0);

  const colDefs: NativeColumn<Entry>[] = [
    { field: 'shift', headerName: tManagerUi('shift'), flex: 1, minWidth: 180, cellRenderer: (p: NativeCellParams) => <span className="fin-cell-name font-medium">{p.value}</span> },
    { 
      field: 'openingBalance', 
      headerName: tManagerUi('opening_inr'), 
      width: 130,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: NativeCellParams) => <span className="fin-cell-subtext text-sm">{formatManagerDailySettlementCurrency(Number(p.value ?? 0))}</span>
    },
    { 
      field: 'cashCollected', 
      headerName: tManagerUi('cash_inr'), 
      width: 120,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: NativeCellParams) => <span className="fin-text-success font-medium">{formatManagerDailySettlementCurrency(Number(p.value ?? 0))}</span>
    },
    { 
      field: 'upiCollected', 
      headerName: tManagerUi('upi_inr'), 
      width: 120,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: NativeCellParams) => <span className="fin-text-info font-medium">{formatManagerDailySettlementCurrency(Number(p.value ?? 0))}</span>
    },
    { 
      field: 'expenses', 
      headerName: tManagerUi('expenses_inr'), 
      width: 130,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: NativeCellParams) => <span className="fin-text-danger font-medium">{formatManagerDailySettlementCurrency(Number(p.value ?? 0))}</span>
    },
    { 
      field: 'closingBalance', 
      headerName: tManagerUi('closing_inr'), 
      width: 130,
      cellStyle: { textAlign: 'right', fontWeight: 600 },
      cellRenderer: (p: NativeCellParams) => <span className="fin-text-body">{formatManagerDailySettlementCurrency(Number(p.value ?? 0))}</span>
    },
    { field: 'settledBy', headerName: tManagerUi('settled_by'), width: 140, cellRenderer: (p: NativeCellParams) => <span className="fin-cell-subtext">{p.value}</span> },
    { 
      field: 'status', 
      headerName: tManagerUi('status'), 
      width: 120,
      cellRenderer: (p: NativeCellParams) => (
        <span className={`fin-badge ${p.value === 'settled' ? 'fin-badge--success' : 'fin-badge--warning'} inline-block mt-2`}>
          {p.value === 'settled' ? tManagerUi('completed') : p.value === 'pending' ? tManagerUi('pending') : tManagerUi('status')}
        </span>
      )
    },
    {
      headerName: tManagerUi('action'),
      width: 120,
      sortable: false,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (params: NativeCellParams<Entry>) => {
        if (params.data?.status === 'pending') {
          return (
            <div className="h-full flex justify-end items-center">
              <button
                type="button"
                className="fin-badge fin-badge--neutral cursor-not-allowed"
                disabled
                title={tManagerUi('settlement_unavailable_verified_backend_mutation_contrac_98bfe1')}
              >
                {tManagerUi('settlement_unavailable')}
              </button>
            </div>
          );
        }
        return null;
      }
    }
  ];

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="fin-page-title">{tManagerUi('daily_settlement')}</h1>
          <p className="fin-page-subtitle">{tManagerUi('shift_wise_cash_upi_reconciliation')}</p>
          <p className="fin-input-hint fin-text-warning" data-testid="manager-accounting-settlement-contract-warning" role="status">{tManagerUi('shift_balances_and_statuses_are_sample_records_settlemen_26c33a')}</p>
        </div>
        <input type="date" className="fin-input w-44" value={date} readOnly disabled aria-label={tManagerUi('sample_settlement_date')} title={tManagerUi('sample_snapshot_only_date_filtering_is_not_connected_to_9140bb')} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fin-kpi-card"><p className="fin-kpi-label fin-text-success">{tManagerUi('cash_collected')}</p><p className="fin-kpi-value fin-text-success">{formatManagerDailySettlementCurrency(totalCash)}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label fin-text-info">{tManagerUi('upi_collected')}</p><p className="fin-kpi-value fin-text-info">{formatManagerDailySettlementCurrency(totalUpi)}</p></div>
        <div className="fin-kpi-card fin-kpi-card--danger"><p className="fin-kpi-label fin-kpi-label--danger">{tManagerUi('expenses')}</p><p className="fin-kpi-value fin-kpi-value--danger">{formatManagerDailySettlementCurrency(totalExp)}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label">{tManagerUi('net')}</p><p className="fin-kpi-value">{formatManagerDailySettlementCurrency(totalCash + totalUpi - totalExp)}</p></div>
      </div>

      <div className="fin-card p-4">
        {entries.length === 0 ? (
          <div className="fin-empty-state py-12">
            <div className="fin-empty-state__icon">📋</div>
            <p className="fin-empty-state__title">{tManagerUi('no_settlement_entries_for_this_date')}</p>
          </div>
        ) : (
          <div className="mgr-table-wrapper h-80">
            <ManagerAccountsDailySettlementNativeTable getRowKey={(row) => String(row.id)} rows={entries} columns={colDefs} labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }} />
          </div>
        )}
      </div>
    </div>
  );
}
