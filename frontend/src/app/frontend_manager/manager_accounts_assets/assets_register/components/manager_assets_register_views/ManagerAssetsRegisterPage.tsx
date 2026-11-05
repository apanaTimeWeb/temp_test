'use client';
import type { ManagerAssetsRegisterMainProps } from '@/app/frontend_manager/manager_accounts_assets/assets_register/types/ManagerAssetsRegisterMainTypes';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { useManagerAssetsCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterFormattingHook';
import { MANAGER_ACCOUNTING_SAMPLE_ASSETS, type ManagerAssetsRegisterAsset } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterDemoRepository';
import {
  ManagerAssetsRegisterTable,
  type AssetSortField,
} from './ManagerAssetsRegisterTable';
import { ManagerAssetsRegisterAddModal } from '../manager_assets_register_dialogs/ManagerAssetsRegisterAddModal';

export default function ManagerAssetsRegisterPage({ view, id, name, phone, smartId }: ManagerAssetsRegisterMainProps) {
  const tManagerUi = useTranslations('manager.manager_assets.ui');
  const formatManagerAssetsCurrency = useManagerAssetsCurrencyFormatter();

  const [assets, setAssets] = useState<ManagerAssetsRegisterAsset[]>(MANAGER_ACCOUNTING_SAMPLE_ASSETS as ManagerAssetsRegisterAsset[]);
  const [catFilter, setCatFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [sortField, setSortField] = useState<AssetSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
      case 'active': return tManagerUi('asset_status_active');
      case 'maintenance': return tManagerUi('asset_status_maintenance');
      case 'disposed': return tManagerUi('asset_status_disposed');
      default: return status;
    }
  };

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return assets.filter((a) => {
      const matchCat = catFilter === 'all' || a.category === catFilter;
      const matchQ =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [assets, catFilter, searchQuery]);

  const toggleSort = (field: AssetSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRows = useMemo(() => {
    if (!sortField) return visible;
    return [...visible].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = typeof aVal === 'number' && typeof bVal === 'number'
        ? aVal - bVal
        : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [visible, sortField, sortDirection]);

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);

  const handleAddAsset = (newAsset: ManagerAssetsRegisterAsset) => {
    setAssets([newAsset, ...assets]);
    setFeedbackToast(`Asset "${newAsset.name}" successfully added to Library Register!`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleExportCsv = () => {
    const headers = 'Asset Name,Category,Purchase Date,Value (INR),Location,Status\n';
    const rows = sortedRows
      .map((a) => `"${a.name}","${a.category}","${a.purchaseDate}","${a.purchaseValue}","${a.location}","${a.status}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `assets_register_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="space-y-6"
      data-route-view={view}
      data-route-id={id}
      data-route-name={name}
      data-route-phone={phone}
      data-route-smart-id={smartId}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="fin-page-title">{tManagerUi('asset_manager')}</h1>
          <p className="fin-page-subtitle">{tManagerUi('review_the_sample_asset_register_asset_changes_are_unava_f6b9af')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="mgr-btn-ghost flex items-center gap-1.5 text-xs font-semibold"
            title="Export Assets Register as CSV"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mgr-btn-primary flex items-center gap-1.5 text-xs font-semibold"
          >
            <Plus size={14} /> Add Library Asset
          </button>
        </div>
      </div>

      {feedbackToast && (
        <div className="p-3 rounded-xl bg-success-bg border border-border text-success text-xs font-semibold flex items-center gap-2" role="status">
          <span>✓</span>
          <span>{feedbackToast}</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="fin-kpi-card">
          <p className="fin-kpi-label">{tManagerUi('total_assets')}</p>
          <p className="fin-kpi-value">{assets.length}</p>
        </div>
        <div className="fin-kpi-card fin-kpi-card--warning">
          <p className="fin-kpi-label fin-kpi-label--warning">{tManagerUi('under_maintenance')}</p>
          <p className="fin-kpi-value fin-kpi-value--warning">{assets.filter((a) => a.status === 'maintenance').length}</p>
        </div>
        <div className="fin-kpi-card">
          <p className="fin-kpi-label fin-text-muted">{tManagerUi('disposed')}</p>
          <p className="fin-kpi-value fin-text-muted">{assets.filter((a) => a.status === 'disposed').length}</p>
        </div>
      </div>

      <div className="fin-filter-bar flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            placeholder="Search asset name, category, or location..."
            className="mgr-input pl-8 text-xs w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <select
          className="fin-select w-44"
          value={catFilter}
          onChange={(e) => {
            setCatFilter(e.target.value);
            setPage(0);
          }}
          aria-label={tManagerUi('all_categories')}
        >
          <option value="all">{tManagerUi('all_categories')}</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {categoryLabel(c)}
            </option>
          ))}
        </select>
      </div>

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
        page={page}
        pageSize={pageSize}
        pageCount={pageCount}
        onPageChange={setPage}
      />

      <ManagerAssetsRegisterAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAsset={handleAddAsset}
      />
    </div>
  );
}
