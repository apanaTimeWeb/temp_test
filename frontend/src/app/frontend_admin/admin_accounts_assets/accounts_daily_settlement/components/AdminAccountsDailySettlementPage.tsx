// components/AdminAccountsDailySettlementPage.tsx
'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, RotateCcw, Building2, ShieldCheck, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { useAdminAccountsDailySettlementState } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/hooks/useAdminAccountsDailySettlementState';
import { useAdminAccountsDailySettlementMutations } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/hooks/useAdminAccountsDailySettlementMutations';
import AdminAccountsDailySettlementKpis from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementKpis';
import AdminAccountsDailySettlementTable from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementTable';
import AdminAccountsDailySettlementApprovalModal from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementApprovalModal';
import AdminAccountsDailySettlementDiscrepancyModal from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementDiscrepancyModal';

export function AdminAccountsDailySettlementPage() {
  const t = useTranslations('ADMIN_ACCOUNTS_DAILY_SETTLEMENT');
  const isDemo = isFrontendDemoModeEnabled();

  const {
    records,
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

  // Specific Date Navigator state
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
      if (matched) {
        setBranchFilter(matched.id);
      } else {
        setBranchFilter(selectedBranchId);
      }
    }
  }, [isAllBranches, selectedBranchId, selectedBranch, availableBranches, setBranchFilter]);

  const handleResetFilters = () => {
    setTabFilter('ALL');
    setBranchFilter('ALL');
    setSearchQuery('');
    setDateMode('all');
  };

  // Filter records by selected date
  const dateFilteredRecords = filteredRecords.filter((r) => {
    if (dateMode === 'all') return true;
    if (!r.date) return true;
    const target = dateMode === 'today' ? demoTodayStr : dateMode === 'yesterday' ? demoYesterdayStr : selectedDate;
    return r.date === target;
  });

  const pendingCount = dateFilteredRecords.filter((r) => r.status === 'PENDING_APPROVAL').length;
  const flaggedCount = dateFilteredRecords.filter((r) => r.status === 'DISCREPANCY_FLAGGED').length;
  const dateModeLabel = dateMode === 'all' ? 'All Dates' : dateMode === 'today' ? 'Today (01 Nov)' : dateMode === 'yesterday' ? 'Yesterday (31 Oct)' : format(new Date(selectedDate), 'dd MMM yyyy');

  return (
    <div className="space-y-6 pb-10">
      {/* Demo status alert */}
      {isDemo && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-border bg-primary-subtle p-3 text-xs text-primary font-medium"
        >
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
          <span>{t('LIVE_UNAVAILABLE')}</span>
        </div>
      )}

      {/* Executive Header & Specific Date Navigator */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-surface to-surface-elevated p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-600 dark:text-teal-400">
                <Building2 className="h-3.5 w-3.5" />
                Accounts / Daily Settlement
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('TITLE')}</h1>
            <p className="text-sm text-text-secondary">{t('SUBTITLE')}</p>
          </div>

          {/* Specific Date Navigator */}
          <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border/70 bg-surface/90 p-2 shadow-sm backdrop-blur-md">
            <div className="flex items-center rounded-lg bg-surface-muted/60 p-1 border border-border/50">
              <button
                type="button"
                onClick={() => setDateMode('all')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${dateMode === 'all' ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]' : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'}`}
              >
                All Dates
              </button>
              <button
                type="button"
                onClick={() => { setDateMode('today'); setSelectedDate(demoTodayStr); }}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${dateMode === 'today' ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]' : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'}`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => { setDateMode('yesterday'); setSelectedDate(demoYesterdayStr); }}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${dateMode === 'yesterday' ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]' : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'}`}
              >
                Yesterday
              </button>
              <button
                type="button"
                onClick={() => setDateMode('custom')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${dateMode === 'custom' ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]' : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'}`}
              >
                <Calendar className="h-3 w-3" />
                Pick Date 📅
              </button>
            </div>
            {dateMode === 'custom' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                aria-label="Pick specific date"
                className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            )}
            <div className="text-xs font-medium text-text-secondary border-l border-border/60 pl-2.5 ml-0.5">
              {dateModeLabel}
              <span className="ml-1.5 text-text-muted">· {dateFilteredRecords.length} records</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <AdminAccountsDailySettlementKpis records={dateFilteredRecords} />

      {/* Filter and Tab Bar */}
      <div className="space-y-3">
        {/* Status Tabs */}
        <div className="flex border-b border-border overflow-x-auto gap-2">
          <button
            type="button"
            onClick={() => setTabFilter('ALL')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'ALL'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('TABS.ALL')} ({dateFilteredRecords.length})
          </button>
          <button
            type="button"
            onClick={() => setTabFilter('PENDING_APPROVAL')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'PENDING_APPROVAL'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
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
              tabFilter === 'APPROVED'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('TABS.APPROVED')}
          </button>
          <button
            type="button"
            onClick={() => setTabFilter('DISCREPANCY_FLAGGED')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'DISCREPANCY_FLAGGED'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('TABS.FLAGGED')}
            {flaggedCount > 0 && (
              <span className="ml-1.5 rounded-full bg-destructive-bg px-2 py-0.5 text-xs font-bold text-destructive">
                {flaggedCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder={t('FILTERS.SEARCH_PLACEHOLDER')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-border bg-card pl-9 pr-3 py-1.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            {/* Branch Filter Dropdown */}
            <div className="relative min-w-[180px]">
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                aria-label={t('FILTERS.BRANCH_PLACEHOLDER')}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="ALL">{t('FILTERS.ALL_BRANCHES')}</option>
                {availableBranches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Filters button */}
          {(branchFilter !== 'ALL' || tabFilter !== 'ALL' || searchQuery.trim()) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary self-start sm:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t('FILTERS.CLEAR_FILTERS')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Daily Settlements Table */}
      <AdminAccountsDailySettlementTable
        records={dateFilteredRecords}
        onApprove={(record) => setApprovingRecord(record)}
        onFlag={(record) => setFlaggingRecord(record)}
        onResetFilters={handleResetFilters}
      />

      {/* Approval Modal */}
      <AdminAccountsDailySettlementApprovalModal
        record={approvingRecord}
        isOpen={approvingRecord !== null}
        isSubmitting={isSubmitting}
        onClose={() => setApprovingRecord(null)}
        onConfirm={handleApprove}
      />

      {/* Discrepancy Flagging Modal */}
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

