'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { Search, LayoutGrid, List, MoreHorizontal, PhoneCall, Upload, Download, Printer, MessageSquare, Send, Mail, CalendarDays, CheckCircle, Clock, Phone, User, Calendar, Users, TrendingUp, UserCheck, Target, XCircle, Trash2, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { ADMIN_ENQUIRIES_ENQUIRY_KANBAN_COLUMNS, ADMIN_ENQUIRIES_ENQUIRY_STATUS_FILTERS, ADMIN_ENQUIRIES_URLS, ADMIN_ENQUIRIES_ENQUIRY_DOT_CLASSES } from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';
import useEnquiriesPage from '@/app/frontend_admin/admin_members/members_enquiries/hooks/useAdminMembersEnquiriesPage';
import AdminEnquiriesTable from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesTable';
import AdminEnquiriesEnquiryKanbanCard from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminEnquiriesEnquiryKanbanCard';
import AdminMembersEnquiriesBulkWhatsAppModal from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesBulkWhatsAppModal';

import AdminEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';
import { buildAdminEnquiriesCsv, downloadAdminEnquiriesExcel, printAdminEnquiriesRoster } from '@/app/frontend_admin/admin_members/members_enquiries/utils/AdminMembersEnquiriesTextUtils';
import type { Enquiry } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import type { AdminEnquiriesEnquiryKanbanCardProps } from '@/app/frontend_admin/admin_members/members_enquiries/types/AdminMembersEnquiriesComponentTypes';

type AdminCrmTimeRange = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

