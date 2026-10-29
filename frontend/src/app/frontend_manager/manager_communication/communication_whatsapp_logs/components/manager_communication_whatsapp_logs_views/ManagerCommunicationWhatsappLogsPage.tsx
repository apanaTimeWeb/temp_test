'use client';
import { maskManagerWhatsappLogsPhone } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/utils/ManagerCommunicationWhatsappLogsUtilities';
import { MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_LOGS, type WaLog } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/hooks/ManagerCommunicationWhatsappLogsDemoRepository';
import { useTranslations } from 'next-intl';
import ManagerCommunicationWhatsappLogsNativeTable, { type NativeCellParams } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/components/manager_communication_whatsapp_logs_table_parts/ManagerCommunicationWhatsappLogsNativeTable';

import { useEffect, useState } from 'react';
import { ChevronRight, Eye } from 'lucide-react';
import { ManagerCommunicationWhatsappLogsWhatsappLogDetailsDialog } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/components/manager_communication_whatsapp_logs_dialogs/ManagerCommunicationWhatsappLogsWhatsappLogDetailsDialog';
import type { ManagerCommunicationWhatsappLogsRouteQueryProps } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/types/ManagerCommunicationWhatsappLogsComponentTypes';
import { MANAGER_COMMUNICATION_WHATSAPP_LOGS_SEARCH_DEBOUNCE_MS } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/constants/ManagerCommunicationWhatsappLogsConstants';





const LOGS = MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_LOGS;

