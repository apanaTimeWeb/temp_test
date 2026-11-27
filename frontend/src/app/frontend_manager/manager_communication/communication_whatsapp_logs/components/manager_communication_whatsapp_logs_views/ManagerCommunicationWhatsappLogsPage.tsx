'use client';

import { Download, Printer, RotateCw, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/components/manager_communication_whatsapp_logs_styles/ManagerCommunicationWhatsappLogsManager_whatsapp_logs.css';
import { ManagerCommunicationWhatsappLogsWhatsappLogDetailsDialog } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/components/manager_communication_whatsapp_logs_dialogs/ManagerCommunicationWhatsappLogsWhatsappLogDetailsDialog';
import ManagerCommunicationWhatsappLogsNativeTable from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/components/manager_communication_whatsapp_logs_table_parts/ManagerCommunicationWhatsappLogsNativeTable';
import { ManagerCommunicationWhatsappLogsFilterBar } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/components/manager_communication_whatsapp_logs_views/ManagerCommunicationWhatsappLogsFilterBar';
import { ManagerCommunicationWhatsappLogsKpis } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/components/manager_communication_whatsapp_logs_views/ManagerCommunicationWhatsappLogsKpis';
import { buildLogColumns } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/components/manager_communication_whatsapp_logs_views/ManagerCommunicationWhatsappLogsTableColumns';
import {
  MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_LOGS,
  type WaLog,
} from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/hooks/ManagerCommunicationWhatsappLogsDemoRepository';
import type { ManagerCommunicationWhatsappLogsRouteQueryProps } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/types/ManagerCommunicationWhatsappLogsComponentTypes';

const LOGS = MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_LOGS;

export default function ManagerCommunicationWhatsappLogsPage(_routeQuery: ManagerCommunicationWhatsappLogsRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_whatsapp_logs.ui');

  const [typeFilter, setTypeFilter] = useState('All');
  const [channelFilter, setChannelFilter] = useState('All');
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

  const normalizedSearch = debouncedSearch.trim().toLowerCase();
  const filtered = useMemo(() => {
    return LOGS.filter((l) => {
      if (typeFilter !== 'All' && l.type !== typeFilter) return false;
      if (statusFilter !== 'All' && l.status !== statusFilter) return false;
      if (channelFilter !== 'All') {
        const isApi = l.channelType?.includes('API') || l.type === 'receipt' || l.type === 'welcome';
        if (channelFilter === 'Server API (1x Auto)' && !isApi) return false;
        if (channelFilter === 'WhatsApp Web (Free)' && isApi) return false;
      }
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
  }, [typeFilter, channelFilter, statusFilter, dateFrom, dateTo, normalizedSearch, debouncedSearch]);

  const hasActiveFilters = Boolean(
    typeFilter !== 'All' || channelFilter !== 'All' || statusFilter !== 'All' || dateFrom || dateTo || search.trim()
  );

  const handleResetFilters = () => {
    setTypeFilter('All');
    setChannelFilter('All');
    setStatusFilter('All');
    setDateFrom('');
    setDateTo('');
    setSearch('');
  };

  const handleExportCsv = () => {
    const headers = 'ID,Date Time,Phone,Student,Dispatch Mode,Type,Status,Error,Message\n';
    const rows = filtered
      .map(
        (l) =>
          `"${l.id}","${l.dateTime}","${l.phone}","${l.student}","${l.channelType || 'WhatsApp Web (Free)'}","${l.type}","${l.status}","${(l.error || '').replace(/"/g, '""')}","${l.message.replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `whatsapp_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('WhatsApp delivery logs exported to CSV successfully', { id: 'manager-wa-logs-export-csv' });
  };

  const handlePrint = () => window.print();
  const handleRefresh = () => toast.success('WhatsApp delivery logs feed refreshed', { id: 'manager-wa-logs-refresh' });

  const totalCount = LOGS.length;
  const deliveredCount = LOGS.filter((l) => l.status === 'Delivered').length;
  const sentCount = LOGS.filter((l) => l.status === 'Sent').length;
  const failedCount = LOGS.filter((l) => l.status === 'Failed').length;

  const colDefs = useMemo(() => buildLogColumns({ tManagerUi, onViewLog: setViewLog }), [tManagerUi]);

  return (
    <div
      className="mgr-page-animate space-y-6 max-w-7xl mx-auto pb-12"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              {tManagerUi('whatsapp_logs')}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <ShieldCheck size={13} /> Provider Cost Protection Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Audit logs distinguishing 1x Server API triggers from Free client-side WhatsApp Web dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 rounded-xl border border-border bg-card text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            title="Refresh Logs Feed"
          >
            <RotateCw size={15} />
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer transition-all"
            title="Export CSV"
          >
            <Download size={13} className="text-secondary" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer transition-all"
            title="Print Delivery Audit"
          >
            <Printer size={13} className="text-secondary" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <ManagerCommunicationWhatsappLogsKpis
        totalCount={totalCount}
        deliveredCount={deliveredCount}
        sentCount={sentCount}
        failedCount={failedCount}
        tManagerUi={tManagerUi}
      />

      <ManagerCommunicationWhatsappLogsFilterBar
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        channelFilter={channelFilter}
        setChannelFilter={setChannelFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        tManagerUi={tManagerUi}
      />

      <div className="mgr-card overflow-hidden border border-border">
        <ManagerCommunicationWhatsappLogsNativeTable
          columns={colDefs}
          rows={filtered}
          getRowKey={(row) => row.id}
          
          labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }}
        />
      </div>

      <ManagerCommunicationWhatsappLogsWhatsappLogDetailsDialog
        log={viewLog}
        typeLabel={viewLog?.type ? viewLog.type.replace('_', ' ').toUpperCase() : 'WHATSAPP'}
        statusLabel={viewLog?.status || 'Sent'}
        typeClassName="bg-primary-subtle text-primary border-border"
        statusClassName="bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
        onClose={() => setViewLog(null)}
        labels={{
          close: 'Close',
          messageDetails: 'Message Audit Details',
          to: 'To',
          student: 'Student',
          sentAt: 'Sent At',
          messageContent: 'Message Content',
          error: 'Error Reason',
        }}
      />
    </div>
  );
}
