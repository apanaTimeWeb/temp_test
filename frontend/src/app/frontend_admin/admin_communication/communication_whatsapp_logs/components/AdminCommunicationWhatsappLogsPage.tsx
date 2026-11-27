'use client';

import AdminCommunicationWhatsappLogsFilterBar from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/components/AdminCommunicationWhatsappLogsFilterBar';
import AdminCommunicationWhatsappLogsKpis from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/components/AdminCommunicationWhatsappLogsKpis';
import { buildAdminCommunicationWhatsappLogColumns } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/components/AdminCommunicationWhatsappLogsTableColumns';
import AdminCommunicationWhatsappLogsViewModal from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/components/AdminCommunicationWhatsappLogsViewModal';
import { ADMIN_COMMUNICATION_WHATSAPP_LOGS_DEMO_DATA } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/config/admin_communication_whatsapp_logs.demo_data';
import type { AdminCommunicationWhatsappLog } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';
import {
  exportWhatsappLogsToCsv,
  exportWhatsappLogsToExcel,
} from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/utils/adminCommunicationWhatsappLogsExports';
import {
  filterAdminCommunicationWhatsappLogs,
  parseWhatsappLogDispatchModeFilter,
  parseWhatsappLogStatusFilter,
  parseWhatsappLogTypeFilter,
} from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/utils/AdminCommunicationWhatsappLogsFilterUtils';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { CheckCircle2, Download, FileSpreadsheet, MessageSquare, RotateCcw, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  const toastTimeoutRef = useRef<number | null>(null);
  const [viewLog, setViewLog] = useState<AdminCommunicationWhatsappLog | null>(null);
  const [logs, setLogs] = useState<AdminCommunicationWhatsappLog[]>(() =>
    isDemoMode ? ADMIN_COMMUNICATION_WHATSAPP_LOGS_DEMO_DATA : []
  );

  useEffect(() => () => { if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current); }, []);

  const urlTablePage0 = Math.max(0, parseInt(urlTablePage || '0', 10) || 0);
  const setUrlTablePage0 = useCallback((p: number) => setUrlTablePage(String(p)), [setUrlTablePage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setUrlTablePage0(0);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchInput, setSearch, setUrlTablePage0]);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current);
    setToast(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast('');
      toastTimeoutRef.current = null;
    }, 3000);
  }, []);

  const branchFilteredLogs = useMemo(() => {
    if (!isDemoMode) return [];
    if (isAllBranches || !selectedBranch) return logs;
    return logs.filter(
      (l) => !l.branch || l.branch.toLowerCase().includes(selectedBranch.name.toLowerCase()) || selectedBranch.name.toLowerCase().includes(l.branch.toLowerCase())
    );
  }, [isDemoMode, isAllBranches, selectedBranch, logs]);

  const visibleLogs = useMemo(
    () => filterAdminCommunicationWhatsappLogs(branchFilteredLogs, {
      type: parseWhatsappLogTypeFilter(typeFilter),
      status: parseWhatsappLogStatusFilter(statusFilter),
      dispatchMode: parseWhatsappLogDispatchModeFilter(dispatchModeFilter),
      search,
      dateFrom,
      dateTo,
    }),
    [branchFilteredLogs, typeFilter, statusFilter, dispatchModeFilter, search, dateFrom, dateTo]
  );

  const handleRetry = useCallback((id: string) => {
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'Sent', error: '' } : l)));
    setViewLog((prev) => (prev?.id === id ? { ...prev, status: 'Sent', error: '' } : prev));
    showToast(`WhatsApp message #${id} re-queued for delivery.`);
  }, [showToast]);

  const copyToClipboard = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      showToast('Message text copied to clipboard.');
    }
  };

  const handleExportCsv = () => {
    if (visibleLogs.length === 0) { showToast('No logs to export'); return; }
    exportWhatsappLogsToCsv(visibleLogs);
    showToast(`Exported ${visibleLogs.length} logs to CSV`);
  };

  const handleExportExcel = () => {
    if (visibleLogs.length === 0) { showToast('No logs to export'); return; }
    exportWhatsappLogsToExcel(visibleLogs);
    showToast(`Exported ${visibleLogs.length} logs to Excel`);
  };

  const hasActiveFilters = typeFilter !== 'All' || statusFilter !== 'All' || dispatchModeFilter !== 'All' || search !== '' || dateFrom !== '' || dateTo !== '';
  const clearAllFilters = () => {
    setTypeFilter('All'); setStatusFilter('All'); setDispatchModeFilter('All');
    setSearch(''); setSearchInput(''); setDateFrom(''); setDateTo('');
  };

  const colDefs = useMemo(
    () => buildAdminCommunicationWhatsappLogColumns(t, setViewLog, handleRetry),
    [t, handleRetry]
  );

  return (
    <div className="min-h-screen space-y-6">
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 rounded-xl border border-success bg-card px-4 py-3 text-xs font-bold text-text-primary shadow-toast flex items-center gap-2"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={16} className="text-success-text shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <AdminCommunicationWhatsappLogsViewModal viewLog={viewLog} onClose={() => setViewLog(null)} onCopy={copyToClipboard} onRetry={handleRetry} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-success-bg border border-success flex items-center justify-center text-success-text">
              <MessageSquare size={18} />
            </div>
            <span>{t('WHATSAPP_LOGS_TITLE')}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success-text bg-success-bg border border-success px-2.5 py-0.5 rounded-full">
              <ShieldCheck size={12} />
              Live Dispatch History
            </span>
          </h1>
          <p className="mt-0.5 text-xs text-text-secondary">
            {isDemoMode ? t('WHATSAPP_LOGS_DEMO_SUBTITLE') : t('WHATSAPP_LOGS_LIVE_SUBTITLE')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="admin_communication-export-csv-btn"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-card-hover motion-safe:transition-all cursor-pointer shadow-xs"
          >
            <Download size={13} className="text-text-secondary" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            data-testid="admin_communication-export-excel-btn"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 rounded-xl border border-success bg-success-bg px-3 py-1.5 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-all cursor-pointer shadow-xs"
          >
            <FileSpreadsheet size={13} />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-success bg-success-bg px-3.5 py-2 text-xs font-medium text-success-text">
        <ShieldCheck className="h-4 w-4 text-success-text shrink-0" />
        <span><strong>Provider Cost Protection Active:</strong> Audit logs distinguishing 1x Server API triggers from Free client-side WhatsApp Web dispatches.</span>
      </div>

      <AdminCommunicationWhatsappLogsKpis visibleLogs={visibleLogs} />

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

      <div className="overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xl">
        {visibleLogs.length === 0 ? (
          <div data-testid="admin_communication-page-state-011" className="gap-3 py-16 flex flex-col items-center justify-center text-center">
            <div data-testid="admin_communication-page-state-012" className="text-4xl p-4 rounded-2xl bg-surface border border-border mb-2">
              📱
            </div>
            <p data-testid="admin_communication-page-state-013" className="text-base font-bold text-text-primary max-w-sm">
              {isDemoMode ? t('WHATSAPP_LOGS_EMPTY_DEMO') : t('WHATSAPP_LOGS_EMPTY_LIVE')}
            </p>
            <p className="text-xs text-text-secondary">Try adjusting your filter settings or search terms.</p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-text-primary hover:bg-card-hover motion-safe:transition-all cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        ) : (
          <div className="min-w-0 overflow-x-auto rounded-xl border border-border bg-surface">
            <DataGrid rowData={visibleLogs} columnDefs={colDefs} rowHeight={48} pagination={true} pageSize={10} page={urlTablePage0} onPageChange={setUrlTablePage0} />
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminCommunicationWhatsappLogsPage;
