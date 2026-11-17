'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { RefreshCw, Scale, Printer, Download, Eye, CheckCircle2, Clock, Coins } from 'lucide-react';
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
import { ManagerAccountsDailySettlementDetailsModal } from './ManagerAccountsDailySettlementDetailsModal';
import { ManagerAccountsDailySettlementDenominationAndHandoverModal } from '../manager_accounts_daily_settlement_dialogs/ManagerAccountsDailySettlementDenominationAndHandoverModal';
import { ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';

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
  const [selectedAuditEntry, setSelectedAuditEntry] = useState<Entry | null>(null);
  const [isDenominationModalOpen, setIsDenominationModalOpen] = useState(false);
  const [activeDenominationEntry, setActiveDenominationEntry] = useState<Entry | null>(null);

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

  const settledCount = entries.filter((e) => e.status.toLowerCase() === 'settled').length;
  const pendingCount = entries.filter((e) => e.status.toLowerCase() === 'pending').length;

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
    if (selectedAuditEntry && selectedAuditEntry.shift === shiftToSettle) {
      setSelectedAuditEntry({ ...selectedAuditEntry, status: 'settled', settledBy: 'Branch Manager Satyam' });
    }
    toast.success(`Shift "${shiftToSettle}" settlement confirmed successfully! (Physical cash verified)`);
    setPendingSettlementShift(null);
  };

  const escapeCsvCell = (val: unknown) => {
    let str = String(val ?? '');
    if (/^[\u0000-\u0020]*[=+\-@]/.test(str)) str = `'${str}`;
    return `"${str.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    const headers = [
      'Shift',
      'Opening (INR)',
      'Cash (INR)',
      'UPI (INR)',
      'Expenses (INR)',
      'Closing (INR)',
      'Settled By',
      'Status',
    ]
      .map(escapeCsvCell)
      .join(',');

    const rows = filteredEntries
      .map((e) =>
        [
          e.shift,
          (e.openingBalance / 100).toFixed(2),
          (e.cashCollected / 100).toFixed(2),
          (e.upiCollected / 100).toFixed(2),
          (e.expenses / 100).toFixed(2),
          (e.closingBalance / 100).toFixed(2),
          e.settledBy || '',
          e.status,
        ]
          .map(escapeCsvCell)
          .join(',')
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
        onViewDetails: (entry) => setSelectedAuditEntry(entry),
      }),
    [tManagerUi, formatManagerDailySettlementCurrency]
  );

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      {/* ── Executive Header Banner ── */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
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

          {/* Header Action Buttons in One Professional Single-Line Row */}
          <div className="flex items-center gap-2 flex-nowrap overflow-x-auto shrink-0 max-w-full py-1">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
              title="Print Daily Settlement Report"
            >
              <Printer size={14} />
              <span>Print Report</span>
            </button>

            <button
              type="button"
              onClick={handleSyncBalances}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-60 whitespace-nowrap shrink-0"
              title="Sync Drawer Balances"
            >
              {isSyncing ? <ButtonLoader icon="return" /> : <RefreshCw size={14} />}
              <span>{isSyncing ? 'Syncing...' : 'Sync Balances'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
              title="Export Daily Settlement as CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveDenominationEntry(filteredEntries[0] || entries[0] || null);
                setIsDenominationModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm hover:shadow-emerald-500/25 transition-all cursor-pointer whitespace-nowrap shrink-0"
              title="Currency Denomination Counter & Owner Handover Receipt"
            >
              <Coins size={14} />
              <span>Denomination & Owner Handover</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Specific Date Navigator Bar with Glowing Halos ── */}
      <ManagerAccountsDailySettlementTimeHorizonBar
        timeHorizon={timeHorizon}
        onChangeTimeHorizon={setTimeHorizon}
        settlementDate={settlementDate}
        onSettlementDateChange={setSettlementDate}
        sampleDateLabel={tManagerUi('sample_settlement_date')}
      />

      {/* ── Executive Reconciliation KPI Summary Cards (Clean Display Cards, NOT Interlinked Toggle Buttons) ── */}
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

      {/* ── Table Container with Multi-Filter Toolbar ── */}
      <div className="fin-card p-4 sm:p-5 space-y-4 rounded-2xl border border-border bg-card shadow-sm">
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
          counts={{
            all: entries.length,
            settled: settledCount,
            pending: pendingCount,
          }}
        />

        {filteredEntries.length === 0 ? (
          <div className="fin-empty-state py-12 text-center space-y-2">
            <div className="text-3xl" aria-hidden="true">📋</div>
            <p className="font-semibold text-primary text-sm">
              {searchQuery
                ? 'No settlement entries matching your search query.'
                : `No settlement entries recorded for ${dateScopeLabel}.`}
            </p>
            {hasActiveFilters || timeHorizon !== 'all' ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setShiftFilter('all');
                  setTimeHorizon('all');
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-xs transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="mgr-table-wrapper">
            <ManagerAccountsDailySettlementNativeTable
              getRowKey={(row) => String(row.id)}
              rows={filteredEntries}
              columns={colDefs}
              labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }}
            />
          </div>
        )}
      </div>

      {/* ── Confirm Shift Settlement Modal ── */}
      <ManagerAccountsDailySettlementConfirmModal
        isOpen={Boolean(pendingSettlementShift)}
        shiftName={pendingSettlementShift}
        onConfirm={handleConfirmSettleShift}
        onCancel={() => setPendingSettlementShift(null)}
      />

      {/* ── Shift Reconciliation Audit Details Modal ── */}
      <ManagerAccountsDailySettlementDetailsModal
        isOpen={Boolean(selectedAuditEntry)}
        entry={selectedAuditEntry}
        dateScopeLabel={dateScopeLabel}
        formatCurrency={formatManagerDailySettlementCurrency}
        onClose={() => setSelectedAuditEntry(null)}
        onSettleShift={handleRequestSettleShift}
      />

      {/* ── Currency Denomination Counter & Owner Handover Receipt Modal ── */}
      <ManagerAccountsDailySettlementDenominationAndHandoverModal
        isOpen={isDenominationModalOpen}
        entry={activeDenominationEntry}
        formatCurrency={formatManagerDailySettlementCurrency}
        onClose={() => setIsDenominationModalOpen(false)}
        onConfirmSettlement={({ handoverToOwner, ownerName }) => {
          if (activeDenominationEntry) {
            setEntries((prev) =>
              prev.map((e) =>
                e.shift === activeDenominationEntry.shift
                  ? { ...e, status: 'settled', settledBy: 'Branch Manager Satyam' }
                  : e
              )
            );
          }
          toast.success(`Handover of ₹${handoverToOwner.toLocaleString('en-IN')} to ${ownerName} confirmed!`);
          setIsDenominationModalOpen(false);
        }}
      />
    </div>
  );
}
