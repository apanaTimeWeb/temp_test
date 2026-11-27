// components/AdminAccountsDailySettlementPage.tsx
'use client';

import AdminAccountsDailySettlementApprovalModal from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementApprovalModal';
import AdminAccountsDailySettlementDiscrepancyModal from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementDiscrepancyModal';
import { AdminAccountsDailySettlementHeader } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementHeader';
import AdminAccountsDailySettlementKpis from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementKpis';
import AdminAccountsDailySettlementTable from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementTable';
import { useAdminAccountsDailySettlementMutations } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/hooks/useAdminAccountsDailySettlementMutations';
import { useAdminAccountsDailySettlementState } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/hooks/useAdminAccountsDailySettlementState';
import {
  exportDailySettlementsCsv,
  exportDailySettlementsExcel,
  printDailySettlementSummary,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/utils/adminAccountsDailySettlementExports';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { format } from 'date-fns';
import { Download, FileSpreadsheet, Printer, RotateCcw, Search, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export function AdminAccountsDailySettlementPage() {
  const t = useTranslations('ADMIN_ACCOUNTS_DAILY_SETTLEMENT');
  const isDemo = isFrontendDemoModeEnabled();

  const {
    filteredRecords,
    tabFilter,
    setTabFilter,
    branchFilter,
    setBranchFilter,
    searchQuery,
    setSearchQuery,
    availableBranches,
    approvingRecord,
    setApprovingRecord,
    flaggingRecord,
    setFlaggingRecord,
    updateRecordStatus,
  } = useAdminAccountsDailySettlementState();

  const { isSubmitting, handleApprove, handleFlagDiscrepancy } =
    useAdminAccountsDailySettlementMutations(updateRecordStatus);

  const { selectedBranchId, selectedBranch, isAllBranches } = useAdminBranch();

  const demoTodayStr = '2026-11-01';
  const demoYesterdayStr = '2026-10-31';
  const [selectedDate, setSelectedDate] = useState<string>(demoTodayStr);
  const [dateMode, setDateMode] = useState<'all' | 'today' | 'yesterday' | 'custom'>('all');

  useEffect(() => {
    if (isAllBranches || !selectedBranch) {
      setBranchFilter('ALL');
    } else {
      const matched = availableBranches.find(
        (b) =>
          b.id.toLowerCase() === selectedBranchId.toLowerCase() ||
          b.name.toLowerCase().includes(selectedBranch.name.toLowerCase()) ||
          selectedBranch.name.toLowerCase().includes(b.name.toLowerCase())
      );
      setBranchFilter(matched ? matched.id : selectedBranchId);
    }
  }, [isAllBranches, selectedBranchId, selectedBranch, availableBranches, setBranchFilter]);

  const handleResetFilters = () => {
    setTabFilter('ALL');
    setBranchFilter('ALL');
    setSearchQuery('');
    setDateMode('all');
  };

  const dateFilteredRecords = filteredRecords.filter((r) => {
    if (dateMode === 'all' || !r.date) return true;
    const target = dateMode === 'today' ? demoTodayStr : dateMode === 'yesterday' ? demoYesterdayStr : selectedDate;
    return r.date === target;
  });

  const pendingCount = dateFilteredRecords.filter((r) => r.status === 'PENDING_APPROVAL').length;
  const flaggedCount = dateFilteredRecords.filter((r) => r.status === 'DISCREPANCY_FLAGGED').length;
  const dateModeLabel =
    dateMode === 'all'
      ? 'All Dates'
      : dateMode === 'today'
        ? 'Today (01 Nov)'
        : dateMode === 'yesterday'
          ? 'Yesterday (31 Oct)'
          : format(new Date(selectedDate), 'dd MMM yyyy');

  return (
    <div className="space-y-6 pb-10">
      {isDemo && (
        <div role="status" className="sr-only">
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>{t('LIVE_UNAVAILABLE')}</span>
        </div>
      )}

      <AdminAccountsDailySettlementHeader
        dateMode={dateMode}
        setDateMode={setDateMode}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        demoTodayStr={demoTodayStr}
        demoYesterdayStr={demoYesterdayStr}
        dateModeLabel={dateModeLabel}
        filteredCount={dateFilteredRecords.length}
      />

      <AdminAccountsDailySettlementKpis records={dateFilteredRecords} />

      <div className="space-y-3">
        <div className="flex border-b border-border overflow-x-auto gap-2">
          <button
            type="button"
            onClick={() => setTabFilter('ALL')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'ALL' ? 'border-primary text-primary font-semibold' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {t('TABS.ALL')} ({dateFilteredRecords.length})
          </button>
          <button
            type="button"
            onClick={() => setTabFilter('PENDING_APPROVAL')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'PENDING_APPROVAL' ? 'border-primary text-primary font-semibold' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {t('TABS.PENDING')}
            {pendingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-warning-bg px-2 py-0.5 text-xs font-bold text-warning-text">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setTabFilter('APPROVED')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'APPROVED' ? 'border-primary text-primary font-semibold' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {t('TABS.APPROVED')}
          </button>
          <button
            type="button"
            onClick={() => setTabFilter('DISCREPANCY_FLAGGED')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'DISCREPANCY_FLAGGED' ? 'border-primary text-primary font-semibold' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {t('TABS.FLAGGED')}
            {flaggedCount > 0 && (
              <span className="ml-1.5 rounded-full bg-danger-bg px-2 py-0.5 text-xs font-bold text-danger-text">
                {flaggedCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-secondary pointer-events-none" aria-hidden="true" />
              <input
                maxLength={100}
                type="text"
                placeholder={t('FILTERS.SEARCH_PLACEHOLDER')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-border bg-input pl-9 pr-3 py-1.5 text-xs sm:text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {(branchFilter !== 'ALL' || tabFilter !== 'ALL' || searchQuery.trim() || dateMode !== 'all') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t('FILTERS.CLEAR_FILTERS')}</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 pl-2 border-l border-border">
              <button
                type="button"
                onClick={() => exportDailySettlementsCsv(dateFilteredRecords)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card"
                title="Export daily settlement history to CSV"
              >
                <Download size={13} className="text-success-text" aria-hidden="true" />
                <span>CSV</span>
              </button>
              <button
                type="button"
                onClick={() => exportDailySettlementsExcel(dateFilteredRecords)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card"
                title="Export daily settlement history to Excel (.xls)"
              >
                <FileSpreadsheet size={13} className="text-success-text" aria-hidden="true" />
                <span>Excel</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  printDailySettlementSummary(
                    dateFilteredRecords,
                    selectedBranch ? selectedBranch.name : 'All Branches',
                    dateModeLabel
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card"
                title="Print daily settlement summary report"
              >
                <Printer size={13} className="text-info-text" aria-hidden="true" />
                <span>Print Summary</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AdminAccountsDailySettlementTable
        records={dateFilteredRecords}
        onApprove={(record) => setApprovingRecord(record)}
        onFlag={(record) => setFlaggingRecord(record)}
        onResetFilters={handleResetFilters}
      />

      <AdminAccountsDailySettlementApprovalModal
        record={approvingRecord}
        isOpen={approvingRecord !== null}
        isSubmitting={isSubmitting}
        onClose={() => setApprovingRecord(null)}
        onConfirm={handleApprove}
      />

      <AdminAccountsDailySettlementDiscrepancyModal
        record={flaggingRecord}
        isOpen={flaggingRecord !== null}
        isSubmitting={isSubmitting}
        onClose={() => setFlaggingRecord(null)}
        onConfirm={handleFlagDiscrepancy}
      />
    </div>
  );
}

export default AdminAccountsDailySettlementPage;
