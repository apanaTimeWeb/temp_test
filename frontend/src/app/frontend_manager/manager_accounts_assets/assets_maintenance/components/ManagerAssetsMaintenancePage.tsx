'use client';
import type { ManagerAssetsMaintenanceMainProps } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/types/ManagerAssetsMaintenanceTypes';
import { getManagerAssetsMaintenanceSampleLogs } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/mocks/ManagerAssetsMaintenanceRepository';
import { useTranslations } from 'next-intl';
import { useManagerAssetsMaintenanceCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/hooks/useManagerAssetsMaintenanceAssetMaintenanceCurrencyFormatter';
import { useState, useMemo } from 'react';
import { Search, Plus, Download } from 'lucide-react';
import { toast } from 'sonner';
import {
  ManagerAssetsMaintenanceTable,
  type MaintenanceSortField,
  type MaintenanceLogItem,
} from './ManagerAssetsMaintenanceTable';
import { ManagerAssetsMaintenanceAddModal } from './ManagerAssetsMaintenanceAddModal';

// RESPONSIBILITY: Entry page for the manager_asset_maintenance module.
// DATA FLOW: Next.js Router -> Page -> Components

const MOCK = getManagerAssetsMaintenanceSampleLogs();

export default function ManagerAssetsMaintenancePage({ view, id }: ManagerAssetsMaintenanceMainProps) {
  const tManagerUi = useTranslations('manager.manager_assets_maintenance.ui');
  const formatManagerAssetMaintenanceCurrency = useManagerAssetsMaintenanceCurrencyFormatter();
  const [logsList, setLogsList] = useState<MaintenanceLogItem[]>(MOCK as MaintenanceLogItem[]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<MaintenanceSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleCreateOrder = (newLog: MaintenanceLogItem) => {
    setLogsList([newLog, ...logsList]);
    toast.success(`Maintenance request for "${newLog.assetName}" logged successfully.`);
  };

  const handleUpdateStatus = (logId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'pending' ? 'in-progress' : 'completed';
    setLogsList((prev) => prev.map((l) => (l.id === logId ? { ...l, status: nextStatus } : l)));
    toast.success(`Work order status updated to ${nextStatus.toUpperCase()}!`);
  };

  const toggleSort = (field: MaintenanceSortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return logsList.filter((l) => {
      const matchStatus = statusFilter === 'all' || l.status === statusFilter;
      const matchQ =
        !q ||
        l.assetName.toLowerCase().includes(q) ||
        l.issue.toLowerCase().includes(q) ||
        l.vendor.toLowerCase().includes(q);
      return matchStatus && matchQ;
    });
  }, [logsList, statusFilter, searchQuery]);

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

  const handleExportCsv = () => {
    const headers = 'Asset Name,Issue,Reported Date,Scheduled Date,Vendor,Cost (INR),Status\n';
    const rows = sortedRows
      .map((l) => `"${l.assetName}","${l.issue}","${l.reportedDate}","${l.scheduledDate}","${l.vendor}","${l.cost}","${l.status}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `asset_maintenance_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const totalCost = logsList.filter((l) => l.status === 'completed').reduce((s, l) => s + l.cost, 0);
  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="fin-page-title">{tManagerUi('asset_maintenance')}</h1>
          <p className="fin-page-subtitle">{tManagerUi('review_the_sample_maintenance_register_updates_are_unava_163c7f')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="mgr-btn-ghost flex items-center gap-1.5 text-xs font-semibold"
            title="Export Maintenance Register as CSV"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mgr-btn-primary flex items-center gap-1.5 text-xs font-semibold"
          >
            <Plus size={14} /> Log Maintenance Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fin-kpi-card fin-kpi-card--warning">
          <p className="fin-kpi-label fin-kpi-label--warning">{tManagerUi('pending')}</p>
          <p className="fin-kpi-value fin-kpi-value--warning">{logsList.filter((l) => l.status === 'pending').length}</p>
        </div>
        <div className="fin-kpi-card">
          <p className="fin-kpi-label fin-text-info">{tManagerUi('in_progress')}</p>
          <p className="fin-kpi-value fin-text-info">{logsList.filter((l) => l.status === 'in-progress').length}</p>
        </div>
        <div className="fin-kpi-card">
          <p className="fin-kpi-label fin-text-success">{tManagerUi('completed')}</p>
          <p className="fin-kpi-value fin-text-success">{logsList.filter((l) => l.status === 'completed').length}</p>
        </div>
        <div className="fin-kpi-card fin-kpi-card--danger">
          <p className="fin-kpi-label fin-kpi-label--danger">{tManagerUi('total_cost')}</p>
          <p className="fin-kpi-value fin-kpi-value--danger">{formatManagerAssetMaintenanceCurrency(totalCost)}</p>
        </div>
      </div>

      <div className="fin-card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-primary">Maintenance Work Orders & Status Resolution</h3>
          <span className="text-xs text-secondary">{logsList.length} Total Service Tickets</span>
        </div>
        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-surface-highlight">
          <div className="w-[60%] bg-success h-full" title="Completed (60%)" />
          <div className="w-[25%] bg-info h-full" title="In Progress (25%)" />
          <div className="w-[15%] bg-warning h-full" title="Pending (15%)" />
        </div>
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-secondary">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success" /> Completed (60%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-info" /> In Progress (25%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warning" /> Pending (15%)</span>
        </div>
      </div>

      <div className="fin-filter-bar flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            placeholder="Search asset, issue, or vendor..."
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
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          aria-label={tManagerUi('all_status')}
        >
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="pending">{tManagerUi('pending')}</option>
          <option value="in-progress">{tManagerUi('in_progress')}</option>
          <option value="completed">{tManagerUi('completed')}</option>
        </select>
      </div>

      <ManagerAssetsMaintenanceTable
        paginated={paginated}
        totalRows={totalRows}
        filteredCount={visible.length}
        searchQuery={searchQuery}
        sortField={sortField}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        formatCurrency={formatManagerAssetMaintenanceCurrency}
        onUpdateStatus={handleUpdateStatus}
        page={page}
        pageSize={pageSize}
        pageCount={pageCount}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(0);
        }}
      />

      <p className="fin-input-hint fin-text-warning" role="status" data-testid="manager-accounting-maintenance-contract-warning">
        {tManagerUi('sample_data_only_creating_maintenance_logs_or_completing_cfeb24')}
      </p>

      <ManagerAssetsMaintenanceAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddOrder={handleCreateOrder}
      />
    </div>
  );
}
