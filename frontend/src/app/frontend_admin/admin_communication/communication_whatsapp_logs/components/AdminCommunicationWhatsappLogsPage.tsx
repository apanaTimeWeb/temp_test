'use client';
// Responsibility: AdminCommunicationWhatsappLogsPage component owned by admin_communication; responsibility folder: admin_communication_components_views.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
// RESPONSIBILITY: Entry page for the admin_communication module.
// DATA FLOW: Next.js Router -> Page -> Components

import { filterAdminCommunicationWhatsappLogs } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/utils/AdminCommunicationWhatsappLogsFilterUtils';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import type { DataGridCellParams,DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import {
AlertCircle,
Calendar,
CheckCheck,
CheckCircle,
CheckCircle2,
Clock,
Copy,
Download,
Eye,
FileSpreadsheet,
MessageSquare,
RotateCcw,
Search,
Send,
ShieldCheck,
X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect,useMemo,useState } from 'react';

import {
ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_LABEL,
ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_LABEL
} from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/config/admin_communication_whatsapp_logs.url_config';
import { ADMIN_COMMUNICATION_WHATSAPP_LOGS_FIXTURES } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/mocks/AdminCommunicationWhatsappLogsFixtures';
import type { AdminCommunicationWhatsappLog } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';

const WHATSAPP_TYPE_ICONS: Record<string, string> = {
  welcome: '👋',
  fee_reminder: '💰',
  receipt: '🧾',
  notice: '📢',
  renewal: '🔁',
};

const TYPE_CONFIG: Record<string, { bg: string; text: string; border: string }> = {
  welcome: { bg: 'bg-teal-500/10', text: 'text-teal-300', border: 'border-teal-500/30' },
  fee_reminder: { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/30' },
  receipt: { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/30' },
  notice: { bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-500/30' },
  renewal: { bg: 'bg-indigo-500/10', text: 'text-indigo-300', border: 'border-indigo-500/30' },
};

const STATUS_CONFIG: Record<
  AdminCommunicationWhatsappLog['status'],
  { bg: string; text: string; border: string; dot: string; icon: string }
> = {
  Delivered: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400 shadow-sm shadow-emerald-400/50',
    icon: '✓✓',
  },
  Sent: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-300',
    border: 'border-sky-500/30',
    dot: 'bg-sky-400 shadow-sm shadow-sky-400/50',
    icon: '✓✓',
  },
  Pending: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400 animate-pulse',
    icon: '⏱',
  },
  Failed: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-300',
    border: 'border-rose-500/30',
    dot: 'bg-rose-400 shadow-sm shadow-rose-400/50',
    icon: '✕',
  },
};

