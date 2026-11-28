'use client';

import { ManagerAssetsMaintenanceAddModal } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceAddModal';
import { ManagerAssetsMaintenanceConfirmModal } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceConfirmModal';
import { ManagerAssetsMaintenanceDeleteDialog } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceDeleteDialog';
import { ManagerAssetsMaintenanceDetailsModal } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceDetailsModal';
import { ManagerAssetsMaintenanceKpis } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceKpis';
import '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceStyles.css';
import {
  ManagerAssetsMaintenanceTable,
  type MaintenanceLogItem,
  type MaintenancePriority,
  type MaintenanceSortField,
  type MaintenanceType,
} from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceTable';
import { ManagerAssetsMaintenanceToolbar } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceToolbar';
import { getManagerAssetsMaintenanceSampleLogs } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/hooks/ManagerAssetsMaintenanceDemoRepository';
import { useManagerAssetsMaintenanceCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/hooks/useManagerAssetsMaintenanceAssetMaintenanceCurrencyFormatter';
import type { ManagerAssetsMaintenanceMainProps } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/types/ManagerAssetsMaintenanceTypes';
import {
  exportMaintenanceLogsCsv,
  formatMaintenanceMinorInr,
} from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/utils/ManagerAssetsMaintenanceExportHelpers';
import { Download, Plus, Printer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const INITIAL_LOGS: MaintenanceLogItem[] = (getManagerAssetsMaintenanceSampleLogs() as MaintenanceLogItem[]).map((log, idx) => ({
  ...log,
  priority: (['urgent', 'routine', 'emergency', 'routine', 'routine'][idx] || 'routine') as MaintenancePriority,
  type: (['preventive', 'breakdown', 'breakdown', 'preventive', 'preventive'][idx] || 'preventive') as MaintenanceType,
}));

export default function ManagerAssetsMaintenancePage({ view, id }: ManagerAssetsMaintenanceMainProps) {
  const tManagerUi = useTranslations('manager.manager_assets_maintenance.ui');
  const formatManagerAssetMaintenanceCurrency = useManagerAssetsMaintenanceCurrencyFormatter();

  const [logsList, setLogsList] = useState<MaintenanceLogItem[]>(INITIAL_LOGS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<MaintenanceSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDetailsItem, setSelectedDetailsItem] = useState<MaintenanceLogItem | null>(null);
  const [pendingStatusTransition, setPendingStatusTransition] = useState<{ logItem: MaintenanceLogItem; nextStatus: string } | null>(null);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<MaintenanceLogItem | null>(null);

  const handleCreateOrder = (newLog: MaintenanceLogItem) => {
    setLogsList((prev) => [newLog, ...prev]);
    if (newLog.cost > 0 && newLog.autoPostToExpenses !== false) {
      const sourceLabel = newLog.expensePaymentSource === 'bank_direct' ? 'Bank Account' : 'Petty Cash Float';
      toast.success(
        `Maintenance order logged & expense of ${formatMaintenanceMinorInr(newLog.cost)} automatically posted to Operating Expenses (${sourceLabel})!`,
        { id: `manager-maintenance-create-${newLog.id}` }
      );
    } else {
      toast.success(`Maintenance request for "${newLog.assetName}" logged successfully.`, {
        id: `manager-maintenance-create-${newLog.id}`,
      });
    }
  };

  const handleRequestUpdateStatus = (logId: number, currentStatus: string) => {
    const logItem = logsList.find((l) => l.id === logId);
    if (!logItem) return;
    setPendingStatusTransition({ logItem, nextStatus: currentStatus === 'pending' ? 'in-progress' : 'completed' });
  };

  const handleConfirmUpdateStatus = () => {
    if (!pendingStatusTransition) return;
    const { logItem, nextStatus } = pendingStatusTransition;
    setLogsList((prev) => prev.map((l) => (l.id === logItem.id ? { ...l, status: nextStatus as MaintenanceLogItem['status'] } : l)));
    toast.success(`Work order for "${logItem.assetName}" updated to ${nextStatus.toUpperCase()}!`, {
      id: `manager-maintenance-status-${logItem.id}`,
    });
    setPendingStatusTransition(null);
  };

  const handleDeleteLog = (logId: number) => {
    const target = logsList.find((l) => l.id === logId);
    if (!target) return;
    setLogsList((prev) => prev.filter((l) => l.id !== logId));
    toast.success(`Maintenance record for "${target.assetName}" has been removed.`, { id: `manager-maintenance-del-${logId}` });
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
    setPage(0);
    toast.info('Filters have been reset to default.', { id: 'manager-maintenance-reset-filters' });
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
      const matchPriority = priorityFilter === 'all' || l.priority === priorityFilter;
      const matchType = typeFilter === 'all' || l.type === typeFilter;
      const matchQ = !q || l.assetName.toLowerCase().includes(q) || l.issue.toLowerCase().includes(q) || l.vendor.toLowerCase().includes(q);
      return matchStatus && matchPriority && matchType && matchQ;
    });
  }, [logsList, statusFilter, priorityFilter, typeFilter, searchQuery]);

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
    exportMaintenanceLogsCsv(sortedRows);
    toast.success('Maintenance register exported to CSV successfully.', { id: 'manager-maintenance-export-csv' });
  };

  const totalCost = logsList.filter((l) => l.status === 'completed').reduce((s, l) => s + l.cost, 0);
  const totalCount = logsList.length || 1;
  const completedCount = logsList.filter((l) => l.status === 'completed').length;
  const inProgressCount = logsList.filter((l) => l.status === 'in-progress').length;
  const pendingCount = logsList.filter((l) => l.status === 'pending').length;
  const completedPct = Math.round((completedCount / totalCount) * 100);
  const inProgressPct = Math.round((inProgressCount / totalCount) * 100);
  const pendingPct = Math.max(0, 100 - completedPct - inProgressPct);
  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);

  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">{tManagerUi('asset_maintenance')}</h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Schedule, monitor, and resolve society maintenance tickets and vendor work orders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-xs"
            title="Print Maintenance Register"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-xs"
            title="Export Maintenance Register as CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mm-btn-glow-indigo inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white border hover:opacity-95 motion-safe:transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Log Maintenance Request</span>
          </button>
        </div>
      </div>

      <ManagerAssetsMaintenanceKpis
        totalLogs={logsList.length}
        pendingCount={pendingCount}
        inProgressCount={inProgressCount}
        completedCount={completedCount}
        totalCostFormatted={formatManagerAssetMaintenanceCurrency(totalCost)}
        completedPct={completedPct}
        inProgressPct={inProgressPct}
        pendingPct={pendingPct}
        labels={{ pending: tManagerUi('pending'), inProgress: tManagerUi('in_progress'), completed: tManagerUi('completed') }}
      />

      <ManagerAssetsMaintenanceToolbar
        statusFilter={statusFilter}
        onStatusChange={(newStatus) => { setStatusFilter(newStatus); setPage(0); }}
        searchQuery={searchQuery}
        onSearchChange={(newQuery) => { setSearchQuery(newQuery); setPage(0); }}
        priorityFilter={priorityFilter}
        onPriorityChange={(newPriority) => { setPriorityFilter(newPriority); setPage(0); }}
        typeFilter={typeFilter}
        onTypeChange={(newType) => { setTypeFilter(newType); setPage(0); }}
        counts={{ all: logsList.length, pending: pendingCount, inProgress: inProgressCount, completed: completedCount }}
        onResetFilters={handleResetFilters}
      />

      <ManagerAssetsMaintenanceTable
        paginated={paginated}
        totalRows={totalRows}
        filteredCount={visible.length}
        searchQuery={searchQuery}
        sortField={sortField}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        formatCurrency={formatManagerAssetMaintenanceCurrency}
        onUpdateStatus={handleRequestUpdateStatus}
        onViewDetails={(item) => setSelectedDetailsItem(item)}
        onDeleteLog={(itemId) => {
          const item = logsList.find((l) => l.id === itemId);
          if (item) setPendingDeleteItem(item);
        }}
        page={page}
        pageSize={pageSize}
        pageCount={pageCount}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(0); }}
      />

      <ManagerAssetsMaintenanceAddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddOrder={handleCreateOrder} />

      <ManagerAssetsMaintenanceConfirmModal
        isOpen={Boolean(pendingStatusTransition)}
        logItem={pendingStatusTransition?.logItem ?? null}
        nextStatus={pendingStatusTransition?.nextStatus ?? null}
        onConfirm={handleConfirmUpdateStatus}
        onCancel={() => setPendingStatusTransition(null)}
      />

      <ManagerAssetsMaintenanceDetailsModal
        isOpen={Boolean(selectedDetailsItem)}
        logItem={selectedDetailsItem}
        formatCurrency={formatManagerAssetMaintenanceCurrency}
        onClose={() => setSelectedDetailsItem(null)}
        onAdvanceStatus={handleRequestUpdateStatus}
      />

      <ManagerAssetsMaintenanceDeleteDialog
        pendingDeleteItem={pendingDeleteItem}
        onCancel={() => setPendingDeleteItem(null)}
        onConfirmDelete={(itemId) => {
          handleDeleteLog(itemId);
          setPendingDeleteItem(null);
        }}
      />
    </div>
  );
}
