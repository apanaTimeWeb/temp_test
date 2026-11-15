'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  Clock,
  Eye,
  CheckCheck,
  Check,
  AlertCircle,
  Sparkles,
  Coins,
  RotateCcw,
  Receipt,
  Megaphone,
  Search,
  X,
  Download,
  Send,
  Smartphone,
  CheckCircle2,
  Filter,
  Printer,
  RotateCw,
} from 'lucide-react';

import { maskManagerWhatsappLogsPhone } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/utils/ManagerCommunicationWhatsappLogsUtilities';
import {
  MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_LOGS,
  type WaLog,
} from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/hooks/ManagerCommunicationWhatsappLogsDemoRepository';
import ManagerCommunicationWhatsappLogsNativeTable, {
  type NativeCellParams,
} from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/components/manager_communication_whatsapp_logs_table_parts/ManagerCommunicationWhatsappLogsNativeTable';
import { ManagerCommunicationWhatsappLogsWhatsappLogDetailsDialog } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/components/manager_communication_whatsapp_logs_dialogs/ManagerCommunicationWhatsappLogsWhatsappLogDetailsDialog';
import type { ManagerCommunicationWhatsappLogsRouteQueryProps } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/types/ManagerCommunicationWhatsappLogsComponentTypes';

const LOGS = MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_LOGS;

const TYPE_CONFIG: Record<
  string,
  { label: string; badge: string; icon: React.ReactNode }
> = {
  welcome: {
    label: 'Welcome',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    icon: <Sparkles size={12} className="shrink-0" />,
  },
  fee_reminder: {
    label: 'Fee Due',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    icon: <Coins size={12} className="shrink-0" />,
  },
  renewal: {
    label: 'Renewal',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
    icon: <RotateCcw size={12} className="shrink-0" />,
  },
  receipt: {
    label: 'Receipt',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
    icon: <Receipt size={12} className="shrink-0" />,
  },
  notice: {
    label: 'Notice',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25',
    icon: <Megaphone size={12} className="shrink-0" />,
  },
};

const STATUS_CONFIG: Record<
  WaLog['status'],
  { label: string; badge: string; icon: React.ReactNode }
> = {
  Delivered: {
    label: 'Delivered',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    icon: <CheckCheck size={13} className="text-[#53bdeb] shrink-0" />,
  },
  Sent: {
    label: 'Sent',
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/25',
    icon: <Send size={11} className="text-sky-400 shrink-0" />,
  },
  Pending: {
    label: 'Pending',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    icon: <Clock size={11} className="text-amber-400 shrink-0" />,
  },
  Failed: {
    label: 'Failed',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    icon: <AlertCircle size={12} className="text-rose-400 shrink-0" />,
  },
};

