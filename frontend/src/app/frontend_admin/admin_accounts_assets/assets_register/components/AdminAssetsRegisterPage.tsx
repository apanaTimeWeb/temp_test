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
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { Building,FileSpreadsheet,PlusCircle,RotateCcw,Search,ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect,useState } from 'react';
import { toast } from 'sonner';

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

  const needsServiceCount = records.filter(
    (r) => r.status === 'MAINTENANCE_REQUIRED' || r.status === 'UNDER_REPAIR'
  ).length;

  const handleResetFilters = () => {
    setTabFilter('ALL');
    setBranchFilter('ALL');
    setCategoryFilter('ALL');
    setSearchQuery('');
  };

  const handleExportCsv = () => {
    const headers = [
      'Asset Code',
      'Asset Name',
      'Category',
      'Branch',
      'Location',
      'Purchase Date',
      'Purchase Cost (INR)',
      'Book Value (INR)',
      'Status',
      'Warranty Expiry',
      'AMC Status',
      'AMC Vendor',
      'AMC Expiry',
      'Serial Number',
    ];
    const rows = filteredRecords.map((r) => [
      `"${r.assetCode}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      r.category,
      `"${r.branchName}"`,
      `"${r.locationWithinBranch.replace(/"/g, '""')}"`,
      r.purchaseDate,
      (r.purchaseCost / 100).toFixed(2),
      (r.currentBookValue / 100).toFixed(2),
      r.status,
      r.warrantyExpiryDate,
      r.amcStatus,
      `"${r.amcVendorName ?? ''}"`,
      r.amcExpiryDate ?? '',
      `"${r.serialNumber ?? ''}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-asset-register-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${filteredRecords.length} asset records to CSV`);
  };

  const handleExportExcel = () => {
    const headers = [
      'Asset Code',
      'Asset Name',
      'Category',
      'Branch',
      'Location',
      'Purchase Date',
      'Purchase Cost (INR)',
      'Book Value (INR)',
      'Status',
      'Warranty Expiry',
      'AMC Status',
      'AMC Vendor',
      'AMC Expiry',
      'Serial Number',
    ];
    const rows = filteredRecords.map((r) => [
      r.assetCode,
      r.name,
      r.category,
      r.branchName,
      r.locationWithinBranch,
      r.purchaseDate,
      `₹${(r.purchaseCost / 100).toLocaleString('en-IN')}`,
      `₹${(r.currentBookValue / 100).toLocaleString('en-IN')}`,
      r.status.replace(/_/g, ' '),
      r.warrantyExpiryDate,
      r.amcStatus.replace(/_/g, ' '),
      r.amcVendorName ?? 'None',
      r.amcExpiryDate ?? '-',
      r.serialNumber ?? '-',
    ]);
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Assets Audit</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
          th { background-color: #0284c7; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #0369a1; text-align: left; }
          td { padding: 8px; border: 1px solid #cbd5e1; }
          tr:nth-child(even) { background-color: #f0f9ff; }
        </style>
      </head>
      <body>
        <table>
          <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `.trim();
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-asset-register-audit-${new Date().toISOString().slice(0, 10)}.xls`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${filteredRecords.length} asset records to Excel (.xls)`);
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

      {/* Header section with Export and Add Asset buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold text-text-secondary backdrop-blur-md">
            <Building className="h-3.5 w-3.5 text-primary" />
            <span>Physical Assets & AMC Tracking</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t('TITLE')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('SUBTITLE')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs sm:text-sm font-semibold text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors shadow-xs"
            title="Export Asset Register as CSV"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs sm:text-sm font-semibold text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors shadow-xs"
            title="Export Asset Register as Formatted Excel (.xls)"
          >
            <FileSpreadsheet className="h-4 w-4 text-sky-500" />
            <span>Export Excel</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{t('ACTIONS.ADD_ASSET')}</span>
          </button>
        </div>
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
              <input maxLength={100}
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
