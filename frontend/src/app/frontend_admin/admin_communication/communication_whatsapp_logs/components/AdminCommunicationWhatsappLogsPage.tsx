'use client';
// Responsibility: AdminCommunicationWhatsappLogsPage component owned by admin_communication; responsibility folder: admin_communication_components_views.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
// RESPONSIBILITY: Entry page for the admin_communication module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useEffect, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { ChevronRight, Eye, X, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
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

  const { selectedBranch, isAllBranches } = useAdminBranch();
  const visibleLogs = useMemo(() => {
    if (isAllBranches || !selectedBranch) return filtered;
    return filtered.filter((log) =>
      !log.branch || log.branch.toLowerCase().includes(selectedBranch.name.toLowerCase()) || selectedBranch.name.toLowerCase().includes(log.branch.toLowerCase())
    );
  }, [filtered, isAllBranches, selectedBranch]);

  const colDefs: readonly DataGridColumn<AdminCommunicationWhatsappLog>[] = [
    {
      field: 'dateTime',
      headerName: t('WHATSAPP_COLUMN_DATETIME'),
      width: 170,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => (
        <div className="flex h-full items-center">
          <span className="font-mono text-xs text-text-secondary">{p.value}</span>
        </div>
      ),
    },
    {
      field: 'phone',
      headerName: t('WHATSAPP_COLUMN_PHONE'),
      width: 130,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => (
        <div className="flex h-full items-center">
          <span className="font-mono text-xs font-semibold text-text-secondary">{p.value}</span>
        </div>
      ),
    },
    {
      field: 'student',
      headerName: t('WHATSAPP_COLUMN_STUDENT'),
      flex: 1,
      minWidth: 160,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => (
        <div className="flex h-full items-center">
          <div>
            <span className="font-semibold text-text-primary text-sm block">{p.value}</span>
            {p.data.branch && (
              <span className="text-[11px] text-text-secondary block font-medium">{p.data.branch}</span>
            )}
          </div>
        </div>
      ),
    },
    { 
      field: 'type', 
      headerName: t('WHATSAPP_COLUMN_TYPE'),
      width: 140,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => (
        <div className="flex h-full items-center">
          <span data-testid={`admin_communication-whatsapp-type-${p.data.id}`} className={`inline-flex items-center gap-1 rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_BADGE[String(p.value ?? '')] ?? 'bg-surface-muted text-text-secondary border-border'}`}>
            {t(ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_LABEL[String(p.value ?? 'welcome')] ?? 'WHATSAPP_TYPE_UNKNOWN')}
          </span>
        </div>
      )
    },
    { 
      field: 'status', 
      headerName: t('WHATSAPP_COLUMN_STATUS'),
      width: 130,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => (
        <div className="flex h-full items-center">
          <span data-testid={`admin_communication-whatsapp-status-${p.data.id}`} className={`inline-flex items-center gap-1 rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_BADGE[String(p.value ?? '')] ?? 'bg-surface-muted text-text-secondary border-border'}`}>
            {t(ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_LABEL[String(p.value ?? '')] ?? 'WHATSAPP_STATUS_UNKNOWN')}
          </span>
        </div>
      )
    },
    {
      field: 'error',
      headerName: t('WHATSAPP_COLUMN_ERROR'),
      width: 180,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => (
        <div className="flex h-full items-center">
          <span className="text-danger-text text-xs truncate max-w-40 inline-block font-medium" title={typeof p.value === 'string' ? p.value : ''}>
            {typeof p.value === 'string' && p.value.trim() ? p.value : t('WHATSAPP_NO_ERROR')}
          </span>
        </div>
      ),
    },
    {
      headerName: t('WHATSAPP_COLUMN_ACTIONS'),
      width: 100,
      sortable: false,
      cellRenderer: (params: DataGridCellParams<AdminCommunicationWhatsappLog>) => (
        <div className="h-full flex items-center">
          <button
            data-testid={`admin_communication-whatsapp-view-${params.data.id}`}
            type="button"
            onClick={() => setViewLog(params.data)}
            className="inline-flex min-h-[34px] min-w-[34px] items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:bg-primary/20 hover:scale-105 motion-safe:transition-all"
            title={t('WHATSAPP_VIEW_ACTION')}
            aria-label={t('WHATSAPP_VIEW_MESSAGE_FOR', { phone: params.data.phone })}
          >
            <Eye size={16} strokeWidth={2}/>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-page p-6 md:p-8">
      {isDemoMode ? (
        <p role="status" className="sr-only">{t('WHATSAPP_LOGS_DEMO_BANNER')}</p>
      ) : (
        <p role="status" className="sr-only">{t('WHATSAPP_LOGS_LIVE_UNAVAILABLE')}</p>
      )}
      {/* View Message Modal */}
      {viewLog && (
        <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) setViewLog(null); }}>
          <DialogContent className="relative w-full max-w-[540px] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-0 shadow-2xl">
            {/* WhatsApp Brand Header */}
            <div className="bg-[#075e54] px-5 py-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/40 border border-emerald-400/30 text-white font-bold text-base shadow-inner">
                  {viewLog.student ? viewLog.student.charAt(0).toUpperCase() : 'W'}
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-white tracking-tight leading-none">
                    {viewLog.student}
                  </DialogTitle>
                  <DialogDescription className="sr-only">{t('WHATSAPP_LOG_DETAILS_DESCRIPTION')}</DialogDescription>
                  <p className="mt-1 flex items-center gap-2 text-xs text-emerald-100 font-mono">
                    <span>{viewLog.phone}</span>
                    {viewLog.branch && (
                      <span className="rounded bg-black/20 px-1.5 py-0.5 font-sans text-[10px] text-emerald-200">
                        {viewLog.branch}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label={t('WHATSAPP_CLOSE_DETAILS_ARIA')}
                data-testid="admin_communication-page-control-004"
                onClick={() => setViewLog(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={18} strokeWidth={2.5}/>
              </button>
            </div>

            {/* Chat Body & Message Bubble */}
            <div className="relative min-h-[220px] bg-[#0b141a] p-5 space-y-4">
              <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Date Header Pill */}
              <div className="relative flex justify-center">
                <span className="rounded-full bg-slate-800/80 px-3 py-1 text-[11px] font-medium text-slate-400 shadow-sm border border-slate-700/50">
                  {viewLog.dateTime}
                </span>
              </div>

              {/* Sent Bubble */}
              <div className="relative ml-auto max-w-[85%] rounded-2xl rounded-tr-none bg-[#005c4b] p-3.5 text-white shadow-md">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-100 select-text">
                  {viewLog.message}
                </p>
                <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] font-mono text-emerald-200/80">
                  <span>{viewLog.dateTime.split(' ').slice(-2).join(' ')}</span>
                  {viewLog.status === 'Delivered' ? (
                    <span className="text-cyan-400 font-bold" title="Delivered">✓✓</span>
                  ) : viewLog.status === 'Sent' ? (
                    <span className="text-slate-300 font-bold" title="Sent">✓✓</span>
                  ) : viewLog.status === 'Failed' ? (
                    <span className="text-rose-400 font-bold" title="Failed">✕</span>
                  ) : (
                    <span className="text-amber-300 font-bold" title="Pending">⏱</span>
                  )}
                </div>
              </div>
            </div>

            {/* Meta Information Bar */}
            <div className="border-t border-slate-800 bg-slate-950/80 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_BADGE[viewLog.type] ?? 'bg-surface-muted text-text-secondary border-border'}`}>
                    {t(ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_LABEL[viewLog.type] ?? 'WHATSAPP_TYPE_UNKNOWN')}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_BADGE[viewLog.status] ?? 'bg-surface-muted text-text-secondary border-border'}`}>
                    {t(ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_LABEL[viewLog.status] ?? 'WHATSAPP_STATUS_UNKNOWN')}
                  </span>
                </div>
                <button
                  data-testid="admin_communication-page-control-008"
                  type="button"
                  onClick={() => setViewLog(null)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  {t('BUTTON_CLOSE')}
                </button>
              </div>

              {viewLog.error && (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs font-medium text-rose-300">
                  <span className="font-semibold text-rose-400">{t('WHATSAPP_ERROR_PREFIX')}</span> {viewLog.error}
                </div>
              )}
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

      {/* KPI Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Total Messages - Indigo */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 p-5 shadow-lg shadow-indigo-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Messages</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-indigo-500/15 border-indigo-500/30 text-indigo-400">
              <MessageSquare size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white">{visibleLogs.length}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-indigo-300 bg-indigo-500/10 border-indigo-500/25">
              All Dispatches
            </span>
          </div>
        </div>

        {/* Delivered - Emerald */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 p-5 shadow-lg shadow-emerald-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Delivered</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-emerald-500/15 border-emerald-500/30 text-emerald-400">
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
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 p-5 shadow-lg shadow-amber-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-amber-500/10 blur-2xl transition-all duration-500 group-hover:bg-amber-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">In Transit / Sent</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-amber-500/15 border-amber-500/30 text-amber-400">
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
        <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 p-5 shadow-lg shadow-rose-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-rose-500/10 blur-2xl transition-all duration-500 group-hover:bg-rose-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Failed / Bounced</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-rose-500/15 border-rose-500/30 text-rose-400">
              <AlertCircle size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-rose-400">
            {visibleLogs.filter((l) => l.status === 'Failed').length}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-rose-300 bg-rose-500/10 border-rose-500/25">
              Delivery Issues
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md">
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
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md">
        {visibleLogs.length === 0 ? (
          <div data-testid="admin_communication-page-state-011" className="gap-3 py-12 flex flex-col items-center justify-center text-center">
            <div data-testid="admin_communication-page-state-012" className="text-4xl mb-4">📱</div>
            <p data-testid="admin_communication-page-state-013" className="text-lg font-semibold text-text-primary">{isDemoMode ? t('WHATSAPP_LOGS_EMPTY_DEMO') : t('WHATSAPP_LOGS_EMPTY_LIVE')}</p>
          </div>
        ) : (
          <div className="min-w-0 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <DataGrid
              rowData={visibleLogs}
              columnDefs={colDefs}
              rowHeight={56}
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
