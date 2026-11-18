// components/AdminAssetsRegisterPage.tsx
'use client';
import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search, RotateCcw, PlusCircle, ShieldCheck, AlertCircle, Building2 } from 'lucide-react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { useAdminAssetsRegisterState } from '@/app/frontend_admin/admin_accounts_assets/assets_register/hooks/useAdminAssetsRegisterState';
import { useAdminAssetsRegisterMutations } from '@/app/frontend_admin/admin_accounts_assets/assets_register/hooks/useAdminAssetsRegisterMutations';
import AdminAssetsRegisterKpis from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterKpis';
import AdminAssetsRegisterTable from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterTable';
import AdminAssetsRegisterAddModal from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterAddModal';
import AdminAssetsRegisterAmcModal from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterAmcModal';
import AdminAssetsRegisterDetailModal from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterDetailModal';
import { ADMIN_ASSET_CATEGORIES } from '@/app/frontend_admin/admin_accounts_assets/assets_register/config/admin_assets_register.url_config';
import { isExpiringSoon } from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterFormatters';
import type { AdminAssetRecord } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';

export function AdminAssetsRegisterPage() {
  const t = useTranslations('ADMIN_ASSETS_REGISTER');
  const isDemo = isFrontendDemoModeEnabled();

  const {
    records,
    filteredRecords,
    tabFilter,
    setTabFilter,
    branchFilter,
    setBranchFilter,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    availableBranches,
    isAddModalOpen,
    setIsAddModalOpen,
    activeAmcAsset,
    setActiveAmcAsset,
    addRecord,
    updateRecord,
  } = useAdminAssetsRegisterState();

  const [activeDetailAsset, setActiveDetailAsset] = useState<AdminAssetRecord | null>(null);

  const { isSubmitting, handleCreateAsset, handleUpdateAmc } =
    useAdminAssetsRegisterMutations(addRecord, updateRecord);

  const { selectedBranchId, selectedBranch, isAllBranches } = useAdminBranch();

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
  }, [selectedBranchId, selectedBranch, isAllBranches, availableBranches, setBranchFilter]);

  const expiringCount = records.filter((r) => isExpiringSoon(r.warrantyExpiryDate)).length;
  const needsServiceCount = records.filter(
    (r) => r.status === 'MAINTENANCE_REQUIRED' || r.status === 'UNDER_REPAIR'
  ).length;

  const branchCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: records.length };
    for (const b of availableBranches) {
      counts[b.id] = records.filter(
        (r) =>
          r.branchId.toLowerCase() === b.id.toLowerCase() ||
          r.branchName.toLowerCase().includes(b.name.toLowerCase())
      ).length;
    }
    return counts;
  }, [records, availableBranches]);

  const handleResetFilters = () => {
    setTabFilter('ALL');
    setBranchFilter('ALL');
    setCategoryFilter('ALL');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Demo status alert */}
      {isDemo && (
        <div
          role="status"
          className="sr-only"
        >
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>{t('LIVE_UNAVAILABLE')}</span>
        </div>
      )}

      {/* Header section with Add Asset button */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {t('TITLE')}
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {t('SUBTITLE')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary self-start sm:self-auto motion-safe:transition-colors shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{t('ACTIONS.ADD_ASSET')}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <AdminAssetsRegisterKpis records={records} />

      {/* Branch Quick Selector Bar */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-card rounded-xl border border-border">
        <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Building2 className="h-3.5 w-3.5 text-primary" />
          <span>{t('FILTERS.ALL_BRANCHES')}:</span>
        </div>
        <button
          type="button"
          onClick={() => setBranchFilter('ALL')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium motion-safe:transition-all ${
            branchFilter === 'ALL'
              ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
              : 'bg-surface hover:bg-card-hover text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>All Branches</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              branchFilter === 'ALL'
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {branchCounts['ALL'] || records.length}
          </span>
        </button>
        {availableBranches.map((b) => {
          const isSelected =
            branchFilter.toLowerCase() === b.id.toLowerCase() ||
            branchFilter.toLowerCase() === b.name.toLowerCase();
          const count = branchCounts[b.id] ?? 0;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setBranchFilter(b.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium motion-safe:transition-all ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'bg-surface hover:bg-card-hover text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{b.name}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tabs and Filters */}
      <div className="space-y-3">
        {/* Status / Warranty Tabs */}
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
            onClick={() => setTabFilter('WARRANTY_ALERT')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'WARRANTY_ALERT'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              <span>{t('TABS.WARRANTY_ALERT')}</span>
              {expiringCount > 0 && (
                <span className="ml-1 rounded-full bg-warning-bg px-2 py-0.5 text-xs font-bold text-warning-text">
                  {expiringCount}
                </span>
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTabFilter('ACTIVE_AMC')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'ACTIVE_AMC'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('TABS.ACTIVE_AMC')}
          </button>
          <button
            type="button"
            onClick={() => setTabFilter('NEEDS_SERVICE')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'NEEDS_SERVICE'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>{t('TABS.NEEDS_SERVICE')}</span>
            {needsServiceCount > 0 && (
              <span className="ml-1.5 rounded-full bg-destructive-bg px-2 py-0.5 text-xs font-bold text-destructive">
                {needsServiceCount}
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

            {/* Category Filter Dropdown */}
            <div className="relative min-w-[180px]">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label={t('FILTERS.ALL_CATEGORIES')}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="ALL">{t('FILTERS.ALL_CATEGORIES')}</option>
                {ADMIN_ASSET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(`CATEGORIES.${cat}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Filters button */}
          {(branchFilter !== 'ALL' || categoryFilter !== 'ALL' || tabFilter !== 'ALL' || searchQuery.trim()) && (
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

      {/* Asset Register Table */}
      <AdminAssetsRegisterTable
        records={filteredRecords}
        onManageAmc={(asset) => setActiveAmcAsset(asset)}
        onViewDetail={(asset) => setActiveDetailAsset(asset)}
        onResetFilters={handleResetFilters}
      />

      {/* Asset Specification & Health Card Modal */}
      <AdminAssetsRegisterDetailModal
        asset={activeDetailAsset}
        isOpen={activeDetailAsset !== null}
        onClose={() => setActiveDetailAsset(null)}
        onManageAmc={(asset) => {
          setActiveDetailAsset(null);
          setActiveAmcAsset(asset);
        }}
      />

      {/* Add Asset Modal */}
      <AdminAssetsRegisterAddModal
        isOpen={isAddModalOpen}
        isSubmitting={isSubmitting}
        branches={availableBranches}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateAsset}
      />

      {/* AMC Update Modal */}
      <AdminAssetsRegisterAmcModal
        asset={activeAmcAsset}
        isOpen={activeAmcAsset !== null}
        isSubmitting={isSubmitting}
        onClose={() => setActiveAmcAsset(null)}
        onSubmit={handleUpdateAmc}
      />
    </div>
  );
}

export default AdminAssetsRegisterPage;
