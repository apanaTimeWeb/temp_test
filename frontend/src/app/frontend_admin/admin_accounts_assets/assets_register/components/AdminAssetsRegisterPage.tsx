// components/AdminAssetsRegisterPage.tsx
'use client';

import AdminAssetsRegisterAddModal from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterAddModal';
import AdminAssetsRegisterAmcModal from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterAmcModal';
import AdminAssetsRegisterDetailModal from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterDetailModal';
import AdminAssetsRegisterKpis from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterKpis';
import AdminAssetsRegisterTable from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterTable';
import { ADMIN_ASSET_CATEGORIES } from '@/app/frontend_admin/admin_accounts_assets/assets_register/config/admin_assets_register.url_config';
import { useAdminAssetsRegisterMutations } from '@/app/frontend_admin/admin_accounts_assets/assets_register/hooks/useAdminAssetsRegisterMutations';
import { useAdminAssetsRegisterState } from '@/app/frontend_admin/admin_accounts_assets/assets_register/hooks/useAdminAssetsRegisterState';
import type { AdminAssetRecord } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';
import {
  exportAdminAssetsCsv,
  exportAdminAssetsExcel,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/adminAssetsRegisterExports';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { Building, FileSpreadsheet, PlusCircle, RotateCcw, Search, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

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
  const { isSubmitting, handleCreateAsset, handleUpdateAmc } = useAdminAssetsRegisterMutations(addRecord, updateRecord);
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
      setBranchFilter(matched ? matched.id : selectedBranchId);
    }
  }, [selectedBranchId, selectedBranch, isAllBranches, availableBranches, setBranchFilter]);

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
      {isDemo && (
        <div role="status" className="sr-only">
          <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t('LIVE_UNAVAILABLE')}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-text-secondary">
            <Building className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Physical Assets &amp; AMC Tracking</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('TITLE')}</h1>
          <p className="text-sm text-text-secondary">{t('SUBTITLE')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => exportAdminAssetsCsv(filteredRecords)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs sm:text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card"
            title="Export Asset Register as CSV"
          >
            <FileSpreadsheet className="h-4 w-4 text-success-text" aria-hidden="true" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => exportAdminAssetsExcel(filteredRecords)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs sm:text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card"
            title="Export Asset Register as Formatted Excel (.xls)"
          >
            <FileSpreadsheet className="h-4 w-4 text-info-text" aria-hidden="true" />
            <span>Export Excel</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-xs sm:text-sm font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors shadow-card"
          >
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            <span>{t('ACTIONS.ADD_ASSET')}</span>
          </button>
        </div>
      </div>

      <AdminAssetsRegisterKpis records={records} />

      <div className="space-y-3">
        <div className="flex border-b border-border overflow-x-auto gap-2">
          <button
            type="button"
            onClick={() => setTabFilter('ALL')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'ALL' ? 'border-primary text-primary font-semibold' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {t('TABS.ALL')} ({records.length})
          </button>
          <button
            type="button"
            onClick={() => setTabFilter('ACTIVE_AMC')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'ACTIVE_AMC' ? 'border-primary text-primary font-semibold' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {t('TABS.ACTIVE_AMC')}
          </button>
          <button
            type="button"
            onClick={() => setTabFilter('NEEDS_SERVICE')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'NEEDS_SERVICE' ? 'border-primary text-primary font-semibold' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <span>{t('TABS.NEEDS_SERVICE')}</span>
            {needsServiceCount > 0 && (
              <span className="ml-1.5 rounded-full bg-danger-bg px-2 py-0.5 text-xs font-bold text-danger-text">
                {needsServiceCount}
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

            <div className="relative min-w-[180px]">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label={t('FILTERS.ALL_CATEGORIES')}
                className="w-full rounded-md border border-border bg-input px-3 py-1.5 text-xs sm:text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="ALL">{t('FILTERS.ALL_CATEGORIES')}</option>
                {ADMIN_ASSET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{t(`CATEGORIES.${cat}`)}</option>
                ))}
              </select>
            </div>
          </div>

          {(branchFilter !== 'ALL' || categoryFilter !== 'ALL' || tabFilter !== 'ALL' || searchQuery.trim()) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary self-start sm:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t('FILTERS.CLEAR_FILTERS')}</span>
            </button>
          )}
        </div>
      </div>

      <AdminAssetsRegisterTable
        records={filteredRecords}
        onManageAmc={(asset) => setActiveAmcAsset(asset)}
        onViewDetail={(asset) => setActiveDetailAsset(asset)}
        onResetFilters={handleResetFilters}
      />

      <AdminAssetsRegisterDetailModal
        asset={activeDetailAsset}
        isOpen={activeDetailAsset !== null}
        onClose={() => setActiveDetailAsset(null)}
        onManageAmc={(asset) => { setActiveDetailAsset(null); setActiveAmcAsset(asset); }}
      />

      <AdminAssetsRegisterAddModal
        isOpen={isAddModalOpen}
        isSubmitting={isSubmitting}
        branches={availableBranches}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateAsset}
      />

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
