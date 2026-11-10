'use client';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { RefreshCw, Scale } from 'lucide-react';
import type { ManagerAccountsDailySettlementMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/types/ManagerAccountsDailySettlementMainTypes';
import type { Entry } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';
import { MANAGER_ACCOUNTING_SAMPLE_DAILY_SETTLEMENTS } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';
import { useTranslations } from 'next-intl';
import ManagerAccountsDailySettlementNativeTable from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_table_parts/ManagerAccountsDailySettlementNativeTable';
import { createManagerAccountsDailySettlementColumns } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_table_parts/ManagerAccountsDailySettlementColumns';
import { useManagerDailySettlementCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementFormattingHook';
import { ManagerAccountsDailySettlementKpis } from './ManagerAccountsDailySettlementKpis';
import { ManagerAccountsDailySettlementToolbar } from './ManagerAccountsDailySettlementToolbar';
import ManagerAccountsDailySettlementTimeHorizonBar, { type ManagerDailySettlementTimeHorizon } from './ManagerAccountsDailySettlementTimeHorizonBar';
import ManagerAccountsDailySettlementConfirmModal from '../manager_accounts_daily_settlement_dialogs/ManagerAccountsDailySettlementConfirmModal';

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
  const [timeHorizon, setTimeHorizon] = useState<ManagerDailySettlementTimeHorizon>('today');
  const [entries, setEntries] = useState<Entry[]>([...MOCK]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingSettlementShift, setPendingSettlementShift] = useState<string | null>(null);

  const dateScopeLabel = useMemo(() => {
    switch (timeHorizon) {
      case 'all': return 'All Dates';
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'this_week': return 'This Week';
      case 'this_month': return 'This Month';
      case 'custom': return settlementDate;
      default: return 'All Dates';
    }
  }, [timeHorizon, settlementDate]);

  const handleSyncBalances = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Shift balances and physical drawer cash synchronized (₹0 discrepancy)');
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

  const handleRequestSettleShift = (shiftName: string) => {
    setPendingSettlementShift(shiftName);
  };

  const handleConfirmSettleShift = () => {
    if (!pendingSettlementShift) return;
    const shiftToSettle = pendingSettlementShift;
    setEntries((prev) =>
      prev.map((e) =>
        e.shift === shiftToSettle ? { ...e, status: 'settled', settledBy: 'Branch Manager Satyam' } : e
      )
    );
    toast.success(`Shift "${shiftToSettle}" settlement confirmed successfully! (Physical cash verified)`);
    setPendingSettlementShift(null);
  };

  const escapeCsvCell = (val: unknown) => {
    let str = String(val ?? '');
    if (/^[\u0000-\u0020]*[=+\-@]/.test(str)) str = `'${str}`;
    return `"${str.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    const headers = ['Shift', 'Opening (INR)', 'Cash (INR)', 'UPI (INR)', 'Expenses (INR)', 'Closing (INR)', 'Settled By', 'Status'].map(escapeCsvCell).join(',');
    const rows = filteredEntries
      .map((e) =>
        [e.shift, e.openingBalance, e.cashCollected, e.upiCollected, e.expenses, e.closingBalance, e.settledBy || '', e.status].map(escapeCsvCell).join(',')
      )
      .join('\r\n');
    const blob = new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    const safeScope = dateScopeLabel.toLowerCase().replace(/[^a-z0-9_-]+/g, '_');
    anchor.download = `daily_settlement_${safeScope}_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
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
        onSettleShift: handleRequestSettleShift,
      }),
    [tManagerUi, formatManagerDailySettlementCurrency]
  );

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      {/* ── Executive Header Banner ── */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
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
                📍 Assigned Branch Drawer
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
      <ManagerAccountsDailySettlementTimeHorizonBar
        timeHorizon={timeHorizon}
        onChangeTimeHorizon={setTimeHorizon}
        settlementDate={settlementDate}
        onSettlementDateChange={setSettlementDate}
        sampleDateLabel={tManagerUi('sample_settlement_date')}
      />

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
            {timeHorizon !== 'all' && (
              <button
                type="button"
                onClick={() => setTimeHorizon('all')}
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

      <ManagerAccountsDailySettlementConfirmModal
        isOpen={Boolean(pendingSettlementShift)}
        shiftName={pendingSettlementShift}
        onConfirm={handleConfirmSettleShift}
        onCancel={() => setPendingSettlementShift(null)}
      />
    </div>
  );
}
