'use client';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Search, Download, X } from 'lucide-react';
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
  const [entries, setEntries] = useState<Entry[]>([...MOCK]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return entries.filter((e) => {
      const matchStatus = statusFilter === 'all' || e.status.toLowerCase() === statusFilter.toLowerCase();
      const matchShift = shiftFilter === 'all' || e.shift.toLowerCase().includes(shiftFilter.toLowerCase());
      const matchQ =
        !q ||
        e.shift.toLowerCase().includes(q) ||
        (e.settledBy && e.settledBy.toLowerCase().includes(q)) ||
        e.status.toLowerCase().includes(q);
      return matchStatus && matchShift && matchQ;
    });
  }, [entries, searchQuery, statusFilter, shiftFilter]);

  const hasActiveFilters = Boolean(searchQuery.trim() !== '' || statusFilter !== 'all' || shiftFilter !== 'all');

  const handleSettleShift = (shiftName: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.shift === shiftName
          ? { ...e, status: 'settled', settledBy: 'Branch Manager Satyam' }
          : e
      )
    );
    toast.success(`Shift "${shiftName}" settlement confirmed successfully!`);
  };

  const handleExportCsv = () => {
    const headers = 'Shift,Opening (INR),Cash (INR),UPI (INR),Expenses (INR),Closing (INR),Settled By,Status\n';
    const rows = filteredEntries
      .map((e) => `"${e.shift}","${e.openingBalance}","${e.cashCollected}","${e.upiCollected}","${e.expenses}","${e.closingBalance}","${e.settledBy || ''}","${e.status}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `daily_settlement_${date}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

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
          const shiftName = params.data.shift;
          return (
            <div className="h-full flex justify-end items-center">
              <button
                type="button"
                onClick={() => handleSettleShift(shiftName)}
                className="fin-badge fin-badge--success cursor-pointer hover:opacity-90 transition-opacity"
                title={`Settle shift ${shiftName}`}
              >
                Settle Shift
              </button>
            </div>
          );
        }
        return (
          <div className="h-full flex justify-end items-center">
            <span className="fin-cell-subtext text-xs text-success font-semibold">✓ Verified</span>
          </div>
        );
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

      <div className="fin-card p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-primary">Shift Settlements</h2>
            <span className="mgr-badge mgr-badge--info text-xs font-mono">{filteredEntries.length} Records</span>
          </div>

          {/* Multi-Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="search"
                placeholder="Search shift or settled by..."
                className="mgr-input pl-8 text-xs w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              aria-label="Filter by Settlement Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mgr-select text-xs py-1.5 px-3 min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="settled">Settled / Verified</option>
              <option value="pending">Pending</option>
            </select>

            <select
              aria-label="Filter by Shift"
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="mgr-select text-xs py-1.5 px-3 min-w-[120px]"
            >
              <option value="all">All Shifts</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
              <option value="Full Day">Full Day</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setShiftFilter('all');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
                title="Reset all filters"
              >
                <X size={13} /> Reset
              </button>
            )}

            <button
              type="button"
              onClick={handleExportCsv}
              className="mgr-btn-ghost flex items-center gap-1.5 text-xs whitespace-nowrap cursor-pointer"
              title="Export Daily Settlement as CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
        {filteredEntries.length === 0 ? (
          <div className="fin-empty-state py-12">
            <div className="fin-empty-state__icon">📋</div>
            <p className="fin-empty-state__title">
              {searchQuery ? 'No settlement entries matching your search query.' : tManagerUi('no_settlement_entries_for_this_date')}
            </p>
          </div>
        ) : (
          <div className="mgr-table-wrapper h-80">
            <ManagerAccountsDailySettlementNativeTable getRowKey={(row) => String(row.id)} rows={filteredEntries} columns={colDefs} labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }} />
          </div>
        )}
      </div>
    </div>
  );
}
