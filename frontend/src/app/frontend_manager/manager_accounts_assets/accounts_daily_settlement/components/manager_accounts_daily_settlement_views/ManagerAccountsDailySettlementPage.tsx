'use client';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Search,
  Download,
  X,
  Calendar,
  RefreshCw,
  Coins,
  QrCode,
  TrendingDown,
  Scale,
  CheckCircle2,
  Building2,
  ArrowRight,
} from 'lucide-react';
import type { ManagerAccountsDailySettlementMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/types/ManagerAccountsDailySettlementMainTypes';
import type { Entry } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';
import { MANAGER_ACCOUNTING_SAMPLE_DAILY_SETTLEMENTS } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';
import { useTranslations } from 'next-intl';
import ManagerAccountsDailySettlementNativeTable, {
  NativeColumn,
  NativeCellParams,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_table_parts/ManagerAccountsDailySettlementNativeTable';

import { useManagerDailySettlementCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementFormattingHook';

// RESPONSIBILITY: Entry page for the manager_daily_settlement module with Executive Treasury Balancing & Specific Date Navigation.
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

  const todayStr = toLocalDateInputValue(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = toLocalDateInputValue(yesterdayDate);

  const [settlementDate, setSettlementDate] = useState(todayStr);
  const [isAllDates, setIsAllDates] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([...MOCK]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);

  const dateScopeLabel = useMemo(() => {
    if (isAllDates) return 'All Dates';
    if (settlementDate === todayStr) return 'Today';
    if (settlementDate === yesterdayStr) return 'Yesterday';
    return settlementDate;
  }, [isAllDates, settlementDate, todayStr, yesterdayStr]);

  const handleSyncBalances = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Shift balances and physical drawer cash synchronized');
    }, 600);
  };

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
        e.shift === shiftName ? { ...e, status: 'settled', settledBy: 'Branch Manager Satyam' } : e
      )
    );
    toast.success(`Shift "${shiftName}" settlement confirmed successfully!`);
  };

  const handleExportCsv = () => {
    const headers = `Daily Settlement Export - Scope: ${dateScopeLabel}\nShift,Opening (INR),Cash (INR),UPI (INR),Expenses (INR),Closing (INR),Settled By,Status\n`;
    const rows = filteredEntries
      .map(
        (e) =>
          `"${e.shift}","${e.openingBalance}","${e.cashCollected}","${e.upiCollected}","${e.expenses}","${e.closingBalance}","${e.settledBy || ''}","${e.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `daily_settlement_${dateScopeLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Daily settlement exported to CSV successfully');
  };

  const totalCash = entries.reduce((s, e) => s + e.cashCollected, 0);
  const totalUpi = entries.reduce((s, e) => s + e.upiCollected, 0);
  const totalExp = entries.reduce((s, e) => s + e.expenses, 0);
  const netSurplus = totalCash + totalUpi - totalExp;

  const colDefs: NativeColumn<Entry>[] = [
    {
      field: 'shift',
      headerName: tManagerUi('shift'),
      flex: 1,
      minWidth: 180,
      cellRenderer: (p: NativeCellParams) => (
        <span className="font-semibold text-primary text-xs">{p.value}</span>
      ),
    },
    {
      field: 'openingBalance',
      headerName: tManagerUi('opening_inr'),
      width: 130,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: NativeCellParams) => (
        <span className="text-secondary text-xs font-mono">
          {formatManagerDailySettlementCurrency(Number(p.value ?? 0))}
        </span>
      ),
    },
    {
      field: 'cashCollected',
      headerName: tManagerUi('cash_inr'),
      width: 120,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: NativeCellParams) => (
        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs font-mono">
          {formatManagerDailySettlementCurrency(Number(p.value ?? 0))}
        </span>
      ),
    },
    {
      field: 'upiCollected',
      headerName: tManagerUi('upi_inr'),
      width: 120,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: NativeCellParams) => (
        <span className="text-blue-600 dark:text-blue-400 font-bold text-xs font-mono">
          {formatManagerDailySettlementCurrency(Number(p.value ?? 0))}
        </span>
      ),
    },
    {
      field: 'expenses',
      headerName: tManagerUi('expenses_inr'),
      width: 130,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (p: NativeCellParams) => (
        <span className="text-rose-600 dark:text-rose-400 font-bold text-xs font-mono">
          {formatManagerDailySettlementCurrency(Number(p.value ?? 0))}
        </span>
      ),
    },
    {
      field: 'closingBalance',
      headerName: tManagerUi('closing_inr'),
      width: 130,
      cellStyle: { textAlign: 'right', fontWeight: 600 },
      cellRenderer: (p: NativeCellParams) => (
        <span className="text-primary font-black text-xs font-mono">
          {formatManagerDailySettlementCurrency(Number(p.value ?? 0))}
        </span>
      ),
    },
    {
      field: 'settledBy',
      headerName: tManagerUi('settled_by'),
      width: 150,
      cellRenderer: (p: NativeCellParams) => (
        <span className="text-secondary text-xs">{p.value || '—'}</span>
      ),
    },
    {
      field: 'status',
      headerName: tManagerUi('status'),
      width: 120,
      cellRenderer: (p: NativeCellParams) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            p.value === 'settled'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
          }`}
        >
          {p.value === 'settled'
            ? tManagerUi('completed')
            : p.value === 'pending'
            ? tManagerUi('pending')
            : tManagerUi('status')}
        </span>
      ),
    },
    {
      headerName: tManagerUi('action'),
      width: 130,
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
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                title={`Settle shift ${shiftName}`}
              >
                Settle Shift
              </button>
            </div>
          );
        }
        return (
          <div className="h-full flex justify-end items-center">
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 size={13} /> Verified
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      {/* ── Executive Header Banner ── */}
      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-semibold text-primary uppercase tracking-wider">Treasury Operations</span>
              <span className="text-border">•</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Scale size={12} />
                Shift Balancing & Reconciliation
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-secondary/10 text-secondary border border-border">
                📍 Central Branch
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
                {tManagerUi('daily_settlement')}
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-md bg-primary-subtle text-primary font-bold">
                {filteredEntries.length} Shifts • Scope: {dateScopeLabel}
              </span>
            </div>

            <p className="text-sm text-secondary">
              {tManagerUi('shift_wise_cash_upi_reconciliation')} • Date: {dateScopeLabel}
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex items-center flex-wrap gap-2.5 sm:self-start lg:self-center">
            <button
              type="button"
              onClick={handleSyncBalances}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 min-h-11 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:border-border-strong hover:bg-surface-hover motion-safe:transition-all shadow-sm active:scale-95 disabled:opacity-60"
              title="Sync Drawer Balances"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin text-primary' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Balances'}</span>
            </button>
          </div>
        </div>

        {/* Contract Warning Banner */}
        <p
          className="mt-4 rounded-xl border border-warning/20 bg-warning/5 p-3 text-xs text-warning leading-relaxed"
          data-testid="manager-accounting-settlement-contract-warning"
          role="status"
        >
          {tManagerUi('shift_balances_and_statuses_are_sample_records_settlemen_26c33a')}
        </p>
      </div>

      {/* ── Specific Date Navigator Bar ── */}
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-primary shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Settlement Audit Date:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Date Selectors: All Dates | Today | Yesterday */}
          <div className="inline-flex bg-muted/60 p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setIsAllDates(true)}
              className={`min-h-8 px-3 py-1 text-xs font-medium rounded-lg motion-safe:transition-all ${
                isAllDates
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              All Dates
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAllDates(false);
                setSettlementDate(todayStr);
              }}
              className={`min-h-8 px-3 py-1 text-xs font-medium rounded-lg motion-safe:transition-all ${
                !isAllDates && settlementDate === todayStr
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAllDates(false);
                setSettlementDate(yesterdayStr);
              }}
              className={`min-h-8 px-3 py-1 text-xs font-medium rounded-lg motion-safe:transition-all ${
                !isAllDates && settlementDate === yesterdayStr
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Yesterday
            </button>
          </div>

          {/* Date Picker Input */}
          <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border">
            <input
              type="date"
              className="px-2.5 py-1 bg-card border border-border rounded-lg text-xs font-semibold text-primary outline-none focus:border-primary"
              value={settlementDate}
              onChange={(e) => {
                setIsAllDates(false);
                setSettlementDate(e.target.value);
              }}
              aria-label={tManagerUi('sample_settlement_date')}
              title={tManagerUi('sample_snapshot_only_date_filtering_is_not_connected_to_9140bb')}
            />
          </div>
        </div>
      </div>

      {/* ── Executive Reconciliation KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cash Collected */}
        <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
              {tManagerUi('cash_collected')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Coins size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
                {formatManagerDailySettlementCurrency(totalCash)}
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-emerald-600 dark:text-emerald-400 border border-border">
                [{dateScopeLabel}]
              </span>
            </div>
            <p className="mt-1 text-xs text-secondary">Physical cash drawer total ({dateScopeLabel})</p>
          </div>
        </div>

        {/* UPI Collected */}
        <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
              {tManagerUi('upi_collected')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <QrCode size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400 font-mono">
                {formatManagerDailySettlementCurrency(totalUpi)}
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-blue-600 dark:text-blue-400 border border-border">
                [{dateScopeLabel}]
              </span>
            </div>
            <p className="mt-1 text-xs text-secondary">Direct bank / QR settlements ({dateScopeLabel})</p>
          </div>
        </div>

        {/* Expenses Disbursed */}
        <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
              {tManagerUi('expenses')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <TrendingDown size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 font-mono">
                {formatManagerDailySettlementCurrency(totalExp)}
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-rose-600 dark:text-rose-400 border border-border">
                [{dateScopeLabel}]
              </span>
            </div>
            <p className="mt-1 text-xs text-secondary">Petty cash paid from counter ({dateScopeLabel})</p>
          </div>
        </div>

        {/* Net Shift Surplus */}
        <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
              {tManagerUi('net')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Scale size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl font-bold tracking-tight text-primary font-mono">
                {formatManagerDailySettlementCurrency(netSurplus)}
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
                [{dateScopeLabel}]
              </span>
            </div>
            <p className="mt-1 text-xs text-secondary">Net realized vault closing balance ({dateScopeLabel})</p>
          </div>
        </div>
      </div>

      {/* ── Table Container with Toolbar ── */}
      <div className="fin-card p-5 space-y-4 rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-primary">Shift Settlements Register</h2>
            <span className="mgr-badge mgr-badge--info text-xs font-mono">
              Showing {filteredEntries.length} of {entries.length} Shifts ({dateScopeLabel})
            </span>
          </div>

          {/* Multi-Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="search"
                placeholder="Search shift or settled by..."
                className="w-full pl-9 pr-3 py-1.5 bg-muted/40 border border-border rounded-lg text-xs text-primary outline-none focus:border-primary focus:bg-card"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              aria-label="Filter by Settlement Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-h-9 py-1 px-3 bg-muted/40 border border-border rounded-lg text-xs font-medium text-primary outline-none focus:border-primary focus:bg-card cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="settled">Settled / Verified</option>
              <option value="pending">Pending</option>
            </select>

            <select
              aria-label="Filter by Shift"
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="min-h-9 py-1 px-3 bg-muted/40 border border-border rounded-lg text-xs font-medium text-primary outline-none focus:border-primary focus:bg-card cursor-pointer"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:border-border-strong hover:bg-surface-hover motion-safe:transition-all shadow-sm shrink-0"
              title="Export Daily Settlement as CSV"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="fin-empty-state py-12 text-center space-y-2">
            <div className="text-3xl" aria-hidden="true">📋</div>
            <p className="font-semibold text-primary text-sm">
              {searchQuery
                ? 'No settlement entries matching your search query.'
                : `No settlement entries recorded for ${dateScopeLabel}.`}
            </p>
            {!isAllDates && (
              <button
                type="button"
                onClick={() => setIsAllDates(true)}
                className="mt-2 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-xs transition-all cursor-pointer"
              >
                View All Dates
              </button>
            )}
          </div>
        ) : (
          <div className="mgr-table-wrapper h-80">
            <ManagerAccountsDailySettlementNativeTable
              getRowKey={(row) => String(row.id)}
              rows={filteredEntries}
              columns={colDefs}
              labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