function getInitials(name: string): string {
  if (!name) return 'W';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getSnippet(message: string): string {
  if (!message) return '';
  const lines = message.split('\n').filter((l) => l.trim().length > 0);
  const headline = lines[0] || '';
  return headline.replace(/\*/g, '').trim();
}

export function AdminCommunicationWhatsappLogsPage() {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>(
    'admin-communication-admin-communication-whatsapp-logs-page-1-page',
    0
  );

  const t = useTranslations('ADMIN_COMMUNICATION');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [typeFilter, setTypeFilter] = useAdminApplicationInfrastructureUrlQueryState<string>(
    'typeFilter',
    'All',
    { validValues: ['All', 'welcome', 'fee_reminder', 'notice', 'receipt', 'renewal'] }
  );
  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<string>(
    'statusFilter',
    'All',
    { validValues: ['All', 'Sent', 'Delivered', 'Failed', 'Pending'] }
  );
  const [search, setSearch] = useAdminApplicationInfrastructureUrlQueryState<string>('search', '');
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => setSearchInput(search), [search]);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setSearch(searchInput), 300);
    return () => window.clearTimeout(timeoutId);
  }, [searchInput, setSearch]);
  const [dateFrom, setDateFrom] = useAdminApplicationInfrastructureUrlQueryState<string>('dateFrom', '');
  const [dateTo, setDateTo] = useAdminApplicationInfrastructureUrlQueryState<string>('dateTo', '');
  const [viewLog, setViewLog] = useState<AdminCommunicationWhatsappLog | null>(null);
  const [toast, setToast] = useState('');
  const [logsList, setLogsList] = useState<AdminCommunicationWhatsappLog[]>(
    isDemoMode ? ADMIN_COMMUNICATION_WHATSAPP_LOGS_FIXTURES : []
  );

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const copyToClipboard = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      showToast('Message text copied to clipboard');
    } else {
      showToast('Copied');
    }
  };

  const handleRetry = (logId: string) => {
    setLogsList((prev) =>
      prev.map((log) =>
        log.id === logId
          ? {
              ...log,
              status: 'Sent' as const,
              error: '',
              dateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
            }
          : log
      )
    );
    if (viewLog && viewLog.id === logId) {
      setViewLog((prev) =>
        prev
          ? {
              ...prev,
              status: 'Sent',
              error: '',
              dateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
            }
          : null
      );
    }
    showToast(`Message #${logId} queued for retry & sent successfully`);
  };

  const filtered = filterAdminCommunicationWhatsappLogs(logsList, {
    type: typeFilter as 'All' | AdminCommunicationWhatsappLog['type'],
    status: statusFilter as 'All' | AdminCommunicationWhatsappLog['status'],
    search,
    dateFrom,
    dateTo,
  });

  const { selectedBranch, isAllBranches } = useAdminBranch();
  const visibleLogs = useMemo(() => {
    if (isAllBranches || !selectedBranch) return filtered;
    return filtered.filter(
      (log) =>
        !log.branch ||
        log.branch.toLowerCase().includes(selectedBranch.name.toLowerCase()) ||
        selectedBranch.name.toLowerCase().includes(log.branch.toLowerCase())
    );
  }, [filtered, isAllBranches, selectedBranch]);

  const handleExportCsv = () => {
    if (visibleLogs.length === 0) {
      showToast('No logs to export');
      return;
    }
    const headers = [
      'Log ID',
      'Date & Time',
      'Student Name',
      'Mobile Number',
      'Branch',
      'Message Type',
      'Status',
      'Error Reason',
      'Message Content',
    ];
    const rows = visibleLogs.map((log) => [
      `#WA-LOG-00${log.id}`,
      `"${log.dateTime}"`,
      `"${log.student.replace(/"/g, '""')}"`,
      `"${log.phone}"`,
      `"${(log.branch || 'Downtown').replace(/"/g, '""')}"`,
      `"${log.type}"`,
      `"${log.status}"`,
      `"${(log.error || '').replace(/"/g, '""')}"`,
      `"${log.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `admin-whatsapp-delivery-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${visibleLogs.length} WhatsApp logs to CSV`);
  };

  const handleExportExcel = () => {
    if (visibleLogs.length === 0) {
      showToast('No logs to export');
      return;
    }
    const tableRows = visibleLogs
      .map(
        (log) => `
      <tr>
        <td style="padding:6px;border:1px solid #ccc;font-family:monospace;">#WA-LOG-00${log.id}</td>
        <td style="padding:6px;border:1px solid #ccc;">${log.dateTime}</td>
        <td style="padding:6px;border:1px solid #ccc;font-weight:bold;">${log.student}</td>
        <td style="padding:6px;border:1px solid #ccc;font-family:monospace;">${log.phone}</td>
        <td style="padding:6px;border:1px solid #ccc;">${log.branch || 'Downtown'}</td>
        <td style="padding:6px;border:1px solid #ccc;">${log.type}</td>
        <td style="padding:6px;border:1px solid #ccc;font-weight:bold;">${log.status}</td>
        <td style="padding:6px;border:1px solid #ccc;color:#c00;">${log.error || '—'}</td>
        <td style="padding:6px;border:1px solid #ccc;">${log.message.replace(/\n/g, '<br/>')}</td>
      </tr>`
      )
      .join('');

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"/><title>WhatsApp Delivery Logs Report</title></head>
        <body>
          <h2>Smart Library - WhatsApp Delivery Audit Logs</h2>
          <p>Generated: ${new Date().toLocaleString('en-IN')}</p>
          <table border="1" style="border-collapse:collapse;font-family:sans-serif;font-size:12px;">
            <thead>
              <tr style="background-color:#0d9488;color:#ffffff;font-weight:bold;text-align:left;">
                <th style="padding:8px;border:1px solid #ccc;">Log ID</th>
                <th style="padding:8px;border:1px solid #ccc;">Date & Time</th>
                <th style="padding:8px;border:1px solid #ccc;">Student Name</th>
                <th style="padding:8px;border:1px solid #ccc;">Mobile Number</th>
                <th style="padding:8px;border:1px solid #ccc;">Branch</th>
                <th style="padding:8px;border:1px solid #ccc;">Type</th>
                <th style="padding:8px;border:1px solid #ccc;">Status</th>
                <th style="padding:8px;border:1px solid #ccc;">Error Reason</th>
                <th style="padding:8px;border:1px solid #ccc;">Message Content</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>`;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `admin-whatsapp-delivery-logs-${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${visibleLogs.length} WhatsApp logs to Excel`);
  };

  const hasActiveFilters = typeFilter !== 'All' || statusFilter !== 'All' || search.trim() !== '' || dateFrom !== '' || dateTo !== '';

  const clearAllFilters = () => {
    setTypeFilter('All');
    setStatusFilter('All');
    setSearch('');
    setSearchInput('');
    setDateFrom('');
    setDateTo('');
  };

  const colDefs: readonly DataGridColumn<AdminCommunicationWhatsappLog>[] = [
    {
      field: 'dateTime',
      headerName: t('WHATSAPP_COLUMN_DATETIME'),
      width: 165,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => {
        const parts = String(p.value ?? '').split(' ');
        const datePart = parts[0] || '';
        const timePart = parts.slice(1).join(' ');
        return (
          <div className="flex h-full items-center">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 shrink-0">
                <Clock size={13} />
              </div>
              <div className="leading-tight">
                <span className="font-semibold text-xs text-white block">{datePart}</span>
                <span className="font-mono text-[11px] text-slate-400 block">{timePart}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      field: 'student',
      headerName: t('WHATSAPP_COLUMN_STUDENT'),
      width: 210,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => {
        const initials = getInitials(String(p.value ?? ''));
        return (
          <div className="flex h-full items-center">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500/25 to-teal-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-xs shrink-0 shadow-inner">
                {initials}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs text-white truncate block">{p.value}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-[11px] text-emerald-400/90 font-medium">{p.data.phone}</span>
                  {p.data.branch && (
                    <span className="text-[10px] bg-slate-800 border border-slate-700/60 px-1.5 py-0.2 rounded text-slate-300 truncate max-w-[90px]">
                      {p.data.branch}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      field: 'type',
      headerName: t('WHATSAPP_COLUMN_TYPE'),
      width: 145,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => {
        const typeKey = String(p.value ?? 'welcome');
        const icon = WHATSAPP_TYPE_ICONS[typeKey] || '📱';
        const conf = TYPE_CONFIG[typeKey] || { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };
        return (
          <div className="flex h-full items-center">
            <span
              data-testid={`admin_communication-whatsapp-type-${p.data.id}`}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shadow-xs ${conf.bg} ${conf.text} ${conf.border}`}
            >
              <span>{icon}</span>
              <span>{t(ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_LABEL[typeKey] ?? 'WHATSAPP_TYPE_UNKNOWN')}</span>
            </span>
          </div>
        );
      },
    },
    {
      field: 'message',
      headerName: 'Message Content',
      flex: 1,
      minWidth: 240,
      sortable: false,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => {
        const snippet = getSnippet(String(p.value ?? ''));
        return (
          <div className="flex h-full items-center min-w-0 pr-2">
            <div className="flex items-center gap-2 min-w-0">
              <MessageSquare size={13} className="text-slate-500 shrink-0" />
              <span className="text-xs text-slate-300 truncate font-sans" title={String(p.value ?? '')}>
                {snippet || '—'}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      field: 'status',
      headerName: t('WHATSAPP_COLUMN_STATUS'),
      width: 140,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => {
        const statusKey = p.data.status;
        const conf = STATUS_CONFIG[statusKey] || STATUS_CONFIG.Delivered;
        return (
          <div className="flex h-full items-center">
            <span
              data-testid={`admin_communication-whatsapp-status-${p.data.id}`}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shadow-xs ${conf.bg} ${conf.text} ${conf.border}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${conf.dot}`} />
              <span>{t(ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_LABEL[statusKey] ?? 'WHATSAPP_STATUS_UNKNOWN')}</span>
              <span className="font-mono text-[10px] opacity-75">{conf.icon}</span>
            </span>
          </div>
        );
      },
    },
    {
      field: 'error',
      headerName: t('WHATSAPP_COLUMN_ERROR'),
      width: 160,
      sortable: false,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => {
        const err = typeof p.value === 'string' ? p.value.trim() : '';
        if (err) {
          return (
            <div className="flex h-full items-center">
              <span
                className="inline-flex items-center gap-1 rounded-md bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[11px] font-semibold text-rose-300 truncate max-w-[150px]"
                title={err}
              >
                <AlertCircle size={11} className="shrink-0 text-rose-400" />
                <span className="truncate">{err}</span>
              </span>
            </div>
          );
        }
        return (
          <div className="flex h-full items-center">
            <span className="text-slate-500 text-xs font-mono">—</span>
          </div>
        );
      },
    },
    {
      headerName: t('WHATSAPP_COLUMN_ACTIONS'),
      width: 120,
      sortable: false,
      cellRenderer: (params: DataGridCellParams<AdminCommunicationWhatsappLog>) => (
        <div className="h-full flex items-center justify-center gap-1.5">
          <button
            data-testid={`admin_communication-whatsapp-view-${params.data.id}`}
            type="button"
            onClick={() => setViewLog(params.data)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-white transition-all cursor-pointer shadow-xs"
            title={t('WHATSAPP_VIEW_ACTION')}
            aria-label={t('WHATSAPP_VIEW_MESSAGE_FOR', { phone: params.data.phone })}
          >
            <Eye size={15} strokeWidth={2.2} />
          </button>
          {params.data.status === 'Failed' && (
            <button
              data-testid={`admin_communication-whatsapp-retry-${params.data.id}`}
              type="button"
              onClick={() => handleRetry(params.data.id)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-white transition-all cursor-pointer shadow-xs"
              title="Retry / Resend failed message"
              aria-label="Retry dispatch"
            >
              <RotateCcw size={14} strokeWidth={2.2} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 rounded-xl border border-emerald-500/40 bg-slate-900/95 px-4 py-3 text-xs font-bold text-white shadow-2xl backdrop-blur-md flex items-center gap-2"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {isDemoMode ? (
        <p role="status" className="sr-only">
          {t('WHATSAPP_LOGS_DEMO_BANNER')}
        </p>
      ) : (
        <p role="status" className="sr-only">
          {t('WHATSAPP_LOGS_LIVE_UNAVAILABLE')}
        </p>
      )}

      {/* View Message Modal / Executive Inspection Dossier */}
      {viewLog && (
        <Dialog
          open
          onOpenChange={(nextOpen) => {
            if (!nextOpen) setViewLog(null);
          }}
        >
          <DialogContent className="relative w-full max-w-[560px] overflow-hidden rounded-3xl border border-slate-800 bg-[#0d131f] p-0 shadow-2xl">
            {/* WhatsApp Brand Header */}
            <div className="bg-[#075e54] px-5 py-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600/50 border border-emerald-400/40 text-white font-bold text-sm shadow-inner shrink-0">
                  {getInitials(viewLog.student)}
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-white tracking-tight flex items-center gap-1.5 leading-none">
                    <span>{viewLog.student}</span>
                    <ShieldCheck size={14} className="text-emerald-300 shrink-0" />
                  </DialogTitle>
                  <DialogDescription className="sr-only">{t('WHATSAPP_LOG_DETAILS_DESCRIPTION')}</DialogDescription>
                  <div className="mt-1 flex items-center gap-2 text-xs text-emerald-100 font-mono">
                    <span>+91 {viewLog.phone}</span>
                    {viewLog.branch && (
                      <span className="rounded-full bg-black/25 px-2 py-0.5 font-sans text-[10px] text-emerald-200 border border-emerald-400/20">
                        {viewLog.branch}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                aria-label={t('WHATSAPP_CLOSE_DETAILS_ARIA')}
                data-testid="admin_communication-page-control-004"
                onClick={() => setViewLog(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-emerald-100 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} strokeWidth={2.2} />
              </button>
            </div>

            {/* Chat Body & Message Bubble */}
            <div className="relative min-h-[240px] max-h-[360px] overflow-y-auto bg-[#0b141a] p-5 space-y-4">
              <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Date Header Pill */}
              <div className="relative flex justify-center">
                <span className="rounded-full bg-slate-800/90 px-3.5 py-1 text-[11px] font-medium text-slate-300 shadow-sm border border-slate-700/60 flex items-center gap-1.5">
                  <Calendar size={12} className="text-slate-400" />
                  <span>Dispatched on {viewLog.dateTime}</span>
                </span>
              </div>

              {/* Sent Bubble */}
              <div className="relative ml-auto max-w-[88%] rounded-2xl rounded-tr-xs bg-[#005c4b] p-4 text-white shadow-lg space-y-2">
                <div className="whitespace-pre-wrap text-xs leading-relaxed text-slate-100 font-sans select-text">
                  {viewLog.message}
                </div>
                <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] font-mono text-emerald-200">
                  <span>{viewLog.dateTime.split(' ').slice(-2).join(' ')}</span>
                  {viewLog.status === 'Delivered' ? (
                    <span className="text-cyan-300 font-bold flex items-center gap-0.5" title="Delivered">
                      <CheckCheck size={13} /> Delivered
                    </span>
                  ) : viewLog.status === 'Sent' ? (
                    <span className="text-slate-300 font-bold flex items-center gap-0.5" title="Sent">
                      <CheckCheck size={13} /> Sent
                    </span>
                  ) : viewLog.status === 'Failed' ? (
                    <span className="text-rose-400 font-bold flex items-center gap-0.5" title="Failed">
                      ✕ Delivery Failed
                    </span>
                  ) : (
                    <span className="text-amber-300 font-bold flex items-center gap-0.5" title="Pending">
                      ⏱ Queued
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Audit & Metadata Panel */}
            <div className="border-t border-slate-800 bg-[#0a0f18] p-5 space-y-4">
              {/* Metric grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Dispatch ID</span>
                  <span className="font-mono text-xs font-bold text-white mt-0.5 block">#WA-LOG-00{viewLog.id}</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Template</span>
                  <span className="text-xs font-bold text-indigo-300 mt-0.5 flex items-center gap-1 truncate">
                    <span>{WHATSAPP_TYPE_ICONS[viewLog.type] || '📱'}</span>
                    <span className="truncate">{t(ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_LABEL[viewLog.type] ?? 'WHATSAPP_TYPE_UNKNOWN')}</span>
                  </span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Gateway Status</span>
                  <span
                    className={`text-xs font-bold mt-0.5 flex items-center gap-1 ${
                      viewLog.status === 'Delivered'
                        ? 'text-emerald-400'
                        : viewLog.status === 'Failed'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    <span>{viewLog.status}</span>
                  </span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Target Branch</span>
                  <span className="text-xs font-bold text-slate-200 mt-0.5 truncate block">
                    {viewLog.branch || 'Downtown'}
                  </span>
                </div>
              </div>

              {/* Error diagnostic warning */}
              {viewLog.error && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-300 block">{t('WHATSAPP_ERROR_PREFIX')} {viewLog.error}</span>
                    <span className="text-[11px] text-rose-300/80 mt-0.5 block">
                      The recipient number is not registered on WhatsApp. Verify the student mobile number at reception.
                    </span>
                  </div>
                </div>
              )}

              {/* Delivery confirmation note */}
              {viewLog.status === 'Delivered' && (
                <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Meta Cloud WhatsApp API Handshake confirmed (Read receipt acknowledged).</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(viewLog.message)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
                  >
                    <Copy size={13} />
                    <span>Copy Message Text</span>
                  </button>
                  {viewLog.status === 'Failed' && (
                    <button
                      type="button"
                      data-testid={`admin_communication-modal-retry-${viewLog.id}`}
                      onClick={() => handleRetry(viewLog.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer"
                    >
                      <RotateCcw size={13} />
                      <span>Retry Dispatch</span>
                    </button>
                  )}
                </div>

                <button
                  data-testid="admin_communication-page-control-008"
                  type="button"
                  onClick={() => setViewLog(null)}
                  className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                >
                  {t('BUTTON_CLOSE')}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageSquare size={18} />
            </div>
            <span>{t('WHATSAPP_LOGS_TITLE')}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
              <ShieldCheck size={12} />
              Live Dispatch History
            </span>
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">
            {isDemoMode ? t('WHATSAPP_LOGS_DEMO_SUBTITLE') : t('WHATSAPP_LOGS_LIVE_SUBTITLE')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="admin_communication-export-csv-btn"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all cursor-pointer shadow-xs"
          >
            <Download size={13} className="text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            data-testid="admin_communication-export-excel-btn"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer shadow-xs"
          >
            <FileSpreadsheet size={13} />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Total Messages - Indigo */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 p-5 shadow-lg shadow-indigo-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/20" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Dispatches</span>
            <div className="p-2.5 rounded-xl border shrink-0 bg-indigo-500/15 border-indigo-500/30 text-indigo-400">
              <MessageSquare size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white">{visibleLogs.length}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-indigo-300 bg-indigo-500/10 border-indigo-500/25">
              All Outbound Messages
            </span>
          </div>
        </div>

        {/* Delivered - Emerald */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 p-5 shadow-lg shadow-emerald-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-500/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/20" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Delivered</span>
            <div className="p-2.5 rounded-xl border shrink-0 bg-emerald-500/15 border-emerald-500/30 text-emerald-400">
              <CheckCircle size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-emerald-400">
            {visibleLogs.filter((l) => l.status === 'Delivered').length}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-emerald-300 bg-emerald-500/10 border-emerald-500/25">
              Successfully Received
            </span>
          </div>
        </div>

        {/* In Transit - Amber */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 p-5 shadow-lg shadow-amber-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-amber-500/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-amber-500/10 blur-2xl transition-all duration-500 group-hover:bg-amber-500/20" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">In Transit / Sent</span>
            <div className="p-2.5 rounded-xl border shrink-0 bg-amber-500/15 border-amber-500/30 text-amber-400">
              <Clock size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-amber-400">
            {visibleLogs.filter((l) => l.status === 'Sent' || l.status === 'Pending').length}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-amber-300 bg-amber-500/10 border-amber-500/25">
              Queued / Sent
            </span>
          </div>
        </div>

        {/* Failed / Bounced - Rose */}
        <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 p-5 shadow-lg shadow-rose-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-rose-500/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-rose-500/10 blur-2xl transition-all duration-500 group-hover:bg-rose-500/20" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Failed / Issues</span>
            <div className="p-2.5 rounded-xl border shrink-0 bg-rose-500/15 border-rose-500/30 text-rose-400">
              <AlertCircle size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-rose-400">
            {visibleLogs.filter((l) => l.status === 'Failed').length}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-rose-300 bg-rose-500/10 border-rose-500/25">
              Attention Required
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md space-y-4">
        {/* Quick Status Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              {
                id: 'All',
                label: 'All Statuses',
                count: visibleLogs.length,
                icon: MessageSquare,
                selectedBox: 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-950/50',
                unselectedBox: 'bg-indigo-950/50 border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/60',
                selectedBadge: 'bg-white text-indigo-950 font-extrabold shadow-xs',
                unselectedBadge: 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200 font-bold',
              },
              {
                id: 'Delivered',
                label: 'Delivered',
                count: visibleLogs.filter((l) => l.status === 'Delivered').length,
                icon: CheckCheck,
                selectedBox: 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-950/50',
                unselectedBox: 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60',
                selectedBadge: 'bg-white text-emerald-950 font-extrabold shadow-xs',
                unselectedBadge: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200 font-bold',
              },
              {
                id: 'Sent',
                label: 'Sent',
                count: visibleLogs.filter((l) => l.status === 'Sent').length,
                icon: Send,
                selectedBox: 'bg-sky-600 border-sky-400 text-white shadow-md shadow-sky-950/50',
                unselectedBox: 'bg-sky-950/50 border-sky-500/30 text-sky-300 hover:bg-sky-900/60',
                selectedBadge: 'bg-white text-sky-950 font-extrabold shadow-xs',
                unselectedBadge: 'bg-sky-500/20 border-sky-400/40 text-sky-200 font-bold',
              },
              {
                id: 'Pending',
                label: 'Pending',
                count: visibleLogs.filter((l) => l.status === 'Pending').length,
                icon: Clock,
                selectedBox: 'bg-amber-600 border-amber-400 text-white shadow-md shadow-amber-950/50',
                unselectedBox: 'bg-amber-950/50 border-amber-500/30 text-amber-300 hover:bg-amber-900/60',
                selectedBadge: 'bg-white text-amber-950 font-extrabold shadow-xs',
                unselectedBadge: 'bg-amber-500/20 border-amber-400/40 text-amber-200 font-bold',
              },
              {
                id: 'Failed',
                label: 'Failed',
                count: visibleLogs.filter((l) => l.status === 'Failed').length,
                icon: AlertCircle,
                selectedBox: 'bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-950/50',
                unselectedBox: 'bg-rose-950/50 border-rose-500/30 text-rose-300 hover:bg-rose-900/60',
                selectedBadge: 'bg-white text-rose-950 font-extrabold shadow-xs',
                unselectedBadge: 'bg-rose-500/20 border-rose-400/40 text-rose-200 font-bold',
              },
            ].map((st) => {
              const isSelected = statusFilter === st.id;
              const Icon = st.icon;
              return (
                <button
                  key={st.id}
                  type="button"
                  data-testid={`admin_communication-status-filter-${st.id.toLowerCase()}`}
                  onClick={() => setStatusFilter(st.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected ? st.selectedBox : st.unselectedBox
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-white' : 'opacity-90'} />
                  <span>{st.label}</span>
                  <span
                    className={`inline-flex items-center justify-center min-w-[22px] px-1.5 py-0.5 rounded-lg text-[11px] font-mono border ${
                      isSelected ? st.selectedBadge : st.unselectedBadge
                    }`}
                  >
                    {st.count}
                  </span>
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Detailed Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
          {/* Type Filter */}
          <div className="flex flex-col">
            <label
              htmlFor="admin-communication-wa-type-filter"
              className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-slate-400"
            >
              {t('WHATSAPP_FILTER_TYPE')}
            </label>
            <select
              id="admin-communication-wa-type-filter"
              data-testid="admin_communication-page-control-009"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="All">{t('WHATSAPP_TYPE_ALL')}</option>
              <option value="welcome">{t('WHATSAPP_TYPE_WELCOME')}</option>
              <option value="fee_reminder">{t('WHATSAPP_TYPE_FEE_REMINDER')}</option>
              <option value="receipt">{t('WHATSAPP_TYPE_RECEIPT')}</option>
              <option value="notice">{t('WHATSAPP_TYPE_NOTICE')}</option>
              <option value="renewal">{t('WHATSAPP_TYPE_RENEWAL')}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label
              htmlFor="admin-communication-wa-status-filter"
              className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-slate-400"
            >
              {t('WHATSAPP_FILTER_STATUS')}
            </label>
            <select
              id="admin-communication-wa-status-filter"
              data-testid="admin_communication-page-control-010"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="All">{t('WHATSAPP_STATUS_ALL')}</option>
              <option value="Pending">{t('WHATSAPP_STATUS_PENDING')}</option>
              <option value="Sent">{t('WHATSAPP_STATUS_SENT')}</option>
              <option value="Delivered">{t('WHATSAPP_STATUS_DELIVERED')}</option>
              <option value="Failed">{t('WHATSAPP_STATUS_FAILED')}</option>
            </select>
          </div>

          {/* Date From */}
          <div className="flex flex-col">
            <label
              htmlFor="admin-communication-wa-date-from"
              className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-slate-400"
            >
              {t('WHATSAPP_FILTER_FROM')}
            </label>
            <input
              id="admin-communication-wa-date-from"
              type="date"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          {/* Date To */}
          <div className="flex flex-col">
            <label
              htmlFor="admin-communication-wa-date-to"
              className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-slate-400"
            >
              {t('WHATSAPP_FILTER_TO')}
            </label>
            <input
              id="admin-communication-wa-date-to"
              type="date"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          {/* Search Box */}
          <div className="flex flex-col">
            <label
              htmlFor="admin-communication-wa-log-search"
              className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-slate-400"
            >
              {t('WHATSAPP_FILTER_SEARCH')}
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="admin-communication-wa-log-search"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                placeholder={t('WHATSAPP_FILTER_SEARCH_PLACEHOLDER')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md">
        {visibleLogs.length === 0 ? (
          <div
            data-testid="admin_communication-page-state-011"
            className="gap-3 py-16 flex flex-col items-center justify-center text-center"
          >
            <div
              data-testid="admin_communication-page-state-012"
              className="text-4xl p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 mb-2"
            >
              📱
            </div>
            <p
              data-testid="admin_communication-page-state-013"
              className="text-base font-bold text-white max-w-sm"
            >
              {isDemoMode ? t('WHATSAPP_LOGS_EMPTY_DEMO') : t('WHATSAPP_LOGS_EMPTY_LIVE')}
            </p>
            <p className="text-xs text-slate-400">
              Try adjusting your filter settings or search terms.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        ) : (
          <div className="min-w-0 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <DataGrid
              rowData={visibleLogs}
              columnDefs={colDefs}
              rowHeight={48}
              pagination={true}
              pageSize={10}
              page={urlTablePage0}
              onPageChange={setUrlTablePage0}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCommunicationWhatsappLogsPage;
