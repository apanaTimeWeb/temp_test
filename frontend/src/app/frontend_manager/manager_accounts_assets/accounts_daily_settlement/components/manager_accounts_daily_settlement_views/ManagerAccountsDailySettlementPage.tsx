'use client';

import ManagerAccountsDailySettlementConfirmModal from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_dialogs/ManagerAccountsDailySettlementConfirmModal';
import { ManagerAccountsDailySettlementDenominationAndHandoverModal } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_dialogs/ManagerAccountsDailySettlementDenominationAndHandoverModal';
import { createManagerAccountsDailySettlementColumns } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_table_parts/ManagerAccountsDailySettlementColumns';
import ManagerAccountsDailySettlementNativeTable from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_table_parts/ManagerAccountsDailySettlementNativeTable';
import { ManagerAccountsDailySettlementDetailsModal } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_views/ManagerAccountsDailySettlementDetailsModal';
import { ManagerAccountsDailySettlementHeader } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_views/ManagerAccountsDailySettlementHeader';
import { ManagerAccountsDailySettlementKpis } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_views/ManagerAccountsDailySettlementKpis';
import ManagerAccountsDailySettlementTimeHorizonBar, {
  type ManagerDailySettlementTimeHorizon,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_views/ManagerAccountsDailySettlementTimeHorizonBar';
import { ManagerAccountsDailySettlementToolbar } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_views/ManagerAccountsDailySettlementToolbar';
import {
  MANAGER_ACCOUNTING_SAMPLE_DAILY_SETTLEMENTS,
  type Entry,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';
import { useManagerDailySettlementCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementFormattingHook';
import type { ManagerAccountsDailySettlementMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/types/ManagerAccountsDailySettlementMainTypes';
import { formatInrRupees } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/utils/ManagerAccountsDailySettlementDenominationHelpers';
import { exportDailySettlementsCsv } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/utils/ManagerAccountsDailySettlementExport';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

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

  const [settlementDate, setSettlementDate] = useState(() => toLocalDateInputValue(new Date()));
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
      toast.success(`Shift balances and physical drawer cash synchronized (${formatInrRupees(0)} discrepancy)`, {
        id: 'manager-settlement-sync-balances',
      });
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

  const handleRequestSettleShift = (shiftName: string) => setPendingSettlementShift(shiftName);

  const handleConfirmSettleShift = () => {
    if (!pendingSettlementShift) return;
    const shiftToSettle = pendingSettlementShift;
    setEntries((prev) =>
      prev.map((e) => (e.shift === shiftToSettle ? { ...e, status: 'settled', settledBy: 'Branch Manager Satyam' } : e))
    );
    if (selectedAuditEntry && selectedAuditEntry.shift === shiftToSettle) {
      setSelectedAuditEntry({ ...selectedAuditEntry, status: 'settled', settledBy: 'Branch Manager Satyam' });
    }
    toast.success(`Shift "${shiftToSettle}" settlement confirmed successfully! (Physical cash verified)`, {
      id: 'manager-settlement-confirm-shift',
    });
    setPendingSettlementShift(null);
  };

  const handleExportCsv = () => {
    exportDailySettlementsCsv(filteredEntries, dateScopeLabel);
    toast.success('Daily settlement exported to CSV successfully', { id: 'manager-settlement-export-csv' });
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
      <ManagerAccountsDailySettlementHeader
        title={tManagerUi('daily_settlement')}
        subtitle={tManagerUi('shift_wise_cash_upi_reconciliation')}
        filteredCount={filteredEntries.length}
        dateScopeLabel={dateScopeLabel}
        isSyncing={isSyncing}
        onSyncBalances={handleSyncBalances}
        onExportCsv={handleExportCsv}
        onOpenDenomination={() => {
          setActiveDenominationEntry(filteredEntries[0] || entries[0] || null);
          setIsDenominationModalOpen(true);
        }}
      />

      <ManagerAccountsDailySettlementTimeHorizonBar
        timeHorizon={timeHorizon}
        onChangeTimeHorizon={setTimeHorizon}
        settlementDate={settlementDate}
        onSettlementDateChange={setSettlementDate}
        sampleDateLabel={tManagerUi('sample_settlement_date')}
      />

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
          counts={{ all: entries.length, settled: settledCount, pending: pendingCount }}
        />

        {filteredEntries.length === 0 ? (
          <div className="fin-empty-state py-12 text-center space-y-2">
            <div className="text-3xl" aria-hidden="true">📋</div>
            <p className="font-semibold text-primary text-sm">
              {searchQuery ? 'No settlement entries matching your search query.' : `No settlement entries recorded for ${dateScopeLabel}.`}
            </p>
            {(hasActiveFilters || timeHorizon !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setShiftFilter('all');
                  setTimeHorizon('all');
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-xs motion-safe:transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
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

      <ManagerAccountsDailySettlementConfirmModal
        isOpen={Boolean(pendingSettlementShift)}
        shiftName={pendingSettlementShift}
        onConfirm={handleConfirmSettleShift}
        onCancel={() => setPendingSettlementShift(null)}
      />

      <ManagerAccountsDailySettlementDetailsModal
        isOpen={Boolean(selectedAuditEntry)}
        entry={selectedAuditEntry}
        dateScopeLabel={dateScopeLabel}
        formatCurrency={formatManagerDailySettlementCurrency}
        onClose={() => setSelectedAuditEntry(null)}
        onSettleShift={handleRequestSettleShift}
      />

      <ManagerAccountsDailySettlementDenominationAndHandoverModal
        isOpen={isDenominationModalOpen}
        entry={activeDenominationEntry}
        formatCurrency={formatManagerDailySettlementCurrency}
        onClose={() => setIsDenominationModalOpen(false)}
        onConfirmSettlement={({ handoverToOwner, ownerName }) => {
          if (activeDenominationEntry) {
            setEntries((prev) =>
              prev.map((e) =>
                e.shift === activeDenominationEntry.shift ? { ...e, status: 'settled', settledBy: 'Branch Manager Satyam' } : e
              )
            );
          }
          toast.success(`Handover of ${formatInrRupees(handoverToOwner)} to ${ownerName} confirmed!`, {
            id: 'manager-settlement-handover-modal-confirm',
          });
          setIsDenominationModalOpen(false);
        }}
      />
    </div>
  );
}