const TYPE_BADGE: Record<string, string> = {
  welcome: 'mc-badge--info', fee_reminder: 'mc-badge--warning',
  receipt: 'mc-badge--success', notice: 'mc-badge--purple', renewal: 'mc-badge--primary',
};
const STATUS_BADGE: Record<WaLog['status'], string> = {
  Pending: 'mc-badge--warning', Sent: 'mc-badge--info', Delivered: 'mc-badge--success', Failed: 'mc-badge--danger',
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
  // Dependency rationale: debounce log search input (300ms) and clear the timer when the query changes or the component unmounts.
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [viewLog, setViewLog] = useState<WaLog | null>(null);
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
  const filtered = LOGS.filter(l => {
    if (typeFilter !== 'All' && l.type !== typeFilter) return false;
    if (statusFilter !== 'All' && l.status !== statusFilter) return false;
    const logDate = l.dateTime.slice(0, 10); // Sample records have an ISO YYYY-MM-DD prefix.
    if (dateFrom && logDate < dateFrom) return false;
    if (dateTo && logDate > dateTo) return false;
    if (normalizedSearch && !l.student.toLowerCase().includes(normalizedSearch) && !l.phone.includes(debouncedSearch.trim())) return false;
    return true;
  });

  const colDefs = [
    { field: 'dateTime', headerName: tManagerUi('date_time'), width: 160, cellRenderer: (p: NativeCellParams) => <span className="mc-td-muted text-sm">{p.value}</span> },
    { field: 'phone', headerName: tManagerUi('phone'), width: 130, cellRenderer: (p: NativeCellParams) => <span className="mc-td-mono font-medium">{maskManagerWhatsappLogsPhone(String(p.value ?? ''))}</span> },
    { field: 'student', headerName: tManagerUi('student'), flex: 1, minWidth: 150, cellRenderer: (p: NativeCellParams) => <span className="mc-td-bold">{p.value}</span> },
    {
      field: 'type',
      headerName: tManagerUi('type'),
      width: 130,
      cellRenderer: (p: NativeCellParams) => (
        <span className={`mc-badge ${TYPE_BADGE[p.value as WaLog['type']]} inline-block mt-2 text-xs`}>
          {getTypeLabel(p.value as WaLog['type'])}
        </span>
      )
    },
    {
      field: 'status',
      headerName: tManagerUi('status'),
      width: 120,
      cellRenderer: (p: NativeCellParams) => (
        <span className={`mc-badge ${STATUS_BADGE[p.value as WaLog['status']]} inline-block mt-2 text-xs`}>
          {statusLabels[p.value as WaLog['status']]}
        </span>
      )
    },
    { field: 'error', headerName: tManagerUi('error_7f2f6a'), width: 180, cellRenderer: (p: NativeCellParams) => <span className="mc-td-danger text-xs truncate max-w-xs inline-block" title={p.value ? String(p.value) : undefined}>{p.value || '—'}</span> },
    {
      headerName: tManagerUi('actions'),
      width: 100,
      sortable: false,
      cellRenderer: (params: NativeCellParams) => (
        <div className="h-full flex items-center">
          <button type="button" onClick={() => setViewLog((params.data as WaLog) ?? null)} className="mc-btn-icon hover:bg-primary hover:text-on-primary motion-safe:transition-colors motion-safe:duration-base" title={tManagerUi('view_message')} aria-label={tManagerUi('view_message')}>
            <Eye size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="mc-page"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
      <ManagerCommunicationWhatsappLogsWhatsappLogDetailsDialog
        log={viewLog}
        typeLabel={viewLog ? getTypeLabel(viewLog.type) : ''}
        statusLabel={viewLog ? statusLabels[viewLog.status] : ''}
        typeClassName={viewLog ? TYPE_BADGE[viewLog.type] : ''}
        statusClassName={viewLog ? STATUS_BADGE[viewLog.status] : ''}
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

      <div className="mb-8">
        <div className="mc-breadcrumb">
          <span>{tManagerUi('communication')}</span><ChevronRight size={12} /><span>{tManagerUi('whatsapp_logs')}</span>
        </div>
        <h1 className="mc-page-title">{tManagerUi('whatsapp_logs_3fd13a')}</h1>
        <p className="mc-page-subtitle">{tManagerUi('all_outbound_whatsapp_messages_sent_from_the_system')}</p>
        <p className="mc-warn-box mt-3" role="status" data-testid="manager-whatsapp-logs-sample-disclosure">{tManagerUi('notification_history_is_sample_data_sending_messages_tri_40ef96')}</p>
      </div>

      {/* Filter Bar */}
      <div className="mc-card mb-6 p-4 border border-border rounded-lg">
        <div className="mc-filter-row flex flex-wrap gap-4 items-end">
          <div className="flex flex-col">
            <label className="mc-label text-xs mb-1 font-semibold text-secondary" htmlFor="rbg4-managercommunicationwhatsapplogspage-142">{tManagerUi('message_type')}</label>
            <select id="rbg4-managercommunicationwhatsapplogspage-142" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="mc-select py-2 px-3 border rounded">
              <option value="All">{tManagerUi('all_types')}</option>
              <option value="welcome">{tManagerUi('welcome')}</option>
              <option value="fee_reminder">{tManagerUi('fee_reminder')}</option>
              <option value="receipt">{tManagerUi('receipt')}</option>
              <option value="notice">{tManagerUi('notice')}</option>
              <option value="renewal">{tManagerUi('renewal')}</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mc-label text-xs mb-1 font-semibold text-secondary" htmlFor="rbg4-managercommunicationwhatsapplogspage-153">{tManagerUi('status')}</label>
            <select id="rbg4-managercommunicationwhatsapplogspage-153" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="mc-select py-2 px-3 border rounded">
              <option value="All">{tManagerUi('all')}</option>
              <option value="Pending">{tManagerUi('pending')}</option><option value="Sent">{tManagerUi('sent')}</option>
              <option value="Delivered">{tManagerUi('delivered')}</option><option value="Failed">{tManagerUi('failed')}</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mc-label text-xs mb-1 font-semibold text-secondary" htmlFor="rbg4-managercommunicationwhatsapplogspage-161">{tManagerUi('from')}</label>
            <input id="rbg4-managercommunicationwhatsapplogspage-161" type="date" className="mc-input py-2 px-3 border rounded" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="mc-label text-xs mb-1 font-semibold text-secondary" htmlFor="rbg4-managercommunicationwhatsapplogspage-165">{tManagerUi('to')}</label>
            <input id="rbg4-managercommunicationwhatsapplogspage-165" type="date" className="mc-input py-2 px-3 border rounded" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
          <div className="mc-flex-1 flex flex-col flex-grow min-w-48">
            <label className="mc-label text-xs mb-1 font-semibold text-secondary" htmlFor="rbg4-managercommunicationwhatsapplogspage-169">{tManagerUi('search')}</label>
            <input id="rbg4-managercommunicationwhatsapplogspage-169" className="mc-input py-2 px-3 border rounded w-full" placeholder={tManagerUi('student_name_or_phone')} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mc-card mc-card--flush p-4">
        {filtered.length === 0 ? (
          <div className="mc-empty py-12 flex flex-col items-center justify-center text-center">
            <div className="mc-empty__icon text-4xl mb-4">📱</div>
            <p className="mc-empty__title text-lg font-semibold text-primary">{tManagerUi('no_whatsapp_messages_found')}</p>
          </div>
        ) : (
          <div className="mgr-table-wrapper h-112">
            <ManagerCommunicationWhatsappLogsNativeTable getRowKey={(row) => row.id} rows={filtered} columns={colDefs} labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }} />
          </div>
        )}
      </div>
    </div>
  );
}
