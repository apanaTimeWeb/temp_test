'use client';

import type { ManagerAssetsRegisterMainProps } from '@/app/frontend_manager/manager_accounts_assets/assets_register/types/ManagerAssetsRegisterMainTypes';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import {
  Plus,
  Download,
  Printer,
  Package,
  CheckCircle2,
  Wrench,
  Archive,
  IndianRupee,
  Layers,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useManagerAssetsCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterFormattingHook';
import {
  MANAGER_ACCOUNTING_SAMPLE_ASSETS,
  type ManagerAssetsRegisterAsset,
} from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterDemoRepository';
import {
  ManagerAssetsRegisterTable,
  type AssetSortField,
} from './ManagerAssetsRegisterTable';
import { ManagerAssetsRegisterToolbar } from './ManagerAssetsRegisterToolbar';
import { ManagerAssetsRegisterAddModal } from '../manager_assets_register_dialogs/ManagerAssetsRegisterAddModal';
import { ManagerAssetsRegisterConfirmModal } from '../manager_assets_register_dialogs/ManagerAssetsRegisterConfirmModal';
import { ManagerAssetsRegisterDetailsModal } from '../manager_assets_register_dialogs/ManagerAssetsRegisterDetailsModal';

export default function ManagerAssetsRegisterPage({
  view,
  id,
  name,
  phone,
  smartId,
}: ManagerAssetsRegisterMainProps) {
  const tManagerUi = useTranslations('manager.manager_assets.ui');
  const formatManagerAssetsCurrency = useManagerAssetsCurrencyFormatter();

  const [assets, setAssets] = useState<ManagerAssetsRegisterAsset[]>(
    MANAGER_ACCOUNTING_SAMPLE_ASSETS as ManagerAssetsRegisterAsset[]
  );
  const [statusFilter, setStatusFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<AssetSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pendingNewAsset, setPendingNewAsset] = useState<ManagerAssetsRegisterAsset | null>(null);
  const [selectedDetailsAsset, setSelectedDetailsAsset] = useState<ManagerAssetsRegisterAsset | null>(null);
  const [pendingDeleteAsset, setPendingDeleteAsset] = useState<ManagerAssetsRegisterAsset | null>(null);

  const categories = useMemo(() => [...new Set(assets.map((a) => a.category))], [assets]);

  const categoryLabel = (category: string) => {
    switch (category) {
      case 'Appliance':
        return tManagerUi('category_appliance');
      case 'Security':
        return tManagerUi('category_security');
      case 'Furniture':
        return tManagerUi('category_furniture');
      case 'Electronics':
        return tManagerUi('category_electronics');
      default:
        return category;
    }
  };

  const statusLabel = (status: ManagerAssetsRegisterAsset['status']) => {
    switch (status) {
      case 'active':
        return tManagerUi('asset_status_active') || 'Active';
      case 'maintenance':
        return tManagerUi('asset_status_maintenance') || 'Maintenance';
      case 'disposed':
        return tManagerUi('asset_status_disposed') || 'Disposed';
      default:
        return status;
    }
  };

  const handleRequestAddAsset = (newAsset: ManagerAssetsRegisterAsset) => {
    setPendingNewAsset(newAsset);
  };

  const handleConfirmAddAsset = () => {
    if (!pendingNewAsset) return;
    setAssets((prev) => [pendingNewAsset, ...prev]);
    toast.success(`Asset "${pendingNewAsset.name}" successfully added to Library Register!`);
    setPendingNewAsset(null);
  };

  const handleToggleAssetStatus = (targetAsset: ManagerAssetsRegisterAsset) => {
    const nextStatus = targetAsset.status === 'active' ? 'maintenance' : 'active';
    setAssets((prev) =>
      prev.map((a) => (a.id === targetAsset.id ? { ...a, status: nextStatus } : a))
    );
    if (selectedDetailsAsset && selectedDetailsAsset.id === targetAsset.id) {
      setSelectedDetailsAsset({ ...selectedDetailsAsset, status: nextStatus });
    }
    toast.success(
      `Asset "${targetAsset.name}" moved to ${nextStatus === 'active' ? 'ACTIVE & OPERATIONAL' : 'UNDER MAINTENANCE'}!`
    );
  };

  const handleDeleteAsset = (assetId: number) => {
    const target = assets.find((a) => a.id === assetId);
    if (!target) return;
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
    toast.success(`Asset record for "${target.name}" has been removed from register.`);
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setCatFilter('all');
    setSearchQuery('');
    setPage(0);
    toast.info('Filters have been reset to default.');
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
      const matchQ =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
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
          : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, {
              numeric: true,
              sensitivity: 'base',
            });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [visible, sortField, sortDirection]);

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);

  const escapeCsv = (v: unknown) => {
    let s = String(v ?? '');
    return /^[\u0000-\u0020]*[=+\-@]/.test(s) ? `'"${s.replace(/"/g, '""')}"` : `"${s.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    const headers = [
      'Asset ID',
      'Asset Name',
      'Category',
      'Purchase Date',
      'Purchase Cost (INR)',
      'Current Value (INR)',
      'Location',
      'Status',
    ]
      .map(escapeCsv)
      .join(',');

    const rows = sortedRows
      .map((a) =>
        [
          a.id,
          a.name,
          a.category,
          a.purchaseDate,
          (a.purchaseValue / 100).toFixed(2),
          (a.currentValue / 100).toFixed(2),
          a.location,
          a.status,
        ]
          .map(escapeCsv)
          .join(',')
      )
      .join('\r\n');

    const blob = new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = Object.assign(document.createElement('a'), {
      href: url,
      download: `assets_register_${new Date().toISOString().slice(0, 10)}.csv`,
      hidden: true,
    });
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Assets register exported to CSV successfully.');
  };

  const totalBookValue = assets
    .filter((a) => a.status !== 'disposed')
    .reduce((s, a) => s + a.currentValue, 0);

  const totalCount = assets.length || 1;
  const activeCount = assets.filter((a) => a.status === 'active').length;
  const maintenanceCount = assets.filter((a) => a.status === 'maintenance').length;
  const disposedCount = assets.filter((a) => a.status === 'disposed').length;

  const activePct = Math.round((activeCount / totalCount) * 100);
  const maintenancePct = Math.round((maintenanceCount / totalCount) * 100);
  const disposedPct = Math.max(0, 100 - activePct - maintenancePct);

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      {/* Header with Title and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
            {tManagerUi('asset_manager') || 'Asset Register'}
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Track, audit, and manage society physical assets, book values, locations, and operational conditions.
          </p>
        </div>

        {/* Action Buttons: Print, Export CSV, Add Modal */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-xs"
            title="Print Assets Register"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-xs"
            title="Export Assets Register as CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            style={{
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)',
              backgroundColor: '#6366f1',
              borderColor: '#818cf8',
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white border hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Library Asset</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Summary Cards (Clean Display Cards, NOT Interlinked Toggle Buttons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assets Overview */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider">
              {tManagerUi('total_assets') || 'Total Assets'}
            </p>
            <p className="text-2xl font-bold text-primary mt-1">{assets.length}</p>
            <span className="text-[11px] text-secondary font-medium">Branch inventory units</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Package size={22} />
          </div>
        </div>

        {/* Active & Operational Overview */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Operational
            </p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{activeCount}</p>
            <span className="text-[11px] text-secondary font-medium">In service & healthy</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Under Maintenance Overview */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              {tManagerUi('under_maintenance') || 'Under Maintenance'}
            </p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{maintenanceCount}</p>
            <span className="text-[11px] text-secondary font-medium">Under active AMC / repair</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Wrench size={22} />
          </div>
        </div>

        {/* Total Book Value Overview */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              Total Book Value
            </p>
            <p className="text-2xl font-bold text-sky-400 font-mono mt-1">
              {formatManagerAssetsCurrency(totalBookValue)}
            </p>
            <span className="text-[11px] text-secondary font-medium">Non-disposed net assets</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
            <IndianRupee size={22} />
          </div>
        </div>
      </div>

      {/* Progress Breakdown Visualizer */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h3 className="text-xs sm:text-sm font-semibold text-primary">
            Asset Inventory Health & Operational Conditions
          </h3>
          <span className="text-xs text-secondary font-medium">
            {assets.length} Total Inventory Records
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-surface-highlight">
          <div
            style={{ width: `${activePct}%` }}
            className="bg-emerald-500 h-full transition-all duration-300"
            title={`Active (${activePct}%)`}
          />
          <div
            style={{ width: `${maintenancePct}%` }}
            className="bg-amber-500 h-full transition-all duration-300"
            title={`Maintenance (${maintenancePct}%)`}
          />
          <div
            style={{ width: `${disposedPct}%` }}
            className="bg-slate-500 h-full transition-all duration-300"
            title={`Disposed (${disposedPct}%)`}
          />
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-secondary pt-1">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Operational ({activePct}%)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Maintenance ({maintenancePct}%)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Disposed ({disposedPct}%)
          </span>
        </div>
      </div>

      {/* Interactive Toolbar with Glowing Filter Pills and Non-overlapping Search */}
      <ManagerAssetsRegisterToolbar
        statusFilter={statusFilter}
        onStatusChange={(newStatus) => {
          setStatusFilter(newStatus);
          setPage(0);
        }}
        categoryFilter={catFilter}
        onCategoryChange={(newCategory) => {
          setCatFilter(newCategory);
          setPage(0);
        }}
        searchQuery={searchQuery}
        onSearchChange={(newQuery) => {
          setSearchQuery(newQuery);
          setPage(0);
        }}
        categories={categories}
        categoryLabel={categoryLabel}
        counts={{
          all: assets.length,
          active: activeCount,
          maintenance: maintenanceCount,
          disposed: disposedCount,
        }}
        onResetFilters={handleResetFilters}
      />

      {/* Assets Records Table */}
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
        onDeleteAsset={(id) => {
          const item = assets.find((a) => a.id === id);
          if (item) setPendingDeleteAsset(item);
        }}
        page={page}
        pageSize={pageSize}
        pageCount={pageCount}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(0);
        }}
      />

      {/* Add Asset Modal */}
      <ManagerAssetsRegisterAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAsset={handleRequestAddAsset}
      />

      {/* Confirm Asset Registration Modal */}
      <ManagerAssetsRegisterConfirmModal
        isOpen={Boolean(pendingNewAsset)}
        assetData={pendingNewAsset}
        onConfirm={handleConfirmAddAsset}
        onCancel={() => setPendingNewAsset(null)}
      />

      {/* Asset Details Modal */}
      <ManagerAssetsRegisterDetailsModal
        isOpen={Boolean(selectedDetailsAsset)}
        asset={selectedDetailsAsset}
        formatCurrency={formatManagerAssetsCurrency}
        categoryLabel={categoryLabel}
        statusLabel={statusLabel}
        onClose={() => setSelectedDetailsAsset(null)}
        onScheduleMaintenance={handleToggleAssetStatus}
      />

      {/* Delete Asset Confirmation Dialog */}
      {pendingDeleteAsset && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-asset-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPendingDeleteAsset(null);
          }}
        >
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 id="delete-asset-title" className="text-sm font-bold text-primary">
                  Delete Asset Record
                </h3>
                <p className="text-xs text-secondary mt-0.5 truncate max-w-[200px]">
                  #{pendingDeleteAsset.id} — {pendingDeleteAsset.name}
                </p>
              </div>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Are you sure you want to remove this asset from the library register? This record will be permanently deleted.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setPendingDeleteAsset(null)}
                className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteAsset(pendingDeleteAsset.id);
                  setPendingDeleteAsset(null);
                }}
                style={{
                  boxShadow: '0 0 16px rgba(239, 68, 68, 0.45)',
                  backgroundColor: '#ef4444',
                  borderColor: '#f87171',
                }}
                className="px-4 py-1.5 rounded-xl text-white text-xs font-semibold border hover:opacity-95 transition-all cursor-pointer"
              >
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