export default function AdminEnquiriesPageView() {
  const t = useTranslations('ADMIN_ENQUIRIES');
  const model = useEnquiriesPage();
  const { router, isDemoMode, view, setView, search, setSearch, statusFilter, setStatusFilter, filtered, setEnquiries } = model;
  const [timeRange, setTimeRange] = useState<AdminCrmTimeRange>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkWhatsAppOpen, setIsBulkWhatsAppOpen] = useState(false);

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    setEnquiries((prev) => prev.filter((e) => !selectedIds.includes(e.id)));
    setSelectedIds([]);
    toast.success(`Successfully deleted ${count} enquiry lead${count > 1 ? 's' : ''}.`);
  };

  const statusLabel = (status: string) => {
    const keys: Record<string, string> = { New: 'STATUS_NEW', Visited: 'STATUS_VISITED', Interested: 'STATUS_INTERESTED', Converted: 'STATUS_CONVERTED', Lost: 'STATUS_LOST' };
    return t(keys[status] ?? 'STATUS');
  };

  const timeFiltered = useMemo(() => {
    if (timeRange === 'all') return filtered;
    return filtered.filter((enq) => {
      if (!enq.addedDate) return true;
      const d = new Date(enq.addedDate);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (timeRange === 'today') { const end = new Date(today); end.setHours(23,59,59,999); return d >= today && d <= end; }
      if (timeRange === 'this_week') { const ws = new Date(today); ws.setDate(today.getDate() - today.getDay()); return d >= ws; }
      if (timeRange === 'this_month') { const ms = new Date(today.getFullYear(), today.getMonth(), 1); return d >= ms; }
      if (timeRange === 'custom') {
        let ok = true;
        if (customStartDate) ok = ok && d >= new Date(customStartDate);
        if (customEndDate) { const ce = new Date(customEndDate); ce.setHours(23,59,59,999); ok = ok && d <= ce; }
        return ok;
      }
      return true;
    });
  }, [filtered, timeRange, customStartDate, customEndDate]);

  const totalLeads = timeFiltered.length;
  const newProspects = timeFiltered.filter((e) => e.status === 'New').length;
  const inPipeline = timeFiltered.filter((e) => ['Visited', 'Interested'].includes(e.status)).length;
  const converted = timeFiltered.filter((e) => e.status === 'Converted').length;
  const conversionRate = totalLeads > 0 ? Math.round((converted / totalLeads) * 100) : 0;
  const colTimeFiltered = (status: Enquiry['status']) => timeFiltered.filter((e) => e.status === status);

  const timeRangeLabel = useMemo(() => {
    return timeRange === 'all' ? 'All Time' : timeRange === 'today' ? 'Today' : timeRange === 'this_week' ? 'This Week' : timeRange === 'this_month' ? 'This Month' : 'Custom Range';
  }, [timeRange]);

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    const allIds = timeFiltered.map((e) => e.id);
    setSelectedIds((prev) => prev.length === allIds.length ? [] : allIds);
  };
  const clearSelection = () => setSelectedIds([]);

  const downloadCsv = () => {
    if (!isDemoMode) { toast.error(t('LIVE_EXPORT_UNAVAILABLE')); return; }
    const blob = new Blob([buildAdminEnquiriesCsv(timeFiltered)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'admin-crm-demo-enquiries.csv'; anchor.hidden = true;
    document.body.append(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(t('EXPORT_SUCCESS', { count: timeFiltered.length }));
  };

  const downloadExcel = () => {
    if (!isDemoMode) { toast.error(t('LIVE_EXPORT_UNAVAILABLE')); return; }
    downloadAdminEnquiriesExcel(timeFiltered, 'admin-crm-enquiries.xls');
    toast.success(`Exported ${timeFiltered.length} enquiries to Excel (.xls)`);
  };

  const whatsappRecipients = useMemo(() => {
    return selectedIds.length > 0 ? timeFiltered.filter((e) => selectedIds.includes(e.id)) : timeFiltered;
  }, [selectedIds, timeFiltered]);

  if (!isFrontendDemoModeEnabled()) {
    return (
      <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6">
        <h1 className="text-section-title font-semibold text-text-primary">{t('CRM_UNAVAILABLE_TITLE')}</h1>
        <p role="status" className="text-warning-text">{t('CRM_UNAVAILABLE_DESC')}</p>
      </section>
    );
  }

  return (
    <div className="w-full space-y-6 text-text-primary pb-10">
      <div role="status" className="sr-only"><span>{t('CRM_DEMO_BANNER')}</span></div>
      <div className="min-w-0 space-y-6 text-text-primary">
        {/* Executive Header */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-5 md:p-6 shadow-lg shadow-black/20">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{t('PAGE_TITLE')}</h1>
              <p className="text-xs sm:text-sm text-slate-400">
                <span>{timeFiltered.length} Active Leads • Track every prospect from enquiry to admission</span> • Range: <span className="font-semibold text-indigo-400">{timeRangeLabel}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-slate-800/80 bg-slate-950/50 p-1.5 shadow-inner">
              <div className="flex items-center rounded-lg bg-slate-900/80 p-1 border border-slate-800/60">
                {(['all', 'today', 'this_week', 'this_month', 'custom'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setTimeRange(r)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      timeRange === r
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {r === 'all' ? 'All Time' : r === 'today' ? 'Today' : r === 'this_week' ? 'This Week' : r === 'this_month' ? 'This Month' : <><Calendar className="h-3 w-3" />Custom</>}
                  </button>
                ))}
              </div>
              {timeRange === 'custom' && (
                <div className="flex items-center gap-1.5 text-xs">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    aria-label="Start date"
                    className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  />
                  <span className="text-slate-500">to</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    aria-label="End date"
                    className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Leads',
              value: totalLeads,
              icon: Users,
              cardBorderBg: 'border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30',
              iconBox: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
              strokeColor: '#22d3ee',
              badgeBg: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-400',
              sub: `All enquiries in ${timeRangeLabel}`
            },
            {
              label: 'New Prospects',
              value: newProspects,
              icon: UserCheck,
              cardBorderBg: 'border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-indigo-950/30',
              iconBox: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
              strokeColor: '#818cf8',
              badgeBg: 'border-indigo-500/30 bg-indigo-500/15 text-indigo-400',
              sub: `Fresh inbound leads (${timeRangeLabel})`
            },
            {
              label: 'In Pipeline',
              value: inPipeline,
              icon: TrendingUp,
              cardBorderBg: 'border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30',
              iconBox: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
              strokeColor: '#fbbf24',
              badgeBg: 'border-amber-500/30 bg-amber-500/15 text-amber-400',
              sub: `Visited + Interested (${timeRangeLabel})`
            },
            {
              label: 'Conversion Rate',
              value: `${conversionRate}%`,
              icon: Target,
              cardBorderBg: 'border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30',
              iconBox: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
              strokeColor: '#34d399',
              badgeBg: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
              sub: `${converted} admitted in ${timeRangeLabel}`
            },
          ].map(({ label, value, icon: Icon, cardBorderBg, iconBox, strokeColor, sub }) => (
            <div
              key={label}
              className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${cardBorderBg}`}
            >
              <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
                <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div className="relative z-10 flex items-start justify-between gap-2">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{label}</span>
                <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs ${iconBox}`}>
                  <Icon size={18} strokeWidth={2.2} />
                </div>
              </div>
              <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">{value}</p>
              <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400 truncate">{sub}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-3 shadow-lg">
          <div className="relative min-w-0 flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" strokeWidth={2} />
            <input
              type="text"
              aria-label={t('SEARCH_ARIA')}
              disabled={!isDemoMode}
              className="min-h-9 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-1.5 pl-9 text-xs text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              placeholder={t('SEARCH_PLACEHOLDER')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            data-testid="admin_enquiries-AdminEnquiriesPageView-control-009"
            aria-label={t('FILTER_ARIA')}
            disabled={!isDemoMode}
            className="min-h-9 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {ADMIN_ENQUIRIES_ENQUIRY_STATUS_FILTERS.map((status) => (
              <option key={status} value={status}>{status === 'All' ? t('ALL_STATUSES') : statusLabel(status)}</option>
            ))}
          </select>
          <div className="inline-flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/60 p-1">
            <button
              data-testid="admin_enquiries-AdminEnquiriesPageView-control-001"
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-all ${
                view === 'kanban' ? 'bg-indigo-500 text-white shadow-xs' : 'hover:text-white hover:bg-slate-800/60'
              }`}
              onClick={() => setView('kanban')}
              title={t('KANBAN_TITLE')}
              aria-label={t('KANBAN_SWITCH')}
              aria-pressed={view === 'kanban'}
            >
              <LayoutGrid size={15} strokeWidth={2} className={view === 'kanban' ? 'text-white' : 'text-indigo-400'} />
            </button>
            <button
              data-testid="admin_enquiries-AdminEnquiriesPageView-control-002"
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-all ${
                view === 'table' ? 'bg-indigo-500 text-white shadow-xs' : 'hover:text-white hover:bg-slate-800/60'
              }`}
              onClick={() => setView('table')}
              title={t('TABLE_TITLE')}
              aria-label={t('TABLE_SWITCH')}
              aria-pressed={view === 'table'}
            >
              <List size={15} strokeWidth={2} className={view === 'table' ? 'text-white' : 'text-indigo-400'} />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {selectedIds.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors"
                  title="Delete selected enquiries"
                >
                  <Trash2 size={13} className="text-rose-400" /> Delete Selected ({selectedIds.length})
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <XCircle size={13} className="text-slate-400" /> Clear ({selectedIds.length})
                </button>
              </>
            )}
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-003" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 hover:bg-amber-500/20 transition-colors disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled title={t('IMPORT_TITLE')}><Upload size={14} strokeWidth={2} className="text-amber-400"/> {t('IMPORT')}</button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-004" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-colors disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled={!isDemoMode || timeFiltered.length === 0} title={isDemoMode ? t('EXPORT_DEMO_TITLE') : t('EXPORT_LIVE_TITLE')} onClick={downloadCsv}><Download size={14} strokeWidth={2} className="text-cyan-400"/> {t('CSV')}</button>
            <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-colors disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled={!isDemoMode || timeFiltered.length === 0} title="Export Excel spreadsheet (.xls)" onClick={downloadExcel}><FileSpreadsheet size={14} strokeWidth={2} className="text-emerald-400"/> Excel</button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-005" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-300 hover:text-white hover:bg-sky-500/20 transition-colors disabled:cursor-not-allowed disabled:opacity-40" type="button" onClick={() => printAdminEnquiriesRoster(timeFiltered)}><Printer size={14} strokeWidth={2} className="text-sky-400"/> {t('PRINT')}</button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-006" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled={timeFiltered.length === 0} title={t('WHATSAPP_TITLE')} onClick={() => setIsBulkWhatsAppOpen(true)}>
              <MessageSquare size={14} strokeWidth={2} className="text-emerald-400"/> {t('WHATSAPP')}
              {selectedIds.length > 0 && <span className="rounded-full bg-emerald-500 text-black px-1.5 py-0.2 text-[10px] font-bold">{selectedIds.length}</span>}
            </button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-007" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-sky-400 hover:text-sky-300 hover:bg-slate-800 transition-colors disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled title={t('TELEGRAM_TITLE')}><Send size={14} strokeWidth={2} className="text-sky-400"/> {t('TELEGRAM')}</button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-008" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled title={t('EMAIL_TITLE')}><Mail size={14} strokeWidth={2} className="text-indigo-400"/> {t('EMAIL')}</button>
          </div>
        </div>

        {/* KANBAN VIEW */}
        {view === 'kanban' && (
          <>
            {!isDemoMode ? (
              <p data-testid="admin_enquiries-AdminEnquiriesPageView-state-live-unavailable" role="status" className="mt-12 rounded-xl border border-warning-bg bg-warning-bg p-4 text-warning-text">{t('LIVE_WARNING')}</p>
            ) : timeFiltered.length === 0 ? (
              <div data-testid="admin_enquiries-AdminEnquiriesPageView-state-010" className="mt-12"><AdminEmptyState showIcon={false} title={t('NO_ENQUIRIES')} description={t('NO_MATCHING_ENQUIRIES')} /></div>
            ) : (
              <div className="grid min-w-0 grid-cols-[repeat(5,minmax(15rem,84vw))] gap-4 overflow-x-auto pb-2 md:grid-cols-[repeat(5,minmax(15rem,1fr))]">
                {ADMIN_ENQUIRIES_ENQUIRY_KANBAN_COLUMNS.map((col) => {
                  const cards = colTimeFiltered(col.id);
                  return (
                    <div key={col.id} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 bg-slate-900/80 p-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className={`h-2 w-2 shrink-0 rounded-full bg-indigo-400 ${ADMIN_ENQUIRIES_ENQUIRY_DOT_CLASSES[col.id]}`} />
                          <span className="truncate text-xs font-bold text-white uppercase tracking-wider">{statusLabel(col.label)}</span>
                          <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-slate-800 px-2 text-[11px] font-bold text-slate-300">{cards.length}</span>
                        </div>
                        <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-013" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-40" title={t('COLUMN_ACTIONS_UNAVAILABLE')} aria-label={t('COLUMN_OPTIONS')} disabled><MoreHorizontal size={16} strokeWidth={2}/></button>
                      </div>
                      <div className="flex min-h-40 flex-col gap-3 p-3">
                        {cards.length === 0 ? (
                          <div data-testid="admin_enquiries-AdminEnquiriesPageView-state-014" className="rounded-xl border border-dashed border-slate-800/80 p-4 text-center">
                            <PhoneCall size={18} strokeWidth={2} className="mx-auto text-slate-500 mb-2"/>
                            <p data-testid="admin_enquiries-AdminEnquiriesPageView-state-015" className="text-xs font-medium text-slate-300">{t('NO_STATUS_LEADS', { status: statusLabel(col.label) })}</p>
                            <p data-testid="admin_enquiries-AdminEnquiriesPageView-state-016" className="mt-1 text-[11px] text-slate-500">{t('LEADS_MOVE_HINT', { status: statusLabel(col.label) })}</p>
                          </div>
                        ) : (
                          cards.map((enq) => (
                            <AdminEnquiriesEnquiryKanbanCard key={enq.id} enq={enq} colClass={col.cardClass} onClick={() => router.push(ADMIN_ENQUIRIES_URLS.ENQUIRY_DETAIL(enq.id))} />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* TABLE VIEW */}
        {view === 'table' && (
          isDemoMode ? (
            <AdminEnquiriesTable
              enquiries={timeFiltered}
              selectedIds={selectedIds}
              onToggleSelectOne={toggleSelectOne}
              onToggleSelectAll={toggleSelectAll}
              onSelectEnquiry={(enquiry) => router.push(ADMIN_ENQUIRIES_URLS.ENQUIRY_DETAIL(enquiry.id))}
            />
          ) : (
            <p role="status" className="mt-12 rounded-lg border border-warning-bg bg-warning-bg p-4 text-warning-text">{t('TABLE_UNAVAILABLE')}</p>
          )
        )}
      </div>

      {/* Bulk WhatsApp Queue Dialog */}
      <AdminMembersEnquiriesBulkWhatsAppModal
        isOpen={isBulkWhatsAppOpen}
        onClose={() => setIsBulkWhatsAppOpen(false)}
        enquiries={whatsappRecipients}
      />
    </div>
  );
}

export { AdminEnquiriesEnquiryKanbanCard };
export type { AdminEnquiriesEnquiryKanbanCardProps };
