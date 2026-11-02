// components/AdminAssetsRegisterPage.tsx
'use client';
import { useTranslations } from 'next-intl';
import { Search, RotateCcw, PlusCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useAdminAssetsRegisterState } from '@/app/frontend_admin/admin_accounts_assets/assets_register/hooks/useAdminAssetsRegisterState';
import { useAdminAssetsRegisterMutations } from '@/app/frontend_admin/admin_accounts_assets/assets_register/hooks/useAdminAssetsRegisterMutations';
import AdminAssetsRegisterKpis from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterKpis';
import AdminAssetsRegisterTable from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterTable';
import AdminAssetsRegisterAddModal from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterAddModal';
import AdminAssetsRegisterAmcModal from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterAmcModal';
import { ADMIN_ASSET_CATEGORIES } from '@/app/frontend_admin/admin_accounts_assets/assets_register/config/admin_assets_register.url_config';
import { isExpiringSoon } from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterFormatters';

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

  const { isSubmitting, handleCreateAsset, handleUpdateAmc } =
    useAdminAssetsRegisterMutations(addRecord, updateRecord);

  const expiringCount = records.filter((r) => isExpiringSoon(r.warrantyExpiryDate)).length;
  const needsServiceCount = records.filter(
    (r) => r.status === 'MAINTENANCE_REQUIRED' || r.status === 'UNDER_REPAIR'
  ).length;

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
          className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-primary font-medium"
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
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary self-start sm:self-auto motion-safe:transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{t('ACTIONS.ADD_ASSET')}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <AdminAssetsRegisterKpis records={records} />

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
                <span className="ml-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
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
              <span className="ml-1.5 rounded-full bg-destructive/15 px-2 py-0.5 text-xs font-bold text-destructive">
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

            {/* Branch Filter Dropdown */}
            <div className="relative min-w-[160px]">
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                aria-label={t('FILTERS.ALL_BRANCHES')}
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
        onResetFilters={handleResetFilters}
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

