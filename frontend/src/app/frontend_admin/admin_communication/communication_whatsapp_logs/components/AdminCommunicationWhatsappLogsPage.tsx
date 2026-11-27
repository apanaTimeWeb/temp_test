'use client';

import AdminCommunicationWhatsappLogsFilterBar from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/components/AdminCommunicationWhatsappLogsFilterBar';
import AdminCommunicationWhatsappLogsKpis from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/components/AdminCommunicationWhatsappLogsKpis';
import { buildAdminCommunicationWhatsappLogColumns } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/components/AdminCommunicationWhatsappLogsTableColumns';
import AdminCommunicationWhatsappLogsViewModal from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/components/AdminCommunicationWhatsappLogsViewModal';
import { ADMIN_COMMUNICATION_WHATSAPP_LOGS_FIXTURES } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/mocks/AdminCommunicationWhatsappLogsFixtures';
import type { AdminCommunicationWhatsappLog } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';
import { filterAdminCommunicationWhatsappLogs } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/utils/AdminCommunicationWhatsappLogsFilterUtils';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect,useMemo,useState } from 'react';

export function AdminCommunicationWhatsappLogsPage() {
  const t = useTranslations('ADMIN_COMMUNICATION');
  const isDemoMode = isFrontendDemoModeEnabled();
  const { selectedBranch, isAllBranches } = useAdminBranch();

  const [typeFilter, setTypeFilter] = useAdminApplicationInfrastructureUrlQueryState<string>('typeFilter', 'All');
  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<string>('statusFilter', 'All');
  const [dispatchModeFilter, setDispatchModeFilter] = useState<string>('All');
  const [search, setSearch] = useAdminApplicationInfrastructureUrlQueryState<string>('search', '');
  const [searchInput, setSearchInput] = useState(search);
  const [dateFrom, setDateFrom] = useAdminApplicationInfrastructureUrlQueryState<string>('dateFrom', '');
  const [dateTo, setDateTo] = useAdminApplicationInfrastructureUrlQueryState<string>('dateTo', '');
  const [urlTablePage, setUrlTablePage] = useAdminApplicationInfrastructureUrlQueryState<string>('tablePage', '0');

  const [toast, setToast] = useState<string>('');
  const [viewLog, setViewLog] = useState<AdminCommunicationWhatsappLog | null>(null);
  const [logs, setLogs] = useState<AdminCommunicationWhatsappLog[]>(() =>
    isDemoMode ? ADMIN_COMMUNICATION_WHATSAPP_LOGS_FIXTURES : []
  );

  const urlTablePage0 = Math.max(0, parseInt(urlTablePage || '0', 10) || 0);
  const setUrlTablePage0 = (p: number) => setUrlTablePage(String(p));

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setUrlTablePage0(0);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchInput, setSearch]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const branchFilteredLogs = useMemo(() => {
    if (!isDemoMode) return [];
    if (isAllBranches || !selectedBranch) return logs;
    return logs.filter(
      (l) =>
        !l.branch ||
        l.branch.toLowerCase().includes(selectedBranch.name.toLowerCase()) ||
        selectedBranch.name.toLowerCase().includes(l.branch.toLowerCase())
    );
  }, [isDemoMode, isAllBranches, selectedBranch, logs]);

  const visibleLogs = useMemo(() => {
    return filterAdminCommunicationWhatsappLogs(branchFilteredLogs, {
      type: typeFilter as any,
      status: statusFilter as any,
      dispatchMode: dispatchModeFilter as any,
      search,
      dateFrom,
      dateTo,
    });
  }, [branchFilteredLogs, typeFilter, statusFilter, dispatchModeFilter, search, dateFrom, dateTo]);

  const handleRetry = (id: string) => {
    setLogs((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'Sent', error: '' } : l))
    );
    if (viewLog?.id === id) {
      setViewLog((prev) => (prev ? { ...prev, status: 'Sent', error: '' } : null));
    }
    showToast(`WhatsApp message #${id} re-queued for delivery.`);
  };

  const copyToClipboard = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      showToast('Message text copied to clipboard.');
    }
  };

  const handleExportCsv = () => {
    if (visibleLogs.length === 0) {
      showToast('No logs to export');
      return;
    }
    const headers = ['Dispatch ID', 'Date & Time', 'Student Name', 'Mobile Number', 'Template Type', 'Dispatch Mode', 'Status', 'Error Diagnostic', 'Target Branch'];
    const rows = visibleLogs.map((l) => [
      `WA-00${l.id}`,
      `"${l.dateTime}"`,
      `"${l.student}"`,
      `"${l.phone}"`,
      l.type,
      l.dispatchMode === 'auto_api_single' ? 'Server API (1x Auto)' : 'WhatsApp Web (Free)',
      l.status,
      `"${l.error || 'None'}"`,
      `"${l.branch || 'Downtown'}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `whatsapp_dispatch_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${visibleLogs.length} logs to CSV`);
  };

  const handleExportExcel = () => {
    if (visibleLogs.length === 0) {
      showToast('No logs to export');
      return;
    }
    const tableRows = visibleLogs
      .map(
        (l) =>
          `<tr><td>#WA-00${l.id}</td><td>${l.dateTime}</td><td>${l.student}</td><td>+91 ${l.phone}</td><td>${l.type}</td><td>${l.dispatchMode === 'auto_api_single' ? 'Server API (1x Auto)' : 'WhatsApp Web (Free)'}</td><td>${l.status}</td><td>${l.error || 'None'}</td><td>${l.branch || 'Downtown'}</td></tr>`
      )
      .join('');
    const excelHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"/></head><body><table border="1"><thead><tr style="background:#075e54;color:#fff;"><th>ID</th><th>Date</th><th>Student</th><th>Phone</th><th>Template</th><th>Dispatch Mode</th><th>Status</th><th>Error</th><th>Branch</th></tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
    const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `whatsapp_audit_${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${visibleLogs.length} logs to Excel`);
  };

  const hasActiveFilters = typeFilter !== 'All' || statusFilter !== 'All' || dispatchModeFilter !== 'All' || search !== '' || dateFrom !== '' || dateTo !== '';
  const clearAllFilters = () => {
    setTypeFilter('All');
    setStatusFilter('All');
    setDispatchModeFilter('All');
    setSearch('');
    setSearchInput('');
    setDateFrom('');
    setDateTo('');
  };

  const colDefs = useMemo(
    () => buildAdminCommunicationWhatsappLogColumns(t, setViewLog, handleRetry),
    [t]
  );

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

      {/* View Message Modal */}
      <AdminCommunicationWhatsappLogsViewModal
        viewLog={viewLog}
        onClose={() => setViewLog(null)}
        onCopy={copyToClipboard}
        onRetry={handleRetry}
      />

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

      {/* Cost Protection Banner */}
      <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-medium text-emerald-300">
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
        <span><strong>Provider Cost Protection Active:</strong> Audit logs distinguishing 1x Server API triggers from Free client-side WhatsApp Web dispatches.</span>
      </div>

      {/* KPI Summary Cards */}
      <AdminCommunicationWhatsappLogsKpis visibleLogs={visibleLogs} />

      {/* Filter Bar */}
      <AdminCommunicationWhatsappLogsFilterBar
        visibleLogs={visibleLogs}
        statusFilter={statusFilter}
        setStatusFilter={(val) => { setStatusFilter(val); setUrlTablePage0(0); }}
        typeFilter={typeFilter}
        setTypeFilter={(val) => { setTypeFilter(val); setUrlTablePage0(0); }}
        dispatchModeFilter={dispatchModeFilter}
        setDispatchModeFilter={(val) => { setDispatchModeFilter(val); setUrlTablePage0(0); }}
        dateFrom={dateFrom}
        setDateFrom={(val) => { setDateFrom(val); setUrlTablePage0(0); }}
        dateTo={dateTo}
        setDateTo={(val) => { setDateTo(val); setUrlTablePage0(0); }}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        hasActiveFilters={hasActiveFilters}
        clearAllFilters={clearAllFilters}
      />

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md">
        {visibleLogs.length === 0 ? (
          <div data-testid="admin_communication-page-state-011" className="gap-3 py-16 flex flex-col items-center justify-center text-center">
            <div data-testid="admin_communication-page-state-012" className="text-4xl p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 mb-2">
              📱
            </div>
            <p data-testid="admin_communication-page-state-013" className="text-base font-bold text-white max-w-sm">
              {isDemoMode ? t('WHATSAPP_LOGS_EMPTY_DEMO') : t('WHATSAPP_LOGS_EMPTY_LIVE')}
            </p>
            <p className="text-xs text-slate-400">Try adjusting your filter settings or search terms.</p>
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
