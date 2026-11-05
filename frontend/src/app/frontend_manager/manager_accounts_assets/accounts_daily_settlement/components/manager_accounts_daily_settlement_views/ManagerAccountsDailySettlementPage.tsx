'use client';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Calendar, RefreshCw, Scale } from 'lucide-react';
import type { ManagerAccountsDailySettlementMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/types/ManagerAccountsDailySettlementMainTypes';
import type { Entry } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';
import { MANAGER_ACCOUNTING_SAMPLE_DAILY_SETTLEMENTS } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';
import { useTranslations } from 'next-intl';
import ManagerAccountsDailySettlementNativeTable from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_table_parts/ManagerAccountsDailySettlementNativeTable';
import { createManagerAccountsDailySettlementColumns } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_table_parts/ManagerAccountsDailySettlementColumns';
import { useManagerDailySettlementCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementFormattingHook';
import { ManagerAccountsDailySettlementKpis } from './ManagerAccountsDailySettlementKpis';
import { ManagerAccountsDailySettlementToolbar } from './ManagerAccountsDailySettlementToolbar';

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

  const colDefs = useMemo(
    () =>
      createManagerAccountsDailySettlementColumns({
        labels: {
          shift: tManagerUi('shift'),
          opening: tManagerUi('opening_inr'),
          cash: tManagerUi('cash_inr'),
          upi: tManagerUi('upi_inr'),
          expenses: tManagerUi('expenses_inr'),
          closing: tManagerUi('closing_inr'),
          settledBy: tManagerUi('settled_by'),
          status: tManagerUi('status'),
          completed: tManagerUi('completed'),
          pending: tManagerUi('pending'),
          action: tManagerUi('action'),
        },
        formatCurrency: formatManagerDailySettlementCurrency,
        onSettleShift: handleSettleShift,
      }),
    [tManagerUi, formatManagerDailySettlementCurrency]
  );

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      {/* ── Executive Header Banner ── */}
      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-semibold text-primary uppercase tracking-wider">Treasury Operations</span>
              <span className="text-border">•</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-success-bg text-success border border-border">
                <Scale size={12} />
                Shift Balancing & Reconciliation
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-muted text-secondary border border-border">
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
          className="mt-4 rounded-xl border border-border bg-warning-bg p-3 text-xs text-warning leading-relaxed"
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
          <div className="inline-flex bg-muted p-1 rounded-xl border border-border">
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
          <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl border border-border">
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
      <ManagerAccountsDailySettlementKpis
        totalCash={totalCash}
        totalUpi={totalUpi}
        totalExp={totalExp}
        netSurplus={netSurplus}
        dateScopeLabel={dateScopeLabel}
        formatCurrency={formatManagerDailySettlementCurrency}
        labels={{
          cashCollected: tManagerUi('cash_collected'),
          upiCollected: tManagerUi('upi_collected'),
          expenses: tManagerUi('expenses'),
          net: tManagerUi('net'),
        }}
      />

      {/* ── Table Container with Toolbar ── */}
      <div className="fin-card p-5 space-y-4 rounded-2xl border border-border bg-card shadow-sm">
        <ManagerAccountsDailySettlementToolbar
          filteredCount={filteredEntries.length}
          totalCount={entries.length}
          dateScopeLabel={dateScopeLabel}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          shiftFilter={shiftFilter}
          setShiftFilter={setShiftFilter}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={() => {
            setSearchQuery('');
            setStatusFilter('all');
            setShiftFilter('all');
          }}
          onExportCsv={handleExportCsv}
        />

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