export default function ManagerCommunicationWhatsappLogsPage(_routeQuery: ManagerCommunicationWhatsappLogsRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_whatsapp_logs.ui');

  const statusLabels: Record<WaLog['status'], string> = {
    Pending: tManagerUi('pending'),
    Sent: tManagerUi('sent'),
    Delivered: tManagerUi('delivered'),
    Failed: tManagerUi('failed'),
  };

  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [viewLog, setViewLog] = useState<WaLog | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const getTypeLabel = (type: WaLog['type']) => {
    switch (type) {
      case 'welcome': return tManagerUi('welcome');
      case 'fee_reminder': return tManagerUi('fee_reminder');
      case 'receipt': return tManagerUi('receipt');
      case 'notice': return tManagerUi('notice');
      case 'renewal': return tManagerUi('renewal');
      default: return type;
    }
  };

  const normalizedSearch = debouncedSearch.trim().toLowerCase();
  const filtered = useMemo(() => {
    return LOGS.filter((l) => {
      if (typeFilter !== 'All' && l.type !== typeFilter) return false;
      if (statusFilter !== 'All' && l.status !== statusFilter) return false;
      const logDate = l.dateTime.slice(0, 10);
      if (dateFrom && logDate < dateFrom) return false;
      if (dateTo && logDate > dateTo) return false;
      if (
        normalizedSearch &&
        !l.student.toLowerCase().includes(normalizedSearch) &&
        !l.phone.includes(debouncedSearch.trim())
      ) {
        return false;
      }
      return true;
    });
  }, [typeFilter, statusFilter, dateFrom, dateTo, normalizedSearch, debouncedSearch]);

  const hasActiveFilters = Boolean(
    typeFilter !== 'All' || statusFilter !== 'All' || dateFrom || dateTo || search.trim()
  );

  const handleResetFilters = () => {
    setTypeFilter('All');
    setStatusFilter('All');
    setDateFrom('');
    setDateTo('');
    setSearch('');
  };

  const handleExportCsv = () => {
    const headers = 'ID,Date Time,Phone,Student,Type,Status,Error,Message\n';
    const rows = filtered
      .map(
        (l) =>
          `"${l.id}","${l.dateTime}","${l.phone}","${l.student}","${l.type}","${l.status}","${(l.error || '').replace(/"/g, '""')}","${l.message.replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `whatsapp_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('WhatsApp delivery logs exported to CSV successfully');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    toast.success('WhatsApp delivery logs feed refreshed');
  };

  // KPI Metrics Calculation
  const totalCount = LOGS.length;
  const deliveredCount = LOGS.filter((l) => l.status === 'Delivered').length;
  const sentCount = LOGS.filter((l) => l.status === 'Sent').length;
  const failedCount = LOGS.filter((l) => l.status === 'Failed').length;

  const colDefs = [
    {
      field: 'dateTime',
      headerName: tManagerUi('date_time'),
      width: 170,
      cellRenderer: (p: NativeCellParams) => (
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-secondary font-mono">
          <Clock size={13} className="text-secondary shrink-0 opacity-70" />
          <span>{String(p.value ?? '—')}</span>
        </div>
      ),
    },
    {
      field: 'student',
      headerName: tManagerUi('student'),
      flex: 1,
      minWidth: 160,
      cellRenderer: (p: NativeCellParams) => {
        const name = String(p.value ?? '—');
        const initial = name.charAt(0).toUpperCase();
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/20 shrink-0">
              {initial}
            </div>
            <span className="text-xs sm:text-sm font-bold text-primary truncate">
              {name}
            </span>
          </div>
        );
      },
    },
    {
      field: 'phone',
      headerName: tManagerUi('phone'),
      width: 140,
      cellRenderer: (p: NativeCellParams) => (
        <span className="text-xs sm:text-sm font-mono text-secondary font-medium">
          {maskManagerWhatsappLogsPhone(String(p.value ?? ''))}
        </span>
      ),
    },
    {
      field: 'type',
      headerName: tManagerUi('type'),
      width: 140,
      cellRenderer: (p: NativeCellParams) => {
        const typeKey = String(p.value as WaLog['type']);
        const config = TYPE_CONFIG[typeKey] || {
          label: getTypeLabel(typeKey as WaLog['type']),
          badge: 'bg-primary/10 text-primary border-primary/25',
          icon: <Smartphone size={12} className="shrink-0" />,
        };
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.badge}`}
          >
            {config.icon}
            <span>{getTypeLabel(typeKey as WaLog['type'])}</span>
          </span>
        );
      },
    },
    {
      field: 'status',
      headerName: tManagerUi('status'),
      width: 130,
      cellRenderer: (p: NativeCellParams) => {
        const statusKey = p.value as WaLog['status'];
        const config = STATUS_CONFIG[statusKey] || {
          label: statusLabels[statusKey] || String(statusKey),
          badge: 'bg-secondary/10 text-secondary border-secondary/25',
          icon: null,
        };
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.badge}`}
          >
            {config.icon}
            <span>{statusLabels[statusKey] || String(statusKey)}</span>
          </span>
        );
      },
    },
    {
      field: 'error',
      headerName: tManagerUi('error_7f2f6a'),
      width: 170,
      cellRenderer: (p: NativeCellParams) =>
        p.value ? (
          <span
            className="text-xs text-rose-400 font-medium truncate max-w-xs block"
            title={String(p.value)}
          >
            {String(p.value)}
          </span>
        ) : (
          <span className="text-xs text-secondary opacity-40">—</span>
        ),
    },
    {
      headerName: tManagerUi('actions'),
      width: 90,
      sortable: false,
      cellRenderer: (params: NativeCellParams) => (
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setViewLog((params.data as WaLog) ?? null)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-colors cursor-pointer"
            title={tManagerUi('view_message')}
            aria-label={tManagerUi('view_message')}
          >
            <Eye size={13} />
            <span>View</span>
          </button>
        </div>
      ),
    },
  ];

  const activeTypeConfig = viewLog ? TYPE_CONFIG[viewLog.type] : null;
  const activeStatusConfig = viewLog ? STATUS_CONFIG[viewLog.status] : null;

  return (
    <div
      className="mgr-page-animate relative pb-12 space-y-6 max-w-7xl mx-auto"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
    >
      <ManagerCommunicationWhatsappLogsWhatsappLogDetailsDialog
        log={viewLog}
        typeLabel={viewLog ? getTypeLabel(viewLog.type) : ''}
        statusLabel={viewLog ? statusLabels[viewLog.status] : ''}
        typeClassName={activeTypeConfig ? activeTypeConfig.badge : ''}
        statusClassName={activeStatusConfig ? activeStatusConfig.badge : ''}
        onClose={() => setViewLog(null)}
        labels={{
          close: tManagerUi('close'),
          messageDetails: tManagerUi('message_details'),
          to: tManagerUi('to'),
          student: tManagerUi('log_student'),
          sentAt: tManagerUi('sent_at'),
          messageContent: tManagerUi('message_content'),
          error: tManagerUi('error'),
        }}
      />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            {tManagerUi('whatsapp_logs_3fd13a')}
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            {tManagerUi('all_outbound_whatsapp_messages_sent_from_the_system')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={handleRefresh}
            className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold py-2 px-3 rounded-xl cursor-pointer hover:bg-surface-hover transition-colors"
            title="Refresh logs feed"
          >
            <RotateCw size={14} className="text-secondary" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold py-2 px-3.5 rounded-xl cursor-pointer hover:bg-surface-hover transition-colors"
            title="Print delivery report"
          >
            <Printer size={14} className="text-secondary" />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold py-2 px-3.5 rounded-xl cursor-pointer hover:bg-surface-hover transition-colors"
            title="Export filtered logs to CSV"
          >
            <Download size={14} className="text-secondary" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Messages Card */}
        <div className="mgr-card p-4 border border-border flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/25 shrink-0">
            <Smartphone size={20} />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary block">
              Total Dispatched
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-primary">
              {totalCount}
            </span>
          </div>
        </div>

        {/* Delivered Card */}
        <div className="mgr-card p-4 border border-border flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/25 shrink-0">
            <CheckCheck size={20} />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary block">
              Delivered
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-emerald-400">
              {deliveredCount}
            </span>
          </div>
        </div>

        {/* Sent / In Flight Card */}
        <div className="mgr-card p-4 border border-border flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/25 shrink-0">
            <Send size={18} />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary block">
              Sent / In Flight
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-sky-400">
              {sentCount}
            </span>
          </div>
        </div>

        {/* Failed Card */}
        <div className="mgr-card p-4 border border-border flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/25 shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary block">
              Failed
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-rose-400">
              {failedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="mgr-card p-4 sm:p-5 border border-border shadow-xs space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-3.5">
          {/* Message Type Filter */}
          <div className="w-full lg:w-44 shrink-0">
            <label
              htmlFor="wa-log-type-filter"
              className="block text-xs font-semibold text-secondary mb-1.5"
            >
              {tManagerUi('message_type')}
            </label>
            <select
              id="wa-log-type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="mgr-select h-10 text-xs sm:text-sm font-medium w-full rounded-xl bg-surface/60 border border-border focus:border-primary px-3 cursor-pointer"
            >
              <option value="All">{tManagerUi('all_types')}</option>
              <option value="welcome">✨ {tManagerUi('welcome')}</option>
              <option value="fee_reminder">🪙 {tManagerUi('fee_reminder')}</option>
              <option value="receipt">🧾 {tManagerUi('receipt')}</option>
              <option value="notice">📢 {tManagerUi('notice')}</option>
              <option value="renewal">🔄 {tManagerUi('renewal')}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-36 shrink-0">
            <label
              htmlFor="wa-log-status-filter"
              className="block text-xs font-semibold text-secondary mb-1.5"
            >
              {tManagerUi('status')}
            </label>
            <select
              id="wa-log-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mgr-select h-10 text-xs sm:text-sm font-medium w-full rounded-xl bg-surface/60 border border-border focus:border-primary px-3 cursor-pointer"
            >
              <option value="All">{tManagerUi('all')}</option>
              <option value="Delivered">🟢 {tManagerUi('delivered')}</option>
              <option value="Sent">🔵 {tManagerUi('sent')}</option>
              <option value="Pending">🟡 {tManagerUi('pending')}</option>
              <option value="Failed">🔴 {tManagerUi('failed')}</option>
            </select>
          </div>

          {/* Date Range: From */}
          <div className="w-full sm:w-36 shrink-0">
            <label
              htmlFor="wa-log-date-from"
              className="block text-xs font-semibold text-secondary mb-1.5"
            >
              {tManagerUi('from')}
            </label>
            <input
              id="wa-log-date-from"
              type="date"
              className="mgr-input h-10 text-xs sm:text-sm w-full rounded-xl bg-surface/60 border border-border focus:border-primary px-3"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          {/* Date Range: To */}
          <div className="w-full sm:w-36 shrink-0">
            <label
              htmlFor="wa-log-date-to"
              className="block text-xs font-semibold text-secondary mb-1.5"
            >
              {tManagerUi('to')}
            </label>
            <input
              id="wa-log-date-to"
              type="date"
              className="mgr-input h-10 text-xs sm:text-sm w-full rounded-xl bg-surface/60 border border-border focus:border-primary px-3"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          {/* Search Box */}
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="wa-log-search-input"
                className="text-xs font-semibold text-secondary"
              >
                {tManagerUi('search')}
              </label>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-primary hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
                >
                  <X size={12} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none z-10"
              />
              <input
                id="wa-log-search-input"
                className="mgr-input mgr-input-with-icon h-10 text-xs sm:text-sm w-full rounded-xl bg-surface/60 border border-border focus:border-primary !pl-11 pr-9"
                style={{ paddingLeft: '2.75rem', paddingRight: search ? '2.25rem' : '1rem' }}
                placeholder={tManagerUi('student_name_or_phone')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-secondary hover:text-primary rounded-md z-10 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Count Summary */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-secondary">
          <span>
            Showing <strong className="text-primary">{filtered.length}</strong> of{' '}
            <strong className="text-primary">{LOGS.length}</strong> log entries
          </span>
          {hasActiveFilters && (
            <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
              <Filter size={11} /> Filters Active
            </span>
          )}
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="mgr-card p-0 sm:p-2 border border-border shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-14 px-4 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-surface-highlight flex items-center justify-center text-2xl border border-border shadow-xs">
              📱
            </div>
            <p className="text-base font-bold text-primary">
              {tManagerUi('no_whatsapp_messages_found')}
            </p>
            <p className="text-xs text-secondary max-w-sm">
              No outbound WhatsApp logs match your active filter criteria. Try adjusting your search query or date range.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mgr-btn-outline text-xs py-2 px-4 rounded-xl cursor-pointer mt-1"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="mgr-table-wrapper max-h-[30rem] overflow-y-auto">
            <ManagerCommunicationWhatsappLogsNativeTable
              getRowKey={(row) => row.id}
              rows={filtered}
              columns={colDefs}
              labels={{
                previous: tManagerUi('previous_page'),
                next: tManagerUi('next_page'),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
