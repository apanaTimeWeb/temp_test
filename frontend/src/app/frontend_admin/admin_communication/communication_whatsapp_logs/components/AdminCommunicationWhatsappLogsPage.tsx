'use client';
// Responsibility: AdminCommunicationWhatsappLogsPage component owned by admin_communication; responsibility folder: admin_communication_components_views.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
// RESPONSIBILITY: Entry page for the admin_communication module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { ChevronRight, Eye, X } from 'lucide-react';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { DataGridCellParams, DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { filterAdminCommunicationWhatsappLogs } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/utils/AdminCommunicationWhatsappLogsFilterUtils';


import type { AdminCommunicationWhatsappLog } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';
import { ADMIN_COMMUNICATION_WHATSAPP_LOGS_FIXTURES } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/mocks/AdminCommunicationWhatsappLogsFixtures';
import {
  ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_BADGE,
  ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_LABEL,
  ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_BADGE,
  ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_LABEL,
} from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/config/admin_communication_whatsapp_logs.url_config';

export function AdminCommunicationWhatsappLogsPage() {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-communication-admin-communication-whatsapp-logs-page-1-page', 0);

  const t = useTranslations('ADMIN_COMMUNICATION');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [typeFilter,   setTypeFilter]   = useAdminApplicationInfrastructureUrlQueryState<string>('typeFilter', 'All', { validValues: ['All', 'welcome', 'fee_reminder', 'notice', 'receipt', 'renewal'] });
  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<string>('statusFilter', 'All', { validValues: ['All', 'Sent', 'Delivered', 'Failed', 'Pending'] });
  const [search,       setSearch]       = useAdminApplicationInfrastructureUrlQueryState<string>('search', '');
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => setSearchInput(search), [search]);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setSearch(searchInput), 300);
    return () => window.clearTimeout(timeoutId);
  }, [searchInput, setSearch]);
  const [dateFrom,     setDateFrom]     = useAdminApplicationInfrastructureUrlQueryState<string>('dateFrom', '');
  const [dateTo,       setDateTo]       = useAdminApplicationInfrastructureUrlQueryState<string>('dateTo', '');
  const [viewLog,      setViewLog]      = useState<AdminCommunicationWhatsappLog | null>(null);

  const filtered = filterAdminCommunicationWhatsappLogs(isDemoMode ? ADMIN_COMMUNICATION_WHATSAPP_LOGS_FIXTURES : [], {
    type: typeFilter as 'All' | AdminCommunicationWhatsappLog['type'],
    status: statusFilter as 'All' | AdminCommunicationWhatsappLog['status'],
    search,
    dateFrom,
    dateTo,
  });

  const colDefs: readonly DataGridColumn<AdminCommunicationWhatsappLog>[] = [
    { field: 'dateTime', headerName: t('WHATSAPP_COLUMN_DATETIME'), width: 160, cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => <span className="text-text-secondary text-sm">{p.value}</span> },
    { field: 'phone', headerName: t('WHATSAPP_COLUMN_PHONE'), width: 130, cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => <span className="font-mono text-ui text-text-secondary font-medium">{p.value}</span> },
    { field: 'student', headerName: t('WHATSAPP_COLUMN_STUDENT'), flex: 1, minWidth: 150, cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => <span className="font-semibold">{p.value}</span> },
    { 
      field: 'type', 
      headerName: t('WHATSAPP_COLUMN_TYPE'),
      width: 130,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => (
        <span data-testid={`admin_communication-whatsapp-type-${p.data.id}`} className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-caption font-semibold whitespace-nowrap ${ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_BADGE[String(p.value ?? '')] ?? 'bg-surface-highlight text-text-secondary border-border'} mt-2`}>
          {t(ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_LABEL[String(p.value ?? 'welcome')] ?? 'WHATSAPP_TYPE_UNKNOWN')}
        </span>
      )
    },
    { 
      field: 'status', 
      headerName: t('WHATSAPP_COLUMN_STATUS'),
      width: 120,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => (
        <span data-testid={`admin_communication-whatsapp-status-${p.data.id}`} className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-caption font-semibold whitespace-nowrap ${ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_BADGE[String(p.value ?? '')] ?? 'bg-surface-highlight text-text-secondary border-border'} mt-2`}>
          {t(ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_LABEL[String(p.value ?? '')] ?? 'WHATSAPP_STATUS_UNKNOWN')}
        </span>
      )
    },
    { field: 'error', headerName: t('WHATSAPP_COLUMN_ERROR'), width: 180, cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => <span className="text-danger-text text-xs truncate max-w-40 inline-block" title={typeof p.value === 'string' ? p.value : ''}>{typeof p.value === 'string' && p.value.trim() ? p.value : t('WHATSAPP_NO_ERROR')}</span> },
    {
      headerName: t('WHATSAPP_COLUMN_ACTIONS'),
      width: 100,
      sortable: false,
      cellRenderer: (params: DataGridCellParams<AdminCommunicationWhatsappLog>) => (
        <div className="h-full flex items-center">
          <button data-testid={`admin_communication-whatsapp-view-${params.data.id}`} type="button" onClick={() => setViewLog(params.data)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-transparent text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 hover:bg-primary hover:text-on-primary motion-safe:transition-colors motion-safe:duration-base" title={t('WHATSAPP_VIEW_ACTION')} aria-label={t('WHATSAPP_VIEW_MESSAGE_FOR', { phone: params.data.phone })}>
            <Eye size={18}  strokeWidth={2}/>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-page p-6 md:p-8">
      {isDemoMode ? (
        <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('WHATSAPP_LOGS_DEMO_BANNER')}</p>
      ) : (
        <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('WHATSAPP_LOGS_LIVE_UNAVAILABLE')}</p>
      )}
      {/* View Message Modal */}
      {viewLog && (
        <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) setViewLog(null); }}>
          <DialogContent className="relative w-full overflow-y-auto rounded-xl border border-border bg-overlay p-6 shadow-dialog max-w-[560px] space-y-4">
            <button type="button" aria-label={t('WHATSAPP_CLOSE_DETAILS_ARIA')} data-testid="admin_communication-page-control-004" onClick={() => setViewLog(null)} className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-1 text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:text-danger-text"><X size={18} strokeWidth={2}/></button>
            <DialogTitle className="text-lg mb-4 font-bold text-text-primary">{t('WHATSAPP_LOG_DETAILS_TITLE')}</DialogTitle>
            <DialogDescription className="sr-only">{t('WHATSAPP_LOG_DETAILS_DESCRIPTION')}</DialogDescription>
            <div data-testid="admin_communication-page-state-005" className="flex-wrap mb-6 flex gap-2">
              <span data-testid="admin_communication-page-state-006" className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold whitespace-nowrap ${ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_BADGE[viewLog.type] ?? 'bg-surface-highlight text-text-secondary border-border'}`}>{t(ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_LABEL[viewLog.type] ?? 'WHATSAPP_TYPE_UNKNOWN')}</span>
              <span data-testid="admin_communication-page-state-007" className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold whitespace-nowrap ${ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_BADGE[viewLog.status] ?? 'bg-surface-highlight text-text-secondary border-border'}`}>{t(ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_LABEL[viewLog.status] ?? 'WHATSAPP_STATUS_UNKNOWN')}</span>
            </div>
            <div className="grid-cols-1 sm:grid-cols-2 grid grid-cols-2 gap-4 mb-6 bg-page p-4 rounded-lg">
              {([{ label: t('WHATSAPP_TO'), value: viewLog.phone }, { label: t('WHATSAPP_STUDENT'), value: viewLog.student }, { label: t('WHATSAPP_SENT_AT'), value: viewLog.dateTime }]).map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-border bg-input p-3">
                  <p className="mb-1 text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</p>
                  <p className="text-ui text-text-primary font-medium mt-1">{value}</p>
                </div>
              ))}
            </div>
            <div>
              <p id="admin-communication-message-content-label" className="uppercase tracking-[0.07em] text-text-secondary text-sm font-semibold mb-2 block">{t('WHATSAPP_MESSAGE_CONTENT')}</p>
              <div aria-labelledby="admin-communication-message-content-label" className="bg-page p-4 rounded-lg border border-border text-sm leading-relaxed text-text-primary whitespace-pre-wrap">{viewLog.message}</div>
            </div>
            {viewLog.error && (
              <div className="mt-4 p-3 bg-danger-bg text-danger-text rounded-lg border border-danger-text text-sm font-medium">{t('WHATSAPP_ERROR_PREFIX')} {viewLog.error}</div>
            )}
            <div className="flex-wrap gap-2.5 border-border pt-3 mt-6 flex justify-end">
              <button data-testid="admin_communication-page-control-008" type="button" onClick={() => setViewLog(null)} className="px-4 py-2 bg-page border border-border text-primary rounded hover:bg-surface-hover motion-safe:transition-colors">{t('BUTTON_CLOSE')}</button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="mb-8">
        <div className="mb-1.5 flex items-center gap-1.5 text-badge font-semibold uppercase tracking-[0.07em] text-text-secondary">
          <span>{t('BREADCRUMB_COMMUNICATION')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('WHATSAPP_LOGS_TITLE')}</span>
        </div>
        <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-text-primary">📱 {t('WHATSAPP_LOGS_TITLE')}</h1>
        <p className="mt-1 text-ui text-text-secondary">{isDemoMode ? t('WHATSAPP_LOGS_DEMO_SUBTITLE') : t('WHATSAPP_LOGS_LIVE_SUBTITLE')}</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-card mb-6 p-4 border border-border rounded-lg">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col">
            <label htmlFor="admin-communication-wa-type-filter" className="block uppercase tracking-[0.07em] text-xs mb-1 font-semibold text-text-secondary">{t('WHATSAPP_FILTER_TYPE')}</label>
            <select id="admin-communication-wa-type-filter" data-testid="admin_communication-page-control-009" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="min-h-11 w-full border-border bg-input text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 py-2 px-3 border rounded">
              <option value="All">{t('WHATSAPP_TYPE_ALL')}</option>
              <option value="welcome">{t('WHATSAPP_TYPE_WELCOME')}</option>
              <option value="fee_reminder">{t('WHATSAPP_TYPE_FEE_REMINDER')}</option>
              <option value="receipt">{t('WHATSAPP_TYPE_RECEIPT')}</option>
              <option value="notice">{t('WHATSAPP_TYPE_NOTICE')}</option>
              <option value="renewal">{t('WHATSAPP_TYPE_RENEWAL')}</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="admin-communication-wa-status-filter" className="block uppercase tracking-[0.07em] text-xs mb-1 font-semibold text-text-secondary">{t('WHATSAPP_FILTER_STATUS')}</label>
            <select id="admin-communication-wa-status-filter" data-testid="admin_communication-page-control-010" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="min-h-11 w-full border-border bg-input text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 py-2 px-3 border rounded">
              <option value="All">{t('WHATSAPP_STATUS_ALL')}</option>
              <option value="Pending">{t('WHATSAPP_STATUS_PENDING')}</option><option value="Sent">{t('WHATSAPP_STATUS_SENT')}</option>
              <option value="Delivered">{t('WHATSAPP_STATUS_DELIVERED')}</option><option value="Failed">{t('WHATSAPP_STATUS_FAILED')}</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="admin-communication-wa-date-from" className="block uppercase tracking-[0.07em] text-xs mb-1 font-semibold text-text-secondary">{t('WHATSAPP_FILTER_FROM')}</label>
            <input id="admin-communication-wa-date-from" type="date" className="min-h-11 w-full border-border bg-input text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 py-2 px-3 border rounded" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="admin-communication-wa-date-to" className="block uppercase tracking-[0.07em] text-xs mb-1 font-semibold text-text-secondary">{t('WHATSAPP_FILTER_TO')}</label>
            <input id="admin-communication-wa-date-to" type="date" className="min-h-11 w-full border-border bg-input text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 py-2 px-3 border rounded" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
          <div className="flex-1 flex flex-col flex-grow min-w-50">
            <label htmlFor="admin-communication-wa-log-search" className="block uppercase tracking-[0.07em] text-xs mb-1 font-semibold text-text-secondary">{t('WHATSAPP_FILTER_SEARCH')}</label>
            <input id="admin-communication-wa-log-search" className="min-h-11 border-border bg-input text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 py-2 px-3 border rounded w-full" placeholder={t('WHATSAPP_FILTER_SEARCH_PLACEHOLDER')} value={searchInput} onChange={e => setSearchInput(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden p-4">
        {filtered.length === 0 ? (
          <div data-testid="admin_communication-page-state-011" className="gap-3 py-12 flex flex-col items-center justify-center text-center">
            <div data-testid="admin_communication-page-state-012" className="text-4xl mb-4">📱</div>
            <p data-testid="admin_communication-page-state-013" className="text-lg font-semibold text-text-primary">{isDemoMode ? t('WHATSAPP_LOGS_EMPTY_DEMO') : t('WHATSAPP_LOGS_EMPTY_LIVE')}</p>
          </div>
        ) : (
          <div className="min-w-0 overflow-x-auto rounded-lg border border-border bg-card h-96">
            <DataGrid
                rowData={filtered}
              columnDefs={colDefs}
              rowHeight={56}
              pagination={true}
              pageSize={10}
             page={urlTablePage0} onPageChange={setUrlTablePage0}/>
          </div>
        )}
      </div>
    </div>
  );
}
