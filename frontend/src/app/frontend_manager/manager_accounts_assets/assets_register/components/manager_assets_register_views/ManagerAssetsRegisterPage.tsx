'use client';

import { ManagerAssetsRegisterAddModal } from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_dialogs/ManagerAssetsRegisterAddModal';
import { ManagerAssetsRegisterConfirmModal } from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_dialogs/ManagerAssetsRegisterConfirmModal';
import { ManagerAssetsRegisterDeleteDialog } from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_dialogs/ManagerAssetsRegisterDeleteDialog';
import { ManagerAssetsRegisterDetailsModal } from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_dialogs/ManagerAssetsRegisterDetailsModal';
import '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_styles/ManagerAssetsRegisterStyles.css';
import { ManagerAssetsRegisterKpis } from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_views/ManagerAssetsRegisterKpis';
import {
  ManagerAssetsRegisterTable,
  type AssetSortField,
} from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_views/ManagerAssetsRegisterTable';
import { ManagerAssetsRegisterToolbar } from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_views/ManagerAssetsRegisterToolbar';
import {
  MANAGER_ACCOUNTING_SAMPLE_ASSETS,
  type ManagerAssetsRegisterAsset,
} from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterDemoRepository';
import { useManagerAssetsCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterFormattingHook';
import type { ManagerAssetsRegisterMainProps } from '@/app/frontend_manager/manager_accounts_assets/assets_register/types/ManagerAssetsRegisterMainTypes';
import { exportAssetsRegisterCsv } from '@/app/frontend_manager/manager_accounts_assets/assets_register/utils/ManagerAssetsRegisterExportHelpers';
import { Download, Plus, Printer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function ManagerAssetsRegisterPage({ view, id }: ManagerAssetsRegisterMainProps) {
  const tManagerUi = useTranslations('manager.manager_assets.ui');
  const formatManagerAssetsCurrency = useManagerAssetsCurrencyFormatter();

  const [assets, setAssets] = useState<ManagerAssetsRegisterAsset[]>(MANAGER_ACCOUNTING_SAMPLE_ASSETS as ManagerAssetsRegisterAsset[]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<AssetSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pendingNewAsset, setPendingNewAsset] = useState<ManagerAssetsRegisterAsset | null>(null);
  const [selectedDetailsAsset, setSelectedDetailsAsset] = useState<ManagerAssetsRegisterAsset | null>(null);
  const [pendingDeleteAsset, setPendingDeleteAsset] = useState<ManagerAssetsRegisterAsset | null>(null);

  const categories = useMemo(() => [...new Set(assets.map((a) => a.category))], [assets]);

  const categoryLabel = (category: string) => {
    switch (category) {
      case 'Appliance': return tManagerUi('category_appliance');
      case 'Security': return tManagerUi('category_security');
      case 'Furniture': return tManagerUi('category_furniture');
      case 'Electronics': return tManagerUi('category_electronics');
      default: return category;
    }
  };

  const statusLabel = (status: ManagerAssetsRegisterAsset['status']) => {
    switch (status) {
      case 'active': return tManagerUi('asset_status_active') || 'Active';
      case 'maintenance': return tManagerUi('asset_status_maintenance') || 'Maintenance';
      case 'disposed': return tManagerUi('asset_status_disposed') || 'Disposed';
      default: return status;
    }
  };

  const handleConfirmAddAsset = () => {
    if (!pendingNewAsset) return;
    setAssets((prev) => [pendingNewAsset, ...prev]);
    toast.success(`Asset "${pendingNewAsset.name}" successfully added to Library Register!`, {
      id: `manager-assets-add-${pendingNewAsset.id}`,
    });
    setPendingNewAsset(null);
  };

  const handleToggleAssetStatus = (targetAsset: ManagerAssetsRegisterAsset) => {
    const nextStatus = targetAsset.status === 'active' ? 'maintenance' : 'active';
    setAssets((prev) => prev.map((a) => (a.id === targetAsset.id ? { ...a, status: nextStatus } : a)));
    if (selectedDetailsAsset && selectedDetailsAsset.id === targetAsset.id) {
      setSelectedDetailsAsset({ ...selectedDetailsAsset, status: nextStatus });
    }
    toast.success(`Asset "${targetAsset.name}" moved to ${nextStatus === 'active' ? 'ACTIVE & OPERATIONAL' : 'UNDER MAINTENANCE'}!`, {
      id: `manager-assets-status-${targetAsset.id}`,
    });
  };

  const handleDeleteAsset = (assetId: number) => {
    const target = assets.find((a) => a.id === assetId);
    if (!target) return;
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
    toast.success(`Asset record for "${target.name}" has been removed from register.`, {
      id: `manager-assets-del-${assetId}`,
    });
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setCatFilter('all');
    setSearchQuery('');
    setPage(0);
    toast.info('Filters have been reset to default.', { id: 'manager-assets-reset-filters' });
  };

  const toggleSort = (field: AssetSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return assets.filter((a) => {
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchCat = catFilter === 'all' || a.category === catFilter;
      const matchQ = !q || a.name.toLowerCase().includes(q) || a.location.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
      return matchStatus && matchCat && matchQ;
    });
  }, [assets, statusFilter, catFilter, searchQuery]);

  const sortedRows = useMemo(() => {
    if (!sortField) return visible;
    return [...visible].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp =
        typeof aVal === 'number' && typeof bVal === 'number'
          ? aVal - bVal
          : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [visible, sortField, sortDirection]);

  const handleExportCsv = () => {
    exportAssetsRegisterCsv(sortedRows);
    toast.success('Assets register exported to CSV successfully.', { id: 'manager-assets-export-csv' });
  };

  const totalBookValue = assets.filter((a) => a.status !== 'disposed').reduce((s, a) => s + a.currentValue, 0);
  const totalCount = assets.length || 1;
  const activeCount = assets.filter((a) => a.status === 'active').length;
  const maintenanceCount = assets.filter((a) => a.status === 'maintenance').length;
  const disposedCount = assets.filter((a) => a.status === 'disposed').length;
  const activePct = Math.round((activeCount / totalCount) * 100);
  const maintenancePct = Math.round((maintenanceCount / totalCount) * 100);
  const disposedPct = Math.max(0, 100 - activePct - maintenancePct);
  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">{tManagerUi('asset_manager') || 'Asset Register'}</h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Track, audit, and manage society physical assets, book values, locations, and operational conditions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-xs"
            title="Print Assets Register"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-xs"
            title="Export Assets Register as CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mar-btn-glow-indigo inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white border hover:opacity-95 motion-safe:transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Library Asset</span>
          </button>
        </div>
      </div>

      <ManagerAssetsRegisterKpis
        totalAssets={assets.length}
        activeCount={activeCount}
        maintenanceCount={maintenanceCount}
        totalBookValueFormatted={formatManagerAssetsCurrency(totalBookValue)}
        activePct={activePct}
        maintenancePct={maintenancePct}
        disposedPct={disposedPct}
        labels={{ totalAssets: tManagerUi('total_assets') || 'Total Assets', underMaintenance: tManagerUi('under_maintenance') || 'Under Maintenance' }}
      />

      <ManagerAssetsRegisterToolbar
        statusFilter={statusFilter}
        onStatusChange={(newStatus) => { setStatusFilter(newStatus); setPage(0); }}
        categoryFilter={catFilter}
        onCategoryChange={(newCategory) => { setCatFilter(newCategory); setPage(0); }}
        searchQuery={searchQuery}
        onSearchChange={(newQuery) => { setSearchQuery(newQuery); setPage(0); }}
        categories={categories}
        categoryLabel={categoryLabel}
        counts={{ all: assets.length, active: activeCount, maintenance: maintenanceCount, disposed: disposedCount }}
        onResetFilters={handleResetFilters}
      />

      <ManagerAssetsRegisterTable
        paginated={paginated}
        totalRows={totalRows}
        filteredCount={visible.length}
        searchQuery={searchQuery}
        sortField={sortField}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        formatCurrency={formatManagerAssetsCurrency}
        categoryLabel={categoryLabel}
        statusLabel={statusLabel}
        onViewDetails={(asset) => setSelectedDetailsAsset(asset)}
        onToggleStatus={handleToggleAssetStatus}
        onDeleteAsset={(assetId) => {
          const item = assets.find((a) => a.id === assetId);
          if (item) setPendingDeleteAsset(item);
        }}
        page={page}
        pageSize={pageSize}
        pageCount={pageCount}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(0); }}
      />

      <ManagerAssetsRegisterAddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddAsset={(newAsset) => setPendingNewAsset(newAsset)} />

      <ManagerAssetsRegisterConfirmModal isOpen={Boolean(pendingNewAsset)} assetData={pendingNewAsset} onConfirm={handleConfirmAddAsset} onCancel={() => setPendingNewAsset(null)} />

      <ManagerAssetsRegisterDetailsModal
        isOpen={Boolean(selectedDetailsAsset)}
        asset={selectedDetailsAsset}
        formatCurrency={formatManagerAssetsCurrency}
        categoryLabel={categoryLabel}
        statusLabel={statusLabel}
        onClose={() => setSelectedDetailsAsset(null)}
        onScheduleMaintenance={handleToggleAssetStatus}
      />

      <ManagerAssetsRegisterDeleteDialog
        pendingDeleteAsset={pendingDeleteAsset}
        onCancel={() => setPendingDeleteAsset(null)}
        onConfirmDelete={(assetId) => {
          handleDeleteAsset(assetId);
          setPendingDeleteAsset(null);
        }}
      />
    </div>
  );
}
