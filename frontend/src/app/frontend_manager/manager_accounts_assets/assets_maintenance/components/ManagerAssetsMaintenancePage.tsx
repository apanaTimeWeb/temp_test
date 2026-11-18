'use client';

import type { ManagerAssetsMaintenanceMainProps } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/types/ManagerAssetsMaintenanceTypes';
import { getManagerAssetsMaintenanceSampleLogs } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/mocks/ManagerAssetsMaintenanceRepository';
import { useTranslations } from 'next-intl';
import { useManagerAssetsMaintenanceCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/hooks/useManagerAssetsMaintenanceAssetMaintenanceCurrencyFormatter';
import { useState, useMemo } from 'react';
import {
  Plus,
  Download,
  Printer,
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Layers,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  ManagerAssetsMaintenanceTable,
  type MaintenanceSortField,
  type MaintenanceLogItem,
  type MaintenancePriority,
  type MaintenanceType,
} from './ManagerAssetsMaintenanceTable';
import { ManagerAssetsMaintenanceToolbar } from './ManagerAssetsMaintenanceToolbar';
import { ManagerAssetsMaintenanceAddModal } from './ManagerAssetsMaintenanceAddModal';
import { ManagerAssetsMaintenanceConfirmModal } from './ManagerAssetsMaintenanceConfirmModal';
import { ManagerAssetsMaintenanceDetailsModal } from './ManagerAssetsMaintenanceDetailsModal';

// Entry page for the manager_asset_maintenance module.
// DATA FLOW: Next.js Router -> Page -> Components

const INITIAL_LOGS: MaintenanceLogItem[] = (
  getManagerAssetsMaintenanceSampleLogs() as MaintenanceLogItem[]
).map((log, idx) => ({
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

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDetailsItem, setSelectedDetailsItem] = useState<MaintenanceLogItem | null>(null);
  const [pendingStatusTransition, setPendingStatusTransition] = useState<{
    logItem: MaintenanceLogItem;
    nextStatus: string;
  } | null>(null);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<MaintenanceLogItem | null>(null);

  const handleCreateOrder = (newLog: MaintenanceLogItem) => {
    setLogsList((prev) => [newLog, ...prev]);
    if (newLog.cost > 0 && newLog.autoPostToExpenses !== false) {
      const formattedAmount = (newLog.cost / 100).toLocaleString('en-IN');
      const sourceLabel = newLog.expensePaymentSource === 'bank_direct' ? 'Bank Account' : 'Petty Cash Float';
      toast.success(
        `Maintenance order logged & expense of ₹${formattedAmount} automatically posted to Operating Expenses (${sourceLabel})!`
      );
    } else {
      toast.success(`Maintenance request for "${newLog.assetName}" logged successfully.`);
    }
  };

  const handleRequestUpdateStatus = (logId: number, currentStatus: string) => {
    const logItem = logsList.find((l) => l.id === logId);
    if (!logItem) return;
    const nextStatus = currentStatus === 'pending' ? 'in-progress' : 'completed';
    setPendingStatusTransition({ logItem, nextStatus });
  };

  const handleConfirmUpdateStatus = () => {
    if (!pendingStatusTransition) return;
    const { logItem, nextStatus } = pendingStatusTransition;
    setLogsList((prev) =>
      prev.map((l) =>
        l.id === logItem.id ? { ...l, status: nextStatus as MaintenanceLogItem['status'] } : l
      )
    );
    toast.success(`Work order for "${logItem.assetName}" updated to ${nextStatus.toUpperCase()}!`);
    setPendingStatusTransition(null);
  };

  const handleDeleteLog = (logId: number) => {
    const target = logsList.find((l) => l.id === logId);
    if (!target) return;
    setLogsList((prev) => prev.filter((l) => l.id !== logId));
    toast.success(`Maintenance record for "${target.assetName}" has been removed.`);
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
    setPage(0);
    toast.info('Filters have been reset to default.');
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
      const matchQ =
        !q ||
        l.assetName.toLowerCase().includes(q) ||
        l.issue.toLowerCase().includes(q) ||
        l.vendor.toLowerCase().includes(q);
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
          : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, {
              numeric: true,
              sensitivity: 'base',
            });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [visible, sortField, sortDirection]);

  const escapeCsv = (v: unknown) => {
    let s = String(v ?? '');
    return /^[\u0000-\u0020]*[=+\-@]/.test(s) ? `'"${s.replace(/"/g, '""')}"` : `"${s.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    const headers = [
      'Ticket ID',
      'Asset Name',
      'Priority',
      'Type',
      'Issue',
      'Reported Date',
      'Scheduled Date',
      'Vendor',
      'Cost (INR)',
      'Status',
    ]
      .map(escapeCsv)
      .join(',');

    const rows = sortedRows
      .map((l) =>
        [
          l.id,
          l.assetName,
          l.priority || 'routine',
          l.type || 'preventive',
          l.issue,
          l.reportedDate,
          l.scheduledDate,
          l.vendor,
          (l.cost / 100).toFixed(2),
          l.status,
        ]
          .map(escapeCsv)
          .join(',')
      )
      .join('\r\n');

    const blob = new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = Object.assign(document.createElement('a'), {
      href: url,
      download: `asset_maintenance_${new Date().toISOString().slice(0, 10)}.csv`,
      hidden: true,
    });
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Maintenance register exported to CSV successfully.');
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
      {/* Header with Title and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
            {tManagerUi('asset_maintenance')}
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Schedule, monitor, and resolve society maintenance tickets and vendor work orders.
          </p>
        </div>

        {/* Action Buttons: Print, Export CSV, Add Modal */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-xs"
            title="Print Maintenance Register"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-xs"
            title="Export Maintenance Register as CSV"
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
            <span>Log Maintenance Request</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tickets Overview */}
        <div className="group relative overflow-hidden p-5 rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#181c4b] to-indigo-900/60 shadow-lg shadow-indigo-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-400/60 hover:shadow-xl flex items-center justify-between cursor-default select-none">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Total Work Orders
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-sans">{logsList.length}</p>
            <span className="text-[11px] text-slate-400 font-medium">Registered service logs</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-xs relative z-10">
            <Layers size={22} />
          </div>
        </div>

        {/* Pending Tickets Overview */}
        <div className="group relative overflow-hidden p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-[#261708] to-amber-900/60 shadow-lg shadow-amber-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-amber-400/60 hover:shadow-xl flex items-center justify-between cursor-default select-none">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              {tManagerUi('pending')}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1 font-sans">{pendingCount}</p>
            <span className="text-[11px] text-amber-200/70 font-medium">Awaiting service start</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-xs relative z-10">
            <Clock size={22} />
          </div>
        </div>

        {/* In-Progress Tickets Overview */}
        <div className="group relative overflow-hidden p-5 rounded-2xl border border-sky-500/40 bg-gradient-to-br from-sky-950/80 via-[#0e2540] to-sky-900/60 shadow-lg shadow-sky-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-sky-400/60 hover:shadow-xl flex items-center justify-between cursor-default select-none">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              {tManagerUi('in_progress')}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-sky-400 mt-1 font-sans">{inProgressCount}</p>
            <span className="text-[11px] text-sky-200/70 font-medium">Under active technician repair</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-xs relative z-10">
            <Wrench size={22} />
          </div>
        </div>

        {/* Completed & Cost Overview */}
        <div className="group relative overflow-hidden p-5 rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-[#0e2c21] to-emerald-900/60 shadow-lg shadow-emerald-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-400/60 hover:shadow-xl flex items-center justify-between cursor-default select-none">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,34 Q25,18 55,20 T105,8 T150,14" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {tManagerUi('completed')} ({completedCount})
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 font-mono">
              {formatManagerAssetMaintenanceCurrency(totalCost)}
            </p>
            <span className="text-[11px] text-emerald-200/70 font-medium">Total settled repair cost</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-xs relative z-10">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Progress Resolution Visualizer */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h3 className="text-xs sm:text-sm font-semibold text-primary">
            Maintenance Work Orders & Status Resolution
          </h3>
          <span className="text-xs text-secondary font-medium">
            {logsList.length} Total Service Tickets Recorded
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-surface-highlight">
          <div
            style={{ width: `${completedPct}%` }}
            className="bg-emerald-500 h-full transition-all duration-300"
            title={`Completed (${completedPct}%)`}
          />
          <div
            style={{ width: `${inProgressPct}%` }}
            className="bg-sky-500 h-full transition-all duration-300"
            title={`In Progress (${inProgressPct}%)`}
          />
          <div
            style={{ width: `${pendingPct}%` }}
            className="bg-amber-500 h-full transition-all duration-300"
            title={`Pending (${pendingPct}%)`}
          />
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-secondary pt-1">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed ({completedPct}%)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> In Progress ({inProgressPct}%)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending ({pendingPct}%)
          </span>
        </div>
      </div>

      {/* Interactive Toolbar with Glowing Filter Pills and Non-overlapping Search */}
      <ManagerAssetsMaintenanceToolbar
        statusFilter={statusFilter}
        onStatusChange={(newStatus) => {
          setStatusFilter(newStatus);
          setPage(0);
        }}
        searchQuery={searchQuery}
        onSearchChange={(newQuery) => {
          setSearchQuery(newQuery);
          setPage(0);
        }}
        priorityFilter={priorityFilter}
        onPriorityChange={(newPriority) => {
          setPriorityFilter(newPriority);
          setPage(0);
        }}
        typeFilter={typeFilter}
        onTypeChange={(newType) => {
          setTypeFilter(newType);
          setPage(0);
        }}
        counts={{
          all: logsList.length,
          pending: pendingCount,
          inProgress: inProgressCount,
          completed: completedCount,
        }}
        onResetFilters={handleResetFilters}
      />

      {/* Maintenance Records Table */}
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
        onDeleteLog={(id) => {
          const item = logsList.find((l) => l.id === id);
          if (item) setPendingDeleteItem(item);
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

      {/* Modals */}
      <ManagerAssetsMaintenanceAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddOrder={handleCreateOrder}
      />

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

      {/* Delete Confirmation Dialog */}
      {pendingDeleteItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPendingDeleteItem(null);
          }}
        >
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 id="delete-confirm-title" className="text-sm font-bold text-primary">
                  Delete Maintenance Ticket
                </h3>
                <p className="text-xs text-secondary mt-0.5 truncate max-w-[200px]">
                  #{pendingDeleteItem.id} — {pendingDeleteItem.assetName}
                </p>
              </div>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Are you sure you want to remove this maintenance ticket? This action will remove it from the active service register.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setPendingDeleteItem(null)}
                className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteLog(pendingDeleteItem.id);
                  setPendingDeleteItem(null);
                }}
                style={{
                  boxShadow: '0 0 16px rgba(239, 68, 68, 0.45)',
                  backgroundColor: '#ef4444',
                  borderColor: '#f87171',
                }}
                className="px-4 py-1.5 rounded-xl text-white text-xs font-semibold border hover:opacity-95 transition-all cursor-pointer"
              >
                Delete Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
