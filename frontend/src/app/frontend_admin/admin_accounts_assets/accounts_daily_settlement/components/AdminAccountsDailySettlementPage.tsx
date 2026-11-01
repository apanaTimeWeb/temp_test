// components/AdminAccountsDailySettlementPage.tsx
'use client';
import { useTranslations } from 'next-intl';
import { Search, RotateCcw, Building2, ShieldCheck } from 'lucide-react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
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

  const pendingCount = records.filter((r) => r.status === 'PENDING_APPROVAL').length;
  const flaggedCount = records.filter((r) => r.status === 'DISCREPANCY_FLAGGED').length;

  const handleResetFilters = () => {
    setTabFilter('ALL');
    setBranchFilter('ALL');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Demo status alert */}
      {isDemo && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-primary font-medium"
        >
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>{t('LIVE_UNAVAILABLE')}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {t('TITLE')}
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {t('SUBTITLE')}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <AdminAccountsDailySettlementKpis records={records} />

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
            {t('TABS.ALL')} ({records.length})
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
              <span className="ml-1.5 rounded-full bg-destructive/15 px-2 py-0.5 text-xs font-bold text-destructive">
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
        records={filteredRecords}
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

