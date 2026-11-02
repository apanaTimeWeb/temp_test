'use client';
import type { ManagerAssetsRegisterMainProps } from '@/app/frontend_manager/manager_accounts_assets/assets_register/types/ManagerAssetsRegisterMainTypes';
import { useTranslations } from 'next-intl';
import { useManagerAssetsCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterFormattingHook';
import { MANAGER_ACCOUNTING_SAMPLE_ASSETS, type ManagerAssetsRegisterAsset } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterDemoRepository';
import { useState, useMemo } from 'react';
import { Plus, X, CheckCircle, IndianRupee, ShieldCheck } from 'lucide-react';
import { ManagerAssetsRegisterEmptyState } from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_empty_states/ManagerAssetsRegisterEmptyState';

const STATUS_BADGE: Record<string, string> = {
  active: 'fin-badge--success',
  maintenance: 'fin-badge--warning',
  disposed: 'fin-badge--neutral',
};

export default function ManagerAssetsRegisterPage({ view, id, name, phone, smartId }: ManagerAssetsRegisterMainProps) {
  const tManagerUi = useTranslations('manager.manager_assets.ui');
  const formatManagerAssetsCurrency = useManagerAssetsCurrencyFormatter();
  
  const [assets, setAssets] = useState<ManagerAssetsRegisterAsset[]>(MANAGER_ACCOUNTING_SAMPLE_ASSETS as ManagerAssetsRegisterAsset[]);
  const [catFilter, setCatFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Form State
  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState<string>('Appliance');
  const [assetValue, setAssetValue] = useState('');
  const [assetLocation, setAssetLocation] = useState('North Reading Hall (AC)');
  const [assetDate, setAssetDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [assetStatus, setAssetStatus] = useState<ManagerAssetsRegisterAsset['status']>('active');

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

  const visible = catFilter === 'all' ? assets : assets.filter((a) => a.category === catFilter);

  const totalRows = visible.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = visible.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) {
      alert('Asset name is required.');
      return;
    }
    const val = Number(assetValue);
    if (!val || val <= 0) {
      alert('Valid purchase value is required.');
      return;
    }

    const newAsset: ManagerAssetsRegisterAsset = {
      id: Date.now(),
      name: assetName.trim(),
      category: assetCategory,
      purchaseDate: assetDate,
      purchaseValue: Math.round(val * 100),
      currentValue: Math.round(val * 100),
      location: assetLocation.trim() || 'Floor 1',
      status: assetStatus,
    };

    setAssets([newAsset, ...assets]);
    setIsAddModalOpen(false);
    setAssetName('');
    setAssetValue('');
    setFeedbackToast(`Asset "${newAsset.name}" successfully added to Library Register!`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id} data-route-name={name} data-route-phone={phone} data-route-smart-id={smartId}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="fin-page-title">{tManagerUi('asset_manager')}</h1>
          <p className="fin-page-subtitle">{tManagerUi('review_the_sample_asset_register_asset_changes_are_unava_f6b9af')}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="mgr-btn-primary flex items-center gap-1.5 text-xs font-semibold"
        >
          <Plus size={14} /> Add Library Asset
        </button>
      </div>

      {feedbackToast && (
        <div className="p-3 rounded-xl bg-success-bg border border-success/30 text-success text-xs font-semibold flex items-center gap-2" role="status">
          <span>✓</span>
          <span>{feedbackToast}</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="fin-kpi-card"><p className="fin-kpi-label">{tManagerUi('total_assets')}</p><p className="fin-kpi-value">{assets.length}</p></div>
        <div className="fin-kpi-card fin-kpi-card--warning"><p className="fin-kpi-label fin-kpi-label--warning">{tManagerUi('under_maintenance')}</p><p className="fin-kpi-value fin-kpi-value--warning">{assets.filter((a) => a.status === 'maintenance').length}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label fin-text-muted">{tManagerUi('disposed')}</p><p className="fin-kpi-value fin-text-muted">{assets.filter((a) => a.status === 'disposed').length}</p></div>
      </div>

      <div className="fin-filter-bar">
        <select className="fin-select w-44" value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(0); }} aria-label={tManagerUi('all_categories')}>
          <option value="all">{tManagerUi('all_categories')}</option>
          {categories.map((c) => <option key={c} value={c}>{categoryLabel(c)}</option>)}
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row bg-surface-highlight text-xs uppercase text-secondary font-semibold">
              <th className="text-left py-3 px-4">{tManagerUi('asset_name')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('category')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('purchase_date')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('purchase_value_inr')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('location')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('status')}</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={6}><ManagerAssetsRegisterEmptyState className="fin-empty-state"><div className="fin-empty-state__icon">🏷️</div><p className="fin-empty-state__title">{tManagerUi('no_assets_found')}</p></ManagerAssetsRegisterEmptyState></td></tr>
            ) : paginated.map((a) => (
              <tr key={a.id} className={`fin-table-hover-row fin-table-row border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12 ${a.status === 'disposed' ? 'opacity-50' : ''}`}>
                <td className="py-3 px-4 fin-cell-name font-semibold">{a.name}</td>
                <td className="py-3 px-4"><span className="fin-badge fin-badge--neutral">{categoryLabel(a.category)}</span></td>
                <td className="py-3 px-4 fin-cell-subtext">{a.purchaseDate}</td>
                <td className="py-3 px-4 text-right fin-cell-subtext font-mono font-bold text-primary">{formatManagerAssetsCurrency(a.purchaseValue)}</td>
                <td className="py-3 px-4 fin-cell-subtext">{a.location}</td>
                <td className="py-3 px-4"><span className={`fin-badge ${STATUS_BADGE[a.status]}`}>{statusLabel(a.status)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalRows > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-secondary">
            <span>
              Showing {startItem}–{endItem} of {totalRows} results
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={effectivePage === 0}
                onClick={() => setPage(effectivePage - 1)}
                className="fin-btn fin-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs">
                Page {effectivePage + 1} of {pageCount}
              </span>
              <button
                type="button"
                disabled={effectivePage >= pageCount - 1}
                onClick={() => setPage(effectivePage + 1)}
                className="fin-btn fin-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                <h2 className="text-base font-bold text-primary">Add Library Physical Asset</h2>
              </div>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-secondary hover:text-primary">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-primary block mb-1">Asset Name / Model *</label>
                <input
                  type="text"
                  required
                  className="mgr-input text-xs"
                  placeholder="e.g. Daikin Inverter Split AC 1.5 Ton"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary block mb-1">Category *</label>
                  <select
                    className="mgr-select text-xs"
                    value={assetCategory}
                    onChange={(e) => setAssetCategory(e.target.value as ManagerAssetsRegisterAsset['category'])}
                  >
                    <option value="Appliance">Appliance (AC, RO, Water Cooler)</option>
                    <option value="Electronics">Electronics (Inverter, Wi-Fi)</option>
                    <option value="Furniture">Furniture (Chairs, Desks)</option>
                    <option value="Security">Security (CCTV, Biometric)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary block mb-1">Purchase Cost (INR) *</label>
                  <div className="relative">
                    <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                    <input
                      type="number"
                      required
                      min="1"
                      className="mgr-input pl-8 text-xs font-mono font-bold"
                      placeholder="0.00"
                      value={assetValue}
                      onChange={(e) => setAssetValue(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary block mb-1">Installation Location</label>
                  <input
                    type="text"
                    className="mgr-input text-xs"
                    placeholder="e.g. North Hall / 2nd Floor"
                    value={assetLocation}
                    onChange={(e) => setAssetLocation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary block mb-1">Purchase Date</label>
                  <input
                    type="date"
                    className="mgr-input text-xs"
                    value={assetDate}
                    onChange={(e) => setAssetDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">Initial Condition Status</label>
                <select
                  className="mgr-select text-xs"
                  value={assetStatus}
                  onChange={(e) => setAssetStatus(e.target.value as ManagerAssetsRegisterAsset['status'])}
                >
                  <option value="active">Active & Operational</option>
                  <option value="maintenance">Under Maintenance / AMC</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="mgr-btn-ghost text-xs">
                  Cancel
                </button>
                <button type="submit" className="mgr-btn-primary text-xs flex items-center gap-1.5">
                  <CheckCircle size={14} /> Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
